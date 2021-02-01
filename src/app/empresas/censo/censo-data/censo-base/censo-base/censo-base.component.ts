import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { 	CensoIndustrias, 
					EstadoCenso, 
					Empresa, 
					CensoActividad,
          CensoBienes,
          CensoComercializacion,
					CensoData } from '../../../../censo.model';

import { CensoIndustriasService, UpdateEvent } from '../../../../censo-service';


const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';


@Component({
  selector: 'censo-base',
  templateUrl: './censo-base.component.html',
  styleUrls: ['./censo-base.component.scss']
})
export class CensoBaseComponent implements OnInit {
	@Input() token: CensoActividad|CensoBienes|CensoComercializacion;
  @Input() type: string = 'actividades'
	@Output() updateToken = new EventEmitter<UpdateEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  public isActividad = false;
  public isBien = false;
  public isComercializacion = false;

  constructor() { }

  ngOnInit() {


    if( !(this.token && this.token._id)){
      this.editToken();
    }

    if(this.type === 'actividades'){
      this.isActividad = true;
    }
    if(this.type === 'bienes'){
      this.isBien = true;
    }
    if(this.type === 'comercializacion'){
      this.isComercializacion = true;
    }
  }

  manageToken(event: UpdateEvent){
  	this.openEditor = false;
  	this.showEdit = false;
  	this.showView = true;
  	this.emitEvent(event);
  }

  emitEvent(event:UpdateEvent){
  	if(event.action !== CANCEL){
  		this.updateToken.next(event);
  	}
  }


	editToken(){
		this.openEditor = !this.openEditor;
		this.showView = !this.showView;
		this.showEdit = !this.showEdit;
	}

	removeToken(){
	}

}
