import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Observable, Subject } from 'rxjs';

import { Antecedente, ImputacionInfracciones, antecedenteDefaultFactory } from '../model/antecedente';
import { ModelHelper } from '../model/antecedentes-helper';
import { devutils } from '../../develar-commons/utils';

import { DaoService } from '../../develar-commons/dao.service';


const LIST = '../';

@Component({
  selector: 'antecedentes-edit',
  templateUrl: './ant-edit.component.html',
  styleUrls: ['./ant-edit.component.scss']
})
export class AntEditComponent implements OnInit {
  @Input() model: Antecedente;
  @Input() inCollection: boolean = false;
  @Input() editable: boolean = true;

  @Output() add = new EventEmitter<Antecedente>();
  @Output() remove = new EventEmitter<Antecedente>();
  @Output() update = new EventEmitter<Antecedente>();

  public form: FormGroup;
  public tiposList = [];
  public tcompAntecedentes = [];
  public tcompInfracciones = [];
  public tipoInfracciones = [];
  public tipoImputaciones = [];
  public jurisdicciones = [];
  public conductorOptions = [];
  public fuentesInfraccion = [];
  public tcompPersonaFisica = [];
  public nivel_ejecucion = [];
  public estado_infraccion = [];
  public estado_pago = [];

  public isInfraccion = true;


  constructor(
  		private fb: FormBuilder,
      private daoService: DaoService
  	) {

  	this.form = this.fb.group({
  		tipo:  [null, Validators.compose([Validators.required])],
      tcomp: [null, Validators.compose([Validators.required])],
      ncomp: [null, Validators.compose([Validators.required])],
      fe_comp: [null, Validators.compose([Validators.required])],
      dominio: [null, Validators.compose([Validators.required])],
      tinfraccion: [null, Validators.compose([Validators.required])],
      fe_infrTxt: [null, Validators.compose([Validators.required])],
      jurisdiccion: [null, Validators.compose([Validators.required])],
      lugar:  [null, Validators.compose([Validators.required])],
      imputacion01: [null, Validators.compose([Validators.required])],
      imputacion02: [null],
      imputacion03: [null],
      finfraccion:  [null, Validators.compose([Validators.required])],
      dato_conductor:  [null, Validators.compose([Validators.required])],
      tdoc_conductor: [null],
      ndoc_conductor: [null],

      nivel_ejecucion: [null, Validators.compose([Validators.required])],
      estado_pago: [null, Validators.compose([Validators.required])],
      estado_infraccion: [null, Validators.compose([Validators.required])],

  	}) 
  }

  ngOnInit() {
    this.tiposList = ModelHelper.antecedentesTipoLst;

  	this.tipoInfracciones = ModelHelper.infraccionTipoLst;
  	this.tipoImputaciones = ModelHelper.imputacionTipoLst;

    this.tcompAntecedentes = ModelHelper.antecedentesCompLst;
    this.tcompInfracciones = ModelHelper.infraccionesCompLst;
    this.jurisdicciones = ModelHelper.jurisdicciones;
    this.conductorOptions = ModelHelper.conductorOptionList;
    this.fuentesInfraccion = ModelHelper.fuenteInfraccion;
    this.tcompPersonaFisica = ModelHelper.personaFisicaCompLst;
    this.nivel_ejecucion = ModelHelper.nivel_ejecucion;
    this.estado_infraccion = ModelHelper.estadoInfracion;
    this.estado_pago = ModelHelper.estadoPago;


  	this.initDataToEdit();


  }

  initDataToEdit(){
  	if(!this.model){
  		this.model = antecedenteDefaultFactory();
  	}

  	this.formReset(this.model);

  }


  /*********  SAVE & ?? **********/
  save(target:string){
  	console.log('Save: [%s]', target);
    this.model = this.formToModel(this.form, this.model);
    console.dir(this.model);
    this.daoService.create<Antecedente>('antecedente', this.model).then(record =>{
      console.log('Promise OK');
      this.model = record;
      this.initDataToEdit();

    })

  }
  
  closeEditor(target){
    console.log('closeEditor: [%s]', target);
    //this.router.navigate([target], { relativeTo: this.route });
  }

  editCancel(){
    this.closeEditor(LIST);
  }

  formToModel(form: FormGroup, model: Antecedente): Antecedente {
  	const fvalue = form.value;

  	model.tipo = fvalue.tipo;
    model.tcomp = fvalue.tcomp;
    model.ncomp = fvalue.ncomp;
    model.fe_compTxt = fvalue.fe_comp;
    model.fe_comp = devutils.dateFromTx(fvalue.fe_comp).getTime();

    model.dominio = fvalue.dominio;
    model.jurisdiccion = fvalue.jurisdiccion;
    model.fe_infrTxt = fvalue.fe_infrTxt;
    model.fe_infr = devutils.dateFromTx(fvalue.fe_infrTxt).getTime();

    model.lugar = fvalue.lugar;
    model.tinfraccion = fvalue.tinfraccion;
    model.finfraccion = fvalue.finfraccion;
    model.imputaciones = this.buildImputaciones(fvalue);

    model.dato_conductor = fvalue.dato_conductor;
    model.tdoc_conductor = fvalue.tdoc_conductor;
    model.ndoc_conductor = fvalue.ndoc_conductor;

    model.nivel_ejecucion = fvalue.nivel_ejecucion;
    model.estado_infraccion = fvalue.estado_infraccion;

    model.isPaga = fvalue.estado_pago = 'pagada'? true: false;
    model.isFirme = ModelHelper.evalInfraccion(model);


  	return model;
  }

  buildImputaciones( fvalue): Array<ImputacionInfracciones>{
    let impu = [];
    if (fvalue.imputacion01) impu.push({tipo: fvalue.imputacion01, asunto:''});
    if (fvalue.imputacion02) impu.push({tipo: fvalue.imputacion02, asunto:''});
    if (fvalue.imputacion03) impu.push({tipo: fvalue.imputacion03, asunto:''});
    return impu;
  }

  formReset(model){
  	this.form.reset({
  		tipo: 	model.tipo,
      tcomp:   model.tcomp,
      ncomp: model.ncomp,
      fe_comp: model.fe_compTxt,
      dominio: model.dominio,
      tinfraccion: model.tinfraccion,
      finfraccion: model.finfraccion,
      lugar: model.lugar,
      fe_infrTxt: model.fe_infrTxt,
      jurisdiccion: model.jurisdiccion,
      imputacion01: ( (model.imputaciones.length > 0) ? model.imputaciones[0].tipo : ''),
      imputacion02: ( (model.imputaciones.length > 1) ? model.imputaciones[1].tipo : ''),
      imputacion03: ( (model.imputaciones.length > 2) ? model.imputaciones[2].tipo : ''),
      dato_conductor: model.dato_conductor,
      tdoc_conductor: model.tdoc_conductor,
      ndoc_conductor: model.ndoc_conductor,

      nivel_ejecucion:  model.nivel_ejecucion,
      estado_pago: model.isPaga? 'pagada': 'pendiente',
      estado_infraccion:  model.estado_infraccion,


  	});

  }

  //Template View Helpers
  getDateString(txt){
    console.log('getDate[%s] [%s]', txt,this.form.value.fe_comp );
    let date = devutils.dateFromTx(txt);
    this.form.value.fe_comp = date.toLocaleString();
    return date.toLocaleString();
  }

  changeSelectionValue(type, val){
    console.log('Change [%s] nuevo valor: [%s]', type, val);
  }


}
