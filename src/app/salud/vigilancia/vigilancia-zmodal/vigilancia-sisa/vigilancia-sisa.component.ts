import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SaludController } from '../../../salud.controller';

import {   Asistencia, SisaEvent,UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';


const UPDATE = 'update';
const CANCEL = 'cancel';
const SISA_ESTADO = 'sisa:estado';

@Component({
  selector: 'vigilancia-sisa',
  templateUrl: './vigilancia-sisa.component.html',
  styleUrls: ['./vigilancia-sisa.component.scss']
})
export class VigilanciaSisaComponent implements OnInit {

  form: FormGroup;

  public asistencia: Asistencia;
  public sisaEvent: SisaEvent;

  public avanceOptList = AsistenciaHelper.getOptionlist('avanceSisa')

  private result: UpdateAsistenciaEvent;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaSisaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ctrl: SaludController,
        private fb : FormBuilder) {
  }

  ngOnInit(): void {
  	this.asistencia = this.data.asistencia
  	this.sisaEvent = this.asistencia.sisaevent  || new SisaEvent();

  	this.result = {
							  		action: UPDATE,
							  		type: SISA_ESTADO,
							  		token: this.asistencia
  								} as  UpdateAsistenciaEvent;

    this.initForEdit();
  }

  onSubmit(){
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
    this.sisaEvent = {...this.sisaEvent, ...this.form.value}

    this.asistencia.sisaevent = this.sisaEvent;

    this.result.token = this.asistencia;
    this.result.type = SISA_ESTADO;
		//Recibido vía alerta SISA por afectado que vive en Brown
  }

  private initForEdit(){
    this.form = this.fb.group(this.sisaEvent);
  }


  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }

}
