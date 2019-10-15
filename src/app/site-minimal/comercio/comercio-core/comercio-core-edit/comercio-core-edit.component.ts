import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';

import { Observable } from 'rxjs';
import { map  }   from 'rxjs/operators';

import { Person, UpdatePersonEvent, Address, personModel } from '../../../../entities/person/person';

import { SiteMinimalController } from '../../../minimal.controller';

import { devutils }from '../../../../develar-commons/utils'

const CORE = 'core';
const CANCEL = 'cancel';
const UPDATE = 'update';



@Component({
  selector: 'comercio-core-edit',
  templateUrl: './comercio-core-edit.component.html',
  styleUrls: ['./comercio-core-edit.component.scss']
})
export class ComercioCoreEditComponent implements OnInit {
	@Input() person: Person;
	@Output() updatePerson = new EventEmitter<UpdatePersonEvent>();

	private persons: Person[];
  private personId: string;

	public form: FormGroup;
  public persontypes        = personModel.persontypes;
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public tprofPersonaFisica = personModel.profesiones;
  public nivelEstudios      = personModel.nivelEstudios;
  public estadoCivil        = personModel.estadoCivilOL;
  public sexoOptList        = personModel.sexoList;
  public docBelongsTo = {error: ''};


  public paises     = personModel.paises;

  private action = "";
  private token = CORE;
  private fireEvent: UpdatePersonEvent;

  constructor(
  	private fb: FormBuilder,
    private minimalCtrl: SiteMinimalController,
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

  dniExistenteValidator(service: SiteMinimalController, person: Person, message: object): AsyncValidatorFn {
    return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      let value = control.value;

      return service.testPersonByDNI('DNI', value).pipe(
          map(t => {
            let invalid = false;
            let txt = ''
            if(t && t.length){ 

              if(t[0]._id !== person._id){
                invalid = true;
                txt = 'DNI existente: ' + t[0].displayName;
              }

            }
            message['error'] = txt;
            return invalid ? { 'mailerror': txt }: null;
          })
       )

    }) ;
  }

  changeSelectionValue(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
  }
 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      displayName:  [null, Validators.compose([Validators.required])],
      personType:   [null, Validators.compose([Validators.required])],
      email:        [null, Validators.compose([Validators.email])],
      locacion:     [null],
      nombre:       [null],
      apellido:     [null],
      tdoc:         [null],
      tprofesion:   [null],
      especialidad: [null],
      ambito:       [null],

      ndoc: [null, [Validators.required, 
                    Validators.minLength(7),
                    Validators.maxLength(11),
                    Validators.pattern('[0-9]*')], 
                    [this.dniExistenteValidator(this.minimalCtrl, this.person, this.docBelongsTo)] ],

      sexo:         [null],
    });
    return form;
  }

  initForEdit(form: FormGroup, person: Person): FormGroup {
		form.reset({
		  displayName:  person.displayName,
		  email:        person.email,
		  locacion:     person.locacion,
		  personType:   person.personType,
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
		entity.email = fvalue.email;
		entity.locacion = fvalue.locacion;
		entity.personType = fvalue.personType;
		entity.nombre = fvalue.nombre;
		entity.apellido = fvalue.apellido;
		entity.tdoc = fvalue.tdoc;
		entity.ndoc = fvalue.ndoc;
		entity.tprofesion = fvalue.tprofesion;
		entity.especialidad = fvalue.especialidad;
		entity.ambito = fvalue.ambito;
    entity.sexo =         fvalue.sexo;

    if(fvalue.fenactx){
      entity.fenac = devutils.dateFromTx(fvalue.fenactx).getTime();

    }else{
      entity.fenac = 0;
    }
		return entity;
	}

}


//http://develar-local.co:4200/dsocial/gestion/atencionsocial/5d23c753675a3f0818fa6551
//http://develar-local.co:4200/dsocial/gestion/atencionsocial/59701fab9c481d0391eb39b9


