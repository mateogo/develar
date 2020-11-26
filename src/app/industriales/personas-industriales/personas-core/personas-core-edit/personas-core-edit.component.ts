import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, ValidationErrors, AsyncValidatorFn, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { Person, UpdatePersonEvent, personModel } from '../../../../entities/person/person';
import { devutils } from '../../../../develar-commons/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonasController } from '../../personas-page/personas.controller';
const CORE = 'core';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'personas-core-edit',
  templateUrl: './personas-core-edit.component.html',
  styleUrls: ['./personas-core-edit.component.scss']
})
export class PersonasCoreEditComponent implements OnInit {

  @Input() person: Person;
  @Output() updatePerson = new EventEmitter<UpdatePersonEvent>();

  private persons: Person[];
  private personId: string;

  public form: FormGroup;
  public persontypes = personModel.persontypes;
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public nivelEstudios = personModel.nivelEstudios;
  public estadoCivil = personModel.estadoCivilOL;
  public sexoOptList = personModel.sexoList;
  public docBelongsTo = { error: '' };

  public tprofPersonaFisica = [
    { val: 'no_definido', label: 'Seleccione opción', slug: 'Seleccione opción' },
    { val: 'profesional', label: 'Profesional', slug: 'Profesional' },
    { val: 'empresarix', label: 'Empresario/a', slug: 'Empresario/a' },
    { val: 'microemprendim', label: 'Microemprendedor/a', slug: 'Microemprendedor/a' },
    { val: 'empleadx', label: 'Empleado/a', slug: 'Empleado/a' },
    { val: 'tecnicx', label: 'Tecnico/a', slug: 'Tecnico/a' },
    { val: 'investigadxr', label: 'Investigador/a', slug: 'Investigador/a' },
    { val: 'seguridad', label: 'Seguridad', slug: 'Seguridad' },
    { val: 'operarix', label: 'Operario/a', slug: 'Operario/a' },
    { val: 'estudiante', label: 'Estudiante', slug: 'Estudiante' },
    { val: 'amadecasa', label: 'AmaDeCasa', slug: 'AmaDeCasa' },
    { val: 'jubiladx', label: 'Jubilado/a', slug: 'Jubilado/a' },
    { val: 'pensionadx', label: 'Pensionado/a', slug: 'Pensionado/a' },
    { val: 'docente', label: 'Docente', slug: 'Docente' },
    { val: 'reciclador', label: 'Reciclador urbano', slug: 'Reciclador urbano' },
    { val: 'desocupax', label: 'Desocupado/a', slug: 'Desocupado/a' },
    { val: 'otro', label: 'Otra ocupación', slug: 'Otra ocupación' },
  ];

  public paises = personModel.paises;

  private action = "";
  private token = CORE;
  private fireEvent: UpdatePersonEvent;

  constructor(
    private fb: FormBuilder,
    private minimalCtrl: PersonasController,
  ) {
  }



  ngOnInit() {
    this.form = this.buildForm();
    this.initForEdit(this.form, this.person);
  }

  onSubmit() {
    this.initForSave(this.form, this.person);
    this.action = UPDATE;
    this.emitEvent(this.action);
  }

  onCancel() {
    this.action = CANCEL;
    this.emitEvent(this.action);
  }

  emitEvent(action: string) {
    this.updatePerson.next({
      action: action,
      token: this.token,
      person: this.person
    });

  }

  currentAge() {
    // not used
    let edad = '';
    let value = this.form.value.fenactx
    let validAge = devutils.validAge(value);
    if (validAge) {
      edad = devutils.edadActual(devutils.dateFromTx(value)) + '';
    }
    return edad;
  }


  fechaNacimientoValidator(): ValidatorFn {
    return ((control: AbstractControl): { [key: string]: any } | null => {
      let validAge = devutils.validAge(control.value);
      return validAge ? null : { 'invalidAge': true }

    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  dniExistenteValidator(that: any, service: PersonasController, person: Person, message: object): AsyncValidatorFn {
    return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      let value = control.value;
      let tdoc = that.form.controls['tdoc'].value || 'DNI';

      return service.testPersonByDNI(tdoc, value).pipe(
        map(t => {
          let invalid = false;
          let txt = ''

          if (t && t.length) {
            if (t[0]._id !== person._id) {
              invalid = true;
              txt = 'Documento existente: ' + t[0].displayName;
            }
          }

          message['error'] = txt;
          return invalid ? { 'mailerror': txt } : null;
        })
      )
    });
  }



  changeSelectionValue(type, val) {
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }

  buildForm(): FormGroup {
    let form: FormGroup;

    form = this.fb.group({
      displayName: [null, Validators.compose([Validators.required])],
      personType: [null, Validators.compose([Validators.required])],
      // email:        [null, Validators.compose([Validators.email])],
      locacion: [null],
      nombre: [null],
      apellido: [null],
      tdoc: [null],
      tprofesion: [null],
      especialidad: [null],
      ambito: [null],
      fenactx: [null],
      ndoc: [null, [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(11),
      Validators.pattern('[0-9]*')],
        [this.dniExistenteValidator(this, this.minimalCtrl, this.person, this.docBelongsTo)]],

      sexo: [null],
    });
    return form;
  }

  initForEdit(form: FormGroup, person: Person): FormGroup {
    form.reset({
      displayName: person.displayName,
      //email:        person.email,
      locacion: person.locacion,
      personType: person.personType,
      nombre: person.nombre,
      apellido: person.apellido,
      tdoc: person.tdoc,
      tprofesion: person.tprofesion,
      especialidad: person.especialidad,
      ambito: person.ambito,
      ndoc: person.ndoc,
      sexo: person.sexo,
      fenactx: person.fenac ? new Date(person.fenac): ''

    });

    form.get('tdoc').disable();
    form.get('ndoc').disable();

    return form;
  }

  initForSave(form: FormGroup, person: Person): Person {
    const fvalue = form.value;

    const entity = person;
    entity.displayName = fvalue.displayName;
    //entity.email = fvalue.email;
    entity.locacion = fvalue.locacion;
    entity.personType = fvalue.personType;
    entity.nombre = fvalue.nombre;
    entity.apellido = fvalue.apellido;
		/*entity.tdoc = fvalue.tdoc;
		entity.ndoc = fvalue.ndoc;*/
    entity.tprofesion = fvalue.tprofesion;
    entity.especialidad = fvalue.especialidad;
    entity.ambito = fvalue.ambito;
    entity.sexo = fvalue.sexo;

    entity.fenactx = devutils.datePickerToTx(fvalue.fenactx);
    entity.fenac = devutils.datePickerToNum(fvalue.fenactx)

    return entity;
  }
}
