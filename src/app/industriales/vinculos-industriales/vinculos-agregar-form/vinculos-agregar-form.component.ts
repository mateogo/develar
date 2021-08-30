import { Component, OnInit, Inject } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { SaludController } from '../../../salud/salud.controller';
import { devutils } from '../../../develar-commons/utils';
import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';

import {
  UpdateAsistenciaEvent,
  Locacion,
  AsistenciaHelper,
} from '../../../salud/asistencia/asistencia.model';

import {
  Person,
  BusinessMembersData,
  PersonContactData,
  Address,
  personModel,
} from '../../../entities/person/person';
import { PersonService } from '../../../entities/person/person.service';

const UPDATE = 'update';
const CANCEL = 'cancel';
const VINCULO_ESTADO = 'vinculofam:estado';
const N_HAB_00 = 'NUC-HAB-00';

@Component({
  selector: 'app-vinculos-agregar-form',
  templateUrl: './vinculos-agregar-form.component.html',
  styleUrls: ['./vinculos-agregar-form.component.scss'],
})
export class VinculosAgregarFormComponent implements OnInit {
  public form: FormGroup;

  public vinculoForm: FormGroup;

  public person: Person;
  public vPerson: Person;

  public isNewVinculo = false;

  public vinculo: BusinessMembersData;
  public bussinessMembers: Array<BusinessMembersData> = [];

  public tdocOptList = AsistenciaHelper.getOptionlist('tdoc');
  public persontypes = personModel.persontypesPJ;
  private personType: string = ''

  public errorMessage = '';
  public docBelongsTo = { error: '' };
  public tDoc = 'CUIT';
  private currentNumDoc = '';
  private whiteList: Array<string>;
  private blackList: Array<string>;

  private result;

