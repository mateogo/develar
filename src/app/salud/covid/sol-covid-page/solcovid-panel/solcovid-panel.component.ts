import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { SaludController } from '../../../salud.controller';
import { SaludModel, Ciudadano, SectorAtencion, sectores } from '../../../salud.model';
import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../../../../develar-commons/asset-helper';

import { devutils }from '../../../../develar-commons/utils';

import {  Person,
          Address,
          FamilyData,
          OficiosData,
          SaludData,
          CoberturaData,
          EncuestaAmbiental,
          personModel,

          UpdatePersonEvent,
          UpdateItemListEvent,
          UpdateEventEmitter,

          PersonContactData 
        } from '../../../../entities/person/person';

import {   Asistencia, 
          Locacion, 
          UpdateAsistenciaEvent, 
          UpdateAlimentoEvent, 
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';


import { Turno, TurnoAction, TurnosModel }  from '../../../turnos/turnos.model';
import { Audit, ParentEntity } from '../../../../develar-commons/observaciones/observaciones.model';

const UPDATE =   'update';
const NAVIGATE = 'navigate';
const CANCEL =   'cancel';
const DELETE =   'delete';
const SELECT =   'select';
const TOKEN_TYPE = 'asistencia';
const EVOLUCION = 'evolucion';

@Component({
  selector: 'solcovid-panel',
  templateUrl: './solcovid-panel.component.html',
  styleUrls: ['./solcovid-panel.component.scss']
})
export class SolcovidPanelComponent implements OnInit {
  @Input() asistencia: Asistencia;
  @Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

  // template helper
  public title = "Eventos COVID";
  public subtitle = "Atención 0800 22 COVID";

  public contactList:   PersonContactData[];
  public addressList:   Address[];
  public familyList:    FamilyData[];
  public oficiosList:   OficiosData[];
  public saludList:     SaludData[];
  public coberturaList: CoberturaData[];
  public ambientalList: EncuestaAmbiental[];
  public assetList:     CardGraph[] = []
  
  public asistenciasList: Asistencia[];
  public showHistorial = false;

  public audit: Audit;
  public parentEntity: ParentEntity;


  //public contactData = new PersonContactData();

  private hasPersonIdOnURL = true;
  private personId: string;
  private currentAvance: string;

  
  //COVID

  public personFound = false;
  public showAsistenciaEditor = false;
  public searchPerson = false;
  public showFollowUp = false;

  public currentPerson: Person;

  // person data
  public tDoc = "DNI";
  public nDoc = "";
  public displayAddress = "";
  public pname;
  public alerta;
  public pdoc;
  public edad;
  public edadTxt;
  public ocupacion;
  public nacionalidad;
  public estado;
  public neducativo;
  public sexo;
  public sectorAtencion = '';



  constructor(
      private dsCtrl: SaludController,

    ) { }

  ngOnInit() {
    if(this.asistencia){
      this.currentAvance = this.asistencia.avance;


      this.showFollowUp = true;
 
    }

  }


  /**********************/
  /*      Events        */
  /**********************/


  /**********************/
  /*      COVID        */
  /**********************/
  manageBase(event: UpdateAsistenciaEvent){


    this.processRecord(event);
  }

  private processRecord(event: UpdateAsistenciaEvent){
    this.showFollowUp = false;
    if(event.action === UPDATE || event.action === EVOLUCION){
      //

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
    if(event.action === NAVIGATE){
      //
    }
    if(event.action === DELETE){
      //
    }
    if(event.action === CANCEL){
      this.resetForm();
      //
    }
  }



  private closeTurnosForm(){
    this.personFound = true;
    this.showAsistenciaEditor = false;
    this.showFollowUp = false;

  }

  private openTurnosForm(){
    this.personFound = true;
    this.showAsistenciaEditor = true;
    this.showFollowUp = false;
    
  }
  private followUpForm(){
    this.showFollowUp = true;

    this.personFound = false;
    this.showAsistenciaEditor = false;
    this.searchPerson = false;

  }

  private resetForm(){
    this.searchPerson = true;

    this.personFound = false;
    this.showAsistenciaEditor = false;
    this.showFollowUp = false;
    this.asistencia = null;
    this.currentPerson = null;
    this.dsCtrl.resetCurrentPerson();

  }

  private editAsistencia(){

    this.showAsistenciaEditor = true;
    this.showFollowUp = false;
    this.searchPerson = false;

  }

  private emitEvent(event: UpdateAsistenciaEvent){
    this.updateToken.next(event);

  }



}

