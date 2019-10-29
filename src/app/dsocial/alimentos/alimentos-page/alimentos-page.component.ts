import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { DsocialController } from '../../dsocial.controller';
import { DsocialModel, Ciudadano, SectorAtencion, Serial, sectores } from '../../dsocial.model';

import { RemitoAlmacen, RemitoAlmacenModel,  UpdateRemitoEvent } from '../alimentos.model';

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

import {  Asistencia, 
          Alimento, 
          UpdateAsistenciaEvent, 
          UpdateAlimentoEvent, 
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../asistencia/asistencia.model';


import { Turno, TurnoAction, TurnosModel }  from '../../turnos/turnos.model';

const UPDATE = 'update';
const CREATE = 'create';

@Component({
  selector: 'alimentos-page',
  templateUrl: './alimentos-page.component.html',
  styleUrls: ['./alimentos-page.component.scss']
})
export class AlimentosPageComponent implements OnInit {
  public unBindList = [];

  // template helper
  public title = "Ayuda directa al vecino/a";
  public subtitle = "Emisión de vales de entrega";
  public titleRemitos = "Historial de entregas";
  public tDoc = "DNI";
  public nDoc = "";

  //Person
  public currentPerson: Person;
  public contactList: PersonContactData[];
  public addressList: Address[];
  public familyList:  FamilyData[];
  public oficiosList: OficiosData[];

  public hasCurrentPerson = false;
  public personFound = false;
  public altaPersona = false;
  private personId: string;

  // Sol de Asistencia
  public asistenciasList: Asistencia[];
  public currentAsistencia:Asistencia;

  // Remitos
  public remitosList: RemitoAlmacen[];
  public emitRemito = false;
  public remitoalmacen: RemitoAlmacen;
  public showHistorial = false;


  // Turno
  public currentTurno:Turno;
  
  // datos generales
  public sectors:SectorAtencion[] = sectores;



  constructor(
  		private dsCtrl: DsocialController,
    	private router: Router,
    	private route: ActivatedRoute,

  	) { }

  ngOnInit() {
    let first = true;    
    this.personId = this.route.snapshot.paramMap.get('id')

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }

  initCurrentPage(){
    this.dsCtrl.personListener.subscribe(p => {

      this.initCurrentPerson(p);
    })

    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    
    if(this.dsCtrl.activePerson && this.personId){
      if(this.dsCtrl.activePerson._id !== this.personId){
        this.loadPerson(this.personId);

      }
    }

    if(!this.dsCtrl.activePerson && this.personId){
        this.loadPerson(this.personId);
    }

  }


  /**********************/
  /*      Events        */
  /**********************/
  updateCore(event: UpdatePersonEvent){
    if(event.action === UPDATE){
      this.dsCtrl.updatePerson(event);
    }
  }

  refreshState(){
    this.emitRemito = false;
    this.loadHistorialRemitos();

  }


  /**********************/
  /*     Remito        */
  /********************/
  updateRemitoState(event: UpdateAsistenciaEvent){
    this.refreshState();

  }


  initNewRemito(asistencia: Asistencia){

    let action = asistencia.action;
    let slug = '';
    let sector = asistencia.sector;
    let serial: Serial;
    let person = this.currentPerson;
    let kitEntrega = '';
    let qty = 1;

    if(asistencia.modalidad){
      kitEntrega = asistencia.modalidad.type;
      qty = asistencia.modalidad.qty;
    }

    this.remitoalmacen = RemitoAlmacenModel.initNewRemito(action, slug, sector, serial, person, kitEntrega, qty)
    this.emitRemito = true;
  }

  loadHistorialRemitos(){
    this.dsCtrl.fetchRemitoAlmacenByPerson(this.currentPerson).subscribe(list =>{
      this.remitosList = list || []
      this.sortProperly(this.remitosList);
      if(list && list.length){
        this.showHistorial = true;
      }else{
        this.showHistorial = false;

      }


    })
  }
  sortProperly(records){
    records.sort((fel, sel)=> {
      if(!fel.ts_alta) fel.ts_alta = "zzzzzzz";
      if(!sel.ts_alta) sel.ts_alta = "zzzzzzz";

      if(fel.ts_alta<sel.ts_alta) return 1;
      else if(fel.ts_alta>sel.ts_alta) return -1;
      else return 0;
    })


  }



  /**********************/
  /*      Person        */
  /**********************/
  loadPerson(id){
    this.dsCtrl.setCurrentPersonFromId(id);
  }

  initCurrentPerson(p: Person){
    if(p){
      this.currentPerson = p;
      //this.contactData = p.contactdata[0];
      this.contactList = p.contactdata || [];
      this.addressList = p.locaciones || [];
      this.familyList  = p.familiares || [];
      this.oficiosList = p.oficios || [];
      
      this.initAsistenciasList();
      this.refreshState();

    }

  }

  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  asistenciaSelected(event: UpdateAsistenciaEvent){

    if(event.action === CREATE){
      this.currentAsistencia = event.token;
      let error = AsistenciaHelper.checkVoucherConditions(this.currentAsistencia, this.remitosList);

      if(error.valid) {
        this.initNewRemito(this.currentAsistencia);
      }else {
        //todo negativa
        this.dsCtrl.openSnackBar(error.message, 'Aceptar');
      }


    }
  }



  initAsistenciasList(){
    this.asistenciasList = [];
    this.dsCtrl.fetchAsistenciaByPerson(this.currentPerson).subscribe(list => {

      this.asistenciasList = AsistenciaHelper.filterActiveAsistencias(list);

      this.sortAsistenciasProperly(this.asistenciasList);

      this.hasCurrentPerson = true;
    })
  }

  sortAsistenciasProperly(records){
    records.sort((fel, sel)=> {
      if(fel.fecomp_tsa < sel.fecomp_tsa) return 1;
      else if(fel.fecomp_tsa > sel.fecomp_tsa) return -1;
      else return 0;
    })
  }




  /**********************/
  /*      Turnos        */
  /**********************/
  nuevoTurno(sector: SectorAtencion){

  }

  actionEvent(taction:TurnoAction){
    this.processTurnoEvent(taction);
  }

  processTurnoEvent(taction: TurnoAction){
    this.dsCtrl.updateTurno(taction).subscribe(t => {
    })

  }

}