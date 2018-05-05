import { Component, OnInit, EventEmitter }        from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap }   from '@angular/router';
import { CustomValidators }         from 'ng2-validation';
import { Subject }                  from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';

import { RecordCard, SubCard, cardHelper, PublicationConfig }    from '../recordcard';
import { Asset }                              from '../../develar-commons/develar-entities';

import { RecordCardService }              from '../bookshelf.service';
import { UserService }                    from '../../entities/user/user.service';
import { DaoService }                     from '../../develar-commons/dao.service';
import { User }                           from '../../entities/user/user';
import { Community }                      from '../../develar-commons/community/community.model';
import { CardGraph, graphUtilities }      from '../cardgraph.helper';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { GenericDialogComponent }  from '../../develar-commons/generic-dialog/generic-dialog.component';

function initForSave(form: FormGroup, model: RecordCard, smodels:SubCard[], persons:CardGraph[], resources:CardGraph[], assets: CardGraph[], images: CardGraph[], tags: Array<string>, publish: PublicationConfig, user: User, communities: Array<Community>): RecordCard {

	const fvalue = form.value;
	const entity = model;

	entity.slug = fvalue.slug;
  entity.subtitle = fvalue.subtitle;
  entity.cardId = fvalue.cardId;
	entity.description = fvalue.description;
  entity.images = cardHelper.buildImageList(fvalue.images);
  entity.mainimage = fvalue.mainimage;
  entity.cardType = fvalue.cardType;
  entity.topic = fvalue.topic;
  entity.cardCategory = fvalue.cardCategory;

  entity.relatedcards = smodels;
  entity.resources = resources;
  entity.persons = persons;
  entity.assets = assets;

  entity.viewimages = images;
  images.forEach(image => {
    if(image.predicate === 'mainimage')
      entity.mainimage = '/download/' + image.entityId;
  })
  let carrousel = images.filter(image => image.predicate === 'images').map(img => 'download/' + img.entityId);
  if(carrousel && carrousel.length){
    entity.images = carrousel;
  }  


  entity.taglist = tags;
  if(communities && communities.length){
    entity.communitylist = communities.map(token => token._id);
  }

  entity.userId = user._id;
  entity.user = user.username;
  entity.publish = publish;

	return entity;
};

function initForPromote(smodel: SubCard): RecordCard{
  return cardHelper.promote(smodel);
}

@Component({
  selector: 'app-unitcardedit',
  templateUrl: './unitcardedit.component.html',
  styleUrls: ['./unitcardedit.component.scss'],
  providers: [GenericDialogComponent]
})
export class UnitcardeditComponent implements OnInit {
  private pageTitle: string = 'Edición de ficha';
  
	public model: RecordCard;
  private modelId: string;

	public cardtypes = cardHelper.cardTypes;
  public cardcategories = cardHelper.cardCategories;

  public openSubCardEditor = false;
  public relatedcards: SubCard[];
  public showrelatedcards = false;

  // valores default para el medium-editor para campo descripción
  public meContent: string = '';
  public mePlaceholder: string = 'Descripción';

  public personList: CardGraph[];
  public assetList: CardGraph[];
  public imageList: CardGraph[];
  public resourceList: CardGraph[];
  public tagList: Array<string>;
  public communityList: Array<Community>;
  public addResourceToList = new Subject<CardGraph>();
  public addAssetToList = new Subject<CardGraph>();
  public addImageToList = new Subject<CardGraph>();
  public parentCol = 'fichas';
  public publish: PublicationConfig;

  smodel: SubCard;
  form: FormGroup;
  selectedOption: SubCard;

  constructor(
  	private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private userService: UserService,
		private cardService: RecordCardService,
    private daoService: DaoService
  	) {
			this.form = this.fb.group({
        cardId:       [null, Validators.compose([Validators.required])],
    		slug:         [null, Validators.compose([Validators.required])],
        subtitle:     [null, Validators.compose([Validators.required])],
    		cardType:     [null],
        topic:        [null],
        cardCategory: [null],
    		description:  [null, Validators.compose([Validators.required])],
        mainimage:    [null],
        images:       [null]
  	  });
      //const relatedcards = [cardHelper.initSubCard({slug: 'SUB CONTENIDO'})];
      //this.form.setControl('relatedcards', this.fb.array(relatedcards.map(card => this.fb.group(card))));
      this.smodel = new SubCard('Sub ficha');


  }

