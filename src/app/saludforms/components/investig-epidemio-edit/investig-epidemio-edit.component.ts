import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, AbstractControl, ValidatorFn, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { SaludController } from '../../../salud/salud.controller';
import { PersonService }   from '../../../salud/person.service';

import { Person, personModel } from '../../../entities/person/person';

import { VigilanciaVinculosComponent }    from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-vinculos/vigilancia-vinculos.component';

import {  Asistencia,
          Requirente,
          ContextoCovid,
          ContextoDenuncia,
          InfectionFollowUp,
          Novedad, 
          Locacion,
          UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';

import { devutils }from '../../../develar-commons/utils'

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
  selector: 'investig-epidemio-edit',
  templateUrl: './investig-epidemio-edit.component.html',
  styleUrls: ['./investig-epidemio-edit.component.scss']
})
export class InvestigEpidemioEditComponent implements OnInit {
	@Input() token: Asistencia;
  @Input() usersOptList: Array<any> = [];
	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  public novedadOptList = AsistenciaHelper.getOptionlist('novedades');
  public prioridadOptList = AsistenciaHelper.getOptionlist('prioridad');

  public sintomaOptList = AsistenciaHelper.getOptionlist('sintomaInfection');
  public tinternacionOptList = AsistenciaHelper.getOptionlist('tinternacion')
  public derivacionOptList = AsistenciaHelper.getOptionlist('derivacion')
  public trabajoOptList = AsistenciaHelper.getOptionlist('lugartrabajo')
  public avanceCovidOptList = AsistenciaHelper.getOptionlist('avanceInfection')

	public form: FormGroup;

