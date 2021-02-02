import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';

import { 	CensoIndustrias, 
					CensoProductos } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'


@Component({
  selector: 'censo-productos-view',
  templateUrl: './censo-productos-view.component.html',
  styleUrls: ['./censo-productos-view.component.scss']
})
export class CensoProductosViewComponent implements OnInit {
	@Input() token: CensoProductos;

  public type = "";
  public origen = "";
  public slug = "";

  constructor() { }

  ngOnInit() {
    this.type = CensoIndustriasService.getOptionLabel('tipoProductos', this.token.type);
    

    this.slug = this.token.slug;
    this.origen = this.token.cenproductivo || this.token.origen;


  }

}
