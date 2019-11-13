import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { DsocialController } from '../../../dsocial.controller';

import { CustomValidators } from 'ng2-validation';

import { Person } from '../../../../entities/person/person';

import { AlimentosHelper } from '../../../alimentos/alimentos.model';

import { 	Asistencia, 
					Alimento, 
					Pedido,
					Modalidad,
					ItemPedido,
					UpdatePedidoEvent, 
					AsistenciaHelper } from '../../asistencia.model';

import { KitOptionList } from '../../../alimentos/alimentos.model';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'pedido';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'solicita-pedidos-edit',
  templateUrl: './solicita-pedidos-edit.component.html',
  styleUrls: ['./solicita-pedidos-edit.component.scss']
})
export class SolicitaPedidosEditComponent implements OnInit {
	@Input() pedido: Pedido;
  @Input() asistencia: Asistencia;
  @Input() kitOptList:KitOptionList[] = [];

	@Output() updateToken = new EventEmitter<UpdatePedidoEvent>();

	public form: FormGroup;

  private action = "";
  private fireEvent: UpdatePedidoEvent;

  public depositoOptList =  AsistenciaHelper.getOptionlist('deposito');
  public alimentosOptList =  AsistenciaHelper.getOptionlist('alimentos');
  public pedidosOptList =  AsistenciaHelper.getOptionlist('pedidos');
  public frecuencaOptList =  AsistenciaHelper.getOptionlist('frecuencia');
  public periodoOptList =    AsistenciaHelper.getOptionlist('periodo');
  public causasOptList =   AsistenciaHelper.getOptionlist('causa');
  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');

  public kitEntregaOptList: KitOptionList[];

  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}

  ngOnInit() {
  	this.initForEdit(this.form, this.pedido);
    this.kitEntregaOptList = this.kitOptList;
  }

  onSubmit(){
  	this.initForSave(this.form, this.pedido);
  	this.action = UPDATE;
  	this.emitEvent(this.action);
  }

  onCancel(){
  	this.action = CANCEL;
  	this.emitEvent(this.action);
  }

  emitEvent(action:string){
  	this.updateToken.next({
  		action: action,
  		type: TOKEN_TYPE,
  		token: this.pedido
  	});

  }

  changeSelectionValue(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
  }

  changePeriodo(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
      //this.form.controls['city'].setValue(t.city);
    if(!this.asistencia) return;
    let date_from = devutils.dateFromTx(this.asistencia.fecomp_txa);
    let date_to = devutils.dateFromTx(this.asistencia.fecomp_txa);
    let datex;

    if(type==="periodo" && val==="3M"){
      datex =  devutils.projectedDate(date_to, 0, 3);

    }else if(type==="periodo" && val==="6M"){
      datex =  devutils.projectedDate(date_to, 0, 6);

    }else if(type==="periodo" && val==="9M"){
      datex =  devutils.projectedDate(date_to, 0, 9);

    }else if(type==="periodo" && val==="12M"){
      datex =  devutils.projectedDate(date_to, 0, 12);

    }

    this.form.controls['fechad'].setValue(devutils.txFromDate(date_from));
    this.form.controls['fechah'].setValue(devutils.txFromDate(date_to));
  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      type:        [null, Validators.compose([Validators.required])],
      freq:        [null, Validators.compose([Validators.required])],
      qty:         [null, Validators.compose([Validators.required])],
      periodo:     [null],
      fechad:      [null],
      fechah:      [null],

      deposito:    [null],
      urgencia:    [null],
      causa:       [null],
      estado:      [null],
      avance:      [null],
      observacion: [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, pedido: Pedido): FormGroup {
  	let modalidad: Modalidad = pedido.modalidad || new Modalidad();
  	let fecha = new Date();
		form.reset({
      periodo:      modalidad.periodo,
      fechad:       modalidad.fe_txd || devutils.txFromDate(fecha),
      fechah:       modalidad.fe_txh || devutils.txFromDate(fecha),
      freq:         modalidad.freq,

      type:         pedido.type,
      qty:          pedido.kitQty,
      deposito:     pedido.deposito,
      causa:        pedido.causa,
      estado:       pedido.estado,
      avance:       pedido.avance,
      observacion:  pedido.observacion,
		});

		return form;
  }

	initForSave(form: FormGroup, pedido: Pedido): Pedido {
		const fvalue = form.value;
		const entity = pedido;
		let modalidad: Modalidad = new Modalidad();

    let dateD = devutils.dateFromTx(fvalue.fechad);
    let dateH = devutils.dateFromTx(fvalue.fechah);

    modalidad['periodo'] = fvalue.periodo;
    modalidad['freq'] =    fvalue.freq;

    modalidad['fe_txd'] =  fvalue.fechad;
    modalidad['fe_tsd'] =  dateD ? dateD.getTime() : 0;

    modalidad['fe_txh'] = fvalue.fechah;
    modalidad['fe_tsh'] = dateH ? dateH.getTime() : 0;

    entity.type =        fvalue.type;

    entity.kitQty =      fvalue.qty;
    entity.deposito =    fvalue.deposito;
    entity.observacion = fvalue.observacion;
    entity.estado =      fvalue.estado;
    entity.avance =      fvalue.avance;
    entity.causa =       fvalue.causa;

    entity.modalidad = modalidad;

		return entity;
	}

}
