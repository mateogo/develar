import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';

import { 	CensoIndustrias, 
					CensoExpectativas } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'


@Component({
  selector: 'censo-expectativas-view',
  templateUrl: './censo-expectativas-view.component.html',
  styleUrls: ['./censo-expectativas-view.component.scss']
})
export class CensoExpectativasViewComponent implements OnInit {
	@Input() token: CensoExpectativas;

  public type = "";
  public nactividad = "";
  public varactividad = 0;
  public slug = "";
  public nactividadOptList = CensoIndustriasService.getOptionlist('nactividad');
  public varactividadOptList = CensoIndustriasService.getOptionlist('varactividad');

  constructor() { }

  ngOnInit() {
    this.nactividad = CensoIndustriasService.getOptionLabel('nactividad', this.token.nactividad);
    this.varactividad = this.token.nactividad_var;
    this.slug = this.token.slug;


  }

}

