import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel, Address, UpdateAddressEvent } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'address';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'address-edit',
  templateUrl: './address-data-edit.component.html',
  styleUrls: ['./address-data-edit.component.scss']
})
export class AddressDataEditComponent implements OnInit {
	@Input() token: Address;
	@Output() updateToken = new EventEmitter<UpdateAddressEvent>();

  public countriesList =  personModel.paises;
  public provinciasList = personModel.provincias;
  public addTypeList =    personModel.addressTypes;
  public ciudadesList =   personModel.ciudades;

	public form: FormGroup;


  private action = "";
  private fireEvent: UpdateAddressEvent;

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
			slug:        [null],
			description: [null],
			isDefault:   [null],
			addType:     [null, Validators.compose([Validators.required])],
			street1:     [null, Validators.compose([Validators.required])],
			street2:     [null],
			city:        [null],
			state:       [null],
			statetext:   [null],
			zip:         [null],
			country:     [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, token: Address): FormGroup {
		form.reset({
			slug:        token.slug,
			description: token.description,
			isDefault:   token.isDefault,
			addType:     token.addType,
			street1:     token.street1,
			street2:     token.street2,
			city:        token.city,
			state:       token.state ||'buenosaires',
			statetext:   token.statetext || 'Brown' ,
			zip:         token.zip,
			country:     token.country || 'AR',
		});

		return form;
  }

	initForSave(form: FormGroup, token: Address): Address {
		const fvalue = form.value;
		const entity = token;

		entity.slug =         fvalue.slug;
		entity.description =  fvalue.description;
		entity.isDefault =    fvalue.isDefault;
		entity.addType =      fvalue.addType;
		entity.street1 =      fvalue.street1;
		entity.street2 =      fvalue.street2;
		entity.city =         fvalue.city;
		entity.state =        fvalue.state;
		entity.statetext =    fvalue.statetext;
		entity.zip =          fvalue.zip;
		entity.country =      fvalue.country;

		entity.estado = 'activo';

		if(!entity.slug){
			entity.slug = entity.city || entity.street1 || entity.description || 'principal';
		}

		return entity;
	}

}

