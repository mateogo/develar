import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

import { Person, Address, UpdatePersonEvent, PersonContactData, personModel } from '../../../../entities/person/person';
import { PersonService } from '../../../person.service';
import { InternacionService } from '../../internacion.service';

import { devutils }from '../../../../develar-commons/utils'

import { LocacionHospitalaria, LocacionEvent} from '../../../../entities/locaciones/locacion.model';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, MotivoInternacion,
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
					MasterAllocation,UpdateInternacionEvent,MasterSelectedEvent } from '../../internacion.model';

import { InternacionHelper }  from '../../internacion.helper';

const CREATE =   'create';
const UPDATE =   'update';
const CANCEL =   'update';
const SELECTED = 'selected';

const NAVIGATE = 'navigate';
const SERVICIO_DEFAULT = "INTERNACION"

const SEARCH_LOCACION = 'search_locacion';
const NEXT = 'next';


@Component({
  selector: 'altarapida-page',
  templateUrl: './altarapida-page.component.html',
  styleUrls: ['./altarapida-page.component.scss']
})
export class AltarapidaPageComponent implements OnInit {
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

  	) { }

  ngOnInit() {
  	this.person = new Person('alta rápida', '');
    this.openPersonEditForm()
  }

  /************************************/
  /******* Template Events *******/
  /**********************************/
  // STEP-1: Persona Creada
  personFetched(person: Person){
    console.log('personFetched [%s]', person.nombre);
    this.person = person;
    this.hasPerson = true;
    this.showView = true;
    this.confirmaInternacion = true;
      //this.initCurrentPerson(persons[0]);

  }

  // personEvent(event: UpdatePersonEvent){
  //   if(event.action === UPDATE){
  //     this.updatePerson(event.person);

  //   }else if(event.action === CREATE ){
  //   	this.createPerson(event.person)

  //   }

  // }


  // STEP-2: CREA /EDITA SOL INTERNACION
  confirmaActualizarInternacionEvent(e){
    this.confirmaInternacion = false;
    this.fetchSolInternacion(this.person);
  }




  // STEP-3: TRIAGE ESTABLECIDO
  triageEvent(event: UpdateInternacionEvent){
    if(event.action === SEARCH_LOCACION){
      console.log('STEP-3: SEARCH LOCACION')
      this.triage = event.token as MotivoInternacion;
      this.handleAllocation();


    }else if(event.action === NEXT ){
      this.triage = event.token as MotivoInternacion;
      console.log('STEP-3: NEXT')
      this.handleInternacion();


    }else if(event.action === CANCEL ){
      console.log('STEP-3: CANCEL')
      this.resetProcess()

    }

  }

  // STEP-4: LOCACION DE INTERNACIÓN ELEGIDA
  masterSelectedEvent(event: MasterSelectedEvent){
    console.log('masterSelected BUBBLED')
    if(event.action === SELECTED){
      this.masterSelected = event.token;
      this.updateLocacionDeInternacion();
    }else{
      this.masterSelected = null;
    }

  }

  internacionEvent(event: UpdateInternacionEvent){
    console.log('Internacion EVENT')
    this.resetProcess()
  }


  /************************************/
  /******* Person Manager *******/
  /**********************************/
  // private updatePerson(person: Person){
  // 	if(!person._id) return; // ToDo: error
  //   console.log('Person UPDATE')

  //   this.perSrv.partialUpdatePerson(person._id, person).then(per => {
  //       console.log('Partial Update')

  //   	if(per){
  //       console.log('2')
  //   		this.person = per;
  //   		this.hasPerson = true;
  //   		this.closePersonEditForm()
  //       this.fetchSolInternacion(this.person);

  //   	}else{
  //       console.log('ERROR: updating Person')
  //     	//todo: error
  //   	}
  //   })
  // }

  // private createPerson(person: Person){
  //   this.perSrv.createPerson(person).then(per => {
  //   	if(per){
  //   		this.person = per;
  //   		this.perSrv.updateCurrentPerson(per);
  //   		this.hasPerson = true;
  //   		this.closePersonEditForm()
  //       this.fetchSolInternacion(this.person);
  //   	}else {
  //       console.log('ERROR: updating Person')
  //   		//todo: error
  //   	}
  //   })
  // }


  /***************************************************/
  /******* Allocation STEP *******/
  /*************************************************/

  private handleAllocation(){
    this.showMasterAllocator = false;
    this.masterSelected = null;

    let capacidad = InternacionHelper.getCapacidadFromServicio(this.triage.servicio);
    if(capacidad){
      this.queryMaster = {capacidad: capacidad};
    }else{
      this.queryMaster = {}
    }

    setTimeout(()=>{
      this.showMasterAllocator = true;

    },300)

  }


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
    this.servicio = SERVICIO_DEFAULT;

    this.triage = this.solInternacion.triage || new MotivoInternacion({servicio: this.servicio});
    this.internacion = this.solInternacion.internacion || new Internacion();

    this.triageStep() // STEP 3
  }


  private initNewIntervencion(person: Person, servicio: string){
    let spec = new InternacionSpec();
    
    spec.servicio = servicio|| spec.servicio;

    this.intSrv.createNewSolicitudInternacion(spec, person).subscribe(sol => {
      if(sol){
        this.solInternacion = sol;
        this.handleSolicitudInternacion()

      }else {
        //console.log('fallo la creación de solicitud')
      }
    })

  }


  /***************************************************/
  /******* Internacion STEP *******/
  /*************************************************/
  private updateLocacionDeInternacion(){
    this.internacion.locId = this.masterSelected.id;
    this.internacion.locSlug = this.masterSelected.slug;

    this.handleInternacion()
  }

  private handleInternacion(){
    this.solInternacion.triage = this.triage;
    this.internacion.servicio =  this.triage.servicio;
    this.internacion.slug = this.triage.slug;
    this.internacion.description = this.triage.description;

    this.openFinalStep()
  }


  /************************************/
  /******* Template Helpers *******/
  /**********************************/
  private closePersonEditForm(){
  	this.showEditor = false;
  	this.showView = true;
  }

  private openPersonEditForm(){
    this.showEditor = true;
    this.showView = false;
    this.showTriageEditor = false;
    this.showTriageView = false;
 }


  private triageStep(){
    if(!this.triage){
      this.triage = new MotivoInternacion({servicio: SERVICIO_DEFAULT})
    }
    this.showTriageEditor = true;
    this.showTriageView = false;
  }

  private openFinalStep(){
    this.showTriageEditor = false;
    this.showTriageView = false;
    this.showEditor = false;
    this.showTriageEditor = false;
    this.showTriageView = false;
    this.showMasterAllocator = false;

    this.showView = true;
    this.finalStep = true;
  }

  private resetProcess(){
    this.showTriageEditor = false;
    this.showTriageView = false;
    this.showEditor = false;
    this.showTriageEditor = false;
    this.showTriageView = false;
    this.showMasterAllocator = false;

    this.showView = false;
    this.finalStep = false;

    this.triage = null;
    this.internacion = null;

    this.solInternacion = null;
    this.hasSolicitud = false;

    this.person = null;
    this.hasPerson = false;

    this.masterSelected = null;
    this.servicio = SERVICIO_DEFAULT
  }

}

