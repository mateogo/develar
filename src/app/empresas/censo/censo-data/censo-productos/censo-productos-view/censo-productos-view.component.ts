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
const CENSO_ABSOLUTE =  '/mab/empresas/gestion/censo2020';
const CENSO_ACTIVIDAD =      '/mab/empresas/gestion/censo2020/actividad/:id';
const ACTUAL_CENSO = "censo:industrias:2020:00";


@Component({
  selector: 'censo-productos-view',
  templateUrl: './censo-productos-view.component.html',
  styleUrls: ['./censo-productos-view.component.scss']
})
export class CensoProductosViewComponent implements OnInit {
	@Input() token: CensoActividad;

  public type = "";
  public slug = "";

  constructor() { }

  ngOnInit() {
    this.type = CensoIndustriasService.getOptionLabel('tipoBienes', this.token.type);
    this.slug = this.token.slug;


  }

}
