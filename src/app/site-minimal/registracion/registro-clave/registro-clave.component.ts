import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

import { Person, UpdatePersonEvent, Address, personModel } from '../../../entities/person/person';
import { User } from '../../../entities/user/user';

import { SiteMinimalController } from '../../minimal.controller';

import { devutils }from '../../../develar-commons/utils'


const CANCEL = "cancel";
const NEXT = "next";
const BACK = "back";

const NUEVO = "nuevo";
const REGISTRAR = "nuevo:cuit"
const UPDATE = "update";

const TARGET_COMERCIO = "comercio";
const TARGET_SEGURIDAD = "personalseguridad";

const dataLabel = {
  comercio: {
    text: {
      h1: 'Ingrese con su clave de acceso',
      p1: 'No hay un comercio registrado con CUIT:  ',
      p2: '¿Desea dar de alta un nuevo comercio?',
      p3: 'Alta nuevo comercio'
    },
    value: {
      tdoc: 'CUIT',
      personType: 'fisica'
    }
  },

  personalseguridad: {
    text: {
      h1: 'Ingrese con su clave de acceso',
      p1: 'No existe registro con DNI: ',
      p2: '¿Desea dar de alta un nuevo registro?',
      p3: 'Alta nuevo personal de prevención'
    },
    value: {
      tdoc: 'DNI',
      personType: 'juridica'
    }
  }
}

@Component({
  selector: 'registro-clave',
  templateUrl: './registro-clave.component.html',
  styleUrls: ['./registro-clave.component.scss']
})
export class RegistroClaveComponent implements OnInit {
		@Input() model: Person
		@Input() mode: string; //'create' o 'update'
    @Input() target: string ;// [comercio | personalseguridad]

		@Output() event = new EventEmitter<UpdatePersonEvent>();

    pageTitle: string = 'Indique el CUIT de su comercio';

    public communityId = '';
    public form: FormGroup;

    private defaultData = {tdoc: 'CUIT', ndoc: ''}
    public text;
    public password;
    public isNueva = true;

    public persontypes = personModel.persontypes;
    public tcompPersonaFisica = personModel.tipoDocumPF;
    public estadoCivil        = personModel.estadoCivilOL;
    public sexoOptList        = personModel.sexoList;

    public countriesList =  personModel.paises;
    public provinciasList = personModel.provincias;
    public addTypeList =    personModel.addressTypes;
    public ciudadesList =   personModel.ciudades;
    public paises     = personModel.paises;
    public barrioList = [];

    public ndoc;

    public docBelongsTo = {error: ''};

    constructor(
    	private fb: FormBuilder,
     	private router: Router,
     	private minimalCtrl: SiteMinimalController,

    ) { 

        this.form = this.fb.group({
            clave: [null, [Validators.required, 
                          Validators.minLength(7),
                          Validators.maxLength(10)] ],

        });
    }

    ngOnInit() {
        this.defaultData = dataLabel[this.target].value
        this.text = dataLabel[this.target].text
        this.ndoc = this.model.ndoc


    	this.password = '';
			if(this.mode === UPDATE){
				this.isNueva = false
			} else {
				this.isNueva = true;
			}
			this.resetForm(this.password);

    }

    onSubmit() {
        this.emitEvent(NEXT);
    }

    cancel(){
    	this.emitEvent(CANCEL);
    }

    registrarNuevo(){
    	this.emitEvent(REGISTRAR);
    }

    emitEvent(e){
    	if(e===CANCEL){
    		this.event.next({
    			action: CANCEL,
    			token: 'CUIT',
    			person: this.model
    		})

    	}else if(e===NEXT){
    		this.password = this.form.value.clave;
    		this.event.next({
    			action: NEXT,
    			token: this.password,
    			person: this.model
    		})    		

    	}else if(e===REGISTRAR){
    		this.event.next({
    			action: REGISTRAR,
    			token: 'CUIT',
    			person: this.model
    		})    		
    	}

    }

    resetForm(clave: string) {
        this.form.reset({
            clave: clave
        });
    }

}
