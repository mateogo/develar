import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';

import { Observable } from 'rxjs';
import { map  }   from 'rxjs/operators';


import { Person, UpdatePersonEvent, Address, personModel } from '../../../../entities/person/person';

import { EmpresasController } from '../../../empresas.controller';
import { CensoIndustriasService } from '../../../censo-service';

import { devutils }from '../../../../develar-commons/utils'

const CORE = 'core';
const CANCEL = 'cancel';
const UPDATE = 'update';



@Component({
  selector: 'empresa-core-edit',
  templateUrl: './empresa-core-edit.component.html',
  styleUrls: ['./empresa-core-edit.component.scss']
})
export class EmpresaCoreEditComponent implements OnInit {
	@Input() person: Person;
	@Output() updatePerson = new EventEmitter<UpdatePersonEvent>();

	private persons: Person[];
  private personId: string;

	public form: FormGroup;
  public persontypes        = personModel.persontypesPJ;
  public tcompPersona       = personModel.tipoDocumPJ;
  public nivelEstudios      = personModel.nivelEstudios;
  public estadoCivil        = personModel.estadoCivilOL;
  public sexoOptList        = personModel.sexoList;
  public docBelongsTo = {error: ''};

  public tprofPersonaFisica = CensoIndustriasService.getOptionlist('profesiones');

  public paises     = personModel.paises;

  private action = "";
  private token = CORE;
  private fireEvent: UpdatePersonEvent;

  constructor(
  	private fb: FormBuilder,
    private minimalCtrl: EmpresasController,
  	) { 
	}



  ngOnInit() {
    this.form = this.buildForm();
    this.initForEdit(this.form, this.person);
  }

  onSubmit(){
  	this.initForSave(this.form, this.person);
  	this.action = UPDATE;
  	this.emitEvent(this.action);
  }

  onCancel(){
  	this.action = CANCEL;
  	this.emitEvent(this.action);
  }

  emitEvent(action:string){
  	this.updatePerson.next({
  		action: action,
  		token: this.token,
  		person: this.person
  	});

  }

  currentAge(){
    // not used
       let edad = '';
       let value = this.form.value.fenactx
       let validAge = devutils.validAge(value);
       if(validAge){
           edad = devutils.edadActual(devutils.dateFromTx(value)) + '';
       }
       return edad;
   }


  fechaNacimientoValidator(): ValidatorFn {
      return ((control: AbstractControl) : {[key: string]: any} | null  => {
          let validAge = devutils.validAge(control.value);
          return validAge ? null : {'invalidAge': true}

      }) ;
  }
    
  hasError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  dniExistenteValidator(that:any, service: EmpresasController, person: Person, message: object): AsyncValidatorFn {
      return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
          let value = control.value;
          let tdoc = that.form.controls['tdoc'].value || 'DNI';

          return service.testPersonByDNI(tdoc, value).pipe(
              map(t => {
                  let invalid = false;
                  let txt = ''

                  if(t && t.length){ 
                    if(t[0]._id !== person._id){
                      invalid = true;
                      txt = 'Documento existente: ' + t[0].displayName;
                    }
                  }

                  message['error'] = txt;
                  return invalid ? { 'mailerror': txt }: null;
              })
           )
      });
  }



  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }
 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      displayName:  [null, Validators.compose([Validators.required])],
      personType:   [null, Validators.compose([Validators.required])],
      email:        [null, Validators.compose([Validators.email])],
      feInicioAct:  [null],
      brandName:    [null],
      locacion:     [null],
      nombre:       [null],
      apellido:     [null],
      tdoc:         [null],
      tprofesion:   [null],
      especialidad: [null],
      ambito:       [null],

      ndoc: [null, [Validators.required, 
                    Validators.minLength(6),
                    Validators.maxLength(11),
                    Validators.pattern('[0-9]*')], 
                    [this.dniExistenteValidator(this, this.minimalCtrl, this.person, this.docBelongsTo)] ],

      sexo:         [null],
    });
    return form;
  }

  initForEdit(form: FormGroup, person: Person): FormGroup {
		form.reset({
      displayName:  person.displayName,
      brandName:    person.brandName,
		  email:        person.email,
		  locacion:     person.locacion,
		  personType:   person.personType,
      feInicioAct:  person.feInicioAct,
		  nombre:       person.nombre,
		  apellido:     person.apellido,
		  tdoc:         person.tdoc,
		  tprofesion:   person.tprofesion,
		  especialidad: person.especialidad,
		  ambito:       person.ambito,
		  ndoc:         person.ndoc,
      sexo:         person.sexo


		});

		return form;
  }

	initForSave(form: FormGroup, person: Person): Person {
		const fvalue = form.value;

		const entity = person; 
		entity.displayName = fvalue.displayName;
		entity.brandName = fvalue.brandName;
		entity.email = fvalue.email;
		entity.locacion = fvalue.locacion;
		entity.personType = fvalue.personType;
    entity.feInicioAct = fvalue.feInicioAct;

    entity.nombre = fvalue.nombre;
		entity.apellido = fvalue.apellido;
		entity.tdoc = fvalue.tdoc;
		entity.ndoc = fvalue.ndoc;
		entity.tprofesion = fvalue.tprofesion;
		entity.especialidad = fvalue.especialidad;
		entity.ambito = fvalue.ambito;
    entity.sexo =         fvalue.sexo;

    let dateD = devutils.dateFromTx(entity.fenactx);
    entity.fenac = dateD ? dateD.getTime() : 0;

		return entity;
	}

}


//http://develar-local.co:4200/dsocial/gestion/atencionsocial/5d23c753675a3f0818fa6551
//http://develar-local.co:4200/dsocial/gestion/atencionsocial/59701fab9c481d0391eb39b9


