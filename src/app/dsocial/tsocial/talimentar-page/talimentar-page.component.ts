import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { devutils }from '../../../develar-commons/utils'

import { DsocialController } from '../../dsocial.controller';

import {  Person,
          Address,
          SaludData,
          CoberturaData,
          PersonContactData,

          BeneficiarioAlimentar,

          personModel,
          UpdatePersonEvent,
          UpdateItemListEvent,
        } from '../../../entities/person/person';

import { Audit } from '../../../develar-commons/observaciones/observaciones.model';

const UPDATE = 'update';
const NAVIGATE = 'navigate';
const COBERTURA = 'cobertura';
const CORE = 'core';

@Component({
  selector: 'talimentar-page',
  templateUrl: './talimentar-page.component.html',
  styleUrls: ['./talimentar-page.component.scss']
})
export class TalimentarPageComponent implements OnInit {

  private unBindList = [];
  public title = "Entrega de Tarjeta Alimentar";

  public currentPerson: Person;

  private addressList:   Address[];
  private saludList:     SaludData[];
  private coberturaList: CoberturaData[];
  private contactList: PersonContactData[];
  private audit: Audit;

  public hasCurrentPerson = false;
  public personFound = false;

	public  form: FormGroup;
	private celular: PersonContactData;
	private embarazo: SaludData;
	public  embarazoList: Array<any> = [];
  public  isBeneficiarioTxt = '';
  private numeroCaja = '';
  public  registroBancario: BeneficiarioAlimentar;

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

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{
      if(readyToGo && first){
        first = false;
      }
    })

    this.unBindList.push(sscrp2);
  }


  /**********************/
  /*  TEMPLATE Events  */
  /********************/
  onSubmit(){
    this.isBeneficiarioTxt = this.numeroCaja;

    this.initForSave(this.form, this.currentPerson);

    let update: UpdatePersonEvent = {
      action: UPDATE,
      token: CORE,
      person: this.currentPerson
    };
    this.dsCtrl.updatePerson(update);

    this.dsCtrl.updateBeneficiario(this.registroBancario);
    this.dsCtrl.openSnackBar('Grabación concluida', 'ACEPTAR');
    this.resetForm();

  }

  onCancel(){
    this.resetForm();
  }

  onAnularEntrega(){
    this.dsCtrl.anularEntregaBeneficiario(this.registroBancario);
    this.isBeneficiarioTxt = `Entrega ANULADA`;

    this.anularEntrega(this.currentPerson.cobertura)
    let update: UpdatePersonEvent = {
      action: UPDATE,
      token: COBERTURA,
      person: this.currentPerson
    };
    this.dsCtrl.updatePerson(update);

    this.dsCtrl.openSnackBar('ANULACIÓN efectuada', 'ACEPTAR');

    this.resetForm();
  }

  updateCore(event: UpdatePersonEvent){
    if(event.action === UPDATE){
      this.dsCtrl.updatePerson(event);
    }

  }

  personFetched(persons: Person[]){
    this.hasCurrentPerson = false;
    this.personFound = false;
    this.isBeneficiarioTxt = '';

    if(persons.length){
      this.currentPerson = persons[0];

      this.initCurrentPerson(this.currentPerson);

    }else{
      this.isBeneficiarioTxt = 'Beneficiario/a no encontrado en la base'
      this.resetForm();
    }
  }



  private initCurrentPerson(p: Person){
    this.isBeneficiarioTxt = '';
    this.numeroCaja = '';

    if(p){
      this.currentPerson = p;
      this.loadBankData(p)
    }
  }

  private initContactData(contactList: PersonContactData[]){
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

  private initEmbarazadaData(saludList: SaludData[]){
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

  	this.embarazo = emb;

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

  private resetForm(){
      this.personFound = false;
  }


  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      telefono:       [null ],
      embarazada:     [null],
    });

    return form;
  }

  private isBeneficiarioTarjetaAlimentar(coberturas: CoberturaData[]):boolean {
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

  private updateCobertura(coberturas: CoberturaData[]) {
 
    if(coberturas && coberturas.length){
      let token = coberturas.find(t => t.type === 'auh' && t.tingreso === 'talimentar');
      if(token){
        token.estado = 'activa';
        let hoy = new Date();
        token.fecha = devutils.txFromDate(hoy);
        token.fe_ts = hoy.getTime();
        token.observacion = 'Entregada en Operativo Alimentar ' + devutils.txFromDate(hoy);
      }
    }
  }

  private anularEntrega(coberturas: CoberturaData[]) {
 
    if(coberturas && coberturas.length){
      let token = coberturas.find(t => t.type === 'auh' && t.tingreso === 'talimentar');
      if(token){
        token.estado = 'pendiente';
        let hoy = new Date();
        token.fecha = devutils.txFromDate(hoy);
        token.fe_ts = hoy.getTime();
        token.observacion = 'Entrega anulada en Operativo Alimentar ' + devutils.txFromDate(hoy);
      }
    }
  }

  private initForEdit(form: FormGroup, person: Person): FormGroup {
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


	private initForSave(form: FormGroup, person: Person): Person {
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
    this.updateCobertura(entity.cobertura);

		return entity;
	}

  private isPendiente(benef: BeneficiarioAlimentar){
    let pendiente = true;
    
    if(benef && benef.estado && benef.estado === "entregada"){
      pendiente = false;
    } 

    return pendiente;    
  }

  private loadBankData(person: Person){
    this.dsCtrl.fetchBeneficiario(person.ndoc).subscribe(records => {
      if(records && records.length){
        this.registroBancario = records[0];
        this.registroBancario.caja = this.registroBancario.caja || 'ÚNICA';
        this.numeroCaja = `Caja: ${this.registroBancario.caja} Orden: ${this.registroBancario.orden}`;
        this.contactList = person.contactdata || [];
        this.saludList =   person.salud || [];
        this.coberturaList = person.cobertura || [];

        if(this.isBeneficiarioTarjetaAlimentar(this.coberturaList)){

          if(!this.isPendiente(this.registroBancario)){
              this.isBeneficiarioTxt = 'EL BENEFICIARIO/A YA RETIRÓ SU TARJETA ALIMENTAR EL ' + this.registroBancario.fecha;
          }else{
            this.isBeneficiarioTxt = `Beneficiario/a VALIDADO: Retira: ${this.registroBancario.dia} Hora: ${this.registroBancario.hora}`

          }

          this.audit = this.dsCtrl.getAuditData();
          this.initContactData(this.contactList);
          this.initEmbarazadaData(this.saludList);

          this.initForEdit(this.form, person);

          setTimeout(()=> {
            this.hasCurrentPerson = true;
            this.personFound = true;

          },200);

        }else{
          this.isBeneficiarioTxt = 'NO RETIRA TARJETA EN ESTA OPORTUNIDAD';        
        }
      }else{
        this.isBeneficiarioTxt = 'NO RETIRA TARJETA EN ESTA OPORTUNIDAD';        
      }
    })
  }

}

