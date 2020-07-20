import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';
import { VigilanciaBrowse,  OptList, AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';

@Component({
  selector: 'llamados-browse',
  templateUrl: './llamados-browse.component.html',
  styleUrls: ['./llamados-browse.component.scss']
})
export class LlamadosBrowseComponent implements OnInit {
	@Input() query: VigilanciaBrowse = new VigilanciaBrowse();
  @Input() export = false;
	@Output() updateQuery = new EventEmitter<VigilanciaBrowse>();

  public actionOptList =       [];
  public sectorOptList =       [];
  public ciudadesOptList =     [];
  public avanceOptList =       [];
  public estadoOptList =       [];
  public urgenciaOptList =     [];
  public tipoFollowUpOptList = [];
  public estadoCovidOptList =  [];
  public avanceCovidOptList =  [];
  public sintomaCovidOptList =  [];

  private fecharef: string;
  private fecharef_date: Date;
  public fecharef_label: string;



  public ciudadesList =   personModel.ciudades;
  public barrioList = [];

	public form: FormGroup;
  public currentTrabajador: OptList;
  public currentPerson: Person;

  private formAction = "";
  private fireEvent: VigilanciaBrowse;
  public usersOptList: OptList[];

  constructor(
    private dsCtrl: SaludController,
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}

  ngOnInit() {
  	this.initOnce()
  }

  private initOnce(){
    this.usersOptList = this.dsCtrl.buildEncuestadoresOptList();

    this.sectorOptList.push(
       {val: 'no_definido', type:'Sin selección',  label: 'Sin selección' }
     );

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
  	if(type === 'asignadoId'){
  		this.currentTrabajador = this.usersOptList.find(t => t.val === val);
  	}
    
    if(type === 'actualState'){
      if(val === 1){
        this.form.get('hasCovid').setValue(true);

      }else{
        this.form.get('hasCovid').setValue(false);

      }
    }
  
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

  deSelectPerson(e:MatCheckboxChange){
    delete this.currentPerson;
    delete this.query.requirenteId;
  }

	deSelectTrabajador(e: MatCheckboxChange){
    delete this.currentTrabajador;
    delete this.query.asignadoId;

	}

  changeCity() {
      this.barrioList = personModel.getBarrioList(this.form.value.city);
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
      isSeguimiento:   [null],
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
      feDesde:      [null], 
      feHasta:      [null], 
      fecharef:     [null],

    });

    return form;
  }

  private initForEdit(form: FormGroup, query: VigilanciaBrowse): FormGroup {
		form.reset({
        compPrefix:  query.compPrefix,
        compName:    query.compName,
        compNum_d:   query.compNum_d,
        compNum_h:   query.compNum_h,

        isVigilado: query.isVigilado,
        pendLaboratorio: query.pendLaboratorio,
        actualState: query.actualState,
        reporte: query.reporte,
        hasCovid:   query.hasCovid,
        casoCovid:   query.casoCovid,
        vigiladoCovid:   query.vigiladoCovid,
        necesitaLab:   query.necesitaLab,
        isSeguimiento:  query.isSeguimiento,
        tipoSeguimiento:  query.tipoSeguimiento,
        qIntents:   query.qIntents,
        qNotSeguimiento:   query.qNotSeguimiento,
        casosIndice:  query.casosIndice ? true: false,

        sintomaCovid:   query.sintomaCovid,
        asignadoId:    query.asignadoId,
        avanceCovid:   query.avanceCovid,

        feDesde:    query.feDesde,
        feHasta:    query.feHasta,
        fecharef:   this.fecharef,

        isActiveSisa: query.isActiveSisa,
        avanceSisa: query.avanceSisa,
        qDaysSisa: query.qDaysSisa,
        qNotConsultaSisa: query.qNotConsultaSisa,

		});

    if(query.requirenteId && !this.currentPerson) {
      this.dsCtrl.fetchPersonById(query.requirenteId).then(p => {
        this.currentPerson = p;
      })
    }

		return form;
  }

	initForSave(form: FormGroup): VigilanciaBrowse {
		const fvalue = form.value;
		const entity = new VigilanciaBrowse();

    let dateD = devutils.dateFromTx(fvalue.fecomp_d);
    let dateH = devutils.dateFromTx(fvalue.fecomp_h);

    entity.compPrefix =  fvalue.compPrefix;
    entity.compName =    fvalue.compName;

    entity.compNum_d =   fvalue.compNum_d;
    entity.compNum_h =   fvalue.compNum_h;

    entity.isVigilado =   fvalue.isVigilado;
    entity.pendLaboratorio =   fvalue.pendLaboratorio;
    entity.actualState  = fvalue.actualState;
    entity.reporte = fvalue.reporte;
    entity.hasCovid =     fvalue.hasCovid;
    entity.casoCovid =   fvalue.casoCovid,

    entity.necesitaLab =     fvalue.necesitaLab;

    entity.isSeguimiento =   fvalue.isSeguimiento;
    entity.tipoSeguimiento =   fvalue.tipoSeguimiento;
    entity.qIntents =   fvalue.qIntents;
    entity.qNotSeguimiento =   fvalue.qNotSeguimiento;
    entity.asignadoId = fvalue.asignadoId;

    entity.casosIndice =   fvalue.casosIndice ? 1: 0;

    entity.avanceCovid =   fvalue.avanceCovid;
    entity.sintomaCovid =   fvalue.sintomaCovid;
		entity.feDesde =     fvalue.feDesde;
		entity.feHasta =     fvalue.feHasta;

    entity.isActiveSisa = fvalue.isActiveSisa;
    entity.avanceSisa = fvalue.avanceSisa;
    entity.qDaysSisa = fvalue.qDaysSisa;
    entity.qNotConsultaSisa = fvalue.qNotConsultaSisa;

    entity.feDesde = devutils.txFormatted(entity.feDesde);
    entity.feHasta = devutils.txFormatted(entity.feHasta);

    entity.feDesde_ts = entity.feDesde ? devutils.dateNumFromTx(entity.feDesde) : 0;
    entity.feHasta_ts = entity.feHasta ? devutils.dateNumFromTx(entity.feHasta) : 0;

    if(this.currentPerson){
      entity.requirenteId = this.currentPerson._id;

      this.dsCtrl.fetchPersonById(entity.requirenteId).then(p => {
        this.dsCtrl.updateCurrentPerson(p);
      })

    }else {
      delete entity.requirenteId;
    }

    AsistenciaHelper.cleanQueryToken(entity, true);

    this.dsCtrl.vigilanciaSelector = entity;
		return entity;
	}

  private addSinSeleccion(){
    let list = [  this.actionOptList, 
                  this.sectorOptList, 
                  this.ciudadesOptList, 
                  this.avanceOptList, 
                  this.estadoOptList, 
                  this.urgenciaOptList, 
                  this.tipoFollowUpOptList,
                  this.estadoCovidOptList,
                  this.avanceCovidOptList,
                  this.sintomaCovidOptList,
                 ];

    this.actionOptList =       AsistenciaHelper.getOptionlist('actions');
    this.sectorOptList =       AsistenciaHelper.getOptionlist('sectores');
    this.ciudadesOptList =     AsistenciaHelper.getOptionlist('ciudades');
    this.avanceOptList =       AsistenciaHelper.getOptionlist('avance');
    this.estadoOptList =       AsistenciaHelper.getOptionlist('estado');
    this.urgenciaOptList =     AsistenciaHelper.getOptionlist('urgencia');
    this.tipoFollowUpOptList = AsistenciaHelper.getOptionlist('tipoFollowUp');
    this.estadoCovidOptList =  AsistenciaHelper.getOptionlist('estadoActualInfection');
    this.avanceCovidOptList =  AsistenciaHelper.getOptionlist('avanceInfection');
    this.sintomaCovidOptList =  AsistenciaHelper.getOptionlist('sintomaInfection');
  }

}