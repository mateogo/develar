import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Person, UpdatePersonEvent, Address, personModel } from '../../../entities/person/person';
import { User } from '../../../entities/user/user';

import { SiteMinimalController } from '../../minimal.controller';

import { devutils }from '../../../develar-commons/utils'

function initForSave(form: FormGroup, model: Person): Person {
    const fvalue = form.value;
    model.tdoc = fvalue.tdoc;
    model.ndoc = fvalue.ndoc;

    return model;
};
const CANCEL = "cancel";
const NEXT = "next";
const BACK = "back";
const TARGET_COMERCIO = "comercio";
const TARGET_SEGURIDAD = "personalseguridad";

const dataLabel = {
  comercio: {
    text: {
      h1: 'Espacio digital de trabajo y diálogo',
      p1: 'Registre y gestione su empresa ante la Municipalidad de Almirante Brown',
      p2: 'Ingrese con el número de CUIT de su establecimiento'
    },
    value: {
      tdoc: 'CUIT',
      personType: 'fisica',
      minlen: 11,
      maxlen: 11
    }
  },

  personalseguridad: {
    text: {
      h1: 'Registro de personal de prevención',
      p1: 'Mantenga su registro actualizado y aprobado por la Municipalidad',
      p2: 'Si Usted se desempaña como personal de prevención en locales nocturnos, ingrese con su número de DNI',
    },
    value: {
      tdoc: 'DNI',
      personType: 'juridica',
      minlen: 6,
      maxlen: 9
    }
  }
}

@Component({
  selector: 'registro-ingreso',
  templateUrl: './registro-ingreso.component.html',
  styleUrls: ['./registro-ingreso.component.scss']
})
export class RegistroIngresoComponent implements OnInit {
	@Output() event = new EventEmitter<UpdatePersonEvent>();
    @Input() target: string  = 'comercio';  // [comercio | personalseguridad]

    pageTitle: string = 'Indique el CUIT de su comercio';
    public form: FormGroup;
    private model: Person;

    public text;

    public communityId = '';

    private defaultData:any;

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

    public docBelongsTo = {error: ''};

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private minimalCtrl: SiteMinimalController,
    ) { }

    ngOnInit() {
        this.model = new Person('');

        this.defaultData = dataLabel[this.target].value
        this.text = dataLabel[this.target].text

        this.model.tdoc = this.defaultData['tdoc'];
        this.model.personType = this.defaultData['personType'];
        this.model.ndoc = ''



        this.form = this.fb.group({
            tdoc: [null],
            ndoc: [null, [Validators.required, 
                          Validators.minLength(this.defaultData['minlen']),
                          Validators.maxLength(this.defaultData['maxlen']),
                          Validators.pattern('[0-9]*')], 
                          [this.dniExistenteValidator(this.minimalCtrl, this.docBelongsTo)] ],
        });

        this.resetForm(this.model);
    }

    onSubmit() {
        this.model = initForSave(this.form, this.model);
        this.emitEvent(NEXT);
    }

    cancel(){
    	this.emitEvent(CANCEL);
    }

    emitEvent(e){
    	if(e===CANCEL){
    		this.event.next({
    			action: CANCEL,
    			token: 'CUIT',
    			person: this.model
    		})

    	}else if(e===NEXT){
    		this.event.next({
    			action: NEXT,
    			token: 'CUIT',
    			person: this.model
    		})    		
    	}

    }

    resetForm(model: Person) {
        this.form.reset({
            tdoc: model.tdoc,
            ndoc: model.ndoc,
        });
    }

    changeSelectionValue(type, val) {
    }


    hasError = (controlName: string, errorName: string) =>{
        return this.form.controls[controlName].hasError(errorName);
    }

    dniExistenteValidator(service: SiteMinimalController, message: object): AsyncValidatorFn {
        return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            let value = control.value;

            return service.testPersonByDNI('DNI',value).pipe(
                map(t => {
                    let invalid = false;
                    let txt = ''

                    // if(t && t.length){ 
                    //     invalid = true;
                    //     txt = 'DNI existente: ' + t[0].displayName;
                    // }

                    message['error'] = txt;
                    return invalid ? { 'mailerror': txt }: null;

                })
             )
        }) ;
     } ;

}

