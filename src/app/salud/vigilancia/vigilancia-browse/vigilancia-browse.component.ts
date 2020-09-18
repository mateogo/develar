import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  @Input() export = true;
  @Input() showReporteBox = false;
	@Output() updateQuery = new EventEmitter<VigilanciaBrowse>();
  @Output() mapRequest = new EventEmitter<string>();

  public actionOptList =       [];
  public sectorOptList =       [];
  public ciudadesOptList =     [];
  public avanceOptList =       [];
  public estadoOptList =       [];
  public encuestaOptList =     [];
  public urgenciaOptList =     [];
  public tipoFollowUpOptList = [];
  public estadoCovidOptList =  [];
  public avanceSisaOptList =   [];
  public mdiagnosticoOptList =   [];
  public avanceCovidOptList =  [];
  public sintomaCovidOptList =  [];
  public reportesOptList =     [];
  public ejecucionOptList = [];
  public locMuestraOptList = [];

  public intervencionOptList = [];


  public ciudadesList =   personModel.ciudades;
  public barrioList = [];

	public form: FormGroup;
  public currentPerson: Person;


  private formAction = "";
  private fireEvent: VigilanciaBrowse;
  public usersOptList;

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

    this.addSinSeleccion()

    //this.query = this.dsCtrl.vigilanciaSelector;
  	this.initForEdit(this.form, this.query);
    this.usersOptList = this.dsCtrl.buildEncuestadoresOptList();

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

  showMap(action){
    this.mapRequest.emit(action);

  }


  emitEvent(action:string){
  	this.query.searchAction = action;
  	this.updateQuery.next(this.query);
  }

  changeSelectionValue(type, val){
    
    if(type === 'actualState'){
      if(val === 1){
        this.form.get('hasCovid').setValue(true);

      }else{
        this.form.get('hasCovid').setValue(false);

      }
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
      compNum_d:       [null],
      compNum_h:       [null],
      fecomp_d:        [null],
      fecomp_h:        [null],
      isVigilado:      [null],
      hasCovid:        [null],
      casoCovid:       [null],
      vigiladoCovid:   [null],
      necesitaLab:     [null],
      pendLaboratorio: [null],
      locacionId:      [null],
      actualState:     [null],
      isSeguimiento:   [null],
      reporte:         [null],   

      isActiveSisa:    [null],
      hasParent:       [null],
      avanceSisa:      [null],
      mdiagnostico:    [null],
      qDaysSisa:       [null],
      qNotConsultaSisa: [null],

      tipoSeguimiento: [null],
      qIntents:        [null],
      qNotSeguimiento: [null],
      asignadoId:      [null],
      casosIndice:     [null],
      avanceCovid:     [null],
      sintomaCovid:    [null],
      sectorNovedad:   [null],
      intervencion:    [null],
      fenovd:          [null],
      fenovh:          [null],



    });

    return form;
  }
