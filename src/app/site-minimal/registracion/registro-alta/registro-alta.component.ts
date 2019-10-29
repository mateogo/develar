import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, ValidatorFn, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

import { Person, UpdatePersonEvent, Address, personModel } from '../../../entities/person/person';
import { User } from '../../../entities/user/user';

import { devutils }from '../../../develar-commons/utils'

import { SiteMinimalController } from '../../minimal.controller';

const CANCEL = "cancel";
const NEXT = "next";
const BACK = "back";
const NUEVO = "nuevo";
const REGISTRAR = "nuevo:cuit"
const UPDATE = "update";

const NAVANCE = 'lnocturno';
const ESTADO = 'activo';

const TARGET_COMERCIO = "comercio";
const TARGET_SEGURIDAD = "personalseguridad";

const dataLabel = {
  comercio: {

  },
  personalseguridad: {

  }
}



@Component({
  selector: 'registro-alta',
  templateUrl: './registro-alta.component.html',
  styleUrls: ['./registro-alta.component.scss']
})

export class RegistroAltaComponent implements OnInit {
	@Input() user: User;
	@Input() data = {};
  @Input() target: string ;// [comercio | personalseguridad]

	@Output() person$ = new EventEmitter<Person>();
	@Output() cancel$ = new EventEmitter<boolean>();

	@Output() event = new EventEmitter<UpdatePersonEvent>();

  pageTitle: string = 'Alta nuevo comercio';

  public personForm: FormGroup;
  private model: Person;
  private newuser: User;
  public currentUser: User;
  public communityId = '';

  public persontypes = personModel.persontypes;
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public estadoCivil        = personModel.estadoCivilOL;
  public sexoOptList        = personModel.sexoList;

  public docBelongsTo =  {error: ''};
  public emailBelongsTo = {error: ''};

  public countriesList =  personModel.paises;
  public provinciasList = personModel.provincias;
  public addTypeList =    personModel.addressTypes;
  public ciudadesList =   personModel.ciudades;
  public paises     = personModel.paises;
  public barrioList = [];

  private passwordFormCtrl: FormControl;
  private confirmPasswordFormCtrl: FormControl;

  constructor(
      private fb: FormBuilder,
      private router: Router,
     	private minimalCtrl: SiteMinimalController,

  ) { }

