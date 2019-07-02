import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import {UpdateOficiosEvent, OficiosData, personModel } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'oficios';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'oficios-edit',
  templateUrl: './oficios-data-edit.component.html',
  styleUrls: ['./oficios-data-edit.component.scss']
})
export class OficiosDataEditComponent implements OnInit {


	@Input() token: OficiosData;
	@Output() updateToken = new EventEmitter<UpdateOficiosEvent>();

	public form: FormGroup;
  public estados        = personModel.oficiosEstadoList;
  public tiposdedatos   = personModel.oficiosTDatoList;
  public umeList        = personModel.oficiosUmeRemunList;
  public ocupaciones    = personModel.oficiosTOcupacionList;

  private action = "";

  private fireEvent: UpdateOficiosEvent;

  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
  	this.initForEdit(this.form, this.token);

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
 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			tdato:        [null],
			tocupacion:   [null],
			ocupacion:    [null],
			lugar:        [null],
			qdiasmes:     [null],
			remuneracion: [null],
			ume_remun:    [null],
			estado:       [null],
			desde:        [null],
			hasta:        [null],
			comentario:   [null],
    });
    return form;
  }

  initForEdit(form: FormGroup, token: OficiosData): FormGroup {
		form.reset({
			tdato:        token.tdato,
			tocupacion:   token.tocupacion,
			ocupacion:    token.ocupacion,
			lugar:        token.lugar,
			qdiasmes:     token.qdiasmes,
			remuneracion: token.remuneracion,
			ume_remun:    token.ume_remun,
			estado:       token.estado,
			desde:        token.desde,
			hasta:        token.hasta,
			comentario:   token.comentario,
		});

		return form;
  }

	initForSave(form: FormGroup, token: OficiosData): OficiosData {
		const fvalue = form.value;
		const entity = token; 

		entity.tdato =        fvalue.tdato;
		entity.tocupacion =   fvalue.tocupacion;
		entity.ocupacion =    fvalue.ocupacion;
		entity.lugar =        fvalue.lugar;
		entity.qdiasmes =     fvalue.qdiasmes;
		entity.remuneracion = fvalue.remuneracion;
		entity.ume_remun =    fvalue.ume_remun;
		entity.estado =       fvalue.estado;
		entity.desde =        fvalue.desde;
		entity.hasta =        fvalue.hasta;
		entity.comentario =   fvalue.comentario;

		return entity;
	}

}
