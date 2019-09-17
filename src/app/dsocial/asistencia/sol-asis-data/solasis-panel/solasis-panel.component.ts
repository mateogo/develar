import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { DsocialController } from '../../../dsocial.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia, 
					Alimento, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE = 'navigate';

@Component({
  selector: 'solasis-panel',
  templateUrl: './solasis-panel.component.html',
  styleUrls: ['./solasis-panel.component.scss']
})
export class SolasisPanelComponent implements OnInit {
	@Input() items: Array<Asistencia>;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();

  public title = 'Solicitudes de Asistencia';
	public showList = false;
  public openEditor = true;

  constructor(
      private dsCtrl: DsocialController,
    ) { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateAsistenciaEvent){
    if(event.action === UPDATE){
      this.dsCtrl.manageAsistenciaRecord('asistencia',event.token).subscribe(t =>{
        if(t){
          event.token = t;
        }

        this.emitEvent(event);

      });      
    } else if(event.action === NAVIGATE){
      this.emitEvent(event);

    }
  }

  addItem(){
    let item = AsistenciaHelper.initNewAsistencia('alimentos', 'alimentos')
    if(this.items){
      this.items.push(item);

    }else{
      this.items = [ item ]

    }
    this.showList = true;

  }

  emitEvent(event:UpdateAsistenciaEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	  });

  	} else if(event.action === NAVIGATE){
      this.updateItems.next({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      items: this.items
      });

    }
  }

}
