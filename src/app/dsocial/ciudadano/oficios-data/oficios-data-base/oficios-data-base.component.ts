import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OficiosData, UpdateOficiosEvent } from '../../../../entities/person/person';

const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';


@Component({
  selector: 'oficios-base',
  templateUrl: './oficios-data-base.component.html',
  styleUrls: ['./oficios-data-base.component.scss']
})
export class OficiosDataBaseComponent implements OnInit {
	@Input() token: OficiosData;
	@Output() updateToken = new EventEmitter<UpdateOficiosEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  constructor() { }

  ngOnInit() {
    if(!this.token.tdato && !this.token.tocupacion){
      this.editToken();
    }


  }

  manageToken(event: UpdateOficiosEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateOficiosEvent){
  	if(event.action !== CANCEL){
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
