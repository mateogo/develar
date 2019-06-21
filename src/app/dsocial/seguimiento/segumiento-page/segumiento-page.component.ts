import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';

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

import {  Asistencia, 
          Alimento, 
          UpdateAsistenciaEvent, 
          UpdateAlimentoEvent, 
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../asistencia/asistencia.model';


import { Turno, TurnoAction, TurnoslModel }  from '../../turnos/turnos.model';

import { ConversationContext }  from '../../../notifications/notification.model';

const UPDATE = 'update';
const SELECT = 'select';

@Component({
  selector: 'segumiento-page',
  templateUrl: './segumiento-page.component.html',
  styleUrls: ['./segumiento-page.component.scss']
})
export class SegumientoPageComponent implements OnInit {

  public unBindList = [];

  // template helper
  public title = "Seguimiento de atención";

  public tDoc = "DNI";
  public nDoc = "";

  public currentPerson: Person;
  public contactList: PersonContactData[];
  public addressList: Address[];
  public familyList:  FamilyData[];
  public oficiosList: OficiosData[];
  public asistenciasList: Asistencia[];

  public context: ConversationContext;
  public context$: BehaviorSubject<ConversationContext>;




  //public contactData = new PersonContactData();

  public hasCurrentPerson = false;
  public personFound = false;
  public altaPersona = false;
  private personId: string;

  public isAutenticated = false;
  public currentTurno:Turno;
  
  public sectors:SectorAtencion[] = sectores;

	public showList = false;


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


    console.log('TSocial PAGE INIT')
    console.log('Turno:[%s]',  this.dsCtrl.activeTurno);
  }

  initCurrentPerson(p: Person){
    if(p){
      this.currentPerson = p;
      //this.contactData = p.contactdata[0];
      this.contactList = p.contactdata || [];
      this.addressList = p.locaciones || [];
      this.familyList  = p.familiares || [];
      this.oficiosList = p.oficios || [];

      this.context = {
        personId: this.currentPerson._id,
        personName: this.currentPerson.displayName,
        asistenciaId: null
      }

      this.emitContext(this.context);
      
      this.initAsistenciasList()



    }

    // todo: Search For S/Asistencias


  }

  initAsistenciasList(){
    this.asistenciasList = [];
    this.dsCtrl.fetchAsistenciaByPerson(this.currentPerson).subscribe(list => {
      if(list && list.length) {
      	this.asistenciasList = list;
      	this.showList = true;
      }

      this.hasCurrentPerson = true;

    })


  }

  /**********************/
  /*      Events        */
  /**********************/
  updateCore(event: UpdatePersonEvent){
    if(event.action === UPDATE){
      this.dsCtrl.updatePerson(event);
    }

  }
  // Contact Data
  updateContactList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      console.log('tsocial: READY to UpdateContactData')
      this.upsertContactList(event);
    }
  }

  upsertContactList(event:UpdateItemListEvent){
    this.currentPerson.contactdata = event.items as PersonContactData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    this.dsCtrl.updatePerson(update);
  }

  // Address Data
  updateAddressList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      console.log('tsocial: READY to UpdateAddressData')
      this.upsertAddressList(event);
    }
  }

  upsertAddressList(event:UpdateItemListEvent){
    this.currentPerson.locaciones = event.items as Address[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    this.dsCtrl.updatePerson(update);
  }

  // Family Data
  updateFamilyList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      console.log('tsocial: READY to UpdateFamilyData')
      this.upsertFamilyList(event);
    }
  }

  upsertFamilyList(event:UpdateItemListEvent){
    this.currentPerson.familiares = event.items as FamilyData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    this.dsCtrl.updatePerson(update);
  }

  // Oficios Data
  updateOficiosList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      console.log('tsocial: READY to UpdateOficiosData')
      this.upsertOficiosList(event);
    }
  }

  upsertOficiosList(event:UpdateItemListEvent){
    this.currentPerson.oficios = event.items as OficiosData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    this.dsCtrl.updatePerson(update);
  }

  updateAsistenciaList(event: UpdateAsistenciaListEvent){
    console.log('Sol/asistencia: [%s]', event.action);
    if(event.action === UPDATE){
      console.log('Sol Asistencia BUBBLED to UPDATE')
      this.initAsistenciasList();
    }
    if(event.action === SELECT){
      console.log('Sol Asistencia BUBBLED to SELECT')
      //this.initAsistenciasList();
    }
  }

  selectAsistencia(event: UpdateAsistenciaEvent){
  	console.log('followUP: [%s]', event.token.compNum);
    if(event.selected){
      this.context.asistenciaId = event.token._id;
      console.log('SELECTED')
    }else{
      this.context.asistenciaId = null;
      console.log('NOT SELECTED')

    }

    this.emitContext(this.context);
  }

  emitContext(context: ConversationContext){
    if(!this.context$){
      this.context$ = new BehaviorSubject<ConversationContext>(context);
    }

    this.context$.next(context);

  }



  // updateContactData(event:UpdateContactEvent){
  //   if(event.action === UPDATE){
  //     console.log('tsocial: READY to UpdateContactData')
  //     this.updateContactToken(event);
  //   }
  // }

  // updateContactToken(event:UpdateContactEvent){
  //   this.currentPerson.contactdata = [event.token];

  //   let update: UpdatePersonEvent = {
  //     action: event.action,
  //     token: event.type,
  //     person: this.currentPerson
  //   };
  //   this.dsCtrl.updatePerson(update);
  // }


  /**********************/
  /*      Person        */
  /**********************/
  loadPerson(id){
    this.dsCtrl.setCurrentPersonFromId(id);
  }


  /**********************/
  /*      Turnos        */
  /**********************/
  nuevoTurno(sector: SectorAtencion){

  }

  actionEvent(taction:TurnoAction){
    console.log('actionEvent BUBLED: [%s]', taction.action);
    this.processTurnoEvent(taction);
  }

  processTurnoEvent(taction: TurnoAction){
    this.dsCtrl.updateTurno(taction).subscribe(t => {
      console.log('Turno UPDATE cb');
    })

  }

}
