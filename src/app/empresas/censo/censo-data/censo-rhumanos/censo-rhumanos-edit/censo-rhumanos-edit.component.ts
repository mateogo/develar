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
          NodoSeccion,
          CrecimientoEmpleados,
					CensoRecursosHumanos,
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
const ACTUAL_CENSO = "censo:industrias:2020:00";

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
  public seccionesOptList = CensoIndustriasService.getOptionlist('secciones')

  public title = "Planta actual y proyectada de recursos humanos";
  //public texto1 = "Apertura por nivel jerárquico y por nivel educativo. Apertura por género.";
  public texto1 = "";
  public texto2: string;

  nivelEducativoList: Array<NodoSeccion> = [];
  nivelJerarquicoList: Array<NodoSeccion> = [];

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
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }

  get niveleseducativos(): FormArray{
    return this.form.get('niveleseducativos') as FormArray;
  }

  get nivelesjerarquicos(): FormArray{
    return this.form.get('nivelesjerarquicos') as FormArray;
  }

  private initComponent(){
    console.log('Init Component')
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

        }));
    this.form.setControl('niveleseducativos', this.fb.array(neducativoFG));

    this.nivelJerarquicoList = token.porNivelJerarquico;
    console.log('nivel Jerárquico [%s]', this.nivelJerarquicoList.length)
    let jerarquicoFG = this.nivelJerarquicoList.map(item => this.fb.group({
                  tipo:       [item.tipo],
                  seccion:    [item.seccion],
                  seccion_tx: [item.seccion_tx],
                  nivel:      [item.nivel],
                  nivel_tx:   [item.nivel_tx],
                  codigo:     [item.codigo],
                  qh:         [item.qh],
                  qm:         [item.qm],                

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
      fortaleza1:      [ null ],
      fortaleza2:      [ null ],
      fortaleza3:      [ null ],
      debilidad1:      [ null ],
      debilidad2:      [ null ],
      debilidad3:      [ null ],
      oportunidad1:    [ null ],
      oportunidad2:    [ null ],
      oportunidad3:    [ null ],
      amenaza1:        [ null ],
      amenaza2:        [ null ],
      amenaza3:        [ null ],
    
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
    entity.qempleados = fvalue.qempleados;


    //entity.crecimiento = fvalue.crecimiento;
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
  
    const neducativoFlds: NodoSeccion[] = fvalue.niveleseducativos.map(t => {
      //console.dir(t);
      return Object.assign({}, t )
    })
    entity.porNivelEducacion = neducativoFlds;

    const njerarquicoFlds: NodoSeccion[] = fvalue.nivelesjerarquicos.map(t => {
      //console.dir(t);
      return Object.assign({}, t )
    })
    entity.porNivelJerarquico = njerarquicoFlds;

		return entity;
	}

}
