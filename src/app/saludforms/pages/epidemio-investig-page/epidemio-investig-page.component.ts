import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

import { SaludController } from '../../../salud/salud.controller';
import { PersonService }   from '../../../salud/person.service';
import { devutils }from '../../../develar-commons/utils'

import {  Person } from '../../../entities/person/person';

import { 	Asistencia, Locacion, Novedad,
          VigilanciaBrowse,
					UpdateAsistenciaEvent, 
					AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';

const UPDATE = 'update';
const CANCEL = 'cancel';

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

  public title = 'INVESTIGACIÓN Epidemiológica';
  public formTitle = 'Formulario Integrado';

	public  person: Person;
	private hasPerson = false;

  public showPersonBrowse = false;
	public showView = false;
  public showInvestigForm = false;
  public showVigilanciaFollowUp = false;
  public showNovedadesFollowUp = false;

  // asistencia
  public currentAsistencia: Asistencia;
  public novedadesList: Array<Novedad> = [];
  public hasSolicitud = false;

  public usersOptList: Array<any> =[];

  public query: VigilanciaBrowse;
  public viewList: Array<string> = [];

  constructor(
  		private perSrv: PersonService,
      private dsCtrl: SaludController,

  	) { }

  ngOnInit(): void {
    setTimeout( () => {
      this.usersOptList = this.dsCtrl.buildEncuestadoresOptList();
      this.showPersonBrowse = true
    }, 400);

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

  vinculoSelected(personId: string){
    this.query = new VigilanciaBrowse();
    this.query.isVigilado = false;
    this.query.hasCovid = false;
    this.query.viewList = [];

    this.query.requirenteId = personId;

  }

  updateInvestig(event: UpdateAsistenciaEvent){
    if(event.action === UPDATE) this.saveInvestigEpidemio(event.token);
    this.resetInvestigForm();

  }


  /**********************************/
  /*    Save Asistencia Investig   */
  /********************************/
  private saveInvestigEpidemio(asistencia: Asistencia){
    this.currentAsistencia = asistencia;

    this.dsCtrl.manageInvestigRecord(asistencia).subscribe(t =>{
      if(t){
        this.currentAsistencia = t;
        this.dsCtrl.openSnackBar('Grabación exitosa', 'Aceptar');
        this.resetInvestigForm();
 
      }else {
        this.dsCtrl.openSnackBar('ATENCIÓN: Se produjo un problema al intentar actualizar el registro', 'ACEPTAR');
      }

    });
  }

  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  private fetchSolicitudes(action: string, person:Person){
    this.query = new VigilanciaBrowse()
    //delete this.query.isVigilado;

    this.query.requirenteId = this.person._id
    this.query.viewList = [];

    this.showInvestigForm = false;
    this.showVigilanciaFollowUp = false;
    this.showNovedadesFollowUp = false;
    AsistenciaHelper.cleanQueryToken(this.query, false);


    this.dsCtrl.fetchAsistenciaByQuery(this.query).subscribe(list => {
      if(list && list.length > 0){
        this.currentAsistencia = list[0];
        this.novedadesList = this.sortNovedades(this.currentAsistencia.novedades);

        this.updateAsistenciaFromPerson(this.currentAsistencia, this.person);

        this.showInvestigForm = true;

      }else {
        this.initNewAsistencia(this.person)

      }

    })
  }

  private updateAsistenciaFromPerson(asistencia: Asistencia, person: Person){
    let address = person.locaciones && person.locaciones.length && person.locaciones[0];
    let locacion = asistencia.locacion || new Locacion();
    let edad = null;

    asistencia.sexo = person.sexo;
    asistencia.fenactx = person.fenactx;

    try {
      edad = devutils.edadActual(devutils.dateFromTx(person.fenactx));
    }
    catch {
      edad = null;
    }
    asistencia.edad = edad + '';

    if(address) {
      locacion.street1 = address.street1;
      locacion.street2 = address.street2;
      locacion.streetIn = address.streetIn;
      locacion.streetOut = address.streetOut;
      locacion.hasBanio = address.hasBanio;
      locacion.hasHabitacion = address.hasHabitacion;

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
        this.novedadesList = this.sortNovedades(this.currentAsistencia.novedades);
        this.showInvestigForm = true;

      }else {
        //c onsole.log('fallo la creación de solicitud')
      }
    })

  }

  private sortNovedades(novedades: Novedad[]): Novedad[]{
    if(!novedades || !novedades.length) return [];
    
    novedades.sort((fel: Novedad, sel: Novedad)=> {
        let f_fecha = fel.fets_necesidad|| fel.fecomp_txa || 0;
        let s_fecha = sel.fets_necesidad|| sel.fecomp_txa || 0;

        if(f_fecha < s_fecha ) return -1;

        else if(f_fecha > s_fecha) return 1;

        else return 0;
    });
    return novedades;

  }

  private resetInvestigForm(){
    this.showView = false;
    this.showInvestigForm = false;

    this.showPersonBrowse = true;
    this.showVigilanciaFollowUp = true;
    this.showNovedadesFollowUp = true;

    // this.personFound = false;
    // this.showAsistenciaEditor = false;
    // this.showFollowUp = false;
    // this.asistencia = null;
    // this.currentPerson = null;
    // this.dsCtrl.resetCurrentPerson();

  }


}


