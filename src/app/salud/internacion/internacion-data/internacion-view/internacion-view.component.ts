
import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, Address } from '../../../../entities/person/person';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, MotivoInternacion,
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
					MasterAllocation,UpdateInternacionEvent } from '../../internacion.model';

import { InternacionHelper }  from '../../internacion.helper';

import { devutils }from '../../../../develar-commons/utils'


@Component({
  selector: 'internacion-view',
  templateUrl: './internacion-view.component.html',
  styleUrls: ['./internacion-view.component.scss']
})
export class InternacionViewComponent implements OnInit {
	@Input() token: SolicitudInternacion;
	@Input() showTransitions = true;

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

	public showTransitos = false;
  public hasInternacion = false;
  public sinInternacionAsignada = false;
  public hasTransitos = false;
  public internacion: Internacion;
  public transitos: TransitoDisplay[];

  constructor() { }

  ngOnInit() {
  	console.log('INTERNACION VIEW')
  	this.buildSolicitudData(this.token);
  	let internacionSnapShot = this.token.internacion;
  	let transitosList = this.token.transitos;

  	if(internacionSnapShot){
  		this.buildEstadoInternacion(internacionSnapShot);
  		if(transitosList && transitosList.length){
  			this.transitos = this.buildTransitos(transitosList)
  			this.hasTransitos = true;
  			this.showTransitos = this.hasTransitos && this.showTransitions;
  		}
  		this.hasInternacion = true;

  	}else {
  		this.sinInternacionAsignada = true;

  	}
  }

  private buildEstadoInternacion(data: Internacion){
  	this.internacion = data;

  }

  private buildTransitos(transitos: Transito[]){
  	return InternacionHelper.buildTransitionsToDisplay(transitos)

  }


  private buildSolicitudData(solicitud: SolicitudInternacion){
		this.action =      InternacionHelper.getPrefixedOptionLabel('actions', '', solicitud.action);
		this.sector =      InternacionHelper.getPrefixedOptionLabel('sectores', 'Sector', solicitud.sector);
		this.solicitante = solicitud.requeridox.slug  + ' :: DNI: ' + solicitud.requeridox.ndoc;

		this.cPrefix = solicitud.compPrefix;
		this.cName =   solicitud.compName;
		this.cNum =    solicitud.compNum;  
		this.slug =    solicitud.slug;
		this.description = solicitud.description;
		this.fecha =   solicitud.fecomp_txa;
		this.estado =  InternacionHelper.getPrefixedOptionLabel('estado', 'Estado', solicitud.estado);

		this.avance =  InternacionHelper.getPrefixedOptionLabel('avance', this.estado, solicitud.avance);
  }


  private buildNovedades(token: SolicitudInternacion){
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


class TransitoDisplay {

	fecha: string;
	transitType: string;
	estado: string;
	slug:  string;
	target: Internacion;
	fecha_audit: string;

}
