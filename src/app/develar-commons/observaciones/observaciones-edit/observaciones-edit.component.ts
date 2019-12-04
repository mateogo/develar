import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';


import {  Observacion, Audit, ParentEntity } from '../observaciones.model';
import {  ObservacionesController } from '../observaciones.controller';
import { 	UpdateObservacionEvent, ObservacionesHelper } from '../observaciones.helper';

import { devutils }from '../../utils'

const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';


@Component({
  selector: 'observaciones-edit',
  templateUrl: './observaciones-edit.component.html',
  styleUrls: ['./observaciones-edit.component.scss']
})
export class ObservacionesEditComponent implements OnInit {
	@Input() token: Observacion;
	@Output() updateToken = new EventEmitter<UpdateObservacionEvent>();

  public typeOptList =  ObservacionesHelper.getOptionlist('type');

	public form: FormGroup;

  private formAction = "";
  private fireEvent: UpdateObservacionEvent;

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
  	this.formAction = UPDATE;
  	this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }

  deleteToken(){
    this.formAction = DELETE;
    this.emitEvent(this.formAction);

  }

  emitEvent(action:string){
  	this.updateToken.next({
  		action: action,
  		token: this.token
  	});

  }

  changeSelectionValue(type, val){
  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      type:      [null, Validators.compose([Validators.required])],
			observacion: [null, Validators.compose([Validators.required])],

    });

    return form;
  }

  initForEdit(form: FormGroup, token: Observacion): FormGroup {
		form.reset({
			observacion: token.observacion,
			type:        token.type,
		});

		return form;
  }

	initForSave(form: FormGroup, token: Observacion): Observacion {
		const fvalue = form.value;
		const entity = token;

		entity.observacion =         fvalue.observacion;
		entity.type =  fvalue.type;

		return entity;
	}

}
