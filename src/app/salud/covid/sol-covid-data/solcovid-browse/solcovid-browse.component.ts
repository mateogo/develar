import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';

import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';
import { AsistenciaBrowse,  AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'solcovid-browse',
  templateUrl: './solcovid-browse.component.html',
  styleUrls: ['./solcovid-browse.component.scss']
})
export class SolcovidBrowseComponent implements OnInit {
	@Input() query: AsistenciaBrowse = new AsistenciaBrowse();
	@Output() updateQuery = new EventEmitter<AsistenciaBrowse>();
  @Output() mapRequest = new EventEmitter<string>();

  public actionOptList =  AsistenciaHelper.getOptionlist('actions');
  public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  public encuestaOptList = AsistenciaHelper.getOptionlist('encuesta');
  public urgenciaOptList =  AsistenciaHelper.getOptionlist('urgencia');
  public nextStepOptList =  AsistenciaHelper.getOptionlist('avance');

  public ciudadesList =   personModel.ciudades;
  public barrioList = [];

	public form: FormGroup;
  public currentPerson: Person;


  private formAction = "";
  private fireEvent: AsistenciaBrowse;
  public usersOptList;

  public isEncuesta = false;

  constructor(
    private dsCtrl: SaludController,
  	private fb: FormBuilder,
  	) { 
	}


  ngOnInit() {
    this.sectorOptList.push(
       {val: 'no_definido', type:'Sin selección',  label: 'Sin selección' }
     );

    this.query = this.dsCtrl.asistenciasSelector;

  }

	buttonActionEvent(e, step){
  	this.formAction = SEARCH;
  	this.query = new AsistenciaBrowse();
  	this.query.avance = step.val;
  	this.emitEvent(this.formAction);
	}

  onSubmit(action){
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


}

