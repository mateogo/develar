import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { WorkGroupController } from '../workgroup.controller';

import { RecordCard, SubCard, SelectData, cardHelper } from '../../recordcard';
import { Observable } from 'rxjs';

@Component({
  selector: 'project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit {
	@Input() customalign: string = 'center';
  @Input() title: string;

  @Output() milestoneEmitted = new EventEmitter<string>();
  @Output() buttonViewEmitted = new EventEmitter<string>();


  private navigationSelected: string;
  private currentModel: RecordCard;
  private navoptions;

  private modelListener: Observable<RecordCard>;
  private milestoneSelected = "";
  private milestones:Array<SelectData> = [];

  private showView: boolean = true;
  private showAssets: boolean = false;
  private showReferences: boolean = false;

  @Input()
  set model(entity: RecordCard){
    this.currentModel = entity;
  }
  get model(){
    return this.currentModel;
  }

  // ver modelinteraction
  
  private models: RecordCard[];

  constructor(
  		private workgroupCtrl: WorkGroupController,
  	) {
  }

  ngOnInit() {
    this.model = this.workgroupCtrl.actualModel;
    this.initCardData(this.model);

    this.buttonViewEmitted.emit(this.navigationSelected);
    this.milestoneEmitted.emit(this.milestoneSelected);
  }

  initCardData(entity: RecordCard){
    this.navoptions = this.workgroupCtrl.navoptions;
    this.milestones = cardHelper.buildAggregateSelect(entity);
    //console.log('initCardData: [%s] [%s] wgrp:[%s] ',this.milestones.length, this.milestones[1].val, this.workgroupCtrl.milestone);
    this.navigationSelected = this.workgroupCtrl.currentView;
    this.milestoneSelected = this.workgroupCtrl.milestone || this.milestones[1].val;
  }

  changeMilestone(val:string ){
    this.workgroupCtrl.milestone = val;
    this.milestoneEmitted.emit(val);
  }

  navigationChange(event: MatButtonToggleChange){
    this.navigationSelected = event.value;
    this.buttonViewEmitted.emit(event.value);
  }

}
