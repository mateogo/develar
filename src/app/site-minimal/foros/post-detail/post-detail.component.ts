import { Component, OnInit, Input, EventEmitter, AfterViewChecked } from '@angular/core';

import { RecordCard, SubCard, CardGraph, BreadcrumbItem } from '../../recordcard.model';

import { GraphUtils, CardHelper }       from '../../recordcard-helper';

import { SiteMinimalController } from '../../minimal.controller';
import { HighlightService } from '../../minimal-highlighter.service';

import { gldef } from '../../../develar-commons/develar.config';

@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

	@Input() customalign: string = 'center';
  @Input() title: string = "";

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
  

  private currentModel: RecordCard;
  private currentSubcardList: SubCard[];

  private showAssets = false;
  private showResources = false;

  public avatar = gldef.logoAvatar;

	private modelId: string;
  private models: RecordCard[];
  private personList: CardGraph[];
  private assetList: CardGraph[];
  private resourceList: CardGraph[];
  private tagList: Array<string>;
  public  mainImageUrl: string;
	public post_author = ''

  private modelScrptn;
  private isPrismed = false;
  public carrousel = [];

  public hasExcerpt = false;
  public showExcerpt = false;
  public showDescription = true;

  public isFooter = true;

  constructor(
  		private minimalCtrl: SiteMinimalController,
      private hlSrv: HighlightService,
  	) {

  }

  //http://develar-local.co:4200/red/mujeres/5c189e465063c40dc9f92892

  ngOnInit() {

    this.initCardData(this.model)

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
    this.buildCarrousel(entity.viewimages);

    if(entity.excerpt){
      this.showExcerpt = true;
      this.showDescription = false;
      this.hasExcerpt = true;

    }else{
      this.showExcerpt = false;
      this.showDescription = true;
      this.hasExcerpt = false;

    }

    this.model = entity;



  }

  fetchMainImage(images){
    let image = images.find(img => img.predicate === 'featureimage') || images.find(img => img.predicate === 'mainimage');

    if(image){
      this.mainImageUrl = '/download/' + image.entityId;
    }else{
      this.mainImageUrl = '';
    }

  }

  buildCarrousel(images){
    this.carrousel = [];
    let image = images.forEach(img => {
      if(img.predicate === 'images'){
        img.url = '/download/' + img.entityId;
        this.carrousel.push(img);
      }
    });

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

  showMore(e){
    e.stopPropagation();
    e.preventDefault();
    this.showExcerpt = false;
    this.showDescription = true;
  }

  showLess(e){
    e.stopPropagation();
    e.preventDefault();

    if(this.hasExcerpt){
      this.showExcerpt = true;
      this.showDescription = false;

    }else{
      this.showExcerpt = false;
      this.showDescription = false;
    }
  }


}
