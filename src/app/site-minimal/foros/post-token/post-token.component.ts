import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';

import { RecordCard, SubCard, CardGraph, BreadcrumbItem } from '../../recordcard.model';

import { GraphUtils, CardHelper }       from '../../recordcard-helper';

import { SiteMinimalController } from '../../minimal.controller';

import { HighlightService } from '../../minimal-highlighter.service';

import { gldef } from '../../../develar-commons/develar.config';

@Component({
  selector: 'post-token',
  templateUrl: './post-token.component.html',
  styleUrls: ['./post-token.component.scss']
})
export class PostTokenComponent implements OnInit {


	@Input() customalign: string = 'center';
  @Input() title: string = "";
  @Input() imageType: string ="mainimage";
  @Input() viewMode: string = "colMode"


  @Input()
  set model(entity: RecordCard){
    this.currentModel = entity;
  }
  get model(){
    return this.currentModel;
  }

  @Input()
  set relatedcards(models: SubCard[]){
    this.initSubCardData(models);
    this.currentSubcardList = models;
  }
  get relatedcards(){
    return this.currentSubcardList;
  }
  @Output() detailView = new EventEmitter<RecordCard>();
  

  private currentModel: RecordCard;
  private currentSubcardList: SubCard[];

  private showAssets = false;
  private showResources = false;

  public isFullWidth = false;

  public avatar = gldef.logoAvatar;
  public mainImageUrl = ''
  public post_author = ''

	private modelId: string;
  private models: RecordCard[];
  private personList: CardGraph[];
  private assetList: CardGraph[];
  private resourceList: CardGraph[];
  private tagList: Array<string>;

  private modelScrptn;
  private isPrismed = false;
  public postName = {};
  public postAuthor = {};



  constructor(
  		private minimalCtrl: SiteMinimalController,
      private hlSrv: HighlightService,
  	) {

  }

  ngOnInit() {
    if(this.viewMode === "fullWidth"){      
      this.isFullWidth = true;
      this.postName = {
        'text-align': 'center',
        'font-size': '1.4em'
      }
     this.postAuthor = {
        'text-align': 'center',
        'font-size': '1em'
      }

    }else{
      this.isFullWidth = false;
      this.postName = {
        'text-align': 'left',
        'font-size': '1.2em'
      }
      this.postAuthor = {
        'text-align': 'left',
        'font-size': '0.7em'
      }

    }

    this.initCardData(this.model);

  //   this.modelScrptn = this.minimalCtrl.recordCardListener.subscribe(model =>{
  //     this.initCardData(model);
  //   })

  //   this.minimalCtrl.fetchRecordCard(this.model, id);

  }  

  postDetail(e){
    e.stopPropagation();
    e.preventDefault();
    this.detailView.emit(this.model);
  }


  /**
   * Highlight blog post when it's ready
   */
  ngAfterViewChecked() {
    if(this.model && !this.isPrismed){
      this.hlSrv.highlightAll();
      this.isPrismed = true;
    }
  }

  initCardData(entity: RecordCard){
    //this.currentSubcardList = CardHelper.buildRelatedCards(entity);
    //this.initSubCardData(this.currentSubcardList );

    entity.carrousel = CardHelper.buildCarrousel(entity.slug, entity, 0);
    this.loadRelatedPersons(entity.persons);
    this.loadRelatedAssets(entity.assets);
    this.loadRelatedResources(entity.resources);
    this.loadRelatedTags(entity.taglist);
    this.loadRelatedCards(entity.relatedcards);

    this.fetchMainImage(entity.viewimages);

    this.model = entity;

  }

  fetchMainImage(images){
    let image;
    if(this.imageType === 'mainimage'){
      image = images.find(img => img.predicate === 'mainimage') || images.find(img => img.predicate === 'featureimage');

    }else if(this.imageType === 'featureimage'){
      image = images.find(img => img.predicate === 'featureimage') || images.find(img => img.predicate === 'mainimage');
    }

    if(image){
      this.mainImageUrl = '/download/' + image.entityId;
    }else{
      this.mainImageUrl = '';
    }

  }

  tryPrism(record: RecordCard){

  }


  initSubCardData(smodels: SubCard[]){
    smodels.forEach(card => {
      card.carrousel = CardHelper.buildCarrousel(card.slug, card, 0);
    });
  }

  loadRelatedPersons(persons: CardGraph[]) {
    if(!persons.length){
      this.personList = [];
      this.post_author = "";

    }else{      
      this.personList = GraphUtils.buildGraphList('person',persons);
      this.post_author = GraphUtils.fetchAuthorString(this.personList);
    }
  }

  loadRelatedResources(resources: CardGraph[]) {
    if(!resources.length){
      this.resourceList = [];

    }else{      
      this.resourceList = GraphUtils.buildGraphList('resource',resources);
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

  loadRelatedCards(smodels: SubCard[]) {
    if(!smodels.length){
      this.relatedcards = [];

    }else{      
      this.relatedcards = CardHelper.buildSubCardArray(smodels);
    }
  }

  loadRelatedAssets(assets: CardGraph[]) {
    this.assetList = [];

    if(assets && assets.length){
      this.assetList = GraphUtils.assetShowList('asset', assets);
    }

    if(this.assetList.length) this.showAssets = true;
    else this.showAssets = false;
  }


}
