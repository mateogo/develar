import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { SaludController } from '../../../salud.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia, 
					Alimento, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';

const UPDATE = 'update';
const DELETE = 'delete';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE = 'navigate';

@Component({
  selector: 'solasis-panel',
  templateUrl: './solasis-panel.component.html',
  styleUrls: ['./solasis-panel.component.scss']
})
export class SolasisPanelComponent implements OnInit {
	@Input() items: Array<Asistencia>;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();

  public title = 'Solicitudes de Asistencia';

	public showList = false;
  public showActiveList = false;
  public showFullList = true;

  public openEditor = true;
  public activeitems: Array<Asistencia> = [];

  constructor(
      private dsCtrl: SaludController,
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
      this.activeitems = AsistenciaHelper.filterActiveAsistencias(this.items);

      if(this.activeitems && this.activeitems.length){
        this.showActiveView(true);

      }else{
        this.showActiveView(false);

      }


    },500);

  }

  updateItem(event: UpdateAsistenciaEvent){
    if(event.action === UPDATE){
      this.dsCtrl.manageAsistenciaRecord(event.token).subscribe(t =>{
        if(t){
          event.token = t;

          this.filterActiveItems();
        }

        this.emitEvent(event);

      });

    } else if(event.action === NAVIGATE){
      this.emitEvent(event);


    } else if(event.action === DELETE){
      this.deleteItem(event.token)


    }
  }

  private deleteItem(token:Asistencia){
    let isNew = token._id ? false: true;
    if(isNew){
      this.deleteFromListItems(token);
    }

  }

  deleteFromListItems(token: Asistencia){
    let index = this.items.indexOf(token);
    if(index !== -1){
      this.items.splice(index, 1)
    }
  }

  addItem(){
    let item = AsistenciaHelper.initNewAsistencia('alimentos', 'alimentos')
    if(!this.items) this.items = [];
    if(!this.activeitems) this.activeitems = [];

    this.items.unshift(item);
    this.activeitems.unshift(item);

    this.showList = true;

  }

  emitEvent(event:UpdateAsistenciaEvent){
  
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

  // deprecated
  activeView(){
    this.showActiveView(true);
  }

  fullView(){
    this.showActiveView(false);
  }

  private showActiveView(active){
    if(active === true){
      this.title = 'Solicitudes de Asistencia (solo activas)';
    } else {
      this.title = 'Solicitudes de Asistencia (lista completa)';

    }
    this.showActiveList = active;
    this.showFullList = !active;
  }

}
