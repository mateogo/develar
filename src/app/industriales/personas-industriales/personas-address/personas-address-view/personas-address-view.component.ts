import { Component, OnInit, Input } from '@angular/core';
import { Address, personModel } from '../../../../entities/person/person';

@Component({
  selector: 'personas-address-view',
  templateUrl: './personas-address-view.component.html',
  styleUrls: ['./personas-address-view.component.scss']
})
export class PersonasAddressViewComponent implements OnInit {

  @Input() token: Address;

	public type;
	public data;
	public slug;
	
  constructor() { }

  ngOnInit() {
  	//this.data = this.token.street1 + ' ' + this.token.city ;
    //this.type = personModel.fetchAddrTypeLabel(this.token.addType);
    
    this.type = this.getLabel([
      {val: 'no_definido', 	  label: 'Seleccione opción',slug:'Seleccione opción' },
      {val: 'fabrica',        label: 'Fábrica',          slug:'Sede fábrica' },
      {val: 'deposito',       label: 'Depósito',         slug:'Depósito' },
      {val: 'admin',          label: 'Administración',   slug:'Sede administración' },
      {val: 'fiscal', 	      label: 'Domicilio Fiscal', slug:'Domicilio fiscal' },
      {val: 'entrega', 	      label: 'Lugar entrega',    slug:'Lugar de entrega' },
      {val: 'sucursal', 	    label: 'Sucursal',         slug:'Sucursal' },
      {val: 'principal',      label: 'Principal',        slug:'Locación principal' },
    ],this.token.addType)
    this.data = personModel.displayAddress( [ this.token ] );

  	this.slug = this.token.slug;  
  }

  getLabel(list, val){
		let t = list.find(item => item.val === val)
		return t ? t.label : val;
}

}

