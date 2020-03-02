import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService, UpdateListEvent, UpdateEvent } from '../../../../censo-service';

import { CensoIndustrias,
					CensoActividad,
          CensoBienes,
					EstadoCenso, 
					Empresa, 
					CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'


const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

const literales = {
  actividades: {
    title: 'Actividades industriales',
    token_type: 'actividad'

  },
  bienes: {
    title: 'Bienes, maquinaria y tecnología',
    token_type: 'bien'
  }
}

@Component({
  selector: 'censo-panel',
  templateUrl: './censo-panel.component.html',
  styleUrls: ['./censo-panel.component.scss']
})
export class CensoPanelComponent implements OnInit {
	@Input() items: CensoActividad[]|CensoBienes[];
  @Input() type: string = "actividades";
	@Output() updateItems = new EventEmitter<UpdateListEvent>();




  public title: string;
	public showList = false;
  public openEditor = true;
  private token_type = 'actividad'

  constructor() { }

  ngOnInit() {
    this.title = literales[this.type].title;
    this.token_type = literales[this.type].token_type;

  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateEvent){
    
    if(event.action === DELETE){
      this.deleteItem(event.payload);
    }

  	this.emitEvent(event);
  }

  private deleteItem(t:any){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
  }

  addItem(){
    let item;

    if(this.type === "actividades"){
      item = new CensoActividad();
    }

    if(this.type === "bienes"){
      item = new CensoBienes();
    }

    if(this.items){
      this.items.push(item);
    }else{
      this.items = [item]
    }

    this.showList = true;
  }

  emitEvent(event:UpdateEvent){
    if(event.action !== CANCEL){
 
      if(this.type === "actividades"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoActividad[]
        });
      }

      if(this.type === "bienes"){
        this.updateItems.next({
              action: UPDATE,
              type: this.token_type,
              items: this.items as CensoBienes[]
        });
      }
  	}
  }

}
