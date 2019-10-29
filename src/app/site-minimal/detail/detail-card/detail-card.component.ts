import { Component, OnInit, Input, EventEmitter, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';

import { RecordCard, SubCard, CardGraph, BreadcrumbItem } from '../../recordcard.model';

import { GraphUtils, CardHelper }       from '../../recordcard-helper';

import { SiteMinimalController } from '../../minimal.controller';
import { HighlightService } from '../../minimal-highlighter.service';

import { gldef } from '../../../develar-commons/develar.config';

const BROWSE = 'lista';

const breadcrumb: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    link: '/',
    icon: 'fa fa-home'
  },
  {
    title: 'Comunidad',
    link: '/',
    icon: 'fa fa-user-circle'
  },
  {
    title: 'Publicaciones',
    link: '/',
    icon: 'fa fa-book'
  },

];



@Component({
  selector: 'detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss']
})
export class DetailCardComponent implements OnInit {
	@Input() customalign: string = 'center';
  @Input() title: string;

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

  private modelScrptn;
  private breadcrumb: BreadcrumbItem[] = breadcrumb;
  private isPrismed = false;


  constructor(
  		private minimalCtrl: SiteMinimalController,
      private hlSrv: HighlightService,
      private router: Router,
  		private route: ActivatedRoute
  	) {

  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id')

    this.minimalCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url)
    this.buildBreadCrumb();

    this.modelScrptn = this.minimalCtrl.recordCardListener.subscribe(model =>{
      this.initCardData(model);
    })

    this.minimalCtrl.fetchRecordCard(this.model, id);
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
    this.model = entity;
   


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

    }else{      
      this.personList = GraphUtils.buildGraphList('person',persons);
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

  goToBrowse(){
    this.router.navigate(['../'], {relativeTo: this.route});

  }

  buildBreadCrumb(){
    this.breadcrumb[0].link = this.minimalCtrl.communityRoute;
    this.breadcrumb[1].link = this.minimalCtrl.communityRoute;
    this.breadcrumb[2].link = this.minimalCtrl.publicationRoute;
  }


}
