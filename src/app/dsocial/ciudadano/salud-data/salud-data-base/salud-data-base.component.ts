import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SaludData, UpdateSaludEvent } from '../../../../entities/person/person';

const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'salud-base',
  templateUrl: './salud-data-base.component.html',
  styleUrls: ['./salud-data-base.component.scss']
})
export class SaludDataBaseComponent implements OnInit {
	@Input() token: SaludData;
	@Output() updateToken = new EventEmitter<UpdateSaludEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  constructor() { }

  ngOnInit() {
    if(!this.token.type && !this.token.tproblema){
      this.editToken();
    }


  }

  manageToken(event: UpdateSaludEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateSaludEvent){
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
