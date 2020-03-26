import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Person, UpdatePersonEvent, personModel } from '../../../../entities/person/person';

import { DsocialController } from '../../../dsocial.controller';

import { devutils }from '../../../../develar-commons/utils'

function initForSave(form: FormGroup, model: Person): Person {
    const fvalue = form.value;
    model.tdoc = fvalue.tdoc;
    model.ndoc = fvalue.ndoc;

    return model;
};
const CANCEL = "cancel";
const NEXT = "next";
const BACK = "back";
const TARGET = "turnos";
const TARGET_SEGURIDAD = "personalseguridad";

const dataLabel = {
  turnos: {
    text: {
      h1: 'Turnos para retirar alimentos',
      p1: 'Los alimentos se entrega desde las Delegaciones Municipales exclusivamente con el turno obtenido aquí',
      p2: 'Para solicitar tu turno, ingresá el número de DNI'
    },
    value: {
      tdoc: 'DNI',
      personType: 'fisica',
      minlen: 6,
      maxlen: 9
    }
  }
}

@Component({
  selector: 'turno-documento',
  templateUrl: './turno-documento.component.html',
  styleUrls: ['./turno-documento.component.scss']
})
export class TurnoDocumentoComponent implements OnInit {
	@Output() event = new EventEmitter<UpdatePersonEvent>();
  @Input() target: string  = 'turnos'; 

  pageTitle: string = 'Ingresá tu número de DNI';
  public form: FormGroup;
  private model: Person;

  public text;
  public tcompPersonaFisica = personModel.tipoDocumPF;

  public communityId = '';

  private defaultData:any;

  public docBelongsTo = {error: ''};

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private dsCtrl: DsocialController,
  ) { }

  ngOnInit() {
      this.model = new Person('');

      this.defaultData = dataLabel[this.target].value
      this.text = dataLabel[this.target].text

      this.model.tdoc = this.defaultData['tdoc'];
      this.model.personType = this.defaultData['personType'];
      this.model.ndoc = ''


      this.buildForm();
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
  			token: 'DNI',
  			person: this.model
  		})

  	}else if(e===NEXT){
  		this.event.next({
  			action: NEXT,
  			token: 'DNI',
  			person: this.model
  		})    		
  	}

  }

  private buildForm(){
		this.form = this.fb.group({
	    tdoc: [null],
	    ndoc: [null, [Validators.required, 
	                  Validators.minLength(this.defaultData['minlen']),
	                  Validators.maxLength(this.defaultData['maxlen']),
	                  Validators.pattern('[0-9]*')], 
	                  [this.dniExistenteValidator(this.dsCtrl, this.docBelongsTo)] ],
		});  	
  }

  private resetForm(model: Person) {
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

  dniExistenteValidator(service: DsocialController, message: object): AsyncValidatorFn {
      return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
          let value = control.value;

          return service.testPersonByDNI('DNI',value).pipe(
              map(t => {
                  let invalid = false;
                  let txt = ''

                  message['error'] = txt;
                  return invalid ? { 'mailerror': txt }: null;

              })
           )
      }) ;
   } ;


}
