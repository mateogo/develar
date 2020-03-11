import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  Person,
          personModel,
          BusinessMembersData,
          UpdateBusinessMemberEvent,
          UpdateItemListEvent
        } from '../../../../entities/person/person';

const TOKEN_TYPE = 'family';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'empresa-members-panel',
  templateUrl: './empresa-members-panel.component.html',
  styleUrls: ['./empresa-members-panel.component.scss']
})
export class EmpresaMembersPanelComponent implements OnInit {

	@Input() items: Array<BusinessMembersData>;
	@Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Personal Directivo y Técnico';
	public showList = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateBusinessMemberEvent){
    
    if(event.action === DELETE){
      this.deleteItem(event.token);
    }

  	this.emitEvent(event);
  }


  deleteItem(t:BusinessMembersData){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
  }

  addItem(){
    let item = new BusinessMembersData();

    if(this.items){
      this.items.push(item);
    }else{
      this.items = [item]
    }

    this.showList = true;
  }

  emitEvent(event:UpdateBusinessMemberEvent){
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items as BusinessMembersData[]
  	});
  	}
  }

}

