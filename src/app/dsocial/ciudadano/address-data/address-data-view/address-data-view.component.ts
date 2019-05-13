import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, Address } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'address-view',
  templateUrl: './address-data-view.component.html',
  styleUrls: ['./address-data-view.component.scss']
})
export class AddressDataViewComponent implements OnInit {
	@Input() token: Address;

	public tipo;
	public type;
	public data;
	public slug;
	
  constructor() { }

  ngOnInit() {
  	this.tipo = this.token.addType;
  	this.type = this.token.addType;
  	this.data = this.token.street1;
  	this.slug = this.token.slug;  
  }

}
