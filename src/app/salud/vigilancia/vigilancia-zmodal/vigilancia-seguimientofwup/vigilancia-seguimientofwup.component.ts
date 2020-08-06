import { Component, OnInit, Inject, Directive, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl,NgControl } from '@angular/forms';
//import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils';

import {   Asistencia, InfectionFollowUp, AfectadoFollowUp, AfectadoUpdate, UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';


const UPDATE = 'update';
const CANCEL = 'cancel';
const LLAMADO_LOGRADO = 'logrado'
const SEGUIMIENTO_FWUP = 'seguimiento:fwup';

@Component({
  selector: 'vigilancia-seguimientofwup',
  templateUrl: './vigilancia-seguimientofwup.component.html',
  styleUrls: ['./vigilancia-seguimientofwup.component.scss']
})
export class VigilanciaSeguimientofwupComponent implements OnInit {

  public form: FormGroup;
  public formClosed = false;

  public asistencia: Asistencia;
  public afectadoFollowUp: AfectadoFollowUp
  public seguimientoEvent: AfectadoUpdate;
  private infeccion: InfectionFollowUp;

  public tipoFollowUpOptList = AsistenciaHelper.getOptionlist('tipoFollowUp')
  public vectorSeguimientoOptList = AsistenciaHelper.getOptionlist('vectorSeguim')
  public resultadoSeguimOptList = AsistenciaHelper.getOptionlist('resultadoSeguim')
  public sintomaOptList = AsistenciaHelper.getOptionlist('sintomaInfection')

  public displayAs = '';
  public estadoSintoma = '';
  public internacionTxt = '';
  public fupDate: Date;


  private result: UpdateAsistenciaEvent;
  private isNewRecord = false;
  private internadoFup = 0;
  public noContesta = false;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaSeguimientofwupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ctrl: SaludController,
        private fb : FormBuilder) {
        this.initForm()
  }

  ngOnInit(): void {
  	this.asistencia = this.data.asistencia;
    this.fupDate = this.data.fupDate || null;

  	this.iniToken();
    this.initForEdit();
  }

  onSubmit(){
    this.formClosed = true;
    this.result.action = UPDATE;
  	this.initForSave()
  	this.saveToken();
  }

  onCancel(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }

  changeSelectionValue(type, val){
    if(type === 'resultado'){
        this.resetForm();
    }
  }

  changeActualState(estado){
    this.internadoFup = estado;
    this.resetForm();
  }

  finalizarEpidemio(){
    this.formClosed = true;
    this.result.action = UPDATE;
    this.initForSave()
    this.saveToken();
  }

  finalizarAsistencia(){
    this.formClosed = true;
    this.result.action = UPDATE;
    this.initForSave()
    this.saveToken();
  }

  private saveToken(){
    this.ctrl.manageEpidemioState(this.result).subscribe(asistencia =>{
    	if(asistencia){
    		this.result.token = asistencia;
    		this.ctrl.openSnackBar('Actualización exitosa', 'Cerrar');
    		this.closeDialogSuccess()
    	}else {
    		this.ctrl.openSnackBar('Se produjo un error al intentar guardar sus datos', 'ATENCIÓN');
    	}
    })
  }

  private initForSave(){
  	let today = new Date();

    this.seguimientoEvent = {...this.seguimientoEvent, ...this.form.value}

    if(this.fupDate){
      this.seguimientoEvent.fe_llamado = this.seguimientoEvent.fe_llamado  ? devutils.txFromDate(devutils.dateFromTx(this.seguimientoEvent.fe_llamado))  : devutils.txFromDate(this.fupDate);

    }else {
      this.seguimientoEvent.fe_llamado = this.seguimientoEvent.fe_llamado  ? devutils.txFromDate(devutils.dateFromTx(this.seguimientoEvent.fe_llamado))  : devutils.txFromDate(today);
      this.seguimientoEvent.fets_llamado = today.getTime();

    }

    this.seguimientoEvent.audit = this.ctrl.getAuditData();

		let llamados = this.asistencia.seguimEvolucion || [];
		llamados.push(this.seguimientoEvent);
    this.asistencia.seguimEvolucion = llamados;

    this.updateFollowUp(this.seguimientoEvent, this.afectadoFollowUp, today)
    this.updateCovid(this.seguimientoEvent, this.afectadoFollowUp, today)

    this.result.token = this.asistencia;
    this.result.type = SEGUIMIENTO_FWUP;
  }

  private updateCovid(token: AfectadoUpdate, afectado: AfectadoFollowUp, today: Date){
    if(this.llamadoIsNotLogrado(token.resultado)) return;

    this.infeccion = this.asistencia.infeccion || new InfectionFollowUp();
    this.infeccion.sintoma = afectado.sintoma;

    if(token.internadoFup === 1){
        this.infeccion.locacionSlug = token.locacionSlug;

    }else if(token.internadoFup === 2 ){
        this.infeccion.isInternado = false;
        this.infeccion.locacionSlug = token.locacionSlug;

    }else if(token.internadoFup === 3 ){
        this.infeccion.isInternado = true;
        this.infeccion.locacionSlug = token.locacionSlug;

    }
    this.asistencia.infeccion = this.infeccion;
  }

  private updateFollowUp(token: AfectadoUpdate, afectado: AfectadoFollowUp, today: Date){
  	afectado.fe_ullamado = token.fe_llamado;
  	afectado.fets_ullamado = today.getTime();
  	afectado.qllamados += 1;

    afectado.altaVigilancia = token.altaVigilancia;
    afectado.altaAsistencia = token.altaAsistencia;

		afectado.slug = token.slug;
		afectado.isActive = token.isActive;
    afectado.isAsistido = token.isAsistido;

		if(token.resultado === LLAMADO_LOGRADO){
			afectado.fe_ucontacto = token.fe_llamado;
      afectado.sintoma = token.sintoma;

			afectado.fets_ucontacto = today.getTime();
			afectado.qcontactos += 1;
      afectado.vector = token.vector;
		
			afectado.lastCall = token.resultado;
			afectado.qIntents = 0;


  	}else {
  			if(afectado.lastCall === LLAMADO_LOGRADO){
  				afectado.qIntents = 0;
  			}

				afectado.lastCall = token.resultado;
  			afectado.qIntents += 1;
  	}

  }

  private iniToken(){
  	this.afectadoFollowUp = this.asistencia.followUp || new AfectadoFollowUp();
    this.infeccion = this.asistencia.infeccion || new InfectionFollowUp();

  	this.seguimientoEvent = new AfectadoUpdate();

    if(this.fupDate){
      this.seguimientoEvent.fe_llamado = devutils.txFromDate(this.fupDate);
      this.seguimientoEvent.fets_llamado = this.fupDate.getTime();
    }

    this.seguimientoEvent.altaVigilancia = this.afectadoFollowUp.altaVigilancia || false;
    this.seguimientoEvent.altaAsistencia = this.afectadoFollowUp.altaAsistencia || false;

  	this.seguimientoEvent.isActive = this.afectadoFollowUp.isActive;
    this.seguimientoEvent.isAsistido = this.afectadoFollowUp.isAsistido;
  	this.seguimientoEvent.tipo = this.afectadoFollowUp.tipo;
    //this.seguimientoEvent.sintoma = this.afectadoFollowUp.sintoma;

    this.displayAs = this.asistencia.requeridox ? this.asistencia.requeridox.slug + ' ' + (this.asistencia.telefono || '') : '';

    this.estadoSintoma = AsistenciaHelper.getOptionLabel('sintomaInfection', this.infeccion.sintoma);
    this.internacionTxt = this.infeccion.isInternado ? this.infeccion.locacionSlug : 'No internado';
		this.isNewRecord = true;

  	this.result = {
							  		action: UPDATE,
							  		type: SEGUIMIENTO_FWUP,
							  		token: this.asistencia
  								} as  UpdateAsistenciaEvent;
  }

  private initForEdit(){
    this.formClosed = false;
    this.form.reset({
      isActive:   this.seguimientoEvent.isActive,
      isAsistido: this.seguimientoEvent.isAsistido,

      altaVigilancia:   this.seguimientoEvent.altaVigilancia,
      altaAsistencia: this.seguimientoEvent.altaAsistencia,

      fe_llamado: this.seguimientoEvent.fe_llamado,
      resultado:  this.seguimientoEvent.resultado,
      internadoFup:  this.seguimientoEvent.internadoFup,
      locacionSlug:  this.seguimientoEvent.locacionSlug,
      sintoma:    this.seguimientoEvent.sintoma,
      slug:       this.seguimientoEvent.slug,
      indicacion: this.seguimientoEvent.indicacion,

    })
  }

  private resetForm(){
    this.seguimientoEvent = {...this.seguimientoEvent, ...this.form.value}
    if(this.llamadoIsNotLogrado(this.seguimientoEvent.resultado)){
      this.seguimientoEvent.internadoFup = 1;
      this.seguimientoEvent.sintoma = 'sindato';
      this.seguimientoEvent.slug = 'No contesta llamado';
    }

    if(this.internadoFup === 1){
      this.seguimientoEvent.locacionSlug = this.infeccion.locacionSlug;

    }else if(this.internadoFup === 2){
      this.seguimientoEvent.locacionSlug = 'Aislamiento en domicilio'

    }else if(this.internadoFup === 3){
      this.seguimientoEvent.locacionSlug = '';

    }

    this.initForEdit();
    if(this.llamadoIsNotLogrado(this.seguimientoEvent.resultado)){
      this.form.get('locacionSlug').disable();
      this.form.get('slug').disable();
      this.form.get('sintoma').disable();
      this.form.get('internadoFup').disable();
    }else{
      this.form.get('locacionSlug').enable();
      this.form.get('slug').enable();
      this.form.get('sintoma').enable();
      this.form.get('internadoFup').enable();

    }
  }

  private llamadoIsNotLogrado(resultado): boolean{
    if(resultado === 'logrado') return false;
    else return true;
  }

  private initForm(){
    this.form = this.fb.group({
      isActive:       [null],
      isAsistido:     [null],

      altaVigilancia: [null],
      altaAsistencia: [null],
      internadoFup:   [null,  Validators.compose( [Validators.required])],
      resultado:      [null,  Validators.compose( [Validators.required])],
      sintoma:        [null,  Validators.compose( [Validators.required])],
      locacionSlug:   [null,  this.internacionValidator()],
      fe_llamado:     [null],
      slug:           [null],
      indicacion:     [null],

    })

  }

  internacionValidator(): ValidatorFn {
      return ((control: AbstractControl) : {[key: string]: any} | null  => {

          let validData = control.value || (this.internadoFup === 1 || this.internadoFup === 2);
          //c onsole.log('Validator: [%s] [%s] [%s]',control.value, this.internadoFup, validData )
          return validData ? null : {'ingreseLocacion': true}

      }) ;
   }

  hasError = (controlName: string, errorName: string) =>{
      return this.form.controls[controlName].hasError(errorName);
  }

  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }

}


/****
@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl( condition : boolean ) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control[action]();
  }

  constructor( private ngControl : NgControl ) {
  }

}
**/