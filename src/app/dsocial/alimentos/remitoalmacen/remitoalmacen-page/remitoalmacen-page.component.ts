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

import {   Asistencia, 
          Alimento, 
          UpdateAsistenciaEvent, 
          UpdateAlimentoEvent, 
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { RemitoAlmacen, UpdateRemitoEvent } from '../../alimentos.model';
import { Turno, TurnoAction, TurnoslModel }  from '../../../turnos/turnos.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'remitoalmacen';


@Component({
  selector: 'remitoalmacen-page',
  templateUrl: './remitoalmacen-page.component.html',
  styleUrls: ['./remitoalmacen-page.component.scss']
})
export class RemitoalmacenPageComponent implements OnInit {
	@Input() remito: RemitoAlmacen;
  @Input() asistencia: Asistencia;
	@Output() updateRemito = new EventEmitter<UpdateRemitoEvent>();


  public unBindList = [];

  // template helper
  public title = "Emisión de Vale de Entrega";
  public subtitle = "Ayuda directa";

  public tDoc = "DNI";
  public nDoc = "";

  public currentPerson: Person;
  public contactList: PersonContactData[];
  public addressList: Address[];
  public familyList:  FamilyData[];
  public oficiosList: OficiosData[];
  public asistenciasList: Asistencia[];


  //public contactData = new PersonContactData();

  public hasCurrentPerson = false;
  public personFound = false;
  public altaPersona = false;
  private personId: string;

  public isAutenticated = false;
  public currentTurno:Turno;
  
  public sectors:SectorAtencion[] = sectores;


  public showPanel = true;


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
        console.log('readyToGo');

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }


  initCurrentPage(){
    this.dsCtrl.personListener.subscribe(p => {
      console.log('personListener [%s]', (p? p.displayName :'NO-PERSON'))

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


    console.log('Remito ALMACEN PAGE INIT')
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
  	console.log('CREATE remitoalmacen-page: [%s] [%s]', event.action, (this.remito === event.token));
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
    console.log('Init New Remito')
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
        action: this.asistencia.action,
        compNum: this.asistencia.compNum
      }

    }
  }

  emitEvent(event:UpdateRemitoEvent){
    this.updateRemito.next(event);

  }



  /**********************/
  /*      Person        */
  /**********************/
  loadPerson(id){
    this.dsCtrl.setCurrentPersonFromId(id);
  }


}
