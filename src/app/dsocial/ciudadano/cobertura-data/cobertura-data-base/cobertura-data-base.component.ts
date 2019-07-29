import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CoberturaData, UpdateCoberturaEvent } from '../../../../entities/person/person';

const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'cobertura-base',
  templateUrl: './cobertura-data-base.component.html',
  styleUrls: ['./cobertura-data-base.component.scss']
})
export class CoberturaDataBaseComponent implements OnInit {
	@Input() token: CoberturaData;
	@Output() updateToken = new EventEmitter<UpdateCoberturaEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  constructor() { }

  ngOnInit() {
    if(!this.token.type && !this.token.tingreso){
      this.editToken();
    }


  }

  manageToken(event: UpdateCoberturaEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateCoberturaEvent){
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
