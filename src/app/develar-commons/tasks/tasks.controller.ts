import { Injectable } from '@angular/core';

import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';

import { DaoService }    from '../dao.service';
import { Task } from './tasks.model';

const RECORD_TYPE = 'task';

@Injectable()
export class TasksController {

  constructor(
		private daoService: DaoService,
  	) { 

  }


  manageTaskRecord(tasks:Task ): Subject<Task>{
    let listener = new Subject<Task>();
    let type = 'tasks';

    if(this.isNewToken(tasks)){
      tasks = this.initNewTask(tasks);
      this.insertTask(listener, type, tasks);

    }else{
      tasks = this.initTaskForUpdate(tasks);
    	this.upsertTask(listener, type, tasks);

    }

    return listener;
  }

  private isNewToken(token:Task): boolean{
    let isNew = true;
    if(token._id){
      isNew = false;
    }

    return isNew;
  }


  /******* UPDATE / CREATE ********/ 
  private upsertTask(listener: Subject<Task>, type,  tasks: Task){
    this.daoService.update<Task>(type, tasks._id, tasks).then(obs =>{
      listener.next(obs);
    })
  }

  private insertTask(listener: Subject<Task>,type,  tasks: Task){
      this.daoService.create<Task>(type, tasks).then(obs =>{
        listener.next(obs);
      });
  }

  /******* init for create / update ********/
  private initTaskForUpdate(tasks: Task): Task{
  	return tasks;

  }

  private initNewTask(tasks:Task){
  	// ToDo
  	return tasks;
  }


  fetchTasksByParent(entity:string, id:string){
    let query = {
    	entityType: entity,
      entityId: id
    }
    return this.daoService.search<Task>(RECORD_TYPE, query);
  }


}
