import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {  Person,
          personModel,
          DocumentData 
        } from '../../../../entities/person/person';
import { CensoIndustriasService, UpdateEvent, UpdateListEvent } from '../../../censo-service';

const TOKEN_PERMISOS = 'permisos';
const TOKEN_HABILITACION = 'habilitaciones';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'empresa-documentos-panel',
  templateUrl: './empresa-documentos-panel.component.html',
  styleUrls: ['./empresa-documentos-panel.component.scss']
})
export class EmpresaDocumentosPanelComponent implements OnInit {
	@Input() items: Array<DocumentData>;
  @Input() isHabilitacion = false;
	@Output() updateItems = new EventEmitter<UpdateListEvent>();

  public title = 'Habilitaciones, Licencias,  y otros documentos';
	public showList = false;
  public openEditor = true;

  constructor() { }

  ngOnInit() {
    if(this.isHabilitacion){
      this.title = 'Habilitación Municipal';

    }else {
      this.title = 'Licencias, Permisos y otros documentos';

    }


  	if(this.items && this.items.length){
  		this.showList = true;
  	}
  }

  updateItem(event: UpdateEvent){

    if(event.action === DELETE){
      this.deleteItem(event.payload as DocumentData);
    }

  	this.emitEvent(event);
  }

  private deleteItem(t:DocumentData){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
  }

  addItem(){
    let item = new DocumentData();
    item.type = 'habilitacion';
    item.slug = 'Habilitación Municipal';
    item.isTramitacionMAB = true;
    item.expedidopor = 'MAB';
    item.fechavigencia = item.fechaexpe;
    item.fechavigencia_ts = 0;
    item.tramitacionURL = '';
    
    if(this.items){
      this.items.push(item);

    }else{
      this.items = [item]

    }
    this.showList = true;
  }

  private emitEvent(event:UpdateEvent){
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: this.isHabilitacion ? TOKEN_HABILITACION : TOKEN_PERMISOS,
  		items: this.items
  	});
  	}
  }

}

