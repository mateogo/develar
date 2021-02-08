import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup,FormArray, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
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
          CensoComercializacion,
          Mercado,
					CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'
const TOKEN_TYPE = 'comercializacion';
const BIENES = 'bien';
const CANCEL = 'cancel';
const UPDATE = 'update';
const PAGE_ABSOLUTE =   '/mab/empresas/inicio';
const CENSO_ABSOLUTE =  '/mab/empresas/gestion/censo2021';
const CENSO_BIENES =      '/mab/empresas/gestion/censo2021/actividad/:id';
const ACTUAL_CENSO = "censo:industrias:2020:00";



@Component({
  selector: 'censo-comercializacion-edit',
  templateUrl: './censo-comercializacion-edit.component.html',
  styleUrls: ['./censo-comercializacion-edit.component.scss']
})
export class CensoComercializacionEditComponent implements OnInit {
	@Input() token: CensoComercializacion;
	@Output() updateToken = new EventEmitter<UpdateEvent>();

	public form: FormGroup;
  public showForm = false;

  private action = "";

  public origenOptList = CensoIndustriasService.getOptionlist('origenBienes');
  public tipoOptList =   CensoIndustriasService.getOptionlist('tipoBienes');
  public competenciaTypeOptList = CensoIndustriasService.getOptionlist('competencia');

  public title = "Comercialización y Mercados";
  public texto1 = "Identifique los mercados y modos de comercialización ";
  public texto2: string;

  private unBindList = [];

  public _mercados: Array<Mercado> = [];

  public codigo = {
    ayuda1: "empresas:censo:censodata:censo-productos-edit:01",
    ayuda2: "app:turnos:turno-browse:query:dos"
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

  /***** Template Helpers ******/
  toggleTipoEmp(e, type){
    e.stopPropagation();
    e.preventDefault();

  }

  tableRowStyle(row: number){
    return {}
  }

  /***** Template Helpers ******/
  tableColStyle(tipoCol: string){
    if(true){
      return {'font-size':'1.2em', 'color':'#0645f5'}
    }else{
      return {};
    }    
  }

  get mercados(): FormArray{
    return this.form.get('mercados') as FormArray;
  }



  private initComponent(){
    this.form = this.buildForm();
    this.initForEdit(this.form, this.token);
    this.showForm = true;
  }

  private initForEdit(form: FormGroup, token: CensoComercializacion): FormGroup {

		form.reset({
      type:            token.type,
		  slug:            token.slug,
      balanzaComMonto: token.balanzaComMonto,
      balanzaComProp: token.balanzaComProp,
      balanzaImpProp: token.balanzaImpProp,
      balanzaImpMonto: token.balanzaImpMonto,
      hasPlanAumentoExpo: token.hasPlanAumentoExpo,
      hasPlanPartFeriaInt: token.hasPlanPartFeriaInt,
      hasPlanPartFeriaLoc: token.hasPlanPartFeriaLoc,
      hasPlanInvestigMerc: token.hasPlanInvestigMerc,
      hasPlanRepresExt: token.hasPlanRepresExt,
      hasOtrosPlanes: token.hasOtrosPlanes,
      planAumentoExpo: token.planAumentoExpo,
      hasPlanSustImpo: token.hasPlanSustImpo,
      planSustImpo: token.planSustImpo,
      propComerPropia: token.propComerPropia,
      propComerMayor: token.propComerMayor,
      propComerMinor: token.propComerMinor,
      propComerDigital: token.propComerDigital,
    
    });
    
    this._mercados = token.mercados;
    let mercadosFG = this._mercados.map(mercado => this.fb.group(mercado));
    let mercadosFormArray = this.fb.array(mercadosFG);
    this.form.setControl('mercados', mercadosFormArray);

		return form;
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


  hasError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }


  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);

  }

 
  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      type:     [],
		  slug:     [],
      balanzaComMonto:     [],
      mercados:     [],
      balanzaComProp:     [],
      balanzaImpProp:     [],
      balanzaImpMonto:     [],
      hasPlanAumentoExpo:     [],
      hasPlanPartFeriaInt:     [],
      hasPlanPartFeriaLoc:     [],
      hasPlanInvestigMerc:     [],
      hasPlanRepresExt:     [],
      hasOtrosPlanes:     [],
      planAumentoExpo:     [],
      hasPlanSustImpo:     [],
      planSustImpo:     [],
      propComerPropia:     [],
      propComerMayor:     [],
      propComerMinor:     [],
      propComerDigital:     [],
    

    });
    return form;
  }


 	private initForSave(form: FormGroup, entity: CensoComercializacion): CensoComercializacion {
    const fvalue = form.value;
    const monto_base = 1000;

    const mercadosFlds: Mercado[] = fvalue.mercados.map(t =>{
        t.montoVentas = t.propVentas * monto_base;
        t.montoCompras = t.propCompras * monto_base;

        return Object.assign({}, t )
      })

    entity.mercados = mercadosFlds;

		let feDate = devutils.dateFromTx(fvalue.fecomp_txa);
    entity.type = fvalue.type;
    entity.slug = fvalue.slug;
    entity.balanzaComMonto = fvalue.balanzaComMonto;
    entity.balanzaComProp = fvalue.balanzaComProp;

    entity.balanzaImpProp = fvalue.balanzaImpProp;
    entity.balanzaImpMonto = fvalue.balanzaImpMonto;

    entity.hasPlanAumentoExpo = fvalue.hasPlanAumentoExpo;
    entity.hasPlanPartFeriaInt = fvalue.hasPlanPartFeriaInt;
    entity.hasPlanPartFeriaLoc = fvalue.hasPlanPartFeriaLoc;
    entity.hasPlanInvestigMerc = fvalue.hasPlanInvestigMerc;
    entity.hasPlanRepresExt = fvalue.hasPlanRepresExt;
    entity.hasOtrosPlanes = fvalue.hasOtrosPlanes;
    entity.planAumentoExpo = fvalue.planAumentoExpo;
    entity.hasPlanSustImpo = fvalue.hasPlanSustImpo;
    entity.planSustImpo = fvalue.planSustImpo;
    entity.propComerPropia = fvalue.propComerPropia;
    entity.propComerMayor = fvalue.propComerMayor;
    entity.propComerMinor = fvalue.propComerMinor;
    entity.propComerDigital = fvalue.propComerDigital;


		return entity;
	}

}