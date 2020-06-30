import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {     SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
                    Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
                    MasterAllocation, AsignarRecursoEvent } from '../../../../salud/internacion/internacion.model';

import { LocacionHospitalaria, Recurso} from '../../../../entities/locaciones/locacion.model';
import { InternacionHelper } from '../../../../salud/internacion/internacion.helper';

const ADMISION = 'admision';
const TRASLADO = 'traslado';
const ASIGNAR = 'asignar';

@Component({
  selector: 'app-recursos-modal',
  templateUrl: './recursos-modal.component.html',
  styleUrls: ['./recursos-modal.component.scss']
})
export class RecursosModalComponent implements OnInit {

  form: FormGroup;

  public asignarList: SolicitudInternacion[];
  private _servicioOptList =  InternacionHelper.getOptionlist('servicios')

  public servicioOptList = [];

  public recursosList: Recurso[] = [];
  public servicio: string ;

  private result: AsignarRecursoEvent;

  constructor(
        public dialogRef: MatDialogRef<RecursosModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb : FormBuilder) {

    this.form = this.fb.group({
      sinternacion: [null, Validators.required],
      servicio:     [null],
      recurso:      [null, Validators.required],
    });

  }

  ngOnInit(): void {
    let master = this.data && this.data.masterperiferia;
    this.asignarList = this.data.sinternaciones || [] ;

    if(! (this.asignarList && this.asignarList.length) ) this.buildSolicitudesList(master);

    this.recursosList = (this.data && this.data.recursos )|| [];
    this.servicio = this.data.servicio;

    this.initForEdit();



  }

  buildSolicitudesList(master){
    let admision = master[ADMISION] || [];
    let traslado = master[TRASLADO] || [];

    this.asignarList = admision.concat(traslado) || [];
  }

  initForEdit(){
    this.servicioOptList = this._servicioOptList.filter(t => t.val === this.servicio);

    this.form.reset({
      sinternacion:  this.asignarList[0],
      recurso: this.recursosList[0],
      servicio:  this.servicio,
    })

  }

  onSubmit(){
    this.result = new AsignarRecursoEvent();
    let fvalue = this.form.value;

    this.result.action = ASIGNAR;
    this.result.sinternacion = fvalue.sinternacion;
    this.result.servicio =     fvalue.servicio;
    this.result.recurso =      fvalue.recurso;
    this.closeDialog()
  }

  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }

  onCancel(){
    this.result = null;
    this.closeDialog()
  }

  closeDialog(){
        this.dialogRef.close(this.result);
  }

}
