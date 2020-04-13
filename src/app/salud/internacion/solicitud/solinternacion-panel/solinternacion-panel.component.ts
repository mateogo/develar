import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { SaludController } from '../../../salud.controller';

import {  Person } from '../../../../entities/person/person';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, MotivoInternacion,
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
					MasterAllocation,UpdateInternacionEvent } from '../../internacion.model';

import { InternacionHelper }  from '../../internacion.helper';

const UPDATE = 'update';
const DELETE = 'delete';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE = 'navigate';

@Component({
  selector: 'solinternacion-panel',
  templateUrl: './solinternacion-panel.component.html',
  styleUrls: ['./solinternacion-panel.component.scss']
})
export class SolinternacionPanelComponent implements OnInit {
	@Input() items: Array<SolicitudInternacion>;
	@Output() updateItems = new EventEmitter<UpdateInternacionEvent>();

  public title = 'Solicitudes de Internación';

	public showList = false;
  public showActiveList = false;
  public showFullList = true;

  public openEditor = true;
  public activeitems: Array<SolicitudInternacion> = [];

  constructor(
      private dsCtrl: SaludController,
    ) { }

  ngOnInit() {

  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateInternacionEvent){
    if(event.action === UPDATE){
        this.emitEvent(event);

    } else if(event.action === NAVIGATE){
      this.emitEvent(event);


    } else if(event.action === DELETE){
      //this.deleteItem(event.token)

    }
  }

  private deleteItem(token:SolicitudInternacion){
    let isNew = token._id ? false: true;
    if(isNew){
      this.deleteFromListItems(token);
    }

  }

  deleteFromListItems(token: SolicitudInternacion){
    let index = this.items.indexOf(token);
    if(index !== -1){
      this.items.splice(index, 1)
    }
  }

  addItem(){
  	if(false){ //ToDo

    let item = new SolicitudInternacion();//   InternacionHelper.initNewAsistencia('alimentos', 'alimentos')
    if(!this.items) this.items = [];
    if(!this.activeitems) this.activeitems = [];

    this.items.unshift(item);
    this.activeitems.unshift(item);

    this.showList = true;

  	}

  }

  emitEvent(event:UpdateInternacionEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items,
  		token: null
  	  });

  	} else if(event.action === NAVIGATE){
      this.updateItems.next({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      items: this.items,
      token: null
      });

    }
  }

}
