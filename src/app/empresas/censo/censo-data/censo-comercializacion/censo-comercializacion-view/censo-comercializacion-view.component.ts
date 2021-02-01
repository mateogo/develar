import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';

import { 	CensoIndustrias, 
          CensoComercializacion,
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

  constructor() { }

  ngOnInit() {
    this.type = CensoIndustriasService.getOptionLabel('tipoBienes', this.token.type);
    

    this.slug = this.token.slug;
    //this.origen = this.token.origen;
  }

}
