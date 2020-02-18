import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { DsocialController } from '../../dsocial.controller';
import { DsocialModel, Ciudadano, SectorAtencion, sectores } from '../../dsocial.model';

import {  Person,
          Address,
          FamilyData,
          OficiosData,
          personModel,
          UpdatePersonEvent,
          UpdateContactEvent,
          UpdateFamilyEvent,
          UpdateOficiosEvent,
          UpdateItemListEvent,
          UpdateAddressEvent,
          PersonContactData 
        } from '../../../entities/person/person';


import { 	RemitoAlmacen, 
          RemitoalmacenBrowse,
					UpdateRemitoEvent,
					UpdateRemitoListEvent,
					RemitoAlmacenTable } from '../../alimentos/alimentos.model';


const UPDATE = 'update';
const TOKEN_TYPE = 'remitoalmacen';


@Component({
  selector: 'entregas-export',
  templateUrl: './entregas-export.component.html',
  styleUrls: ['./entregas-export.component.scss']
})
export class EntregasExportComponent implements OnInit {

  public unBindList = [];

  // template helper
  public title = "GALPÓN: Exportación de movimientos";
  public subtitle = "Movimientos de mercadería del Galpón";

  public query: RemitoalmacenBrowse ;

  public tDoc = "DNI";
  public nDoc = "";

  public currentPerson: Person;
  public contactList: PersonContactData[];
  public addressList: Address[];
  public familyList:  FamilyData[];
  public oficiosList: OficiosData[];


  //public contactData = new PersonContactData();  
  public sectors:SectorAtencion[] = sectores;

  // RemitosAlmacen
  public remitosList: RemitoAlmacen[];
  public itemsFound = false;
  public selectedVoucher: RemitoAlmacen;

  public showPanel = true;
  public showTable = false;
  public showView  = false;


  constructor(
  		private dsCtrl: DsocialController,
    	private router: Router,
    	private route: ActivatedRoute,

  	) { }

  ngOnInit() {
    let first = true;    

    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }


  initCurrentPage(){
  	this.query = new RemitoalmacenBrowse();

    // if(this.dsCtrl.activePerson && this.personId && this.dsCtrl.activePerson._id !== this.personId){
    //     this.loadPerson(this.personId);
    // }

    // if(!this.dsCtrl.activePerson && this.personId){
    //     this.loadPerson(this.personId);
    // }

    // if(this.dsCtrl.activePerson){
    //     this.initCurrentPerson(this.dsCtrl.activePerson);
    // }


    this.fetchRemitos();

  }

  private fetchRemitos(){
    this.dsCtrl.fetchRemitoAlmacenByQuery({avance: 'emitido'}).subscribe(list => {
      if(list && list.length > 0){
        this.remitosList = list;
        this.dsCtrl.updateRemitosTableData();

        this.showTable = true;

      }

    })

  }

  onSubmit(){
    this.dsCtrl.updateAvanceRemito('remitoalmacen', 'entregado', this.selectedVoucher._id);
    setTimeout(()=>{
      this.fetchRemitos();
      setTimeout(()=>{this.showView = false;}, 1000)      
    },1000)

  }


  onCancel(){
    this.showView = false;
  }


  updateTableData(){

  }

  initCurrentPerson(p: Person){
    if(p){
      this.currentPerson = p;
    }

  }


  /**********************/
  /*      Events        */
  /**********************/

  tableAction(action){
    // let selection = this.dsCtrl.remitosSelectionModel;
    // let selected = selection.selected as RemitoAlmacenTable[];
    // if(selected && selected.length){
    //   this.selectedVoucher = this.dsCtrl.lookUpRemitoAlmacen(selected[0]);
    //   this.showView = true

    // }else{
    //   this.showView = false;
    // }

    // selected.forEach(t =>{

    //   this.dsCtrl.updateAvanceAsistencia('asistencia', 'autorizado', t.asistenciaId);
    //   console.log(t.compNum);

    // })
  }


  /**********************/
  /*      Person        */
  /**********************/
  loadPerson(id){
    this.dsCtrl.setCurrentPersonFromId(id).then(p => {
      if(p){
        this.initCurrentPerson(p);

      }
    });
  }


}
