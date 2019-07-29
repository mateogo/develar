
import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import {UpdateSaludEvent, SaludData, personModel } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'salud';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'salud-edit',
  templateUrl: './salud-data-edit.component.html',
  styleUrls: ['./salud-data-edit.component.scss']
})
export class SaludDataEditComponent implements OnInit {


  @Input() token: SaludData;
  @Output() updateToken = new EventEmitter<UpdateSaludEvent>();

  public form: FormGroup;

  public saludTiposOptList      = personModel.saludTypeList;
  public saludSubTiposOptList   = personModel.getSaludSubTypeList('enfermedad');
  public saludSubList = []
  

  private action = "";
  private fireEvent: UpdateSaludEvent;

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

  changeTokenType(){
    this.saludSubList = personModel.getSaludSubTypeList(this.form.value.type);

  }
  
  changeSelectionValue(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
  }
 
  buildForm(): FormGroup{
    let form: FormGroup;

    form = this.fb.group({
      type:        [null],
      tproblema:   [null],
      problema:    [null],
      lugaratencion: [null],
      slug:         [null],
    });
    return form;
  }

  initForEdit(form: FormGroup, token: SaludData): FormGroup {
    form.reset({
      type:        token.type,
      tproblema:   token.tproblema,
      problema:    token.problema,
      lugaratencion: token.lugaratencion,
      slug:        token.slug,
    });

    this.saludSubList = personModel.getSaludSubTypeList(token.type);

    return form;
  }

  initForSave(form: FormGroup, token: SaludData): SaludData {
    const fvalue = form.value;
    const entity = token; 

    entity.type =        fvalue.type;
    entity.tproblema =   fvalue.tproblema;
    entity.problema =    fvalue.problema;
    entity.lugaratencion = fvalue.lugaratencion;
    entity.slug =        fvalue.slug;
    return entity;
  }

}