	fetchCurrentCard(id){
	  this.modelId = id;
	  this.cardService.getRecordCard(this.modelId)
	    .then(entity => {
	      if(!entity)
	        console.log('aiudddaaaa');
	      else {
	        this.model = entity
					this.form.reset({
            cardId:       this.model.cardId,
					  slug:         this.model.slug,
            subtitle:     this.model.subtitle,
					  cardType:     this.model.cardType || "ficha",
            topic:        this.model.topic || "general",
            cardCategory: this.model.cardCategory|| 'documento',
					  description:  this.model.description,
					  mainimage:    this.model.mainimage,
            images:       cardHelper.buildImageString(this.model.images)
					});
          // ToDo seguir la variable relatecards
          this.loadRelatedCards(this.model.relatedcards);
          this.loadRelatedPersons(this.model.persons);
          this.loadRelatedAssets(this.model.assets);
          this.loadRelatedImages(this.model.viewimages);
          this.loadRelatedResources(this.model.resources);
          this.loadRelatedTags(this.model.taglist);
          this.loadRelatedCommunities(this.model.communitylist);
          this.loadPublishData(this.model.publish);
          this.changeCardType();          
	      }
	    })
	    .catch(err => console.log(err));
	}

  ngOnInit() {

    this.route.paramMap.map((params: ParamMap) =>{
      let id = params.get('id');
      return id;
    })
    .subscribe(id => {
      this.fetchCurrentCard(id);
    })

  }

      //this.fetchCurrentCard(params.get('id')))

 

  /******** SAVING-CANCEL A C T I O N S  ******/
  editSave() {
    this.model = initForSave(this.form, this.model, this.relatedcards, this.personList, this.resourceList, this.assetList,  this.imageList, this.tagList, this.publish, this.userService.currentUser, this.communityList);
    return this.cardService.update(this.model).then((model) =>{
        this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
        return model;
      });

  }

  closeEditor(){
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  editSaveClose() {
    this.editSave().then(model => {
      this.closeEditor()
      });
  }

  contentEditor(){
    this.router.navigate(['../../contenido', this.modelId], {relativeTo: this.route});
  }

  editCanel(){
    this.closeEditor()
  }

  loadNext(direction){
    let query;
    if(direction === 'next'){
      query = {
        gtid: this.model.cardId,
        select: '_id',
        sort: 1
      }

      this.daoService.fetch<RecordCard>('recordcard','fetchnext', query).subscribe((list: RecordCard[]) => {
        if(list && list.length){
          this.router.navigate(['../',list[0]._id], {relativeTo: this.route});
        }
      });

    }else if(direction === 'previous'){
      query = {
        ltid: this.model.cardId,
        select: '_id',
        sort: -1
      }

      this.daoService.fetch<RecordCard>('recordcard','fetchnext', query).subscribe((list: RecordCard[]) => {
        if(list && list.length){
          this.router.navigate(['../',list[0]._id], {relativeTo: this.route});
        }
      });

    }
  }

	showPreview(){
  	this.model = initForSave(this.form, this.model, this.relatedcards, this.personList, this.resourceList, this.assetList, this.imageList, this.tagList, this.publish, this.userService.currentUser, this.communityList);
	}

  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,
    });
    snck.onAction().subscribe((e)=> {
      //console.log('action???? [%s]', e);
    })
  }

  updateSelCommunities(communities: Community[]){
    this.communityList = communities;
  }

 /******** END A C T I O N S  ******/
 
  changeCardType(){
    this.cardcategories = cardHelper.getCategories(this.form.value.cardType);
  }

  addSubCard(){
    this.smodel = new SubCard('Sub ficha'); 
    this.openSubCardEditor = true;
  }

  editSubCard(card: SubCard){
    if(!card) return;
    this.smodel = card;
    this.openSubCardEditor = true;
  }

  // Cards
  editRelatedCard(smodel: SubCard){
    //console.log('UnitcardEdit: EditRelatedCard [%s]', smodel.slug);
  };

  publishListener(pub: PublicationConfig){
    this.publish = pub;
  }

  promoteRelatedCard(smodel: SubCard){
    let card: RecordCard = initForPromote(smodel);
    card.parent = this.model._id;
    card.communitylist = this.model.communitylist;
    this.cardService.promote(card)
      .then(model => {
      });    
  };

  descriptionUpdateContent(content){
    //console.log("BUBBBBBLED: [%s]", content);
  }
  
  updateTags(tags: Array<string>){
    this.tagList = tags;
  }

  addRelatedCard(smodel:SubCard){
    smodel.carrousel = cardHelper.buildCarrousel(smodel.slug, smodel, 0);
    this.openSubCardEditor = false;
    this.relatedcards.push(smodel);
    this.showrelatedcards = true;


/*    const cardFG = this.fb.group(cardHelper.initSubCard({slug:'SUB CONTENIDO', cardType: 'subficha'}));
    const formArray = this.form.get('relatedcards') as FormArray;
    formArray.push(cardFG);*/

  }


  createCardGraphFromGoogle(data){
    let card = graphUtilities.cardGraphFromGoogleSearch('resource', data, 'enlace');
    this.addResourceToList.next(card);
  }

  createCardGraphFromAsset(asset){
    let card = graphUtilities.cardGraphFromAsset('asset', asset, 'documento');
    this.addAssetToList.next(card);
  }

  createCardGraphFromImage(image){
    let card = graphUtilities.cardGraphFromAsset('image', image, 'mainimage');
    this.addImageToList.next(card);
  }



