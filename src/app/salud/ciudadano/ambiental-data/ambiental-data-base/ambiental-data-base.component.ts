import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EncuestaAmbiental,Address, UpdateAmbientalEvent } from '../../../../entities/person/person';

const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'ambiental-base',
  templateUrl: './ambiental-data-base.component.html',
  styleUrls: ['./ambiental-data-base.component.scss']
})
export class AmbientalDataBaseComponent implements OnInit {
	@Input() token: EncuestaAmbiental;
  @Input() addresses: Array<Address>;
	@Output() updateToken = new EventEmitter<UpdateAmbientalEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  constructor() { }

  ngOnInit() {
    if(!this.token.tipoviv && !this.token.matviv){
      this.editToken();
    }


  }

  manageToken(event: UpdateAmbientalEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateAmbientalEvent){
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