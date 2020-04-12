import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';

import { Observable } from 'rxjs';
import { map }   from 'rxjs/operators';

import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Person, Address, UpdatePersonEvent, PersonContactData, personModel } from '../../../../entities/person/person';
import { PersonService } from '../../../person.service';
import { InternacionService } from '../../internacion.service';

import { devutils }from '../../../../develar-commons/utils'

const CANCEL = 'cancel';
const UPDATE = 'update';
const CREATE = 'create';
const CORE = 'core';

@Component({
  selector: 'altarapida-person',
  templateUrl: './altarapida-person.component.html',
  styleUrls: ['./altarapida-person.component.scss']
})
export class AltarapidaPersonComponent implements OnInit {
	@Input() person: Person;
  @Output() updatePersonEvent = new EventEmitter<UpdatePersonEvent>();

  pageTitle: string = 'Alta de Afectado';
  public form: FormGroup;

  public persontypes = personModel.persontypes;
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public estadoCivil        = personModel.estadoCivilOL;
  public sexoOptList        = personModel.sexoList;

  public docBelongsTo = {error: ''};

  public countriesList =  personModel.paises;
  public provinciasList = personModel.provincias;
  public addTypeList =    personModel.addressTypes;
  public ciudadesList =   personModel.ciudades;
  public paises     = personModel.paises;
  public barrioList = [];

  private currentNumDoc = '';

  private isNewPerson = true;

  constructor(
      private fb: FormBuilder,
			private perSrv: PersonService,
			private intSrv: InternacionService,

  ) { }

  ngOnInit() {
  	this.initForm(this.form)
		this.initOnce()
  }

	/************************************/
	/******* Template Events *******/
	/**********************************/
  onSubmit() {
      this.person = initForSave(this.form, this.person);

      if(this.person._id) this.emitEvent(UPDATE);

      else this.emitEvent(CREATE);

      
  }

  cancel(){
  	this.emitEvent(CANCEL);
  }

	private emitEvent(action:string){
		this.updatePersonEvent.next({
			action: action,
			token: CORE,
			person: this.person
		});

	}

  private initOnce(){
  	if(this.person && this.person._id){
  		this.isNewPerson = false;
      this.currentNumDoc = this.person.ndoc;
 
  	}else if(!this.person ){
  		this.initNewPerson("");

  	}
    this.validatePersonData(this.person);
    this.resetForm(this.person);
  }

  private initNewPerson(ndoc:string){
    this.isNewPerson = false;

    if(ndoc){
      if(this.currentNumDoc === ndoc ) return;
      else this.currentNumDoc = ndoc
    }

    this.person = new Person('');
    this.isNewPerson = true;
    this.person.tdoc = this.person.tdoc || 'DNI';
    this.person.personType = 'fisica';
    this.resetForm(this.person);
  }

  private validatePersonData(person:Person){
    person.tdoc = this.person.tdoc || 'DNI';
    person.personType = 'fisica';
    person.nacionalidad = person.nacionalidad || 'AR';
    if(person.apellido && person.nombre){
      person.displayName = person.displayName  || person.apellido + ', ' + person.nombre
    } 
  }

  private personAlreadyExists(personRetrieved: Person){
    console.log('AlreadyExists [%s] [%s]', this.currentNumDoc, personRetrieved.ndoc)
    this.isNewPerson = false;
    if(this.currentNumDoc === personRetrieved.ndoc ) return;

    this.intSrv.openSnackBar('Persona existente en nuestros registros', 'CERRAR');

    this.person = personRetrieved;
    this.currentNumDoc = this.person.ndoc;

    this.validatePersonData(this.person);
    this.resetForm(this.person); 
  }

  private initForm(form: FormGroup){
      this.form = this.fb.group({
          personType:  [null, Validators.compose([Validators.required])],
          nombre:      [null, Validators.compose([Validators.required])],
          apellido:    [null, Validators.compose([Validators.required])],
          displayName: [null, Validators.compose([Validators.required])],
          tdoc: [null],
          ndoc: [null, [Validators.required, 
                        Validators.minLength(6),
                        Validators.maxLength(10),
                        Validators.pattern('[0-9]*')], 
                        [this.dniExistenteValidator(this, this.perSrv, this.docBelongsTo)] ],

          sexo:         [null],
          fenactx:      [null],
          telefono:     [null],

          street1:     [null],
          street2:     [null],
          city:        [null],
          barrio:      [null],
          zip:         [null],

          state:       [null],
          statetext:   [null],
          country:     [null],
      });
  }

  private resetForm(model: Person) {
      let address = new Address();
      let contactData = new PersonContactData();

      let locaciones = model.locaciones|| [];
      if(locaciones && locaciones.length){
        address = locaciones[0];
      }


      address.addType = 'dni' ;
      address.slug = 'dirección en el DNI' ;
      address.isDefault = true;

      let contacts = model.contactdata || [];
      if((contacts && contacts.length)){
       	contactData = contacts[0]
      }

      this.form.reset({
          personType: model.personType,
          nombre: model.nombre,
          apellido: model.apellido,
          tdoc: model.tdoc,
          ndoc: model.ndoc,
          sexo: model.sexo,
          fenactx: model.fenactx,
          nacionalidad: model.nacionalidad,
          displayName: model.displayName,

          telefono: contactData.data,

          street1:     address.street1,
          street2:     address.street2,
          city:        address.city,
          barrio:      address.barrio,
          zip:         address.zip,

          state:       address.state ||'buenosaires',
          statetext:   address.statetext || 'Brown' ,
          country:     address.country || 'AR',
      });
      this.barrioList = personModel.getBarrioList(address.city);
      this.form.controls['tdoc'].value
  }

