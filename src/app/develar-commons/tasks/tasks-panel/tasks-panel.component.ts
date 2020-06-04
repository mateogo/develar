import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { DaoService }  from '../../dao.service';

import {  Task, Audit, ParentEntity } from '../tasks.model';
import {  TasksController } from '../tasks.controller';

import { 	UpdateTaskEvent, TasksHelper } from '../tasks.helper';

const UPDATE = 'update';
const DELETE = 'delete';
const NAVIGATE = 'navigate';

const TOKEN_TYPE = 'task';


@Component({
  selector: 'tasks-panel',
  templateUrl: './tasks-panel.component.html',
  styleUrls: ['./tasks-panel.component.scss'],
  providers: [ TasksController ]

})
export class TasksPanelComponent implements OnInit {
	@Input() audit: Audit;
	@Input() parent: ParentEntity;
  @Input() modulo: string = 'asisprevencion';
  @Input() title: string = 'Tareas'

  constructor(
  		private obsCtrl: TasksController
  	) { }

	public showList = false;
  public openEditor = true;

  public items: Array<Task> = [];


  ngOnInit() {
    if(this.parent){
      this.loadTasks();

    }

  }

  loadTasks(){
    this.obsCtrl.fetchTasksByParent(this.parent.entityType, this.parent.entityId).subscribe(tasks => {
      if(tasks && tasks.length){

        this.sortProperly(tasks);
        this.items = tasks
        this.showList = true;
      }
    })

  }

  private sortProperly(records: Array<Task>){
    records.sort((fel, sel)=> {
      if(fel.ts_umod < sel.ts_umod) return 1;
      else if(fel.ts_umod > sel.ts_umod) return -1;
      else return 0;
    })
  }

  updateItem(event: UpdateTaskEvent){

    if(event.action === UPDATE){
      this.obsCtrl.manageTaskRecord(event.token).subscribe(obs =>{
        if(obs){
          event.token = obs;
        }

      });      

    } else if(event.action === DELETE){
      this.deleteItem(event.token)

    }

  }

  private deleteItem(token:Task){
    let isNew = token._id ? false: true;
    if(isNew){
      this.deleteFromListItems(token);
    }

  }

  private deleteFromListItems(token: Task){
    let index = this.items.indexOf(token);
    if(index !== -1){
      this.items.splice(index, 1)
    }
  }

  addItem(){
  	let spec = {
  		modulo: 'general',
  		audit: this.audit,
  		parent: this.parent
  	}

    let item = TasksHelper.initNewTask(spec)
    if(this.items){
      this.items.unshift(item);

    }else{
      this.items = [ item ]

    }
    this.showList = true;

  }

}

