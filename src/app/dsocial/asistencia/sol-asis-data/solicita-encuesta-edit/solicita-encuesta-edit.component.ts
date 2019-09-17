import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { DsocialController } from '../../../dsocial.controller';

import { Person, Address } from '../../../../entities/person/person';

import { 	Asistencia, 
					Encuesta, 
					UpdateEncuestaEvent, 
					AsistenciaHelper } from '../../asistencia.model';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'encuesta';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'solicita-encuesta-edit',
  templateUrl: './solicita-encuesta-edit.component.html',
  styleUrls: ['./solicita-encuesta-edit.component.scss']
})
export class SolicitaEncuestaEditComponent implements OnInit {
	@Input() token: Encuesta;
	@Input() asistencia: Asistencia;
	@Output() updateToken = new EventEmitter<UpdateEncuestaEvent>();



	public form: FormGroup;

	public locacionesOptList: OptList[] = [];

  private action = "";
  private fireEvent: UpdateEncuestaEvent;
  public usersOptList;

  public alimentosOptList =  AsistenciaHelper.getOptionlist('alimentos');
  public frecuencaOptList =  AsistenciaHelper.getOptionlist('frecuencia');

  public avanceOptList = AsistenciaHelper.getOptionlist('encuesta');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');

  constructor(
  	private dsCtrl: DsocialController,
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}

  ngOnInit() {
  	this.initForEdit(this.form, this.token);
  	this.usersOptList = this.dsCtrl.buildEncuestadoresOptList();

  	let personId = this.asistencia.requeridox.id;

  	if(personId){
  		this.dsCtrl.loadPersonAddressesOptList(personId).subscribe(arr => {
  			if(arr && arr.length){
  				this.locacionesOptList = arr;
  			}

  		})
  	}
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
			fe_visita:    [null, Validators.compose([Validators.required])],
			fe_visita_ts: [null],
			locacionId:   [null],
			ruta:         [null],
			trabajador:   [null],
			trabajadorId: [null],
			preparacion:  [null],
			estado:       [null],
			avance:       [null],
			evaluacion:   [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, token: Encuesta): FormGroup {
		form.reset({
			fe_visita:    token.fe_visita,
			fe_visita_ts: token.fe_visita_ts,
			locacionId:   token.locacionId,
			ruta:         token.ruta,
			trabajador:   token.trabajador,
			trabajadorId: token.trabajadorId,
			estado:       token.estado,
			avance:       token.avance,
			preparacion:  token.preparacion,
			evaluacion:   token.evaluacion,
		});

		return form;
  }
  fetchLabel(val, list){

  }

	initForSave(form: FormGroup, token: Encuesta): Encuesta {
		const fvalue = form.value;
		const entity = token;

		entity.fe_visita =    fvalue.fe_visita;
		entity.fe_visita_ts = fvalue.fe_visita_ts;
		entity.locacionId =   fvalue.locacionId;
		entity.ruta =         fvalue.ruta;
		entity.trabajador =   fvalue.trabajador;
		entity.trabajadorId = fvalue.trabajadorId;
		entity.estado =       fvalue.estado;
		entity.avance =       fvalue.avance;
		entity.evaluacion =   fvalue.evaluacion;
		entity.preparacion =  fvalue.preparacion;

    let fe = devutils.dateFromTx(entity.fe_visita)
    entity.fe_visita_ts = fe.getTime();
    entity.fe_visita = devutils.txFromDate(fe);

    entity.trabajador = this.usersOptList.find(u=>u.val == entity.trabajadorId).label;

		return entity;
	}

}

interface OptList {
	val: string;
	label: string;
}