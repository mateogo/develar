import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, Address, EncuestaAmbiental, UpdateAddressEvent, UpdateEncuestaEvent } from '../../../../entities/person/person';

const UPDATE = 'update';
const TOKEN_TYPE = 'address';

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

  public encuesta: EncuestaAmbiental;

  public showViewEncuesta = false;
  public showEditEncuesta = false;

	public openEditor = false;

  constructor() { }

  ngOnInit() {
    this.encuesta = this.encuesta ? this.encuesta : new EncuestaAmbiental();
  }

  editToken(){
    this.openEditor = !this.openEditor;
    this.showView = !this.showView;
    this.showEdit = !this.showEdit;

    this.showViewEncuesta = false;
    this.showEditEncuesta = false;

  }

  manageToken(event: UpdateAddressEvent){
  	console.log('update Contact-Base: [%s]', event.action);
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event: UpdateAddressEvent){
  	if(event.action === UPDATE){
  		this.updateToken.next(event);
  	}
  }

  editEncuesta(){
    this.openEditor = !this.openEditor;
    this.showView = false;
    this.showEdit = false;

    this.showViewEncuesta = !this.showViewEncuesta;
    this.showEditEncuesta = !this.showEditEncuesta;
  }

  viewEncuesta(){
    this.openEditor = !this.openEditor;
    this.showView = false;
    this.showEdit = false;

    this.showViewEncuesta = !this.showViewEncuesta;
    this.showEditEncuesta = !this.showEditEncuesta;
  }

  manageEncuesta(event: UpdateEncuestaEvent ){
    console.log('update ENCUESTA: [%s]', event.action);
    this.openEditor = false;
    this.showEdit = false;
    this.showView = true;
    this.token.encuesta = event.token;
    
    this.emitEvent({
      action: event.action,
      type: TOKEN_TYPE,
      token: this.token
    });

    this.updateToken.next();



  }

	removeToken(){
	}
}