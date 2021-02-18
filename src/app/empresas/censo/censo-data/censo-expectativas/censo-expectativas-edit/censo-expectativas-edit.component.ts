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
const ACTUAL_CENSO = "censo:industrias:2020:00";

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

  //public tipoOptList =   CensoIndustriasService.getOptionlist('tipoBienes');
  
  public title = "Expectativas y proyección";
  public texto1 = "Tomando como referencia los últimos 3 años, indique la proyección y expectativas";
  public texto2: string;

  private unBindList = [];

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
      nactividad_var:   token.nactividad_var,
      qempleados_mod:   token.qempleados_mod,
      qhorasprod_mod:   token.qhorasprod_mod,
      capinstalada_mod: token.capinstalada_mod,
      vtaexter_mod:     token.vtaexter_mod,
      vtalocal_mod:     token.vtalocal_mod,  
		});

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
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);

  }

 
  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({

		  slug:             [ null, Validators.compose([Validators.required]) ],
      type:             [ null ],
      nactividad:       [ null ],
      nactividad_var:   [ null ],
      qempleados_mod:   [ null ],
      qhorasprod_mod:   [ null ],
      capinstalada_mod: [ null ],
      vtaexter_mod:     [ null ],
      vtalocal_mod:     [ null ],
    
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
    entity.nactividad_var =   fvalue.nactividad_var;
    entity.qempleados_mod =   fvalue.qempleados_mod;
    entity.qhorasprod_mod =   fvalue.qhorasprod_mod;
    entity.capinstalada_mod = fvalue.capinstalada_mod;
    entity.vtaexter_mod =     fvalue.vtaexter_mod;
    entity.vtalocal_mod =     fvalue.vtalocal_mod;

		return entity;
	}

}
