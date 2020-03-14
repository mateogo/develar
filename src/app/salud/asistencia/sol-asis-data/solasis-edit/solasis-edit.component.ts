import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';
import { Asistencia, Alimento, Novedad, UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../asistencia.model';

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

  public actionOptList = []; // AsistenciaHelper.getOptionlist('actions');
  public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  public sectorActionRelation = AsistenciaHelper.getSectorActionRelation();
  public avanceEstadoRelation = AsistenciaHelper.getAvanceEstadoRelation();
  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  public novedadOptList = AsistenciaHelper.getOptionlist('novedades');

	public form: FormGroup;

  public showViewAlimento = false;
  public showEditAlimento = false;

  private formAction = "";
  private fireEvent: UpdateAsistenciaEvent;

  public novedadesTitle = 'Seguimiento de novedades relativas a esta SOLICITUD';

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
			description: token.description,
			action:      token.action,
      sector:      token.sector,
			fecomp:      token.fecomp_txa,
      estado:      token.estado,
      avance:      token.avance,
		});



    this.actionOptList = this.sectorActionRelation[token.sector] || [];
    this.buildNovedades(token.novedades)

		return form;
  }

  private buildNovedades(novedades: Novedad[]){
    novedades = novedades || [];
    let novedadesFG = novedades.map(novedad => this.fb.group(novedad))
    let novedadesFormArray = this.fb.array(novedadesFG);
    this.form.setControl('novedades', novedadesFormArray);
  }

  get novedades(): FormArray{
    return this.form.get('novedades') as FormArray;
  }

  addNovedad(){
    let item = new Novedad();
    let novedadFG = this.fb.group(item);
    let formArray = this.form.get('novedades') as FormArray;
    formArray.push(novedadFG);

  }

  removeItem(e, item){
    e.preventDefault();
    this.removeNovedadItem(item);
  }

  private removeNovedadItem(item){
    
    let formArray = this.form.get('novedades') as FormArray;
    formArray.removeAt(item);
  }


	initForSave(form: FormGroup, token: Asistencia): Asistencia {
		const fvalue = form.value;
		const entity = token;
    const novedades: Novedad[] = fvalue.novedades.map(t => Object.assign({}, t))

		entity.description =  fvalue.description;
		entity.action =       fvalue.action;
    entity.sector =       fvalue.sector;
		entity.fecomp_txa =   fvalue.fecomp;
    entity.estado =       fvalue.estado;
    entity.avance =       fvalue.avance;

		entity.estado = entity.estado || 'activo';
    entity.novedades = novedades || [];

		return entity;
	}

}
