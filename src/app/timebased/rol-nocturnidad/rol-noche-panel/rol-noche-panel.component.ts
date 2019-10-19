import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { TimebasedController } from '../../timebased-controller';

import {  Person } from '../../../entities/person/person';

import { RolNocturnidad, RolNocturnidadItem, UpdateRolEvent }    from '../../timebased.model';
import { TimebasedHelper }    from '../../timebased-helper';

const UPDATE = 'update';
const TOKEN_TYPE = 'rolnocturnidad';
const NAVIGATE = 'navigate';


@Component({
  selector: 'rol-noche-panel',
  templateUrl: './rol-noche-panel.component.html',
  styleUrls: ['./rol-noche-panel.component.scss']
})
export class RolNochePanelComponent implements OnInit {
	@Input() items: Array<RolNocturnidad> = [];
	@Output() updateItems = new EventEmitter<UpdateRolEvent>();

  public title = 'Rol de Nocturnidad';
	public showList = true;
  public openEditor = true;

  constructor(
      private tbCtrl: TimebasedController,
    ) { }

  ngOnInit() {
    console.log('Panel [%s]', this.items && this.items.length)
  }

  updateItem(event: UpdateRolEvent){
    if(event.action === UPDATE){
      this.tbCtrl.manageRolNocturnidadRecord('rolnocturnidad',event.token).subscribe(t =>{
        console.log('updateItem@panel: [%s]', event.token === t)


        if(t){
          event.token = t;
        }

        this.emitEvent(event);

      });      
    } else if(event.action === NAVIGATE){
      this.emitEvent(event);

    }
  }

  addItem(){
    let item = TimebasedHelper.initNewRolNocturnidad('rolnocturnidad', 'rolnocturnidad')
    if(this.items){
      this.items.unshift(item);

    }else{
      this.items = [ item ]

    }
    this.showList = true;

  }

  emitEvent(event:UpdateRolEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		token: event.token,
  		items: this.items
  	  });

  	} else if(event.action === NAVIGATE){
      this.updateItems.next({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      token: event.token,
      items: this.items
      });

    }
  }

}
