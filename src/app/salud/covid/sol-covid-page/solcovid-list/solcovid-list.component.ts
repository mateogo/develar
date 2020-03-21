import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { SaludController } from '../../../salud.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../../asistencia/asistencia.model';

const UPDATE =     'update';
const EVOLUCION =  'evolucion';
const DELETE =     'delete';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE =   'navigate';

@Component({
  selector: 'solcovid-list',
  templateUrl: './solcovid-list.component.html',
  styleUrls: ['./solcovid-list.component.scss']
})
export class SolcovidListComponent implements OnInit {
	@Input() items: Array<Asistencia>;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();

  public title = 'Solicitudes de ASISTENCIA';

	public showList = false;
  public showActiveList = false;
  public showFullList = true;

  public openEditor = true;
  public activeitems: Array<Asistencia> = [];

  constructor(
      private dsCtrl: SaludController,
    ) { }

  ngOnInit() {

  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateAsistenciaEvent){
        this.emitEvent(event);
  }


  emitEvent(event:UpdateAsistenciaEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	  });
    } else if(event.action === EVOLUCION){
      this.updateItems.next({
      action: EVOLUCION,
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
