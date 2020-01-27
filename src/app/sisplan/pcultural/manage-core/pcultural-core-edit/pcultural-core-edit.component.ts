import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { SisplanController } from '../../../sisplan.controller';

import { UpdateEvent } from '../../../sisplan.service';

import { Pcultural, PculturalHelper } from '../../pcultural.model';

import { devutils }from '../../../../develar-commons/utils'


const TOKEN_TYPE = 'pcultural';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';


@Component({
  selector: 'pcultural-core-edit',
  templateUrl: './pcultural-core-edit.component.html',
  styleUrls: ['./pcultural-core-edit.component.scss']
})
export class PculturalCoreEditComponent implements OnInit {
  @Input() pcultural: Pcultural = new Pcultural();
  @Output() updatePcultural = new EventEmitter<UpdateEvent>();

  public sectorOptList =    PculturalHelper.getOptionlist('sector');
  public formatoOptList =   PculturalHelper.getOptionlist('formato');
  public programaOptList =  PculturalHelper.getOptionlist('programa');
  public publicoOptList =   PculturalHelper.getOptionlist('publico');

  public typeOptList =      PculturalHelper.getOptionlist('type');
  public stypeOptList =     [];
  public stypeOptMap =      PculturalHelper.getSubTypeMap();

  public sedeOptList =      PculturalHelper.getOptionlist('sede');
  public locacionOptList =  [];
  public locacionOptMap =   PculturalHelper.getLocacionMap();


	public form: FormGroup;
  private formAction = "";
  private event: UpdateEvent;



  constructor(
  	private fb:     FormBuilder,
    private dsCtrl: SisplanController,
    private route:  ActivatedRoute,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
  	this.initForEdit(this.form, this.pcultural);

  }

  onSubmit(){
  	this.initForSave(this.form, this.pcultural);
  	this.formAction = UPDATE;
  	this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }

  deleteToken(){
    this.formAction = DELETE;
    this.emitEvent(this.formAction);

  }

  emitEvent(action:string){
    console.log('todo');

    let event = {
      action: action,
      token: 'core',
      payload: this.pcultural
    } as UpdateEvent;

    this.updatePcultural.next(event)

  }

  changeSelectionValue(type, val){
    if(type === 'type'){
      this.changeStypeOptList(val);
    }

    if(type === 'sede'){
      this.changeLocacionOptList(val);
    }

  }

  private changeStypeOptList(parent: string){
      this.stypeOptList = this.stypeOptMap[parent] || [];

      if(this.stypeOptList.length === 1){
        this.form.get('stype').setValue(this.stypeOptList[0].val);

      }

  }

  private changeLocacionOptList(parent: string){
      this.locacionOptList = this.locacionOptMap[parent] || [];

      if(this.locacionOptList.length === 1){
        this.form.get('locacion').setValue(this.locacionOptList[0].val);

      }

  }

 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			slug:        [null, Validators.compose([Validators.required])],
      description: [null],

      programa:    [null, Validators.compose([Validators.required])],
      type:        [null, Validators.compose([Validators.required])],
      stype:       [null, Validators.compose([Validators.required])],

			publico:     [null],
			formato:     [null],

      sector:      [null, Validators.compose([Validators.required])],
			sede:        [null],
			locacion:    [null],


    });

    return form;
  }

  initForEdit(form: FormGroup, pcultural: Pcultural): FormGroup {
    this.changeStypeOptList(pcultural.type);
    this.changeLocacionOptList(pcultural.sede);

		form.reset({
			slug:        pcultural.slug,
      description: pcultural.description,

      programa:    pcultural.programa,
			type:        pcultural.type,
			stype:       pcultural.stype,

			formato:     pcultural.formato,
      publico:     pcultural.publico,

      sector:      pcultural.sector,
			sede:        pcultural.sede,
			locacion:    pcultural.locacion,

		});



    // this.actionOptList = this.sectorActionRelation[pcultural.sector] || [];
    // this.buildNovedades(pcultural.novedades)

		return form;
  }

 
	initForSave(form: FormGroup, pcultural: Pcultural): Pcultural {
		const fvalue = form.value;
		const entity = pcultural;

    entity.slug =  fvalue.slug;
		entity.description =  fvalue.description;

    entity.programa =       fvalue.programa;
    entity.type =       fvalue.type;
    entity.stype =       fvalue.stype;

    entity.formato =       fvalue.formato;
    entity.publico =       fvalue.publico;
    entity.sector =       fvalue.sector;

    entity.sede =       fvalue.sede;
    entity.locacion =       fvalue.locacion;


		return entity;
	}


}
