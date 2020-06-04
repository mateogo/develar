import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';


import {  Task, Audit, ParentEntity } from '../tasks.model';
import {  TasksController } from '../tasks.controller';
import { 	UpdateTaskEvent, TasksHelper } from '../tasks.helper';

import { devutils }from '../../utils'

const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';



@Component({
  selector: 'tasks-edit',
  templateUrl: './tasks-edit.component.html',
  styleUrls: ['./tasks-edit.component.scss']
})
export class TasksEditComponent implements OnInit {
	@Input() token: Task;
  @Input() modulo: string = 'salud';
	@Output() updateToken = new EventEmitter<UpdateTaskEvent>();

  public typeOptList = [];

	public form: FormGroup;

  private formAction = "";
  private fireEvent: UpdateTaskEvent;

  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
    this.typeOptList = TasksHelper.getOptionlist(this.modulo);

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

  initForEdit(form: FormGroup, token: Task): FormGroup {
		form.reset({
			task: token.observacion,
			type:        token.type,
		});

		return form;
  }

	initForSave(form: FormGroup, token: Task): Task {
		const fvalue = form.value;
		const entity = token;

		entity.observacion =         fvalue.observacion;
		entity.type =  fvalue.type;

		return entity;
	}

}
