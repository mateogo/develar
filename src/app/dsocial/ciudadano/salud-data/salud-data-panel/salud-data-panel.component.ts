import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  personModel,
          UpdateSaludEvent,
          UpdateItemListEvent,
          SaludData 
        } from '../../../../entities/person/person';

const TOKEN_TYPE = 'salud';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'salud-panel',
  templateUrl: './salud-data-panel.component.html',
  styleUrls: ['./salud-data-panel.component.scss']
})
export class SaludDataPanelComponent implements OnInit {

	@Input() items: Array<SaludData>;
	@Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Eventos de salud, embarazo y/o discapacidad';
	public showList = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateSaludEvent){
    
    if(event.action === DELETE){
      this.deleteItem(event.token);
    }

  	this.emitEvent(event);
  }

  deleteItem(t:SaludData){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
  }

  addItem(){
    let item = new SaludData();

    if(this.items){
      this.items.push(item);
    }else{
      this.items = [item]
    }

    this.showList = true;
  }

  emitEvent(event:UpdateSaludEvent){
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items as SaludData[]
  	});
  	}
  }

}
