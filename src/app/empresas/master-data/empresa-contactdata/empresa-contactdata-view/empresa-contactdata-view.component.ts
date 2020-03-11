import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, PersonContactData, UpdateContactEvent } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'empresa-contactdata-view',
  templateUrl: './empresa-contactdata-view.component.html',
  styleUrls: ['./empresa-contactdata-view.component.scss']
})
export class EmpresaContactdataViewComponent implements OnInit {
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
