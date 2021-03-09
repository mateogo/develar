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
  selector: 'empresa-documentos-edit',
  templateUrl: './empresa-documentos-edit.component.html',
  styleUrls: ['./empresa-documentos-edit.component.scss']
})
export class EmpresaDocumentosEditComponent implements OnInit {
	@Input() token: DocumentData;
  @Input() isHabilitacion = false;
	@Output() updateToken = new EventEmitter<UpdateEvent>();

	public form: FormGroup;

  public documentos = CensoIndustriasService.getOptionlist('documentos');
	public estados = CensoIndustriasService.getOptionlist('estadoHabilitacion');

  public personError = false;
  public personErrorMsg = '';


  // private provincias = personModel.provincias;
  // private addTypes   = personModel.addressTypes;
  // private paises     = personModel.paises;


  private action = "";

  private fireEvent: UpdateEvent;

  //ver si queda
  public imageList: CardGraph[] = [];
  public addImageToList = new Subject<CardGraph>();


  constructor(
  	private fb: FormBuilder,
    private empCtrl: EmpresasController,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
  	this.initForEdit(this.form, this.token);
    if(this.isHabilitacion){
      this.documentos = CensoIndustriasService.getOptionlist('habilitacion');

    }else {
      this.documentos = CensoIndustriasService.getOptionlist('documentos');

    }
  }

  onSubmit(){
  	this.action = UPDATE;
  	this.initForSave(this.form, this.token);

  	this.emitEvent(this.action);
  }

  onCancel(){
  	this.action = CANCEL;
  	this.emitEvent(this.action);
  }

  deleteToken(){
    this.action = DELETE;
    this.emitEvent(this.action);

  }


  emitEvent(action:string){
    console.log('Update/Delete')
  	this.updateToken.next({
  		action:  action,
  		token:   TOKEN_TYPE,
  		payload: this.token
  	});

  }

  hasError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }
 

  changeSelectionValue(type, val){
  }
 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      type:             [null, [Validators.required ]],
      slug:             [null],
      observacion:      [null],
      isTramitacionMAB: [null],
      feInicioActividades: [null],
      expedidopor:      [null],
      fechaexpe:        [null],
      tramitacionNro:   [null],
      tramitacionURL:   [null],
      fechavigencia:    [null],
      estado:           [null],

    });
    return form;
  }

  initForEdit(form: FormGroup, token: DocumentData): FormGroup {
		form.reset({
			type:             token.type,
			slug:             token.slug,
      observacion:      token.observacion,
      feInicioActividades: token.feInicioActividades,
			isTramitacionMAB: token.isTramitacionMAB,
			expedidopor:      token.expedidopor,
			fechaexpe:        token.fechaexpe,
			tramitacionNro:   token.tramitacionNro,
			tramitacionURL:   token.tramitacionURL,
			fechavigencia:    token.fechavigencia,
			estado:           token.estado,
		});

		return form;
  }

	initForSave(form: FormGroup, token: DocumentData): DocumentData {
		const fvalue = form.value;
		const entity = token; 

		entity.type =             fvalue.type;
		entity.slug =             fvalue.slug;
    entity.observacion =      fvalue.observacion;
    //entity.feInicioActividades = fvalue.feInicioActividades;
		//entity.isTramitacionMAB = fvalue.isTramitacionMAB;
		//entity.expedidopor =      fvalue.expedidopor;
		entity.fechaexpe =        fvalue.fechaexpe;
		entity.tramitacionNro =   fvalue.tramitacionNro;
		//entity.tramitacionURL =   fvalue.tramitacionURL;
		//entity.fechavigencia =    fvalue.fechavigencia;
		entity.estado =           fvalue.estado;

    entity.type = 'habilitacion';
    entity.slug = 'Habilitación Municipal';
    entity.isTramitacionMAB = true;
    entity.expedidopor = 'MAB';
    entity.fechavigencia = entity.fechaexpe;
    entity.fechavigencia_ts = 0;
    if(entity.fechavigencia){
      entity.fechavigencia_ts = devutils.dateNumFromTx(entity.fechavigencia);
    }
    entity.tramitacionURL = '';

		return entity;
	}


  createCardGraphFromImage(image){
    let card = graphUtilities.cardGraphFromAsset('image', image, 'mainimage');
    this.addImageToList.next(card);
  }


  loadRelatedImages(assets: CardGraph[]) {
    if(!assets.length){
      this.imageList = [];

    }else{      
      this.imageList = graphUtilities.buildGraphList('image', assets);
    }
  }



}
