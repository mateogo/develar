import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, Address } from '../../../../entities/person/person';

import { 	Asistencia, 
					Alimento, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';



import { devutils }from '../../../../develar-commons/utils'

//compPrefix; compName; compNum
//fecomp_txa; action; slug
//description;
//sector; estado; avance; ts_alta; ts_fin; ts_prog;
const ALIMENTOS = 'alimentos'
@Component({
  selector: 'solasis-view',
  templateUrl: './solasis-view.component.html',
  styleUrls: ['./solasis-view.component.scss']
})
export class SolasisViewComponent implements OnInit {
	@Input() token: Asistencia;

	public action;
	public cPrefix;
	public cName;
	public cNum;
	public slug;
	public description;
	public fecha;

	public modalidad: Alimento;
	public isAlimentos = false;


  public type;
	public freq;
	public qty;
	public fechad;
	public fechah;
	public observacion;
  public avance;


  constructor() { }

  ngOnInit() {
  	this.action = AsistenciaHelper.getOptionLabel('actions', this.token.action);
  	this.cPrefix = this.token.compPrefix;
  	this.cName = this.token.compName;
  	this.cNum = this.token.compNum;  
  	this.slug = this.token.slug;
  	this.description = this.token.description;
  	this.fecha = this.token.fecomp_txa;
  	this.modalidad = this.token.modalidad;
    if(this.token.avance === 'autorizado'){
      this.avance = 'AUTORIZADO';
    }else{

      this.avance = 'Pend Autorización';
    }


  	if(this.token.action === ALIMENTOS && this.modalidad) this.initDatosModalidad(this.modalidad);

  }

  initDatosModalidad(token: Alimento){
    this.type =   AsistenciaHelper.getOptionLabel('alimentos',token.type);
    this.freq =   AsistenciaHelper.getOptionLabel('frecuencia',token.freq);
    this.qty =    token.qty;
    this.fechad = token.fe_txd;
    this.fechah = token.fe_txh;
    this.observacion = token.observacion;

  	this.isAlimentos = true;
  }

}

