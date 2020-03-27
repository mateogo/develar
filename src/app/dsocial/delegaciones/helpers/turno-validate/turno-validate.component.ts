import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Person, UpdatePersonEvent, personModel } from '../../../../entities/person/person';

import { DsocialModel, Ciudadano, SectorAtencion, Serial } from '../../../dsocial.model';

import {  Asistencia, 
					TurnosAsignados,
          Alimento,
          VoucherType,
          Requirente,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';


import { DsocialController } from '../../../dsocial.controller';

import { devutils }from '../../../../develar-commons/utils'
import { RemitoAlmacen, RemitoAlmacenModel, ItemAlmacen, UpdateRemitoEvent } from '../../../alimentos/alimentos.model';
import { Product, KitProduct, KitItem, UpdateProductEvent, KitProductModel }    from '../../../../entities/products/product.model';

const NEXT = 'next';
const CANCEL = 'cancel';
const CORE = 'core';
const FAILED = 'failed';
const SUCCESS = 'success';
const MENSAJE = 'Te llamaremos para analizar tu caso';
const CUPOS = 'No hay más cupos para retirar mañana.'

const AUH = `
Usted percibe la Tarjeta Alimentar|AUH u otra forma de asitencia Nacional o Provincial.
Además se duplicará el ingreso por la AUH durante el transcurso de esta emergencia sanitaria.
Si aún así no accede a los alimentos necesarios comuníquese al 50346266 de Lunes a Viernes de 8 a 14 hs.
¡Gracias!
`

const DUPLICE = ` 
Ud. ha recibido alimentos de nuestra parte en los últimos 30 días.
Si aún así, no accede a los alimentos necesarios comuníquese al 50346266 de Lunes a Viernes de 8 a 14 hs.
¡Gracias!
`

@Component({
  selector: 'turno-validate',
  templateUrl: './turno-validate.component.html',
  styleUrls: ['./turno-validate.component.scss']
})
export class TurnoValidateComponent implements OnInit {
	@Input() person: Person;
	@Output() updateToken = new EventEmitter<UpdatePersonEvent>();
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

  //auditoria
  public canReciveAlimentos = false;
  public forbiddenText = '';

  public asistenciasList: Asistencia[] = [];
  public activeAsistenciasList: Asistencia[] = [];
  public currentAsistencia: Asistencia;
  public hasAsistencias = false;
  public hasActiveAsistencias = false;
  public canIssueVoucher = false;

  public remitosList: RemitoAlmacen[] = [];
  public lastRemito: RemitoAlmacen;
  public hasRemitos = false;
  public voucherType: VoucherType;
  public remitoalmacen: RemitoAlmacen;
  public emitRemito = false;
  public kitList: KitProduct[];
  public currentKit: KitProduct;
  public currentItemList: ItemAlmacen[];

	public form: FormGroup;

	public gturno: GTurno;
	public turnoShow = false;
	public delegacionOptList = AsistenciaHelper.getOptionlist('delegaciones')
  public direccion;

  public hasFailedShow = false;
  public turnoSuccess = false;
  private hasTurnoAlready = false;

  public currentTurno: TurnosAsignados;

  public failedToken = {
  	hasFailed: false,
  	type: '',
  	slug: '',
  	message: '',
    reporta: 1
  }

  constructor(
  		private dsCtrl: DsocialController,
  		private fb: FormBuilder,

  	) { }

  ngOnInit() {
  	this.form = this.buildForm();
    this.dsCtrl.fetchKits('productkit', {}).subscribe(k =>{
    	this.kitList = k;
    })


  	this.buildPersonData();
  	this.validatePerson(this.person);

  	setTimeout(()=>{
  		if(this.hasRestricciones()){
  			this.hasFailedShow = true;

  		}else {
  			this.assignTurno();

  		}

  	},800)


  }


  onCancel(){
  	this.emitEvent(CANCEL);
  }

  onFailed(){
  	if(this.failedToken.type === 'Turnos') this.onCancel();
  	else  this.emitFailedEvent(this.failedToken)
  }

  onFormSubmit(){
  	this.initForSave(this.form, this.gturno);
  	this.processTurno()

  }

  onFormCancel(){
  	this.emitEvent(CANCEL);
  }




  private hasRestricciones(): boolean{
  	let isApta = false;

  	if(this.person.estado === 'pendiente'){
  		this.hasFailed('alta', 'Alta provisoria vía Web', 'Serás contactada/o para perfeccionar tu empadronamiento ', 1);
  		return true;
  	}

  	if(!this.currentAsistencia){
  		this.hasFailed('asistencia','No tiene sol asistencia',  MENSAJE, 1);
  		return true;
  	}

  	if(this.hasTurnoAlready){
      this.direccion = this.fetchDelegacionAddress(this.currentTurno.recurso.lugarId)
      let msj = `Tienes un turno asignado para el ${ this.currentTurno.fe_tx} en ${ this.currentTurno.slug}, sito en ${ this.direccion }`
  		this.hasFailed('Turnos', 'Ya tiene un turno Asignado', msj, 0);
  		return true;
  	}

  	if(!this.canReciveAlimentos){
  		this.hasFailed('cobertura', 'Tiene planes sociales',AUH, 0 )
  		return true;
  	}

  	if(!this.canIssueVoucher){
  		this.hasFailed('asistencia', 'No tiene asistencias activas',MENSAJE,1);
  		return true;

  	}

  	return isApta;
  }

  private hasFailed(type, slug, message, reporta){
  	this.failedToken['hasFailed'] = true;
  	this.failedToken['type'] = type;
  	this.failedToken['slug'] = slug;
  	this.failedToken['message'] = message;
    this.failedToken['reporta'] = reporta;

  }

  private validatePerson(p: Person){

    this.canReciveAlimentos = DsocialModel.asistenciaPermitida('alimentos', p)
    
    this.forbiddenText = this.canReciveAlimentos ? '' : 'Tiene planes sociales. '

    this.initAsistenciasList(p);
    this.loadHistorialRemitos(p);
    this.loadTurnosAsignados(p);




  }

  private loadTurnosAsignados(p:Person){
  	this.dsCtrl.fetchGTurnosByPerson(p).subscribe(list => {
  		if(list && list.length){
  			this.currentTurno = list[0]
  			this.hasTurnoAlready = true;
  		}
  	})


  }

  private assignTurno(){
  	this.gturno = new GTurno();
  	this.initForEdit(this.form, this.gturno);
  	this.turnoShow = true;

  }

  private processTurno(){
  	let today = new Date();
  	let tomorrow = devutils.nextLaborDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 1)
  	let fe_txt = devutils.txFromDate(tomorrow);
    console.log('processTurno [%s]', fe_txt);

  	this.gturno.fecha = fe_txt;

  	this.dsCtrl.fetchTurnoForDelegaciones(this.gturno, this.person).subscribe(list => {
  		if(list && list.length){
  			this.currentTurno = list[0];
        this.direccion = this.fetchDelegacionAddress(this.currentTurno.recurso.lugarId)
  			this.processRemito()

  		}else{
  			this.hasFailed('Turnos', 'Cupo diario excedido en esta locación ', CUPOS, 0 )
  			this.hasFailedShow = true;
  			this.turnoShow = false;

  			//todo: se acabó el cupo

  		}

  	})
  }

  private fetchDelegacionAddress(val): string {
    let direccion = '';
    let token = this.delegacionOptList.find(t => t.val === val);
    if(token) direccion = token.locacion;

    return direccion;
  }

  private processRemito(){

      let error = AsistenciaHelper.checkVoucherConditions(this.currentAsistencia, this.remitosList);

      if(error.valid) {
        this.initRemitoForEdit(this.currentAsistencia);
        this.insertRemito()
      }else {
        //todo negativa
        this.dsCtrl.openSnackBar(error.message, 'Aceptar');
      }
  }

  private findCurrentKit(code): KitProduct{
    let kit = this.kitList.find(t => t.code === code);
    return kit;
  }

  private insertRemito(){

    this.remitoalmacen.deposito =    this.gturno.lugarId;
    this.remitoalmacen.tmov =        this.remitoalmacen.tmov     || 'entrega';
    this.remitoalmacen.action =      this.remitoalmacen.action   || 'alimentos';
    this.remitoalmacen.description = 'VoucherWeb'
    this.remitoalmacen.sector =      this.remitoalmacen.sector   || 'alimentos';
    this.remitoalmacen.estado =      'activo';
    this.remitoalmacen.avance =      'entregado';
    this.remitoalmacen.fecomp_txa =  this.gturno.fecha;

    this.currentKit = this.findCurrentKit(this.remitoalmacen.kitEntrega);
    this.currentItemList = this.buildItemListFromKit(this.currentKit, this.remitoalmacen);

    this.remitoalmacen.entregas = this.currentItemList;

    this.dsCtrl.updateCurrentPerson(this.person);

    if(this.currentAsistencia){
      this.remitoalmacen.parentId = this.currentAsistencia._id;
      this.remitoalmacen.parent = {
        id:      this.currentAsistencia._id,
        type:    'asistencia',
        kit:     this.currentAsistencia.modalidad && this.currentAsistencia.modalidad.type,
        action:  this.currentAsistencia.action,
        compNum: this.currentAsistencia.compNum
      }

    }

    this.dsCtrl.manageRemitosAlmacenRecord('remitoalmacen',this.remitoalmacen).subscribe(remito =>{
      this.remitoalmacen = remito;
			this.turnoSuccess = true;
			this.turnoShow = false;
 

    });


  }

  private buildItemListFromKit(kit: KitProduct, remito: RemitoAlmacen): ItemAlmacen[]{
    let kits = kit.products;
    let items = kits.map(t =>{
      return {
        productId: t.productId,
        code:      t.productCode,
        name:      t.productName,
        slug:      '',
        isKit:     1,
        ume:       t.productUME,
        qty:       t.item_qty * remito.qty
      } as ItemAlmacen
    });
    return items;
  }

  private initRemitoForEdit(asistencia: Asistencia){
    if(asistencia.action === 'habitat') asistencia.action = 'habitacional';

    this.voucherType = AsistenciaHelper.getVoucherType(asistencia);

    let action = asistencia.action;
    let slug = '';
    let sector = asistencia.sector;
    let serial: Serial;
    let person = this.person;
    let kitEntrega = '';
    let qty = 1;

    if(this.voucherType.key ===  'modalidad'){
      kitEntrega = asistencia.modalidad.type;
      qty = asistencia.modalidad.qty;
    }else {

    }

    this.remitoalmacen = RemitoAlmacenModel.initNewRemito(action, slug, sector, serial, person,this.voucherType, kitEntrega, qty);
    this.remitoalmacen.entregas = RemitoAlmacenModel.bindItemListFromAsistencia(asistencia)


    this.emitRemito = true;
  }



  private initAsistenciasList(p: Person){
    this.asistenciasList = [];
    this.hasAsistencias = false;
    this.canIssueVoucher = true;

    this.activeAsistenciasList = [];
    this.hasActiveAsistencias = false;

    this.dsCtrl.fetchAsistenciaByPerson(p).subscribe(list => {
      if(list && list.length) {
        this.asistenciasList = AsistenciaHelper.asistenciasSortProperly(list);

        this.currentAsistencia = list[0]
        this.hasAsistencias = true;
        this.canIssueVoucher = false;

        this.initValidAsistencias(this.asistenciasList);

        this.forbiddenText += this.canIssueVoucher ? '' : 'No tiene solicitud de asistencia activa'
      }

    })
  }

  private initValidAsistencias(list:Asistencia[]){
    this.activeAsistenciasList = AsistenciaHelper.filterActiveAsistencias(list);
    this.hasActiveAsistencias = false;

    if(this.activeAsistenciasList && this.activeAsistenciasList.length) {

      this.hasActiveAsistencias = true;
      this.canIssueVoucher = true;
      this.currentAsistencia = this.activeAsistenciasList[0]
    }else {
    	this.currentAsistencia = null
    }
  }


  private loadHistorialRemitos(p: Person){
    this.dsCtrl.fetchRemitoAlmacenByPerson(p).subscribe(list =>{
      this.remitosList = list || []
      this.sortProperly(this.remitosList);

  
      if(list && list.length){
        this.lastRemito = list[0];
        this.hasRemitos = true;
      }else{
        this.lastRemito = null;
        this.hasRemitos = false;
      }

    })
  }


  private sortProperly(records){
    records.sort((fel, sel)=> {
      if(!fel.ts_alta) fel.ts_alta = "zzzzzzz";
      if(!sel.ts_alta) sel.ts_alta = "zzzzzzz";

      if(fel.ts_alta<sel.ts_alta) return 1;
      else if(fel.ts_alta>sel.ts_alta) return -1;
      else return 0;
    })


  }




  private buildPersonData(){
  	this.pname = personModel.getPersonDisplayName(this.person);
    this.alerta = this.person.alerta;
  	this.pdoc = personModel.getPersonDocum(this.person);
    this.edad = devutils.edadActual(new Date(this.person.fenac));
    this.ocupacion = personModel.getProfesion(this.person.tprofesion)
    this.nacionalidad = personModel.getNacionalidad(this.person.nacionalidad)
    this.estado = personModel.getEstadoCivilLabel(this.person.ecivil);
    this.neducativo = personModel.getNivelEducativo(this.person.nestudios);
    this.sexo = this.person.sexo;

    if(this.person.fenac){
      this.edad = devutils.edadActual(new Date(this.person.fenac));
    }else{
      this.edad = 0
    }
    this.edadTxt = this.edad ? '(' + this.edad + ')' : '';

  }

	private emitEvent(action: string){
			this.updateToken.next({
						action: action,
						token: CORE,
						person: this.person
			  	});		
	}


  private emitFailedEvent(failed: any){
  	this.person.alerta = failed.type + ':: ' + failed.slug;
  	this.person.followUp = 'altaweb';
  	this.dsCtrl.updatePersonPromise(this.person._id, this.person).then(p => {
  		this.person = p;

      if(failed.reporta){
        this.updateToken.next({
          action: FAILED,
          token: CORE,
          person: this.person
        });

      }else{
        this.emitEvent(CANCEL);
      }

  	})
  }

  private initForEdit(form: FormGroup, token: GTurno): FormGroup {


		form.reset({

      delegacion:   token.lugarId,

		});

		return form;
  }

  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      delegacion:        [null],
    });

    return form;
  }

	private initForSave(form: FormGroup, token: GTurno): GTurno {
		const fvalue = form.value;
		const entity = token;

		entity.lugarId = fvalue.delegacion;


		return entity;
	}
	public changeSelectionValue(type, value){

	}

	viewPersonEvent(e){
		//
	}


}

class GTurno {
	agenda ='ALIM:DEL';
	lugar =  'MUNI';
	lugarId: string;
	fecha: string;
	qty = 1;
	dry = false;
	requeridox: Requirente;
}

//http://develar-local.co:4200/dsocial/gestion/recepcion/5e6bf8113ef5e81662f26ccc


