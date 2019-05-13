import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OficiosData, UpdateOficiosEvent } from '../../../../entities/person/person';

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
  }

  manageToken(event: UpdateOficiosEvent){
  	console.log('update Contact-Base: [%s]', event.action);
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateOficiosEvent){
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
