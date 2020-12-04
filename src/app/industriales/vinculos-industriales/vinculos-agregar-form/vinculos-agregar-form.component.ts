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

import { Router, ActivatedRoute } from '@angular/router';

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
  public addressForm: FormGroup;
  public vinculoForm: FormGroup;
  public formClosed = false;

  public person: Person;
  public vPerson: Person;

  public isNewVinculo = false;
  public isNewLocacion = false;
  private locacionSourceTxt = '';

  public vinculo: BusinessMembersData;
  public locacion: Locacion;
  public bussinessMembers: Array<BusinessMembersData> = [];
  public locaciones: Array<Address> = [];

  public estadoOptList = AsistenciaHelper.getOptionlist('estadoVinculosFam');
  public vinculosOptList = AsistenciaHelper.getOptionlist('vinculosFam');
  public sexoOptList = AsistenciaHelper.getOptionlist('sexo');
  public tdocOptList = AsistenciaHelper.getOptionlist('tdoc');
  public nucleoOptList = AsistenciaHelper.getOptionlist('nucleoHabitacional');

  public countriesList = personModel.paises;
  public provinciasList = personModel.provincias;
  public addTypeList = personModel.addressTypes;
  public ciudadesList = personModel.ciudades;
  public paises = personModel.paises;
  public barrioList = [];
  public edadActual = '';

  public personError = false;
  public personErrorMsg = '';
  public errorMessage = '';
  public docBelongsTo = { error: '' };
  public tDoc = 'CUIT';
  private currentNumDoc = '';
  private whiteList: Array<string>;
  private blackList: Array<string>;

  private result;

  constructor(
    public dialogRef: MatDialogRef<VinculosAgregarFormComponent>,
    public dialogService: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ctrl: SaludController,
    private perSrv: PersonService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.initForm();
    this.initOnce();

    // console.log(this.person);
  }

  private initOnce() {
    this.isNewVinculo = true;
    this.isNewLocacion = true;

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

  /*private initLocacion() {
    if (this.vAsistencia && this.vAsistencia.locacion) {
      this.locacion = this.vAsistencia.locacion;
      this.isNewLocacion = false;
      this.isLocacionFromAsistencia = true;
      this.isLocacionFromPerson = false;
      this.isLocacionFromNuHab = false;
      this.locacionSourceTxt = 'Locación recuperada de la Sol/Vigilancia';
    } else if (
      this.vPerson &&
      this.vPerson.locaciones &&
      this.vPerson.locaciones.length
    ) {
      this.locacion = this.vPerson.locaciones[0];
      this.isNewLocacion = false;
      this.isLocacionFromAsistencia = false;
      this.isLocacionFromPerson = true;
      this.isLocacionFromNuHab = false;
      this.locacionSourceTxt = 'Locación recuperada del padrón de persona';
    } else {
      let nucHab: Address = this.vinculo.nucleo
        ? this.nucleoHab &&
          this.nucleoHab[this.vinculo.nucleo] &&
          this.nucleoHab[this.vinculo.nucleo].address
        : null;
      let nucHabCero: Address =
        this.nucleoHab &&
        this.nucleoHab[N_HAB_00] &&
        this.nucleoHab[N_HAB_00].address;

      if (nucHab) {
        this.locacion = nucHab;
        this.isLocacionFromNuHab = true;
        this.locacionSourceTxt = 'Locación recuperada del NUCLEO HABITACIONAL';
      } else if (nucHabCero) {
        this.locacion = nucHabCero;
        this.isLocacionFromNuHab = true;
        this.locacionSourceTxt = 'ATENCIÓN: Locación pertenece al caso índice';
      } else {
        this.isLocacionFromNuHab = false;
        this.locacion = new Address();
        this.locacionSourceTxt = 'Ingreso de nueva locación';
      }

      this.isNewLocacion = true;
      this.isLocacionFromAsistencia = false;
      this.isLocacionFromPerson = false;
    }
  }*/

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
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
    // if (type === 'nucleo') {
    //   // this.reviewAddress(val);
    // }

    if (type === 'tdoc') {
      this.vinculoForm.controls['ndoc'].setValue('');
    }

    // if (type === 'city') {
    //   this.barrioList = personModel.getBarrioList(this.addressForm.value.city);

    //   let zip = personModel.fetchCP(this.addressForm.value.city);
    //   this.addressForm.controls['zip'].setValue(zip);
    // }
  }

  /*
  private reviewAddress(nucleo: string) {
    let nucleoHab: Address =
      this.nucleoHab &&
      this.nucleoHab[nucleo] &&
      this.nucleoHab[nucleo].address;
    let nucleoCero: Address =
      this.nucleoHab &&
      this.nucleoHab[N_HAB_00] &&
      this.nucleoHab[N_HAB_00].address;

    let telefono = this.vinculo.telefono;

    if (this.isNewLocacion) {
      if (nucleoHab) {
        this.resetLocacionData(nucleoHab);
        this.isLocacionFromNuHab = true;
        this.locacionSourceTxt = 'Locación recuperada del NUCLEO HABITACIONAL';
        if (!telefono) {
          this.vinculoForm
            .get('telefono')
            .setValue(this.nucleoHab[nucleo].telefono);
        }
      }
    }
  }
  */

  private resetLocacionData(locacion: Address) {
    this.barrioList = personModel.getBarrioList(locacion.city);
    this.addressForm.reset(locacion);
  }

  changeActualState(estado) {
    //c onsole.log('Estado COVID: [%s]', estado);
  }

  nucleoHabitacionalSelected() {
    return this.locacionSourceTxt;
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
        'Este DNI ya pertenece a otro vínculo del caso índice ';
      return false; // es de otro integrante
    }

    return ok;
  }

  /*private lookUpGeoData() {
    if (this.locacion.street1 && this.locacion.city) {
      this.ctrl.addressLookUp(this.locacion).then((geo) => {
        if (geo && geo.location) {
          this.locacion.lat = geo.location.lat || this.locacion.lat;
          this.locacion.lng = geo.location.lng || this.locacion.lng;
          this.ctrl.openSnackBar('Búsqueda EXITOSA', 'CERRAR');
        } else {
          this.ctrl.openSnackBar(
            'No se pudo recuperar la información geográfica',
            'ATENCIÓN'
          );
        }
      });
    } else {
      this.ctrl.openSnackBar('Debe indicar calle y localidad ', 'ATENCIÓN');
    }
  }*/

  private saveToken() {
    /**
      1. miro si existe la persona jurídica (aquí es this.vinculo);
        si no existe la creo
    */
    // console.log("saveToken[this.vinculo=%o]", this.vinculo);

    // Siempre busco persona jurídica por tratarse de una industria
    const bussinessExistsQuery = {
      personType: 'juridica',
      tdoc: this.vinculo.tdoc,
      ndoc: this.vinculo.ndoc
    };

    this.perSrv.fetch(bussinessExistsQuery).subscribe(person => {
      // console.log('this.person.fetch[person=%o]', person);

      if (person && person.length > 0) {
        /*
          2. existe:
          2.1. asociamos?
          2.2. informamos que solo master hace la asociación?
        */
        const personItem = person[0];

        // Tiene master?
        if (this.hasBusinessMemberMaster(personItem)) {
          this.ctrl.openSnackBar('Se requiere autorización para asociarse a esta industria', 'CERRAR');
        } else {
          const newBusinessMember = personModel.buildBusinessMemberFromPerson(this.person, null);

          newBusinessMember.isMaster = true;
          personItem.integrantes.push(newBusinessMember);

          this.perSrv.updatePersonPromise(personItem).then(updatedPerson => {
            // console.log('Actualizando integrates[updatedPerson=%o]', updatedPerson);

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

        this.perSrv.createPerson(personToCreate).then(createdPerson => {
          // console.log('createPerson[createdPerson=%o]', createdPerson);

          const newBusinessMember = personModel.buildBusinessMemberFromPerson(this.person, null);
          newBusinessMember.isMaster = true;
          createdPerson.integrantes.push(newBusinessMember);

          this.perSrv.updatePersonPromise(createdPerson).then(updatedPerson => {
            // console.log('Creando y actualizando integrates[updatedPerson=%o]', updatedPerson);
            //this.router.navigate(['editar/', updatedPerson._id], { relativeTo: this.route });
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

  private updateVinculos() {
    // this.ctrl.upsertAsistenciaToken(this.asistencia, contactos).then((asis) => {
    //   this.saveVinculoRelation(); // (a)
    // });
  }

  // private updateContactosEstrechos() {
  //   let count = this.familyList.length || 0;
  //   let contactos = { contactosEstrechos: count };
  //   this.ctrl.upsertAsistenciaToken(this.asistencia, contactos).then((asis) => {
  //     this.asistencia = asis;
  //     this.saveVinculoRelation(); // (a)
  //   });
  // }

  // private saveMainPerson() {
  //   //(c)
  //   this.vinculo.personId = this.vPerson._id;
  //   this.vinculo.hasOwnPerson = true;
  //   this.isNewVinculo = false;

  //   this.perSrv.updatePersonPromise(this.person).then((per) => {
  //     if (per) {
  //       this.ctrl.openSnackBar(
  //         'Actualización del afectado/a exitosa',
  //         'Cerrar'
  //       );
  //       this.person = per;

  //       setTimeout(() => {
  //         this.updateSeguimientoBajoCasoIndice();
  //       }, 300);

  //       this.closeDialogSuccess();
  //     } else {
  //       this.ctrl.openSnackBar(
  //         'Se produjo un error al intentar guardar sus datos',
  //         'ATENCIÓN'
  //       );
  //     }
  //   });
  // }

  private saveVinculoRelation() {
    //(a)
    if (!this.vPerson) {
      const displayName = this.vinculo.apellido + ', ' + this.vinculo.nombre;
      this.vPerson = new Person(displayName);
    }

    this.updateCoreData();
    this.updatePersonAddress();
    this.updateVperson();
    // this.ctrl.openSnackBar('Actualización exitosa', 'Cerrar');
    // this.closeDialogSuccess()
  }

  private updateVperson() {
    if (this.vPerson._id) {
      this.perSrv.updatePersonPromise(this.vPerson).then((vinculoPerson) => {
        if (vinculoPerson) {
          this.vPerson = vinculoPerson;
          this.updateAsistenciaFromVinculo();
        }
      });
    } else {
      this.perSrv.createPerson(this.vPerson).then((vinculoPerson) => {
        if (vinculoPerson) {
          this.vPerson = vinculoPerson;
          this.updateAsistenciaFromVinculo();
        }
      });
    }
  }

  private updateAsistenciaFromVinculo() {
    // (b)
    this.ctrl.fetchAsistenciaByPerson(this.vPerson).subscribe((list) => {
      if (list && list.length) {
        const vAsistencia = list[0];
        vAsistencia.locacion = this.locacion;
        vAsistencia.ndoc = this.vinculo.ndoc;
        vAsistencia.tdoc = this.vinculo.tdoc;

        if (
          this.vinculo.telefono &&
          this.vinculo.telefono !== vAsistencia.telefono
        ) {
          vAsistencia.telefono = vAsistencia.telefono
            ? this.vinculo.telefono + '// ant:' + vAsistencia.telefono
            : this.vinculo.telefono;
        }

        vAsistencia.sexo = this.vinculo.sexo;
        vAsistencia.edad = this.edadActual;

        vAsistencia.requeridox.ndoc = this.vinculo.ndoc;
        vAsistencia.requeridox.tdoc = this.vinculo.tdoc;
        vAsistencia.requeridox.nombre = this.vinculo.nombre;
        vAsistencia.requeridox.apellido = this.vinculo.apellido;

        // this.ctrl.manageCovidRecord(vAsistencia).subscribe((asis) => {
        //   if (asis) this.vAsistencia = asis;
        //   this.saveMainPerson();
        // });
      } else {
        // this.saveMainPerson();
      }
    });
  }

  private updatePersonAddress() {
    if (!(this.locacion.street1 && this.locacion.city)) { return; }

    let personLocation =
      this.vPerson.locaciones &&
      this.vPerson.locaciones.length &&
      this.vPerson.locaciones[0];

    if (!personLocation) {
      let address = new Address();
      address = Object.assign(address, this.locacion);

      this.vPerson.locaciones = [address];
    } else {
      personLocation = Object.assign(personLocation, this.locacion);
    }
  }

  private updateCoreData() {
    this.vPerson.tdoc = this.vinculo.tdoc || this.vPerson.tdoc;
    this.vPerson.ndoc = this.vinculo.ndoc || this.vPerson.ndoc;
    this.vPerson.nombre = this.vinculo.nombre || this.vPerson.nombre;
    this.vPerson.apellido = this.vinculo.apellido || this.vPerson.apellido;
    this.vPerson.sexo = this.vinculo.sexo || this.vPerson.sexo;
    this.vPerson.fenac = this.vinculo.fenac || this.vPerson.fenac;
    this.vPerson.tdoc = this.vinculo.tdoc || this.vPerson.tdoc;

    if (this.vinculo.telefono) {
      let contactData =
        this.vPerson.contactdata &&
        this.vPerson.contactdata.length &&
        this.vPerson.contactdata[0];
      if (contactData) {
        if (contactData.data !== this.vinculo.telefono) {
          let nuevo = new PersonContactData();
          nuevo.slug = 'actualizado por vínculo de caso índice';
          nuevo.data = this.vinculo.telefono;
          this.vPerson.contactdata.unshift(nuevo);
        }
      }

      if (!contactData) {
        contactData = new PersonContactData();
        contactData.data = this.vinculo.telefono;
        this.vPerson.contactdata = [contactData];
      }
    }
  }

  private initForSave() {
    this.vinculo = Object.assign(this.vinculo, this.vinculoForm.value);
    // this.locacion = Object.assign(this.locacion, this.addressForm.value);
    this.vinculo.hasOwnPerson = personModel.hasMinimumDataToBePerson(
      this.vinculo
    );
    // this.result.token = this.asistencia;
    this.result.type = VINCULO_ESTADO;

    // console.log('initForSave[this.person=%o][this.vinculo=%o][this.locacion=%o]', this.person, this.vinculo, this.locacion);
  }

  private openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed();
  }

    private initForm() {
    // this.addressForm = this.fb.group({
    //   street1: [null],
    //   street2: [null],
    //   streetIn: [null],
    //   streetOut: [null],
    //   city: [null],
    //   barrio: [null],
    //   zip: [null],
    // });

    this.vinculoForm = this.fb.group({
      nombre: [null],
      apellido: [null],
      displayName: [null],
      tdoc: [null, Validators.compose([Validators.required])],
      ndoc: [null],
      telefono: [null],
      vinculo: [null],
      estado: [null],
      comentario: [null],
      desde: [null],
      hasta: [null]
    });

    this.form = this.fb.group({
      vinculoForm: this.vinculoForm,
      // addressForm: this.addressForm,
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

    this.formClosed = false;

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

    // this.barrioList = personModel.getBarrioList(this.locacion.city);

    setTimeout(() => {
      this.vinculoForm.reset(this.vinculo);
      // this.addressForm.reset(this.locacion);
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
            message['error'] = 'Documento pertenece a persona ya relacionada: ';
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
