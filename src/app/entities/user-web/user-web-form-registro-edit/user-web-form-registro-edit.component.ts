import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstructivoNumTramiteModalComponent } from '../../../develar-commons/instructivo-num-tramite-modal/instructivo-num-tramite-modal.component';
import { NotificationService } from '../../../develar-commons/notifications.service';
import { TermscondModalComponent } from '../../../develar-commons/termscond-modal/termscond-modal.component';
import { devutils } from '../../../develar-commons/utils';
import { Person, personModel } from '../../person/person';
import { PersonService } from '../../person/person.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';
import { PreguntaSecreta, UserWebHelper } from '../user-web.helper';
import { UserWeb } from '../user-web.model';
import { UserWebService } from '../user-web.service';

@Component({
  selector: 'user-web-form-registro-edit',
  templateUrl: './user-web-form-registro-edit.component.html',
  styleUrls: ['./user-web-form-registro-edit.component.scss']
})
export class UserWebFormRegistroEditComponent implements OnInit {

  form: FormGroup;
  title: string = 'Registrarse';
  button_label: string = 'Registrarse';
  ruta: Array<string> = ['usuariosweb'];
  showPassword: boolean = false;
  showForm: boolean = false;
  public docBelongsTo = { error: '' };
  private password = new FormControl('', Validators.required);
  private confirmPassword = new FormControl(
    '',
    CustomValidators.equalTo(this.password),
  );
  public preguntasSecretas: PreguntaSecreta[];
  public tcompPersonaFisica: Array<any> = personModel.tipoDocumPF;
  public usuario: UserWeb;
  public isEdit: boolean = false;
  private emailOrigen : string;
  public startDate = new Date(1990, 0, 1);
  constructor(private _fb: FormBuilder, private _dialog: MatDialog,
    private _userWebService: UserWebService,
    private _notificacionService: NotificationService,
    private _router: Router,
    private _activatedRouter: ActivatedRoute,
    private _personService: PersonService,
    private _userService : UserService
    ) {
    this.preguntasSecretas = UserWebHelper.getPreguntasSecretasOptList();

  }

  ngOnInit(): void {
    let id = this._activatedRouter.snapshot.params.id;
    if (id) {
      this.initUser(id);
    } else {
      this.initGroup();
    }
  }

  initUser(id: string): void {
    this._userWebService.userEmitter.subscribe(usuario => {
      if (usuario && (usuario._id === id)) {
        this.usuario = usuario;
        this.isEdit = true;
        this.emailOrigen = this.usuario.email;
        this.initGroup();
        this.title = 'Perfil de usuario/a';
        this.button_label = 'Editar';
        this.ruta = ['dashboard'];
      }
    })
    let usuario = this._userWebService.currentUser;

    
  }

  private initGroup(): void {
    this.form = this._fb.group({
      tipoDoc: [this.isEdit ? this.usuario.tipoDoc : 'DNI', Validators.required],
     
      ndoc: [this.isEdit ? this.usuario.ndoc : '', [Validators.required, 
        Validators.minLength(6),
        Validators.maxLength(15)], 
      ],

      numTramite: [
        this.isEdit ? this.usuario.numTramite : '',
        Validators.compose([Validators.pattern('[0-9]+'), Validators.minLength(11), Validators.maxLength(11), Validators.required]),
      ],
      fechaNacimiento: [this.isEdit ? new Date(this.usuario.fechaNacimiento) : '', Validators.required],
      telefono: [
        this.isEdit ? this.usuario.telefono : '',
        Validators.compose([Validators.required]),
      ],
      email: [this.isEdit ? this.usuario.email : '', [Validators.email, Validators.required], [this.emailExistenteValidator(this, this._userWebService, this.docBelongsTo)]],
      password: this.password,
      confirmPassword: this.confirmPassword,
      termscond: [null, Validators.requiredTrue],
      preguntaSecreta: [this.isEdit ? this.usuario.preguntaSecreta : '', Validators.required],
      respuestaSecreta: [this.isEdit ? this.usuario.respuestaSecreta : '', Validators.required],
      nombre: [this.isEdit ? this.usuario.nombre : '', Validators.required],
      apellido: [this.isEdit ? this.usuario.apellido : '', Validators.required]
    });

    if (this.usuario) {
      this.removeControl();
    } else {
      this.showForm = true;
      this.form.get('ndoc').setAsyncValidators(this.dniExistenteValidator(this, this._userWebService, this.docBelongsTo))
    }
  }

  removeControl(): void {
    this.form.removeControl('termscond');
    this.form.removeControl('password');
    this.form.removeControl('confirmPassword');
    this.form.removeControl('fechaNacimiento');
    this.form.removeControl('telefono');
    this.form.get('tipoDoc').disable();
    this.form.get('ndoc').disable();
    this.form.get('ndoc').clearAsyncValidators();
    this.form.get('numTramite').disable();
    this.showForm = true;
  }

