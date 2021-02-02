import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { 	CensoIndustrias, 
					EstadoCenso, 
					Empresa, 
					CensoActividad,
          CensoBienes,
          CensoProductos,
          CensoComercializacion,
          CensoMaquinarias,
          CensoPatentes,
          CensoRecursosHumanos,
          CensoExpectativas,
          CensoInversion,
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
	@Input() token: CensoActividad|CensoBienes|CensoProductos|CensoInversion|CensoMaquinarias|CensoPatentes|CensoRecursosHumanos|CensoExpectativas;
  @Input() type: string = 'actividades'
	@Output() updateToken = new EventEmitter<UpdateEvent>();

	public showView = true;
	public showEdit = false;
	public openEditor = false;

  public isActividad = false;
  public isBien = false;
  public isProductos = false;
  public isComercializacion = false;
  public isInversion = false;
  public isExpectativas = false;
  public isRhumanos = false;
  public isMaquinarias = false;
  public isPatentes = false;

  constructor() { }

  ngOnInit() {
    if(this.type === 'actividades'){
      this.isActividad = true;
    }

    if(this.type === 'bienes'){
      this.isBien = true;
    }

    if(this.type === 'productos'){
      this.isProductos = true;
    }

    if(this.type === 'comercializacion'){
      this.isComercializacion = true;
    }

    if(this.type === 'inversion'){
      this.isInversion = true;
    }

    if(this.type === 'maquinarias'){
      this.isMaquinarias = true;
    }

    if(this.type === 'patentes'){
      this.isPatentes = true;
    }
    
    if(this.type === 'rhumanos'){
      this.isRhumanos = true;
    }
    
    if(this.type === 'expectativas'){
      this.isExpectativas = true;
    }

    // Show Editor
    if( !(this.token && this.token._id)){
      this.editToken();
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
