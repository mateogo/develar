import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, Address, UpdateAddressEvent } from '../../../../entities/person/person';

const UPDATE = 'update';

@Component({
  selector: 'address-base',
  templateUrl: './address-data-base.component.html',
  styleUrls: ['./address-data-base.component.scss']
})
export class AddressDataBaseComponent implements OnInit {
	@Input() token: Address;
	@Output() updateToken = new EventEmitter<UpdateAddressEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  constructor() { }

  ngOnInit() {
  }

  manageToken(event: UpdateAddressEvent){
  	console.log('update Contact-Base: [%s]', event.action);
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateAddressEvent){
  	if(event.action === UPDATE){
  		this.updateToken.next(event);
  	}
  }

	editToken(){
		this.openEditor = !this.openEditor;
		this.showView = !this.showView;
		this.showEdit = !this.showEdit;
	}

	removeToken(){
	}


}