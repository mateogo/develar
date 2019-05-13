import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  Person,
          personModel,
          UpdateFamilyEvent,
          UpdateItemListEvent,
          FamilyData 
        } from '../../../../entities/person/person';

const UPDATE = 'update';
const TOKEN_TYPE = 'family';

@Component({
  selector: 'family-panel',
  templateUrl: './family-data-panel.component.html',
  styleUrls: ['./family-data-panel.component.scss']
})
export class FamilyDataPanelComponent implements OnInit {

	@Input() items: Array<FamilyData>;
	@Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Vinculos Familiares';
	public showList = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateFamilyEvent){
  	console.log('update Family-Panel: [%s]', event.action);

  	this.emitEvent(event);
  }

  addItem(){
    let item = new FamilyData();

    if(this.items){
      this.items.push(item);
    }else{
      this.items = [item]
    }

    this.showList = true;
  }

  emitEvent(event:UpdateFamilyEvent){
    console.log('=== Family DATA Panel ====');
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items as FamilyData[]
  	});
  	}
  }

}