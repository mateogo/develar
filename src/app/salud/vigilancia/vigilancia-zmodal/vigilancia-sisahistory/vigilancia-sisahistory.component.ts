import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { devutils }from '../../../../develar-commons/utils';

import { SaludController } from '../../../salud.controller';

import {   Asistencia, SisaEvent, SisaEvolucion, UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';


const UPDATE = 'update';
const BROWSE = 'browse';
const CANCEL = 'cancel';
const SISA_VIEW = 'sisa:view';


@Component({
  selector: 'vigilancia-sisahistory',
  templateUrl: './vigilancia-sisahistory.component.html',
  styleUrls: ['./vigilancia-sisahistory.component.scss']
})
export class VigilanciaSisahistoryComponent implements OnInit {

  form: FormGroup;

  public asistencia: Asistencia;
  public sisaEvent: SisaEvolucion;

  public avanceOptList = AsistenciaHelper.getOptionlist('avanceSisa')

  private result: UpdateAsistenciaEvent;
  public showSisaData = false;
  public sisaData: SisaData;
  public sisaHistoryList: SisaEvolucion[] = [];

  constructor(
        public dialogRef: MatDialogRef<VigilanciaSisahistoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ctrl: SaludController,
        private fb : FormBuilder) {
  }

  ngOnInit(): void {
  	this.asistencia = this.data.asistencia
  	this.buildSisaData(this.asistencia);

  	this.sisaEvent = new SisaEvolucion();

  	this.result = {
							  		action: BROWSE,
							  		type: SISA_VIEW,
							  		token: this.asistencia
  								} as  UpdateAsistenciaEvent;

  }

  onSubmit(){
    this.result.action = UPDATE;
  }

  onCancel(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }

  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }

  private buildSisaData(token: Asistencia){
    if(!token.sisaevent){
      this.showSisaData = false;
      return;
    }

    this.sisaHistoryList = token.sisaEvolucion || [];

    this.sisaData = new SisaData(token.sisaevent);
    this.showSisaData = true;
  }

  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }

}

class SisaData {
  sisaevent: SisaEvent
  avance: string;

  constructor(sisa:SisaEvent){
    this.sisaevent = sisa;
    this.avance = AsistenciaHelper.getPrefixedOptionLabel('avanceSisa', 'calificado como ', sisa.avance);
  }
}

