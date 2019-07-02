import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, UpdatePersonEvent, Address, personModel } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const CORE = 'core';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'core-edit',
  templateUrl: './core-data-edit.component.html',
  styleUrls: ['./core-data-edit.component.scss']
})
export class CoreDataEditComponent implements OnInit {
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


  public paises     = personModel.paises;

  private action = "";
  private token = CORE;
  private fireEvent: UpdatePersonEvent;

  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
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
      ndoc:         [null],
      nacionalidad: [null],
      nestudios:    [null],
      fenactx:      [null],
      ecivil:       [null],
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
      nacionalidad: person.nacionalidad,
      nestudios:    person.nestudios,
      fenactx:      person.fenactx,
      ecivil:       person.ecivil,
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
    entity.nacionalidad = fvalue.nacionalidad;
    entity.nestudios =    fvalue.nestudios;
    entity.fenactx =      fvalue.fenactx;
    entity.ecivil =       fvalue.ecivil;
    entity.sexo =         fvalue.sexo;

    if(fvalue.fenactx){
      entity.fenac = devutils.dateFromTx(fvalue.fenactx).getTime();

    }else{
      entity.fenac = 0;
    }
		return entity;
	}

}
