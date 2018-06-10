import { Component, OnInit, OnChanges, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { WorkGroupController } from '../workgroup.controller';
import { RecordCardService }   from '../../bookshelf.service';
import { RecordCard, SubCard, SelectData, cardHelper } from '../../recordcard';
import { Subject } from 'rxjs';


@Component({
  selector: 'project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit, OnChanges {
	@Input() customalign: string = 'center';
  @Input() title: string;

  private currentModel: RecordCard;
  private currentSubcardList;

  private selectedMilestone = "";

  private showView: boolean = true;
  private showProducts: boolean = false;
  private showReferences: boolean = false;


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
    this.initSubCardData(models);
    this.currentSubcardList = models;
  }
  get relatedcards(){
    return this.currentSubcardList;
  }

  private models: RecordCard[];
  private subcards: SubCard[];

  private subscription01;

  constructor(
  		private route: ActivatedRoute,
  		private workgroupCtrl: WorkGroupController,
      private router: Router
  	) {

  }

  ngOnDestroy(){
    console.log('PROJECT-DASHBOARD: noOnDestroy')
    this.subscription01.unsubscribe()

  }

  ngOnChanges(){
    console.log('********** ngOnChanges;')
  }

  ngOnInit() {
    console.log('****** proyect dashboard *********** ')
    let id = this.route.snapshot.paramMap.get('id')
    this.workgroupCtrl.currentView = 'view';

    this.subscription01 = this.workgroupCtrl.modelListener.subscribe(model =>{
      model.carrousel = cardHelper.buildCarrousel(model.slug, model, 0);
      this.initCardData(model);
      this.model = model;
    })

    this.workgroupCtrl.initRecordCardEdit(this.model, id);

  }

  milestoneChange(val){
    this.selectedMilestone = val;
  }

  goToBrowse(){
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  initCardData(entity: RecordCard){
    this.currentSubcardList = cardHelper.buildRelatedCards(entity);
    entity.carrousel = cardHelper.buildCarrousel(entity.slug, entity, 0);
    this.initSubCardData(this.currentSubcardList );
  }

  initSubCardData(smodels: SubCard[]){
    smodels.forEach(card => {
      card.carrousel = cardHelper.buildCarrousel(card.slug, card, 0);
    });
  }

  navigationChange(target){
    console.log('dashboard ****** navigation changed: [%s]', target);
    this.toggleView(target);

    if(target === 'products'){
       console.log('Navigate Products: [%s]', target);
       this.router.navigate(['./', 'productos'], {relativeTo: this.route});
    }else if(target === 'view'){
       console.log('Navigate View: [%s]', target);
      this.router.navigate(['./'],{relativeTo: this.route});
    }else {
      console.log('Navigate Default: [%s]', target);
      this.router.navigate(['./'],{relativeTo: this.route});
    }
    
  }

  toggleView(view){
    this.showProducts = (view === 'products');
    this.showView = (view === 'view');
    this.showReferences = (view === 'references');
  }

}
