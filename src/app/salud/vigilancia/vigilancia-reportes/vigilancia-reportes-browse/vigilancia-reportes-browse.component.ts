import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';

import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';
import { VigilanciaBrowse,  AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const SEARCH = 'search';
const EXPORT = 'export';
const SEARCH_NEXT = 'search_next';

@Component({
  selector: 'vigilancia-reportes-browse',
  templateUrl: './vigilancia-reportes-browse.component.html',
  styleUrls: ['./vigilancia-reportes-browse.component.scss']
})
export class VigilanciaReportesBrowseComponent implements OnInit {
	@Input() query: VigilanciaBrowse = new VigilanciaBrowse();
  @Input() export = true;
	@Output() updateQuery = new EventEmitter<VigilanciaBrowse>();

  public reportesOptList =     [];
  public actionOptList =       [];
  public sectorOptList =       [];
  public ciudadesOptList =     [];
  public avanceOptList =       [];
  public estadoOptList =       [];
  public urgenciaOptList =     [];
  public tipoFollowUpOptList = [];
  public estadoCovidOptList =  [];
  public avanceSisaOptList =   [];
  public avanceCovidOptList =  [];
  public sintomaCovidOptList =  [];

  public ciudadesList =   personModel.ciudades;
  public barrioList = [];

	public form: FormGroup;

  public currentPerson: Person;


  private formAction = "";

  public isEncuesta = false;

  constructor(
    private dsCtrl: SaludController,
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildReportesForm();
	}

  ngOnInit() {
    this.sectorOptList.push(
       {val: 'no_definido', type:'Sin selección',  label: 'Sin selección' }
     );

    this.initOptionLists();

    this.query = this.dsCtrl.vigilanciaSelector;
  	this.initForEdit(this.form, this.query);
  }

  onExport(action){
    this.query = this.initForSave(this.form);
    this.formAction = action;
    this.emitEvent(this.formAction);
  }



  onSubmit(action){
  	this.query = this.initForSave(this.form);
  	this.formAction = action;
  	this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }

  changeSelectionValue(type, val){

    if(type === 'actualState'){
      this.isEncuesta = false;
      if(val === 1){
        this.form.get('hasCovid').setValue(true);

      }else{
        this.form.get('hasCovid').setValue(false);

      }
    }
  }


  private emitEvent(action:string){
  	this.query.searchAction = action;
  	this.updateQuery.next(this.query);
  }

	private buildReportesForm(): FormGroup{
		let form: FormGroup;

		form = this.fb.group({
				reporte:     [null],   
		})
		return form;
	}

	private initForEdit(form: FormGroup, query: VigilanciaBrowse): FormGroup {
    if(!query.reporte) query.reporte = 'LABORATORIO'
		form.reset({
        reporte:  query.reporte,
		});
		return form;
  }

	private initForSave(form: FormGroup): VigilanciaBrowse {
		const fvalue = form.value;
    const entity = new VigilanciaBrowse();

    entity.reporte =  fvalue.reporte;

    Object.keys(entity).forEach(key =>{
      if(entity[key] == null || entity[key] == 'no_definido' ) delete entity[key];

      if(key === 'asistenciaId') delete entity[key];
      if(key === 'fecomp_h' || key === 'fecomp_d') delete entity[key];
      if(key === 'isVigilado'       && !entity[key]) delete entity[key];
      if(key === 'hasCovid'         && !entity[key]) delete entity[key];
      if(key === 'necesitaLab'      && !entity[key]) delete entity[key];
      if(key === 'isSeguimiento'    && !entity[key]) delete entity[key];
      if(key === 'isActiveSisa'     && !entity[key]) delete entity[key];
      if(key === 'pendLaboratorio'  && !entity[key]) delete entity[key];
      if(key === 'qIntents'         && !entity[key]) delete entity[key];
      if(key === 'qNotSeguimiento'  && !entity[key]) delete entity[key];
      if(key === 'qDaysSisa'        && !entity[key]) delete entity[key];
      if(key === 'qNotConsultaSisa' && !entity[key]) delete entity[key];
      if(key === 'casosIndice'      && !entity[key]) delete entity[key];
    })

    this.dsCtrl.vigilanciaSelector = entity;
		return entity;
	}

  private initOptionLists(){
    this.reportesOptList =     AsistenciaHelper.getOptionlist('reportesVigilancia');
    this.actionOptList =       AsistenciaHelper.getOptionlist('actions');
    this.sectorOptList =       AsistenciaHelper.getOptionlist('sectores');
    this.ciudadesOptList =     AsistenciaHelper.getOptionlist('ciudades');
    this.avanceOptList =       AsistenciaHelper.getOptionlist('avance');
    this.estadoOptList =       AsistenciaHelper.getOptionlist('estado');
    this.urgenciaOptList =     AsistenciaHelper.getOptionlist('urgencia');
    this.tipoFollowUpOptList = AsistenciaHelper.getOptionlist('tipoFollowUp');
    this.estadoCovidOptList =  AsistenciaHelper.getOptionlist('estadoActualInfection');
    this.avanceSisaOptList =   AsistenciaHelper.getOptionlist('avanceSisa');
    this.avanceCovidOptList =  AsistenciaHelper.getOptionlist('avanceInfection');
    this.sintomaCovidOptList =  AsistenciaHelper.getOptionlist('sintomaInfection');
  }

}