	/************************************/
	/******* Template Helpers *******/
	/**********************************/
   documProvisorio(){
     console.log('documProvisorio')
      this.intSrv.fetchSerialDocumProvisorio().subscribe(serial =>{
          this.person = initForSave(this.form, this.person);
          this.person.tdoc = "PROV"
          let prox =  serial.pnumero + serial.offset;
          this.person.ndoc = prox + "";
          this.resetForm(this.person);
      });
  }

  onBlur(e){
      this.setDisplayName()
  }

 changeSelectionValue(type, val) {
      if(type=== 'tdoc'){
          this.form.controls['ndoc'].setValue('');
      }
  }

  changeCity() {
      this.barrioList = personModel.getBarrioList(this.form.value.city);

      let zip = personModel.fetchCP(this.form.value.city);
      this.form.controls['zip'].setValue(zip);
  }

  changePersonType() {
  }

  hasError = (controlName: string, errorName: string) =>{
      return this.form.controls[controlName].hasError(errorName);
  }

  // dniExistenteValidator(that:any, service: PersonService, message: object): AsyncValidatorFn {
  //     return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
  //         let ndoc = control.value;
  //         let tdoc = that.form.controls['tdoc'].value || 'DNI';

  //         return service.testPersonByDNI(tdoc,ndoc).pipe(
  //             map(t => {
  //               console.log('testPerson [%s]', t && t.length)
  //                 let invalid = false;
  //                 let txt = ''

  //                 if(t && t.length){ 
  //                   that.personAlreadyExists(t[0]);
  //                 }else {
  //                   that.initNewPerson(ndoc)
  //                 }

  //                 message['error'] = txt;
  //                 return invalid ? { 'mailerror': txt }: null;

  //             })
  //          )
  //     }) ;
  //  }
    dniExistenteValidator(that:any, service: PersonService, message: object): AsyncValidatorFn {
        return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            let value = control.value;
            let tdoc = that.form.controls['tdoc'].value || 'DNI';

            return service.testPersonByDNI(tdoc,value).pipe(
                map(t => {
                    let invalid = false;
                    let txt = ''

                    if(t && t.length && value !== that.currentNumDoc){ 
                        invalid = true;
                        txt = 'Documento existente: ' + t[0].displayName;
                    }

                    message['error'] = txt;
                    return invalid ? { 'mailerror': txt }: null;

                })
             )
        }) ;
     }


   currentAge(){
       let fenac = this.form.value.fenactx;
       let tdoc = this.form.value.tdoc;
       let ndoc = this.form.value.ndoc;
       let edad = devutils.evaluateEdad(fenac, tdoc, ndoc);

       return edad;
   }

  private setDisplayName(){
      let displayName = this.form.controls['displayName'];
      let display = this.form.controls['apellido'].value + ', ' + this.form.controls['nombre'].value;

      if(!displayName.dirty){
          displayName.setValue(display);
      }
  }



}


function initForSave(form: FormGroup, model: Person): Person {
  const fvalue = form.value;
  let contactData:  PersonContactData;
  let address: Address;

  let locaciones = model.locaciones|| [];
  if(locaciones && locaciones.length){
    address = locaciones[0];
  }else {
    address = new Address();
  }

  address.addType = 'principal' ;
  address.slug = 'Asignada en el alta de internación' ;
  address.isDefault = true;

  let contacts = model.contactdata || [];
  if((contacts && contacts.length)){
   	contactData = contacts[0]

  }else{
  	contactData = new PersonContactData();
  	contacts.push(contactData);
  }
  
  model.nacionalidad = 'AR';
  model.alerta = 'Alta rápida para internación COVID';
  model.nombre = fvalue.nombre;
  model.personType = fvalue.personType;
  model.apellido = fvalue.apellido;
  model.tdoc = fvalue.tdoc;
  model.ndoc = fvalue.ndoc;
  model.displayName = fvalue.displayName;
  model.sexo = fvalue.sexo;

  model.fenactx = fvalue.fenactx;
  let dateD = devutils.dateFromTx(model.fenactx);
  model.fenac = dateD ? dateD.getTime() : 0;

  model.nacionalidad = fvalue.nacionalidad;
  contactData.data = fvalue.telefono;

  address.street1 =      fvalue.street1;
  address.street2 =      fvalue.street2;
  address.city =         fvalue.city;
  address.barrio =       fvalue.barrio;
  address.zip =          fvalue.zip;

  address.state =        fvalue.state;
  address.statetext =    fvalue.statetext;
  address.country =      fvalue.country;

  if(address.street1 && !locaciones.length){
  	model.locaciones = [ address ];
  }

  return model;
};
