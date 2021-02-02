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
  public slug = "";

  constructor() { }

  ngOnInit() {
    this.type = CensoIndustriasService.getOptionLabel('tipoBienes', this.token.type);
    
    this.slug = this.token.slug;


  }

}

