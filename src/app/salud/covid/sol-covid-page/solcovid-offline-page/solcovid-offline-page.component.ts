import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { LocalStorageService } from '../../../salud.localstorage.service';

import { SaludController } from '../../../salud.controller';
import { SaludModel, Ciudadano, SectorAtencion, sectores } from '../../../salud.model';
import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../../../../develar-commons/asset-helper';

import { devutils }from '../../../../develar-commons/utils';

import {  Person,
          personModel,
          UpdateEventEmitter,

        } from '../../../../entities/person/person';

import {  Asistencia,
          AsistenciaBrowse, 
          Locacion, 
          UpdateAsistenciaEvent, 
          AsistenciaHelper } from '../../../asistencia/asistencia.model';

const UPLOAD =   'upload';
const UPDATE =   'update';
const NAVIGATE = 'navigate';
const CANCEL =   'cancel';
const DELETE =   'delete';
const SELECT =   'select';
const TOKEN_TYPE = 'asistencia';

@Component({
  selector: 'solcovid-offline-page',
  templateUrl: './solcovid-offline-page.component.html',
  styleUrls: ['./solcovid-offline-page.component.scss']
})
export class SolcovidOfflinePageComponent implements OnInit {
  public unBindList = [];

  // template helper
  public title = "Programa DeTecTaRRR";
  public subtitle = "Atención 0800 22 COVID";

  public asistenciasList: Asistencia[];

  public showHistorial = false;

  //COVID
	public asistencia: Asistencia;
  public tDoc: string = 'DNI';
  public nDoc: string;

  public personFound = false;
  public showAsistenciaEditor = false;
  public searchPerson = false;
  public showFollowUp = false;
  public modoOffLine = false;
  public showLocalData = false;

  public currentPerson: Person;

  constructor(
  		private dsCtrl: SaludController,
    	private router: Router,
    	private route: ActivatedRoute,
      private localService: LocalStorageService

  	) { }

  ngOnInit() {
    let first = true;    

    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    this.localFetchSolicitudes();

    this.resetForm()
    //this.localService.testLocalStorage();

    let algo = LocalStorageService.loadInitialState();
    console.log('localStorage Initial')
    console.dir(algo);
  }


  /**********************/
  /*      Events        */
  /**********************/
  nuevaEncuesta(){
  	console.log('Nueva Encuesta TO BEGIN')
    this.initNewAsistencia();
    this.editForm();
  }

  altaEvent(token: UpdateEventEmitter){
    this.nDoc = token.ndoc;
    this.tDoc = token.tdoc;
    if(token.tdoc === 'PROV' && !token.ndoc) {
      this.createNumeroProvisorio(this.tDoc, this.nDoc);

    }else{
      this.fetchAsistenciasByDNI(this.tDoc, this.nDoc);

    }
  }



  /**********************/
  /*      COVID        */
  /**********************/
  saveLocal(event: UpdateAsistenciaEvent){
    if(event.action === CANCEL){
      if(!this.showLocalData) this.localFetchSolicitudes()


    }else if(event.action === UPDATE){
      this.saveInLocalStorage(event.token);

    }

    this.resetForm();

  }

  updateAsistenciaToken(event: UpdateAsistenciaEvent){
    console.log('Offline PAGE BUBBLED: [%s]', event.action);
    if(event.action === UPDATE){
      this.resetForm();
      this.showLocalData = false;

      this.asistencia = event.token;

      this.testAsistenciaList(this.asistencia);

      this.editForm();

    }else if(event.action === UPLOAD){
      console.log('UPLOAD TO BEGIN')

    }
  }

  private testAsistenciaList(asistencia: Asistencia){
    let bingo = this.asistenciasList.find(t => t=== asistencia);
    console.log('testAsistencia [%s]', bingo )

  }

  private saveInLocalStorage(asistencia: Asistencia){

    let asis = this.asistenciasList.find(t => t === asistencia);
    console.log('saveInLocal [%s]', asis);

    if(!asis){
      this.asistenciasList.push(asistencia);
      this.localService.setItem('asistencias', this.asistenciasList);
    }
    this.reloadLocalStorage()

  }

  private reloadLocalStorage(){
    this.showLocalData = false;
    setTimeout(()=> {
      this.localFetchSolicitudes()      
    },300)

  }


  manageBase(event: UpdateAsistenciaEvent){

  	this.emitEvent(event);
  }

  private emitEvent(event: UpdateAsistenciaEvent){
  	if(event.action === UPDATE ){
  		//
      this.dsCtrl.manageCovidRecord(event.token).subscribe(t =>{
        if(t){
          this.asistencia = t;
          this.dsCtrl.openSnackBar('Grabación exitosa', 'Aceptar');
          this.fetchSolicitudes();
          this.resetForm();

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



  private createNumeroProvisorio(tdoc, ndoc){

    this.dsCtrl.fetchSerialDocumProvisorio().subscribe(serial =>{
      this.nDoc = serial.pnumero + serial.offset + '';
      this.fetchAsistenciasByDNI(this.tDoc, this.nDoc);

    });

  }

  private fetchAsistenciasByDNI(tdoc, ndoc){
    this.dsCtrl.fetchAsistenciaByDNI(this.tDoc, this.nDoc).subscribe(asis =>{
      if(asis && asis.length){
        this.asistencia = asis[0];
        this.asistencia.ndoc = this.nDoc;
        this.asistencia.tdoc = this.tDoc;

        if(this.asistencia.denuncia){
          this.asistencia.denuncia.dendoc = this.asistencia.denuncia.dendoc ? this.asistencia.denuncia.dendoc : this.asistencia.ndoc;
          this.asistencia.denuncia.dentel = this.asistencia.denuncia.dentel ? this.asistencia.denuncia.dentel : this.asistencia.telefono;
        }

        this.editAsistencia();

      }else {
         this.initNewAsistencia();

      }

    })

  }

  private initNewAsistencia(){
    let isIVR = this.dsCtrl.isUserMemberOf('ivr:operator');

    if(isIVR){
      this.asistencia = AsistenciaHelper.initNewAsistenciaCovid('covid', 'ivr', this.currentPerson);
    }else{
      this.asistencia = AsistenciaHelper.initNewAsistenciaCovid('covid', 'com', this.currentPerson);
    }

    this.asistencia.tipo = 4;
    this.asistencia.tdoc = this.tDoc;
    this.asistencia.ndoc = this.nDoc;

  }

  private localFetchSolicitudes(){
    this.asistenciasList = this.localService.getItem('asistencias') || [];
    this.showLocalData = true;
  }


  private fetchSolicitudes(){
    this.showLocalData = false;
    let query = new AsistenciaBrowse();
    query.tipo = "4";

    this.dsCtrl.fetchAsistenciaByQuery(query).subscribe(list => {
      if(list && list.length > 0){
        this.asistenciasList = list;
        this.localService.setItem('asistencias', this.asistenciasList)

        this.showLocalData = true;

      }else {
        this.asistenciasList = [];
        this.showLocalData = false;
      }
    })
  }



  //ok
  private editForm(){
    this.showAsistenciaEditor = true;

    this.searchPerson = false;
    this.personFound = false;
    this.showFollowUp = false;
    this.searchPerson = false;

  }

  //ok
  private followUpForm(){
    this.showFollowUp = true;

    this.personFound = false;
    this.showAsistenciaEditor = false;
    this.searchPerson = false;

  }

  //ok
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

}
