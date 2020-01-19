import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Observable } from 'rxjs';

import { devutils }from '../../../develar-commons/utils'


import { DsocialController } from '../../dsocial.controller';
import { DsocialModel, Ciudadano, SectorAtencion, sectores } from '../../dsocial.model';
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

import { RemitoAlmacen } from '../../alimentos/alimentos.model';

import { Turno, TurnoAction, TurnosModel }  from '../../turnos/turnos.model';
import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

const UPDATE = 'update';
const NAVIGATE = 'navigate';

@Component({
  selector: 'talimentar-page',
  templateUrl: './talimentar-page.component.html',
  styleUrls: ['./talimentar-page.component.scss']
})
export class TalimentarPageComponent implements OnInit {

  public unBindList = [];

  // template helper
  public title = "Entrega de Tarjeta Alimentar";
  public subtitle = "Atención del Trabajador Social";
  public titleRemitos = "Historial de entregas";

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
  
  public asistenciasList: Asistencia[];
  public showHistorial = false;
  public remitosList: RemitoAlmacen[];

  public audit: Audit;
  public parentEntity: ParentEntity;


  //public contactData = new PersonContactData();

  public hasCurrentPerson = false;
  private hasPersonIdOnURL = true;
  public personFound = false;
  public altaPersona = false;
  private personId: string;

  public isAutenticated = false;
  public currentTurno:Turno;
  
  public sectors:SectorAtencion[] = sectores;


	public form: FormGroup;
	private celular: PersonContactData;
	private embarazo: SaludData;
	public embarazoList: Array<any> = [];
  public isBeneficiarioTxt = 'Hola';


  constructor(
  		private dsCtrl: DsocialController,
  		private fb: FormBuilder,
    	private router: Router,
    	private route: ActivatedRoute,

  	) { }

  ngOnInit() {
    let first = true;

    this.form = this.buildForm();

		this.embarazoList = [
		    {val: 'no_definido',        label: 'No aplica' ,          mes_parto: 0},
		    {val: 'no_embarazo',        label: 'No está embarazada' , mes_parto: 0},
		    {val: 'embarazo3',          label: 'Embarazada 3 meses' , mes_parto: 6},
		    {val: 'embarazo4',          label: 'Embarazada 4 meses' , mes_parto: 5},
		    {val: 'embarazo5',          label: 'Embarazada 5 meses' , mes_parto: 4},
		    {val: 'embarazo6',          label: 'Embarazada 6 meses' , mes_parto: 3},
		    {val: 'embarazo7',          label: 'Embarazada 7 meses' , mes_parto: 2},
		    {val: 'embarazo8',          label: 'Embarazada 8 meses' , mes_parto: 1},
		    {val: 'embarazo9',          label: 'Embarazada 9 meses' , mes_parto: 0},
		];


    this.personId = this.route.snapshot.paramMap.get('id')
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    if(!this.personId){
      this.hasPersonIdOnURL = false;
    }

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        //this.initCurrentPage();

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
    // if(p && this.currentPerson && p._id === this.currentPerson._id){
    //   return;
    // }
    this.isBeneficiarioTxt = '';

    if(p){
      this.currentPerson = p;
      //this.contactData = p.contactdata[0];
      this.contactList = p.contactdata || [];
      this.saludList =   p.salud || [];
      this.coberturaList = p.cobertura || [];

      if(this.isBeneficiarioTarjetaAlimentar(this.coberturaList)){

        this.audit = this.dsCtrl.getAuditData();
        this.initContactData(this.contactList);
        this.initEmbarazadaData(this.saludList);

        console.log('personFound');

        this.initForEdit(this.form, p);

        setTimeout(()=> {
          this.hasCurrentPerson = true;
          this.personFound = true;

        },400);
 


      }else{
        this.isBeneficiarioTxt = 'NO RETIRA TARJETA EN ESTA OPORTUNIDAD';

      }

      



    }

  }

  initContactData(contactList: PersonContactData[]){
  	let telData: PersonContactData = new PersonContactData();
  	telData.tdato = 'CEL';
  	telData.data = '';
  	telData.type = 'PER';
  	telData.slug = "Relevado en la entrega de Tarjeta Alimentar";
  	telData.isPrincipal = true;

  	if(contactList && contactList.length){
  		let token = contactList.find(t => t.tdato === "CEL" );
  		telData = token ? token : telData;

  	}else {

  	}

  	this.celular = telData;

  }

  initEmbarazadaData(saludList: SaludData[]){
  	let emb: SaludData = new SaludData();
  	emb.type = "embarazo";
  	emb.tproblema = "embarazo";
  	emb.fecha = null;
  	emb.fe_ts = 0;
  	emb.lugaratencion = "";
  	emb.slug = "Relevado en la entrega de Tarjeta Alimentar";

  	if(saludList && saludList.length){
  		let token = saludList.find(t => t.type === "embarazo" );
  		emb = token ? token : emb;

  	}else {

  	}
  	console.log('Embarazo INIT: [%s] [%s]', emb.type, emb.fecha)

  	this.embarazo = emb;

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
    this.dsCtrl.setCurrentPersonFromId(id).then(p => {
      if(p){
        this.initCurrentPerson(p);

      }
    });
  }

