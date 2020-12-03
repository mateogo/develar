import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  personModel,
  Person,
  PersonVinculosData,
  UpdatePersonVinculosEvent,
} from '../../../entities/person/person';
import {
  FormGroup,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
  Validators,
} from '@angular/forms';
// import {
//   CardGraph,
//   graphUtilities,
// } from '../../../../develar-commons/asset-helper';
import { Subject, Observable } from 'rxjs';
import { devutils } from '../../../develar-commons/utils';
import { map } from 'rxjs/operators';
import { PersonasController } from '../../personas-industriales/personas-page/personas.controller';

const TOKEN_TYPE = 'vinculos';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'app-vinculos-agregar-edit',
  templateUrl: './vinculos-agregar-edit.component.html',
  styleUrls: ['./vinculos-agregar-edit.component.scss'],
})
export class VinculosAgregarEditComponent implements OnInit {
  @Input() token: PersonVinculosData;
  @Output() updateToken = new EventEmitter<UpdatePersonVinculosEvent>();

  public form: FormGroup;
  public persontypes = personModel.persontypes;
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public tocupacionPersonaFisica = personModel.oficiosTOcupacionList;
  public nivelEstudios = personModel.nivelEstudios;
  public estadoCivil = personModel.estadoCivilOL;
  public vinculos = personModel.vinculosLaborales;
  public estados = personModel.estadosVinculo;

  public tDoc = 'DNI';
  public personError = false;
  public personErrorMsg = '';

  public docBelongsTo = { error: '' };

  private action = '';

  // public imageList: CardGraph[] = [];
  // public addImageToList = new Subject<CardGraph>();

  constructor(private fb: FormBuilder, private _prsCtrl: PersonasController) {
    this.form = this.buildForm();
  }

  ngOnInit() {
    this.initForEdit(this.form, this.token);
    // this.loadRelatedImages(this.token.assets);
  }

  onSubmit() {
    // ToDo
    this.initForSave(this.form, this.token);
    this.action = UPDATE;
    // this.token.assets = this.imageList;
    this.emitEvent(this.action);
  }

  onCancel() {
    this.action = CANCEL;
    this.emitEvent(this.action);
  }

  deleteToken() {
    this.action = DELETE;
    this.emitEvent(this.action);
  }

  emitEvent(action: string) {
    this.updateToken.next({
      action: action,
      type: TOKEN_TYPE,
      token: this.token,
    });
  }

  handlePerson(p: Person) {
    this.acceptPersonaAsBusinessMember(p);
  }

  private acceptPersonaAsBusinessMember(p: Person) {
    this.token = personModel.buildPersonVinculosFromPerson(p, this.token);
    this.initForEdit(this.form, this.token);
  }

  currentAge() {
    let edad = '';
    const value = this.form.value.fenactx;
    const validAge = devutils.validAge(value);

    if (validAge) {
      edad = devutils.edadActual(devutils.dateFromTx(value)) + '';
    }

    return edad;
  }

  hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  dniExistenteValidator(
    that: any,
    service: PersonasController,
    message: object
  ): AsyncValidatorFn {
    return (
      control: AbstractControl
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      const value = control.value;
      const tdoc = that.form.controls['tdoc'].value || 'DNI';

      return service.testPersonByDNI(tdoc, value).pipe(
        map((t) => {
          const invalid = false;
          const txt = '';

          if (t && t.length) {
            // invalid = true;
            // txt = 'Documento existente: ' + t[0].displayName;
            that.token.hasOwnPerson = true;
            that.token.personId = t[0]._id;
          }

          // message['error'] = txt;
          return invalid ? { mailerror: txt } : null;
        })
      );
    };
  }

  changeSelectionValue(type, val) {}

  buildForm(): FormGroup {
    let form: FormGroup;

    form = this.fb.group({
      nombre: [null],
      apellido: [null],
      tdoc: [null],

      ndoc: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.pattern('[0-9]*'),
        ],
        [this.dniExistenteValidator(this, this._prsCtrl, this.docBelongsTo)],
      ],

      vinculo: [null],
      estado: [null],
      desde: [null],
      hasta: [null],
    });
    return form;
  }

  initForEdit(form: FormGroup, token: PersonVinculosData): FormGroup {
    form.reset({
      nombre: token.nombre,
      apellido: token.apellido,
      tdoc: token.tdoc,
      ndoc: token.ndoc,
      vinculo: token.vinculo,
      estado: token.estado,
      desde: token.desde,
      hasta: token.hasta,
    });

    return form;
  }

  initForSave(form: FormGroup, token: PersonVinculosData): PersonVinculosData {
    const fvalue = form.value;
    const entity = token;

    entity.nombre = fvalue.nombre;
    entity.apellido = fvalue.apellido;
    entity.tdoc = fvalue.tdoc;
    entity.ndoc = fvalue.ndoc;
    entity.vinculo = fvalue.vinculo;
    entity.desde = fvalue.desde;
    entity.hasta = fvalue.hasta;
    entity.estado = fvalue.estado;

    return entity;
  }

  // createCardGraphFromImage(image){
  //   let card = graphUtilities.cardGraphFromAsset('image', image, 'mainimage');
  //   this.addImageToList.next(card);
  // }

  // loadRelatedImages(assets: CardGraph[]) {
  //   if(!assets.length){
  //     this.imageList = [];

  //   }else{
  //     this.imageList = graphUtilities.buildGraphList('image', assets);
  //   }
  // }
}
