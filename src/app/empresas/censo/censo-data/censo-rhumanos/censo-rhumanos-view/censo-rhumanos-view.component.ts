import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';

import { 	CensoIndustrias, 
					CensoRecursosHumanos } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'


@Component({
  selector: 'censo-rhumanos-view',
  templateUrl: './censo-rhumanos-view.component.html',
  styleUrls: ['./censo-rhumanos-view.component.scss']
})
export class CensoRhumanosViewComponent implements OnInit {
	@Input() token: CensoRecursosHumanos;

  public type = "";
  public slug = "";

  constructor() { }

  ngOnInit() {
    this.type = CensoIndustriasService.getOptionLabel('tipoBienes', this.token.type);
    
    this.slug = this.token.slug;


  }

}
