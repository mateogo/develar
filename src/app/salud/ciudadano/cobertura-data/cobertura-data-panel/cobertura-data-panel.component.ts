import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  personModel,
          UpdateCoberturaEvent,
          UpdateItemListEvent,
          CoberturaData 
        } from '../../../../entities/person/person';

const TOKEN_TYPE = 'cobertura';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'cobertura-panel',
  templateUrl: './cobertura-data-panel.component.html',
  styleUrls: ['./cobertura-data-panel.component.scss']
})
export class CoberturaDataPanelComponent implements OnInit {
	@Input() items: Array<CoberturaData>;
	@Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Ingresos; Cobertura; Planes; Pensiones';
	public showList = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateCoberturaEvent){
    
    if(event.action === DELETE){
      this.deleteItem(event.token);
    }

  	this.emitEvent(event);
  }

  deleteItem(t:CoberturaData){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
  }

  addItem(){
    let item = new CoberturaData();

    if(this.items){
      this.items.push(item);
    }else{
      this.items = [item]
    }

    this.showList = true;
  }

  emitEvent(event:UpdateCoberturaEvent){
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items as CoberturaData[]
  	});
  	}
  }

}