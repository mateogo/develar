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


  manageTaskRecord(observacion:Task ): Subject<Task>{
    let listener = new Subject<Task>();
    let type = 'observacion';

    if(this.isNewToken(observacion)){
      observacion = this.initNewTask(observacion);
      this.insertTask(listener, type, observacion);

    }else{
      observacion = this.initTaskForUpdate(observacion);
    	this.upsertTask(listener, type, observacion);

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
  private upsertTask(listener: Subject<Task>, type,  observacion: Task){
    this.daoService.update<Task>(type, observacion._id, observacion).then(obs =>{
      listener.next(obs);
    })
  }

  private insertTask(listener: Subject<Task>,type,  observacion: Task){
      this.daoService.create<Task>(type, observacion).then(obs =>{
        listener.next(obs);
      });
  }

  /******* init for create / update ********/
  private initTaskForUpdate(observacion: Task): Task{
  	return observacion;

  }

  private initNewTask(observacion:Task){
  	// ToDo
  	return observacion;
  }


  fetchTasksByParent(entity:string, id:string){
    let query = {
    	entityType: entity,
      entityId: id
    }
    return this.daoService.search<Task>(RECORD_TYPE, query);
  }


}
