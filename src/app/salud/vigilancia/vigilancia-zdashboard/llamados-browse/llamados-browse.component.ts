import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';


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
  @Input() title = 'Parametros del reporte'
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

    this.form.controls.fenovd.setValue(this.query.fenovd);
    this.form.controls.feHasta.setValue(this.query.feHasta);
  }

  private updateFechaFromTo(fecha: string){
  	if(!fecha) fecha = devutils.txFromDate(null);

    this.fecharef_date = devutils.dateFromTx(fecha);
    this.fecharef = devutils.txFromDate(this.fecharef_date);
    this.fecharef_label = devutils.txForEpidemioWeek(this.fecharef_date);

    let dateFromTo = devutils.dateWeekFromTo(this.fecharef_date);

    this.query.fenovd = dateFromTo.feDesde;
    this.query.fenovh = dateFromTo.feHasta;

  }

  personFetched(person:Person){
    this.currentPerson = person;
  }

  deSelectPerson(e:MatCheckboxChange){
    delete this.currentPerson;
    delete this.query.asistidoId;
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

      hasCovid:        [null],
      casoCovid:       [null],
      vigiladoCovid:   [null],
      actualState:     [null],
      isSeguimiento:   [null],
      reporte:         [null],   

      tipoSeguimiento: [null],
      asignadoId:      [null],
      avanceCovid:     [null],
      sintomaCovid:    [null],
      fenovd:      [null, Validators.required], 
      fenovh:      [null, Validators.required], 
      fecharef:     [null],

    });

    return form;
  }

  private initForEdit(form: FormGroup, query: VigilanciaBrowse): FormGroup {
		form.reset({

        hasCovid:   query.hasCovid,
        casoCovid:   query.casoCovid,
        vigiladoCovid:   query.vigiladoCovid,
        actualState: query.actualState,
        isSeguimiento:  query.isSeguimiento,
        reporte: query.reporte,
        tipoSeguimiento:  query.tipoSeguimiento,
        asignadoId:    query.asignadoId,
        avanceCovid:   query.avanceCovid,
        sintomaCovid:   query.sintomaCovid,
        fenovd:    query.fenovd,
        fenovh:    query.fenovh,
        fecharef:   this.fecharef,
		});

    if(query.asistidoId && !this.currentPerson) {
      this.dsCtrl.fetchPersonById(query.asistidoId).then(p => {
        this.currentPerson = p;
      })
    }

		return form;
  }

	initForSave(form: FormGroup): VigilanciaBrowse {
		const fvalue = form.value;
		const entity = new VigilanciaBrowse();

    entity.hasCovid =     fvalue.hasCovid;
    entity.casoCovid =   fvalue.casoCovid,
    entity.vigiladoCovid =   fvalue.vigiladoCovid,
    entity.actualState  = fvalue.actualState;
    entity.isSeguimiento =   fvalue.isSeguimiento;
    entity.reporte = fvalue.reporte;
    entity.tipoSeguimiento =   fvalue.tipoSeguimiento;


    entity.asignadoId = this.currentTrabajador ? fvalue.asignadoId : null;

    entity.avanceCovid =   fvalue.avanceCovid;
    entity.sintomaCovid =   fvalue.sintomaCovid;

    entity.fenovd = devutils.txFormatted(fvalue.fenovd);
    entity.fenovh = devutils.txFormatted(fvalue.fenovh);

    entity.fenovd_ts = entity.fenovd ? devutils.dateNumFromTx(entity.fenovd) : 0;
    entity.fenovh_ts = entity.fenovh ? devutils.dateNumPlusOneFromTx(entity.fenovh) : 0;

    if(this.currentPerson){
      entity.asistidoId = this.currentPerson._id;

      // this.dsCtrl.fetchPersonById(entity.asistidoId).then(p => {
      //   this.dsCtrl.updateCurrentPerson(p);
      // })

    }else {
      delete entity.asistidoId;
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