  ngOnInit() {
      this.model = new Person('');
      this.model.tdoc = this.data['tdoc'] || 'CUIT';
      this.model.ndoc = this.data['ndoc'];
      this.model.personType = 'juridica';

			this.passwordFormCtrl = new FormControl('', Validators.required);
			this.confirmPasswordFormCtrl = new FormControl('', CustomValidators.equalTo(this.passwordFormCtrl));


      this.personForm = this.fb.group({
          displayName: [null, Validators.compose( [Validators.required])],
          tdoc: this.fb.control({value: this.model.tdoc, disabled: true}),
          ndoc: [null, [Validators.required, 
                        Validators.minLength(11),
                        Validators.maxLength(11),
                        Validators.pattern('[0-9]*')], 
                        [this.dniExistenteValidator(this.minimalCtrl, this.model.tdoc, this.docBelongsTo)] ],

          // fenactx:      [null, [this.fechaNacimientoValidator()]],
          // street1:     [null, Validators.compose([Validators.required])],
          userdata: this.fb.group({
		        username: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20) ] ) ],
		        nombre:   [null, Validators.compose([Validators.required ] ) ],
		        apellido: [null, Validators.compose([Validators.required ] ) ],
		        email:    [null, Validators.compose([Validators.required, CustomValidators.email ] ),
		        					[this.emailExistenteValidator(this.minimalCtrl, this.emailBelongsTo)] ],
		        password: this.passwordFormCtrl,
		        confirmPassword: this.confirmPasswordFormCtrl,
          })
      });

      this.resetForm(this.model);
  }

  get username() { return this.personForm.get('userdata').get('username'); }
  get nombre() { return this.personForm.get('userdata').get('nombre'); }
  get apellido() { return this.personForm.get('userdata').get('apellido'); }
  get email() { return this.personForm.get('userdata').get('email'); }
  get password() { return this.personForm.get('userdata').get('password'); }
  get confirmPassword() { return this.personForm.get('userdata').get('confirmPassword'); }


  onSubmit() {
      this.model = this.initForSave(this.personForm, this.model, this.currentUser);
      this.newuser = this.initUserForSave(this.personForm, this.model, this.currentUser);

      this.minimalCtrl.createUserAndPerson(this.newuser, this.model).subscribe(p => {
      	console.log('Registro ALTA we are back  [%s]', p._id );
        this.event.emit({
          action: NUEVO,
          token: p._id,
          person: p
        })
      })
  }

  cancel(){
      this.cancel$.emit(true);
      this.event.emit({
      	action:CANCEL,
      	token: '',
      	person: this.model
      })
  }

  resetForm(model: Person) {
  	console.log('resetForm: [%s]', model.tdoc);

      this.personForm.reset({
          displayName: model.displayName,
          tdoc: model.tdoc,
          ndoc: model.ndoc,
      });
  }

	initUserForSave(form: FormGroup, model: Person, user: User): User {
    const fvalue = form.value;
    const tvalue = fvalue.userdata
    let today = new Date();

		let newuser = new User(tvalue.username, tvalue.email);
    newuser.username    = tvalue.username;
    newuser.email       = tvalue.email;
    newuser.password    = tvalue.password;
    newuser.displayName = tvalue.username;

    newuser.confirmPassword = tvalue.confirmPassword;
    newuser.termscond   = true;
    newuser.navance     = NAVANCE;
    newuser.estado      = ESTADO;
    newuser.externalProfile = false;
    newuser.localProfile = true;

		return newuser;
	}


	initForSave(form: FormGroup, model: Person, user: User): Person {
    const fvalue = form.value; //getRawValue()
    const tvalue = fvalue.userdata
    let today = new Date();

    model.displayName = fvalue.displayName;
    model.idbrown = "";
    model.isImported = false;
    console.log('initForSave: [%s] [%s] [%s]', model.tdoc, fvalue.tdoc, fvalue.ndoc)
 
    //model.tdoc = fvalue.tdoc; OjO al estar disbled, no trae el value

    model.ndoc = fvalue.ndoc;

		model.persontags = [];
		model.personType = 'juridica';
		model.email = tvalue.email;
		model.locacion = '';
		model.nombre = tvalue.nombre;
		model.apellido = tvalue.apellido;
		model.cuil = '';

		model.tprofesion = 'comerciante';
		model.especialidad = 'local nocturno';
		model.ambito = '';
		model.nestudios = '';
		model.nacionalidad = '';
		model.fenac = 0;
		model.fenactx = '';
		model.ecivil = '';
		model.sexo = '';
		model.ts_alta = today.getTime();
		model.ts_umodif = today.getTime();
		model.user_alta = '';
		model.user_umodif = '';

    const address = new Address();

    model.locaciones = [];

    return model;
  }


  changeSelectionValue(type, val) {
  }

  changeCity() {
      this.barrioList = personModel.getBarrioList(this.personForm.value.city);

      let zip = personModel.fetchCP(this.personForm.value.city);
      this.personForm.controls['zip'].setValue(zip);
  }

  changePersonType() {
  }

  hasError = (controlName: string, errorName: string) =>{
      return this.personForm.controls[controlName].hasError(errorName);
  }

  dniExistenteValidator(service: SiteMinimalController, tdoc: string, message: object): AsyncValidatorFn {
      return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
          let value = control.value;

          return service.testPersonByDNI(tdoc, value).pipe(
              map(t => {
                  let invalid = false;
                  let txt = ''

                  if(t && t.length){ 
                      invalid = true;
                      txt = tdoc + ' existente: ' + t[0].displayName;
                  }

                  message['error'] = txt;
                  return invalid ? { 'error': txt }: null;

              })
           )
      }) ;
   } ;

  emailExistenteValidator(service: SiteMinimalController, message: object): AsyncValidatorFn {
      return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
          let value = control.value;

          return service.testUserByEmail(value).pipe(
              map(t => {
                  let invalid = false;
                  let txt = ''
                  console.log('Email VALIDATION CB [%s]', t && t.length);

                  if(t && t.length){ 
                      invalid = true;
                      txt = 'Correo electrónico existente: ' + t[0].email;
                  }

                  message['error'] = txt;
                  return invalid ? { 'emailalreadyused': txt }: null;

              })
           )
      }) ;
   } ;

   currentAge(){
       let edad = '';
       let value = this.personForm.value.fenactx
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

}
