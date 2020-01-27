import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {  Observacion, Audit, ParentEntity } from '../observaciones.model';
import {  ObservacionesController } from '../observaciones.controller';
import { 	UpdateObservacionEvent, ObservacionesHelper } from '../observaciones.helper';

const UPDATE = 'update';
const DELETE = 'delete';
const NAVIGATE = 'navigate';
const SELECT = 'select';

const TOKEN_TYPE = 'observacion';

const BG_COLOR_DEFAULT = "#ffffff";
const BG_COLOR_SELECTED = "#f2eded"; //75787B //0645f5


@Component({
  selector: 'observaciones-base',
  templateUrl: './observaciones-base.component.html',
  styleUrls: ['./observaciones-base.component.scss']
})
export class ObservacionesBaseComponent implements OnInit {
	@Input() observacion: Observacion;
  @Input() type: string = 'type';

	@Output() updateToken = new EventEmitter<UpdateObservacionEvent>();

	public showEditPanel = false;
  public showEditControl = true;

  public showView = true;
  public showEdit = false;


	public openEditor = false;

  public toggleSelectd = false;

  constructor() { }

  ngOnInit() {
    this.showEditControl = true;


    if(!this.observacion.observacion ){
      this.editToken()
    }
  }


  editToken(){
    this.showEdit = !this.showEdit;

    if(this.showEdit){
      this.showView = false;
      this.showEditPanel = true;

    }else{
      this.showView = true;
      this.showEditPanel = false;

    }
  }




  manageBase(event: UpdateObservacionEvent){
    this.showEdit = false;
    this.showView = true;
    this.showEditPanel = false;

  	this.emitEvent(event);
  }


  emitEvent(event: UpdateObservacionEvent){
  	if(event.action === UPDATE){
  		this.updateToken.next(event);
  	}
    if(event.action === NAVIGATE){
      this.updateToken.next(event);
    }
    if(event.action === DELETE){
      this.updateToken.next(event);
    }
    if(event.action === SELECT){
      this.updateToken.next(event);
    }
  }

 
	removeToken(){
	}

}

interface ChipSchema{
  color:string;
  text: string;
}