  /*****************************/
  /*     Historial Remitos    */
  /***************************/
  private loadHistorialRemitos(){
    this.dsCtrl.fetchRemitoAlmacenByPerson(this.currentPerson).subscribe(list =>{
      this.remitosList = list || []
      this.sortRemitosProperly(this.remitosList);
      if(list && list.length){
        this.showHistorial = true;
      }else{
        this.showHistorial = false;

      }


    })
  }

  private sortRemitosProperly(records){
    records.sort((fel, sel)=> {
      if(!fel.ts_alta) fel.ts_alta = "zzzzzzz";
      if(!sel.ts_alta) sel.ts_alta = "zzzzzzz";

      if(fel.ts_alta<sel.ts_alta) return 1;
      else if(fel.ts_alta>sel.ts_alta) return -1;
      else return 0;
    })
  }

  personFetched(persons: Person[]){
		this.hasCurrentPerson = false;
		this.personFound = false;
    this.isBeneficiarioTxt = '';

    if(persons.length){
      this.currentPerson = persons[0];
      console.log('PersonFetched!! [%s]', this.currentPerson.displayName);

      this.initCurrentPerson(this.currentPerson);

    }else{
      this.isBeneficiarioTxt = 'Beneficiario/a no encontrado en la base'
      this.resetForm();
    }
  }

  private resetForm(){
      this.altaPersona = false;
      this.personFound = false;

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

  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      telefono:       [null ],
      embarazada:     [null],
    });

    return form;
  }

  isBeneficiarioTarjetaAlimentar(coberturas: CoberturaData[]):boolean {
    let ok = false;

    if(coberturas && coberturas.length){
      let token = coberturas.find(t => t.type === 'auh' && t.tingreso === 'talimentar');
      if(token){
        ok = true;
      }else{
        ok = false;
      }


    }else {
      ok = false;
    }

    return ok;
  }

  initForEdit(form: FormGroup, person: Person): FormGroup {
  	let embarazo = 'no_definido';

  	if(this.embarazo.fecha){
  		let token = this.embarazoList.find(t => {
  			if(t.val === "no_definido" || t.var === "no_embarazo") return false;
				let fecha_parto = new Date(2020, t.mes_parto, 1);
				if(this.embarazo.fecha === devutils.txFromDate(fecha_parto)) return true;
				else return false;
  		});

  		if(token){
  			embarazo = token.val

  		}else{
  			embarazo = 'embarazo3'
  		}

  	}


		form.reset({
		  embarazada:  embarazo,
		  telefono:    this.celular.data,

		});

		return form;
  }


	initForSave(form: FormGroup, person: Person): Person {
		const fvalue = form.value;

		const entity = person;
		const telefono = fvalue.telefono;
		const embarazo_value = fvalue.embarazada;

		if(telefono){
			this.celular.data = telefono;

	  	if(this.contactList && this.contactList.length){
	  		let token = this.contactList.find(t => t.tdato === "CEL" );
	  		
	  		if(token){
	  			token.data = telefono;

	  		}else{
	  			this.contactList.push(this.celular);
	  		}

	  	}else {
	  		this.contactList.push(this.celular);

	  	}


		}

		if(embarazo_value!== 'no_definido' && embarazo_value !== "no_embarazo"){
			let offset = this.embarazoList.find(t => t.val === embarazo_value).mes_parto;
			let fecha_parto = new Date(2020, offset, 1);

			this.embarazo.fecha = devutils.txFromDate(fecha_parto);
			this.embarazo.fe_ts = fecha_parto.getTime();

	  	if(this.saludList && this.saludList.length){
	  		let token = this.saludList.find(t => t.type === "embarazo" );
	  		if(token){
	  			token.fecha = this.embarazo.fecha;
	  			token.fe_ts = this.embarazo.fe_ts

	  		}else {
	  			this.saludList.push(this.embarazo);

	  		}

	  	}else {
	  		this.saludList.push(this.embarazo);

	  	}



		}
		//entity.displayName = fvalue.displayName;
		//entity.email = fvalue.email;

		return entity;
	}

  onSubmit(){
  	console.log('Submit')
  	this.initForSave(this.form, this.currentPerson);
  	console.dir(this.currentPerson);

    let update: UpdatePersonEvent = {
      action: 'update',
      token: 'core',
      person: this.currentPerson
    };
    this.dsCtrl.updatePerson(update);
    this.resetForm();

  }

  onCancel(){
  	console.log('Cancel')
  	this.resetForm();
  }


}
