import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, AbstractControl, ValidatorFn, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';
import {  Asistencia,
          Requirente,
          ContextoCovid,
          ContextoDenuncia,
          Novedad, 
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
  selector: 'solcovid-edit',
  templateUrl: './solcovid-edit.component.html',
  styleUrls: ['./solcovid-edit.component.scss']
})
export class SolcovidEditComponent implements OnInit {
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

  public tcompPersonaFisica = personModel.tipoDocumPF;
  public sexoOptList        = personModel.sexoList;

	public form: FormGroup;

  public showViewAlimento = false;
  public showEditAlimento = false;

  private formAction = "";
  private fireEvent: UpdateAsistenciaEvent;

  public novedadesTitle = 'Seguimiento de novedades relativas a esta SOLICITUD';
  public currentEventTxt = '';

  public isCovid = false;
  public isDenuncia = false;
  public showButtons = false;
  public tipoEdit = 1;


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

      denunciante: [null, [this.validateDenunciaFlds(this)]],
      dendoc:      [null, [this.validateDenunciaFlds(this)]],
      dentel:      [null, [this.validateDenunciaFlds(this)]],
      inombre:     [null, [this.validateDenunciaFlds(this)]],
      iapellido:   [null, [this.validateDenunciaFlds(this)]],
      islug:       [null, [this.validateDenunciaFlds(this)]],

      fiebre:           [null],
      fiebreRB:         [null],

      hasDifRespiratoria: [null],
      hasDolorGarganta:   [null],
      hasTos:             [null],
      sintomas:           [null],

      hasViaje:           [null],
      hasContacto:        [null],
      hasEntorno:         [null],
      contexto:           [null],


    });

    return form;
  }

  private initForEdit(form: FormGroup, token: Asistencia): FormGroup {
    this.currentEventTxt = token._id ? 'Editando S/Asis ' + token.compNum + ' ' + token.fecomp_txa  : 'NUEVO EVENTO'

    let sintomaCovid = token.sintomacovid || new ContextoCovid();
    let denunciaCovid = token.denuncia || new ContextoDenuncia();
    let requirente = token.requeridox || new Requirente();
    let fiebreOptions = 1;

    token.tipo = token.tipo || 1;

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

		});
//https://malcoded.com/posts/angular-ngif-else/


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
    //https://medium.com/better-programming/expressionchangedafterithasbeencheckederror-in-angular-what-why-and-how-to-fix-it-c6bdc0b22787
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
    entity.sexo =       fvalue.sexo;
    entity.edad =       fvalue.edad;
    entity.tipo =       fvalue.tipo;

    entity.prioridad =  fvalue.prioridad;

		entity.estado = entity.estado || 'activo';
    entity.novedades = novedades || [];

    entity.sintomacovid = this.buildCovid(fvalue, entity);
    entity.denuncia = this.buildDenuncia(fvalue, entity);

    entity.avance = (entity.avance === 'emitido' && entity.tipo == 2) ? 'denuncia' : entity.avance || 'emitido';
    entity.avance = (entity.avance === 'denuncia' && entity.tipo == 1) ? 'emitido' : entity.avance || 'emitido';

    
		return entity;
	}

  private leyendaFiebre(valor): string{
    if(!valor || valor >3 || valor <1) valor = 3
    return FIEBRE_TXT[valor-1]
  }

  private buildDenuncia(fvalue, entity: Asistencia): ContextoDenuncia{
    let denuncia;

    if(entity.tipo == 2 ) {
      denuncia = entity.denuncia || new ContextoDenuncia();
      denuncia.denunciante =    fvalue.denunciante;
      denuncia.dendoc =         fvalue.dendoc;
      denuncia.dentel =         fvalue.dentel;
      denuncia.inombre =        fvalue.inombre;
      denuncia.iapellido =      fvalue.iapellido;
      denuncia.islug =          fvalue.islug;
    }else{
      denuncia = entity.denuncia;
    }

    return denuncia;
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

  private validateDenunciaFlds(that: any): ValidatorFn {

      return ((control: AbstractControl) : {[key: string]: any} | null  => {
          
          return !control.value && that.form && that.form.controls['tipo'].value == 2  ?  {'invalidTel': true} : null

      }) ;

  }

  private validateCovidFlds(that: any): ValidatorFn {

      return ((control: AbstractControl) : {[key: string]: any} | null  => {

          return !control.value && that.form && that.form.controls['tipo'].value == 1  ?  {'invalidTel': true} : null

      }) ;

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

  public onBlurDocNum(e){
    this.form.get('dendoc').setValue(this.form.get('ndoc').value);
  }

  public onBlurTel(e){
    this.form.get('dentel').setValue(this.form.get('telefono').value);
  }

  public onBlurDenunTel(e){
    let tel = this.form.get('telefono').value;
    if(!tel) this.form.get('telefono').setValue(this.form.get('dentel').value);
  }

  public changeTipo(e){
    this.showButtons = false;

    this.form.get('tipo').setValue(e);
    this.initForSave(this.form, this.token);
    this.initForEdit(this.form, this.token);

    setTimeout(()=> {
      this.tipoEdit = e;
      if(this.tipoEdit === 1){
        this.isDenuncia = false
        this.isCovid = true;

      }else{
        this.isCovid = false
        this.isDenuncia = true

      }
      setTimeout(()=>{

        this.showButtons = true;


      },200)

    },50)
  }

}
