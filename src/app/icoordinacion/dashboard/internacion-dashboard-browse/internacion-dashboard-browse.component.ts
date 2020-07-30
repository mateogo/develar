import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../entities/person/person';

import { SolInternacionBrowse } from '../../../salud/internacion/internacion.model';

import { InternacionService } from '../../../salud/internacion/internacion.service';
import { InternacionHelper } from '../../../salud/internacion/internacion.helper';

import { devutils }from '../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';

@Component({
  selector: 'internacion-dashboard-browse',
  templateUrl: './internacion-dashboard-browse.component.html',
  styleUrls: ['./internacion-dashboard-browse.component.scss']
})
export class InternacionDashboardBrowseComponent implements OnInit {
	@Input() query: SolInternacionBrowse = new SolInternacionBrowse();
  @Input() export = false;
	@Output() updateQuery = new EventEmitter<SolInternacionBrowse>();

  public serviciosOptList =       [];

  private fecharef: string;
  private fecharef_date: Date;
  public fecharef_label: string;



  public ciudadesList =   personModel.ciudades;
  public barrioList = [];

	public form: FormGroup;
  public currentPerson: Person;

  private formAction = "";
  private fireEvent: SolInternacionBrowse;

  constructor(
    private dsCtrl: InternacionService,
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}

  ngOnInit() {
  	this.initOnce()
  }

  private initOnce(){

    this.addSinSeleccion()

    this.updateFechaFromTo(null);

  	this.initForEdit(this.form, this.query);
  }

  onSubmit(action){
  	this.query = this.initForSave(this.form);
  	this.formAction = action;
  	this.emitEvent(this.formAction);
  }

  onExport(action){
    this.query = this.initForSave(this.form);
    this.formAction = action;
    this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }

  changeSelectionValue(type, val){
    
  
  }

  refreshData(e){
    let fe = this.form.value.fecharef;
    this.updateFechaFromTo(fe);

    this.form.controls.feDesde.setValue(this.query.feDesde);
    this.form.controls.feHasta.setValue(this.query.feHasta);
  }

  private updateFechaFromTo(fecha: string){
  	if(!fecha) fecha = devutils.txFromDate(null);

    this.fecharef_date = devutils.dateFromTx(fecha);
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForEpidemioWeek(this.fecharef_date);

    let dateFromTo = devutils.dateWeekFromTo(this.fecharef_date);

    this.query.feDesde = dateFromTo.feDesde;
    this.query.feHasta = dateFromTo.feHasta;

  }

  personFetched(person:Person){
    this.currentPerson = person;
  }



  private emitEvent(action:string){
  	this.query.searchAction = action;
  	this.updateQuery.next(this.query);
  }

 
  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      compPrefix:   [{value: "", disabled: true}],
      compName:     [{value: "", disabled: true}],
      compNum_d:       [null],
      compNum_h:       [null],
      isVigilado:      [null],
      hasCovid:        [null],
      casoCovid:       [null],
      vigiladoCovid:   [null],
      necesitaLab:     [null],
      pendLaboratorio: [null],
      actualState:     [null],
      reporte:         [null],   

      isActiveSisa:     [null],
      avanceSisa:       [null],
      qDaysSisa:        [null],
      qNotConsultaSisa: [null],

      tipoSeguimiento: [null],
      qIntents:        [null],
      qNotSeguimiento: [null],
      asignadoId:      [null],
      casosIndice:     [null],
      avanceCovid:     [null],
      sintomaCovid:    [null],

      isSeguimiento:   [null],
      servicio:     [null],
      feDesde:      [null], 
      feHasta:      [null], 
      fecharef:     [null],

    });

    return form;
  }

  private initForEdit(form: FormGroup, query: SolInternacionBrowse): FormGroup {
		form.reset({

        feDesde:    query.feDesde,
        feHasta:    query.feHasta,
        fecharef:   this.fecharef,
        servicio:   query.servicio,


		});

		return form;
  }

	initForSave(form: FormGroup): SolInternacionBrowse {
		const fvalue = form.value;
		const entity = new SolInternacionBrowse();

    let dateD = devutils.dateFromTx(fvalue.fecomp_d);
    let dateH = devutils.dateFromTx(fvalue.fecomp_h);


    entity.feDesde = devutils.txFormatted(fvalue.feDesde);
    entity.feHasta = devutils.txFormatted(fvalue.feHasta);
    entity.servicio = fvalue.servicio;

    entity.feDesde_ts = entity.feDesde ? devutils.dateNumFromTx(entity.feDesde) : 0;
    entity.feHasta_ts = entity.feHasta ? devutils.dateNumPlusOneFromTx(entity.feHasta) : 0;


    //AsistenciaHelper.cleanQueryToken(entity, true);

		return entity;
	}

  private addSinSeleccion(){
    let list = [  this.serviciosOptList  ];

    this.serviciosOptList =    InternacionHelper.getOptionlist('servicios');
  }


}

