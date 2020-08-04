import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

import { SaludController } from '../../../salud/salud.controller';
import { PersonService }   from '../../../salud/person.service';

import {  Person } from '../../../entities/person/person';

import { 	Asistencia, 
          VigilanciaBrowse,
					UpdateAsistenciaEvent, 
					AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';
const CREATE = 'create';
const SEARCH = 'search';
const NAVIGATE = 'navigate';
const EVOLUCION = 'evolucion';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'epidemio-investig-page',
  templateUrl: './epidemio-investig-page.component.html',
  styleUrls: ['./epidemio-investig-page.component.scss']
})
export class EpidemioInvestigPageComponent implements OnInit {

  public title = 'Investigación Epidemiológica';
  public formTitle = 'Formulario Integrado';

	public  person: Person;
	private hasPerson = false;

  public searchPerson = true;
	public showView = false;
  public showInvestigForm = false;

  // asistencia
  public currentAsistencia: Asistencia;
  public hasSolicitud = false;

  public query: VigilanciaBrowse;

  constructor(
  		private perSrv: PersonService,
      private dsCtrl: SaludController,

  	) { }

  ngOnInit(): void {
  }

  /************************************/
  /******* Template Events *******/
  /**********************************/

  // STEP-1: Persona Creada
  personFetched(person: Person){
    this.showView = false;
    this.person = person;
    this.dsCtrl.updateCurrentPerson(person);
    this.hasPerson = true;


    this.fetchSolicitudes(SEARCH, this.person);

    setTimeout(()=> {
      this.showView = true;
    }, 200);
    
  }




  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  private fetchSolicitudes(action: string, person:Person){
    console.log('fetchSolicitudes BEGIN')

    this.query = new VigilanciaBrowse()
    this.query.requirenteId = this.person._id

    this.showInvestigForm = false;

    AsistenciaHelper.cleanQueryToken(this.query, false);


    this.dsCtrl.fetchAsistenciaByQuery(this.query).subscribe(list => {
      console.log('list fetched: [%s]', list && list.length)
      if(list && list.length > 0){
        this.currentAsistencia = list[0];

        this.showInvestigForm = true;

      }else {
        this.initNewAsistencia(this.person)

      }

    })
  }

 private initNewAsistencia(person: Person){
 
    this.currentAsistencia = AsistenciaHelper.initNewAsistenciaEpidemio('epidemio', 'epidemiologia', person);
    this.currentAsistencia.tdoc = person.tdoc;
    this.currentAsistencia.ndoc = person.ndoc;

    this.dsCtrl.manageCovidRecord(this.currentAsistencia).subscribe(sol => {
      if(sol){
        this.currentAsistencia = sol;
        this.showInvestigForm = false;

      }else {
        //c onsole.log('fallo la creación de solicitud')
      }
    })

  }


}


