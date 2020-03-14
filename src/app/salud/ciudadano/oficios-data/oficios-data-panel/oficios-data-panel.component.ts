import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  personModel,
          UpdateOficiosEvent,
          UpdateItemListEvent,
          OficiosData 
        } from '../../../../entities/person/person';

const TOKEN_TYPE = 'oficios';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'oficios-panel',
  templateUrl: './oficios-data-panel.component.html',
  styleUrls: ['./oficios-data-panel.component.scss']
})
export class OficiosDataPanelComponent implements OnInit {

	@Input() items: Array<OficiosData>;
	@Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Oficios, empleos y capacitaciones';
	public showList = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateOficiosEvent){
    
    if(event.action === DELETE){
      this.deleteItem(event.token);
    }

  	this.emitEvent(event);
  }

  deleteItem(t:OficiosData){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
  }

  addItem(){
    let item = new OficiosData();

    if(this.items){
      this.items.push(item);
    }else{
      this.items = [item]
    }

    this.showList = true;
  }

  emitEvent(event:UpdateOficiosEvent){
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items as OficiosData[]
  	});
  	}
  }

}
