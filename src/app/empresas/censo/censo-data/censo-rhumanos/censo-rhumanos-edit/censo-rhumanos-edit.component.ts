import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup,FormArray, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { CustomValidators } from 'ng2-validation';

import { BehaviorSubject } from 'rxjs';
import { map  }   from 'rxjs/operators';

import { AyudaEnLineaService } from '../../../../../develar-commons/ayuda-en-linea.service';

import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService, UpdateEvent } from '../../../../censo-service';

import { 	CensoIndustrias, 
					EstadoCenso,
          NodoSeccion,
          CrecimientoEmpleados,
					CensoRecursosHumanos,
          OptListToken,
					CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'
import { MAT_SLIDE_TOGGLE_VALUE_ACCESSOR } from '@angular/material/slide-toggle';
const TOKEN_TYPE = 'rhumanos';
const BIENES = 'bien';
const CANCEL = 'cancel';
const UPDATE = 'update';
const PAGE_ABSOLUTE =   '/mab/empresas/inicio';
const CENSO_ABSOLUTE =  '/mab/empresas/gestion/censo2021';
const CENSO_BIENES =      '/mab/empresas/gestion/censo2021/actividad/:id';
const ACTUAL_CENSO = "censo:empresarial:2021:01";

@Component({
  selector: 'censo-rhumanos-edit',
  templateUrl: './censo-rhumanos-edit.component.html',
  styleUrls: ['./censo-rhumanos-edit.component.scss']
})
export class CensoRhumanosEditComponent implements OnInit {
	@Input() token: CensoRecursosHumanos;
	@Output() updateToken = new EventEmitter<UpdateEvent>();

	public form: FormGroup;
  public showForm = false;

  private action = "";

  public origenOptList = CensoIndustriasService.getOptionlist('origenBienes');
  public tipoOptList =   CensoIndustriasService.getOptionlist('tipoBienes');
  public competenciaTypeOptList = CensoIndustriasService.getOptionlist('competencia');
  public seccionesOptList = CensoIndustriasService.getOptionlist('secciones');
  public competenciasOptList = CensoIndustriasService.getOptionlist('competencias');

  public title = "Planta actual y proyectada de recursos humanos";
  //public texto1 = "Apertura por nivel jerárquico y por nivel educativo. Apertura por género.";
  public texto1 = "";
  public texto2: string;

  public competencia$ = new BehaviorSubject<OptListToken[]>([]);
  public competenciasBuscadas: Array<OptListToken> = [];

  nivelEducativoList: Array<NodoSeccion> = [];
  nivelJerarquicoList: Array<NodoSeccion> = [];

  private unBindList = [];

  public codigo = {
    ayuda1: "censo:censo-rhumanos:01",
    ayuda2: "censo:censo-rhumanos:02"
  }

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

  onSubmit(){
  	this.initForSave(this.form, this.token);
  	this.action = UPDATE;
  	this.emitEvent(this.action);
  }

  onCancel(){
  	this.action = CANCEL;
  	this.emitEvent(this.action);
  }

  hasError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  changeSelectionValue(type, val){
    if(type === 'competencia'){
      let token = this.competenciasBuscadas.find(t => t.val === val);
      
      if(!token){
        this.competenciasBuscadas.push(CensoIndustriasService.getOptionToken('competencias', val));
        this.emitFactores(this.competenciasBuscadas);
      }
    }
  }

  removeCompetencia(item){
    let token  = this.competenciasBuscadas.find(t => t.val === item.val);
    if(token){
      let index = this.competenciasBuscadas.indexOf(token);     
      this.competenciasBuscadas.splice(index,1);
      this.emitFactores(this.competenciasBuscadas)
    }

  }

  private emitFactores(factores: Array<OptListToken>){
    this.competencia$.next(factores);
  }


  get niveleseducativos(): FormArray{
    return this.form.get('niveleseducativos') as FormArray;
  }

  get nivelesjerarquicos(): FormArray{
    return this.form.get('nivelesjerarquicos') as FormArray;
  }

  private initComponent(){
    this.form = this.buildForm();
    this.initForEdit(this.form, this.token);
    this.showForm = true;
  }

  private initForEdit(form: FormGroup, token: CensoRecursosHumanos): FormGroup {
    if(!token.crecimiento){
      token.crecimiento = new CrecimientoEmpleados();
    }

		form.reset({
      type:           token.type,
      slug:           token.type,
      qempleados:     token.qempleados,
      qemplab:        token.qemplab,
      qemplnoab:      token.qemplnoab,
      competencia:    token.competencia,
      crecimiento: {
        hasCrecimiento:  token.crecimiento.hasCrecimiento,
        hasBrownEmplea:  token.crecimiento.hasBrownEmplea,
        hasDeseoBrownEmplea: token.crecimiento.hasDeseoBrownEmplea,
        qnuevos:         token.crecimiento.qnuevos,
        qsecundarios:    token.crecimiento.qsecundarios,
        qterciarios:     token.crecimiento.qterciarios,
        quniversitarios: token.crecimiento.quniversitarios,
        slug:            token.crecimiento.slug,
      }
  
		});

    if(token.competencias && token.competencias.length){
      this.competenciasBuscadas  =   token.competencias.map(t => CensoIndustriasService.getOptionToken('competencias', t));
      this.emitFactores(this.competenciasBuscadas);
    }
  
    this.nivelEducativoList = token.porNivelEducacion;
    let neducativoFG = this.nivelEducativoList.map(item => this.fb.group({
                  tipo:       [item.tipo],
                  seccion:    [item.seccion],
                  seccion_tx: [item.seccion_tx],
                  nivel:      [item.nivel],
                  nivel_tx:   [item.nivel_tx],
                  codigo:     [item.codigo],
                  qh:         [item.qh],
                  qm:         [item.qm],
                  qau:        [item.qau],

        }));
    this.form.setControl('niveleseducativos', this.fb.array(neducativoFG));

    this.nivelJerarquicoList = token.porNivelJerarquico;
    let jerarquicoFG = this.nivelJerarquicoList.map(item => this.fb.group({
                  tipo:       [item.tipo],
                  seccion:    [item.seccion],
                  seccion_tx: [item.seccion_tx],
                  nivel:      [item.nivel],
                  nivel_tx:   [item.nivel_tx],
                  codigo:     [item.codigo],
                  qh:         [item.qh],
                  qm:         [item.qm],                
                  qau:        [item.qau],

        }));
    this.form.setControl('nivelesjerarquicos', this.fb.array(jerarquicoFG));

		return form;
  }



  private emitEvent(action:string){
  	this.updateToken.next({
  		action: action,
  		token: TOKEN_TYPE,
  		payload: this.token
  	});

  }



  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({

		  slug:            [ null, Validators.compose([Validators.required]) ],
      type:            [ null ],
      qempleados:      [ null ],
      qemplab:         [ null ],
      qemplnoab:       [ null ],
      competencia:     [ null ],
      planta:          [ null ],
      crecimiento:     this.fb.group({
        hasCrecimiento:  [ null ],
        hasBrownEmplea:  [ null ],
        hasDeseoBrownEmplea: [ null ],
        qnuevos:         [ null ],
        qsecundarios:    [ null ],
        qterciarios:     [ null ],
        quniversitarios: [ null ],
        slug:            [ null ],
      }),
    
    });
    return form;
  }


 	private initForSave(form: FormGroup, entity: CensoRecursosHumanos): CensoRecursosHumanos {
		const fvalue = form.value;
    const tvalue = fvalue.crecimiento;

		const today = new Date();
		let feDate = devutils.dateFromTx(fvalue.fecomp_txa);

    entity.type = fvalue.type;
    entity.slug = fvalue.slug;
    entity.competencia = fvalue.competencia;
    entity.qempleados = fvalue.qempleados;
    entity.qemplab =        fvalue.qemplab;
    entity.qemplnoab =      fvalue.qemplnoab;

    //entity.crecimiento = fvalue.crecimiento;

    entity.crecimiento = {
      hasCrecimiento:  tvalue.hasCrecimiento,
      hasBrownEmplea:  tvalue.hasBrownEmplea,
      hasDeseoBrownEmplea: tvalue.hasDeseoBrownEmplea,
      qnuevos:         tvalue.qnuevos,
      qsecundarios:    tvalue.qsecundarios,
      qterciarios:     tvalue.qterciarios,
      quniversitarios: tvalue.quniversitarios,
      slug:            tvalue.slug,

    }
  
    if(this.competenciasBuscadas && this.competenciasBuscadas.length){
      entity.competencias  =   this.competenciasBuscadas.map(t => t.val);
    } else {
      entity.competencias = [];
    }


    const neducativoFlds: NodoSeccion[] = fvalue.niveleseducativos.map(t => {
      return Object.assign({}, t )
    })
    entity.porNivelEducacion = neducativoFlds;

    const njerarquicoFlds: NodoSeccion[] = fvalue.nivelesjerarquicos.map(t => {
      return Object.assign({}, t )
    })
    entity.porNivelJerarquico = njerarquicoFlds;

		return entity;
	}

}
