import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import {UpdateCoberturaEvent, CoberturaData, personModel } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'cobertura';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';


@Component({
  selector: 'cobertura-edit',
  templateUrl: './cobertura-data-edit.component.html',
  styleUrls: ['./cobertura-data-edit.component.scss']
})
export class CoberturaDataEditComponent implements OnInit {


  @Input() token: CoberturaData;
  @Output() updateToken = new EventEmitter<UpdateCoberturaEvent>();

  public form: FormGroup;

  public coberturaTiposOptList      = personModel.coberturaTypeList;
  public coberturaSubTiposOptList   = personModel.getCoberturaSubTypeList('ingreso');

  public coberturaSubList = [];
  public estados          = personModel.coberturaOptList;


  private action = "";
  private fireEvent: UpdateCoberturaEvent;

  constructor(
    private fb: FormBuilder,
    ) { 
      this.form = this.buildForm();
  }



  ngOnInit() {
    this.initForEdit(this.form, this.token);

  }

  onSubmit(){
    this.initForSave(this.form, this.token);
    this.action = UPDATE;
    this.emitEvent(this.action);
  }

  deleteToken(){
    this.action = DELETE;
    this.emitEvent(this.action);

  }

  onCancel(){
    this.action = CANCEL;
    this.emitEvent(this.action);
  }

  emitEvent(action:string){
    this.updateToken.next({
      action: action,
      type: TOKEN_TYPE,
      token: this.token
    });

  }

  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }

  changeCobertura(){
    this.coberturaSubList = personModel.getCoberturaSubTypeList(this.form.value.type);
  }
 
  buildForm(): FormGroup{
    let form: FormGroup;

    form = this.fb.group({
      type:        [null, Validators.compose( [Validators.required])],
      tingreso:    [null, Validators.compose( [Validators.required])],
      slug:        [null],
      fecha:       [null],
      estado:      [null],
      monto:       [null],
      observacion: [null],
    });
    return form;
  }

  initForEdit(form: FormGroup, token: CoberturaData): FormGroup {
    form.reset({
      type:       token.type,
      tingreso:   token.tingreso,
      slug:       token.slug,
      fecha:      token.fecha,
      estado:     token.estado,
      monto:      token.monto,
      observacion: token.observacion,
    });
    this.coberturaSubList = personModel.getCoberturaSubTypeList(token.type)

    return form;
  }

  initForSave(form: FormGroup, token: CoberturaData): CoberturaData {
    const entity = token;
    let   fvalue = form.value;
    let   fecha_date =  devutils.dateFromTx(fvalue.fecha);

    if(fecha_date){
      entity.fecha = devutils.txFromDate(fecha_date);
      entity.fe_ts = fecha_date.getTime();

    }else {
      entity.fecha = ''
      entity.fe_ts = 0
    }


    entity.type =      fvalue.type;
    entity.tingreso =  fvalue.tingreso;
    entity.slug =      fvalue.slug;
    entity.estado =    fvalue.estado;
    entity.monto =     fvalue.monto;
    entity.observacion = fvalue.observacion;
    return entity;
  }
  
}