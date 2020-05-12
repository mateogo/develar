import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { LocacionHospitalaria, Recurso, LocacionEvent} from '../../../../entities/locaciones/locacion.model';


import { SolicitudInternacion, MotivoInternacion, Internacion,
				UpdateInternacionEvent } from '../../internacion.model';

import { InternacionService } from '../../internacion.service';
import { InternacionHelper } from '../../internacion.helper';

import { devutils }from '../../../../develar-commons/utils'

const CANCEL = 'cancel';
const UPDATE = 'update';
const CREATE = 'create';
const CORE = 'core';
const SERVICIO_DEFAULT = "INTERNACION"


@Component({
  selector: 'internacion-edit',
  templateUrl: './internacion-edit.component.html',
  styleUrls: ['./internacion-edit.component.scss']
})
export class InternacionEditComponent implements OnInit {
	@Input() solicitud: SolicitudInternacion;
  @Input() internacion: Internacion;
  @Output() updateInternacionEvent = new EventEmitter<UpdateInternacionEvent>();

  pageTitle: string = 'Selector de recurso de internación';
  public form: FormGroup;
  public locacion: LocacionHospitalaria;
  public locacionId: string
  public personSlug: string;
  private servicio: string;
  public servicioLabel: string
  public recursosOptList: Array<Recurso> = []

  public tranitTypeOptList =   InternacionHelper.getOptionlist('tiposTransitos');

  public afeccionOptList =     InternacionHelper.getOptionlist('afecciones')
  public especialidadOptList = InternacionHelper.getOptionlist('epecialidades')
  public servicioOptList =     InternacionHelper.getOptionlist('servicios');

  public transition: string;

  public showEditor = false;

  constructor(
      private fb: FormBuilder,
			private intSrv: InternacionService,

  ) {
  	this.buildForm(this.form);

 }

  ngOnInit() {
  	this.initForm(this.form)

  	if(!this.internacion ) this.internacion = this.solicitud.internacion;

  	this.locacionId = this.internacion.locId;
  	this.personSlug = this.solicitud.requeridox.slug;
  	this.servicio = this.internacion.servicio;

    this.transition = this.solicitud.triage.transitType;

  	this.fetchLocacionHospitalaria()
  }

	/************************************/
	/******* Template Events *******/
	/**********************************/
  onSubmit() {
    this.initForSave()
    this.saveSolicitud()    
  }

  cancel(){
  	this.emitEvent(CANCEL);
  }

	private emitEvent(action:string){
		this.updateInternacionEvent.next({
			action:  action,
			type:    CORE,
			token:   this.solicitud
		});
	}

	private fetchLocacionHospitalaria(){
		this.intSrv.fetchLocacionById(this.locacionId).then(locacion =>{
			if(locacion){
				this.locacion = locacion;
        this.readyToGo()
			}
		})
	}

  private readyToGo(){
    this.initLocacion(this.locacion)
    this.initForm(this.form);
    this.showEditor = true;
  }

  private initForm(form: FormGroup){
  	this.servicioLabel = InternacionHelper.getOptionLabel('servicios', this.servicio);
    this.form.reset(this.internacion);
    this.form.get('transitType').setValue(this.transition);
  }

  private initLocacion(locacion: LocacionHospitalaria){
  	let recursos = locacion.recursos;
  	if(recursos && recursos.length){
			this.recursosOptList = InternacionHelper.buildFilteredRecursosList(this.servicio, recursos);
  	}
  }

  private initForSave(){
    let fvalue = this.form.value;

    this.internacion.locId = this.locacion._id
    this.internacion.locCode = this.locacion.code;
    this.internacion.locSlug = this.locacion.slug;

    this.internacion.servicio = this.servicio;


    this.internacion.slug = fvalue.slug;
    this.internacion.description = fvalue.description;

    //this.internacion.transitoId = fvalue.transitoId;
    //this.internacion.estado = fvalue.estado;

    this.internacion.sector = fvalue.sector;
    this.internacion.piso = fvalue.piso;
    this.internacion.hab = fvalue.hab;
    this.internacion.camaCode = fvalue.camaCode;

    //this.internacion.camaSlug = fvalue.camaSlug;
    //this.internacion.recursoId = fvalue.recursoId;
    this.transition = fvalue.transitType;
  }

  private saveSolicitud(){
    this.intSrv.manageInternacionTransition(this.solicitud, this.internacion, this.transition).subscribe(sol =>{
      if(sol){
        this.solicitud = sol;
        this.emitEvent(UPDATE)
      }else{
        this.emitEvent(CANCEL);
      }
    }) 
  }


  private buildForm(form: FormGroup){
  	this.form = this.fb.group({
			slug:          [null],
      recurso:       [null],
			description:   [null],
			transitoId:    [null],
			estado:        [null],
			servicio:      [null],
			sector:        [null],
			piso:          [null],
			hab:           [null],
			camaCode:      [null],
			camaSlug:      [null],
			transitType:   [null],

  	})
  }

	/************************************/
	/******* Template Helpers *******/
	/**********************************/
   changeSelectionValue(type, val) {
  }

  changeRecursoSelection(type: string, recurso: Recurso){
    this.internacion.recursoId = recurso._id;
    this.form.controls['piso'].setValue(recurso.piso)
    this.form.controls['hab'].setValue(recurso.hab)
    this.form.controls['sector'].setValue(recurso.sector)
    this.form.controls['camaCode'].setValue(recurso.code)
    this.form.controls['camaSlug'].setValue(recurso.slug)

  }

  hasError = (controlName: string, errorName: string) =>{
      return this.form.controls[controlName].hasError(errorName);
  }

}
