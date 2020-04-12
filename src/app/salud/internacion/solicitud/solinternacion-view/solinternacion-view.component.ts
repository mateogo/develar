import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, Address } from '../../../../entities/person/person';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, MotivoInternacion,
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
					MasterAllocation,UpdateInternacionEvent } from '../../internacion.model';

import { InternacionHelper }  from '../../internacion.helper';

import { devutils }from '../../../../develar-commons/utils'


@Component({
  selector: 'solinternacion-view',
  templateUrl: './solinternacion-view.component.html',
  styleUrls: ['./solinternacion-view.component.scss']
})
export class SolinternacionViewComponent implements OnInit {
	@Input() token: SolicitudInternacion;

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
  public novedades = [];
  public audit;

  public hasInternacion = false;
  public internacionData: Internacion;

  constructor() { }

  ngOnInit() {
    
  	this.action = InternacionHelper.getPrefixedOptionLabel('actions', '', this.token.action);
    this.sector = InternacionHelper.getPrefixedOptionLabel('sectores', 'Sector', this.token.sector);
    this.solicitante = this.token.requeridox.slug  + ' :: DNI: ' + this.token.requeridox.ndoc;

  	this.cPrefix = this.token.compPrefix;
  	this.cName = this.token.compName;
  	this.cNum = this.token.compNum;  
  	this.slug = this.token.slug;
  	this.description = this.token.description;
  	this.fecha = this.token.fecomp_txa;
    this.estado =  InternacionHelper.getPrefixedOptionLabel('estado', 'Estado', this.token.estado);

    this.avance =  InternacionHelper.getPrefixedOptionLabel('avance', this.estado, this.token.avance);

    this.buildEstadoInternacion(this.token);
    
    this.buildNovedades(this.token);

    this.audit = this.buildAudit(this.token);

  }

  buildNovedades(token: SolicitudInternacion){
    let items = token.novedades;
    if(items && items.length){
      this.novedades = items.map(nov => {
        let tnovedad = InternacionHelper.getPrefixedOptionLabel('novedades', '', nov.tnovedad);
        let novedad = nov.novedad;
        let audit = this.buildNovedadesFollowUp(nov);
        return {tnovedad, novedad, audit}
      })
    }
  }

  private buildNovedadesFollowUp(novedad: Novedad){
    let audit = ''
    let ts, sector, fecha, fecha_txt;

    let atendido = novedad.atendidox;

    if(atendido){
      ts =  atendido.slug;
      sector = atendido.sector;
      fecha = new Date(novedad.fecomp_tsa);

      fecha_txt = fecha ? fecha.toString() : novedad.fecomp_txa ;
      audit = `${ts} Sector: ${sector} ${fecha_txt}`
    }

    return audit;
  }

  private buildEstadoInternacion(token: SolicitudInternacion){
  	let internacion = token.internacion;
  	if(internacion){
  		this.hasInternacion = true;
  		this.internacionData = internacion;

  	}

  }

  private buildAudit(token: SolicitudInternacion):string{
    let audit = ''
    let ts, sector, fecha, fecha_txt;
    let atendido = token.atendidox;

    if(atendido){
      ts =  atendido.slug;
      sector = atendido.sector;
      fecha = new Date(token.ts_umodif);
      fecha_txt = fecha ? fecha.toString(): '';
      audit = `${ts} Sector: ${sector} ${fecha_txt}`
    }

    return audit;
  }


}
