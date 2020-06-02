import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

//import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
//import { CustomValidators } from 'ng2-validation';
import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../salud.controller';

import { PersonService } from '../../person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../entities/person/person';

import {  Asistencia, 
          ContextoCovid,
          ContextoDenuncia,
          Locacion,
          Requirente,
          Novedad,
          MuestraLaboratorio, 
          UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../asistencia/asistencia.model';

import { devutils }from '../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';

const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';
const EVOLUCION = 'evolucion';


@Component({
  selector: 'vigilancia-novedad',
  templateUrl: './vigilancia-novedad.component.html',
  styleUrls: ['./vigilancia-novedad.component.scss']
})
export class VigilanciaNovedadComponent implements OnInit {
	@Input() asistencia: Asistencia;
	@Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

	public form: FormGroup;
  private formAction = "";

  public prioridadOptList = AsistenciaHelper.getOptionlist('prioridad');
  public novedadOptList = AsistenciaHelper.getOptionlist('novedadesEvolucion');

  public novedadesList = [];
  public novedadesTitle = 'EVOLUCIÓN';

  public audit;

  constructor(
    public dialog: MatDialog,
    private perSrv: PersonService,
    private dsCtrl: SaludController,
  	private fb: FormBuilder,
  	) { 
  	this.form = this.initForm();

  }

  ngOnInit() {

  	this.initForEdit(this.form, this.asistencia);

    this.buildNovedades_view(this.asistencia);

    this.audit = this.buildAudit(this.asistencia);
  }

  /*********************/
  /**** UI Events *****/
  /*******************/
  addNovedad(){
    let item = new Novedad();
    let novedadFG = this.fb.group(item);
    let formArray = this.form.get('novedades') as FormArray;
    formArray.push(novedadFG);

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

  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }

	getNovedadTxt(novedad: Novedad){
		let tnovedad = AsistenciaHelper.getPrefixedOptionLabel('novedades', '', novedad.tnovedad);
		return tnovedad + ' :: ' + novedad.novedad;
  }

	getAuditNovedad(novedad: Novedad){
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

  get novedades(): FormArray{
    return this.form.get('novedades') as FormArray;
  }

  private initForm(): FormGroup{
  	let form: FormGroup;

  	form = this.fb.group({
			algo: [null],  		
      prioridad:   [null],
  	})

		return form;
  }

  private initForEdit(form: FormGroup, token: Asistencia): FormGroup {

		form.reset({
			algo: 'DummyField',
      prioridad:   token.prioridad || 2,
		});

    this.buildNovedades(token.novedades)
		return form;
  }

 private buildNovedades(novedades: Novedad[]){
    novedades = novedades || [];
    let novedadesFG = novedades.map(novedad => this.fb.group(novedad))
    let novedadesFormArray = this.fb.array(novedadesFG);
    this.form.setControl('novedades', novedadesFormArray);
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

	initForSave(form: FormGroup, token: Asistencia): Asistencia {
		const fvalue = form.value;
		const entity = token;
    const novedades: Novedad[] = fvalue.novedades.map(t => Object.assign({}, t))

    entity.prioridad =  fvalue.prioridad;

		return entity;
	}

	emitEvent(action:string){
		this.updateToken.next({
			action: action,
			type: TOKEN_TYPE,
		  selected: true,
			token: this.asistencia
		});
	}



}
