import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';

import { 	CensoIndustrias, 
          CensoComercializacion,
          Mercado,
          MercadoSumario,
					CensoBienes } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'


@Component({
  selector: 'censo-comercializacion-view',
  templateUrl: './censo-comercializacion-view.component.html',
  styleUrls: ['./censo-comercializacion-view.component.scss']
})
export class CensoComercializacionViewComponent implements OnInit {
	@Input() token: CensoComercializacion;

  public type = "";
  public origen = "";
  public slug = "";
  public hasPlanAumentoExpo = '';
  public planesActivos = '';

  public mercados: Array<Mercado> = [];
  public totales: MercadoSumario;
  public total: Mercado = new Mercado();
  public local: Mercado = new Mercado();
  public externo: Mercado = new Mercado();

  public showData = false;

  constructor() { }

  ngOnInit() {
    this.buildView(this.token)

  }

  private buildView(token){
    token.mercados = (token.mercados && token.mercados.length ) ? token.mercados : [];

    this.mercados = token.mercados.map(t => {
            //t.target = CensoIndustriasService.getOptionLabel('mercados', t.target);
            return t;
    })

    this.totales = CensoIndustriasService.sumMercadeo(this.mercados);

    this.total = this.totales.total;
    this.local = this.totales.local;
    this.externo = this.totales.externo;

    this.type = CensoIndustriasService.getOptionLabel('tipoBienes', this.token.type);
    this.slug = this.token.slug;
    this.showData = true;

    this.hasPlanAumentoExpo = token.hasPlanAumentoExpo ? 'Plan activo de aumento de exportaciones' : 'No tiene plan activo de aumento de exportaciones'
    this.planesActivos = CensoIndustriasService.planesActivosAmentoExportaciones(token);
  }


}
