import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { Person } from '../../../entities/person/person';

import { SaludController } from '../../salud.controller';
import { SaludModel, Ciudadano, SectorAtencion, sectores } from '../../salud.model';
import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../../../develar-commons/asset-helper';

import { devutils }from '../../../develar-commons/utils';

import {  Asistencia, UpdateAsistenciaEvent } from '../../asistencia/asistencia.model';

import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

const UPDATE =   'update';
const NAVIGATE = 'navigate';
const CANCEL =   'cancel';
const DELETE =   'delete';
const SELECT =   'select';
const TOKEN_TYPE = 'asistencia';
const EVOLUCION = 'evolucion';

@Component({
  selector: 'vigilancia-panel',
  templateUrl: './vigilancia-panel.component.html',
  styleUrls: ['./vigilancia-panel.component.scss']
})
export class VigilanciaPanelComponent implements OnInit {
  @Input() asistencia: Asistencia;
  @Input() viewList: Array<string> = [];
  @Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();
  @Output() fetchPerson = new EventEmitter<string>();

  // template helper
  public title = "Eventos COVID";
  public subtitle = "Atención 0800 22 COVID";

  private currentAvance: string;
  public showFollowUp = false;


  constructor(
      private dsCtrl: SaludController,
    ) { }

  ngOnInit() {
    if(this.asistencia){
      this.currentAvance = this.asistencia.avance;

      this.showFollowUp = true;
    }
  }


  /*************************/
  /*    template EVENTS   */
  /***********************/
  manageBase(event: UpdateAsistenciaEvent){
    if(event.action === UPDATE || event.action === EVOLUCION){
			this.processRecord(event);

    } else if(event.action === NAVIGATE){


    } else if(event.action === DELETE){
      //

    }else if (event.action === CANCEL){
      //
    }
  }

  vinculoSelected(personId: string){
    this.fetchPerson.next(personId);
  }

  /*************************/
  /*   process ASISPREV   */
  /***********************/
  private processRecord(event: UpdateAsistenciaEvent){
    this.showFollowUp = false;

		this.dsCtrl.manageCovidRecord(event.token).subscribe(t =>{
		  if(t){
		    this.asistencia = t;
		    this.dsCtrl.openSnackBar('Grabación exitosa', 'Aceptar');

		    this.dsCtrl.createPersonFromAsistencia(t);

		    this.emitEvent(event);

		    if(this.asistencia.avance === this.currentAvance){
		      this.showFollowUp = true;
		    }
		  }
		});

  }

  private emitEvent(event: UpdateAsistenciaEvent){
    this.updateToken.next(event);
  }

}
