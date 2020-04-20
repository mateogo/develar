import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';

import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../entities/person/person';
import { VigilanciaBrowse,  AsistenciaHelper } from '../../asistencia/asistencia.model';

import { SaludController } from '../../salud.controller';

import { devutils }from '../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'vigilancia-browse',
  templateUrl: './vigilancia-browse.component.html',
  styleUrls: ['./vigilancia-browse.component.scss']
})
export class VigilanciaBrowseComponent implements OnInit {
	@Input() query: VigilanciaBrowse = new VigilanciaBrowse();
	@Output() updateQuery = new EventEmitter<VigilanciaBrowse>();
  @Output() mapRequest = new EventEmitter<string>();

  public actionOptList =  AsistenciaHelper.getOptionlist('actions');
  public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  public encuestaOptList = AsistenciaHelper.getOptionlist('encuesta');
  public urgenciaOptList =  AsistenciaHelper.getOptionlist('urgencia');

  public ciudadesList =   personModel.ciudades;
  public barrioList = [];

	public form: FormGroup;
  public currentPerson: Person;


  private formAction = "";
  private fireEvent: VigilanciaBrowse;
  public usersOptList;

  public isEncuesta = false;

  constructor(
    private dsCtrl: SaludController,
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}


  ngOnInit() {
    this.sectorOptList.push(
       {val: 'no_definido', type:'Sin selección',  label: 'Sin selección' }
     );

    this.query = this.dsCtrl.vigilanciaSelector;
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
    this.mapRequest.emit(action);

  }


  emitEvent(action:string){
  	this.query.searchAction = action;
  	this.updateQuery.next(this.query);
  }

  changeSelectionValue(type, val){
    if(type === 'action' && val !== "encuesta"){
      this.isEncuesta = false;
    }
    
    if(type==="action" && val==="encuesta"){
      if(!this.usersOptList || !this.usersOptList.length) this.usersOptList = this.dsCtrl.buildEncuestadoresOptList();
      this.isEncuesta = true;
    }
  }

  personFetched(person:Person){
    this.currentPerson = person;
  }

  deSelectPerson(e:MatCheckboxChange){
    delete this.currentPerson;
    delete this.query.requirenteId;
  }


  viewPanelsSelection(e){
    if(!(e && e.value && e.value.length)) return;
    this.query['viewList'] = e.value
  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      compPrefix:   [{value: "", disabled: true}],
      compName:     [{value: "", disabled: true}],
      compNum_d:    [null],
      compNum_h:    [null],
      isVigilado:   [null],

    });

    return form;
  }

  initForEdit(form: FormGroup, query: VigilanciaBrowse): FormGroup {
    console.log('initfor Edit[%s]', query.isVigilado);
		form.reset({
        compPrefix:  query.compPrefix,
        compName:    query.compName,
        compNum_d:   query.compNum_d,
        compNum_h:   query.compNum_h,

        isVigilado: query.isVigilado,

		});

    if(query.requirenteId && !this.currentPerson) {
      this.dsCtrl.fetchPersonById(query.requirenteId).then(p => {
        this.currentPerson = p;
      })
    }

		return form;
  }

  changeCity() {
      this.barrioList = personModel.getBarrioList(this.form.value.city);
  }

	initForSave(form: FormGroup, query: VigilanciaBrowse): VigilanciaBrowse {
		const fvalue = form.value;
		const entity = query;
    let dateD = devutils.dateFromTx(fvalue.fecomp_d);
    let dateH = devutils.dateFromTx(fvalue.fecomp_h);

    entity.compPrefix =  fvalue.compPrefix;
    entity.compName =    fvalue.compName;

    entity.compNum_d =   fvalue.compNum_d;
    entity.compNum_h =   fvalue.compNum_h;

    entity.isVigilado =   fvalue.isVigilado;

    if(this.currentPerson){
      entity.requirenteId = this.currentPerson._id;

      this.dsCtrl.fetchPersonById(entity.requirenteId).then(p => {
        this.dsCtrl.updateCurrentPerson(p);
      })

    }else {
      delete entity.requirenteId;
    }

    //Save Actual Data in Controller
    this.dsCtrl.vigilanciaSelector = entity;
		return entity;
	}

}

