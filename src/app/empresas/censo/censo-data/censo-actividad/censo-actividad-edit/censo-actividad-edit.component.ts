import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { CustomValidators } from 'ng2-validation';

import { Observable } from 'rxjs';
import { map  }   from 'rxjs/operators';

import { AyudaEnLineaService } from '../../../../../develar-commons/ayuda-en-linea.service';

import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService, UpdateEvent } from '../../../../censo-service';

import { 	CensoIndustrias, 
					EstadoCenso, 
					Empresa, 
					CensoActividad,
					CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'

const TOKEN_TYPE = 'actividad';
const ACTIVIDAD = 'actividad';
const CANCEL = 'cancel';
const UPDATE = 'update';
const PAGE_ABSOLUTE =   '/mab/empresas/inicio';
const CENSO_ABSOLUTE =  '/mab/empresas/gestion/censo2021';
const CENSO_ACTIVIDAD =      '/mab/empresas/gestion/censo2021/actividad/:id';
const ACTUAL_CENSO = "censo:industrias:2020:00";



@Component({
  selector: 'censo-actividad-edit',
  templateUrl: './censo-actividad-edit.component.html',
  styleUrls: ['./censo-actividad-edit.component.scss']
})
export class CensoActividadEditComponent implements OnInit {
	@Input() token: CensoActividad;
	@Output() updateToken = new EventEmitter<UpdateEvent>();

  public codigo = {
    ayuda1: "empresas:censo:censodata:censo-actividad-edit:01",
  }


	public  censoindustria: CensoIndustrias;
	private censoindustrias: CensoIndustrias[];
  private censoindustriaId: string;
  private censodata: CensoData;


	public form: FormGroup;
  public showForm = false;
  public isAlta = false;

  private action = "";

  public navanceOptList = CensoIndustriasService.getOptionlist('avance');
  public estadoOptList = CensoIndustriasService.getOptionlist('estado');
  public actividadOptList = CensoIndustriasService.getOptionlist('actividad');
  public cadenaOptList = CensoIndustriasService.getOptionlist('cadena');

  public title = "Actividades de la compañía";
  public texto1 = "Identifique la actividad en la clasificiación propuesta (Sección/Rubro/Código)";
  public texto2: string;

  public seccionOptList = [];
  public rubroOptList = [];
  public codigoOptList = [];



  private unBindList = [];



  constructor(
  	private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private censoCtrl: CensoIndustriasController,
    private _onlineHelpService : AyudaEnLineaService
  	) { 
	}

  ngOnDestroy(){
    this.unBindList.forEach(x => {x.unsubscribe()});
  }



  ngOnInit() {
    this.seccionOptList = CensoIndustriasService.getSectionOptList();

    let first = true;    
    let sscrp2 = this.censoCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;
        this.initComponent();

      }
    })
    this.unBindList.push(sscrp2);


  }


  showHelp(event : MouseEvent, key : string){
    this._onlineHelpService.showOnlineHelp(this.codigo[key]);
  }


  private initComponent(){
    this.form = this.buildForm();
    this.initForEdit(this.form, this.token);
    this.showForm = true;

  }

  private loadOrInitCenso(censo?: CensoIndustrias){

  }

  onSubmit(){
  	this.initForSave(this.form, this.token);
  	this.action = UPDATE;
  	this.emitEvent(this.action);
  }

  onCancel(){
  	this.action = CANCEL;
  	this.emitEvent(this.action);
  }


  private emitEvent(action:string){
  	this.updateToken.next({
  		action: action,
  		token: TOKEN_TYPE,
  		payload: this.token
  	});

  }

  private navigateToDashboard(){
    if(this.isAlta){
      this.router.navigate(['../'], { relativeTo: this.route });

    }else{
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  hasError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }


  changeSelectionValue(type, val){

    if(type === "seccion"){
      this.rubroOptList = this.fetchRubroOptList(val);
      let rubro = this.rubroOptList[0]

      this.codigoOptList = this.fetchCodigoOptList(rubro.val)
      let codigo = this.codigoOptList[0]

      this.form.get('rubro').setValue(rubro.val);
      this.form.get('codigo').setValue(codigo.val);
    }

    if(type === "rubro"){

      this.codigoOptList = this.fetchCodigoOptList(val)
      let codigo = this.codigoOptList[0]

      this.form.get('codigo').setValue(codigo.val);
    }

  }

  private fetchRubroOptList(val){
    return CensoIndustriasService.getRubroOptList(val)

  }

  private fetchCodigoOptList(val){
    return CensoIndustriasService.getCodigoOptList(val)

  }
 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      seccion:    [null, Validators.compose([Validators.required])],
      rubro:      [null],
      codigo:     [null],
			slug:       [null],
      anio:       [null],
      rol:        [null],
      type:       [null],
      level:      [null],
    });
    return form;
  }

  initForEdit(form: FormGroup, token: CensoActividad): FormGroup {
    this.loadOptList(token);


		form.reset({
		  slug:     token.slug,
		 	rubro:    token.rubro,
		  seccion:  token.seccion,
		  codigo:   token.codigo,
      level:    token.level,
      anio:     token.anio,
      rol:      token.rol,
      type:     token.type,
		});

		return form;
  }

  private loadOptList(token:CensoActividad){

    if(token.rubro){
      this.rubroOptList =   CensoIndustriasService.getActionOptList(token.rubro,   'rubro');
    }

    if(token.codigo){
      this.codigoOptList =  CensoIndustriasService.getActionOptList(token.rubro,  'codigo');
    }
  }

 	private initForSave(form: FormGroup, entity: CensoActividad): CensoActividad {
		const fvalue = form.value;
		const today = new Date();

		let feDate = devutils.dateFromTx(fvalue.fecomp_txa);
		entity.slug =      fvalue.slug;
		entity.rubro =     fvalue.rubro;
		entity.seccion =   fvalue.seccion;
		entity.codigo =    fvalue.codigo;
    entity.level =    fvalue.level;
    entity.type =    fvalue.type;


		return entity;
	}

}
