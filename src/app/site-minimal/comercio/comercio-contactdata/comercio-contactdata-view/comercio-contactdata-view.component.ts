import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, PersonContactData, UpdateContactEvent } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'comercio-contactdata-view',
  templateUrl: './comercio-contactdata-view.component.html',
  styleUrls: ['./comercio-contactdata-view.component.scss']
})
export class ComercioContactdataViewComponent implements OnInit {
	@Input() token: PersonContactData;

	public tipo;
	public type;
	public data;
	public slug;
	
  constructor() { }

  ngOnInit() {
  	this.tipo = this.token.tdato;
  	this.type = this.token.type;
  	this.data = this.token.data;
  	this.slug = this.token.slug;  
  }
}
