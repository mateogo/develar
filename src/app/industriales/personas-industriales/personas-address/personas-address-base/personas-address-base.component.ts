import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UpdateAddressEvent, Address, EncuestaAmbiental, UpdateEncuestaEvent } from '../../../../entities/person/person';

const TOKEN_TYPE = 'address';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'personas-address-base',
  templateUrl: './personas-address-base.component.html',
  styleUrls: ['./personas-address-base.component.scss']
})
export class PersonasAddressBaseComponent implements OnInit {

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

    if(!this.token.street1 && !this.token.city){
      this.editToken();
    }
  }

  editToken(){
    this.openEditor = !this.openEditor;
    this.showView = !this.showView;
    this.showEdit = !this.showEdit;

    this.showViewEncuesta = false;
    this.showEditEncuesta = false;
  }

  manageToken(event: UpdateAddressEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event: UpdateAddressEvent){
  	if(event.action !== CANCEL){
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
