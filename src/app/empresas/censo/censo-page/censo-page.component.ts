import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { EmpresasController } from '../../empresas.controller';
import { CensoIndustriasController } from '../../censo.controller';

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

import { CensoIndustrias } from '../../censo.model';

const UPDATE = 'update';
const NAVIGATE = 'navigate';

@Component({
  selector: 'app-censo-page',
  templateUrl: './censo-page.component.html',
  styleUrls: ['./censo-page.component.scss']
})
export class CensoPageComponent implements OnInit {
  public unBindList = [];

  // template helper
  public title = "Censo Industrias 2020 - MAB";
  public subtitle = "Datos generales";

  //CensoIndustrias
  public currentCenso: CensoIndustrias;


  // Block SaludData
  public censoHeaderTitleTxt = "Inicie Censo 2020";
  public censoHeaderTxt = "Alta / edición de datos generales";





  public currentPerson: Person;
  public contactList:   PersonContactData[];
  public addressList:   Address[];
  public familyList:    FamilyData[];
  public businessList:  BusinessMembersData[];
  public oficiosList:   OficiosData[];
  public saludList:     SaludData[];
  public coberturaList: CoberturaData[];
  public ambientalList: EncuestaAmbiental[];

  public hasCurrentPerson = false;
  public personFound = false;
  public altaPersona = false;
  private personId: string;

  public isAutenticated = false;
  private count = 0;
  
  private censoId: string;


  constructor(
    	private router: Router,
      private censoCtrl: CensoIndustriasController,
      private empCtrl: EmpresasController,
    	private route: ActivatedRoute,
  	) { }

  ngOnInit() {
    let first = true;    
    this.censoId = this.route.snapshot.paramMap.get('id')

    this.empCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    let sscrp2 = this.empCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;
        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }

  ngOnDestroy(){
    this.unBindList.forEach(x => {x.unsubscribe()});
  }



  private initCurrentPage(){

    let sscrp3 = this.empCtrl.personListener.subscribe(p => {
      if(p){
        this.initCurrentPerson(p);
      }
    })

    this.unBindList.push(sscrp3);
  
  }



  private initCurrentPerson(p: Person){
    if(p){
      console.log('CensoPage: [%s]', p.displayName);
      this.personId = p._id;
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
    //this.router.navigate(['/mab/comercios/empresa', e.person._id]);    
  }

  navigateToProfile(e: UpdatePersonEvent){
    if(e.action === NAVIGATE){
      this.router.navigate(['/mab/comercios/empresa', e.person._id]);    
    }

  }

  editCensoHeader(e){
    this.upsertCensoIndustrias();

  }

  /**********************/
  /*      Person        */
  /**********************/
  loadPerson(id?){
    if(id){
      this.empCtrl.setCurrentPersonFromId(id);

    }else{
      this.empCtrl.setCurrentPersonFromUser();
      
    }
  }

  /************************/
  /*     Censo           */
  /**********************/
  private upsertCensoIndustrias(){
    if(this.currentCenso){
      console.log('update')


    }else{
      console.log('create: Ready to Navigate')
      this.router.navigate(['/map/empresas/gestion/censo2020/core'])

    }
  }






}



/***
http://develar-local.co:4200/mab/empresas/gestion/registro/5e52cc650dbe2f1ac00d5c38

http://develar-local.co:4200/mab/comercios/registro/5da4df4b1cd64809a3f18861

http://develar-local.co:4200/dsocial/gestion/atencionsocial/59701fab9c481d0391eb39b9
http://develar-local.co:4200/dsocial/gestion/atencionsocial/5a00cb6c3ba0cd0c576a1870

https://api.brown.gob.ar/empleados?legajo=5765

https://api.brown.gob.ar/

**/
