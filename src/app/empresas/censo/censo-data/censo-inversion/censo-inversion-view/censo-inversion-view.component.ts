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
  selector: 'censo-inversion-view',
  templateUrl: './censo-inversion-view.component.html',
  styleUrls: ['./censo-inversion-view.component.scss']
})
export class CensoInversionViewComponent implements OnInit {
	@Input() token: CensoComercializacion;

  public type = "";
  public stype = "";
  private stypeOptList = [];
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

    this.type = CensoIndustriasService.getOptionLabel('inversionType', this.token.type);
    this.stypeOptList = CensoIndustriasService.populateSTypeOptList('stype', token.type) || [] ;
    this.stype = CensoIndustriasService.getOptionLabelFromList(this.stypeOptList, token.stype);
    this.slug = this.token.slug;
    this.showData = true;

  }

}