import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { BehaviorSubject } from 'rxjs'

import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../entities/person/person';
import { VigilanciaBrowse,  AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';
import { WorkloadHelper, WorkPlanToken } from '../../../salud/vigilancia/vigilancia-workload/workload-helper';
import { WorkLoadService } from '../../../salud/vigilancia/vigilancia-workload/work-load.service';

import { SaludController } from '../../../salud/salud.controller';

import { devutils }from '../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';

@Component({
  selector: 'vigil-seguimiento-browse',
  templateUrl: './vigil-seguimiento-browse.component.html',
  styleUrls: ['./vigil-seguimiento-browse.component.scss'],
  providers: [ WorkLoadService ]
})
export class VigilSeguimientoBrowseComponent implements OnInit {
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
  public resultadoOptList = [];
  public ejecucionOptList = [];

  public intervencionOptList = [];
  public ciudadesList =   personModel.ciudades;
  public barrioList = [];

	public form: FormGroup;
  public currentPerson: Person;

  private formAction = "";
  private fireEvent: VigilanciaBrowse;
  public usersOptList;

  public workplan$ = new BehaviorSubject<WorkPlanToken[]>([])

  constructor(
    private dsCtrl: SaludController,
  	private fb: FormBuilder,
    private service: WorkLoadService
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
    this.loadUserPlanning();

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

  changeCity() {
      this.barrioList = personModel.getBarrioList(this.form.value.city);
  }

  getLabel(type: string, val: string){
    return WorkloadHelper.getOptionLabel(type, val);
  }

  private loadUserPlanning(){
    let user = this.dsCtrl.currentUser;
    
    const QueryClass = class {
      fenovd_ts: number = 0;
      fenovh_ts: number = 0;
      hasCovid = true;
      casoCovid = true;
      asignadoId: string;
      reporte =  'WEEKPLANNING';

      constructor(user: any){
        let today = new Date();
        this.fenovd_ts = devutils.projectedDate(today, -10, 0).getTime();
        this.fenovh_ts = devutils.projectedDate(today, -1,  0).getTime();
        this.asignadoId = user['id'];
      }
    }

    let query = new QueryClass(user);
    this.service.fetcWeekPlanningByQuery<WorkPlanToken[]>(query).subscribe(list => {
      if(list && list.length){
        this.workplan$.next(list);
      }
    })

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
      hasPrexistentes: [null],
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
      resultado:        [null],
      userAsignado:     [null],

      tipoSeguimiento: [null],
      qIntents:        [null],
      qNotSeguimiento: [null],
      asignadoId:      [null],
      casosIndice:     [null],
      avanceCovid:     [null],
      sintomaCovid:    [null],

      sectorNovedad:   [null],
      action:       [null],
      fecomp_d:     [null],
      fecomp_h:     [null],
      fenovd:       [null],
      fenovh:       [null],

      ejecucion:    [null],
      fe_visita:    [null],
      ruta:         [null],
      barrio:       [null],
      city:         [null],
      urgencia:     [null],
      intervencion: [null],
      trabajadorId: [null],
      nextCallDate: [null],

    });

    return form;
  }

  private initForEdit(form: FormGroup, query: VigilanciaBrowse): FormGroup {
    
    query.nextCallDate = devutils.txFromDate(new Date());

		form.reset({
        compPrefix:  query.compPrefix,
        compName:    query.compName,
        compNum_d:   query.compNum_d,
        compNum_h:   query.compNum_h,

        isVigilado: query.isVigilado,
        hasPrexistentes: query.hasPrexistentes,
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

        isActiveSisa: query.isActiveSisa,
        avanceSisa: query.avanceSisa,
        qDaysSisa: query.qDaysSisa,
        qNotConsultaSisa: query.qNotConsultaSisa,
        resultado: query.resultado,
        userAsignado: query.userAsignado,

        fenovd:      query.fenovd,
        fenovh:      query.fenovh,

        action:      query.action,
        sectorNovedad:      query.sectorNovedad,

        ejecucion:   query.ejecucion,
        city:        query.city,
        barrio:      query.barrio,
        urgencia:     query.urgencia,
        intervencion:     query.intervencion,
        trabajadorId: query.trabajadorId,
        nextCallDate: query.nextCallDate,


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
    entity.hasPrexistentes =   fvalue.hasPrexistentes;
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

    entity.isActiveSisa = fvalue.isActiveSisa;
    entity.avanceSisa = fvalue.avanceSisa;
    entity.qDaysSisa = fvalue.qDaysSisa;
    entity.qNotConsultaSisa = fvalue.qNotConsultaSisa;
    entity.resultado = fvalue.resultado;
    entity.userAsignado = fvalue.userAsignado;

    entity.fenovd =        fvalue.fenovd;
    entity.fenovh =        fvalue.fenovh;
    entity.ejecucion =     fvalue.ejecucion;

    entity.action =        fvalue.action;
    entity.sectorNovedad =        fvalue.sectorNovedad;

    entity.city =          fvalue.city;
    entity.barrio =        fvalue.barrio;
    entity.urgencia =      fvalue.urgencia;
    entity.intervencion =      fvalue.intervencion;
    entity.trabajadorId =  fvalue.trabajadorId;

    if(entity.isSeguimiento){
      entity.nextCallDate = fvalue.nextCallDate;
    }else {
      entity.nextCallDate = "";
    }

    if(entity.fenovd) entity.fenovd_ts = devutils.dateNumFromTx(entity.fenovd)
    if(entity.fenovh) entity.fenovh_ts = devutils.dateNumPlusOneFromTx(entity.fenovh);

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
                  this.resultadoOptList,
                  this.intervencionOptList,
                  this.ejecucionOptList,
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
    this.sintomaCovidOptList = AsistenciaHelper.getOptionlist('sintomaInfection');
    this.resultadoOptList =    AsistenciaHelper.getOptionlist('resultadoSeguim');
    this.intervencionOptList = AsistenciaHelper.getOptionlist('intervenciones');
    this.ejecucionOptList =    AsistenciaHelper.getOptionlist('ejecucion');
  }

}
