import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  Address, 
          BusinessMembersData, 
          CoberturaData, 
          DocumentData, 
          EncuestaAmbiental, 
          FamilyData, 
          OficiosData, 
          Person, 
          PersonContactData, 
          SaludData, UpdateItemListEvent, UpdatePersonEvent } from '../../../entities/person/person';

import { EmpresasController } from '../../../empresas/empresas.controller';

const UPDATE =   'update';
const NAVIGATE = 'navigate';
@Component({
  selector: 'app-personas-page',
  templateUrl: './personas-page.component.html',
  styleUrls: ['./personas-page.component.scss']
})
export class PersonasPageComponent implements OnInit {

  public unBindList = [];
  title : string = 'Mis datos personales'
  currentPerson : Person;
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
  public hasCurrentPerson : boolean = false;
  personId : string;

  
  constructor(
    private _activatedRouter: ActivatedRoute,
    private empCtrl : EmpresasController,
    private router: Router) { }

  ngOnInit(): void {
    let first = true;
    this.hasCurrentPerson = false;
    this.personId = this._activatedRouter.snapshot.paramMap.get('id')

    this.empCtrl.actualRoute(this.router.routerState.snapshot.url, this._activatedRouter.snapshot.url);

    let sscrp2 = this.empCtrl.onReady.subscribe(readyToGo =>{
      if(readyToGo && first){
        first = false;

        this.initCurrentPage(this.personId);

      }
    })
    this.unBindList.push(sscrp2);
  }

  initCurrentPage(personId: string) {
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


  initCurrentPerson(person: Person) {
    if (person) {
      this.currentPerson = person;
      //this.contactData = person.contactdata[0];
      this.contactList = person.contactdata || [];
      this.addressList = person.locaciones || [];
      this.familyList = person.familiares || [];
      this.businessList = person.integrantes || [];
      this.oficiosList = person.oficios || [];
      this.saludList = person.salud || [];
      this.coberturaList = person.cobertura || [];
      this.ambientalList = person.ambiental || [];
      this.permisosList = person.permisos || [];
      this.habilitacionesList = person.habilitaciones || [];

      this.hasCurrentPerson = true;
      this.empCtrl.updateCurrentPerson(person)

    }else {
      this.empCtrl.openSnackBar('ERROR: No se pudo recuperar el registro de la organización (ref:#2)','ACEPTAR');
    }
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

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };

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





  /**********************/
  /*      Person        */
  /**********************/

  /** VOLVER */
  goBack() : void {
    this.router.navigate(['dashboard'])
  }
}
