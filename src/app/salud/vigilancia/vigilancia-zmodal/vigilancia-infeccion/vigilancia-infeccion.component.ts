import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils';

import {   Asistencia, InfectionFollowUp, UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';

const UPDATE = 'update';
const CANCEL = 'cancel';
const INFECTION_ESTADO = 'infection:estado';

@Component({
  selector: 'app-vigilancia-infeccion',
  templateUrl: './vigilancia-infeccion.component.html',
  styleUrls: ['./vigilancia-infeccion.component.scss']
})
export class VigilanciaInfeccionComponent implements OnInit {

  form: FormGroup;

  public asistencia: Asistencia;

  public infection: InfectionFollowUp;

  public avanceOptList = AsistenciaHelper.getOptionlist('avanceInfection')
  public sintomaOptList = AsistenciaHelper.getOptionlist('sintomaInfection')

  private result: UpdateAsistenciaEvent;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaInfeccionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ctrl: SaludController,
        private fb : FormBuilder) {
  }

  ngOnInit(): void {
  	this.asistencia = this.data.asistencia
  	this.infection = this.asistencia.infeccion  || new InfectionFollowUp();

  	this.result = {
							  		action: UPDATE,
							  		type: INFECTION_ESTADO,
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

  changeActualState(estado){
    //c onsole.log('Estado COVID: [%s]', estado);
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

    this.infection = {...this.infection, ...this.form.value}

    this.infection.hasCovid =   this.infection.actualState === 1 ? true : false;

    this.infection.fe_inicio =   this.infection.fe_inicio  ?   devutils.txFromDate(devutils.dateFromTx(this.infection.fe_inicio)) : '';
    this.infection.fe_confirma = this.infection.fe_confirma  ? devutils.txFromDate(devutils.dateFromTx(this.infection.fe_confirma)) : '';
    this.infection.fe_alta =     this.infection.fe_alta  ?     devutils.txFromDate(devutils.dateFromTx(this.infection.fe_alta)) : '';

    this.infection.fets_inicio =   this.infection.fe_inicio  ?   devutils.dateFromTx(this.infection.fe_inicio).getTime() : 0;
    this.infection.fets_confirma = this.infection.fe_confirma  ? devutils.dateFromTx(this.infection.fe_confirma).getTime() : 0;
    this.infection.fets_alta =     this.infection.fe_alta  ?     devutils.dateFromTx(this.infection.fe_alta).getTime() : 0;

    this.asistencia.infeccion = this.infection;

    this.result.token = this.asistencia;
    this.result.type = INFECTION_ESTADO;
		//Recibido vía alerta SISA por afectado que vive en Brown
  }

  private initForEdit(){
    this.infection.isInternado = this.infection.isInternado || false;
    this.infection.locacionSlug = this.infection.locacionSlug || '';

    this.form = this.fb.group(this.infection);
    this.form.controls.fe_confirma.disable();
  }


  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }

}
