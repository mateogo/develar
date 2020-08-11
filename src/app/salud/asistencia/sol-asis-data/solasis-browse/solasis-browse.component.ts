import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';
import { VigilanciaBrowse,  AsistenciaHelper } from '../../asistencia.model';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'solasis-browse',
  templateUrl: './solasis-browse.component.html',
  styleUrls: ['./solasis-browse.component.scss']
})
export class SolasisBrowseComponent implements OnInit {
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
    this.query.isVigilado = false;

    this.initForEdit(this.form, this.query);

    //this.query = this.dsCtrl.asistenciasSelector;
    //this.usersOptList = this.dsCtrl.buildEncuestadoresOptList();
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

  }

  personFetched(person:Person){
    this.currentPerson = person;
  }

  deSelectPerson(e:MatCheckboxChange){
    delete this.currentPerson;
    delete this.query.requirenteId;
  }

 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      compPrefix:   [{value: "", disabled: true}],
      compName:     [{value: "", disabled: true}],
      isVigilado:   [null],
      compNum_d:    [null],
      compNum_h:    [null],
      sector:       [null],
			action:       [null],
			fecomp_d:     [null],
			fecomp_h:     [null],
      fenovd:       [null],
      fenovh:       [null],
      avance:       [null],
      estado:       [null],
      fe_visita:    [null],
      ruta:         [null],
      barrio:       [null],
      city:         [null],
      urgencia:     [null],
      trabajadorId: [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, query: VigilanciaBrowse): FormGroup {
		form.reset({
        compPrefix:  query.compPrefix,
        compName:    query.compName,
        compNum_d:   query.compNum_d,
        compNum_h:   query.compNum_h,

        fecomp_d:     query.fecomp_d,
        fecomp_h:     query.fecomp_h,
        fenovd:     query.fenovd,
        fenovh:     query.fenovh,

        isVigilado: query.isVigilado,

        action:      query.action,
        sector:      query.sector,
        avance:      query.avance,
        estado:      query.estado,
        city:        query.city,
        barrio:      query.barrio,

		});

    if(query.requirenteId && !this.currentPerson) {
      this.dsCtrl.fetchPersonById(query.requirenteId).then(p => {
        this.currentPerson = p;
      })
    }

    this.barrioList = personModel.getBarrioList(query.city);
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

    entity.fecomp_d =   fvalue.fecomp_d;
    entity.fecomp_h =   fvalue.fecomp_h;

    entity.fenovd =   fvalue.fenovd;
    entity.fenovh =   fvalue.fenovh;

    entity.fenovd_ts =   devutils.dateNumFromTx(fvalue.fenovd);
    entity.fenovh_ts =   devutils.dateNumPlusOneFromTx(fvalue.fenovh);

    entity.fecomp_ts_d = dateD ? dateD.getTime() : null;
    entity.fecomp_ts_h = dateH ? dateH.getTime() : null;

    entity.isVigilado =   fvalue.isVigilado;

		entity.action =       fvalue.action;
    entity.sector =       fvalue.sector;
    entity.avance =       fvalue.avance;
    entity.estado =       fvalue.estado;

    entity.city =         fvalue.city;
    entity.barrio =       fvalue.barrio;


    if(this.currentPerson){
      entity.requirenteId = this.currentPerson._id;

      this.dsCtrl.fetchPersonById(entity.requirenteId).then(p => {
        this.dsCtrl.updateCurrentPerson(p);
      })

    }else {
      delete entity.requirenteId;
    }

    //Save Actual Data in Controller
    this.dsCtrl.asistenciasSelector = entity;
		return entity;
	}

}
