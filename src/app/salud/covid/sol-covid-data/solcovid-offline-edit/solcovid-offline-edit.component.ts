import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, AbstractControl, ValidatorFn, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';
import {  Asistencia,
          Requirente,
          ContextoCovid,
          ContextoDenuncia,
          Novedad, 
          Locacion,
          UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';
const FIEBRE_TXT = [
              'Tuvo 38 o más grados de fiebre en los últimos 14 días',
              'Cree haber tenido fiebre en los últimos 14 días',
              'No tuvo fiebre en los últimos 14 días',
      ]

@Component({
  selector: 'solcovid-offline-edit',
  templateUrl: './solcovid-offline-edit.component.html',
  styleUrls: ['./solcovid-offline-edit.component.scss']
})
export class SolcovidOfflineEditComponent implements OnInit {
	@Input() token: Asistencia;
	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

  public actionOptList = []; // AsistenciaHelper.getOptionlist('actions');
  public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  public sectorActionRelation = AsistenciaHelper.getSectorActionRelation();
  public avanceEstadoRelation = AsistenciaHelper.getAvanceEstadoRelation();
  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  public novedadOptList = AsistenciaHelper.getOptionlist('novedades');
  public prioridadOptList = AsistenciaHelper.getOptionlist('prioridad');
  public osocialOptList = AsistenciaHelper.getOptionlist('osocial');
  public ciudadesList =   personModel.ciudades;
  public barrioList = [];



  public tcompPersonaFisica = personModel.tipoDocumPF;
  public sexoOptList        = personModel.sexoList;

	public form: FormGroup;

  public showViewAlimento = false;
  public showEditAlimento = false;
  public showAmbitoLaboral = false;

  private formAction = "";
  private fireEvent: UpdateAsistenciaEvent;

  public novedadesTitle = 'Seguimiento de novedades relativas a esta SOLICITUD';
  public currentEventTxt = '';

  public isCovid = false;
  public isDenuncia = false;
  public showButtons = false;
  public tipoEdit = 1;

  private workflowOptList = AsistenciaHelper.getWorkflow();
  public nextStepOptList = [];


  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
    
  	this.initForEdit(this.form, this.token);

  }

  onSubmit(){
  	this.initForSave(this.form, this.token);
  	this.formAction = UPDATE;

  	this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }

  deleteToken(){
    this.formAction = DELETE;
    this.emitEvent(this.formAction);

  }

  emitEvent(action:string){
  	this.updateToken.next({
  		action: action,
  		type: TOKEN_TYPE,
      selected: true,
  		token: this.token
  	});

  }

  changeSelectionValue(type, val){
    if(type==='sector'){
      this.actionOptList = this.sectorActionRelation[val] || [];

      if(this.actionOptList.length === 1){
        this.form.get('action').setValue(this.actionOptList[0].val);

      }
    }

    if(type==='avance'){
      this.estadoOptList = this.avanceEstadoRelation[val] || [];
      
      if(this.token.avance === val && this.token.estado){
        this.form.get('estado').setValue(this.token.estado);

      } else if(this.estadoOptList.length === 1){
        this.form.get('estado').setValue(this.estadoOptList[0].val);

      }else {
        this.form.get('estado').setValue(null);

      }
    }
  }

 
  changeSalud(){
    this.showAmbitoLaboral = !this.showAmbitoLaboral

  }

	changeCity() {
	    this.barrioList = personModel.getBarrioList(this.form.value.city);

	}


  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			description: [null],
      sector:      [null, Validators.compose([Validators.required])],
			action:      [null, Validators.compose([Validators.required])],
			fecomp:      [null, Validators.compose([Validators.required])],
      avance:      [null, Validators.compose([Validators.required])],
      estado:      [null, Validators.compose([Validators.required])],
      tdoc:        [null],
      ndoc:        [null],
      telefono:    [null, [this.validateCovidFlds(this)]],
      sexo:        [null],
      edad:        [null],
      tipo:        [1],
      prioridad:   [null],

      fiebre:           [null],
      fiebreRB:         [null],

      hasDifRespiratoria: [null],
      hasDolorGarganta:   [null],
      hasTos:             [null],
      hasFaltaGusto:           [null],
      hasFaltaOlfato:           [null],
      sintomas:           [null],

      hasViaje:           [null],
      hasContacto:        [null],
      hasEntorno:         [null],

      hasTrabajoAdulMayores:  [null],
      hasTrabajoHogares:      [null],
      hasTrabajoPolicial:     [null],
      hasTrabajoHospitales:   [null],
      hasTrabajoSalud:        [null],
      contexto:               [null],

      osocial:     [null],
      osocialTxt:  [null],
    	street1:            [null],
    	streetIn:           [null],
    	streetOut:          [null],
    	city:               [null],
    	barrio:             [null],
    	nombre:             [null],
    	apellido:           [null],

    });

    return form;
  }

  private initForEdit(form: FormGroup, token: Asistencia): FormGroup {
    this.currentEventTxt = token._id ? 'Editando S/Asis ' + token.compNum + ' ' + token.fecomp_txa  : 'NUEVO EVENTO'

    let sintomaCovid = token.sintomacovid || new ContextoCovid();
    let requirente = token.requeridox || new Requirente();
    let fiebreOptions = 1;


    let locacion = token.locacion || new Locacion();
		this.barrioList = personModel.getBarrioList(locacion.city);



    token.tipo = token.tipo || 4;

		form.reset({
			description: token.description,
			action:      token.action,
      sector:      token.sector,
			fecomp:      token.fecomp_txa,
      estado:      token.estado,
      avance:      token.avance,

      tdoc:        token.tdoc,
      ndoc:        token.ndoc,
      telefono:    token.telefono,
      sexo:        token.sexo,
      edad:        token.edad,
      tipo:        token.tipo,
      prioridad:   token.prioridad || 2,

      osocial:     token.osocial,
      osocialTxt:  token.osocialTxt,

      hasDifRespiratoria: sintomaCovid.hasDifRespiratoria,
      hasDolorGarganta:   sintomaCovid.hasDolorGarganta,
      hasFaltaGusto:      sintomaCovid.hasFaltaGusto,
      hasFaltaOlfato:     sintomaCovid.hasFaltaOlfato,
      hasTos:             sintomaCovid.hasTos,
      sintomas:           sintomaCovid.sintomas,

      hasViaje:           sintomaCovid.hasViaje,
      hasContacto:        sintomaCovid.hasContacto,
      hasEntorno:         sintomaCovid.hasEntorno,

      hasTrabajoAdulMayores:  sintomaCovid.hasTrabajoAdulMayores,
      hasTrabajoHogares:      sintomaCovid.hasTrabajoHogares,
      hasTrabajoPolicial:     sintomaCovid.hasTrabajoPolicial,
      hasTrabajoHospitales:   sintomaCovid.hasTrabajoHospitales,
      hasTrabajoSalud:        sintomaCovid.hasTrabajoSalud,

      contexto:           sintomaCovid.contexto,

      fiebre:             sintomaCovid.fiebre,
      fiebreRB:           sintomaCovid.fiebreRB,

    	street1:       locacion.street1,
    	streetIn:      locacion.streetIn,
    	streetOut:     locacion.streetOut,
    	city:          locacion.city,
    	barrio:        locacion.barrio,
    	nombre:        requirente.nombre || requirente.slug,
      apellido:      requirente.apellido,

		});

    this.actionOptList = this.sectorActionRelation[token.sector] || [];
    this.buildNovedades(token.novedades)

    this.isCovid =  token.tipo === 1 || token.tipo === 3 || token.tipo === 4;
    this.isDenuncia = false;

    this.tipoEdit = 1
    this.showButtons = true;

		return form;
  }

  private buildNovedades(novedades: Novedad[]){
    novedades = novedades || [];
    let novedadesFG = novedades.map(novedad => this.fb.group(novedad))
    let novedadesFormArray = this.fb.array(novedadesFG);
    this.form.setControl('novedades', novedadesFormArray);
  }

  get novedades(): FormArray{
    return this.form.get('novedades') as FormArray;
  }

  addNovedad(){
    let item = new Novedad();
    let novedadFG = this.fb.group(item);
    let formArray = this.form.get('novedades') as FormArray;
    formArray.push(novedadFG);

  }

  removeItem(e, item){
    e.preventDefault();
    this.removeNovedadItem(item);
  }

  private removeNovedadItem(item){
    
    let formArray = this.form.get('novedades') as FormArray;
    formArray.removeAt(item);
  }


	initForSave(form: FormGroup, token: Asistencia): Asistencia {
		const fvalue = form.value;

		const entity = token;

		entity.description =  fvalue.description;
		entity.action =       fvalue.action;
    entity.sector =       fvalue.sector;
		entity.fecomp_txa =   fvalue.fecomp;
    entity.estado =       fvalue.estado;
    entity.avance =       fvalue.avance;

    entity.tdoc =       fvalue.tdoc;
    entity.ndoc =       fvalue.ndoc;
    entity.telefono =   fvalue.telefono;
    entity.sexo =       fvalue.sexo;
    entity.edad =       fvalue.edad;
    entity.tipo =       fvalue.tipo;

    entity.prioridad =  fvalue.prioridad;

		entity.estado = entity.estado || 'activo';
    entity.novedades = [];

    entity.sintomacovid = this.buildCovid(fvalue, entity);

    entity.avance = (entity.avance === 'emitido'  && entity.tipo == 2) ? 'denuncia' : entity.avance || 'emitido';
    entity.avance = (entity.avance === 'denuncia' && (entity.tipo == 1 || entity.tipo == 3)) ? 'emitido' : entity.avance || 'emitido';

    //////////////////from solcovid-folloup
    entity.osocial =    fvalue.osocial;
    entity.osocialTxt = fvalue.osocialTxt;


    let locacion = entity.locacion || new Locacion();
		locacion.street1 =       fvalue.street1;
		locacion.streetIn =      fvalue.streetIn;
		locacion.streetOut =     fvalue.streetOut;
		locacion.city =          fvalue.city;
		locacion.barrio =        fvalue.barrio;

		entity.locacion = locacion;

    let requirente = entity.requeridox|| new Requirente();
    requirente.slug =     fvalue.apellido + ', ' + fvalue.nombre;
    requirente.nombre =   fvalue.nombre;
    requirente.apellido = fvalue.apellido;
    requirente.tdoc =     fvalue.tdoc;
    requirente.ndoc =     fvalue.ndoc;

    entity.requeridox =   requirente;

    //////////////////






		return entity;
	}

  private leyendaFiebre(valor): string{
    if(!valor || valor >3 || valor <1) valor = 3
    return FIEBRE_TXT[valor-1]
  }

  private buildCovid(fvalue, entity: Asistencia): ContextoCovid{
    let covid = entity.sintomacovid || new ContextoCovid();

    covid.hasFiebre = fvalue.fiebreRB !== 3;
    covid.fiebreTxt = this.leyendaFiebre(fvalue.fiebreRB);
    covid.fiebre =    fvalue.fiebre;
    covid.fiebreRB =  fvalue.fiebreRB;

    covid.hasDifRespiratoria = fvalue.hasDifRespiratoria;
    covid.hasDolorGarganta =   fvalue.hasDolorGarganta;
    covid.hasTos =             fvalue.hasTos;
    covid.hasFaltaGusto =      fvalue.hasFaltaGusto;
    covid.hasFaltaOlfato =     fvalue.hasFaltaOlfato;
    covid.sintomas =           fvalue.sintomas;

    covid.hasViaje =           fvalue.hasViaje;
    covid.hasContacto =        fvalue.hasContacto;
    covid.hasEntorno =         fvalue.hasEntorno;
    covid.hasTrabajoAdulMayores =  fvalue.hasTrabajoAdulMayores;
    covid.hasTrabajoHogares =      fvalue.hasTrabajoHogares;
    covid.hasTrabajoPolicial =     fvalue.hasTrabajoPolicial;
    covid.hasTrabajoHospitales =   fvalue.hasTrabajoHospitales;
    covid.hasTrabajoSalud =        fvalue.hasTrabajoSalud;

    covid.contexto =               fvalue.contexto;

    covid.indicacion = 'Permanecer aislado controlando los síntomas';

    return covid;
  }


  private validateCovidFlds(that: any): ValidatorFn {

      return ((control: AbstractControl) : {[key: string]: any} | null  => {

          return !control.value && that.form && (that.form.controls['tipo'].value == 1 || that.form.controls['tipo'].value == 3 || that.form.controls['tipo'].value == 4 ) ?  {'invalidTel': true} : null

      }) ;

  }

}
