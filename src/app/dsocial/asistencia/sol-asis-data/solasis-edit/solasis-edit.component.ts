import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';
import { Asistencia, Alimento, UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../asistencia.model';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'solasis-edit',
  templateUrl: './solasis-edit.component.html',
  styleUrls: ['./solasis-edit.component.scss']
})
export class SolasisEditComponent implements OnInit {
	@Input() token: Asistencia;
	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

  public actionOptList =  AsistenciaHelper.getOptionlist('actions');
  public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
	public form: FormGroup;


  private formAction = "";
  private fireEvent: UpdateAsistenciaEvent;

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

  emitEvent(action:string){
  	this.updateToken.next({
  		action: action,
  		type: TOKEN_TYPE,
      selected: true,
  		token: this.token
  	});

  }

  changeSelectionValue(type, val){
    console.log('Change [%s] nuevo valor: [%s]', type, val);
  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			slug:        [null],
			description: [null],
      sector:      [null, Validators.compose([Validators.required])],
			action:      [null, Validators.compose([Validators.required])],
			fecomp:      [null, Validators.compose([Validators.required])],
    });

    return form;
  }

  initForEdit(form: FormGroup, token: Asistencia): FormGroup {
		form.reset({
			slug:        token.slug,
			description: token.description,
			action:      token.action,
      sector:      token.sector,
			fecomp:      token.fecomp_txa,
		});

		return form;
  }

	initForSave(form: FormGroup, token: Asistencia): Asistencia {
		const fvalue = form.value;
		const entity = token;

		entity.slug =         fvalue.slug;
		entity.description =  fvalue.description;
		entity.action =       fvalue.action;
    entity.sector =       fvalue.sector;
		entity.fecomp_txa =   fvalue.fecomp;

		entity.estado = 'activo';


		return entity;
	}

}
