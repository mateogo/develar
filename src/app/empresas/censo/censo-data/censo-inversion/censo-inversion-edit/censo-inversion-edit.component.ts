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
          CensoInversion,
          FactoresInversion,
          factoresAfectanInversionOptList,
					CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'
const TOKEN_TYPE = 'inversion';
const CANCEL = 'cancel';
const UPDATE = 'update';
const PAGE_ABSOLUTE =   '/mab/empresas/inicio';
const CENSO_ABSOLUTE =  '/mab/empresas/gestion/censo2021';
const CENSO_BIENES =      '/mab/empresas/gestion/censo2021/actividad/:id';
const ACTUAL_CENSO = "censo:empresarial:2021:01";

@Component({
  selector: 'censo-inversion-edit',
  templateUrl: './censo-inversion-edit.component.html',
  styleUrls: ['./censo-inversion-edit.component.scss']
})
export class CensoInversionEditComponent implements OnInit {
	@Input() token: CensoInversion;
	@Output() updateToken = new EventEmitter<UpdateEvent>();

	public form: FormGroup;
  public showForm = false;

  private action = "";

  private _factores: Array<FactoresInversion> = [];

  public origenOptList = CensoIndustriasService.getOptionlist('origenBienes');
  public tipoOptList =   CensoIndustriasService.getOptionlist('tipoBienes');
  public competenciaTypeOptList = CensoIndustriasService.getOptionlist('competencia');
  public factoresInversionOptList = CensoIndustriasService.getOptionlist('factoresInversion');

  public typeOptList = CensoIndustriasService.getOptionlist('inversionType');
  public stypeOptList = [];
  public financiamientoOptList = CensoIndustriasService.getOptionlist('fuenteFinanciamiento');

  public title = "Describa el tipo de plan de inversión";
  public texto1 = "";
  public texto2: string;

  private factoresInversionList: Array<FactoresInversion> = []
  private unBindList = [];


  public codigo = {
    ayuda1: "censo:censo-inversion:01",
    ayuda2: "censo:censo-inversion:02"
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

  deleteToken(){
    
  }

  /***** Template Helpers ******/
  tableColStyle(tipoCol: string){
    if(true){
      return {'font-size':'1.2em', 'color':'#0645f5'}
    }else{
      return {};
    }    
  }

  get factores(): FormArray{
    return this.form.get('factores') as FormArray;
  }

  private initComponent(){
    this.form = this.buildForm();
    this.initForEdit(this.form, this.token);
    this.showForm = true;
  }

  // ftype:     string = '';
	// flabel:    string = '';
	// impacto:   string = '';
	// alienta:   boolean = false;
	// dificulta: boolean = false;
	// slug:      string = '';

  private initForEdit(form: FormGroup, token: CensoInversion): FormGroup {
    let factores = token.factores || [];

    let factoresList = factoresAfectanInversionOptList.map(f =>{
			let factor = new FactoresInversion(f.val, f.label);
      let oldData = factores.find(t => t.ftype === f.val);

      if(oldData){
        factor.impacto = oldData.impacto;
        factor.alienta = oldData.alienta;
        factor.dificulta = oldData.dificulta;
        factor.slug = oldData.slug;
      }
      return factor;
		});

    token.factores = factoresList;

		form.reset({
      type:         token.type,
      stype:        token.stype,
      hasRealizado: token.hasRealizado,
      isPrevisto:   token.isPrevisto,
      fuenteFinan:  token.fuenteFinan,
      slug:         token.slug
    });

    this.stypeOptList = CensoIndustriasService.populateSTypeOptList('stype', token.type, this.form);
    
    this._factores = token.factores;
    let factoresFG = this._factores.map(mercado => this.fb.group({
                  ftype:     [mercado.ftype],
                  flabel:    [mercado.flabel],
                  impacto:   [mercado.impacto],
                  alienta:   [mercado.alienta],
                  dificulta: [mercado.dificulta],
                  slug:      [mercado.slug],
    }));
    let factoresFormArray = this.fb.array(factoresFG);
    this.form.setControl('factores', factoresFormArray);

		return form;
  }

  onSubmit(){
  	this.token = this.initForSave(this.form, this.token);
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
    if(type === 'type'){
      this.stypeOptList = CensoIndustriasService.populateSTypeOptList('stype', val, this.form);
      //this.stypeOptList = this._populateSTypeOptList('stype', val);

    }

    if(type === 'stype'){
      
    }


  }

  private _populateSTypeOptList(type, val){
    let list = CensoIndustriasService.getSubOptList(type, val);
    let value = this.form.get(type).value
    let test = list.find(t => t.val === value);
    
    this.form.get(type).setValue( test ? test.val : (list.length && list[0].val) || 'no_definido' );
    return list;
  }

 
  private buildForm(): FormGroup{
  	let form: FormGroup;
    form = this.fb.group({
      type:         [null],
      stype:        [null],
      hasRealizado: [null],
      isPrevisto:   [null],
      fuenteFinan:  [null],
      slug:         [null],
      factores:     [null],
    });

    return form;
  }


 	private initForSave(form: FormGroup, entity: CensoInversion): CensoInversion {
		const fvalue = form.value;

    const factoresFlds: FactoresInversion[] = fvalue.factores.map(t => {
      return Object.assign({}, t )
    })
    entity.factores = factoresFlds;

		let feDate = devutils.dateFromTx(fvalue.fecomp_txa);
    entity.type =         fvalue.type,
    entity.stype =        fvalue.stype,
    entity.slug =         fvalue.slug;
    entity.hasRealizado = fvalue.hasRealizado,
    entity.isPrevisto =   fvalue.isPrevisto,
    entity.fuenteFinan =  fvalue.fuenteFinan,
    entity.slug =         fvalue.slug

		return entity;
	}

}
