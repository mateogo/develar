import { Injectable } from '@angular/core';

import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';

import { DaoService }    from '../dao.service';
import { Observacion } from './observaciones.model';

@Injectable()
export class ObservacionesController {

  constructor(
		private daoService: DaoService,
  	) { 

  }


  manageObservacionRecord(observacion:Observacion ): Subject<Observacion>{
    let listener = new Subject<Observacion>();
    let type = 'observacion';

    if(this.isNewToken(observacion)){
      observacion = this.initNewObservacion(observacion);
      this.insertObservacion(listener, type, observacion);

    }else{
      observacion = this.initObservacionForUpdate(observacion);
    	this.upsertObservacion(listener, type, observacion);

    }

    return listener;
  }

  private isNewToken(token:Observacion): boolean{
    let isNew = true;
    if(token._id){
      isNew = false;
    }

    return isNew;
  }


  /******* UPDATE / CREATE ********/ 
  private upsertObservacion(listener: Subject<Observacion>, type,  observacion: Observacion){
    this.daoService.update<Observacion>(type, observacion._id, observacion).then(obs =>{
      listener.next(obs);
    })
  }

  private insertObservacion(listener: Subject<Observacion>,type,  observacion: Observacion){
      this.daoService.create<Observacion>(type, observacion).then(obs =>{
        listener.next(obs);
      });
  }

  /******* init for create / update ********/
  private initObservacionForUpdate(observacion: Observacion): Observacion{
  	return observacion;

  }

  private initNewObservacion(observacion:Observacion){
  	// ToDo
  	return observacion;
  }


  fetchObservacionesByParent(entity:string, id:string){
    let query = {
    	entityType: entity,
      entityId: id
    }
    return this.daoService.search<Observacion>('observacion', query);
  }


}
