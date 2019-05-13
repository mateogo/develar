import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  personModel,
          UpdateOficiosEvent,
          UpdateItemListEvent,
          OficiosData 
        } from '../../../../entities/person/person';

const UPDATE = 'update';
const TOKEN_TYPE = 'oficios';

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
  	console.log('update Oficios-Panel: [%s]', event.action);

  	this.emitEvent(event);
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
    console.log('=== Oficios DATA Panel ====');
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items as OficiosData[]
  	});
  	}
  }

}