  constructor(
    public dialogRef: MatDialogRef<VinculosAgregarFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ctrl: SaludController,
    private perSrv: PersonService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {

    this.initForm();
    this.initOnce();

  }

  private initOnce() {
    this.isNewVinculo = true;

    this.person = this.data.person[0];
    this.currentNumDoc = '';
    this.initVinculo();
    // this.initLocacion();

    this.result = {
      action: UPDATE,
      type: VINCULO_ESTADO,
      token: null,
    };

    this.initForEdit();
  }

  private initVinculo() {
    this.bussinessMembers = this.person.integrantes || [];
    if (this.vinculo) {
      this.isNewVinculo = false;
      const businessToken = this.bussinessMembers.find((t) => t._id === this.vinculo._id);

      if (businessToken) {
        this.vinculo = businessToken;
        this.tDoc = this.vinculo.tdoc || 'CUIT';
        this.currentNumDoc = this.vinculo.ndoc;
        this.isNewVinculo = false;
      }
    } else {
      this.tDoc = 'CUIT';
      this.isNewVinculo = true;
      this.vinculo = new BusinessMembersData();
      this.bussinessMembers.push(this.vinculo);
      this.person.integrantes = this.bussinessMembers;
    }
  }

  onSubmit() {
    this.result.action = UPDATE;
    this.initForSave();
    this.saveToken();
  }

  geoLoopUp() {
    this.initForSave();
    //this.lookUpGeoData();
  }

  onCancel() {
    this.result.action = CANCEL;
    this.dialogRef.close({
     result: this.result
    });
  }

  changeSelectionValue(type, val) {
    if (type === 'tdoc') {
      this.vinculoForm.controls['ndoc'].setValue('');
    }
  }


  changeActualState(estado) {
    //c onsole.log('Estado COVID: [%s]', estado);
  }


  // template Events:
  hasVinculoError = (controlName: string, errorName: string) => {
    return this.vinculoForm.controls[controlName].hasError(errorName);
  };

  handlePerson(p: Person) {
    this.errorMessage = '';
    if (this.isValidRetrievedPerson(p)) {
      this.acceptPersonAsBusinessMember(p);
    } else {
      this.ctrl.openSnackBar(this.errorMessage, 'ACEPTAR');
    }
  }

  private acceptPersonAsBusinessMember(p: Person) {
    this.vinculo = personModel.buildBusinessMemberFromPerson(p, this.vinculo);
    this.vPerson = p;
    this.currentNumDoc = this.vinculo.ndoc;
    this.initForEdit();
  }

  private isValidRetrievedPerson(per: Person): boolean {
    let ok = true;
    if (per.ndoc === this.vinculo.ndoc) { return ok; } // estoy recuperando la misma persona

    if (per.ndoc === this.person.ndoc) {
      this.errorMessage = 'No puedes seleccionar el mismo documento que el del ancestro';
      return false; // es la parent person, daría vinculo circular;
    }

    if (!this.isNewVinculo) {
      if (per.ndoc !== this.vinculo.ndoc) {
        this.ctrl.openSnackBar(
          'ATENCIÓN: ¡Se reemplazará el vínculo pre-existente por esta nueva empresa!',
          'ACEPTAR'
        );
      }
    }
    const check = this.bussinessMembers.find((fam) => fam.ndoc === per.ndoc);

    if (check) {
      this.errorMessage =
        'Esta organización no puede ser vinculada ';
      return false; // es de otro integrante
    }

    return ok;
  }

  private saveToken() {
    /**
      1. miro si existe la persona jurídica (aquí es this.vinculo);
        si no existe la creo
    */

    // Siempre busco persona jurídica por tratarse de una industria
    const bussinessExistsQuery = {
      tdoc: this.vinculo.tdoc,
      ndoc: this.vinculo.ndoc
    };

    this.perSrv.fetch(bussinessExistsQuery).subscribe(person => {

      if (person && person.length > 0) {
        /*
          2. existe:
          2.1. asociamos?
          2.2. informamos que solo master hace la asociación?
        */
        const personItem = person[0];

        // Tiene master?
        if (this.hasBusinessMemberMaster(personItem)) {
          this.ctrl.openSnackBar('Se requiere autorización para asociarse a esta organización', 'CERRAR');
        } else {
          const newBusinessMember = personModel.buildBusinessMemberFromPerson(this.person, null);

          newBusinessMember.isMaster = true;
          personItem.integrantes.push(newBusinessMember);

          this.perSrv.updatePersonPromise(personItem).then(updatedPerson => {

            this.result.token = updatedPerson;

            this.dialogRef.close({
              data: this.result
             });
          });
        }
      } else {
        /*
          3. no existe:
          3.1. creamos la empresa ("persona jurídica") con los datos mínimos
          3.2. asociamos
          3.3. enviamos a vista de edición
        */

        const personToCreate = personModel.buildPersonFromBusinessMember(this.vinculo);
        personToCreate.personType = this.personType;

        this.perSrv.createPerson(personToCreate).then(createdPerson => {

          const newBusinessMember = personModel.buildBusinessMemberFromPerson(this.person, null);
          newBusinessMember.isMaster = true;
          createdPerson.integrantes.push(newBusinessMember);

          this.perSrv.updatePersonPromise(createdPerson).then(updatedPerson => {
            // c onsole.log('Creando y actualizando integrates[updatedPerson=%o]', updatedPerson);

            this.result.token = updatedPerson;

            this.dialogRef.close({
              data: this.result
             });
          });
        });
      }
    });
  }

  private hasBusinessMemberMaster(p: Person): boolean {
    let hasMaster = false;

    if (p.integrantes.find(member => member.isMaster === true)) {
      hasMaster = true;
    }

    return hasMaster;
  }




  private initForSave() {
    this.vinculo = Object.assign(this.vinculo, this.vinculoForm.value);
    this.personType = this.vinculoForm.value.personType;

    this.vinculo.hasOwnPerson = personModel.hasMinimumDataToBePerson(
      this.vinculo
    );

    this.result.type = VINCULO_ESTADO;

  }

  private initForm() {
      this.vinculoForm = this.fb.group({
          displayName: [null],
          tdoc: [null, Validators.compose([Validators.required])],
          ndoc: [null],
          personType: [null],
          telefono: [null],
          vinculo: [null],
          estado: [null],
          comentario: [null],
          desde: [null],
          hasta: [null]
      });

      this.form = this.fb.group({
        vinculoForm: this.vinculoForm,
      });
  }

  private initForEdit() {
    this.whiteList = this.currentNumDoc ? [this.currentNumDoc] : [];
    this.blackList = [this.person.ndoc];

    this.bussinessMembers.forEach((t) => {
      if (t.ndoc !== this.currentNumDoc) {
        this.blackList.push(t.ndoc);
      }
    });

    let syncValidators = [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(11),
      Validators.pattern('[0-9]*'),
    ];

    let asyncValidators = [
      this.dniExistenteValidator(
        this.vinculoForm,
        this.perSrv,
        this.docBelongsTo,
        this.whiteList,
        this.blackList
      ),
    ];

    let ndocControl = this.vinculoForm.get('ndoc') as FormControl;
    ndocControl.setValidators(syncValidators);
    ndocControl.setAsyncValidators(asyncValidators);


    setTimeout(() => {
      this.vinculoForm.reset(this.vinculo);

    }, 100);
  }

  private dniExistenteValidator(
    form: FormGroup,
    service: PersonService,
    message: object,
    whiteList?: Array<string>,
    blackList?: Array<string>
  ): AsyncValidatorFn {
    let hasWhiteList = whiteList && whiteList.length;
    let hasBlackList = blackList && blackList.length;

    return (
      control: AbstractControl
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      let value = control.value;
      let tdoc = form.controls['tdoc'].value || 'CUIT';
      message['error'] = '';

      return service.testPersonByDNI(tdoc, value).pipe(
        map((t) => {
          if (hasBlackList && blackList.indexOf(value) !== -1) {
            message['error'] = 'La identificación pertenece a organización ya relacionada: ';
            return message;
          }

          if (hasWhiteList && whiteList.indexOf(value) !== -1) {
            return null;
          }

          if (t && t.length) {
            message['error'] = 'Ya existe: ' + t[0].displayName;
            return message;
          }

          return null;
        })
      );
    };
  }
}
