import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map  }   from 'rxjs/operators';

import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../../../../develar-commons/asset-helper';

import { Person, DocumentData, personModel } from '../../../../entities/person/person';
import { CensoIndustriasService, UpdateEvent } from '../../../censo-service';

import { EmpresasController } from '../../../empresas.controller';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'permisos';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';


@Component({
  selector: 'empresa-documentos-view',
  templateUrl: './empresa-documentos-view.component.html',
  styleUrls: ['./empresa-documentos-view.component.scss']
})
export class EmpresaDocumentosViewComponent implements OnInit {
	@Input() token: DocumentData;
	@Input() isHabilitacion = false;

	@Output() updateToken = new EventEmitter<UpdateEvent>();

  public documentos = CensoIndustriasService.getOptionlist('documentos');
	public estados = CensoIndustriasService.getOptionlist('estado');


  private action = "";

  private fireEvent: UpdateEvent;

	public type: string;
	public slug: string;
	public observacion: string;
	public isTramitacionMAB: boolean;
	public expedidopor: string;
	public fechaexpe: string;
	public tramitacionURL: string;
	public tramitacionNro: string;
	public fechavigencia: string;
	public fechavigencia_ts: number;
	public estado: string;



  constructor(
    private empCtrl: EmpresasController,
  	) { 

	}



  ngOnInit() {
  	let typeList = this.isHabilitacion ? 'habilitacion' : 'documentos';
  	this.type =   CensoIndustriasService.getOptionLabel(typeList, this.token.type);


  	this.estado = CensoIndustriasService.getOptionLabel('estado', this.token.estado);

  	this.observacion =      this.token.observacion;
		this.isTramitacionMAB = this.token.isTramitacionMAB;
		this.expedidopor =      this.token.expedidopor;
		this.fechaexpe =        this.token.fechaexpe;
		this.tramitacionURL =   this.token.tramitacionURL;
		this.tramitacionNro =   this.token.tramitacionNro;
		this.fechavigencia =    this.token.fechavigencia;
		this.fechavigencia_ts = this.token.fechavigencia_ts;

  }


  emitEvent(action:string){
  	this.updateToken.next({
  		action:  action,
  		token:   TOKEN_TYPE,
  		payload: this.token
  	});

  }



}
