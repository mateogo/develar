import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SaludController } from '../../../salud.controller';

import {   Asistencia, AfectadoFollowUp,UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';
const UPDATE = 'update';
const CANCEL = 'cancel';
const SEGUIMIENTO_ESTADO = 'seguimiento:estado';

@Component({
  selector: 'vigilancia-seguimiento',
  templateUrl: './vigilancia-seguimiento.component.html',
  styleUrls: ['./vigilancia-seguimiento.component.scss']
})
export class VigilanciaSeguimientoComponent implements OnInit {

  public form: FormGroup;
  public formClosed = false;

  public asistencia: Asistencia;
  public seguimientoEvent: AfectadoFollowUp;

  public tipoFollowUpOptList = AsistenciaHelper.getOptionlist('tipoFollowUp')
  public displayAs = '';

  private result: UpdateAsistenciaEvent;
  private isNewRecord = false;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaSeguimientoComponent>,
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
    if(this.isNewRecord){
    	this.seguimientoEvent.fets_inicio = today.getTime();
    }

    this.asistencia.followUp = this.seguimientoEvent;

    this.result.token = this.asistencia;
    this.result.type = SEGUIMIENTO_ESTADO;
  }

  private iniToken(){
  	if(this.asistencia.followUp){
  		this.seguimientoEvent = this.asistencia.followUp;
  		this.isNewRecord = false;

  	}else{
  		this.seguimientoEvent = new AfectadoFollowUp();
  		this.isNewRecord = true;
  	}
    this.displayAs = this.asistencia.requeridox ? this.asistencia.requeridox.slug + ' ' + (this.asistencia.telefono || '') : '';

  	this.result = {
							  		action: UPDATE,
							  		type: SEGUIMIENTO_ESTADO,
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