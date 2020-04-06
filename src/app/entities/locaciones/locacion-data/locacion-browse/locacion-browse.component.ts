import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { devutils }from '../../../../develar-commons/utils'
import { LocacionHospitalaria, LocacionHospTable, LocacionHospBrowse, LocacionEvent} from '../../locacion.model';

import { LocacionHelper } from '../../locacion.helper';
import { LocacionService } from '../../locacion.service';

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'locacion-browse',
  templateUrl: './locacion-browse.component.html',
  styleUrls: ['./locacion-browse.component.scss']
})
export class LocacionBrowseComponent implements OnInit {
	@Input() query: LocacionHospBrowse = new LocacionHospBrowse();
	@Output() updateQuery = new EventEmitter<LocacionHospBrowse>();

  public hospitalOL =  LocacionHelper.getOptionlist('hospital');

	public form: FormGroup;

  private formAction = "";

  private fireEvent: LocacionHospBrowse;

  constructor(
	    private locSrv: LocacionService,
	  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}


  ngOnInit() {

    this.query = this.locSrv.locacionesSelector;
  	this.initForEdit(this.form, this.query);

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

  private emitEvent(action:string){
  	this.query.searchAction = action;
  	this.updateQuery.next(this.query);
  }

  changeSelectionValue(type, val){
  }

 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      code:         [null],
      slug:         [null],
      type:         [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, query: LocacionHospBrowse): FormGroup {
		form.reset({
        code:      query.code,
        slug:      query.slug,
        type:      query.type,

		});

		return form;
  }


	initForSave(form: FormGroup, query: LocacionHospBrowse): LocacionHospBrowse {
		const fvalue = form.value;
		const entity = query;

    entity.slug =  fvalue.slug;
    entity.code =  fvalue.code;
    entity.type =  fvalue.type;

		return entity;
	}

}
