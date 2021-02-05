import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';
import { EmpresasController } from '../../empresas.controller';

import { CensoIndustriasService, UpdateEvent, UpdateListEvent } from '../../censo-service';

import {  Person,
          Address,
          FamilyData,
          BusinessMembersData,
          OficiosData,
          SaludData,
          CoberturaData,
          EncuestaAmbiental,
          DocumentData,

          personModel,

          UpdatePersonEvent,
          UpdateItemListEvent,

          PersonContactData
        } from '../../../entities/person/person';

const UPDATE =   'update';
const NAVIGATE = 'navigate';

@Component({
  selector: 'empresa-page',
  templateUrl: './registro-empresa-page.component.html',
  styleUrls: ['./registro-empresa-page.component.scss']
})
export class RegistroEmpresaPageComponent implements OnInit {
  public unBindList = [];

  // template helper
  public title = "Datos de la Empresa";
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
  public permisosList: DocumentData[];
  public habilitacionesList: DocumentData[];

  //public contactData = new PersonContactData();

  public hasCurrentPerson = false;
  public personFound = false;
  public altaPersona = false;
  private personId: string;

  public isAutenticated = false;


  constructor(
    	private router: Router,
    	private route: ActivatedRoute,
      private empCtrl: EmpresasController,

  	) { }

  ngOnInit() {
    let first = true;
    this.hasCurrentPerson = false;
    this.personId = this.route.snapshot.paramMap.get('id')

    this.empCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    let sscrp2 = this.empCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage(this.personId);

      }
    })
    this.unBindList.push(sscrp2);
  }


  private initCurrentPage(personId: string){
    console.log('empresa-page>initCurrentPage BEGIN')
    if(!personId){
      personId = this.empCtrl.activePerson._id;
    }

    this.loadPerson(personId);

  }

  private loadPerson(id){
    if(id){
      this.empCtrl.fetchPersonById(id).then(person => {
        this.initCurrentPerson(person);
      })
    
    }else{
      this.empCtrl.openSnackBar('ERROR: No se pudo recuperar el registro de la organización (ref:#1)','ACEPTAR');
    }
    
  }


  initCurrentPerson(person: Person){
    if(person){
      this.currentPerson = person;
      //this.contactData = p.contactdata[0];
      this.contactList =   person.contactdata || [];
      this.addressList =   person.locaciones || [];
      this.familyList  =   person.familiares || [];
      this.businessList =  person.integrantes || [];
      this.oficiosList =   person.oficios || [];
      this.saludList =     person.salud || [];
      this.coberturaList = person.cobertura || [];
      this.ambientalList = person.ambiental || [];
      this.permisosList =  person.permisos || [];
      this.habilitacionesList =  person.habilitaciones || [];

      this.hasCurrentPerson = true;
      this.empCtrl.updateCurrentPerson(person)

    }else {
      this.empCtrl.openSnackBar('ERROR: No se pudo recuperar el registro de la organización (ref:#2)','ACEPTAR');
    }

    // todo: Search For S/Asistencias
  }


  /**********************/
  /*      Events        */
  /**********************/
  updateCore(event: UpdatePersonEvent){
    if(event.action === UPDATE){
      this.empCtrl.updatePerson(event);
    }

  }
  // Contact Data
  updateContactList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
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
    this.empCtrl.updatePerson(update);
  }

  // Address Data
  updateAddressList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
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
    this.empCtrl.updatePerson(update);
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
    this.empCtrl.updatePerson(update);
  }

  // Business membres data
  updateBusinessList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      this.upsertBusinessList(event);
    }
  }

  private upsertBusinessList(event:UpdateItemListEvent){
    this.currentPerson.integrantes = event.items as BusinessMembersData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    this.empCtrl.updatePerson(update);
  }

  // Permisos Habilitaciones Documentos
  updateDocumentsList(event:UpdateListEvent){
    console.log('44')
    if(event.action === UPDATE){
      this.upsertPermisosList(event);
    }
  }

  private upsertPermisosList(event:UpdateListEvent){
    this.currentPerson.permisos = event.items as DocumentData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    console.log('55')
    this.empCtrl.updatePerson(update);
  }

  // Permisos Habilitaciones Documentos
  updateHabilitacionesList(event:UpdateListEvent){
    console.log('66')
    if(event.action === UPDATE){
      this.upsertHabilitacionesList(event);
    }
  }

  private upsertHabilitacionesList(event:UpdateListEvent){
    this.currentPerson.habilitaciones = event.items as DocumentData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };
    console.log('76')
    console.log('H[%s]  P[%s]', this.currentPerson.habilitaciones.length, this.currentPerson.permisos.length);
    this.empCtrl.updatePerson(update);
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
    this.empCtrl.updatePerson(update);
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

    this.empCtrl.updatePerson(update);
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

    this.empCtrl.updatePerson(update);
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

    this.empCtrl.updatePerson(update);
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
  //   this.empCtrl.updatePerson(update);
  // }


  /**********************/
  /*      Person        */
  /**********************/



}



/***
http://develar-local.co:4200/mab/empresas/registro/5da4df4b1cd64809a3f18861

http://develar-local.co:4200/dsocial/gestion/atencionsocial/59701fab9c481d0391eb39b9
http://develar-local.co:4200/dsocial/gestion/atencionsocial/5a00cb6c3ba0cd0c576a1870

https://api.brown.gob.ar/empleados?legajo=5765

https://api.brown.gob.ar/

**/
