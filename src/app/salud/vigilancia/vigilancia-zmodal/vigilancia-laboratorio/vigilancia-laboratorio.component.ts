import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils';

import {   Asistencia, MuestraLaboratorio, UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';

const UPDATE = 'update';
const CANCEL = 'cancel';
const LABORATORIO_ESTADO = 'laboratorio:estado';

@Component({
  selector: 'app-vigilancia-laboratorio',
  templateUrl: './vigilancia-laboratorio.component.html',
  styleUrls: ['./vigilancia-laboratorio.component.scss']
})
export class VigilanciaLaboratorioComponent implements OnInit {

  public form: FormGroup;
  public formClosed = false;

  public asistencia: Asistencia;
  public isNewLab = false;

  public muestralab: MuestraLaboratorio;
  public muestraslab: Array<MuestraLaboratorio> = [];

  public tipoOptList = AsistenciaHelper.getOptionlist('tipoMuestraLab');
  public estadoOptList = AsistenciaHelper.getOptionlist('estadoMuestraLab');
  public resultadoOptList = AsistenciaHelper.getOptionlist('resultadoMuestraLab');
  public secuenciaOptList = AsistenciaHelper.getOptionlist('sequenceMuestraLab');


  private result: UpdateAsistenciaEvent;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaLaboratorioComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ctrl: SaludController,
        private fb : FormBuilder) {
  }

  ngOnInit(): void {
 
  	this.isNewLab = true;
  	this.asistencia = this.data.asistencia
  	this.muestraslab = this.asistencia.muestraslab || [];

  	this.muestralab = this.data.laboratorio

  	if(this.muestralab){
  		this.isNewLab = false;
  		let labToken = this.muestraslab.find(t => t._id === this.muestralab._id)
  		if(labToken){
  			this.muestralab = labToken;
  			this.isNewLab = false;
  		}

  	}else{
  		this.muestralab = new MuestraLaboratorio();

  	}

  	this.result = {
							  		action: UPDATE,
							  		type: LABORATORIO_ESTADO,
							  		token: this.asistencia
  								} as  UpdateAsistenciaEvent;

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
    //this.muestralab = {...this.muestralab, ...this.form.value} --->OjO... esto clona, no es lo buscado
    this.muestralab = Object.assign(this.muestralab, this.form.value);

    this.muestralab.fe_toma =         this.muestralab.fe_toma ?         devutils.txFromDate(devutils.dateFromTx(this.muestralab.fe_toma)) : '';
    this.muestralab.fe_resestudio =   this.muestralab.fe_resestudio ?   devutils.txFromDate(devutils.dateFromTx(this.muestralab.fe_resestudio)) : '';
    this.muestralab.fe_notificacion = this.muestralab.fe_notificacion ? devutils.txFromDate(devutils.dateFromTx(this.muestralab.fe_notificacion)) : '';

    this.muestralab.fets_toma =         this.muestralab.fe_toma ?         devutils.dateFromTx(this.muestralab.fe_toma).getTime() : 0;
    this.muestralab.fets_resestudio =   this.muestralab.fe_resestudio ?   devutils.dateFromTx(this.muestralab.fe_resestudio).getTime() : 0;
    this.muestralab.fets_notificacion = this.muestralab.fe_notificacion ? devutils.dateFromTx(this.muestralab.fe_notificacion).getTime() : 0;

 		if(this.isNewLab){
 			this.muestraslab.push(this.muestralab);
 		}  

 		this.asistencia.muestraslab = this.muestraslab;

    this.result.token = this.asistencia;
    this.result.type = LABORATORIO_ESTADO;
		//Recibido vía alerta SISA por afectado que vive en Brown
  }

  private initForEdit(){
    this.formClosed = false;
    this.muestralab.secuencia = this.muestralab.secuencia || '1ER LAB'
    this.form = this.fb.group(this.muestralab);
  }


  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }


}
