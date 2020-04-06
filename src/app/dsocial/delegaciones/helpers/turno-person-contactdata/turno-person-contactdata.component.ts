import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel, UpdatePersonEvent, Address,PersonContactData } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';
const CORE = 'core';


@Component({
  selector: 'turno-person-contactdata',
  templateUrl: './turno-person-contactdata.component.html',
  styleUrls: ['./turno-person-contactdata.component.scss']
})
export class TurnoPersonContactdataComponent implements OnInit {
	@Input() token: Person;
  @Input() detailView = true;
	@Output() updateToken = new EventEmitter<UpdatePersonEvent>();

	public form: FormGroup;

  private formAction = "";
  private fireEvent: UpdatePersonEvent;

  public sumbitted = false;

  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}

  ngOnInit() {
  	this.initForEdit(this.form, this.token);
  }


  onSubmit(){
    this.sumbitted = true;

    this.initForSave(this.form, this.token);
    this.formAction = UPDATE;

    this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }

    
  hasError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  private emitEvent(action:string){
  	this.updateToken.next({
			action: action,
			token: CORE,
			person: this.token
  	});

  }

  changeSelectionValue(type, val){

  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
 
      telefono:     [null, [ Validators.required ]],
 
    });

    return form;
  }


  initForEdit(form: FormGroup, token: Person): FormGroup {
    let contactList = token.contactdata || [];

    let celular = contactList.find(t => t.tdato === "CEL");

    if(!celular){
    	celular = new PersonContactData();
    }


		form.reset({

      telefono:    celular.data,

		});

    this.sumbitted = false;
		return form;
  }



	initForSave(form: FormGroup, token: Person): Person {
		const fvalue = form.value;
		const entity = token;


    let contactdata = entity.contactdata || []
    let celular = contactdata.find(t => t.tdato === "CEL");
    if(!celular){
    	celular = new PersonContactData();
    	contactdata.push(celular);
    }
    celular.tdato = "CEL";
    celular.type = "PER";
    celular.data = fvalue.telefono;
    celular.slug = 'Alta x formulario turnos web';
    celular.isPrincipal = true;
    entity.contactdata = contactdata;

		return entity;
	}



}
