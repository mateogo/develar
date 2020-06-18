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
const PANEL_TYPE = 'solcovid'; // [solcovid|offline]

@Component({
  selector: 'solcovid-list',
  templateUrl: './solcovid-list.component.html',
  styleUrls: ['./solcovid-list.component.scss']
})
export class SolcovidListComponent implements OnInit {
	@Input() items: Array<Asistencia>;
  @Input() panelType = PANEL_TYPE;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();
  @Output() updateAsistencia = new EventEmitter<UpdateAsistenciaEvent>();

  public title = 'Solicitudes de ASISTENCIA';

	public showONE = false;
  public showTWO = false;


  constructor(
      private dsCtrl: SaludController,
    ) { }

  ngOnInit() {

  	if(this.items && this.items.length){
      if(this.panelType === PANEL_TYPE){
        this.showONE = true;

      }else {
        this.showTWO = true;

      }
  	}

  }

  updateItem(event: UpdateAsistenciaEvent){
        this.emitEvent(event);
  }

  updateToken(event: UpdateAsistenciaEvent){
    this.updateAsistencia.next(event)
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
