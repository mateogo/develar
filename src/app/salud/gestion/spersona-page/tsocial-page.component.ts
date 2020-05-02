import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { SaludController } from '../../salud.controller';
import { SaludModel, Ciudadano, SectorAtencion, sectores } from '../../salud.model';
import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../../../develar-commons/asset-helper';

import {  Person,
          Address,
          FamilyData,
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
          AsistenciaHelper } from '../../asistencia/asistencia.model';

import {   SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, MotivoInternacion,
          Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
          MasterAllocation,UpdateInternacionEvent } from '../../internacion/internacion.model';



import { Turno, TurnoAction, TurnosModel }  from '../../turnos/turnos.model';
import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

const UPDATE = 'update';
const NAVIGATE = 'navigate';

@Component({
  selector: 'tsocial-page',
  templateUrl: './tsocial-page.component.html',
  styleUrls: ['./tsocial-page.component.scss']
})
export class TsocialPageComponent implements OnInit {

  public unBindList = [];

  // template helper
  public title = "Asistencia al VECINO/a";
  public subtitle = "Atención del Trabajador Social";

  public tDoc = "DNI";
  public nDoc = "";

  public currentPerson: Person;
  public contactList:   PersonContactData[];
  public addressList:   Address[];
  public familyList:    FamilyData[];
  public oficiosList:   OficiosData[];
  public saludList:     SaludData[];
  public coberturaList: CoberturaData[];
  public ambientalList: EncuestaAmbiental[];
  public assetList:     CardGraph[] = []
  
  public solinternacionesList: SolicitudInternacion[];
  public asistenciasList: Asistencia[];
  public showHistorial = false;

  public audit: Audit;
  public parentEntity: ParentEntity;


  //public contactData = new PersonContactData();

  public hasCurrentPerson = false;
  public hasInternaciones = false;
  private hasPersonIdOnURL = true;
  public personFound = false;
  public altaPersona = false;
  private personId: string;

  public isAutenticated = false;
  public currentTurno:Turno;
  
  public sectors:SectorAtencion[] = sectores;


  constructor(
  		private dsCtrl: SaludController,
    	private router: Router,
    	private route: ActivatedRoute,

  	) { }

  ngOnInit() {
    let first = true;    
    this.personId = this.route.snapshot.paramMap.get('id')
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    if(!this.personId){
      this.hasPersonIdOnURL = false;
    }

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }


  initCurrentPage(){

    if(!this.personId){
      if(this.dsCtrl.activePerson){
        this.personId = this.dsCtrl.activePerson._id;
        this.initCurrentPerson(this.dsCtrl.activePerson);

      } else {
        this.navigateToRecepcion()
      }

    } else {
      if(!this.dsCtrl.activePerson || this.dsCtrl.activePerson._id !== this.personId){
        this.loadPerson(this.personId);

      } else {
        this.initCurrentPerson(this.dsCtrl.activePerson);

      }

    }
  }

  initCurrentPerson(p: Person){
    if(p && this.currentPerson && p._id === this.currentPerson._id){
      return;
    }

    if(p){
      this.currentPerson = p;
      //this.contactData = p.contactdata[0];
      this.contactList = p.contactdata || [];
      this.addressList = p.locaciones || [];
      this.familyList  = p.familiares || [];
      this.oficiosList = p.oficios || [];
      this.saludList =   p.salud || [];
      this.coberturaList = p.cobertura || [];
      this.ambientalList = p.ambiental || [];
      this.assetList = p.assets || [];
      
      this.initAsistenciasList()
      this.initSolInternaciones();

      this.audit = this.dsCtrl.getAuditData();
      this.parentEntity = {
        entityType: 'person',
        entityId: this.currentPerson._id,
        entitySlug: this.currentPerson.displayName
      }
    }
 
  }

  initSolInternaciones(){
    this.solinternacionesList = [];
    this.dsCtrl.fetchInternacionesByPersonId(this.currentPerson._id).subscribe(list =>{

      this.solinternacionesList = list || [];
      if(this.solinternacionesList && this.solinternacionesList.length){
        this.hasInternaciones = true;
      }
    })
  }


