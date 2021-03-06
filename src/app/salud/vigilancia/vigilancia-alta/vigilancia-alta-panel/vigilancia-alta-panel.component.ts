import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';
import { SaludController } from '../../../salud.controller';
import { PersonService } from '../../../person.service';

import { Person, personModel, Address } from '../../../../entities/person/person';

import {  Asistencia, 
          ContextoCovid,
          ContextoDenuncia,
          Locacion,
          Requirente,
          Novedad, 
          UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { devutils }from '../../../../develar-commons/utils'

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
  selector: 'vigilancia-alta-panel',
  templateUrl: './vigilancia-alta-panel.component.html',
  styleUrls: ['./vigilancia-alta-panel.component.scss']
})
export class VigilanciaAltaPanelComponent implements OnInit {
  @Output() vigilanciaEvent = new EventEmitter<UpdateAsistenciaEvent>();
	public  person: Person;
	private hasPerson = false;

	//template helpers
  public searchPerson = true;
  public confirmaInternacion = false;
	public showView = false;

  public title = 'Alta nueva persona a Vigilancia Epidemiológica'
  public altaRapidaTitle = 'Confirmar ALTA de seguimiento epidemiológico'


  // asistencia
  public currentAsistencia: Asistencia;
  public hasSolicitud = false;


  constructor(
  		private perSrv: PersonService,
      private dsCtrl: SaludController,
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
    this.dsCtrl.updateCurrentPerson(person);
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
  private fetchSolInternacion(person: Person){

    this.dsCtrl.fetchAsistenciaByPerson(person).subscribe(list => {
      if(list && list.length){
        this.currentAsistencia = list[0];

        this.updateAsistencia(this.currentAsistencia, person);

      }else {
        this.initNewAsistencia(this.person)
      }
    })
  }

  private handleAsistencia(){

    if(this.currentAsistencia){
      this.vigilanciaEvent.next({
              action: UPDATE,
              type: TOKEN_TYPE,
              selected: true,
              token: this.currentAsistencia
            });

    }else{
      this.vigilanciaEvent.next({
              action: CANCEL,
              type: TOKEN_TYPE,
              selected: false,
              token: null
            });
    }

    this.resetProcess()
  }

  private updateAsistencia(asistencia: Asistencia, person: Person){
  	asistencia.isVigilado = true;

    this.updateAddressFromPerson(asistencia, person);

		let novedad = new Novedad();
		novedad.tnovedad = "epidemiologia";
		novedad.novedad  = 'Alta seguimiento epidemiología';
		let novedades = asistencia.novedades || [];
		novedades.push(novedad);
		asistencia.novedades = novedades;

    this.dsCtrl.manageCovidRecord(this.currentAsistencia).subscribe(sol => {
      if(sol){
        this.currentAsistencia = sol;
        this.handleAsistencia()

      }else {
        //co nsole.log('fallo la creación de solicitud')
      }
    })
		//
  }

  private updateAddressFromPerson(asistencia: Asistencia, person: Person){
    let address = person.locaciones && person.locaciones.length && person.locaciones[0];
    let locacion = asistencia.locacion || new Locacion();

    if(address) {
      locacion.street1 = address.street1;
      locacion.street2 = address.street2;
      locacion.streetIn = address.streetIn;
      locacion.streetOut = address.streetOut;

      locacion.city = address.city;
      locacion.barrio = address.barrio;
      locacion.zip = address.zip;
      locacion.lng = address.lng;
      locacion.lat = address.lat;
      
      asistencia.locacion = locacion;
    }

  }


  private initNewAsistencia(person: Person){
 
    this.currentAsistencia = AsistenciaHelper.initNewAsistenciaEpidemio('epidemio', 'epidemiologia', person);
    this.currentAsistencia.tdoc = person.tdoc;
    this.currentAsistencia.ndoc = person.ndoc;

    this.dsCtrl.manageCovidRecord(this.currentAsistencia).subscribe(sol => {
      if(sol){
        this.currentAsistencia = sol;
        this.handleAsistencia()

      }else {
        //co nsole.log('fallo la creación de solicitud')
      }
    })

  }

  /************************************/
  /******* Template Helpers *******/
  /**********************************/

  private resetProcess(){
    this.showView = false;

    this.currentAsistencia = null;
    this.hasSolicitud = false;

    this.person = null;
    this.hasPerson = false;
  }

}
