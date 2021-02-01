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
					CensoBienes,
					CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'
const TOKEN_TYPE = 'bienes';
const BIENES = 'bien';
const CANCEL = 'cancel';
const UPDATE = 'update';
const PAGE_ABSOLUTE =   '/mab/empresas/inicio';
const CENSO_ABSOLUTE =  '/mab/empresas/gestion/censo2020';
const CENSO_BIENES =      '/mab/empresas/gestion/censo2020/actividad/:id';
const ACTUAL_CENSO = "censo:industrias:2020:00";




@Component({
  selector: 'censo-productos-edit',
  templateUrl: './censo-productos-edit.component.html',
  styleUrls: ['./censo-productos-edit.component.scss']
})
export class CensoProductosEditComponent implements OnInit {
	@Input() token: CensoBienes;
	@Output() updateToken = new EventEmitter<UpdateEvent>();

	public form: FormGroup;
  public showForm = false;

  private action = "";

  public origenOptList = CensoIndustriasService.getOptionlist('origenBienes');
  public tipoOptList =   CensoIndustriasService.getOptionlist('tipoBienes');
  public competenciaTypeOptList = CensoIndustriasService.getOptionlist('competencia');

  public title = "Bienes estratégicos de la compañía";
  public texto1 = "Identifique los productos, materias primas, insumos y/o maquinaria utilizada";
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
    console.log('CENSO-BIENES EDIT::onDestroy!!!')
    this.unBindList.forEach(x => {x.unsubscribe()});
  }



  ngOnInit() {

    console.log('CENSO-BIENES-EDIT ON-INIT')
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
    console.log(event.type)
    console.log(this.codigo[key])
    this._onlineHelpService.showOnlineHelp(this.codigo[key]);
  }

  private initComponent(){
    this.form = this.buildForm();
    this.initForEdit(this.form, this.token);
    this.showForm = true;
  }

  private initForEdit(form: FormGroup, token: CensoBienes): FormGroup {

		form.reset({
      type:            token.type,
		  slug:            token.slug,

      tactividad:      token.tactividad,

      isImportada:     token.isImportada,
      origen:          token.origen,
      parancelaria:    token.parancelaria,

      isExportable:    token.isExportable,
      exportableTxt:   token.exportableTxt,

      isSustituible:   token.isSustituible,
      sustituibleTxt:  token.sustituibleTxt,

      isInnovacion:    token.isInnovacion,
      innovacionTxt:   token.innovacionTxt,

      destino:         token.destino,
      anio:            token.anio,
      capainstalada:   token.capainstalada,
      capautilizada:   token.capautilizada,

      competencia:       token.competencia,
      competenciaTxt:    token.competenciaTxt,
      competenciaOrigen: token.competenciaOrigen,

      level:           token.level,
		});

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
    console.log('Change [%s] nuevo valor: [%s]', type, val);

  }

 
  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({

		  slug:            [ null, Validators.compose([Validators.required]) ],
      type:            [ null ],
      tactividad:      [ null ],
      level:           [ null ],
      origen:          [ null ],
      isExportable:    [ null ],
      exportableTxt:   [ null ],
      isImportada:     [ null ],
      isInnovacion:    [ null ],
      isSustituible:   [ null ],
      parancelaria:    [ null ],
      sustituibleTxt:  [ null ],
      innovacionTxt:   [ null ],

      destino:         [ null ],
      anio:            [ null ],
      capainstalada:   [ null ],
      capautilizada:   [ null ],

      competencia:         [ null ],
      competenciaTxt:      [ null ],
      competenciaOrigen:   [ null ],

    });
    return form;
  }


 	private initForSave(form: FormGroup, entity: CensoBienes): CensoBienes {
		const fvalue = form.value;
		const today = new Date();

		let feDate = devutils.dateFromTx(fvalue.fecomp_txa);

		entity.slug =            fvalue.slug;
		entity.type =            fvalue.type;
		entity.tactividad =      fvalue.tactividad;
		entity.level =           fvalue.level;
		entity.origen =          fvalue.origen;
		entity.isExportable =    fvalue.isExportable;
		entity.exportableTxt =   fvalue.exportableTxt;
		entity.isImportada =     fvalue.isImportada;
		entity.isInnovacion =    fvalue.isInnovacion;
		entity.isSustituible =   fvalue.isSustituible;
		entity.parancelaria =    fvalue.parancelaria;
		entity.sustituibleTxt =  fvalue.sustituibleTxt;
		entity.innovacionTxt =   fvalue.innovacionTxt;

    entity.destino =          fvalue.destino;
    entity.anio =             fvalue.anio;
    entity.capainstalada =    fvalue.capainstalada;
    entity.capautilizada =    fvalue.capautilizada;

    entity.competencia =        fvalue.competencia;
    entity.competenciaTxt =     fvalue.competenciaTxt;
    entity.competenciaOrigen =  fvalue.competenciaOrigen;


		entity.isImportada =   entity.isImportada   || false;
		entity.isInnovacion =  entity.isInnovacion  || false;
		entity.isExportable =  entity.isExportable  || false;
		entity.isSustituible = entity.isSustituible || false;

		return entity;
	}

}
