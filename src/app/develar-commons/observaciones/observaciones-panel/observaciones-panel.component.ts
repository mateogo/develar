import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { DaoService }  from '../../dao.service';

import {  Observacion, Audit, ParentEntity } from '../observaciones.model';
import {  ObservacionesController } from '../observaciones.controller';

import { 	UpdateObservacionEvent, ObservacionesHelper } from '../observaciones.helper';

const UPDATE = 'update';
const DELETE = 'delete';
const NAVIGATE = 'navigate';

const TOKEN_TYPE = 'observacion';

@Component({
  selector: 'observaciones-panel',
  templateUrl: './observaciones-panel.component.html',
  styleUrls: ['./observaciones-panel.component.scss'],
  providers: [ObservacionesController]
})
export class ObservacionesPanelComponent implements OnInit {
	@Input() audit: Audit;
	@Input() parent: ParentEntity;
  @Input() type: string = 'type';
  @Input() title: string = 'Observaciones'

  constructor(
  		private obsCtrl: ObservacionesController
  	) { }

	public showList = false;
  public openEditor = true;

  public items: Array<Observacion> = [];


  ngOnInit() {
    if(this.parent){
      this.loadObservaciones();

    }

  }

  loadObservaciones(){
    this.obsCtrl.fetchObservacionesByParent(this.parent.entityType, this.parent.entityId).subscribe(observaciones => {
      if(observaciones && observaciones.length){

        this.sortProperly(observaciones);
        this.items = observaciones
        this.showList = true;
      }
    })

  }

  private sortProperly(records: Array<Observacion>){
    records.sort((fel, sel)=> {
      if(fel.ts_umod < sel.ts_umod) return 1;
      else if(fel.ts_umod > sel.ts_umod) return -1;
      else return 0;
    })
  }

  updateItem(event: UpdateObservacionEvent){

    if(event.action === UPDATE){
      this.obsCtrl.manageObservacionRecord(event.token).subscribe(obs =>{
        if(obs){
          event.token = obs;
        }

      });      

    } else if(event.action === DELETE){
      this.deleteItem(event.token)

    }

  }

  private deleteItem(token:Observacion){
    let isNew = token._id ? false: true;
    if(isNew){
      this.deleteFromListItems(token);
    }

  }

  private deleteFromListItems(token: Observacion){
    let index = this.items.indexOf(token);
    if(index !== -1){
      this.items.splice(index, 1)
    }
  }

  addItem(){
  	let spec = {
  		type: 'general',
  		audit: this.audit,
  		parent: this.parent
  	}

    let item = ObservacionesHelper.initNewObservacion(spec)
    if(this.items){
      this.items.unshift(item);

    }else{
      this.items = [ item ]

    }
    this.showList = true;

  }

}
