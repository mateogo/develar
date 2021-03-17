import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { CustomValidators } from 'ng2-validation';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map  }   from 'rxjs/operators';

import { AyudaEnLineaService } from '../../../../../develar-commons/ayuda-en-linea.service';

import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService, UpdateEvent } from '../../../../censo-service';

import { 	CensoIndustrias, 
					EstadoCenso, 
					Empresa, 
					CensoExpectativas,
					CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'
const TOKEN_TYPE = 'expectativas';
const BIENES = 'bien';
const CANCEL = 'cancel';
const UPDATE = 'update';
const PAGE_ABSOLUTE =   '/mab/empresas/inicio';
const CENSO_ABSOLUTE =  '/mab/empresas/gestion/censo2021';
const CENSO_BIENES =      '/mab/empresas/gestion/censo2021/actividad/:id';
const ACTUAL_CENSO = "censo:empresarial:2021:01";

@Component({
  selector: 'censo-expectativas-edit',
  templateUrl: './censo-expectativas-edit.component.html',
  styleUrls: ['./censo-expectativas-edit.component.scss']
})
export class CensoExpectativasEditComponent implements OnInit {
	@Input() token: CensoExpectativas;
	@Output() updateToken = new EventEmitter<UpdateEvent>();

	public form: FormGroup;
  public showForm = false;

  private action = "";

  public nactividadOptList = CensoIndustriasService.getOptionlist('nactividad');
  public varactividadOptList = CensoIndustriasService.getOptionlist('varactividad');
  public factoresOcupacionOptList = CensoIndustriasService.getOptionlist('factoresOcupacion');

  public factores$ = new BehaviorSubject<OptListToken[]>([]);
  public factoresLimitantes: Array<OptListToken> = [];

  //public tipoOptList =   CensoIndustriasService.getOptionlist('tipoBienes');
  
  public title = "Estado actual, expectativas y proyección";
  public texto1 = "Tomando como referencia los últimos 3 años, indique la proyección y expectativas";
  public texto2: string;

  private unBindList = [];

  public codigo = {
    ayuda1: "censo:censo-expectativas:01",
    ayuda2: "censo:censo-expectativas:02"
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

  private initComponent(){
    this.form = this.buildForm();
    this.initForEdit(this.form, this.token);
    this.showForm = true;
  }

  private initForEdit(form: FormGroup, token: CensoExpectativas): FormGroup {

		form.reset({
      type:             token.type,
		  slug:             token.slug,
      nactividad:       token.nactividad,
      tocupacion:       token.tocupacion,
      nactividad_var:   token.nactividad_var,
      qempleados_mod:   token.qempleados_mod,
      qhorasprod_mod:   token.qhorasprod_mod,
      capinstalada_mod: token.capinstalada_mod,
      vtaexter_mod:     token.vtaexter_mod,
      vtalocal_mod:     token.vtalocal_mod,
      fplenaocupacion:  token.fplenaocupacion,  

      fortaleza1:     token.fortaleza1,
      fortaleza2:     token.fortaleza2,
      fortaleza3:     token.fortaleza3,
      debilidad1:     token.debilidad1,
      debilidad2:     token.debilidad2,
      debilidad3:     token.debilidad3,
      oportunidad1:   token.oportunidad1,
      oportunidad2:   token.oportunidad2,
      oportunidad3:   token.oportunidad3,
      amenaza1:       token.amenaza1,
      amenaza2:       token.amenaza2,
      amenaza3:       token.amenaza3,



		});

    if(token.factoresList && token.factoresList.length){
      this.factoresLimitantes  =   token.factoresList.map(t => CensoIndustriasService.getOptionToken('factoresOcupacion', t));
      this.emitFactores(this.factoresLimitantes);
    }

		return form;
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
    if(type === 'fplenaocupacion'){
      let token = this.factoresLimitantes.find(t => t.val === val);
      
      if(!token){
        this.factoresLimitantes.push(CensoIndustriasService.getOptionToken('factoresOcupacion', val));
        this.emitFactores(this.factoresLimitantes);
      }
    }
  }

  removeFactor(item){
    let token  = this.factoresLimitantes.find(t => t.val === item.val);
    if(token){
      let index = this.factoresLimitantes.indexOf(token);     
      this.factoresLimitantes.splice(index,1);
      this.emitFactores(this.factoresLimitantes)
    }

  }

  private emitFactores(factores: Array<OptListToken>){
    this.factores$.next(factores);
  }

 
  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({

		  slug:             [ null, Validators.compose([Validators.required]) ],
      type:             [ null ],
      nactividad:       [ null ],
      tocupacion:       [ null ],
      nactividad_var:   [ null ],
      qempleados_mod:   [ null ],
      qhorasprod_mod:   [ null ],
      capinstalada_mod: [ null ],
      vtaexter_mod:     [ null ],
      vtalocal_mod:     [ null ],
      fplenaocupacion:  [ null ],
      fortaleza1:       [ null ],
      fortaleza2:       [ null ],
      fortaleza3:       [ null ],
      debilidad1:       [ null ],
      debilidad2:       [ null ],
      debilidad3:       [ null ],
      oportunidad1:     [ null ],
      oportunidad2:     [ null ],
      oportunidad3:     [ null ],
      amenaza1:         [ null ],
      amenaza2:         [ null ],
      amenaza3:         [ null ],


    });
    return form;
  }


 	private initForSave(form: FormGroup, entity: CensoExpectativas): CensoExpectativas {
		const fvalue = form.value;
		const today = new Date();
		let feDate = devutils.dateFromTx(fvalue.fecomp_txa);

		entity.slug =             fvalue.slug;
		entity.type =             fvalue.type;
    entity.nactividad =       fvalue.nactividad;
    entity.tocupacion =       fvalue.tocupacion;
    entity.nactividad_var =   fvalue.nactividad_var;
    entity.qempleados_mod =   fvalue.qempleados_mod;
    entity.qhorasprod_mod =   fvalue.qhorasprod_mod;
    entity.capinstalada_mod = fvalue.capinstalada_mod;
    entity.vtaexter_mod =     fvalue.vtaexter_mod;
    entity.vtalocal_mod =     fvalue.vtalocal_mod;
    entity.fplenaocupacion =  fvalue.fplenaocupacion;

    entity.fortaleza1 = fvalue.fortaleza1;
    entity.fortaleza2 = fvalue.fortaleza2;
    entity.fortaleza3 = fvalue.fortaleza3;

    entity.debilidad1 = fvalue.debilidad1;
    entity.debilidad2 = fvalue.debilidad2;
    entity.debilidad3 = fvalue.debilidad3;
    
    entity.oportunidad1 = fvalue.oportunidad1;
    entity.oportunidad2 = fvalue.oportunidad2;
    entity.oportunidad3 = fvalue.oportunidad3;
    
    entity.amenaza1 = fvalue.amenaza1;
    entity.amenaza2 = fvalue.amenaza2;
    entity.amenaza3 = fvalue.amenaza3;

    if(this.factoresLimitantes && this.factoresLimitantes.length){
      entity.factoresList  =   this.factoresLimitantes.map(t => t.val);
    } else {
      entity.factoresList = [];
    }

		return entity;
	}

}

interface OptListToken {
  val: string;
  label: string;
}