  initAsistenciasList(){
    this.asistenciasList = [];
    this.dsCtrl.fetchAsistenciaByPerson(this.currentPerson).subscribe(list => {
      this.asistenciasList = list || [];
      this.sortProperly(this.asistenciasList);

      this.hasCurrentPerson = true;
    })
  }

  sortProperly(records){
    records.sort((fel, sel)=> {
      if(fel.fecomp_tsa < sel.fecomp_tsa) return 1;
      else if(fel.fecomp_tsa > sel.fecomp_tsa) return -1;
      else return 0;
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
      this.upsertContactList(event);
    }
  }

  private upsertContactList(event:UpdateItemListEvent){
    this.currentPerson.contactdata = event.items as PersonContactData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    this.dsCtrl.updatePerson(update);
  }

  auditEntregas(){

    if(this.hasPersonIdOnURL){
      this.router.navigate(['../../', this.dsCtrl.atencionRoute('auditoria'), 
         this.personId], {relativeTo: this.route});

    }else {
      this.router.navigate(['../', this.dsCtrl.atencionRoute('auditoria'), 
         this.personId], {relativeTo: this.route});

    }


  }

  // Address Data
  updateAddressList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      this.upsertAddressList(event);
    }
  }

  private upsertAddressList(event:UpdateItemListEvent){
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
      this.upsertFamilyList(event);
    }
  }

  private upsertFamilyList(event:UpdateItemListEvent){
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
      this.upsertOficiosList(event);
    }
  }


  private upsertOficiosList(event:UpdateItemListEvent){
    this.currentPerson.oficios = event.items as OficiosData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    this.dsCtrl.updatePerson(update);
  }

  // Salud Data
  updateSaludList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      this.upsertSaludList(event);
    }
  }

  private upsertSaludList(event:UpdateItemListEvent){
    this.currentPerson.salud = event.items as SaludData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    
    this.dsCtrl.updatePerson(update);
  }

  // Salud Data
  updateCoberturaList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      this.upsertCoberturaList(event);
    }
  }

  private upsertCoberturaList(event:UpdateItemListEvent){
    this.currentPerson.cobertura = event.items as CoberturaData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    
    this.dsCtrl.updatePerson(update);
  }

  // Encuesta ambiental Data
  updateAmbientalList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      this.upsertAmbientalList(event);
    }
  }

  private upsertAmbientalList(event:UpdateItemListEvent){
    this.currentPerson.ambiental = event.items as EncuestaAmbiental[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    
    this.dsCtrl.updatePerson(update);
  }

  // Assets
  updateAssetList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      this.upsertAssetlList(event);
    }
  }

  upsertAssetlList(event:UpdateItemListEvent){
    this.currentPerson.assets = event.items as CardGraph[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    
    this.dsCtrl.updatePerson(update);
  }




  updateAsistenciaList(event: UpdateAsistenciaListEvent){

    if(event.action === UPDATE){
      this.initAsistenciasList();
    }

    if(event.action === NAVIGATE){
      if(this.hasPersonIdOnURL){
        this.router.navigate(['../../', this.dsCtrl.atencionRoute('seguimiento'), 
           this.personId], {relativeTo: this.route});

      }else{
        this.router.navigate(['../', this.dsCtrl.atencionRoute('seguimiento'), 
           this.personId], {relativeTo: this.route});
      }
     }

  }




  // updateContactData(event:UpdateContactEvent){
  //   if(event.action === UPDATE){
  //     c onsole.log('tsocial: READY to UpdateContactData')
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
    this.dsCtrl.setCurrentPersonFromId(id).then(p => {
      if(p){
        this.initCurrentPerson(p);

      }
    });
  }


  /**********************/
  /*      Turnos        */
  /**********************/
  navigateToRecepcion(){
    if(this.hasPersonIdOnURL){
      this.router.navigate(['../../', this.dsCtrl.atencionRoute('recepcion')], {relativeTo: this.route});

    } else {
      this.router.navigate(['../', this.dsCtrl.atencionRoute('recepcion')], {relativeTo: this.route});
    }

  }


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
/***
http://develar-local.co:4200/dsocial/gestion/atencionsocial/59701fab9c481d0391eb39b9
http://develar-local.co:4200/dsocial/gestion/atencionsocial/5a00cb6c3ba0cd0c576a1870

https://api.brown.gob.ar/empleados?legajo=5765

https://api.brown.gob.ar/

**/