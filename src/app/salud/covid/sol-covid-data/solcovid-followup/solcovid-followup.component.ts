import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel, Address } from '../../../../entities/person/person';

import {  Asistencia, 
          ContextoCovid,
          ContextoDenuncia,
          Locacion,
          Requirente,
          Novedad, 
          UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';
const EVOLUCION = 'evolucion';

const FIEBRE_TXT = [
              'Tuvo 38 o más grados de fiebre en los últimos 14 días',
              'Cree haber tenido fiebre en los últimos 14 días',
              'No tuvo fiebre en los últimos 14 días',
      ]

const ACTION = {
	descartar:   'descartar',
	observacion: 'observacion',
	medico:      'medico',
	same:        'same',
	traslado:    'traslado',
	intenado:    'internado',
	derivado:    'derivado',
}


@Component({
  selector: 'solcovid-followup',
  templateUrl: './solcovid-followup.component.html',
  styleUrls: ['./solcovid-followup.component.scss']
})
export class SolcovidFollowupComponent implements OnInit {
	@Input() token: Asistencia;
  @Input() detailView = true;
	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();


	public action;
  public sector;
	public cPrefix;
	public cName;
	public cNum;
	public slug;
	public description;
	public locacionTxt;
	public fecha;
  public solicitante;
  public avance;
  public estado;
  public novedadesList = [];

  // Covid
  public indicacion;
  public fiebreTxt;
  public sintomasTxt;
  public contagioTxt;
  public contexto;

  public observacion;

  public audit;


  public actionOptList = []; // AsistenciaHelper.getOptionlist('actions');
  public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  public sectorActionRelation = AsistenciaHelper.getSectorActionRelation();
  public avanceEstadoRelation = AsistenciaHelper.getAvanceEstadoRelation();
  public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  public novedadOptList = AsistenciaHelper.getOptionlist('novedades');
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public osocialOptList = AsistenciaHelper.getOptionlist('osocial');

  public ciudadesList =   personModel.ciudades;
  public barrioList = [];

  private workflowOptList = AsistenciaHelper.getWorkflow();
  public nextStepOptList = [];

	public form: FormGroup;

  public showViewAlimento = false;
  public showEditAlimento = false;

  public isCovid = false;
  public isDenuncia = false;
  public showButtons = false;
  public tipoEdit = 1;



  private formAction = "";
  private fireEvent: UpdateAsistenciaEvent;


  public novedadesTitle = 'EVOLUCIÓN';





  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
  	this.buildData();
    this.buildCovidData();
    
    // if(this.token.avance === 'autorizado'){
    //   this.avance = 'AUTORIZADO';
    // }else{

    //   this.avance = 'Pend Autorización';
    // }
    this.buildNovedades_view(this.token);

    this.audit = this.buildAudit(this.token);

    this.nextStepOptList = this.buildWorkflow(this.token);

  	this.initForEdit(this.form, this.token);

  }

	buttonActionEvent(e, step){
		this.initForSave(this.form, this.token);
  	this.formAction = EVOLUCION;
  	this.token = AsistenciaHelper.workfloStep(this.token, step);
  	this.emitEvent(this.formAction);
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
      telefono:    [null],
      osocial:     [null],
      osocialTxt:  [null],
      tipo:        [null],

      fiebre:           [null],
      fiebreRB:    [null],

      hasDifRespiratoria: [null],
      hasDolorGarganta:   [null],
      hasTos:             [null],
      sintomas:           [null],

      hasViaje:           [null],
      hasContacto:        [null],
      hasEntorno:         [null],
      contexto:           [null],

      denunciante: [null, [this.validateDenunciaFlds(this)]],
      dendoc:      [null, [this.validateDenunciaFlds(this)]],
      dentel:      [null, [this.validateDenunciaFlds(this)]],
      inombre:      [null, [this.validateDenunciaFlds(this)]],
      iapellido:    [null, [this.validateDenunciaFlds(this)]],
      islug:        [null, [this.validateDenunciaFlds(this)]],

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


  initForEdit(form: FormGroup, token: Asistencia): FormGroup {
    let sintomaCovid = token.sintomacovid || new ContextoCovid();
    let fiebreOptions = 1;

    let locacion = token.locacion || new Locacion();
		this.barrioList = personModel.getBarrioList(locacion.city);
		let requirente = token.requeridox || new Requirente()
    let denunciaCovid = token.denuncia || new ContextoDenuncia();
    
    token.tipo = token.tipo || 1;

		form.reset({
			description: token.description,
			action:      token.action,
      sector:      token.sector,
			fecomp:      token.fecomp_txa,
      estado:      token.estado,
      avance:      token.avance,

      tdoc:        token.tdoc || requirente.tdoc,
      ndoc:        token.ndoc || requirente.ndoc,
      tipo:        token.tipo,
 
      telefono:    token.telefono,
      osocial:     token.osocial,
      osocialTxt:  token.osocialTxt,

      hasDifRespiratoria: sintomaCovid.hasDifRespiratoria,
      hasDolorGarganta:   sintomaCovid.hasDolorGarganta,
      hasTos:             sintomaCovid.hasTos,
      sintomas:           sintomaCovid.sintomas,

      hasViaje:           sintomaCovid.hasViaje,
      hasContacto:        sintomaCovid.hasContacto,
      hasEntorno:         sintomaCovid.hasEntorno,
      contexto:           sintomaCovid.contexto,

      fiebre:             sintomaCovid.fiebre,
      fiebreRB:           sintomaCovid.fiebreRB,

      denunciante:        denunciaCovid.denunciante || requirente.slug || '',
      dendoc:             denunciaCovid.dendoc || token.ndoc,
      dentel:             denunciaCovid.dentel || token.telefono,
      inombre:            denunciaCovid.inombre,
      iapellido:          denunciaCovid.iapellido,
      islug:              denunciaCovid.islug,


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

    this.isCovid = token.tipo === 1;
    this.isDenuncia = token.tipo === 2;
    this.tipoEdit = token.tipo;
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
    const novedades: Novedad[] = fvalue.novedades.map(t => Object.assign({}, t))

//https://www.concretepage.com/angular-material/angular-material-radio-button
		entity.description =  fvalue.description;
		entity.action =       fvalue.action;
    entity.sector =       fvalue.sector;
		entity.fecomp_txa =   fvalue.fecomp;
    entity.estado =       fvalue.estado;
    entity.avance =       fvalue.avance;

    entity.tdoc =       fvalue.tdoc;
    entity.ndoc =       fvalue.ndoc;
    entity.telefono =   fvalue.telefono;
    entity.osocial =    fvalue.osocial;
    entity.osocialTxt =    fvalue.osocialTxt;
    entity.tipo =       fvalue.tipo;

		entity.estado = entity.estado || 'activo';
    entity.novedades = novedades || [];

    let locacion = entity.locacion || new Locacion();
		locacion.street1 =       fvalue.street1;
		locacion.streetIn =      fvalue.streetIn;
		locacion.streetOut =     fvalue.streetOut;
		locacion.city =          fvalue.city;
		locacion.barrio =        fvalue.barrio;

		entity.locacion = locacion;

    entity.sintomacovid = this.buildCovid(fvalue, entity);

    let requirente = entity.requeridox|| new Requirente();
    requirente.slug =     fvalue.apellido + ', ' + fvalue.nombre;
    requirente.nombre =   fvalue.nombre;
    requirente.apellido = fvalue.apellido;
    requirente.tdoc =     fvalue.tdoc;
    requirente.ndoc =     fvalue.ndoc;

    entity.requeridox =   requirente;

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
    covid.sintomas =           fvalue.sintomas;

    covid.hasViaje =           fvalue.hasViaje;
    covid.hasContacto =        fvalue.hasContacto;
    covid.hasEntorno =         fvalue.hasEntorno;
    covid.contexto =           fvalue.contexto;

    covid.indicacion = 'Permanecer aislado controlando los síntomas';

    return covid;
  }


  public getNovedadTxt(novedad: Novedad){
        let tnovedad = AsistenciaHelper.getPrefixedOptionLabel('novedades', '', novedad.tnovedad);
        return tnovedad + ' :: ' + novedad.novedad;

  }

  public getAuditNovedad(novedad: Novedad){
    let audit = ''
    let ts, sector, fecha, fecha_txt;

    let atendido = novedad.atendidox;

    if(atendido){
      ts =  atendido.slug;
      sector = atendido.sector;
      fecha = new Date(novedad.fecomp_tsa);

      fecha_txt = fecha ? fecha.toString() : novedad.fecomp_txa ;
      audit = `${ts} Sector: ${sector} ${fecha_txt}`
    }

    return audit;
  }

  private buildCovidData(){
    let covid = this.token.sintomacovid;
    if(!covid) return;

    this.indicacion = covid.indicacion;
    this.fiebreTxt = covid.hasFiebre ? covid.fiebreTxt + ' :: ' + covid.fiebre + 'C' :  covid.fiebreTxt ;
    this.sintomasTxt = 'Sintomas: ' + (covid.hasDifRespiratoria ? ' + DIF RESPIRATORIA':'') + (covid.hasTos ? ' + TOS':'') + (covid.hasDolorGarganta ? ' + DolorGarganta':'') + (covid.sintomas ? ' = ' + covid.sintomas :'') 
    this.contagioTxt = 'Contexto: ' + (covid.hasViaje ? ' + VIAJÓ':'') + (covid.hasContacto ? ' + CONTACTO C/COVID':'') + (covid.hasEntorno ? ' + ENTORNO C/COVID':'');
    this.contexto = covid.contexto;

  }


  private buildData(){
  	this.action = AsistenciaHelper.getPrefixedOptionLabel('actions', '', this.token.action);
    this.sector = AsistenciaHelper.getPrefixedOptionLabel('sectores', 'Sector', this.token.sector);
    this.solicitante = this.token.requeridox.slug + (this.token.edad ? '('+ this.token.edad + ')' : '')  + (this.token.sexo ? '('+ this.token.sexo + ')' : '') + ' :: DNI: ' + this.token.ndoc + ' ::  ' + this.token.telefono;
  	this.cPrefix = this.token.compPrefix;
  	this.cName = this.token.compName;
  	this.cNum = this.token.compNum;  
  	this.slug = this.token.slug;
  	this.description = this.token.description;
  	this.fecha = this.token.fecomp_txa;
    this.estado =  AsistenciaHelper.getPrefixedOptionLabel('estado', 'Estado', this.token.estado);

    this.avance =  AsistenciaHelper.getPrefixedOptionLabel('avance', this.estado, this.token.avance);
    this.locacionTxt = this.buildDireccion()

  }

  private buildDireccion(): string {
  	let direccion = '';
  	let data = this.token.locacion;

  	if(data){
  		direccion = data.street1
  		if(data.streetIn || data.streetOut){
  			if(data.streetIn && data.streetOut){
  				direccion += 'Entre: ' + data.streetIn + ' y ' + data.streetOut;

  			}else {
  				direccion += 'Esquina: ' + data.streetIn + ' ' + data.streetOut;
  			}
  		}

  		direccion += ' : ' + data.city 
  		direccion += ' : ' + data.barrio

  	}
  	return direccion;
  }

  private buildWorkflow(token: Asistencia){
  	let wrkflw = [];

  	if(token && token.avance){
  		wrkflw = this.workflowOptList[token.avance]|| []
  	}

  	return wrkflw;
  }


  private buildNovedades_view(token: Asistencia){
    let items = token.novedades;
    if(items && items.length){
      this.novedadesList = items.map(nov => {
        let tnovedad = AsistenciaHelper.getPrefixedOptionLabel('novedades', '', nov.tnovedad);
        let novedad = nov.novedad;
        let audit = this.buildNovedadesFollowUp(nov);
        return {tnovedad, novedad, audit}

      })
    }

  }

  private buildNovedadesFollowUp(novedad: Novedad){
    let audit = ''
    let ts, sector, fecha, fecha_txt;

    let atendido = novedad.atendidox;

    if(atendido){
      ts =  atendido.slug;
      sector = atendido.sector;
      fecha = new Date(novedad.fecomp_tsa);

      fecha_txt = fecha ? fecha.toString() : novedad.fecomp_txa ;
      audit = `${ts} Sector: ${sector} ${fecha_txt}`
    }

    return audit;
  }

  private buildAudit(token: Asistencia):string{
    let audit = ''
    let ts, sector, fecha, fecha_txt;
    let atendido = token.atendidox;

    if(atendido){
      ts =  atendido.slug;
      sector = atendido.sector;
      fecha = new Date(token.ts_prog);
      fecha_txt = fecha ? fecha.toString(): '';
      audit = `${ts} Sector: ${sector} ${fecha_txt}`
    }

    return audit;
  }

  setNewState(token, step){

  }

	changeCity() {
	    this.barrioList = personModel.getBarrioList(this.form.value.city);
	  //   let zip = personModel.fetchCP(this.form.value.city);
			// this.form.controls['zip'].setValue(zip);

	}
  private validateDenunciaFlds(that: any): ValidatorFn {

      return ((control: AbstractControl) : {[key: string]: any} | null  => {
          
          return !control.value && that.form && that.form.controls['tipo'].value == 2  ?  {'invalidAge': true} : null

      }) ;

  }

  private validateCovidFlds(that: any): ValidatorFn {

      return ((control: AbstractControl) : {[key: string]: any} | null  => {

          return !control.value && that.form && that.form.controls['tipo'].value == 1  ?  {'invalidAge': true} : null

      }) ;

  }

}
