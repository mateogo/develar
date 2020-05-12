import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { MotivoInternacion, UpdateInternacionEvent } from '../../internacion.model';

import { InternacionService } from '../../internacion.service';
import { InternacionHelper } from '../../internacion.helper';

import { devutils }from '../../../../develar-commons/utils'


const SEARCH_LOCACION = 'search_locacion';
const NEXT = 'next';

const CANCEL = 'cancel';
const UPDATE = 'update';
const CREATE = 'create';
const CORE = 'core';
const SERVICIO_DEFAULT = "INTERNACION"


@Component({
  selector: 'triage-edit',
  templateUrl: './triage-edit.component.html',
  styleUrls: ['./triage-edit.component.scss']
})
export class TriageEditComponent implements OnInit {
	@Input() triage: MotivoInternacion;
  @Output() updateTriageEvent = new EventEmitter<UpdateInternacionEvent>();
  @Input() buscarLocacion = true;

  pageTitle: string = 'Triage de internación';
  public form: FormGroup;

  public afeccionOptList =     InternacionHelper.getOptionlist('afecciones')
  public especialidadOptList = InternacionHelper.getOptionlist('epecialidades')
  public servicioOptList =     InternacionHelper.getOptionlist('servicios')
  public tranitTypeOptList =   InternacionHelper.getOptionlist('tiposTransitos');

  constructor(
      private fb: FormBuilder,
			private intSrv: InternacionService,

  ) { }

  ngOnInit() {
  	this.initForm(this.form)
  }

	/************************************/
	/******* Template Events *******/
	/**********************************/
  onSubmit() {
  	this.triage = Object.assign(this.triage, this.form.value)
  	this.triage.target = InternacionHelper.getCapacidadFromServicio(this.triage.servicio);
		this.emitEvent(NEXT);
  }

  onLocationSearch(){
    this.triage = Object.assign(this.triage, this.form.value)
    this.triage.target = InternacionHelper.getCapacidadFromServicio(this.triage.servicio);
    this.emitEvent(SEARCH_LOCACION);
  }

  cancel(){
  	this.emitEvent(CANCEL);
  }

	private emitEvent(action:string){
		this.updateTriageEvent.next({
			action:  action,
			type:    CORE,
			token:   this.triage
		});

	}

  private initForm(form: FormGroup){
  	if(!this.triage) this.triage = new MotivoInternacion({servicio: SERVICIO_DEFAULT});
    this.form = this.fb.group(new MotivoInternacion({servicio: SERVICIO_DEFAULT}));
    this.form.reset(this.triage);
  }

	/************************************/
	/******* Template Helpers *******/
	/**********************************/
   changeSelectionValue(type, val) {
  }

  hasError = (controlName: string, errorName: string) =>{
      return this.form.controls[controlName].hasError(errorName);
  }

}
