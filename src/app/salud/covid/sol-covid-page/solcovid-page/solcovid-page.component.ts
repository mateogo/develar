import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { SaludController } from '../../../salud.controller';
import { SaludModel, Ciudadano, SectorAtencion, sectores } from '../../../salud.model';
import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../../../../develar-commons/asset-helper';

import { devutils }from '../../../../develar-commons/utils';

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
          UpdateEventEmitter,

          PersonContactData 
        } from '../../../../entities/person/person';

import {   Asistencia, 
          Locacion, 
          UpdateAsistenciaEvent, 
          UpdateAlimentoEvent, 
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';


import { Turno, TurnoAction, TurnosModel }  from '../../../turnos/turnos.model';
import { Audit, ParentEntity } from '../../../../develar-commons/observaciones/observaciones.model';

const UPDATE =   'update';
const NAVIGATE = 'navigate';
const CANCEL =   'cancel';
const DELETE =   'delete';
const SELECT =   'select';
const TOKEN_TYPE = 'asistencia';
const EVOLUCION = 'evolucion';



@Component({
  selector: 'solcovid-page',
  templateUrl: './solcovid-page.component.html',
  styleUrls: ['./solcovid-page.component.scss']
})
export class SolcovidPageComponent implements OnInit {

  public unBindList = [];

  // template helper
  public title = "Eventos COVID";
  public subtitle = "Atención 0800 22 COVID";

  public contactList:   PersonContactData[];
  public addressList:   Address[];
  public familyList:    FamilyData[];
  public oficiosList:   OficiosData[];
  public saludList:     SaludData[];
  public coberturaList: CoberturaData[];
  public ambientalList: EncuestaAmbiental[];
  public assetList:     CardGraph[] = []
  
  public asistenciasList: Asistencia[];
  public showHistorial = false;

  public audit: Audit;
  public parentEntity: ParentEntity;


  //public contactData = new PersonContactData();

  private hasPersonIdOnURL = true;
  private personId: string;

  
  //COVID
	public asistencia: Asistencia;

  public personFound = false;
  public showAsistenciaEditor = false;
  public searchPerson = false;
  public showFollowUp = false;

  public currentPerson: Person;

  // person data
  public tDoc = "DNI";
  public nDoc = "";
  public displayAddress = "";
  public pname;
  public alerta;
  public pdoc;
  public edad;
  public edadTxt;
  public ocupacion;
  public nacionalidad;
  public estado;
  public neducativo;
  public sexo;
  public sectorAtencion = '';



  constructor(
  		private dsCtrl: SaludController,
    	private router: Router,
    	private route: ActivatedRoute,

  	) { }

  ngOnInit() {
    let first = true;    
    this.personId = this.route.snapshot.paramMap.get('id')
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    this.resetForm()

    // if(!this.personId){
    //   this.hasPersonIdOnURL = false;
    // }

    // let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

    //   if(readyToGo && first){
    //     first = false;

    //     this.initCurrentPage();

    //   }
    // })
    // this.unBindList.push(sscrp2);
  }


  // initCurrentPage(){
  //   this.searchPerson = true;

  //   if(!this.personId){
  //     if(this.dsCtrl.activePerson){
  //       this.personId = this.dsCtrl.activePerson._id;
  //       this.initCurrentPerson(this.dsCtrl.activePerson);

  //     } else {
  //       //this.initNewAsistencia();
  //       // ToDo
  //     }

  //   } else {
  //     if(!this.dsCtrl.activePerson || this.dsCtrl.activePerson._id !== this.personId){
  //       this.loadPerson(this.personId);

  //     } else {
  //       this.initCurrentPerson(this.dsCtrl.activePerson);

  //     }

  //   }
  // }

  private initNewAsistencia(){
    let isIVR = this.dsCtrl.isUserMemberOf('ivr:operator');

    if(isIVR){
      this.asistencia = AsistenciaHelper.initNewAsistenciaCovid('covid', 'ivr', this.currentPerson);
    }else{
      this.asistencia = AsistenciaHelper.initNewAsistenciaCovid('covid', 'com', this.currentPerson);
    }

    this.asistencia.tdoc = this.tDoc;
    this.asistencia.ndoc = this.nDoc;

    this.showAsistenciaEditor = true;
    this.showFollowUp = false;
    this.searchPerson = false;

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



  /**********************/
  /*      COVID        */
  /**********************/

  manageBase(event: UpdateAsistenciaEvent){

  	this.emitEvent(event);
  }

  private emitEvent(event: UpdateAsistenciaEvent){
  	if(event.action === UPDATE || event.action === EVOLUCION){
  		//

      this.dsCtrl.manageCovidRecord(event.token).subscribe(t =>{
        if(t){
          this.asistencia = t;
          this.dsCtrl.openSnackBar('Grabación exitosa', 'Aceptar');


          if(event.action === EVOLUCION){

            this.dsCtrl.createPersonFromAsistencia(t);

            this.resetForm();

          }else {
            this.followUpForm();

          }

        }

      });

  	}
    if(event.action === NAVIGATE){
      //
    }
    if(event.action === DELETE){
      //
    }
    if(event.action === CANCEL){
      this.resetForm();
      //
    }
  }


  /*********************
   *  Template Events /
   ******************/

  altaEvent(token:UpdateEventEmitter){
    this.nDoc = token.ndoc;
    this.tDoc = token.tdoc;
    if(token.tdoc === 'PROV' && !token.ndoc) {
      this.createNumeroProvisorio(this.tDoc, this.nDoc);

    }else{
      this.fetchAsistenciasByDNI(this.tDoc, this.nDoc);

    }
  }

  private createNumeroProvisorio(tdoc, ndoc){

    this.dsCtrl.fetchSerialDocumProvisorio().subscribe(serial =>{
      this.nDoc = serial.pnumero + serial.offset + '';
      this.fetchAsistenciasByDNI(this.tDoc, this.nDoc);

    });

  }

  private fetchAsistenciasByDNI(tdoc, ndoc){
    this.dsCtrl.fetchAsistenciaByDNI(this.tDoc, this.nDoc).subscribe(asis =>{
      if(asis && asis.length){
        this.asistencia = asis[0];
        this.asistencia.ndoc = this.nDoc;
        this.asistencia.tdoc = this.tDoc;

        if(this.asistencia.denuncia){
          this.asistencia.denuncia.dendoc = this.asistencia.denuncia.dendoc ? this.asistencia.denuncia.dendoc : this.asistencia.ndoc;
          this.asistencia.denuncia.dentel = this.asistencia.denuncia.dentel ? this.asistencia.denuncia.dentel : this.asistencia.telefono;
        }

        this.editAsistencia();

      }else {
         this.initNewAsistencia();

      }

    })

  }

  private loadPersonDataIntoAsistencia(asistencia: Asistencia, person: Person){
      let telefono = person.contactdata && person.contactdata.length && person.contactdata[0];
      asistencia.sexo = person.sexo ? (asistencia.sexo ? asistencia.sexo : person.sexo) : asistencia.sexo;
      asistencia.telefono = asistencia.telefono  ? asistencia.telefono  : (telefono && telefono.data) || ''


      let address = person.locaciones && person.locaciones.length && person.locaciones[0];

      if(address) {
        let locacion = asistencia.locacion || new Locacion();
        locacion.street1 =  locacion.street1  ? locacion.street1 : address.street1;
        locacion.streetIn = locacion.streetIn ? locacion.streetIn : address.streetIn;
        locacion.streetOut = locacion.streetOut ? locacion.streetOut : address.streetOut;
        locacion.city = locacion.city ? locacion.city :  address.city;
        locacion.barrio = locacion.barrio ? locacion.barrio :  address.barrio;

        asistencia.locacion = locacion;

      }




  }


  personFetched(persons: Person[]){
    this.showAsistenciaEditor = false;
    this.showFollowUp = false;

    if(persons && persons.length){

      this.initCurrentPerson(persons[0]);

    }else{
      this.resetForm();
    }
  }



  private closeTurnosForm(){
    this.personFound = true;
    this.showAsistenciaEditor = false;
    this.showFollowUp = false;

  }

  private openTurnosForm(){
    this.personFound = true;
    this.showAsistenciaEditor = true;
    this.showFollowUp = false;
    
  }
  private followUpForm(){
    this.showFollowUp = true;

    this.personFound = false;
    this.showAsistenciaEditor = false;
    this.searchPerson = false;

  }

  private resetForm(){
    this.searchPerson = true;

    this.personFound = false;
    this.showAsistenciaEditor = false;
    this.showFollowUp = false;
    this.asistencia = null;
    this.currentPerson = null;
    this.dsCtrl.resetCurrentPerson();

  }

  private editAsistencia(){

    this.showAsistenciaEditor = true;
    this.showFollowUp = false;
    this.searchPerson = false;

  }

  private initCurrentPerson(p: Person){
    // if(p && this.currentPerson && p._id === this.currentPerson._id){
    //   return;
    // }

    if(p){
      this.currentPerson = p;
      this.dsCtrl.updateCurrentPerson(p);

      //this.contactData = p.contactdata[0];
      this.contactList = p.contactdata || [];
      this.addressList = p.locaciones || [];
      this.familyList  = p.familiares || [];
      this.oficiosList = p.oficios || [];
      this.saludList =   p.salud || [];
      this.coberturaList = p.cobertura || [];
      this.ambientalList = p.ambiental || [];
      this.assetList = p.assets || [];

      this.initPersonData(this.currentPerson);
      

      this.audit = this.dsCtrl.getAuditData();
      this.parentEntity = {
        entityType: 'person',
        entityId: this.currentPerson._id,
        entitySlug: this.currentPerson.displayName
      }

      this.initAsistenciasList()
    }
 
  }

  private initPersonData(person: Person){
    this.pname = personModel.getPersonDisplayName(person);
    this.alerta = person.alerta;
    this.pdoc = personModel.getPersonDocum(person);
    this.edad = devutils.edadActual(new Date(person.fenac));
    this.ocupacion = personModel.getProfesion(person.tprofesion)
    this.nacionalidad = personModel.getNacionalidad(person.nacionalidad)
    this.estado = personModel.getEstadoCivilLabel(person.ecivil);
    this.neducativo = personModel.getNivelEducativo(person.nestudios);
    this.sexo = person.sexo;
    this.displayAddress = personModel.displayAddress(person.locaciones);
    this.tDoc = person.tdoc;
    this.nDoc = person.ndoc;


    if(person.fenac){
      this.edad = devutils.edadActual(new Date(person.fenac));
    }else{
      this.edad = 0
    }
    this.edadTxt = this.edad ? '(' + this.edad + ')' : '';




  }

  private initAsistenciasList(){
    this.asistenciasList = [];
    this.dsCtrl.fetchAsistenciaByPerson(this.currentPerson).subscribe(list => {
      this.asistenciasList = list || [];
      this.sortProperly(this.asistenciasList);

      if(list && list.length){
        this.asistencia = list[0];

        this.asistencia.ndoc = this.currentPerson.ndoc;
        this.asistencia.tdoc = this.currentPerson.tdoc;

        if(this.asistencia.denuncia){
          this.asistencia.denuncia.dendoc = this.asistencia.denuncia.dendoc ? this.asistencia.denuncia.dendoc : this.asistencia.ndoc;
          this.asistencia.denuncia.dentel = this.asistencia.denuncia.dentel ? this.asistencia.denuncia.dentel : this.asistencia.telefono;
        }

        this.loadPersonDataIntoAsistencia(this.asistencia, this.currentPerson );
        this.editAsistencia();

      }else {
        this.dsCtrl.fetchAsistenciaByDNI(this.currentPerson.tdoc,this.currentPerson.ndoc).subscribe(asis =>{
          if(asis && asis.length){
            this.asistencia = asis[0];
            this.asistencia.ndoc = this.nDoc;
            this.asistencia.tdoc = this.tDoc;
            this.asistencia.idPerson = this.currentPerson._id;
            this.asistencia.requeridox = AsistenciaHelper.buildCovidRequirente(this.currentPerson);
            this.loadPersonDataIntoAsistencia(this.asistencia, this.currentPerson );

            this.editAsistencia();
          }else {
             this.initNewAsistencia();

          }
        })
      }

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
