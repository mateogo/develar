import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';

import { 	CensoIndustrias, 
					CensoMaquinarias } from '../../../../censo.model';


@Component({
  selector: 'censo-maquinarias-view',
  templateUrl: './censo-maquinarias-view.component.html',
  styleUrls: ['./censo-maquinarias-view.component.scss']
})
export class CensoMaquinariasViewComponent implements OnInit {
	@Input() token: CensoMaquinarias;

  public type = "";
  public origen = "";
  public slug = "";

  constructor() { }

  ngOnInit() {
    this.type = CensoIndustriasService.getOptionLabel('tipoMaquinas', this.token.type);
    this.slug = this.token.slug;
    this.origen = this.token.origen;

  }
}
