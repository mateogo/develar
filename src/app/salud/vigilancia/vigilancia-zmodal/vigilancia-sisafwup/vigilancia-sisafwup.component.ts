import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { devutils }from '../../../../develar-commons/utils';

import { SaludController } from '../../../salud.controller';

import {   Asistencia, SisaEvent, SisaEvolucion, UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';


const UPDATE = 'update';
const CANCEL = 'cancel';
const SISA_FWUP = 'sisa:followup';

@Component({
  selector: 'vigilancia-sisafwup',
  templateUrl: './vigilancia-sisafwup.component.html',
  styleUrls: ['./vigilancia-sisafwup.component.scss']
})
export class VigilanciaSisafwupComponent implements OnInit {

  form: FormGroup;

  public asistencia: Asistencia;
  public sisaEvent: SisaEvolucion;

  public avanceOptList = AsistenciaHelper.getOptionlist('avanceSisa')

  private result: UpdateAsistenciaEvent;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaSisafwupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ctrl: SaludController,
        private fb : FormBuilder) {
  }

  ngOnInit(): void {
  	this.asistencia = this.data.asistencia
  	this.sisaEvent = new SisaEvolucion();
    this.sisaEvent.avance = this.asistencia.sisaevent.avance || this.sisaEvent.avance || 'sospecha';


  	this.result = {
							  		action: UPDATE,
							  		type: SISA_FWUP,
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
  	let today = new Date();
    this.sisaEvent = {...this.sisaEvent, ...this.form.value};
    this.sisaEvent.fe_consulta = this.sisaEvent.fe_consulta  ? devutils.txFromDate(devutils.dateFromTx(this.sisaEvent.fe_consulta))  : devutils.txFromDate(today);

		this.sisaEvent.fets_consulta = today.getTime();

		let updates = this.asistencia.sisaEvolucion || [];
		updates.push(this.sisaEvent)
		this.asistencia.sisaEvolucion = updates;

		let sisaEstado = this.asistencia.sisaevent || new SisaEvent();
		if(!sisaEstado.isActive && this.sisaEvent.isActive){
			sisaEstado.fe_reportado = this.sisaEvent.fe_consulta;
			sisaEstado.reportadoPor = sisaEstado.reportadoPor || 'MAB';
			sisaEstado.fets_reportado = today.getTime();

		}

		if(sisaEstado.isActive && !this.sisaEvent.isActive){
			sisaEstado.fe_baja = this.sisaEvent.fe_consulta;
			sisaEstado.fets_baja = today.getTime();
		}


		sisaEstado.fe_consulta = devutils.txFromDate(today);
		sisaEstado.isActive = this.sisaEvent.isActive;
		sisaEstado.avance = this.sisaEvent.avance;

		if(this.sisaEvent.slug){
			sisaEstado.slug = this.sisaEvent.slug;
		}

		this.asistencia.sisaevent = sisaEstado;

    this.result.token = this.asistencia;
    this.result.type = SISA_FWUP;

  }


  private initForEdit(){
    this.form = this.fb.group(this.sisaEvent);
  }


  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }

}
