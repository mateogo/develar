import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel, Address, EncuestaAmbiental, UpdateEncuestaEvent } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'encuesta';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'ambiental-edit',
  templateUrl: './ambiental-data-edit.component.html',
  styleUrls: ['./ambiental-data-edit.component.scss']
})
export class AmbientalDataEditComponent implements OnInit {
	@Input() token: EncuestaAmbiental;
  @Input() addresses: Array<Address> = [];
	@Output() updateToken = new EventEmitter<UpdateEncuestaEvent>();


  public tipovivList = personModel.getTiposVivienda('tvivienda');
  public domterrenoList = personModel.getTiposVivienda('terreno');

  public matvivList = personModel.getTiposVivienda('mvivienda');

  public techovivList = personModel.getTiposVivienda('techo');
  public pisovivList = personModel.getTiposVivienda('piso');

  public tventilacionList = personModel.getEstadosVivienda('adecuado');

  public tcocinaList = personModel.getTiposVivienda('cocina');
  public ecocinaList = personModel.getEstadosVivienda('calificacion');


  public tbanioList = personModel.getTiposVivienda('interno');
  public ebanioList = personModel.getEstadosVivienda('completo');

  public tmobiliarioList = personModel.getTiposVivienda('suficiente');
  public emobiliarioList = personModel.getEstadosVivienda('calificacion');

  public aguaList = personModel.getTiposVivienda('agua');
  public electricidadList = personModel.getTiposVivienda('electricidad');
  public cloacaList = personModel.getTiposVivienda('cloaca');
  public gasList = personModel.getTiposVivienda('gas');

	public form: FormGroup;


  private action = "";
  private fireEvent: UpdateEncuestaEvent;

  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
  	this.initForEdit(this.form, this.token, this.addresses);

  }

  onSubmit(){
  	this.initForSave(this.form, this.token, this.addresses);
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
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      estado:       [null],
      addresslink:  [null],
      ferel:        [null],
      fereltxt:     [null],
      tsocial:      [null],
      tipoviv:      [null],
      domterreno:   [null],
      aniosresid:   [null],
      qvivxlote:    [null],
      qhabitantes:  [null],
      matviv:       [null],
      techoviv:     [null],
      pisoviv:      [null],
      qdormitorios: [null],
      tventilacion: [null],
      tcocina:      [null],
      ecocina:      [null],
      tbanio:       [null],
      ebanio:       [null],
      tmobiliario:  [null],
      emobiliario:  [null],
      agua:         [null],
      electricidad: [null],
      cloaca:       [null],
      gas:          [null],
      observacion:  [null],

    });

    return form;
  }


  linkAddress(token: EncuestaAmbiental, addresses: Address[]){
    if(token.id_address) return; // ya está vinculado
    if(!token.street1 || !addresses || !addresses.length ) return; // no hay matching posible
    let address = addresses.find(el => el.street1 === token.street1);
    if(address){
      token.id_address = address._id;
    }

  }

  initForEdit(form: FormGroup, token: EncuestaAmbiental, addresses: Address[]): FormGroup {
    this.linkAddress(token, addresses);
		form.reset({
      estado:       token.estado,
      addresslink:  token.id_address,
      ferel:        token.ferel,
      fereltxt:     token.fereltxt,
      tsocial:      token.tsocial,
      tipoviv:      token.tipoviv,
      domterreno:   token.domterreno,
      aniosresid:   token.aniosresid,
      qvivxlote:    token.qvivxlote,
      qhabitantes:  token.qhabitantes,
      matviv:       token.matviv,
      techoviv:     token.techoviv,
      pisoviv:      token.pisoviv,
      qdormitorios: token.qdormitorios,
      tventilacion: token.tventilacion,
      tcocina:      token.tcocina,
      ecocina:      token.ecocina,
      tbanio:       token.tbanio,
      ebanio:       token.ebanio,
      tmobiliario:  token.tmobiliario,
      emobiliario:  token.emobiliario,
      agua:         token.agua,
      electricidad: token.electricidad,
      cloaca:       token.cloaca,
      gas:          token.gas,
      observacion:  token.observacion,
		});

		return form;
  }

	initForSave(form: FormGroup, token: EncuestaAmbiental, addresses: Address[]): EncuestaAmbiental {
		const fvalue = form.value;
		const entity = token;

		entity.estado =       fvalue.estado;
    entity.id_address =   fvalue.addresslink;
		entity.ferel =        fvalue.ferel;
		entity.fereltxt =     fvalue.fereltxt;
		entity.tsocial =      fvalue.tsocial;
		entity.tipoviv =      fvalue.tipoviv;
		entity.domterreno =   fvalue.domterreno;
		entity.aniosresid =   fvalue.aniosresid;
		entity.qvivxlote =    fvalue.qvivxlote;
    entity.qhabitantes =  fvalue.qhabitantes;
		entity.matviv =       fvalue.matviv;
		entity.techoviv =     fvalue.techoviv;
		entity.pisoviv =      fvalue.pisoviv;
		entity.qdormitorios = fvalue.qdormitorios;
		entity.tventilacion = fvalue.tventilacion;
		entity.tcocina =      fvalue.tcocina;
		entity.ecocina =      fvalue.ecocina;
		entity.tbanio =       fvalue.tbanio;
		entity.ebanio =       fvalue.ebanio;
		entity.tmobiliario =  fvalue.tmobiliario;
		entity.emobiliario =  fvalue.emobiliario;
		entity.agua =         fvalue.agua;
		entity.electricidad = fvalue.electricidad;
		entity.cloaca =       fvalue.cloaca;
		entity.gas =          fvalue.gas;
    entity.observacion =  fvalue.observacion;

    if(entity.id_address && addresses && addresses.length){
      let _address = addresses.find(t => t._id === entity.id_address);
      if(_address){
        entity.street1 = _address.street1;
        entity.barrio = _address.barrio;
        entity.city = _address.city;
      }

    }

		entity.estado = 'activo';

		return entity;
	}


}