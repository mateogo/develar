import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, DocumentData } from '../../../../entities/person/person';
import { CensoIndustriasService, UpdateEvent } from '../../../censo-service';

const CORE = 'permisos';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'empresa-documentos-base',
  templateUrl: './empresa-documentos-base.component.html',
  styleUrls: ['./empresa-documentos-base.component.scss']
})
export class EmpresaDocumentosBaseComponent implements OnInit {
	@Input() token: DocumentData;
  @Input() isHabilitacion = false;
	@Output() updateToken = new EventEmitter<UpdateEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  constructor() { }

  ngOnInit() {

    if(!this.token.slug && !this.token.type){
      this.editToken();
    }
  }

  updateDocument(event: UpdateEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  private emitEvent(event:UpdateEvent){
  	if(event.action !== CANCEL){
  		this.updateToken.next(event);
  	}
  }

	editToken(){
		this.openEditor = !this.openEditor;
		this.showView =   !this.showView;
		this.showEdit =   !this.showEdit;
	}

	removeToken(){
	}

}

