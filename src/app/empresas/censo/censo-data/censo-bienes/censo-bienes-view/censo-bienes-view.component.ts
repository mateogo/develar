import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';

import { 	CensoIndustrias, 
					CensoBienes } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'


@Component({
  selector: 'censo-bienes-view',
  templateUrl: './censo-bienes-view.component.html',
  styleUrls: ['./censo-bienes-view.component.scss']
})
export class CensoBienesViewComponent implements OnInit {
	@Input() token: CensoBienes;

  public type = "";
  public origen = "";
  public slug = "";

  constructor() { }

  ngOnInit() {
    this.type = CensoIndustriasService.getOptionLabel('tipoBienes', this.token.type);
  
    this.slug = this.token.slug;
    this.origen = this.token.cenproductivo || this.token.origen;

  }


}