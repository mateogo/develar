import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, Address } from '../../../../entities/person/person';

import { devutils } from '../../../../develar-commons/utils'

@Component({
  selector: 'comercio-address-view',
  templateUrl: './comercio-address-view.component.html',
  styleUrls: ['./comercio-address-view.component.scss']
})
export class ComercioAddressViewComponent implements OnInit {
	@Input() token: Address;

	public type;
	public data;
	public slug;
	
  constructor() { }

  ngOnInit() {
  	this.type = personModel.fetchAddrTypeLabel(this.token.addType);
  	//this.data = this.token.street1 + ' ' + this.token.city ;
    this.data = personModel.displayAddress( [ this.token ] );

  	this.slug = this.token.slug;  
  }

}
