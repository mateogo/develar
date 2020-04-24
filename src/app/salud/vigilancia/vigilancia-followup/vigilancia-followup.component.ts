import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MatDialog } from '@angular/material/dialog';

import { PersonService } from '../../person.service';

import { Person, FamilyData, personModel, Address } from '../../../entities/person/person';

import {  Asistencia, 
          ContextoCovid,
          ContextoDenuncia,
          Locacion,
          Requirente,
          Novedad,
          MuestraLaboratorio, 
          UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../asistencia/asistencia.model';

import { devutils }from '../../../develar-commons/utils'

//modals
import { VigilanciaSisaComponent } from '../vigilancia-zmodal/vigilancia-sisa/vigilancia-sisa.component';
import { VigilanciaSisafwupComponent } from '../vigilancia-zmodal/vigilancia-sisafwup/vigilancia-sisafwup.component';
import { VigilanciaSisahistoryComponent } from '../vigilancia-zmodal/vigilancia-sisahistory/vigilancia-sisahistory.component';

import { VigilanciaSeguimientoComponent } from '../vigilancia-zmodal/vigilancia-seguimiento/vigilancia-seguimiento.component';
import { VigilanciaSeguimientofwupComponent } from '../vigilancia-zmodal/vigilancia-seguimientofwup/vigilancia-seguimientofwup.component';
import { VigilanciaSeguimientohistoryComponent } from '../vigilancia-zmodal/vigilancia-seguimientohistory/vigilancia-seguimientohistory.component';

import { VigilanciaInfeccionComponent }   from '../vigilancia-zmodal/vigilancia-infeccion/vigilancia-infeccion.component';
import { VigilanciaLaboratorioComponent } from '../vigilancia-zmodal/vigilancia-laboratorio/vigilancia-laboratorio.component';
import { VigilanciaVinculosComponent }    from '../vigilancia-zmodal/vigilancia-vinculos/vigilancia-vinculos.component';


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
  selector: 'vigilancia-followup',
  templateUrl: './vigilancia-followup.component.html',
  styleUrls: ['./vigilancia-followup.component.scss']
})
export class VigilanciaFollowupComponent implements OnInit {
	@Input() asistencia: Asistencia;
  @Input() detailView = true;
  @Input() viewList: Array<String> = [];
	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();
  @Output() fetchPerson = new EventEmitter<string>();

  public muestraslabList: Array<MuestraLaboratorio> = [];
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
  public prioridadOptList = AsistenciaHelper.getOptionlist('prioridad');

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

  private person: Person;
  private familyList: Array<FamilyData> = [];
  
  private formAction = "";
  private fireEvent: UpdateAsistenciaEvent;


  public novedadesTitle = 'EVOLUCIÓN';

  // manageAsistenciaView
  public showAsistenciaView = true;
  public showEditor = false;

  // asistencia





  constructor(
  	private fb: FormBuilder,
    public dialog: MatDialog,
    private perSrv: PersonService,

  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
  	this.buildData();
    this.buildCovidData();

    // if(this.asistencia.avance === 'autorizado'){
    //   this.avance = 'AUTORIZADO';
    // }else{

    //   this.avance = 'Pend Autorización';
    // }

    this.buildNovedades_view(this.asistencia);
    this.buildMuestrasLaboratorio(this.asistencia);

    this.audit = this.buildAudit(this.asistencia);

    this.nextStepOptList = this.buildWorkflow(this.asistencia);

  	this.initForEdit(this.form, this.asistencia);

  }


  viewPanelsSelected(e){
    e.source._checked = false;

    if(!(e && e.value && e.value.length)) return;

    this.manageAsistenciaView(e.value)
  }

  actionTriggered(e){
    e.source._checked = false;
    this.manageModalEditors(e.value);
  
  }

  editLaboratorio(e){
    e.source._checked = false;
    this.openLaboratorioModal(e.value);
  }

  editVinculo(vinculo: FamilyData ){
    this.buildVinculosFam(this.asistencia, vinculo )
  }

  vinculoSelected(personId: string){
    //TODO
    this.fetchPerson.next(personId);
  }

  private manageAsistenciaView(viewList){
    this.showAsistenciaView = false;
    this.viewList = viewList;

    setTimeout(() => {
      this.showAsistenciaView = true;
    },70)
  }


  public manageModalEditors(token: string){
    if(token === 'sisa')          this.openSisaModal()
    if(token === 'sisafwup')      this.openSisaFwUpModal()
    if(token === 'historialsisa') this.openSisaHistoryModal()

    if(token === 'seguimiento')          this.openSeguimientoModal()
    if(token === 'seguimientofwup')      this.openSeguimientoFwUpModal()
    if(token === 'historialseguimiento') this.openSeguimientoHistoryModal()

    if(token === 'infection')     this.openInfectionModal()

    if(token === 'laboratorio')   this.openLaboratorioModal(null)
    if(token === 'vinculofam')   this.buildVinculosFam(this.asistencia, null);
  }

