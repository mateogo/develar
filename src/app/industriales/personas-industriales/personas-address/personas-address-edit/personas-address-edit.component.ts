import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Address, Geocoder, personModel, UpdateAddressEvent } from '../../../../entities/person/person';
import { PersonasController } from '../../personas-page/personas.controller';

const TOKEN_TYPE = 'address';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'personas-address-edit',
  templateUrl: './personas-address-edit.component.html',
  styleUrls: ['./personas-address-edit.component.scss']
})
export class PersonasAddressEditComponent implements OnInit {


  @Input() token: Address;
  @Output() updateToken = new EventEmitter<UpdateAddressEvent>();

  public countriesList = personModel.paises;
  public provinciasList = personModel.provincias;
  /*public ciudadesList =   personModel.ciudades;
  public barrioList = [];*/

  public estadoVivOptList = personModel.estadoVivOptList;
  public cualificacionVivOptList = personModel.cualificacionVivOptList;

  public addTypeList = [
    { val: 'no_definido', label: 'Seleccione opción', slug: 'Seleccione opción' },
    { val: 'fabrica', label: 'Fabrica', slug: 'Sede fábrica' },
    { val: 'deposito', label: 'Depósito', slug: 'Depósito' },
    { val: 'admin', label: 'Administración', slug: 'Sede administración' },
    { val: 'fiscal', label: 'Fiscal', slug: 'Domicilio fiscal' },
    { val: 'comercial', label: 'Comercial', slug: 'Domicilio comercial' },
    { val: 'entrega', label: 'Lugar entrega', slug: 'Lugar de entrega' },
    { val: 'sucursal', label: 'Sucursal', slug: 'Sucursal' },
    { val: 'pagos', label: 'Pagos', slug: 'Sede pagos' },
    { val: 'rrhh', label: 'Recursos humanos', slug: 'Sede recursos humanos' },
    { val: 'biblioteca', label: 'Biblioteca', slug: 'Sede Biblioteca' },
    { val: 'dependencia', label: 'Dependencia', slug: 'Otras dependencias' },
    { val: 'principal', label: 'Principal', slug: 'Locación principal' },
    { val: 'particular', label: 'Particular', slug: 'Domicilio particular' },
    { val: 'dni', label: 'DNI', slug: 'Domicilio en el DNI' },
  ];


  public form: FormGroup;

  public renderMap = false;

  private zoom: number = 8;
  private location: Geocoder = {
    lat: -34.5922017,
    lng: -58.41167669999999,
    label: ''
  }


  private action = "";
  private fireEvent: UpdateAddressEvent;

  constructor(
    private fb: FormBuilder,
    private _prsCtrl: PersonasController
  ) {
    this.form = this.buildForm();
  }



  ngOnInit() {
    this.initForEdit(this.form, this.token);

  }

  onSubmit() {
    this.initForSave(this.form, this.token);
    this.action = UPDATE;
    this.emitEvent(this.action);
  }

  onCancel() {
    this.action = CANCEL;
    this.emitEvent(this.action);
  }

  deleteToken() {
    this.action = DELETE;
    this.emitEvent(this.action);

  }

  updateLatLngAndEmit(updateToken: UpdateAddressEvent) {
    this._prsCtrl.addressLookUp(this.token)
      .then(data => {
        this.buildGeoData(this.token, data, false);
        this.updateToken.next(updateToken);
      });
  }

  emitEvent(action: string) {
    let updateEvent: UpdateAddressEvent = {
      action: action,
      type: TOKEN_TYPE,
      token: this.token
    }

    if (this.action === UPDATE) {
      this.updateLatLngAndEmit(updateEvent);

    } else {
      this.updateToken.next(updateEvent);

    }
  }

  changeSelectionValue(type, val) {
  }


  /*changeCity() {
      this.barrioList = personModel.getBarrioList(this.form.value.city);
      let zip = personModel.fetchCP(this.form.value.city);
      this.form.controls['zip'].setValue(zip);
  
  }*/

  mapLookUp() {
    let address: Address = this.initForSave(this.form, this.token);
    this.showMap(address, true);
  }

  buildGeoData(address: Address, data: any, fireMap: boolean) {
    if (data.status === 'OK') {
      this.zoom = 15;

      this.location = data.location;
      this.location.label = address.street1 + '@' + address.description;

      address.lat = this.location.lat;
      address.lng = this.location.lng;

      this.renderMap = fireMap;
    }
  }

  showMap(address: Address, fireMap: boolean) {
    this._prsCtrl.addressLookUp(address)
      .then(data => {
        this.buildGeoData(address, data, fireMap);

      });
  }

  buildForm(): FormGroup {
    let form: FormGroup;

    form = this.fb.group({
      slug: [null],
      //description: [null],
      isDefault: [null],
      addType: [null, Validators.compose([Validators.required])],
      street1: [null, Validators.compose([Validators.required])],
      street2: [null],
      streetIn: [null],
      streetOut: [null],
      city: [null],
      barrio: [null],
      state: [null],
      statetext: [null],
      zip: [null],
      //estadoviv: [null],
      //cualificacionviv: [null],
      country: [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, token: Address): FormGroup {
    form.reset({
      slug: token.slug,
      description: token.description,
      isDefault: token.isDefault,
      addType: token.addType,
      street1: token.street1,
      street2: token.street2,
      streetIn: token.streetIn,
      streetOut: token.streetOut,
      city: token.city,
      barrio: token.barrio,
      state: token.state || 'buenosaires',
      statetext: token.statetext,
      zip: token.zip,
      estadoviv: token.estadoviv,
      cualificacionviv: token.cualificacionviv,
      country: token.country || 'AR',
    });

    //this.barrioList = personModel.getBarrioList(token.city);
    return form;
  }

  initForSave(form: FormGroup, token: Address): Address {
    const fvalue = form.value;
    const entity = token;

    entity.slug = fvalue.slug;
    //entity.description = fvalue.description;
    entity.isDefault = fvalue.isDefault;
    entity.addType = fvalue.addType;
    entity.street1 = fvalue.street1;
    entity.street2 = fvalue.street2;
    entity.streetIn = fvalue.streetIn;
    entity.streetOut = fvalue.streetOut;
    entity.city = fvalue.city;
    entity.barrio = fvalue.barrio;
    entity.state = fvalue.state;
    entity.statetext = fvalue.statetext;
    entity.zip = fvalue.zip;
    entity.country = fvalue.country;
    //entity.estadoviv = fvalue.estadoviv,
      //entity.cualificacionviv = fvalue.cualificacionviv,

      entity.estado = 'activo';

    if (!entity.slug) {
      entity.slug = entity.city || entity.street1 || entity.description || 'principal';
    }

    return entity;
  }
}
