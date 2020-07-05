import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { CustomValidators } from 'ng2-validation';

import { devutils }from '../../../../develar-commons/utils'

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Pcultural, PculturalBrowse, PculturalHelper } from '../../pcultural.model';
import { Person, personModel } from '../../../../entities/person/person';


const TOKEN_TYPE = 'pcultural';
const CANCEL = 'cancel';
const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'pcultural-browse',
  templateUrl: './pcultural-browse.component.html',
  styleUrls: ['./pcultural-browse.component.scss']
})
export class PculturalBrowseComponent implements OnInit {
	@Input() query: PculturalBrowse = new PculturalBrowse();
	@Output() updateQuery = new EventEmitter<PculturalBrowse>();

  public sectorOptList =    PculturalHelper.getOptionlist('sector');
  public formatoOptList =   PculturalHelper.getOptionlist('formato');
  public programaOptList =  PculturalHelper.getOptionlist('programa');
  public publicoOptList =   PculturalHelper.getOptionlist('publico');
  public avanceOptList =    PculturalHelper.getOptionlist('avance');
  public estadoOptList =    PculturalHelper.getOptionlist('estado');

  public typeOptList =      PculturalHelper.getOptionlist('type');
  public stypeOptList =     [];
  public stypeOptMap =      PculturalHelper.getSubTypeMap();

  public sedeOptList =      PculturalHelper.getOptionlist('sede');
  public locacionOptList =  [];
  public locacionOptMap =   PculturalHelper.getLocacionMap();

	public form: FormGroup;
  public currentPerson: Person;


  private formAction = "";
  private fireEvent: PculturalBrowse;
  public usersOptList;

  public isEncuesta = false;

  constructor(
    private dsCtrl: SisplanController,
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}


  ngOnInit() {

    this.query = this.dsCtrl.pculturalesSelector;
  	this.initForEdit(this.form, this.query);
    this.usersOptList = this.dsCtrl.buildEncuestadoresOptList();

  }

  onSubmit(action){
  	this.initForSave(this.form, this.query);
  	this.formAction = action;
  	this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }

  showMap(action){
    //this.mapRequest.emit(action);

  }


  emitEvent(action:string){
  	this.query.searchAction = action;
  	this.updateQuery.next(this.query);
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


  personFetched(person:Person){
    this.currentPerson = person;
  }

  deSelectPerson(e:MatCheckboxChange){
    delete this.currentPerson;
    delete this.query.personId;
  }

 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      compPrefix:   [{value: "", disabled: true}],
      compName:     [{value: "", disabled: true}],
      compNum_d:    [null],
      compNum_h:    [null],
      sector:       [null],
			type:         [null],
			stype:        [null],
			programa:     [null],
			formato:      [null],
			publico:      [null],
			sede:         [null],
			locacion:     [null],
			fecomp_d:     [null],
			fecomp_h:     [null],
      avance:       [null],
      estado:       [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, query: PculturalBrowse): FormGroup {
    if(query.type) this.changeStypeOptList(query.type);
    if(query.sede) this.changeLocacionOptList(query.sede);

		form.reset({
        compPrefix:  query.compPrefix,
        compName:    query.compName,
        compNum_d:   query.compNum_d,
        compNum_h:   query.compNum_h,

        fecomp_d:     query.fecomp_d,
        fecomp_h:     query.fecomp_h,

        type:         query.type,
        stype:        query.stype,

        sector:         query.sector,
        programa:     query.programa,
        formato:      query.formato,
        publico:      query.publico,
        sede:         query.sede,
        locacion:     query.locacion,

        estado:       query.estado,
        avance:       query.avance,

		});

    if(query.personId && !this.currentPerson) {
      this.dsCtrl.fetchPersonById(query.personId).then(p => {
        this.currentPerson = p;
      })
    }

		return form;
  }


	initForSave(form: FormGroup, query: PculturalBrowse): PculturalBrowse {
		const fvalue = form.value;
		const entity = query;
    let dateD = devutils.dateFromTx(fvalue.fecomp_d);
    let dateH = devutils.dateFromTx(fvalue.fecomp_h);

    entity.compPrefix =  fvalue.compPrefix;
    entity.compName =    fvalue.compName;

    entity.compNum_d =   fvalue.compNum_d;
    entity.compNum_h =   fvalue.compNum_h;

    entity.fecomp_d =   fvalue.fecomp_d;
    entity.fecomp_h =   fvalue.fecomp_h;

    entity.fecomp_ts_d = dateD ? dateD.getTime() : null;
    entity.fecomp_ts_h = dateH ? dateH.getTime() : null;


		entity.sector =     fvalue.sector;
		entity.type =       fvalue.type;
		entity.stype =      fvalue.stype;
		entity.programa =   fvalue.programa;
		entity.formato =    fvalue.formato;
		entity.publico =    fvalue.publico;
		entity.sede =       fvalue.sede;
    entity.locacion =   fvalue.locacion;
    entity.estado =     fvalue.estado;
    entity.avance =     fvalue.avance;


    if(this.currentPerson){
      entity.personId = this.currentPerson._id;

      // this.dsCtrl.fetchPersonById(entity.personId).then(p => {
      //   this.dsCtrl.updateCurrentPerson(p);
      // })

    }else {
      delete entity.personId;
    }

    //Save Actual Data in Controller
    this.dsCtrl.pculturalesSelector = entity;
		return entity;
	}

}
