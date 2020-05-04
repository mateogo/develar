import { Component, OnInit, Output, Inject, Input, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

import { devutils }from '../../../develar-commons/utils'

import { Person, Address, UpdatePersonEvent, PersonContactData, personModel } from '../../../entities/person/person';
import { PersonService } from '../../../salud/person.service';
import { InternacionService } from '../../../salud/internacion/internacion.service';


import { LocacionHospitalaria, LocacionEvent} from '../../../entities/locaciones/locacion.model';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, MotivoInternacion,
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
					MasterAllocation,UpdateInternacionEvent,MasterSelectedEvent } from '../../../salud/internacion/internacion.model';

import { InternacionHelper }  from '../../../salud/internacion/internacion.helper';

const CREATE =   'create';
const UPDATE =   'update';
const CANCEL =   'cancel';
const SELECTED = 'selected';

const NAVIGATE = 'navigate';
const SERVICIO_DEFAULT = "INTERNACION"

const SEARCH_LOCACION = 'search_locacion';
const NEXT = 'next';

const TOKEN_TYPE = 'asistencia';



@Component({
  selector: 'internacion-alta',
  templateUrl: './internacion-alta.component.html',
  styleUrls: ['./internacion-alta.component.scss']
})
export class InternacionAltaComponent implements OnInit {
  @Output() vigilanciaEvent = new EventEmitter<UpdateInternacionEvent>();
	public  person: Person;
	private hasPerson = false;

  public solInternacion: SolicitudInternacion;
  public hasSolicitud = false;

  public masterSelected: MasterAllocation;

  public triage: MotivoInternacion;

  private servicio = SERVICIO_DEFAULT;

	public showEditor = false;
	public showView = false;
  public confirmaInternacion = false;

  public showTriageEditor = false;
  public showTriageView = false;
  public hasSolInternacion = false;

  public showMasterAllocator = false;
  public queryMaster = {};

  public finalStep = false;
  public internacion: Internacion;

  public searchPerson = true;



  constructor(
  		private perSrv: PersonService,
      private intSrv: InternacionService,
      public dialogRef: MatDialogRef<InternacionAltaComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
  	) { }

  ngOnInit() {
  	this.person = new Person('alta rápida', '');
  }

  /************************************/
  /******* Template Events *******/
  /**********************************/
  // STEP-1: Persona Creada
  personFetched(person: Person){
    this.person = person;
    this.hasPerson = true;
    this.showView = true;
    this.confirmaInternacion = true;
      //this.initCurrentPerson(persons[0]);

  }

  // STEP-2: CREA /EDITA SOL ASISTENCIA
  confirmaActualizarInternacionEvent(action){
    this.confirmaInternacion = false;
    if(action === NEXT){
      this.fetchSolInternacion(this.person);

    }else{
      this.resetProcess()
    }
  }


  /***************************************************/
  /******* Solicitud de Intervención  Manager *******/
  /*************************************************/
  /***************************************************/
  /******* Solicitud de Intervención  Manager *******/
  /*************************************************/
  private fetchSolInternacion(person: Person){
    this.intSrv.fetchInternacionesByPersonId(person._id).subscribe(list => {
      if(list && list.length){
        this.solInternacion = list[0];

        this.handleSolicitudInternacion()

      }else {
        this.initNewIntervencion(this.person, this.servicio)
      }
    })
  }

  private handleSolicitudInternacion(){

    this.resetProcess()
    //TODO finish!!
  }


  private initNewIntervencion(person: Person, servicio: string){
    let spec = new InternacionSpec();
    
    spec.servicio = servicio|| spec.servicio;

    this.intSrv.createNewSolicitudInternacion(spec, person).subscribe(sol => {
      if(sol){
        this.solInternacion = sol;
        this.handleSolicitudInternacion()

      }else {
        //c onsole.log('fallo la creación de solicitud')
      }
    })

  }



  /************************************/
  /******* Template Helpers *******/
  /**********************************/

  private resetProcess(){
    this.showView = false;

    this.solInternacion = null;
    this.hasSolicitud = false;

    this.person = null;
    this.hasPerson = false;

		this.dialogRef.close();

  }

}


