import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel, EncuestaAmbiental, UpdateEncuestaEvent } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'encuesta';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'encuesta-edit',
  templateUrl: './address-eval-edit.component.html',
  styleUrls: ['./address-eval-edit.component.scss']
})
export class AddressEvalEditComponent implements OnInit {
	@Input() token: EncuestaAmbiental;
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
    console.log('Change [%s] nuevo valor: [%s]', type, val);
  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      estado:       [null],
      ferel:        [null],
      fereltxt:     [null],
      tsocial:      [null],
      tipoviv:      [null],
      domterreno:   [null],
      aniosresid:   [null],
      qvivxlote:    [null],
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

    });

    return form;
  }

  initForEdit(form: FormGroup, token: EncuestaAmbiental): FormGroup {
		form.reset({
      estado:       token.estado,
      ferel:        token.ferel,
      fereltxt:     token.fereltxt,
      tsocial:      token.tsocial,
      tipoviv:      token.tipoviv,
      domterreno:   token.domterreno,
      aniosresid:   token.aniosresid,
      qvivxlote:    token.qvivxlote,
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
		});

		return form;
  }

	initForSave(form: FormGroup, token: EncuestaAmbiental): EncuestaAmbiental {
		const fvalue = form.value;
		const entity = token;

		entity.estado =       fvalue.estado;
		entity.ferel =        fvalue.ferel;
		entity.fereltxt =     fvalue.fereltxt;
		entity.tsocial =      fvalue.tsocial;
		entity.tipoviv =      fvalue.tipoviv;
		entity.domterreno =   fvalue.domterreno;
		entity.aniosresid =   fvalue.aniosresid;
		entity.qvivxlote =    fvalue.qvivxlote;
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


		entity.estado = 'activo';

		return entity;
	}


}