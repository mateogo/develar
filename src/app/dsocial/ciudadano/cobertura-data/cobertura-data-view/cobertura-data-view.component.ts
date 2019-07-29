import { Component, OnInit, Input } from '@angular/core';
import { personModel, CoberturaData } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'


@Component({
  selector: 'cobertura-view',
  templateUrl: './cobertura-data-view.component.html',
  styleUrls: ['./cobertura-data-view.component.scss']
})
export class CoberturaDataViewComponent implements OnInit {
	@Input() token: CoberturaData;

	public type;
	public tingreso;
	public slug;
	public monto;
	public observacion;

  constructor() { }

  ngOnInit() {
  	this.type = personModel.getCoberturaTypeDato(this.token.type);
  	this.tingreso = personModel.getCoberturaSubTypeDato(this.token.type, this.token.tingreso);
  	this.slug = this.token.slug;
  	this.monto = this.token.monto;
  	this.observacion = this.token.observacion;
  }

}