  private openVinculofamModal(person: Person, vinculo: FamilyData){
    const dialogRef = this.dialog.open(
      VigilanciaVinculosComponent,
      {
        width: '800px',
        data: {
          asistencia: this.asistencia,
          person: person,
          vinculo: vinculo,
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private openLaboratorioModal(muestralab: MuestraLaboratorio){
    const dialogRef = this.dialog.open(
      VigilanciaLaboratorioComponent,
      {
        width: '800px',
        data: {
          asistencia: this.asistencia,
          laboratorio: muestralab
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private openInfectionModal(){
    const dialogRef = this.dialog.open(
      VigilanciaInfeccionComponent,
      {
        width: '800px',
        data: {
          asistencia: this.asistencia,
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private openSeguimientoModal(){
    const dialogRef = this.dialog.open(
      VigilanciaSeguimientoComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      // c onsole.log('dialog CLOSED')
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }

    });    
  }

  private openSeguimientoFwUpModal(){
    const dialogRef = this.dialog.open(
      VigilanciaSeguimientofwupComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {

      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }
  
  private openSeguimientoHistoryModal(){
    const dialogRef = this.dialog.open(
      VigilanciaSeguimientohistoryComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }






  private openSisaHistoryModal(){
    const dialogRef = this.dialog.open(
      VigilanciaSisahistoryComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      // c onsole.log('dialog CLOSED')
    });    
  }

  private openSisaModal(){
    const dialogRef = this.dialog.open(
      VigilanciaSisaComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private openSisaFwUpModal(){
    const dialogRef = this.dialog.open(
      VigilanciaSisafwupComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private buildVinculosFam(token: Asistencia, vinculo: FamilyData){

    let personId = token.requeridox && token.requeridox.id

    if(!personId){
      return;
    }

    this.perSrv.fetchPersonById(personId).then(per => {
      if(per){
        this.person = per;
        this.familyList = per.familiares || [];
        this.openVinculofamModal(this.person, vinculo)

      }else {

        return;
      }
    })

  }





	buttonActionEvent(e, step){
		this.initForSave(this.form, this.asistencia);
  	this.formAction = EVOLUCION;
  	this.asistencia = AsistenciaHelper.workfloStep(this.asistencia, step);
  	this.emitEvent(this.formAction);
	}

  noContestaEvent(){
    this.initForSave(this.form, this.asistencia);
    this.formAction = EVOLUCION;
    this.asistencia = AsistenciaHelper.addNoContesta(this.asistencia);
    this.emitEvent(this.formAction);
  }

  onSubmit(){
  	this.initForSave(this.form, this.asistencia);
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
  		token: this.asistencia
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
      
      if(this.asistencia.avance === val && this.asistencia.estado){
        this.form.get('estado').setValue(this.asistencia.estado);

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
      prioridad:   [null],

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

      denunciante:  [null, [this.validateDenunciaFlds(this)]],
      dendoc:       [null, [this.validateDenunciaFlds(this)]],
      dentel:       [null, [this.validateDenunciaFlds(this)]],
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
      prioridad:   token.prioridad || 2,

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
    entity.osocialTxt = fvalue.osocialTxt;
    entity.tipo =       fvalue.tipo;
    entity.prioridad =  fvalue.prioridad;

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
    let covid = this.asistencia.sintomacovid;
    if(!covid) return;

    this.indicacion = covid.indicacion;
    this.fiebreTxt = covid.hasFiebre ? covid.fiebreTxt + ' :: ' + covid.fiebre + 'C' :  covid.fiebreTxt ;
    this.sintomasTxt = 'Sintomas: ' + (covid.hasDifRespiratoria ? ' + DIF RESPIRATORIA':'') + (covid.hasTos ? ' + TOS':'') + (covid.hasDolorGarganta ? ' + DolorGarganta':'') + (covid.sintomas ? ' = ' + covid.sintomas :'') 
    this.contagioTxt = 'Contexto: ' + (covid.hasViaje ? ' + VIAJÓ':'') + (covid.hasContacto ? ' + CONTACTO C/COVID':'') + (covid.hasEntorno ? ' + ENTORNO C/COVID':'');
    this.contexto = covid.contexto;

  }


  private buildData(){
  	this.action = AsistenciaHelper.getPrefixedOptionLabel('actions', '', this.asistencia.action);
    this.sector = AsistenciaHelper.getPrefixedOptionLabel('sectores', 'Sector', this.asistencia.sector);
    this.solicitante = this.asistencia.requeridox.slug + (this.asistencia.edad ? '('+ this.asistencia.edad + ')' : '')  + (this.asistencia.sexo ? '('+ this.asistencia.sexo + ')' : '') + ' :: DNI: ' + this.asistencia.ndoc + ' ::  ' + this.asistencia.telefono;
  	this.cPrefix = this.asistencia.compPrefix;
  	this.cName = this.asistencia.compName;
  	this.cNum = this.asistencia.compNum;  
  	this.slug = this.asistencia.slug;
  	this.description = this.asistencia.description;
  	this.fecha = this.asistencia.fecomp_txa;
    this.estado =  AsistenciaHelper.getPrefixedOptionLabel('estado', 'Estado', this.asistencia.estado);

    this.avance =  AsistenciaHelper.getPrefixedOptionLabel('avance', this.estado, this.asistencia.avance);
    this.locacionTxt = this.buildDireccion()

  }

  private buildDireccion(): string {
  	let direccion = '';
  	let data = this.asistencia.locacion;

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

  private buildMuestrasLaboratorio(token: Asistencia){
    this.muestraslabList = token.muestraslab || [];

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
