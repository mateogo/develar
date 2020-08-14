import { Component, OnInit, Input } from '@angular/core';

import { devutils }from '../../../develar-commons/utils'

import {  Asistencia,
					Novedad,
					UpdateNovedadEvent,
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';




@Component({
  selector: 'vigil-novedad-view',
  templateUrl: './vigil-novedad-view.component.html',
  styleUrls: ['./vigil-novedad-view.component.scss']
})
export class VigilNovedadViewComponent implements OnInit {
	@Input() novedad;
  @Input() asistencia: Asistencia;


	public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  public sectorActionRelation = AsistenciaHelper.getSectorActionRelation();
  public avanceEstadoRelation = AsistenciaHelper.getAvanceEstadoRelation();
  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  public novedadOptList = AsistenciaHelper.getOptionlist('novedades');
  public osocialOptList = AsistenciaHelper.getOptionlist('osocial');
  public prioridadOptList = AsistenciaHelper.getOptionlist('prioridad');

  public tnovedad: string;
  public sector: string;
  public urgencia: string;
  public avance: string;
  public estado: string;
  public intervencion: string;
  public fecha: string;


  constructor() { }

  ngOnInit(): void {
  	this.buildNovedadData(this.novedad);
  }


  private buildNovedadData(novedad){
  	this.tnovedad =     AsistenciaHelper.getOptionLabel('novedades', novedad.tnovedad);
  	this.sector =       AsistenciaHelper.getOptionLabel('sectores', novedad.sector || 'epidemiologia');
  	this.urgencia =     AsistenciaHelper.getOptionLabel('urgencia', novedad.urgencia || 1);
  	this.avance =       AsistenciaHelper.getOptionLabel('avance', novedad.avance );
  	this.estado =       AsistenciaHelper.getOptionLabel('estado', novedad.estado);
    this.intervencion = AsistenciaHelper.getOptionLabel('intervenciones', novedad.intervencion);
    this.fecha = novedad.fe_necesidad || novedad.fecomp_txa;


  }

}
/**
		tnovedad: string = 'operadorcom';
		novedad: string = '';
		sector: string = '';  // salud.model.sectores
		tarea: string = ''; // tareaNovedadOptList
		urgencia: number = 1; // 1,2,3

		fecomp_tsa:  number;
		fecomp_txa:  string;

		hasFeNecesidad: boolean = false;
		fe_necesidad: string = '';
		fets_necesidad: number = 0;

		hasCumplimiento: boolean = false;
		estado: string = 'activa';
		avance: string = 'pendiente';
		avances: AvancesNovedad[] = [];

		atendidox: Atendido;


*/