/*  get relatedcards(): FormArray {
    return this.form.get('relatedcards') as FormArray;
  };*/
  loadRelatedResources(resources: CardGraph[]) {
    if(!resources.length){
      this.resourceList = [];

    }else{
      this.resourceList = graphUtilities.buildGraphList('resource',resources);
    }
  }

  loadRelatedTags(tags: Array<string>) {
    if(!tags.length){
      this.tagList = [];

    }else{ 
      this.tagList = tags;
    }
  }

  loadRelatedCommunities(list: Array<string>) {
    if(list && list.length){

      this.daoService.search<Community>('community', {_id: list}).subscribe((list: Community[]) => {
        this.communityList = list;
      });

    }else{
      this.communityList = [];      
    }
  }
  loadPublishData(publish: PublicationConfig){
    if(publish) {
      this.publish = publish;
    }else{
      this.publish = new PublicationConfig();      
    }
  }

  loadRelatedAssets(assets: CardGraph[]) {
    if(!assets.length){
      this.assetList = [];

    }else{      
      this.assetList = graphUtilities.buildGraphList('asset', assets);
    }
  }

  loadRelatedImages(viewimages: CardGraph[]) {
    if(!viewimages.length){
      this.imageList = [];

    }else{      
      this.imageList = graphUtilities.buildGraphList('image', viewimages);
    }
  }


  loadRelatedPersons(persons: CardGraph[]) {
    if(!persons.length){
      this.personList = [];

    }else{      
      this.personList = graphUtilities.buildGraphList('person',persons);
    }
  }

  loadRelatedCards(smodels: SubCard[]) {
    if(!smodels.length){
      this.relatedcards = [];
      this.showrelatedcards = false;

    }else{      
      this.relatedcards = cardHelper.buildSubCardArray(smodels);
      this.showrelatedcards = true;
    }





/*    relatedcards.forEach(item => {
      item.topic = item.topic || 'general';
    })
    const cardsFGs = relatedcards.map(card => this.fb.group(card));
    const cardsFormArray = this.fb.array(cardsFGs);
    console.log('cardsFormArray:[%s]', cardsFormArray ? true : false)
    this.form.setControl('relatedcards', cardsFormArray);*/

  }

/*  removeRelatedCard(item){
    const formArray = this.form.get('relatedcards') as FormArray;
    console.log('items: [%s]  item[%s]', formArray.length, item);
    formArray.removeAt(item);
  }*/

}


/**
      <md-form-field>
        <textarea mdInput 
                  mdTextareaAutosize
                  mdAutosizeMaxRows="10"
                  [formControl]="form.controls['description']" placeholder="Descripción">

        </textarea>
        <small *ngIf="form.controls['description'].hasError('required') && 
           form.controls['description'].touched" class="form-message text-danger">
           Dato requerido</small>
      </md-form-field>
**/
