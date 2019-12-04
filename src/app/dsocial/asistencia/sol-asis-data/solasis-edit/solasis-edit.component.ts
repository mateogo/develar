import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';
import { Asistencia, Alimento, UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../asistencia.model';
import { KitOptionList } from '../../../alimentos/alimentos.model';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';

@Component({
  selector: 'solasis-edit',
  templateUrl: './solasis-edit.component.html',
  styleUrls: ['./solasis-edit.component.scss']
})
export class SolasisEditComponent implements OnInit {
	@Input() token: Asistencia;
	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();
  @Input() kitOptList:KitOptionList[];

  public actionOptList = []; // AsistenciaHelper.getOptionlist('actions');
  public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  public sectorActionRelation = AsistenciaHelper.getSectorActionRelation();
  public avanceEstadoRelation = AsistenciaHelper.getAvanceEstadoRelation();
  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');

	public form: FormGroup;

  public showViewAlimento = false;
  public showEditAlimento = false;

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

  deleteToken(){
    this.formAction = DELETE;
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
    if(type==='sector'){
      this.actionOptList = this.sectorActionRelation[val] || [];

      if(this.actionOptList.length === 1){
        this.form.get('action').setValue(this.actionOptList[0].val);

      }
    }

    if(type==='avance'){
      this.estadoOptList = this.avanceEstadoRelation[val] || [];
      
      if(this.token.avance === val && this.token.estado){
        this.form.get('estado').setValue(this.token.estado);

      } else if(this.estadoOptList.length === 1){
        this.form.get('estado').setValue(this.estadoOptList[0].val);

      }else {
        this.form.get('estado').setValue(null);

      }
    }
  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			slug:        [null],
			description: [null],
      sector:      [null, Validators.compose([Validators.required])],
			action:      [null, Validators.compose([Validators.required])],
			fecomp:      [null, Validators.compose([Validators.required])],
      avance:      [null, Validators.compose([Validators.required])],
      estado:      [null, Validators.compose([Validators.required])],

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
      estado:      token.estado,
      avance:      token.avance,
		});

    // if(token.avance !== 'emitido'){
    //   form.get('action').disable();
    // }
    this.actionOptList = this.sectorActionRelation[token.sector] || [];

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
    entity.estado =       fvalue.estado;
    entity.avance =       fvalue.avance;

		entity.estado = entity.estado || 'activo';

		return entity;
	}

}
