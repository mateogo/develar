import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  personModel,
          UpdateAmbientalEvent,
          UpdateItemListEvent,
          Address,
          EncuestaAmbiental 
        } from '../../../../entities/person/person';

const TOKEN_TYPE = 'ambiental';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'ambiental-panel',
  templateUrl: './ambiental-data-panel.component.html',
  styleUrls: ['./ambiental-data-panel.component.scss']
})
export class AmbientalDataPanelComponent implements OnInit {
	@Input() items: Array<EncuestaAmbiental>;
  @Input() addresses: Array<Address>;
	@Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Informe ambiental';
	public showList = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateAmbientalEvent){
    
    if(event.action === DELETE){
      this.deleteItem(event.token);
    }

  	this.emitEvent(event);
  }

  deleteItem(t:EncuestaAmbiental){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
  }

  addItem(){
    let item = new EncuestaAmbiental();

    if(this.items){
      this.items.push(item);
    }else{
      this.items = [item]
    }

    this.showList = true;
  }

  emitEvent(event:UpdateAmbientalEvent){
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items as EncuestaAmbiental[]
  	});
  	}
  }

}