  private formAction = "";

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

  }

  changeActualState(estado){
    //c onsole.log('Estado COVID: [%s]', estado);
  }

  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			description: [null],

      tipo:        [1],
      prioridad:   [null],

      fiebre:           [null],
      fiebreRB:         [null],

      hasDifRespiratoria: [null],
      hasDolorGarganta:   [null],
      hasTos:             [null],
      hasNeumonia:        [null],
      hasDolorCabeza:     [null],
      hasDiarrea:         [null],
      hasFaltaGusto:      [null],
      hasFaltaOlfato:     [null],
      sintomas:           [null],
      hasSintomas:        [null],
      fe_inicio:          [null],

      sintoma:            [null],
      fe_prevAlta:        [null],

      hasViaje:           [null],
      hasContacto:        [null],
      hasEntorno:         [null],
      hasDiabetes:        [null],
      hasHta:        [null],
      hasCardio:        [null],
      hasPulmonar:        [null],
      hasCronica:        [null],
      hasFumador:        [null],
      hasObesidad:        [null],
      comorbilidad:        [null],

      isInternado:         [null],
      tinternacion:        [null],
      internacionSlug:     [null],

      derivacion:          [null],
      trabajo:             [null],
      trabajoSlug:         [null],

      derivacionSlug:      [null],

      hasTrabajoAdulMayores:  [null],
      hasTrabajoHogares:      [null],
      hasTrabajoPolicial:     [null],
      hasTrabajoHospitales:   [null],
      hasTrabajoSalud:        [null],
      contexto:               [null],

    	nombre:             [null],
    	apellido:           [null],

      fe_investig:        [null],
      userId:             [null],

      actualState:        [null],
      avanceCovid:        [null],

    });

    return form;
  }

  private initForEdit(form: FormGroup, token: Asistencia): FormGroup {
    let sintomaCovid = token.sintomacovid || new ContextoCovid();
    let requirente = token.requeridox || new Requirente();
    let infeccion = token.infeccion || new InfectionFollowUp()
    let fiebreOptions = 1;

    token.tipo = token.tipo || 4;

		form.reset({
			description: token.description,

      tipo:        token.tipo,
      prioridad:   token.prioridad || 2,

      hasDifRespiratoria: sintomaCovid.hasDifRespiratoria,
      hasDolorGarganta:   sintomaCovid.hasDolorGarganta,
      hasFaltaGusto:      sintomaCovid.hasFaltaGusto,
      hasFaltaOlfato:     sintomaCovid.hasFaltaOlfato,
      hasTos:             sintomaCovid.hasTos,
      sintomas:           sintomaCovid.sintomas,

      hasNeumonia:       sintomaCovid.hasNeumonia,
      hasDolorCabeza:    sintomaCovid.hasDolorCabeza,
      hasDiarrea:        sintomaCovid.hasDiarrea,
      hasSintomas:       sintomaCovid.hasSintomas,
      fe_inicio:         sintomaCovid.fe_inicio,

      sintoma:            sintomaCovid.sintoma,
      fe_prevAlta:        sintomaCovid.fe_prevAlta,


      hasDiabetes:   sintomaCovid.hasDiabetes,
      hasHta:        sintomaCovid.hasHta,
      hasCardio:     sintomaCovid.hasCardio,
      hasPulmonar:   sintomaCovid.hasPulmonar,
      hasCronica:    sintomaCovid.hasCronica,
      hasFumador:    sintomaCovid.hasFumador,
      hasObesidad:   sintomaCovid.hasObesidad,
      comorbilidad:  sintomaCovid.comorbilidad,


      isInternado:     sintomaCovid.isInternado,
      tinternacion:    sintomaCovid.tinternacion,
      internacionSlug: sintomaCovid.internacionSlug,


      derivacion:        sintomaCovid.derivacion, // de internación
      derivacionSlug:    sintomaCovid.derivacionSlug,

      trabajo:           sintomaCovid.trabajo,
      trabajoSlug:       sintomaCovid.trabajoSlug,

      hasViaje:          sintomaCovid.hasViaje,
      hasContacto:       sintomaCovid.hasContacto,
      hasEntorno:        sintomaCovid.hasEntorno,

      hasTrabajoAdulMayores:  sintomaCovid.hasTrabajoAdulMayores,
      hasTrabajoHogares:      sintomaCovid.hasTrabajoHogares,
      hasTrabajoPolicial:     sintomaCovid.hasTrabajoPolicial,
      hasTrabajoHospitales:   sintomaCovid.hasTrabajoHospitales,
      hasTrabajoSalud:        sintomaCovid.hasTrabajoSalud,

      contexto:           sintomaCovid.contexto,
      fe_investig:        sintomaCovid.fe_investig,
      userId:             sintomaCovid.userId,

      fiebre:             sintomaCovid.fiebre,
      fiebreRB:           sintomaCovid.fiebreRB,

    	nombre:        requirente.nombre || requirente.slug,
      apellido:      requirente.apellido,
      actualState:   infeccion.actualState,
      avanceCovid:   infeccion.avance,

		});

    //this.buildNovedades(token.novedades)

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

    entity.tipo =       fvalue.tipo;
    entity.prioridad =  fvalue.prioridad;

		entity.estado = entity.estado || 'activo';

    entity.sintomacovid = this.buildCovid(fvalue, entity);

    entity.avance = (entity.avance === 'emitido'  && entity.tipo == 2) ? 'denuncia' : entity.avance || 'emitido';
    entity.avance = (entity.avance === 'denuncia' && (entity.tipo == 1 || entity.tipo == 3)) ? 'emitido' : entity.avance || 'emitido';

    //////////////////from solcovid-folloup
    entity.osocial =    fvalue.osocial;
    entity.osocialTxt = fvalue.osocialTxt;


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

    covid.hasNeumonia =     fvalue.hasNeumonia;
    covid.hasDolorCabeza =  fvalue.hasDolorCabeza;
    covid.hasDiarrea =      fvalue.hasDiarrea;
    covid.hasFaltaGusto =   fvalue.hasFaltaGusto;
    covid.hasFaltaOlfato =  fvalue.hasFaltaOlfato;
    covid.sintomas =        fvalue.sintomas;
    covid.hasSintomas =     fvalue.hasSintomas;
    covid.fe_inicio =       fvalue.fe_inicio;

    covid.sintoma =           fvalue.sintoma;
    covid.fe_prevAlta =       fvalue.fe_prevAlta;

    covid.hasDiabetes =       fvalue.hasDiabetes;
    covid.hasHta =            fvalue.hasHta;
    covid.hasCardio =         fvalue.hasCardio;
    covid.hasPulmonar =       fvalue.hasPulmonar;
    covid.hasCronica =        fvalue.hasCronica;
    covid.hasFumador =        fvalue.hasFumador;
    covid.hasObesidad =       fvalue.hasObesidad;
    covid.comorbilidad =      fvalue.comorbilidad;
    covid.isInternado =       fvalue.isInternado;
    covid.tinternacion =      fvalue.tinternacion;
    covid.internacionSlug =   fvalue.internacionSlug;

    covid.derivacionSlug =    fvalue.derivacionSlug;
    covid.derivacion =        fvalue.derivacion;

    covid.trabajoSlug =       fvalue.trabajoSlug;
    covid.trabajo =           fvalue.trabajo;

    covid.hasViaje =           fvalue.hasViaje;
    covid.hasContacto =        fvalue.hasContacto;
    covid.hasEntorno =         fvalue.hasEntorno;
    covid.hasTrabajoAdulMayores =  fvalue.hasTrabajoAdulMayores;
    covid.hasTrabajoHogares =      fvalue.hasTrabajoHogares;
    covid.hasTrabajoPolicial =     fvalue.hasTrabajoPolicial;
    covid.hasTrabajoHospitales =   fvalue.hasTrabajoHospitales;
    covid.hasTrabajoSalud =        fvalue.hasTrabajoSalud;

    covid.contexto =               fvalue.contexto;
    covid.actualState = fvalue.actualState;
    covid.avanceCovid = fvalue.avanceCovid;


    covid.indicacion = 'Permanecer aislado controlando los síntomas';

    covid.fe_investig =         fvalue.fe_investig;
    covid.userId =              fvalue.userId;
    if(covid.fe_investig){
      covid.fets_investig = devutils.dateNumFromTx(covid.fe_inicio);
    }
    if(covid.userId){
      covid.userInvestig = this.usersOptList.find(t=>t.val === covid.userId).label;
    }

    return covid;
  }


  private validateCovidFlds(that: any): ValidatorFn {

      return ((control: AbstractControl) : {[key: string]: any} | null  => {

          return !control.value && that.form && (that.form.controls['tipo'].value == 1 || that.form.controls['tipo'].value == 3 || that.form.controls['tipo'].value == 4 ) ?  {'invalidTel': true} : null

      }) ;

  }


}