//sectorNovedad fenovd fenovh intervencion
  initForEdit(form: FormGroup, query: VigilanciaBrowse): FormGroup {
		form.reset({
        compPrefix:  query.compPrefix,
        compName:    query.compName,
        compNum_d:   query.compNum_d,
        compNum_h:   query.compNum_h,

        fecomp_d:   query.fecomp_d,
        fecomp_h:   query.fecomp_h,

        isVigilado: query.isVigilado,
        pendLaboratorio: query.pendLaboratorio,
        locacionId: query.locacionId,
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
        asignadoId:     query.asignadoId,
        avanceCovid:    query.avanceCovid,
        intervencion:   query.intervencion,
        sectorNovedad:  query.sectorNovedad,
        fenovd:         query.fenovd,
        fenovh:         query.fenovh,
 
        isActiveSisa: query.isActiveSisa,
        hasParent: query.hasParent,
        avanceSisa: query.avanceSisa,
        mdiagnostico: query.mdiagnostico,
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

  changeCity() {
      this.barrioList = personModel.getBarrioList(this.form.value.city);
  }

	initForSave(form: FormGroup): VigilanciaBrowse {
		const fvalue = form.value;
		const entity = new VigilanciaBrowse();

    if(fvalue.fecomp_d && fvalue.fecomp_h){
      entity.fecomp_ts_d = devutils.dateNumFromTx(fvalue.fecomp_d);
      entity.fecomp_ts_h = devutils.dateNumPlusOneFromTx(fvalue.fecomp_h);

    }else{
      entity.fecomp_ts_d = null;
      entity.fecomp_ts_h = null;

    }

    entity.compPrefix =  fvalue.compPrefix;
    entity.compName =    fvalue.compName;

    entity.compNum_d =   fvalue.compNum_d;
    entity.compNum_h =   fvalue.compNum_h;

    entity.isVigilado =   fvalue.isVigilado;
    entity.pendLaboratorio =   fvalue.pendLaboratorio;
    entity.locacionId = fvalue.locacionId;
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

    entity.avanceCovid =     fvalue.avanceCovid;
    entity.sintomaCovid =    fvalue.sintomaCovid;
    entity.intervencion =    fvalue.intervencion;
    entity.sectorNovedad =   fvalue.sectorNovedad;
    entity.fenovd =          fvalue.fenovd;
    entity.fenovh =          fvalue.fenovh;

    entity.isActiveSisa = fvalue.isActiveSisa;
    entity.hasParent = fvalue.hasParent;

    entity.avanceSisa = fvalue.avanceSisa;
    entity.mdiagnostico = fvalue.mdiagnostico;
    entity.qDaysSisa = fvalue.qDaysSisa;
    entity.qNotConsultaSisa = fvalue.qNotConsultaSisa;

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

  addSinSeleccion(){
    let list = [  this.actionOptList, 
                  this.sectorOptList, 
                  this.ciudadesOptList, 
                  this.avanceOptList, 
                  this.estadoOptList, 
                  this.encuestaOptList, 
                  this.urgenciaOptList, 
                  this.tipoFollowUpOptList,
                  this.estadoCovidOptList,
                  this.avanceSisaOptList,
                  this.mdiagnosticoOptList,
                  this.avanceCovidOptList,
                  this.sintomaCovidOptList,
                  this.intervencionOptList,
                  this.ejecucionOptList,
                  this.locMuestraOptList,
                  this.reportesOptList
                 ];

    this.reportesOptList =     AsistenciaHelper.getOptionlist('reportesVigilancia');
    this.actionOptList =       AsistenciaHelper.getOptionlist('actions');
    this.sectorOptList =       AsistenciaHelper.getOptionlist('sectores');
    this.ciudadesOptList =     AsistenciaHelper.getOptionlist('ciudades');
    this.avanceOptList =       AsistenciaHelper.getOptionlist('avance');
    this.estadoOptList =       AsistenciaHelper.getOptionlist('estado');
    this.encuestaOptList =     AsistenciaHelper.getOptionlist('encuesta');
    this.urgenciaOptList =     AsistenciaHelper.getOptionlist('urgencia');
    this.tipoFollowUpOptList = AsistenciaHelper.getOptionlist('tipoFollowUp');
    this.estadoCovidOptList =  AsistenciaHelper.getOptionlist('estadoActualInfection');
    this.avanceSisaOptList =   AsistenciaHelper.getOptionlist('avanceSisa');
    this.mdiagnosticoOptList = AsistenciaHelper.getOptionlist('metodoDiagnostico');
    this.avanceCovidOptList =  AsistenciaHelper.getOptionlist('avanceInfection');
    this.sintomaCovidOptList = AsistenciaHelper.getOptionlist('sintomaInfection');
    this.intervencionOptList = AsistenciaHelper.getOptionlist('intervenciones');
    this.ejecucionOptList =    AsistenciaHelper.getOptionlist('ejecucion');
    this.locMuestraOptList =   AsistenciaHelper.getOptionlist('locMuestraOptList');


    // list.forEach(l => {
    //   let s = { val: 'no_definido', label: 'Sin selección'};
    //   l.unshift(s);
    // });
  }

}

