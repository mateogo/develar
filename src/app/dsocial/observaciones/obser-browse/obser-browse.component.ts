import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { Person, personModel } from '../../../entities/person/person';
import { AsistenciaHelper } from '../../asistencia/asistencia.model';

import { DsocialController } from '../../dsocial.controller';
import { ObservacionBrowse } from '../../../develar-commons/observaciones/observaciones.model';
import { ObservacionesHelper } from '../../../develar-commons/observaciones/observaciones.helper';

import { devutils }from '../../../develar-commons/utils'

const CANCEL = 'cancel';
const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'obser-browse',
  templateUrl: './obser-browse.component.html',
  styleUrls: ['./obser-browse.component.scss']
})
export class ObserBrowseComponent implements OnInit {
	@Input() query: ObservacionBrowse = new ObservacionBrowse();
	@Output() updateQuery = new EventEmitter<ObservacionBrowse>();
  @Output() mapRequest = new EventEmitter<string>();

  public typeOptList =  ObservacionesHelper.getOptionlist('type');

  // public actionOptList =  AsistenciaHelper.getOptionlist('actions');
  // public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  // public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  // public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  // public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  // public encuestaOptList = AsistenciaHelper.getOptionlist('encuesta');
  // public urgenciaOptList =  AsistenciaHelper.getOptionlist('urgencia');

	public form: FormGroup;


  private formAction = "";

  public isEncuesta = false;

  constructor(
    private dsCtrl: DsocialController,
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}


  ngOnInit() {

    this.query = this.dsCtrl.observacionesSelector;
  	this.initForEdit(this.form, this.query);

  }

  onSubmit(formaction){
  	this.initForSave(this.form, this.query);
  	this.formAction = formaction;
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

  }

 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      slug:         [null],
			type:         [null],
			fed:          [null],
			feh:          [null],
      action:       [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, query: ObservacionBrowse): FormGroup {
		form.reset({
      slug:        query.slug,
			type:        query.type,
			fed:         query.fed,
			feh:         query.feh,
      action:      query.action,
		});

		return form;
  }


	initForSave(form: FormGroup, query: ObservacionBrowse): ObservacionBrowse {
		const fvalue = form.value;
		const entity = query;
    let dateD = devutils.dateFromTx(fvalue.fecomp_d);
    let dateH = devutils.dateFromTx(fvalue.fecomp_h);


    entity.slug =        fvalue.slug;
    entity.type =        fvalue.type;
    entity.fed =         devutils.txFromDate(dateD);
    entity.feh =         devutils.txFromDate(dateH);
    entity.action =      fvalue.action;

		return entity;
	}
}

