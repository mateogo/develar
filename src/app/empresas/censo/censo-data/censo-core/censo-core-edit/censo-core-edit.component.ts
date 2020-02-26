import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';

import { Observable } from 'rxjs';
import { map  }   from 'rxjs/operators';

import { Person, UpdatePersonEvent, Address, personModel } from '../../../../../entities/person/person';

import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';

import { CensoIndustrias, EstadoCenso, Empresa, CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'

const CORE = 'core';
const CANCEL = 'cancel';
const UPDATE = 'update';




@Component({
  selector: 'censo-core-edit',
  templateUrl: './censo-core-edit.component.html',
  styleUrls: ['./censo-core-edit.component.scss']
})
export class CensoCoreEditComponent implements OnInit {
	@Input() censoindustria: CensoIndustrias;

	private censoindustrias: CensoIndustrias[];
  private censoindustriaId: string;
  private censodata: CensoData;

  private currentPerson: Person;
  public empresa: Empresa;

	public form: FormGroup;

  private action = "";
  private token = CORE;

  public navanceOptList = CensoIndustriasService.getOptionlist('avance');
  public estadoOptList = CensoIndustriasService.getOptionlist('estado');

  public title = "Carátula del Censo 2020";
  public texto1 = "Genere la carátula del Censo 2020 para iniciar el proceso";
  public texto2: string;


  constructor(
  	private fb: FormBuilder,
    private censoCtrl: CensoIndustriasController,
  	) { 
	}



  ngOnInit() {
    this.form = this.buildForm();
    this.loadOrInitCenso();
  }

  private loadOrInitCenso(){
  	this.censoindustria = new CensoIndustrias();
  	this.censodata = new CensoData();
  	this.censoindustria.censo= this.censodata;

    this.currentPerson = this.censoCtrl.currentPerson;
    this.initPerson(this.currentPerson);

    this.form = this.buildForm();
    this.initForEdit(this.form, this.censoindustria);

  }

  private initPerson(person: Person){
		this.censoCtrl.personListener.subscribe(p => {
			console.log('person Listener')
			if(p){
				console.log('personListener YES!!')
				this.empresa = CensoIndustriasService.empresaFromPerson(person);
				this.censoindustria.empresa = this.empresa;

			}else{
				console.log('merde... tampoco funciona el listener');

			}
		})

		this.censoCtrl.loadPerson();

  }

  onSubmit(){
  	this.initForSave(this.form, this.censoindustria);
  	this.action = UPDATE;
  	this.saveCensoCore();
  }

  onCancel(){
  	this.action = CANCEL;
  	this.manageEvent(this.action);
  }

  private manageEvent(action:string){
  	// todo

  }

  private saveCensoCore(){
  	this.censoCtrl.manageCensoIndustriasRecord(this.censoindustria).subscribe(t => {

  		console.log('Grabación exitosa: [%s]', t && t.compNum);

  	})
  	// todo
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
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
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
  	console.log('initForEdit: [%s]', token && token.compNum);

  	let estado, navance;
  	estado = token.estado ? token.estado.estado : 'activo';
  	navance = token.estado ? token.estado.navance : 'caratulado';

		form.reset({
		  fecomp_txa:   token.fecomp_txa,
		 	estado:       estado,
		  navance:      navance,
		});

		return form;
  }

	initForSave(form: FormGroup, entity: CensoIndustrias): CensoIndustrias {
		const fvalue = form.value;
		const today = new Date();

		let feDate = devutils.dateFromTx(fvalue.fecomp_txa);
		entity.fecomp_txa = devutils.txFromDate(feDate);
		entity.fecomp_tsa = feDate.getTime();

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

}


