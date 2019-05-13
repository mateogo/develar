import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, PersonContactData, UpdateContactEvent } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'contact-view',
  templateUrl: './contact-data-view.component.html',
  styleUrls: ['./contact-data-view.component.scss']
})
export class ContactDataViewComponent implements OnInit {
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
