import { Component, OnInit, Input } from '@angular/core';
import { personModel, SaludData } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'salud-view',
  templateUrl: './salud-data-view.component.html',
  styleUrls: ['./salud-data-view.component.scss']
})
export class SaludDataViewComponent implements OnInit {

	@Input() token: SaludData;
	public type;
	public tproblema;
	public problema;
	public lugaratencion;
	public slug;


  constructor() { }

  ngOnInit() {
  	this.type = personModel.getSaludTypeDato(this.token.type);
  	this.tproblema = personModel.getSaludSubTypeDato(this.token.type, this.token.tproblema);
  	this.problema = this.token.problema;
  	this.lugaratencion = this.token.lugaratencion;
  	this.slug = this.token.slug;
  }


}
