import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';

import { CustomValidators } from 'ng2-validation';

import { devutils }from '../../../../develar-commons/utils'

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

//import { Pcultural, PculturalBrowse } from '../../../pcultural/pcultural.model';
import { Person, personModel } from '../../../../entities/person/person';

import { Budget, BudgetBrowse, BudgetHelper       } from '../../presupuesto.model';


const TOKEN_TYPE = 'budget';
const CANCEL = 'cancel';
const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'budget-browse',
  templateUrl: './budget-browse.component.html',
  styleUrls: ['./budget-browse.component.scss']
})
export class BudgetBrowseComponent implements OnInit {
	@Input() query: BudgetBrowse = new BudgetBrowse();
	@Output() updateQuery = new EventEmitter<BudgetBrowse>();

  public sectorOptList =    SisplanService.getOptionlist('sector');
  public programaOptList =  SisplanService.getOptionlist('programa');
  public avanceOptList =    SisplanService.getOptionlist('avance');
  public estadoOptList =    SisplanService.getOptionlist('estado');

  public umeOptList =       SisplanService.getOptionlist('ume');
  public fumeOptList =      SisplanService.getOptionlist('fume');

  public typeOptList =      SisplanService.getOptionlist('type');
  public stypeOptList =     [];
  public stypeOptMap =      SisplanService.getSubTypeMap();

  public sedeOptList =      SisplanService.getOptionlist('sede');
  public locacionOptList =  [];
  public locacionOptMap =   SisplanService.getLocacionMap();

	public form: FormGroup;
  public currentPerson: Person;


  private formAction = "";
  private fireEvent: BudgetBrowse;
  public usersOptList;

  public isEncuesta = false;

  constructor(
    private dsCtrl: SisplanController,
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}


  ngOnInit() {

    this.query = this.dsCtrl.budgetsSelector;
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
			sede:         [null],
			locacion:     [null],
			fe_req_d:     [null],
			fe_req_h:     [null],
      avance:       [null],
      estado:       [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, query: BudgetBrowse): FormGroup {
    if(query.type) this.changeStypeOptList(query.type);
    if(query.sede) this.changeLocacionOptList(query.sede);

		form.reset({
        compPrefix:  query.compPrefix,
        compName:    query.compName,
        compNum_d:   query.compNum_d,
        compNum_h:   query.compNum_h,

        fe_req_d:     query.fe_req_d,
        fe_req_h:     query.fe_req_h,

        type:         query.type,
        stype:        query.stype,

        sector:         query.sector,
        programa:     query.programa,
        sede:         query.sede,
        locacion:     query.locacion,

        estado:       query.estado,
        avance:       query.avance,

		});

    // if(query.personId && !this.currentPerson) {
    //   this.dsCtrl.fetchPersonById(query.personId).then(p => {
    //     this.currentPerson = p;
    //   })
    // }

		return form;
  }


	initForSave(form: FormGroup, query: BudgetBrowse): BudgetBrowse {
		const fvalue = form.value;
		const entity = query;
    let dateD = devutils.dateFromTx(fvalue.fe_req_d);
    let dateH = devutils.dateFromTx(fvalue.fe_req_h);

    entity.compPrefix =  fvalue.compPrefix;
    entity.compName =    fvalue.compName;

    entity.compNum_d =   fvalue.compNum_d;
    entity.compNum_h =   fvalue.compNum_h;

    entity.fe_req_d =   fvalue.fe_req_d;
    entity.fe_req_h =   fvalue.fe_req_h;

    entity.fe_req_ts_d = dateD ? dateD.getTime() : null;
    entity.fe_req_ts_h = dateH ? dateH.getTime() : null;


		entity.sector =     fvalue.sector;
		entity.type =       fvalue.type;
		entity.stype =      fvalue.stype;
		entity.programa =   fvalue.programa;
		entity.sede =       fvalue.sede;
    entity.locacion =   fvalue.locacion;
    entity.estado =     fvalue.estado;
    entity.avance =     fvalue.avance;


    if(this.currentPerson){
      //entity.personId = this.currentPerson._id;

      // this.dsCtrl.fetchPersonById(entity.personId).then(p => {
      //   this.dsCtrl.updateCurrentPerson(p);
      // })

    }else {
      //delete entity.personId;
    }

    //Save Actual Data in Controller
    this.dsCtrl.budgetsSelector = entity;
		return entity;
	}

}

