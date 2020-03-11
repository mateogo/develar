import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, Address } from '../../../../entities/person/person';

import { CensoIndustriasService } from '../../../censo-service';

import { devutils } from '../../../../develar-commons/utils'

@Component({
  selector: 'empresa-address-view',
  templateUrl: './empresa-address-view.component.html',
  styleUrls: ['./empresa-address-view.component.scss']
})
export class EmpresaAddressViewComponent implements OnInit {
	@Input() token: Address;

	public type;
	public data;
	public slug;
	
  constructor() { }

  ngOnInit() {
  	//this.data = this.token.street1 + ' ' + this.token.city ;
    //this.type = personModel.fetchAddrTypeLabel(this.token.addType);
    
    this.type = CensoIndustriasService.getOptionLabel('address',this.token.addType)
    this.data = personModel.displayAddress( [ this.token ] );

  	this.slug = this.token.slug;  
  }

}
