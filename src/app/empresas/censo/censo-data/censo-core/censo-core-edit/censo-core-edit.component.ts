import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { CustomValidators } from 'ng2-validation';
import { Observable } from 'rxjs';
import { map  }   from 'rxjs/operators';

import { AyudaEnLineaService } from '../../../../../develar-commons/ayuda-en-linea.service';

import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService, TipoEmpresa } from '../../../../censo-service';
import { Person, UpdatePersonEvent, Address, personModel } from '../../../../../entities/person/person';

import { CensoIndustrias, EstadoCenso, Empresa, CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'

const CORE = 'core';
const CANCEL = 'cancel';
const UPDATE = 'update';
const PAGE_ABSOLUTE =   '/mab/empresas/inicio';
const CENSO_ABSOLUTE =  '/mab/empresas/gestion/censo2021';
const CENSO_CORE =      '/mab/empresas/gestion/censo2021/core/:id';
const ACTUAL_CENSO = "censo:empresarial:2021:01";



@Component({
  selector: 'censo-core-edit',
  templateUrl: './censo-core-edit.component.html',
  styleUrls: ['./censo-core-edit.component.scss']
})
export class CensoCoreEditComponent implements OnInit {

	public  censoindustria: CensoIndustrias;
	private censoindustrias: CensoIndustrias[];
  private censoindustriaId: string;
  private censodata: CensoData;

  private currentIndustry: Person;

	public form: FormGroup;
  public showForm = false;
  public isAlta = false;

  private action = "";
  private token = CORE;

  public navanceOptList = CensoIndustriasService.getOptionlist('avance');
  public estadoOptList = CensoIndustriasService.getOptionlist('estado');
  public tipoEmpresaOptList = CensoIndustriasService.getOptionlist('tipoEmp');

  public title = "Carátula del Censo Empresarial 2021";
  public texto1 = "Identificación y estado de avance del formulario";
  public texto2: string;

  private unBindList = [];
  public nuevaAlta: NuevaAlta;

  private toggleTipoEmpresa = false;
  private hasSelectTipoEmpresa = false;

  private empCategoria = "";
  private empRubro = "";
  private empTipoEmpresa: TipoEmpresa;
  public categoryTemplateTxt1 = "";
  public categoryTemplateTxt2 = "";
  public categoryTemplateTxt3 = "";
  public codigo = {
    ayuda1: "empresas:censo:censodata:censo-core-edit:01",
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

    let sscrp4 = this.censoCtrl.censoListener.subscribe(censo => {
      if(censo){

        this.loadOrInitCenso(censo);

      }else{
        // ToDo.... qué pasa si no hay una Person activa?
      }
    })
    this.unBindList.push(sscrp4);


  }

  private loadOrInitCenso(censo?: CensoIndustrias){
    this.showForm = false;
    this.isAlta = false;
    this.censodata = new CensoData();

    if(censo && censo._id){
      this.censoindustria = censo;
      this.censoindustriaId = censo._id;
      this.censodata = censo.censo;

      this.currentIndustry = this.censoCtrl.currentIndustry;

      //this.initPerson(this.currentIndustry);

      this.initForEdit(this.form, this.censoindustria);
      this.showForm = true;


    }else{
      this.censoindustria = new CensoIndustrias();
      this.censoindustria.censo= this.censodata;

      this.currentIndustry = this.censoCtrl.currentIndustry;
      //this.initPerson(this.currentIndustry);

      this.initForEdit(this.form, this.censoindustria);
      this.nuevaAlta = new NuevaAlta(this.currentIndustry);
      this.isAlta = true;

    }
  }

  private initPersonDeprecatedToErase(person: Person){
		let sscrp2 = this.censoCtrl.personListener.subscribe(p => {
			if(p){
				let empresa = CensoIndustriasService.empresaFromPerson(person);
				this.censoindustria.empresa = empresa;

			}else{
				//c onsole.log('merde... tampoco funciona el listener');

			}
		})
    this.unBindList.push(sscrp2);

  }

  onSubmit(){
  	this.initForSave(this.form, this.censoindustria);
  	this.action = UPDATE;
  	this.saveCensoCore();
  }

  onCreateNew(){
    this.initForNew(this.censoindustria);
    this.action = UPDATE;
    this.saveCensoCore();
  }

  onCancel(){
  	this.action = CANCEL;
  	this.manageEvent(this.action);
  }

  toggleTipoEmp(e, tipo: TipoEmpresa){
    e.stopPropagation();
    e.preventDefault();

    if(!this.hasSelectTipoEmpresa){
      this.selectCategory(e, tipo);

    }else{
      if(this.empTipoEmpresa !== tipo){
        this.unSelectCategory(e, tipo);
        this.selectCategory(e, tipo);
      }

    }
  }

  private selectCategory(e, tipo: TipoEmpresa){
    this.empCategoria  = tipo.categoria;
    this.empRubro  = tipo.rubro;
    this.empTipoEmpresa = tipo;
    e.target.style.color = "#0645f5";
    e.target.style.fontSize = "1.2em";
    this.categoryTemplateTxt1 = `La principal actividad de su empresa es `;
    this.categoryTemplateTxt2 = ` ${ tipo.rubro_lbl } `;
    this.categoryTemplateTxt3 = `De acuerdo a la facturación seleccionada su Empresa queda categorizada como: ${ tipo.categoria_lbl } `;
    this.hasSelectTipoEmpresa = true;

  }

  private unSelectCategory(e, tipo: TipoEmpresa){
    this.empCategoria  = "";
    this.empRubro  = "";
    this.empTipoEmpresa = null;
    e.target.style.color = "#000";
    e.target.style.fontSize = "1em";
    this.categoryTemplateTxt1 = "";
    this.categoryTemplateTxt2 = "";
    this.categoryTemplateTxt3 = `No se ha seleccionado una categoría`;
    this.hasSelectTipoEmpresa = false;

  }

  private manageEvent(action:string){
    this.navigateToDashboard();
  	// todo

  }

  private saveCensoCore(){
  	this.censoCtrl.manageCensoIndustriasRecord(this.censoindustria).subscribe(t => {

      this.navigateToDashboard();

  	})
  	// todo
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

  // dniExistenteValidator(that:any, service: CensoIndustriasController, censoindustria: CensoIndustrias, message: object): AsyncValidatorFn {
  //     return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
  //         let value = control.value;
  //         let tdoc = that.form.controls['tdoc'].value || 'DNI';

  //         return service.testCensoIndustriasByDNI(tdoc, value).pipe(
  //             map(t => {
  //                 let invalid = false;
  //                 let txt = ''

  //                 if(t && t.length){ 
  //                   if(t[0]._id !== censoindustria._id){
  //                     invalid = true;
  //                     txt = 'Documento existente: ' + t[0].displayName;
  //                   }
  //                 }

  //                 message['error'] = txt;
  //                 return invalid ? { 'mailerror': txt }: null;
  //             })
  //          )
  //     });
  // }



  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }
 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      fecomp_txa:   [null, Validators.compose([Validators.required])],
			estado:       [null],
			navance:      [null],
    });
    return form;
  }

  initForEdit(form: FormGroup, token: CensoIndustrias): FormGroup {
  	let estado, navance;
  	estado = token.estado ? token.estado.estado : 'activo';
  	navance = token.estado ? token.estado.navance : 'caratulado';
    this.empCategoria = token.categoriaEmp;
    this.empRubro = token.rubroEmp;

    this.findCategoryOnArray(this.empRubro, this.empCategoria );



		form.reset({
		  fecomp_txa:   token.fecomp_txa,
		 	estado:       estado,
		  navance:      navance,
		});

		return form;
  }

  private findCategoryOnArray(rubro, categoria){
    this.hasSelectTipoEmpresa = false;
    this.empTipoEmpresa = null;
    this.categoryTemplateTxt1 = '';
    this.categoryTemplateTxt2 = '';
    this.categoryTemplateTxt3 = '';

    if(rubro && categoria){
      this.empTipoEmpresa = CensoIndustriasService.findRubroCategoria(rubro, categoria);
    }

    if(this.empTipoEmpresa){
      this.hasSelectTipoEmpresa = true;
      this.categoryTemplateTxt1 = `La principal actividad de su empresa es `;
      this.categoryTemplateTxt2 = ` ${ this.empTipoEmpresa.rubro_lbl } `;
      this.categoryTemplateTxt3 = `De acuerdo a la facturación seleccionada su Empresa queda categorizada como: ${ this.empTipoEmpresa.categoria_lbl } `;
    }
    
  }

  private initForNew (entity: CensoIndustrias): CensoIndustrias {
    const today = new Date();
    let estado = 'activo';
    let navance = 'enproceso';

    entity.fecomp_txa = devutils.txFromDate(today);
    entity.fecomp_tsa = today.getTime();

    entity.categoriaEmp = this.empCategoria;
    entity.rubroEmp = this.empRubro;


    if(entity.estado){
      entity.estado.estado = estado;
      entity.estado.navance = navance;


    }else{
      let token = {
        estado: estado,
        navance: navance,
        isCerrado: false,
        ts_alta: today.getTime(),
        ts_umodif:today.getTime(),
        fecierre_txa: '',
        fecierre_tsa: 0,
        cerradoPor: null,

      } as EstadoCenso
      entity.estado = token;

    }
    this.censoindustria.censo= this.censodata;

    let empresa = CensoIndustriasService.empresaFromPerson(this.currentIndustry);
    this.censoindustria.empresa = empresa;

    return entity;
  }


	private initForSave(form: FormGroup, entity: CensoIndustrias): CensoIndustrias {
		const fvalue = form.value;
		const today = new Date();

		let feDate = devutils.dateFromTx(fvalue.fecomp_txa);
		entity.fecomp_txa = devutils.txFromDate(feDate);
		entity.fecomp_tsa = feDate.getTime();

    entity.categoriaEmp = this.empCategoria;
    entity.rubroEmp = this.empRubro;

		if(entity.estado){
			entity.estado.estado = fvalue.estado;
			entity.estado.navance = fvalue.navance;


		}else{
			let estado = {
				estado: fvalue.estado,
				navance: fvalue.navance,
				isCerrado: false,
				ts_alta: today.getTime(),
				ts_umodif:today.getTime(),
				fecierre_txa: '',
				fecierre_tsa: 0,
				cerradoPor: null,

			} as EstadoCenso
			entity.estado = estado;

		}


		return entity;
	}
  /***** Template Helpers ******/
  public tableRowStyle(row: number){
    return {}

  }
  /***** Template Helpers ******/
  public tableColStyle(tipoEmp: TipoEmpresa){
    if(tipoEmp.rubro === this.empRubro && tipoEmp.categoria === this.empCategoria){

      return {'font-size':'1.2em', 'color':'#0645f5'}
    }else{
      return {};
    }    
  }

}

class NuevaAlta {
  bienvenido = 'Gracias por iniciar el CENSO-2021';
  code = ACTUAL_CENSO;
  indicacion1 = 'La información que Usted informe será tratada con carácter confidencial'
  indicacion2 = 'Este documento permanecerá <EN PROCESO> hasta tanto se completen todos los datos.'
  indicacion3 = 'Una vez completada y validada la carga, Usted presta conformidad al momento'
  indicacion4 = 'en que EMITE el CENSO, dando por concluido el proceso.'
  fecha: string;
  empName: string;
  ndoc: string;

  constructor(p:Person){
    this.fecha = devutils.txFromDate(new Date())
    if(p){
      this.empName = p.displayName;
      this.ndoc = p.ndoc;
    }
  }
}

