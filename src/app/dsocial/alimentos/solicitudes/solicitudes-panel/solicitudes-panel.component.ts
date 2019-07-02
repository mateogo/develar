import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DsocialController } from '../../../dsocial.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia, 
					Alimento, 
					UpdateAsistenciaEvent, 
					AsistenciaHelper } from '../../../asistencia/asistencia.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';
const ACTION = 'create';



@Component({
  selector: 'solicitudes-panel',
  templateUrl: './solicitudes-panel.component.html',
  styleUrls: ['./solicitudes-panel.component.scss']
})
export class SolicitudesPanelComponent implements OnInit {
	@Input() items: Array<Asistencia>;
	@Output() updateItem = new EventEmitter<UpdateAsistenciaEvent>();

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



  tokenSelected(event: UpdateAsistenciaEvent){
    if(event.action === ACTION){
      this.emitEvent(event);


    }

  }

  emitEvent(event:UpdateAsistenciaEvent){
    this.updateItem.next(event);
  
  }

}
