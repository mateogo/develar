import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, Address } from '../../../../entities/person/person';

import { 	Asistencia, 
					Alimento,
          Encuesta, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';


import { KitOptionList } from '../../../alimentos/alimentos.model';

import { devutils }from '../../../../develar-commons/utils'

//compPrefix; compName; compNum
//fecomp_txa; action; slug
//description;
//sector; estado; avance; ts_alta; ts_fin; ts_prog;
const ALIMENTOS = 'alimentos'
const ENCUESTA = 'encuesta'

@Component({
  selector: 'solasis-view',
  templateUrl: './solasis-view.component.html',
  styleUrls: ['./solasis-view.component.scss']
})
export class SolasisViewComponent implements OnInit {
	@Input() token: Asistencia;
  @Input() detailView = true;
  @Input() kitOptList:KitOptionList[] = [];

	public action;
  public sector;
	public cPrefix;
	public cName;
	public cNum;
	public slug;
	public description;
	public fecha;
  public solicitante;
  public avance;
  public estado;

  // Alimentos
	public modalidad: Alimento;
	public isAlimentos = false;

  public type;
  public freq;
  public qty;
  public fechad;
  public fechah;
  public observacion;
  public periodoAlimentos;

  // Encuesta
  public encuesta: Encuesta;
  public isEncuesta = false;
  
  public fecha_encuesta;
  public ruta;
  public preparacion;
  public estado_encuesta;
  public avance_encuesta;
  public audit;

  constructor() { }

  ngOnInit() {
    
  	this.action = AsistenciaHelper.getPrefixedOptionLabel('actions', '', this.token.action);
    this.sector = AsistenciaHelper.getPrefixedOptionLabel('sectores', 'Sector', this.token.sector);
    this.solicitante = this.token.requeridox.slug  + ' :: DNI: ' + this.token.requeridox.ndoc;
  	this.cPrefix = this.token.compPrefix;
  	this.cName = this.token.compName;
  	this.cNum = this.token.compNum;  
  	this.slug = this.token.slug;
  	this.description = this.token.description;
  	this.fecha = this.token.fecomp_txa;
  	this.modalidad = this.token.modalidad;
    this.encuesta = this.token.encuesta;
    this.estado =  AsistenciaHelper.getPrefixedOptionLabel('estado', 'Estado', this.token.estado);

    this.avance =  AsistenciaHelper.getPrefixedOptionLabel('avance', this.estado, this.token.avance);
    
    // if(this.token.avance === 'autorizado'){
    //   this.avance = 'AUTORIZADO';
    // }else{

    //   this.avance = 'Pend Autorización';
    // }

  	if(this.token.action === ALIMENTOS && this.modalidad) this.initDatosModalidad(this.modalidad);
    
    if(this.token.action === ENCUESTA && this.encuesta) this.initDatosEncuesta(this.encuesta);
    this.audit = this.buildAudit(this.token);

  }

  buildAudit(token: Asistencia):string{
    let audit = ''
    let ts, sector, fecha, fecha_txt;
    let atendido = token.atendidox;

    if(atendido){
      ts =  atendido.slug;
      sector = atendido.sector;
      fecha = new Date(token.ts_prog);
      fecha_txt = fecha ? fecha.toString(): '';
      audit = `${ts} Sector: ${sector} ${fecha_txt}`
    }

    return audit;
  }

  verdDetalle(e){
    e.stopPropagation()
    e.preventDefault();
    this.detailView = !this.detailView;
  }

  initDatosModalidad(token: Alimento){
    this.type = AsistenciaHelper.getOptionLabelFromList(this.kitOptList, token.type);
    this.freq =   AsistenciaHelper.getOptionLabel('frecuencia',token.freq);
    this.qty =    token.qty;
    this.fechad = token.fe_txd;
    this.fechah = token.fe_txh;
    this.observacion = token.observacion;

  	this.isAlimentos = true;
  }

  initDatosEncuesta(token: Encuesta){
    this.fecha_encuesta = token.fe_visita;
    this.ruta = token.ruta;
    this.preparacion = token.preparacion;
    this.estado_encuesta = token.estado;
    this.avance_encuesta = token.avance;


    this.isEncuesta = true;
  }


}

