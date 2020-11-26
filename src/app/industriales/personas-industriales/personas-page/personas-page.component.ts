import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, BusinessMembersData, CoberturaData, DocumentData, EncuestaAmbiental, FamilyData, OficiosData, Person, PersonContactData, PersonVinculosData, SaludData, UpdateItemListEvent, UpdatePersonEvent } from '../../../entities/person/person';
import { PersonasController } from './personas.controller';

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
    private _personCtrl : PersonasController,
    private router: Router) { }

  ngOnInit(): void {

    let first = true;    
    this.personId = this._activatedRouter.snapshot.paramMap.get('id')

    this._personCtrl.actualRoute(this.router.routerState.snapshot.url, this._activatedRouter.snapshot.url);

    let sscrp2 = this._personCtrl.onReady.subscribe(readyToGo =>{
      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }

  initCurrentPage() {
    this._personCtrl.personListener.subscribe(p => {
      this.initCurrentPerson(p);
    })

    this.loadPerson(this.personId);

  }

  initCurrentPerson(p: Person) {
    if (p) {
      this.currentPerson = p;
      //this.contactData = p.contactdata[0];
      this.contactList = p.contactdata || [];
      this.addressList = p.locaciones || [];
      this.familyList = p.familiares || [];
      this.businessList = p.integrantes || [];
      this.oficiosList = p.oficios || [];
      this.saludList = p.salud || [];
      this.coberturaList = p.cobertura || [];
      this.ambientalList = p.ambiental || [];
      this.permisosList = p.permisos || [];
      this.habilitacionesList = p.habilitaciones || [];

      this.hasCurrentPerson = true;

    }
    // todo: Search For S/Asistencias
  }

  /**********************/
  /*      Events        */
  /**********************/
  updateCore(event: UpdatePersonEvent){
    if(event.action === UPDATE){
      this._personCtrl.updatePerson(event);
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
    this._personCtrl.updatePerson(update);
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
    this._personCtrl.updatePerson(update);
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
    this._personCtrl.updatePerson(update);
  }

  // Business membres data
  updateBusinessList(event:UpdateItemListEvent){
    if(event.action === UPDATE){
      this.upsertBusinessList(event);
    }
  }

  private upsertBusinessList(event:UpdateItemListEvent){
    this.currentPerson.vinculos = event.items as PersonVinculosData[];

    let update: UpdatePersonEvent = {
      action: event.action,
      token: event.type,
      person: this.currentPerson
    };

    this._personCtrl.updatePerson(update);
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
    this._personCtrl.updatePerson(update);
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
    
    this._personCtrl.updatePerson(update);
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
    
    this._personCtrl.updatePerson(update);
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
    
    this._personCtrl.updatePerson(update);
  }





  /**********************/
  /*      Person        */
  /**********************/
  loadPerson(id){
    this._personCtrl.setCurrentPersonFromId(id);
  }

  /** VOLVER */
  goBack() : void {
    this.router.navigate(['dashboard'])
  }
}
