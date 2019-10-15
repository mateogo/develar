import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  Person,
          personModel,
          UpdateFamilyEvent,
          UpdateItemListEvent,
          FamilyData 
        } from '../../../../entities/person/person';

const TOKEN_TYPE = 'family';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'comercio-members-panel',
  templateUrl: './comercio-members-panel.component.html',
  styleUrls: ['./comercio-members-panel.component.scss']
})
export class ComercioMembersPanelComponent implements OnInit {

	@Input() items: Array<FamilyData>;
	@Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Personal de seguridad - Vínculos/ Roles laborales';
	public showList = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateFamilyEvent){
    
    if(event.action === DELETE){
      this.deleteItem(event.token);
    }

  	this.emitEvent(event);
  }


  deleteItem(t:FamilyData){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
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
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items as FamilyData[]
  	});
  	}
  }

}

