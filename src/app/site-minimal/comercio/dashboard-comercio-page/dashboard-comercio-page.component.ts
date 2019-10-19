import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';
import { SiteMinimalController } from '../../minimal.controller';

import { DsocialModel, Ciudadano, SectorAtencion, sectores } from '../../../dsocial/dsocial.model';

import {  Person,
          Address,
          FamilyData,
          BusinessMembersData,
          OficiosData,
          SaludData,
          CoberturaData,
          EncuestaAmbiental,
          personModel,

          UpdatePersonEvent,
          UpdateItemListEvent,

          PersonContactData 
        } from '../../../entities/person/person';

import {   Asistencia, 
          Alimento, 
          UpdateAsistenciaEvent, 
          UpdateAlimentoEvent, 
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../../dsocial/asistencia/asistencia.model';


const UPDATE = 'update';
const NAVIGATE = 'navigate';

@Component({
  selector: 'dashboard-comercio-page',
  templateUrl: './dashboard-comercio-page.component.html',
  styleUrls: ['./dashboard-comercio-page.component.scss']
})
export class DashboardComercioPageComponent implements OnInit {
  public unBindList = [];

  // template helper
  public title = "Bienvenido a su espacio de trabajo";
  public subtitle = "Datos generales";

  public tDoc = "CUIT";
  public nDoc = "";

  public currentPerson: Person;
  public contactList:   PersonContactData[];
  public addressList:   Address[];
  public familyList:    FamilyData[];
  public businessList:  BusinessMembersData[];
  public oficiosList:   OficiosData[];
  public saludList:     SaludData[];
  public coberturaList: CoberturaData[];
  public ambientalList: EncuestaAmbiental[];

  public asistenciasList: Asistencia[];


  //public contactData = new PersonContactData();

  public hasCurrentPerson = false;
  public personFound = false;
  public altaPersona = false;
  private personId: string;

  public isAutenticated = false;
  private count = 0;
  

  constructor(
    	private router: Router,
      private minimalCtrl: SiteMinimalController,
    	private route: ActivatedRoute,

  	) { }

  ngOnInit() {
    let first = true;    
    this.personId = this.route.snapshot.paramMap.get('id')
    console.log('Dashboard: BEGIN [%s]', this.personId);

    this.minimalCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    let sscrp2 = this.minimalCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;


    		console.log('Dashboard: ReadyToGo [%s] [%s]', this.personId, this.minimalCtrl.timestamp);
        console.log('Dashboard current_person: [%s]', this.minimalCtrl.activePerson);
        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }

  ngOnDestroy(){
    console.log('destroy [%s]',this.unBindList.length);
    this.unBindList.forEach(x => {x.unsubscribe()});
  }



  initCurrentPage(){
    console.log('initCurrentPage')
    this.count += 1;
    
    let sscrp3 = this.minimalCtrl.personListener.subscribe(p => {
      console.log('minController [%s]', this.minimalCtrl.timestamp);

      console.log('PERSON current   on controller [%s]', this.minimalCtrl.activePerson && this.minimalCtrl.activePerson.displayName);
      console.log('PERSON Listener  on dashboard [%s] [%s]', p, this.count);
      if(p){
          console.log('Dashboard: [%s]', p.displayName);
        this.initCurrentPerson(p);
      }
    })

    this.unBindList.push(sscrp3);
    this.loadPerson(this.personId);
  }

  initCurrentPerson(p: Person){
    if(p){
      this.currentPerson = p;
      //this.contactData = p.contactdata[0];
      this.contactList =   p.contactdata || [];
      this.addressList =   p.locaciones || [];
      this.familyList  =   p.familiares || [];
      this.businessList =  p.integrantes || [];
      this.oficiosList =   p.oficios || [];
      this.saludList =     p.salud || [];
      this.coberturaList = p.cobertura || [];
      this.ambientalList = p.ambiental || [];

      this.hasCurrentPerson = true;
      
    }
    // todo: Search For S/Asistencias
  }


  /**********************/
  /*      Events        */
  /**********************/
  updateCore(e){
    console.log('Dashboard - updateCore')
    this.router.navigate(['/mab/comercios/empresa', e.person._id]);    
  }

  gotoRolNocturnidada(){
    console.log('goto Rol Nocturnidada')
    this.router.navigate(['/rol/nocturnidad/panel']);    
  }
  
  /**********************/
  /*      Person        */
  /**********************/
  loadPerson(id){

    this.minimalCtrl.setCurrentPersonFromId(id);
  }

}



/***
http://develar-local.co:4200/mab/comercios/registro/5da4df4b1cd64809a3f18861

http://develar-local.co:4200/dsocial/gestion/atencionsocial/59701fab9c481d0391eb39b9
http://develar-local.co:4200/dsocial/gestion/atencionsocial/5a00cb6c3ba0cd0c576a1870

https://api.brown.gob.ar/empleados?legajo=5765

https://api.brown.gob.ar/

**/