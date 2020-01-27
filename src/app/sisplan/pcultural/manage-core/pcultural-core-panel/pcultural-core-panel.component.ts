import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Pcultural, PculturalHelper } from '../../pcultural.model';


const UPDATE = 'update';
const DELETE = 'delete';
const TOKEN_TYPE = 'pcultural';
const NAVIGATE = 'navigate';

@Component({
  selector: 'pcultural-core-panel',
  templateUrl: './pcultural-core-panel.component.html',
  styleUrls: ['./pcultural-core-panel.component.scss']
})
export class PculturalCorePanelComponent implements OnInit {
	@Input() items: Array<Pcultural>;
	@Output() updateItems = new EventEmitter<UpdateListEvent>();

  public title = 'Eventos Culturales';

	public showList = false;
  public showActiveList = false;
  public showFullList = true;

  public openEditor = true;

  public activeitems: Array<Pcultural> = [];

  constructor(
      private dsCtrl: SisplanController,
    ) { }

  ngOnInit() {

  	if(this.items && this.items.length){
      this.filterActiveItems();
  		this.showList = true;
  	}

  }

  private filterActiveItems(){
    this.activeitems = [];
    setTimeout(()=>{
      this.activeitems = SisplanService.filterActivePculturales(this.items);

      if(this.activeitems && this.activeitems.length){
        this.showActiveView(true);

      }else{
        this.showActiveView(false);

      }


    },500);

  }

  updateItem(event: UpdateEvent){
    if(event.action === UPDATE){
      this.dsCtrl.managePCulturalRecord(event.payload).subscribe(t =>{
        if(t){
          event.payload = t;

          this.filterActiveItems();
        }

        this.emitEvent(event);

      });

    } else if(event.action === NAVIGATE){
      this.emitEvent(event);


    } else if(event.action === DELETE){
      this.deleteItem(event.payload)


      // this.dsCtrl.manageAsistenciaDeleteRecord('asistencia',event.token).subscribe(t =>{

      //   this.emitEvent(event);

      // });      

    }
  }

  private deleteItem(token: Pcultural){
    let isNew = token._id ? false: true;
    if(isNew){
      this.deleteFromListItems(token);
    }

  }

  deleteFromListItems(token: Pcultural){
    let index = this.items.indexOf(token);
    if(index !== -1){
      this.items.splice(index, 1)
    }
  }

  addItem(){
    let item = SisplanService.initNewPcultural('produccion', 'musica', 'popular', 'alta rápida')
    if(!this.items) this.items = [];
    if(!this.activeitems) this.activeitems = [];

    this.items.unshift(item);
    this.activeitems.unshift(item);

    this.showList = true;

  }

  emitEvent(event:UpdateEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	  });

  	} else if(event.action === NAVIGATE){
      this.updateItems.next({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      items: this.items
      });

    }
  }

  activeView(){
    this.showActiveView(true);
  }

  fullView(){
    this.showActiveView(false);
  }

  private showActiveView(active){
    if(active === true){
      this.title = 'Eventos Culturales (solo activas)';
    } else {
      this.title = 'Eventos Culturales (lista completa)';

    }
    this.showActiveList = active;
    this.showFullList = !active;
  }


}
