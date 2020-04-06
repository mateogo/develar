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
const SISTEMA = 'Se produjo un error en el procesamiento de la información. Intente más tarde.'

const AUH = `
Usted percibe la Tarjeta Alimentar|AUH u otra forma de asitencia Nacional o Provincial.
Además se duplicará el ingreso por la AUH durante el transcurso de esta emergencia sanitaria.
Si aún así no accede a los alimentos necesarios comuníquese al 5034 6266 de Lunes a Viernes de 8 a 14 hs.
¡Gracias!
`
const INVALIDADO = `
Usted ya fue evaluado por un Trabajador Social y no puede solicitar alimentos por esta vía.
¡Gracias!
`

const DUPLICE = ` 
Ud. ha recibido alimentos de nuestra parte en los últimos 30 días.
Si aún así no accede a los alimentos necesarios comuníquese al 5034 6266 de Lunes a Viernes de 8 a 14 hs.
¡Gracias!
`
const MES_EN_CURSO = ` 
Ud. ha recibido alimentos de nuestra parte en el mes en curso.
Si aún así no accede a los alimentos necesarios comuníquese al 5034 6266 de Lunes a Viernes de 8 a 14 hs.
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
  public kitList: KitProduct[];
  public currentKit: KitProduct;
  public currentItemList: ItemAlmacen[];

	public form: FormGroup;

	public gturno: GTurno;
	public turnoShow = false;
  public submited = true;

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
        this.submited = false;

  		}else {
  			this.assignTurno();

  		}

  	},800)


  }


  onCancel(){
  	this.emitEvent(CANCEL);
  }

  onFailed(){
    this.submited = true;
    this.emitFailedEvent(this.failedToken)
  }

  onFormSubmit(){
    this.submited = true;
    this.initForSave(this.form, this.gturno);
    this.verifyTurnoAndNext()

  }

  onFormCancel(){
  	this.emitEvent(CANCEL);
  }




  private hasRestricciones(): boolean{
  	let isApta = false;

    if(this.person.estado === 'invalidado'){
      this.hasFailed('alta', 'Persona invalidada para alimentos', '(ref#8)  ' + INVALIDADO, 0);
      return true;
    }

    if(!this.canReciveAlimentos){
      this.hasFailed('cobertura', 'Tiene planes sociales','(ref#3) ' +  AUH, 0 )
      return true;
    }

    if(this.hasTurnoAlready){
      this.direccion = this.fetchDelegacionAddress(this.currentTurno.recurso.lugarId)
      let msj = `(ref#4) Tienes un turno asignado para el ${ this.currentTurno.fe_tx} en ${ this.currentTurno.slug}, sito en ${ this.direccion }`
      this.hasFailed('Turnos', 'Ya tiene un turno Asignado', msj, 0);
      return true;
    }

    if(this.person.estado === 'pendiente'){
      this.hasFailed('alta', '(ref#1) Alta provisoria vía Web', '(ref#1) Serás CONTACTADO/A para perfeccionar tu empadronamiento ', 1);
      return true;
    }

    // validación #6
    if(this.remitosList && this.remitosList.length){
      if(this.currentAsistencia){
        let error = AsistenciaHelper.checkVoucherConditions(this.currentAsistencia, this.remitosList);
        if(!error.valid){
          this.hasFailed('entregas', 'Supera entregas del período', '(ref#6.1) ' +  DUPLICE, 0);
          return true;
        }

      }else{
        let hasEntregasMes = AsistenciaHelper.hasEntregasMes(this.remitosList);
        if(hasEntregasMes){
          this.hasFailed('entregas', 'Ya recibió alimentos en el mes en curso', '(ref#6.2) ' +  MES_EN_CURSO, 0);
          return true;          
        }
      }
    }

    if(!this.canIssueVoucher){
      this.hasFailed('asistencia', '(ref#5) No tiene asistencias activas', '(ref#5) ' +  MENSAJE,1);
      return true;

    }

  	if(!this.currentAsistencia){
  		this.hasFailed('asistencia','(ref#2) No tiene sol asistencia',  '(ref#2) ' +  MENSAJE, 1);
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
        let t = list.find(tur => tur.fe_ts > new Date().getTime() )
        if(t){
          this.currentTurno = t;
          this.hasTurnoAlready = true;
        }else {
          this.currentTurno = null
          this.hasTurnoAlready = false;
        }
  		}
  	})

  }

  private assignTurno(){
  	this.gturno = new GTurno();
  	this.initForEdit(this.form, this.gturno);
    this.submited = false;
  	this.turnoShow = true;

  }

  private verifyTurnoAndNext(){
  	let today = new Date();
  	let tomorrow = devutils.nextLaborDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 1)
  	let fe_txt = devutils.txFromDate(tomorrow);

  	this.gturno.fecha = fe_txt;
    this.gturno.dry = true

  	this.dsCtrl.fetchTurnoForDelegaciones(this.gturno, this.person).subscribe(list => {
  		if(list && list.length){

  			this.processRemito()

  		}else{
  			this.hasFailed('Turnos', '(ref#7.1) Cupo diario excedido en esta locación ', '(ref#7.1) ' + CUPOS, 0 )
  			this.hasFailedShow = true;
        this.submited = false;
  			this.turnoShow = false;
  		}

  	})
  }

  private insertTurno(){
    this.gturno.dry = false;

    this.dsCtrl.fetchTurnoForDelegaciones(this.gturno, this.person).subscribe(list => {
      if(list && list.length){

        this.currentTurno = list[0];
        this.direccion = this.fetchDelegacionAddress(this.currentTurno.recurso.lugarId)

        this.turnoSuccess = true;
        this.submited = true;
        this.turnoShow = false; 

      }else{
        this.hasFailed('Turnos', '(ref#7.2) Cupo diario excedido en esta locación ', '(ref#7.2) ' + CUPOS, 0 )
        this.hasFailedShow = true;
        this.submited = false;
        this.turnoShow = false;
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

    this.initRemitoForEdit(this.currentAsistencia);
    this.insertRemito()
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
      if(remito){
        this.remitoalmacen = remito;
        this.insertTurno()
      }else {

        this.hasFailed('Remitos', '(ref#9) Se produjo un error en el sistema ', SISTEMA, 0 )
        this.hasFailedShow = true;
        this.submited = false;
        this.turnoShow = false;

      }
      //TODO
 

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

        this.hasAsistenciaAlimentos(this.activeAsistenciasList);

    }else {
    	this.currentAsistencia = null
    }
  }

  private hasAsistenciaAlimentos(asistencias: Asistencia[]){
    let asis = asistencias.find(t => {
      return (t.action === "alimentos" && t.modalidad )

    })

    if(asis){
      this.hasActiveAsistencias = true;
      this.canIssueVoucher = true;
      this.currentAsistencia = asis
    }else{
      this.hasActiveAsistencias = false;
      this.canIssueVoucher = false;
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
    if(failed.reporta){
      this.person.alerta = failed.type + ':: ' + failed.slug;
      this.person.followUp = 'altaweb';
      this.dsCtrl.updatePersonPromise(this.person._id, this.person).then(p => {
        this.person = p;
        this.updateToken.next({
          action: FAILED,
          token: CORE,
          person: this.person
        });


      })

    }else{
      this.emitEvent(CANCEL);
    }

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


