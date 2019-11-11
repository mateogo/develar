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
  selector: 'encuesta-editmany',
  templateUrl: './solicita-encuesta-editmany.component.html',
  styleUrls: ['./solicita-encuesta-editmany.component.scss']
})
export class SolicitaEncuestaEditmanyComponent implements OnInit {
	@Input() token: Encuesta;
	@Input() asistencia: Asistencia;
	@Output() updateToken = new EventEmitter<UpdateEncuestaEvent>();



	public form: FormGroup;

	public locacionesOptList: OptionList[] = [];

  private action = "";
  private fireEvent: UpdateEncuestaEvent;
  public usersOptList;

  public alimentosOptList =  AsistenciaHelper.getOptionlist('alimentos');

  public urgenciaOptList =  AsistenciaHelper.getOptionlist('urgencia');

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

  selectLocation(id ){
    return this.locacionesOptList.find(t => t.val === id);
  }

  changeSelectionValue(type, val){

    if(type === 'locacionId'){
      let t = this.selectLocation(val)
      this.form.controls['city'].setValue(t.city);
      this.form.controls['barrio'].setValue(t.barrio);
    }

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
      city:         [null, Validators.compose([Validators.required])],
      barrio:       [null, Validators.compose([Validators.required])],
      urgencia:     [null],
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
      city:         token.city,
      barrio:       token.barrio,
      urgencia:     token.urgencia,
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
    entity.city =         fvalue.city;
    entity.barrio =       fvalue.barrio;
    entity.urgencia =     fvalue.urgencia;

    let fe = devutils.dateFromTx(entity.fe_visita)
    entity.fe_visita_ts = fe ? fe.getTime() : 0;
    entity.fe_visita = devutils.txFromDate(fe);

    entity.trabajador = this.usersOptList.find(u=>u.val == entity.trabajadorId).label;

		return entity;
	}

}

interface OptionList {
  val: string;
  label: string;
  barrio?: string;
  city?: string;
}
