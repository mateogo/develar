import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';

import { SaludwebService } from '../../saludweb.service';
import { devutils } from '../../../develar-commons/utils';

import { Person } from '../../../entities/person/person';

import { Asistencia } from '../../../salud/asistencia/asistencia.model';

import { AccessData, ValidationError, EventUpdate } from '../../saludweb-model';


@Component({
  selector: 'autenticate-form',
  templateUrl: './autenticate-form.component.html',
  styleUrls: ['./autenticate-form.component.scss']
})
export class AutenticateFormComponent implements OnInit {
  @Output() event = new EventEmitter<EventUpdate>()

  public title = 'Mis consultas - Bienvenido/a'
  public form: FormGroup;
  public formClosed = false;
  public showForm = false;
  private isValidPerson = false;
  private errorMsgs:Array<ValidationError> = [];

  private adminNavigation = false;

  private accessData: AccessData;
  private currentAsistencia: Asistencia;
  private currentPerson: Person;
  private eventUpdate: EventUpdate;

  constructor(
          private router: Router,
          private fb: FormBuilder,
          private srv: SaludwebService
  ) { }

  ngOnInit(): void {
    this.showForm = false;
    this.initOnce()
  }

  onSubmit(){
    this.formClosed = true;
    this.accessData = this.initForSave();
    this.fetchData(this.accessData);

  }

  onCancel(){
    this.formClosed = true;
    this.emitCancel()

  }

  hasError = (controlName: string, errorName: string) =>{
    //c onsole.log('[%s]: hasError [%s]',controlName, this.form.controls[controlName].hasError(errorName) )
    return this.form.controls[controlName].hasError(errorName);
  }

  currentAge() {
    let edad = '';
    let valueDate = this.form.value.fenactx;
    if (valueDate) {
      let validAge = devutils.validAge(valueDate);
      if (validAge) {
        edad = devutils.edadActual(devutils.dateFromTx(valueDate)) + '';
      }
      return edad;

    }
  }


  private fetchData(accessData: AccessData){
    this.errorMsgs = [];

    this.srv.fetchPersonByDni(accessData.ndoc).subscribe( person => {
      if(person){
        this.currentPerson = person;
        this.validatePerson(person, accessData);
        this.updatePerson(person, accessData);

        this.srv.fetchAsistenciaByPerson(person).subscribe(records =>{

          if(records && records.length){
            this.currentAsistencia = records[0];
            this.eventUpdate = {
              action: 'fetched',
              type: 'asistencia',
              token: this.currentAsistencia,
              person: this.currentPerson,
              errors: this.errorMsgs,
              adminNavigation: this.adminNavigation
            }
            this.emitEvent(this.eventUpdate);


          }else{
            this.pushError('asis:find:inexistente', 'Investigación epidemiológica inexistente');
            this.emitError();

          }
        })


      }else {
        this.pushError('person:din:inexistente', 'El DNI indicado no figura en nuestros registros.')
        this.emitError();
        this.srv.openSnackBar('Persona no encontrada', 'ACEPTAR')
      }

    })
  }

  private emitError (){
    let event = new EventUpdate();
    event.action = 'error';
    event.type = 'error';
    event.token = null;
    event.person = null
    event.errors = this.errorMsgs;
    event.adminNavigation = this.adminNavigation;
    this.emitEvent(event);

  }

  private emitCancel (){
    let event = new EventUpdate();
    event.action = 'cancelar';
    event.type = 'cancelar';
    event.token = null;
    event.person = null
    event.errors = this.errorMsgs;
    this.emitEvent(event);

  }

  private emitEvent(ev: EventUpdate){
    this.event.next(ev);
  }

  private updatePerson(person: Person, accessData: AccessData){
    if(!this.adminNavigation){
      this.srv.updateBasicData(person, accessData.telefono, accessData.fenactx );
    }
  }

  private validatePerson (person: Person, accessData: AccessData){
    if(person.fenactx && accessData.fenactx){
      let person_fenactx = devutils.txNormalize(person.fenactx);
      accessData.fenactx = devutils.txNormalize(accessData.fenactx);

      if(person_fenactx !== accessData.fenactx){
        this.pushError('person:fenac:nocoincide', 'Error al validar fecha de nacimiento: ' + person.fenactx + ' :: ' + accessData.fenactx)
      }
      
    }else {
      if(this.adminNavigation){
        this.pushError('person:fenac:db', 'Fecha nacimiento: ' + person.fenactx || 'No existe dato' )
        accessData.fenactx = person.fenactx ? person.fenactx : (accessData.fenactx ? accessData.fenactx : '');

      }else{
        this.pushError('person:fenac:noexiste', 'Error fecha de nacimiento: sin dato en el registro del paciente')
      }

    }

    let contactdata = person.contactdata;
    if(contactdata && contactdata.length){
      let telefono = contactdata.find(token => token.data === accessData.telefono)

      if(!telefono){
        this.pushError('person:telefono:nocoincide', 'Error al validar el teléfono')
      }

    }else {
      this.pushError('person:telefono:noexiste', 'Telefono inexistente en registro paciente')
    }


  }

  private pushError(msgId, msgTx){
    let error = new ValidationError();
    error.messageId = msgId;
    error.messageTxt = msgTx;
    this.errorMsgs.push(error);
  }

  private initOnce(){
    let actualURL = this.router.url;
    this.adminNavigation = actualURL.startsWith('/tramites/misconsultas');

    this.initForEdit();
  
  }

  private initForEdit(){
    this.accessData = new AccessData();
    if(this.adminNavigation){
      this.form = this.fb.group({
        ndoc: [null,Validators.compose([Validators.pattern('[0-9]+'), Validators.minLength(6), Validators.maxLength(9), Validators.required]) ] ,
        fenactx: [null],
        telefono: [null],
  
      });
  
    }else {
      this.form = this.fb.group({
        ndoc: [null,Validators.compose([Validators.pattern('[0-9]+'), Validators.minLength(6), Validators.maxLength(9), Validators.required]) ] ,
        fenactx: [null, Validators.required],
        telefono: [null, Validators.compose([Validators.pattern('[0-9]+'), Validators.minLength(8), Validators.maxLength(13), Validators.required])],
  
      });
  
    }

    this.form.reset(this.accessData);
    this.showForm = true;
  }


  private initForSave(): AccessData{

    let fvalue = this.form.value;

    if(fvalue['fenactx']){
      fvalue['fenactx'] = devutils.txFromDate(devutils.dateFromTx(fvalue['fenactx']));
    }

    Object.assign(this.accessData, fvalue);
    return this.accessData;
  }

}