  verPassword(): void {
    const nodes = document.getElementsByClassName('password');
    for (let i = 0; i < nodes.length; i++) {
      const atributo = nodes[i].getAttribute('type');
      if (atributo === 'password') {
        nodes[i].setAttribute('type', 'text');
      } else {
        nodes[i].setAttribute('type', 'password');
      }
    }
    this.showPassword = this.showPassword ? false : true;
  }

  showInstructivo() {
    this._dialog.open(InstructivoNumTramiteModalComponent);
  }
  onSubmit(): void {

    let fvalue: RegistroUser = this.form.getRawValue();
    if (!this.isEdit) {
      // Primero seteamos la fecha
      let date = new Date(this.form.get('fechaNacimiento').value)
      let fecha_nacimiento_string = devutils.txFromDate(date);
      fvalue.fechaNacimiento = fecha_nacimiento_string;
      fvalue.tsFechaNacimiento = date.getTime();

    }

    delete fvalue['termscond'];
    this.checkRegister(fvalue);
  }

  checkRegister(userWebForm: RegistroUser): void {
    let userWeb = new UserWeb();
    Object.assign(userWeb, userWebForm);
    userWeb.username = userWebForm.email; //De momento el email será el usuario
    delete userWeb['confirmPassword'];
    userWeb.respuestaSecreta = this.eliminarDiacriticos(userWeb.respuestaSecreta.toLowerCase());
   
    //Verificamos si estamos en modo edición o modo alta
    if (!this.isEdit) {
      userWeb.isMayorEdad = parseInt(this.currentAge()) >= 18 ? true : false;
      this._userWebService.createUserWeb(userWeb).then((user) => {
        this._notificacionService.success("Usuario registrado con éxito");
        //this._localService.setItem(gldef.app_prefix,'navegante',{isRegistered : true});
        this.volver();
      }).catch((err) => {
        this._notificacionService.error(
          "Se produjo un error al registrar usuario",
        );
      });
    }
    else {
      this._userWebService.updateDataUser(this.usuario._id, userWeb).then(user => {
        this._notificacionService.success("Usuario editado con éxito");
        this._userWebService.userEmitter.next(user);
        this._userWebService.fetchPersonByUserId(this.usuario._id).then(persona => {

          if (persona) {
            let personEdit: Person = persona[0];
            let compare: Person = new Person('abc');
            Object.assign(compare, persona[0]);
            personEdit.nombre = user.nombre;
            personEdit.apellido = user.apellido;
            if ((user.nombre !== compare.nombre) || (user.apellido !== compare.apellido)) {
              personEdit.displayName = user.nombre + ' ' + user.apellido;
            }
            personEdit.email = user.email;
            this._personService.update(personEdit).then(persona => {
              this.volver();
            })

          }



        })

      }).catch((err) => {
        this._notificacionService.error(
          "Se produjo un error al editar al usuario",
        );
      });
    }

  }

  eliminarDiacriticos(texto: string) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  volver(): void {
    this._router.navigate(this.ruta);
  }

  

  currentAge() {
    let edad = '';
    let valueDate = this.form.value.fechaNacimiento;
    if (valueDate) {
      let value = devutils.datePickerToTx(valueDate);
      let validAge = devutils.validAge(value);
      if (validAge) {
        edad = devutils.edadActual(devutils.dateFromTx(value)) + '';
      }
      return edad;

    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

    dniExistenteValidator(that:any, service: UserWebService, message: object): AsyncValidatorFn {
      return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
          let value = control.value;
          let tdoc = that.form.controls['tipoDoc'].value || 'DNI';

          return service.testUserByDNI(tdoc, value).pipe(
              map(t => {
                  let invalid = false;
                  let txt = '';

                  if(t && t.length){ 
                      invalid = true;
                      txt = 'Documento existente';
                  }

                  message['error'] = txt;
                  return invalid ? { 'ndocerror': txt }: null;
              })
           )
      });
  }

  emailExistenteValidator(that:any, service: UserWebService, message: object): AsyncValidatorFn {
    return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        let value = control.value;

        return service.testUserByEmail(value).pipe(
            map(t => {
                let invalid = false;
                let txt = '';
                
                if(t && t.length){ 
                  if(t[0].email === this.emailOrigen){
                    invalid = false;
                  }else{
                    invalid = true;
                    txt = 'Correo electrónico existente';
                  }
                    }

                message['error'] = txt;
                return invalid ? { 'mailerror': txt }: null;
            })
         )
    });
}

openTermsCond() : void {
  this._dialog.open(TermscondModalComponent).afterClosed().subscribe(action => {
    if(action){

      this.form.controls['termscond'].setValue(true);
    }else{
      this.form.controls['termscond'].setValue(false);

    }

  });
}

}

export class RegistroUser {
  username: string;
  telefono: string;
  ndoc: string;
  email: string;
  tipoDni: string;
  numTramite: number;
  fechaNacimiento: string;
  tsFechaNacimiento: number;
  password: string;
  preguntaSeguridad: string;
  respuestaSeguridad: string;
  nombre: string;
  apellido: string;
}