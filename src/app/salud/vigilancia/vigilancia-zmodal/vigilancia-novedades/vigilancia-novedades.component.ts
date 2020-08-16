import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils';

import {   Asistencia, Novedad, UpdateAsistenciaEvent,
          AsistenciaHelper, AvancesNovedad } from '../../../asistencia/asistencia.model';

const UPDATE = 'update';
const CANCEL = 'cancel';
const NOVEDAD_ESTADO = 'novedad:estado';

@Component({
  selector: 'vigilancia-novedades',
  templateUrl: './vigilancia-novedades.component.html',
  styleUrls: ['./vigilancia-novedades.component.scss']
})
export class VigilanciaNovedadesComponent implements OnInit {
  public form: FormGroup;
  public formClosed = false;

  public asistencia: Asistencia;
  public isNewNovedad = false;

  public novedad: Novedad;
  public novedades: Array<Novedad> = [];
  private intervencion: string;

  private avancesNovedad: Array<AvancesNovedad>;

  public tnovedadOptList = AsistenciaHelper.getOptionlist('novedades');
  public urgenciaOptList = AsistenciaHelper.getOptionlist('urgencia');
  public intervencionOptList = AsistenciaHelper.getOptionlist('intervenciones');
  public ejecucionOptList = AsistenciaHelper.getOptionlist('ejecucion');
  public sectorOptList = AsistenciaHelper.getOptionlist('sectores');

  // public tipoOptList = AsistenciaHelper.getOptionlist('tipoMuestraLab');
  // public estadoOptList = AsistenciaHelper.getOptionlist('estadoMuestraLab');
  // public resultadoOptList = AsistenciaHelper.getOptionlist('resultadoMuestraLab');
  // public secuenciaOptList = AsistenciaHelper.getOptionlist('sequenceMuestraLab');

  public displayAs = '';

  private result: UpdateAsistenciaEvent;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaNovedadesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ctrl: SaludController,
        private fb : FormBuilder) {
  }

  ngOnInit(): void {
 
  	this.isNewNovedad = true;
  	this.asistencia = this.data.asistencia;
    this.intervencion = this.data.intervencion || 'no_definido'; // target de la nueva intervencion

  	this.novedades = this.asistencia.novedades || [];

  	this.novedad = this.data.novedad ;

  	if(this.novedad){
  		this.isNewNovedad = true;
  		let novedadToken = this.novedades.find(t => t._id === this.novedad._id)

  		if(novedadToken){

  			this.novedad = novedadToken;
  			this.isNewNovedad = false;
  		}

  	}else{
  		this.novedad = AsistenciaHelper.initNewNovedad(this.intervencion)

  	}

  	this.result = {
							  		action: UPDATE,
							  		type: NOVEDAD_ESTADO,
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
    if(type === 'intervencion'){
      this.intervencion = val;
      this.novedad = AsistenciaHelper.initNewNovedad(val)
      this.initForEdit()


    }

  }
  hayNovedadesPendientes(){
    return this.searchSameIntervencion(this.intervencion)
  }

  changeActualState(estado){
    //c onsole.log('Estado COVID: [%s]', estado);
  }

  private searchSameIntervencion(intervencion: string){
    let casos = '' ;
    casos = this.novedades.filter(t => {
      if(t.intervencion === intervencion && t.isActive) return true;

    }).reduce((memo, t)=>{
      return memo + t.fecomp_txa + '; '
    },'' )
    if(casos){
      casos = 'Requerim previo: ' + casos;
    }
    return casos;

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
    //this.novedad = {...this.novedad, ...this.form.value} --->OjO... esto clona, no es lo buscado

    this.novedad = Object.assign(this.novedad, this.form.value);
    if(this.isNewNovedad){
      this.novedad.fecomp_txa = devutils.txFromDate(today);
      this.novedad.fecomp_tsa = today.getTime();
    }

    this.novedad.fecomp_txa = this.novedad.fecomp_txa ? devutils.txFromDate(devutils.dateFromTx(this.novedad.fecomp_txa)) : devutils.txFromDate(today);
    this.novedad.fecomp_tsa = devutils.dateNumFromTx(this.novedad.fecomp_txa);

    this.novedad.fe_necesidad = this.novedad.fe_necesidad ? devutils.txFromDate(devutils.dateFromTx(this.novedad.fe_necesidad)) : devutils.txFromDate(today);
    this.novedad.fets_necesidad = devutils.dateNumFromTx(this.novedad.fe_necesidad);

    this.novedad.estado = this.novedad.ejecucion ? this.ejecucionOptList.find(t=>t.val === this.novedad.ejecucion).estado : 'activo';

    let token = {
            fe_nov: devutils.txFromDate(today),
            fets_nov: today.getTime(),
            ejecucion: this.novedad.ejecucion,
            sector: this.novedad.sector,
            intervencion: this.novedad.intervencion,
            slug: this.novedad.novedad,
            isCumplida: this.novedad.estado === 'cumplido',
            // userId: this.novedad.userId,
            // userSlug: this.novedad.userSlug,

    } as AvancesNovedad;

    this.avancesNovedad.push(token);

    this.novedad.actividades = this.avancesNovedad
 
 		if(this.isNewNovedad){
 			this.novedades.push(this.novedad);
 		}  

 		this.asistencia.novedades = this.novedades;

    this.result.token = this.asistencia;
    this.result.type = NOVEDAD_ESTADO;
  }

  private initForEdit(){
    this.formClosed = false;
    this.displayAs = this.asistencia.requeridox ? this.asistencia.requeridox.slug + ' ' + (this.asistencia.ndoc || '') + ' ' + (this.asistencia.telefono || ''): '';
    this.novedad.isActive = this.novedad.isActive || false;
    this.novedad.sector = this.novedad.sector || '';

    this.novedad.sector = this.novedad.sector || '';
    this.novedad.intervencion = this.novedad.intervencion || '';
    this.novedad.urgencia = this.novedad.urgencia || 1;
    this.novedad.fe_necesidad = this.novedad.fe_necesidad || '';
    this.novedad.hasCumplimiento = this.novedad.hasCumplimiento || false;
    this.novedad.ejecucion = this.novedad.ejecucion || '';

    this.avancesNovedad = this.novedad.actividades || [];

    this.form = this.fb.group(this.novedad);
  }


  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }


}
