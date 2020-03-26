import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel, UpdatePersonEvent, Address,PersonContactData } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';
const CORE = 'core';


@Component({
  selector: 'turno-person-alta',
  templateUrl: './turno-person-alta.component.html',
  styleUrls: ['./turno-person-alta.component.scss']
})
export class TurnoPersonAltaComponent implements OnInit {
	@Input() token: Person;
  @Input() detailView = true;
	@Output() updateToken = new EventEmitter<UpdatePersonEvent>();




  public tcompPersonaFisica = personModel.tipoDocumPF;

  public ciudadesList =   personModel.ciudades;
  public barrioList = [];
  public ndoc: string;

  public nextStepOptList = [];

	public form: FormGroup;

  public showViewAlimento = false;
  public showEditAlimento = false;

  public showButtons = false;
  public tipoEdit = 1;

  private formAction = "";
  private fireEvent: UpdatePersonEvent;




  public novedadesTitle = 'EVOLUCIÓN';





  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {

  	this.initForEdit(this.form, this.token);

  }


  onSubmit(){
  	this.initForSave(this.form, this.token);
  	this.formAction = UPDATE;

  	this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }


  private emitEvent(action:string){
  	this.updateToken.next({
			action: action,
			token: CORE,
			person: this.token
  	});

  }

  changeSelectionValue(type, val){

  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      tdoc:        [null],
      ndoc:        [null,[Validators.required]],

    	nombre:             [null, [Validators.required]],
    	apellido:           [null, [Validators.required]],

      telefono:    [null, [Validators.required]],
      osocial:     [null],
      osocialTxt:  [null],


    	street1:            [null ,[Validators.required]],
    	streetIn:           [null],
    	streetOut:          [null],
    	city:               [null],
    	barrio:             [null],

    });

    return form;
  }


  initForEdit(form: FormGroup, token: Person): FormGroup {
  	this.ndoc = token.ndoc;

    let locacion = token.locaciones && token.locaciones.length && token.locaciones[0] || new Address();
    let contactList = token.contactdata || [];
    let celular = contactList.find(t => t.tdato === "CEL");
    if(!celular){
    	celular = new PersonContactData();
    }

		this.barrioList = personModel.getBarrioList(locacion.city);

		form.reset({

      tdoc:        token.tdoc,
      ndoc:        token.ndoc,
   		
   		nombre:        token.nombre ,
      apellido:      token.apellido,

      telefono:    celular.data,
      osocial:     '',
      osocialTxt:  '',

    	street1:       locacion.street1,
    	streetIn:      locacion.streetIn,
    	streetOut:     locacion.streetOut,
    	city:          locacion.city,
    	barrio:        locacion.barrio,
 
		});

		return form;
  }



	initForSave(form: FormGroup, token: Person): Person {
		const fvalue = form.value;
		const entity = token;

    entity.tdoc =       fvalue.tdoc;
    entity.ndoc =       fvalue.ndoc;
    entity.nombre =       fvalue.nombre;
    entity.apellido =       fvalue.apellido;

    entity.displayName = entity.apellido + ', ' + entity.nombre;
    entity.alerta = 'Alta Provisoria Web';
    entity.followUp = 'altaweb';
    entity.estado = 'pendiente';

    let contactdata = entity.contactdata || []
    let celular = contactdata.find(t => t.tdato === "CEL");
    if(!celular){
    	celular = new PersonContactData();
    	contactdata.push(celular);
    }
    celular.tdato = "CEL";
    celular.type = "PER";
    celular.data = fvalue.telefono;
    celular.slug = 'Alta x formulario turnos web';
    celular.isPrincipal = true;
    entity.contactdata = contactdata;

    let locaciones = entity.locaciones || []
    let locacion = new Address();
    locacion.description = 'Alta x formulario turnos web';

		locacion.street1 =       fvalue.street1;
		locacion.streetIn =      fvalue.streetIn;
		locacion.streetOut =     fvalue.streetOut;
		locacion.city =          fvalue.city;
		locacion.barrio =        fvalue.barrio;
		locacion.state = 'buenosaires'
		locaciones.push(locacion);

		entity.locaciones = locaciones;

    // entity.osocial =    fvalue.osocial;
    // entity.osocialTxt = fvalue.osocialTxt;


		return entity;
	}


	changeCity() {
	    this.barrioList = personModel.getBarrioList(this.form.value.city);
	    // let zip = personModel.fetchCP(this.form.value.city);
			// this.form.controls['zip'].setValue(zip);

	}
}
