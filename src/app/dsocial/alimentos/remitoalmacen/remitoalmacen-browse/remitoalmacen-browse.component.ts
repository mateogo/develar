import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { DsocialController } from '../../../dsocial.controller';
import { DsocialModel, Ciudadano, SectorAtencion, sectores } from '../../../dsocial.model';

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
        } from '../../../../entities/person/person';


import { 	RemitoAlmacen, 
					UpdateRemitoEvent,
					UpdateRemitoListEvent,
					RemitoAlmacenTable } from '../../alimentos.model';

import { Turno, TurnoAction, TurnosModel }  from '../../../turnos/turnos.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'remitoalmacen';


@Component({
  selector: 'remitoalmacen-browse',
  templateUrl: './remitoalmacen-browse.component.html',
  styleUrls: ['./remitoalmacen-browse.component.scss']
})
export class RemitoalmacenBrowseComponent implements OnInit {
	@Input() items: Array<RemitoAlmacen>;
	@Output() updateItems = new EventEmitter<UpdateRemitoListEvent>();

	@Input() remito: RemitoAlmacen;
  @Input() asistencia: RemitoAlmacen;
	@Output() updateRemito = new EventEmitter<UpdateRemitoEvent>();


  public unBindList = [];

  // template helper
  public title = "Vales de Alimentos";
  public subtitle = "Ayuda directa";

  public tDoc = "DNI";
  public nDoc = "";

  public currentPerson: Person;
  public contactList: PersonContactData[];
  public addressList: Address[];
  public familyList:  FamilyData[];
  public oficiosList: OficiosData[];


  //public contactData = new PersonContactData();

  public hasCurrentPerson = false;
  public personFound = false;
  public altaPersona = false;
  private personId: string;

  public isAutenticated = false;
  public currentTurno:Turno;
  
  public sectors:SectorAtencion[] = sectores;

  // RemitosAlmacen
  public remitosList: RemitoAlmacen[];
  public itemsFound = false;
  public selectedVoucher: RemitoAlmacen;

  public showPanel = true;
  public showTable = false;
  public showView = false;


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

      }else{
        //this.initCurrentPerson(this.dsCtrl.activePerson);
      }
    }

    if(!this.dsCtrl.activePerson && this.personId){
        this.loadPerson(this.personId);
    }

    this.fetchRemitos();

  }

  fetchRemitos(){
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


  initCurrentPerson(p: Person){
    if(p){
      this.currentPerson = p;
      //this.contactData = p.contactdata[0];
      this.contactList = p.contactdata || [];
      this.addressList = p.locaciones || [];
      this.familyList  = p.familiares || [];
      this.oficiosList = p.oficios || [];
      
    }

    // todo: Search For S/Asistencias


  }


  /**********************/
  /*      Events        */
  /**********************/
  createRemito(event: UpdateRemitoEvent){

    if(event.action === UPDATE){
      this.initNewRemito(event);

      this.dsCtrl.manageRemitosAlmacenRecord('remitoalmacen',this.remito).subscribe(remito =>{
        this.remito = remito;
        event.token = remito;
        this.emitEvent(event);


      });

    } else {
      this.emitEvent(event);
    }

  }

  initNewRemito(event: UpdateRemitoEvent){
    this.remito = event.token;
    this.remito.deposito =   this.remito.deposito || 'almacen';
    this.remito.tmov =       this.remito.tmov || 'entrega';
    this.remito.action =     this.remito.action || 'alimentos';
    this.remito.description= this.remito.description || '';
    this.remito.sector =     this.remito.sector || 'alimentos';
    this.remito.estado =     this.remito.estado || 'activo';
    this.remito.avance =     this.remito.avance || 'emitido';
    if(this.asistencia){
      this.remito.parentId = this.asistencia._id;
      this.remito.parent = {
        id: this.asistencia._id,
        type: 'asistencia',
        kit: this.asistencia.parent && this.asistencia.parent.type,
        action: this.asistencia.action,
        compNum: this.asistencia.compNum
      }

    }
  }

  emitEvent(event:UpdateRemitoEvent){
    this.updateRemito.next(event);

  }

  tableAction(action){
    let selection = this.dsCtrl.remitosSelectionModel;
    let selected = selection.selected as RemitoAlmacenTable[];
    if(selected && selected.length){
      this.selectedVoucher = this.dsCtrl.lookUpRemitoAlmacen(selected[0]);
      this.showView = true

    }else{
      this.showView = false;
    }

    // selected.forEach(t =>{

    //   this.dsCtrl.updateAvanceAsistencia('asistencia', 'autorizado', t.asistenciaId);
    //   console.log(t.compNum);

    // })
  }


  /**********************/
  /*      Person        */
  /**********************/
  loadPerson(id){
    this.dsCtrl.setCurrentPersonFromId(id);
  }


}
