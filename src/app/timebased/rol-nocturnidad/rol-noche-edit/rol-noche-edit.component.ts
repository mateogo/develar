import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../entities/person/person';

import { RolNocturnidad, RolNocturnidadItem, UpdateRolEvent }    from '../../timebased.model';
import { TimebasedHelper }    from '../../timebased-helper';

import { devutils }from '../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'rol-noche-edit',
  templateUrl: './rol-noche-edit.component.html',
  styleUrls: ['./rol-noche-edit.component.scss']
})
export class RolNocheEditComponent implements OnInit {
	@Input() token: RolNocturnidad;
	@Output() updateToken = new EventEmitter<UpdateRolEvent>();

  public actionOptList =   TimebasedHelper.getOptionlist('actions');
  public sectorOptList =   TimebasedHelper.getOptionlist('sectores');
  public ciudadesOptList = TimebasedHelper.getOptionlist('ciudades');
	public form: FormGroup;

  public showViewAlimento = false;
  public showEditAlimento = false;

  private formAction = "";
  private fireEvent: UpdateRolEvent;

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
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
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

  initForEdit(form: FormGroup, token: RolNocturnidad): FormGroup {
		form.reset({
			slug:        token.slug,
			description: token.description,
			action:      token.action,
      sector:      token.sector,
			fecomp:      token.fecomp_txa,
		});

    if(token.avance !== 'emitido'){
      console.log('Invalidando campo Action');
      form.get('action').disable();
    }

		return form;
  }

	initForSave(form: FormGroup, token: RolNocturnidad): RolNocturnidad {
		const fvalue = form.value;
		const entity = token;

		entity.slug =         fvalue.slug;
		entity.description =  fvalue.description;
		entity.action =       fvalue.action;
    entity.sector =       fvalue.sector;
		entity.fecomp_txa =   fvalue.fecomp;

		entity.estado = entity.estado || 'activo';

		return entity;
	}

}
