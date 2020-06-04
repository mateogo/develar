import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {  Task, Audit, ParentEntity } from '../tasks.model';
import {  TasksController } from '../tasks.controller';
import { 	UpdateTaskEvent, TasksHelper } from '../tasks.helper';

const UPDATE = 'update';
const DELETE = 'delete';
const NAVIGATE = 'navigate';
const SELECT = 'select';

const TOKEN_TYPE = 'task';

const BG_COLOR_DEFAULT = "#ffffff";
const BG_COLOR_SELECTED = "#f2eded"; //75787B //0645f5



@Component({
  selector: 'tasks-base',
  templateUrl: './tasks-base.component.html',
  styleUrls: ['./tasks-base.component.scss']
})
export class TasksBaseComponent implements OnInit {
	@Input() task: Task;
  @Input() modulo: string = 'asisprevencion';

	@Output() updateToken = new EventEmitter<UpdateTaskEvent>();

	public showEditPanel = false;
  public showEditControl = true;

  public showView = true;
  public showEdit = false;


	public openEditor = false;

  public toggleSelectd = false;

  constructor() { }

  ngOnInit() {
    this.showEditControl = true;


    if(!this.task.requerimiento ){
      this.editToken()
    }
  }


  editToken(){
    this.showEdit = !this.showEdit;

    if(this.showEdit){
      this.showView = false;
      this.showEditPanel = true;

    }else{
      this.showView = true;
      this.showEditPanel = false;

    }
  }

  manageBase(event: UpdateTaskEvent){
    this.showEdit = false;
    this.showView = true;
    this.showEditPanel = false;

  	this.emitEvent(event);
  }

  emitEvent(event: UpdateTaskEvent){
  	if(event.action === UPDATE){
  		this.updateToken.next(event);
  	}
    if(event.action === NAVIGATE){
      this.updateToken.next(event);
    }
    if(event.action === DELETE){
      this.updateToken.next(event);
    }
    if(event.action === SELECT){
      this.updateToken.next(event);
    }
  }
 
	removeToken(){
	}

}

interface ChipSchema{
  color:string;
  text: string;
}
