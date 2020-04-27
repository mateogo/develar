import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils';

import {   Asistencia, AfectadoFollowUp, AfectadoUpdate, UpdateAsistenciaEvent,
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

  public tipoFollowUpOptList = AsistenciaHelper.getOptionlist('tipoFollowUp')
  public vectorSeguimientoOptList = AsistenciaHelper.getOptionlist('vectorSeguim')
  public resultadoSeguimOptList = AsistenciaHelper.getOptionlist('resultadoSeguim')

  private result: UpdateAsistenciaEvent;
  private isNewRecord = false;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaSeguimientofwupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ctrl: SaludController,
        private fb : FormBuilder) {
  }

  ngOnInit(): void {
  	this.asistencia = this.data.asistencia

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
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
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
    this.seguimientoEvent.fe_llamado = this.seguimientoEvent.fe_llamado  ? devutils.txFromDate(devutils.dateFromTx(this.seguimientoEvent.fe_llamado))  : devutils.txFromDate(today);

		this.seguimientoEvent.fets_llamado = today.getTime();

		let llamados = this.asistencia.seguimEvolucion || [];
		llamados.push(this.seguimientoEvent);
    this.asistencia.seguimEvolucion = llamados;

    this.updateFollowUp(this.seguimientoEvent, this.afectadoFollowUp, today)

    this.result.token = this.asistencia;
    this.result.type = SEGUIMIENTO_FWUP;
  }

  private updateFollowUp(token: AfectadoUpdate, afectado: AfectadoFollowUp, today: Date){
  	afectado.fe_ullamado = token.fe_llamado;
  	afectado.fets_ullamado = today.getTime();
  	afectado.qllamados += 1;

		afectado.slug = token.slug;
		afectado.isActive = token.isActive;

		if(token.resultado === LLAMADO_LOGRADO){
			afectado.fe_ucontacto = token.fe_llamado;
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

  	this.seguimientoEvent = new AfectadoUpdate();
  	this.seguimientoEvent.isActive = this.afectadoFollowUp.isActive;
  	this.seguimientoEvent.tipo = this.afectadoFollowUp.tipo;

		this.isNewRecord = true;

  	this.result = {
							  		action: UPDATE,
							  		type: SEGUIMIENTO_FWUP,
							  		token: this.asistencia
  								} as  UpdateAsistenciaEvent;
  }

  private initForEdit(){
    this.formClosed = false;
    this.form = this.fb.group(this.seguimientoEvent);
  }


  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }

}
