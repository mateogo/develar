import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { DsocialController } from '../../../dsocial.controller';


import { CustomValidators } from 'ng2-validation';

import { Person } from '../../../../entities/person/person';

import { AlimentosHelper } from '../../../alimentos/alimentos.model';

import { 	Asistencia, 
					Alimento, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';

import { KitOptionList } from '../../../alimentos/alimentos.model';


import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'alimentos';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'alimentos-edit',
  templateUrl: './solicita-alimentos-edit.component.html',
  styleUrls: ['./solicita-alimentos-edit.component.scss']
})
export class SolicitaAlimentosEditComponent implements OnInit {
	@Input() token: Alimento;
  @Input() parent: Asistencia;
  @Input() kitOptList:KitOptionList[] = [];

	@Output() updateToken = new EventEmitter<UpdateAlimentoEvent>();



	public form: FormGroup;


  private action = "";
  private fireEvent: UpdateAlimentoEvent;

  public alimentosOptList =  AsistenciaHelper.getOptionlist('alimentos');
  public frecuencaOptList =  AsistenciaHelper.getOptionlist('frecuencia');
  public periodoOptList =    AsistenciaHelper.getOptionlist('periodo');

  public kitEntregaOptList: KitOptionList[];


  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}

  ngOnInit() {
  	this.initForEdit(this.form, this.token);
    this.kitEntregaOptList = this.kitOptList;
  }

  onSubmit(){
  	this.initForSave(this.form, this.token);
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
  		token: this.token
  	});

  }

  changeSelectionValue(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
  }

  changePeriodo(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
      //this.form.controls['city'].setValue(t.city);
    this.projectedDate(val);
  }

  private projectedDate(val){
    if(!this.parent || !val) return;
    
    let date_from = devutils.dateFromTx(this.parent.fecomp_txa);
    let date_to = devutils.dateFromTx(this.parent.fecomp_txa);
    let datex;

    if(val === "3M"){
      datex =  devutils.projectedDate(date_to, 0, 3);

    }else if(val === "6M"){
      datex =  devutils.projectedDate(date_to, 0, 6);

    }else if(val === "9M"){
      datex =  devutils.projectedDate(date_to, 0, 9);

    }else if(val === "12M"){
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
      fechad:      [null],
      periodo:     [null],
      fechah:      [null],
      observacion: [null],
    });

    return form;
  }

  private initForEdit(form: FormGroup, token: Alimento): FormGroup {
		form.reset({
      type:         token.type,
      freq:         token.freq,
      qty:          token.qty,
      periodo:      token.periodo,
      fechad:       token.fe_txd,
      fechah:       token.fe_txh,
      observacion:  token.observacion,
		});

    this.projectedDate(token.periodo);
		return form;
  }

	initForSave(form: FormGroup, token: Alimento): Alimento {
		const fvalue = form.value;
		const entity = token;
    let dateD = devutils.dateFromTx(fvalue.fechad);
    let dateH = devutils.dateFromTx(fvalue.fechah);

    entity.type =         fvalue.type;
    entity.periodo =      fvalue.periodo;
    
    entity.fe_txd =       fvalue.fechad;
    entity.fe_tsd =       dateD ? dateD.getTime() : 0;

    entity.fe_txh =       fvalue.fechah;
    entity.fe_tsh =       dateH ? dateH.getTime() : 0;

    entity.freq =         fvalue.freq;
    entity.qty =          fvalue.qty;
    entity.observacion =  fvalue.observacion;

		return entity;
	}

}

