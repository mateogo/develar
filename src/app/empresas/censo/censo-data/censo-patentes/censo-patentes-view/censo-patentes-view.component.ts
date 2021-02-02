import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';

import { 	CensoIndustrias, 
					CensoPatentes } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'


@Component({
  selector: 'censo-patentes-view',
  templateUrl: './censo-patentes-view.component.html',
  styleUrls: ['./censo-patentes-view.component.scss']
})
export class CensoPatentesViewComponent implements OnInit {
	@Input() token: CensoPatentes;

  public type = "";
  public origen = "";
  public slug = "";

  constructor() { }

  ngOnInit() {
    this.type = CensoIndustriasService.getOptionLabel('tipoPatentes', this.token.type);
    
    this.slug = this.token.slug;
    this.origen = this.token.origen;

  }
}
