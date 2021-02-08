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
  selector: 'censo-core-view',
  templateUrl: './censo-core-view.component.html',
  styleUrls: ['./censo-core-view.component.scss']
})
export class CensoCoreViewComponent implements OnInit {
	@Input() token: CensoIndustrias;

/**
 	<div class="row">
 		<div class="col-sm-12 col-md-12">
 			<p class='text-destacado'>{{ compNum }} </p>
 			<p class='text-normal'>{{ estado }}</p>
 			<p class='text-normal'>{{ codigo }} </p>

 			<p class='text-normal'>
 				<strong>{{ slug }}</strong>
 		</div>


**/

  public compNum = "";
  public estado = "";
  public codigo = "";
  public slug = "";

  constructor() { }

  ngOnInit() {
  	let _estado = CensoIndustriasService.getOptionLabel('estado', this.token.estado.estado);
  	let _navance = CensoIndustriasService.getOptionLabel('navance', this.token.estado.navance);

    this.slug = this.token.censo.slug;
    this.compNum = this.token.compName + '/' + this.token.compNum;
    this.codigo = "Estado: " + _estado + '::' + 'Avance: ' + _navance;


  }

}

