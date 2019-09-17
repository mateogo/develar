import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';
import { AsistenciaBrowse,  AsistenciaHelper } from '../../asistencia.model';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const SEARCH = 'search';


@Component({
  selector: 'solasis-browse',
  templateUrl: './solasis-browse.component.html',
  styleUrls: ['./solasis-browse.component.scss']
})
export class SolasisBrowseComponent implements OnInit {
	@Input() query: AsistenciaBrowse = new AsistenciaBrowse();
	@Output() updateQuery = new EventEmitter<AsistenciaBrowse>();

  public actionOptList =  AsistenciaHelper.getOptionlist('actions');
  public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');
	public form: FormGroup;


  private formAction = "";
  private fireEvent: AsistenciaBrowse;

  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
  	this.initForEdit(this.form, this.query);

  }

  onSubmit(){
  	this.initForSave(this.form, this.query);
  	this.formAction = SEARCH;
  	this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }

  emitEvent(action:string){
  	
  	this.query.searchAction = action;
  	this.updateQuery.next(this.query);

  }

  changeSelectionValue(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      compPrefix:   [{value: "", disabled: true}],
      compName:     [{value: "", disabled: true}],
      compNum_d:    [null],
      compNum_h:    [null],
      sector:       [null],
			action:       [null],
			fecomp_d:     [null],
			fecomp_h:     [null],
      avance:       [null],
      estado:       [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, query: AsistenciaBrowse): FormGroup {
		form.reset({
        compPrefix:  query.compPrefix,
        compName:    query.compName,
        compNum_d:   query.compNum_d,
        compNum_h:   query.compNum_h,

        fecomp_d:     query.fecomp_d,
        fecomp_h:     query.fecomp_h,

        action:      query.action,
        sector:      query.sector,
        estado:      query.estado,
        avance:      query.avance
		});

		return form;
  }

	initForSave(form: FormGroup, query: AsistenciaBrowse): AsistenciaBrowse {
		const fvalue = form.value;
		const entity = query;
    entity.compPrefix =  fvalue.compPrefix;
    entity.compName =    fvalue.compName;

    entity.compNum_d =   fvalue.compNum_d;
    entity.compNum_h =   fvalue.compNum_h;

    entity.fecomp_d =   fvalue.fecomp_d;
    entity.fecomp_h =   fvalue.fecomp_h;

    if(entity.fecomp_d){
      entity.fecomp_ts_d = devutils.dateFromTx(fvalue.fecomp_d).getTime();
    } else {
      entity.fecomp_ts_d = null;
    }

    if(entity.fecomp_h){
      entity.fecomp_ts_h = devutils.dateFromTx(fvalue.fecomp_h).getTime();
    } else {
      entity.fecomp_ts_h = null;
    }

		entity.action =       fvalue.action;
    entity.sector =       fvalue.sector;
    entity.estado =       fvalue.estado;
    entity.avance =       fvalue.avance;


		return entity;
	}

}
