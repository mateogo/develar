import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';

import { RecordCardService } from '../bookshelf.service';

import { CardGraph, graphUtilities }       from '../cardgraph.helper';
import { RecordCard, SubCard, cardHelper } from '../recordcard';
import { gldef } from '../../develar-commons/develar.config';

const BROWSE = 'lista';

@Component({
  selector: 'app-unitcardview',
  templateUrl: './unitcardview.component.html',
  styleUrls: ['./unitcardview.component.scss']
})
export class UnitcardviewComponent implements OnInit {
	@Input() customalign: string = 'center';
  @Input() title: string;
  @Input() isAdmin = false;

  public showAssets = false;
  public showResources = false;

  public avatar = gldef.logoAvatar;
  public assetList: CardGraph[];
  public resourceList: CardGraph[];


  private currentModel: RecordCard;
  private currentSubcardList;

  

  @Input()
  set model(entity: RecordCard){
    entity.carrousel = cardHelper.buildCarrousel(entity.slug, entity, 0);
    this.currentModel = entity;
  }
  get model(){
    return this.currentModel;
  }

  @Input()
  set relatedcards(models: SubCard[]){
    console.log('Set SubCard models:[%s]', models.length);
    this.initSubCardData(models);
    this.currentSubcardList = models;
  }
  get relatedcards(){
    return this.currentSubcardList;
  }

  // ver modelinteraction
  
	private modelId: string;
	//private model: RecordCard;
  private models: RecordCard[];
  private personList: CardGraph[];
  private tagList: Array<string>;


  constructor(
  		private route: ActivatedRoute,
      private cardService: RecordCardService,
      private router: Router
  	) {

  }

  fetchCurrentCard(id){
    console.log('unicardview fetchcurrentcard: [%s]', id)

    this.modelId = id;
    this.cardService.getRecordCard(this.modelId)
      .then(entity => {
        if(!entity)
          console.log('aiudddaaaa');
        else {
          entity.carrousel = cardHelper.buildCarrousel(entity.slug, entity, 0);
          this.model = entity
          this.initCardData(entity);
        }
      })
      .catch(err => console.log(err));
  }

  ngOnInit() {
    if(!this.model){
      this.fetchCurrentCard(this.route.snapshot.paramMap.get('id'));
    }else{
      this.initCardData(this.model);
    }
  }

  initCardData(entity: RecordCard){
    //this.currentSubcardList = cardHelper.buildRelatedCards(entity);
    //this.initSubCardData(this.currentSubcardList );
    this.modelId = entity._id;

    entity.carrousel = cardHelper.buildCarrousel(entity.slug, entity, 0);
    this.loadRelatedPersons(this.model.persons);
    this.loadRelatedAssets(this.model.assets)
    this.loadRelatedResources(this.model.resources)
    this.loadRelatedTags(this.model.taglist)

  }

  initSubCardData(smodels: SubCard[]){
    console.log("INIT-sub-CARD-DATA [%s]", smodels.length);
    smodels.forEach(card => {
      card.carrousel = cardHelper.buildCarrousel(card.slug, card, 0);
    });
  }

  loadRelatedPersons(persons: CardGraph[]) {
    if(!persons.length){
      this.personList = [];

    }else{      
      this.personList = graphUtilities.buildGraphList('person',persons);
    }
  }

  loadRelatedResources(resources: CardGraph[]) {
    if(!resources.length){
      this.resourceList = [];

    }else{      
      this.resourceList = graphUtilities.buildGraphList('resource',resources);
    }

    if(this.resourceList.length) this.showResources = true;
    else this.showResources = false;


  }

  loadRelatedTags(tags: Array<string>) {
    if(!tags.length){
      this.tagList = [];

    }else{      
      this.tagList = tags;
    }
  }

  loadRelatedAssets(assets: CardGraph[]) {
    if(!assets.length){
      this.assetList = [];

    }else{      
      this.assetList = graphUtilities.buildGraphList('asset', assets);
    }
   if(this.assetList.length) this.showAssets = true;
    else this.showAssets = false;
 
   }

  goToBrowse(){
    //this.router.navigate(['./' ], {relativeTo: this.route});
    this.router.navigate(['/develar/fichas' ]);
  }

  goToDetail(){
    this.router.navigate(['./', this.modelId ], {relativeTo: this.route});
  }
  editCard(){
    this.router.navigate(['/develar/fichas/editar', this.modelId]);
  }

}


//https://drive.google.com/open?id=0B5bRCpsEkqL9RzBmVFZybEtJT2c
//  <img md-card-image src="https://farm5.staticflickr.com/4345/36665181953_b243e49667_z.jpg">
// <iframe width="560" height="315" src="https://youtube.com/embed/t2WRn4VFeV0" frameborder="0" allowfullscreen>
// </iframe>