import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder,FormControl, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, debounceTime  }   from 'rxjs/operators';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils';

import { GenericDialogComponent } from '../../../../develar-commons/generic-dialog/generic-dialog.component';

import {   Asistencia, MuestraLaboratorio, UpdateAsistenciaEvent, Locacion,
           AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { Person, FamilyData, PersonContactData, NucleoHabitacional, Address, personModel } from '../../../../entities/person/person';
import { PersonService } from '../../../person.service';

const UPDATE = 'update';
const CANCEL = 'cancel';
const VINCULO_ESTADO = 'vinculofam:estado';
const N_HAB_00 = 'NUC-HAB-00'


@Component({
  selector: 'vigilancia-coredata',
  templateUrl: './vigilancia-coredata.component.html',
  styleUrls: ['./vigilancia-coredata.component.scss']
})
export class VigilanciaCoredataComponent implements OnInit {

  public form: FormGroup;
  public addressForm: FormGroup;
  public vinculoForm: FormGroup;
  public formClosed = false;

  public asistencia: Asistencia;
  public person: Person;
  private telefono: string;

  public isNewVinculo = false;
  public isNewLocacion = false;
  private isLocacionFromAsistencia = false;
  private isLocacionFromPerson = false;
  private isLocacionFromNuHab = false;
  private locacionSourceTxt = '';

  //public vinculo: FamilyData;
  public locacion: Locacion;
  public locaciones: Array<Address> = [];

  public sexoOptList = AsistenciaHelper.getOptionlist('sexo');
  public tdocOptList = AsistenciaHelper.getOptionlist('tdoc');

  public countriesList =  personModel.paises;
  public provinciasList = personModel.provincias;
  public addTypeList =    personModel.addressTypes;
  public ciudadesList =   personModel.ciudades;
  public paises     = personModel.paises;
  public barrioList = [];

  public edadActual = '';

  public personError = false;
  public personErrorMsg = '';
  public errorMessage = '';
  public docBelongsTo = {error: ''};
  public tDoc = "DNI";
  private currentNumDoc = '';

  
  private result: UpdateAsistenciaEvent;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaCoredataComponent>,
        public dialogService: MatDialog ,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ctrl: SaludController,
				private perSrv: PersonService,
        private fb : FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();

    this.initOnce();

 
  }

  private initOnce(){
    this.isNewVinculo = true;
    this.isNewLocacion = true;

    this.asistencia =  this.data.asistencia
    this.person =      this.data.person;

    this.currentNumDoc = '';

    this.initPerson();
    this.initLocacion();

    this.result = {
                    action: UPDATE,
                    type: VINCULO_ESTADO,
                    token: this.asistencia
                  } as  UpdateAsistenciaEvent;

    this.initForEdit();
  }


  private initPerson(){
		this.isNewVinculo = false;
    this.tDoc = this.person.tdoc || 'DNI';
    this.currentNumDoc = this.person.ndoc;

  }

  private initLocacion(){
		this.isLocacionFromNuHab = false;

    if(this.asistencia && this.asistencia.locacion){

      this.locacion = this.asistencia.locacion;
      this.isNewLocacion = false;
      this.isLocacionFromAsistencia = true;
      this.isLocacionFromPerson = false;
      this.isLocacionFromNuHab = false;
      this.locacionSourceTxt = 'Locación recuperada de la Sol/Vigilancia'

    }else if(this.person && this.person.locaciones && this.person.locaciones.length){

      this.locacion = this.person.locaciones[0];
      this.isNewLocacion = false;
      this.isLocacionFromAsistencia = false;
      this.isLocacionFromPerson = true;
      this.isLocacionFromNuHab = false;
      this.locacionSourceTxt = 'Locación recuperada del padrón de persona'
    }

  }

  onSubmit(){
    this.formClosed = true;
    this.result.action = UPDATE;
  	this.initForSave()
  	this.saveToken();
  }

  geoLoopUp(){
    this.initForSave()
    this.lookUpGeoData()
  }


  onCancel(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }


  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);

    if(type==='tdoc'){
      this.vinculoForm.controls['ndoc'].setValue('');

    }

    if(type==='city'){
      this.barrioList = personModel.getBarrioList(this.addressForm.value.city);

      let zip = personModel.fetchCP(this.addressForm.value.city);
      this.addressForm.controls['zip'].setValue(zip);
    }


  }

  changeActualState(estado){
    //c onsole.log('Estado COVID: [%s]', estado);
  }

  nucleoHabitacionalSelected(){
    return this.locacionSourceTxt;
  }

  // template Events:
  hasVinculoError = (controlName: string, errorName: string) =>{
    return this.vinculoForm.controls[controlName].hasError(errorName);
  }

 
  private lookUpGeoData(){
    if(this.locacion.street1 && this.locacion.city){
      this.ctrl.addressLookUp(this.locacion).then(geo => {

        if(geo && geo.location){
          this.locacion.lat = geo.location.lat ||this.locacion.lat;
          this.locacion.lng = geo.location.lng ||this.locacion.lng;
          this.ctrl.openSnackBar('Búsqueda EXITOSA','CERRAR');

        }else {
          this.ctrl.openSnackBar('No se pudo recuperar la información geográfica','ATENCIÓN');

        }
      })

    }else{
      this.ctrl.openSnackBar('Debe indicar calle y localidad ','ATENCIÓN');
    }

  }

  private saveToken(){
    // (a) Actualiza los datos del vínculo;
    // (b) Busca / actualiza la S/Asistencia, si la hay
    // (c) Actualiza la mainPerson, la que hostea el vinculo
    this.saveVinculoRelation(); // (a)
  }

  private saveVinculoRelation(){ //(a)

    this.updateCoreData();
    this.updatePersonAddress();
    this.updateVperson()
    // this.ctrl.openSnackBar('Actualización exitosa', 'Cerrar');
    // this.closeDialogSuccess()
  }

  private updateCoreData(){

      let contactData = this.person.contactdata && this.person.contactdata.length && this.person.contactdata[0];
      if(!contactData){
        contactData = new PersonContactData();
        this.person.contactdata = [contactData];
      }
      contactData.data = this.telefono;


  }

  private updatePersonAddress(){
    if(!(this.locacion.street1 && this.locacion.city)) return;

    let personLocation = this.person.locaciones && this.person.locaciones.length && this.person.locaciones[0];

    if(!personLocation){
      let address = new Address();
      address = Object.assign(address, this.locacion);

      this.person.locaciones = [ address ]

    }else {
      personLocation =  Object.assign(personLocation, this.locacion);

    }
  }


   private updateVperson(){
    if(this.person._id){
      this.perSrv.updatePersonPromise(this.person).then(personupdated => {
        if(personupdated){
          this.person = personupdated;
          this.updateAsistenciaFromPerson()
        }
      })

    }

  }


  private closeDialogAndGoodBye(){ //(c)
	    this.ctrl.openSnackBar('Actualización exitosa', 'Cerrar');
	    this.closeDialogSuccess()

  }


  private updateAsistenciaFromPerson(){ // (b)
    this.ctrl.fetchAsistenciaByPerson(this.person).subscribe(list => {
      if(list && list.length){
        let vAsistencia = list[0];
        vAsistencia.locacion = this.locacion;
        vAsistencia.ndoc = this.person.ndoc;
        vAsistencia.tdoc = this.person.tdoc;
        vAsistencia.telefono = this.telefono;
        vAsistencia.sexo = this.person.sexo;
        vAsistencia.edad = this.edadActual;
        vAsistencia.fenactx = this.person.fenactx;

        vAsistencia.requeridox.ndoc = this.person.ndoc;
        vAsistencia.requeridox.tdoc = this.person.tdoc;
        vAsistencia.requeridox.nombre = this.person.nombre;
        vAsistencia.requeridox.apellido = this.person.apellido;

        this.ctrl.manageCovidRecord(vAsistencia).subscribe(asis => {
        	this.asistencia = asis ? asis : this.asistencia;
          this.closeDialogAndGoodBye();
        })

      }else {
        this.closeDialogAndGoodBye();
      }
    })
  }

  private initForSave(){
  	let today = new Date();

    //this.person = {...this.person, ...this.form.value} --->OjO... esto clona, no es lo buscado
    this.person = Object.assign(this.person, this.vinculoForm.value);
    this.telefono = this.vinculoForm.value.telefono;

    if(this.person.fenactx){
	    let dateD = devutils.dateFromTx(this.person.fenactx);

	    this.person.fenactx = devutils.txFromDate(dateD);
	    this.person.fenac = dateD ? dateD.getTime() : 0;

    }
    this.locacion = Object.assign(this.locacion, this.addressForm.value);

    this.result.token = this.asistencia;
    this.result.type = VINCULO_ESTADO;

  }

 private buildWarningMessage(name){
    warningMessageTpl.data.body = name;
    return warningMessageTpl;
  }

  private openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }


  private initForm(){
    this.addressForm = this.fb.group({
      street1:     [null],
      street2:     [null],
      streetIn:    [null],
      streetOut:   [null],
      city:        [null],
      barrio:      [null],
      zip:         [null],

    })

    this.vinculoForm = this.fb.group({
      nombre:       [null, Validators.compose( [Validators.required])],
      apellido:     [null],

      telefono:     [null],
      sexo:         [null],
      fenactx:      [null],
      estado:       [null],
      comentario:   [null],

    })

    this.form = this.fb.group({
      vinculoForm: this.vinculoForm,
      addressForm: this.addressForm,
    });

  }

  fechaNacimientoValidator(): ValidatorFn {
      return ((control: AbstractControl) : {[key: string]: any} | null  => {
          let validAge = devutils.validAge(control.value);
          return validAge ? null : {'invalidAge': true}

      }) ;
  }
 
  currentAge(){
       let edad = '';
       let value = this.vinculoForm.value.fenactx
       let validAge = devutils.validAge(value);
       if(validAge){
           edad = devutils.edadActual(devutils.dateFromTx(value)) + '';
       }
       this.edadActual = edad;
       return edad;
   }


  private initForEdit(){
    this.formClosed = false;

    this.barrioList = personModel.getBarrioList(this.locacion.city);

    setTimeout(()=>{
       this.vinculoForm.reset(this.person);
       this.vinculoForm.get('telefono').setValue(this.asistencia.telefono);
       this.addressForm.reset(this.locacion);
 
    }, 100)
  }


  private closeDialogSuccess(){
    this.result.token = this.asistencia;
    this.result.type = VINCULO_ESTADO;


    this.dialogRef.close(this.result);
  }


}


const warningMessageTpl = {
  width:  '350px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Atención',
    body: 'La persona seleccionada es: ',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};

