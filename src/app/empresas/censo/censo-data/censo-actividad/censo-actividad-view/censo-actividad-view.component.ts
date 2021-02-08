import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';

import { 	CensoIndustrias, 
					EstadoCenso, 
					Empresa, 
					CensoActividad,
					CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'

const ACTIVIDAD = 'actividad';
const CANCEL = 'cancel';
const UPDATE = 'update';
const PAGE_ABSOLUTE =   '/mab/empresas/inicio';
const CENSO_ABSOLUTE =  '/mab/empresas/gestion/censo2021';
const CENSO_ACTIVIDAD =      '/mab/empresas/gestion/censo2021/actividad/:id';
const ACTUAL_CENSO = "censo:industrias:2020:00";

@Component({
  selector: 'censo-actividad-view',
  templateUrl: './censo-actividad-view.component.html',
  styleUrls: ['./censo-actividad-view.component.scss']
})
export class CensoActividadViewComponent implements OnInit {
	@Input() token: CensoActividad;

  public tactividad = "";
  public seccion = "";
  public rubro = "";
  public codigo = "";
  public slug = "";

  constructor() { }

  ngOnInit() {
    this.tactividad = CensoIndustriasService.getOptionLabel('actividad', this.token.type);
    this.seccion = CensoIndustriasService.getActividadOptionLabel(this.token.seccion, 'seccion');
    this.rubro = CensoIndustriasService.getActividadOptionLabel(this.token.rubro, 'rubro');
    this.codigo = CensoIndustriasService.getActividadOptionLabel(this.token.codigo, 'codigo');
    this.slug = this.token.slug;


  }

}

