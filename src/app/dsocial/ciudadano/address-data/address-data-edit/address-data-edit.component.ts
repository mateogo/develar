import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel, Address, Geocoder, UpdateAddressEvent } from '../../../../entities/person/person';

import { DsocialController } from '../../../dsocial.controller';
import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'address';
const CANCEL = 'cancel';
const DELETE = 'delete';
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
  public barrioList = [];
  public estadoVivOptList = personModel.estadoVivOptList;
  public cualificacionVivOptList = personModel.cualificacionVivOptList;

	public form: FormGroup;

	public renderMap = false;

  private zoom: number = 8;
  private location: Geocoder = {
    lat:  -34.5922017,
    lng:  -58.41167669999999,
    label: ''
  }


  private action = "";
  private fireEvent: UpdateAddressEvent;

  constructor(
  	private fb: FormBuilder,
  	private dsCtrl: DsocialController,
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

  deleteToken(){
  	this.action = DELETE;
  	this.emitEvent(this.action);

  }

  updateLatLngAndEmit(updateToken: UpdateAddressEvent){
		this.dsCtrl.addressLookUp(this.token)
			.then(data => {
				this.buildGeoData(this.token, data, false);
		  	this.updateToken.next(updateToken);
			});
  }

  emitEvent(action:string){
  	let updateEvent: UpdateAddressEvent = {
  		action: action,
  		type: TOKEN_TYPE,
  		token: this.token
  	}

  	if(this.action === UPDATE){
  		this.updateLatLngAndEmit(updateEvent);

  	} else {
	  	this.updateToken.next(updateEvent);

  	}
  }

  changeSelectionValue(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
  }


	changeCity() {
	    this.barrioList = personModel.getBarrioList(this.form.value.city);
	    let zip = personModel.fetchCP(this.form.value.city);
			this.form.controls['zip'].setValue(zip);

	}

	mapLookUp(){
		let address: Address = this.initForSave(this.form,this.token);
	  this.showMap(address, true);
	}

	buildGeoData(address: Address, data: any, fireMap: boolean){
		  if(data.status === 'OK'){
		    this.zoom = 15;

		    this.location = data.location;
		    this.location.label = address.street1 + '@' +  address.description;

		    address.lat = this.location.lat;
		    address.lng = this.location.lng;
		    
		    this.renderMap = fireMap;
		  }
	}

	showMap(address: Address, fireMap: boolean){
		this.dsCtrl.addressLookUp(address)
		.then(data => {
		  this.buildGeoData(address, data, fireMap);

		});
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
			streetIn:    [null],
			streetOut:   [null],
			city:        [null, Validators.compose([Validators.required])],
			barrio:      [null, Validators.compose([Validators.required])],
			state:       [null],
			statetext:   [null],
			zip:         [null],
			estadoviv:   [null],
			cualificacionviv:  [null],
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
			streetIn:    token.streetIn,
			streetOut:   token.streetOut,
			city:        token.city,
			barrio:      token.barrio,
			state:       token.state ||'buenosaires',
			statetext:   token.statetext || 'Brown' ,
			zip:         token.zip,
			estadoviv:   token.estadoviv,
			cualificacionviv: token.cualificacionviv,
			country:     token.country || 'AR',
		});

		this.barrioList = personModel.getBarrioList(token.city);
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
		entity.streetIn =     fvalue.streetIn;
		entity.streetOut =    fvalue.streetOut;
		entity.city =         fvalue.city;
    entity.barrio =       fvalue.barrio;
		entity.state =        fvalue.state;
		entity.statetext =    fvalue.statetext;
		entity.zip =          fvalue.zip;
		entity.country =      fvalue.country;
		entity.estadoviv =        fvalue.estadoviv,
		entity.cualificacionviv = fvalue.cualificacionviv,

		entity.estado = 'activo';

		if(!entity.slug){
			entity.slug = entity.city || entity.street1 || entity.description || 'principal';
		}

		return entity;
	}

}

