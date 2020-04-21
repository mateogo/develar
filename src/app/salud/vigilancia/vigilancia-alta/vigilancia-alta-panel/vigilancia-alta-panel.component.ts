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

@Component({
  selector: 'vigilancia-alta-panel',
  templateUrl: './vigilancia-alta-panel.component.html',
  styleUrls: ['./vigilancia-alta-panel.component.scss']
})
export class VigilanciaAltaPanelComponent implements OnInit {
	public  person: Person;
	private hasPerson = false;

	//template helpers
  public searchPerson = true;
  public confirmaInternacion = false;
	public showView = false;


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

        this.updateAsistencia(this.currentAsistencia);

      }else {
        this.initNewAsistencia(this.person)
      }
    })
  }

  private handleAsistencia(){

    this.resetProcess()
  }

  private updateAsistencia(asistencia: Asistencia){
  	asistencia.isVigilado = true;

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
