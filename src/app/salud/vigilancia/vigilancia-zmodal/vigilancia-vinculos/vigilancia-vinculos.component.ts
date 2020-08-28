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
  selector: 'vigilancia-vinculos',
  templateUrl: './vigilancia-vinculos.component.html',
  styleUrls: ['./vigilancia-vinculos.component.scss']
})
export class VigilanciaVinculosComponent implements OnInit {

  public form: FormGroup;
  public addressForm: FormGroup;
  public vinculoForm: FormGroup;
  public formClosed = false;

  public asistencia: Asistencia;
  public person: Person;

  public vAsistencia: Asistencia;
  public vPerson: Person;

  public isNewVinculo = false;
  public isNewLocacion = false;
  private isLocacionFromAsistencia = false;
  private isLocacionFromPerson = false;
  private isLocacionFromNuHab = false;
  private locacionSourceTxt = '';

  public vinculo: FamilyData;
  public locacion: Locacion;
  public familyList: Array<FamilyData> = [];
  public locaciones: Array<Address> = [];

  public estadoOptList =   AsistenciaHelper.getOptionlist('estadoVinculosFam');
  public vinculosOptList = AsistenciaHelper.getOptionlist('vinculosFam');
  public sexoOptList = AsistenciaHelper.getOptionlist('sexo');
  public tdocOptList = AsistenciaHelper.getOptionlist('tdoc');
  public nucleoOptList = AsistenciaHelper.getOptionlist('nucleoHabitacional');

  public countriesList =  personModel.paises;
  public provinciasList = personModel.provincias;
  public addTypeList =    personModel.addressTypes;
  public ciudadesList =   personModel.ciudades;
  public paises     = personModel.paises;
  public barrioList = [];
  public edadActual = '';
  public nucleoHab: NucleoHabitacional;


  public personError = false;
  public personErrorMsg = '';
  public errorMessage = '';
  public docBelongsTo = {error: ''};
  public tDoc = "DNI";
  private currentNumDoc = '';
  private whiteList: Array<string>;
  private blackList: Array<string>;

  
  private result: UpdateAsistenciaEvent;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaVinculosComponent>,
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
    this.vAsistencia = this.data.vAsistencia
    this.vPerson =     this.data.vPerson;
    this.vinculo =     this.data.vinculo ;
    this.nucleoHab =   this.data.nucleoHabitacional;

    this.currentNumDoc = '';

    this.initVinculo();
    this.initLocacion();

    this.result = {
                    action: UPDATE,
                    type: VINCULO_ESTADO,
                    token: this.asistencia
                  } as  UpdateAsistenciaEvent;

    this.initForEdit();
  }


  private initVinculo(){
    this.familyList = this.person.familiares || [];
    if(this.vinculo){
      this.isNewVinculo = false;

      let labToken = this.familyList.find(t => t._id === this.vinculo._id)
      if(labToken){
        this.vinculo = labToken;
        this.tDoc = this.vinculo.tdoc || 'DNI';
        this.currentNumDoc = this.vinculo.ndoc;
        this.isNewVinculo = false;
      }

    }else{
      this.tDoc = 'DNI';
      this.isNewVinculo = true;
      this.vinculo = new FamilyData();
      this.familyList.push(this.vinculo);
      this.person.familiares = this.familyList;
    }

  }

  private initLocacion(){

    if(this.vAsistencia && this.vAsistencia.locacion){

      this.locacion = this.vAsistencia.locacion;
      this.isNewLocacion = false;
      this.isLocacionFromAsistencia = true;
      this.isLocacionFromPerson = false;
      this.isLocacionFromNuHab = false;
      this.locacionSourceTxt = 'Locación recuperada de la Sol/Vigilancia'

    }else if(this.vPerson && this.vPerson.locaciones && this.vPerson.locaciones.length){

      this.locacion = this.vPerson.locaciones[0];
      this.isNewLocacion = false;
      this.isLocacionFromAsistencia = false;
      this.isLocacionFromPerson = true;
      this.isLocacionFromNuHab = false;
      this.locacionSourceTxt = 'Locación recuperada del padrón de persona'


    }else {

      let nucHab:Address = this.vinculo.nucleo ? (this.nucleoHab && this.nucleoHab[this.vinculo.nucleo] && this.nucleoHab[this.vinculo.nucleo].address) : null;
      let nucHabCero:Address = this.nucleoHab && this.nucleoHab[N_HAB_00] && this.nucleoHab[N_HAB_00].address;

      if(nucHab){
        this.locacion = nucHab;
        this.isLocacionFromNuHab = true;
        this.locacionSourceTxt = 'Locación recuperada del NUCLEO HABITACIONAL';

      }else if(nucHabCero) {
        this.locacion = nucHabCero;
        this.isLocacionFromNuHab = true;
        this.locacionSourceTxt = 'ATENCIÓN: Locación pertenece al caso índice';


      }else {
        this.isLocacionFromNuHab = false;
        this.locacion = new Address();
        this.locacionSourceTxt = 'Ingreso de nueva locación';
      }

      this.isNewLocacion = true;
      this.isLocacionFromAsistencia = false;
      this.isLocacionFromPerson = false;
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

  onCreateCasoIndice(){
    this.formClosed = true;
    this.result.action = UPDATE;
    this.initForSave()
    this.updateSeguimientoBajoCasoIndice();
  }

  onCancel(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }

  onDeleteContact(){
    let content = this.buildWarningMessage('<strong>Se desvinculará este CONTACTO del caso índice.</strong> <br>No afecta el estado de seguimiento del propio contacto, sólo su relación con este ancestro.<br> Debe confirmar la operación ');
    this.openDialog(content).subscribe(result => {
      if(result === 'accept'){
        this.processBajaDeVinculo();
      }else{
        this.ctrl.openSnackBar('CANCELADO: La operación fue cancelada', 'CERRAR');

      }
    });

  }


  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
    if(type==='nucleo'){
      this.reviewAddress(val);

    }

    if(type==='tdoc'){
      this.vinculoForm.controls['ndoc'].setValue('');

    }

    if(type==='city'){
      this.barrioList = personModel.getBarrioList(this.addressForm.value.city);

      let zip = personModel.fetchCP(this.addressForm.value.city);
      this.addressForm.controls['zip'].setValue(zip);
    }


  }

  private reviewAddress(nucleo: string){
    let nucleoHab:Address =  this.nucleoHab && this.nucleoHab[nucleo]   && this.nucleoHab[nucleo].address;
    let nucleoCero:Address = this.nucleoHab && this.nucleoHab[N_HAB_00] && this.nucleoHab[N_HAB_00].address;

    let telefono = this.vinculo.telefono;

    if(this.isNewLocacion){
      if(nucleoHab){
        this.resetLocacionData(nucleoHab)
        this.isLocacionFromNuHab = true;
        this.locacionSourceTxt = 'Locación recuperada del NUCLEO HABITACIONAL';
        if(!telefono){
          this.vinculoForm.get('telefono').setValue(this.nucleoHab[nucleo].telefono);
        }
      }
    }
  }

  private resetLocacionData(locacion: Address){
    this.barrioList = personModel.getBarrioList(locacion.city);
    this.addressForm.reset(locacion);
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

  handlePerson(p: Person){
    this.errorMessage = ''
    if(this.isValidRetrievedPerson(p)) {
    	this.acceptPersonaAsFamilyMember(p);
    }else {
      this.ctrl.openSnackBar(this.errorMessage, 'ACEPTAR');

    }

  }

  private acceptPersonaAsFamilyMember(p: Person){
    // validate
    // caso: OK
		this.vinculo = personModel.buildFamilyDataFromPerson(p, this.vinculo);
    this.vPerson = p;
    this.initLocacion();
    this.currentNumDoc = this.vinculo.ndoc
		this.initForEdit()
  }

  private isValidRetrievedPerson(per: Person): boolean{
  	let ok = true;
  	if(per.ndoc === this.vinculo.ndoc ) return ok; // estoy recuperando la misma persona
  	if(per.ndoc === this.person.ndoc ){
      this.errorMessage = 'No puedes seleccionar el DNI del caso índice'
      return false; // es la parent person, daría vinculo circular;
    }

    if(!this.isNewVinculo){
      if(per.ndoc !== this.vinculo.ndoc ){

        this.ctrl.openSnackBar('ATENCIÓN: ¡Se reemplazará el vínculo pre-existente por esta nueva persona!', 'ACEPTAR');
      }

    }

  	let check = this.familyList.find(fam => fam.ndoc === per.ndoc);
  	if(check){
      this.errorMessage = 'Este DNI ya pertenece a otro vínculo del caso índice '
      return false; // es de otro integrante
    }

  	return ok;
  }

  private updateSeguimientoBajoCasoIndice(){
    if(this.isNewVinculo){
        this.ctrl.openSnackBar('Debe confirmar el alta del vínculo primero. No se puede actualizar', 'ATENCIÓN');
        return
    }

    if(!this.asistencia){
        this.ctrl.openSnackBar('No se estableció el caso índice. No se puede actualizar', 'ATENCIÓN');
        return
    }
    if(!this.vinculo.personId){
        this.ctrl.openSnackBar('No se ha creado un nuevo afectado a partir de este vínculo. No se puede actualizar', 'ATENCIÓN');
        return
    }

    this.perSrv.fetchPersonById(this.vinculo.personId).then(per => {
      if(per){
        this.vPerson = per;
        this.ctrl.updateCurrentPerson(per);
        this.ctrl.manageCovidRelation(this.vPerson, this.asistencia, this.vinculo).subscribe(sol => {
          if(sol){
            this.ctrl.openSnackBar('ACTUALIZACIÓN EXITOSA', 'CERRAR');
            this.closeDialogSuccess()

          }else{
            this.ctrl.openSnackBar('No se puedo actualizar correctamente la vinculación del caso índice', 'ATENCIÓN');

          }
        })

      }else {

        this.ctrl.openSnackBar('No se pudo recuperar el registro de PERSONA. No se puede actualizar', 'ATENCIÓN');
      }
    })

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
    // (0) Actualiza el contador de contactos estrechos;
    // (a) Actualiza los datos del vínculo;
    // (b) Busca / actualiza la S/Asistencia, si la hay
    // (c) Actualiza la mainPerson, la que hostea el vinculo
    this.updateContactosEstrechos(); // (a)
  }

  private updateContactosEstrechos(){
    let count = this.familyList.length || 0;
    let contactos = { contactosEstrechos: count }; 
    this.ctrl.upsertAsistenciaToken(this.asistencia, contactos ).then(asis => {
      this.asistencia = asis;
      this.saveVinculoRelation(); // (a)
    })
  }
 
  private saveMainPerson(){ //(c)
    this.vinculo.personId = this.vPerson._id;
    this.vinculo.hasOwnPerson = true;
    this.isNewVinculo = false;

    this.perSrv.updatePersonPromise(this.person).then(per =>{
      if(per){
        this.ctrl.openSnackBar('Actualización del afectado/a exitosa', 'Cerrar');
        this.person = per;

        setTimeout(()=> {
          this.updateSeguimientoBajoCasoIndice();
        },300);

        this.closeDialogSuccess()

      }else{
        this.ctrl.openSnackBar('Se produjo un error al intentar guardar sus datos', 'ATENCIÓN');
      }
    })

  }


  private saveVinculoRelation(){ //(a)
    if(!this.vPerson){
      let displayName = this.vinculo.apellido + ', ' + this.vinculo.nombre;
      this.vPerson = new Person(displayName);      
    }

    this.updateCoreData();
    this.updatePersonAddress();
    this.updateVperson()
    // this.ctrl.openSnackBar('Actualización exitosa', 'Cerrar');
    // this.closeDialogSuccess()
  }

  private updateVperson(){
    if(this.vPerson._id){
      this.perSrv.updatePersonPromise(this.vPerson).then(vinculoPerson => {
        if(vinculoPerson){
          this.vPerson = vinculoPerson;
          this.updateAsistenciaFromVinculo()
        }
      })

    }else{
      this.perSrv.createPerson(this.vPerson).then(vinculoPerson => {
        if(vinculoPerson){
          this.vPerson = vinculoPerson;
          this.updateAsistenciaFromVinculo()
        }
      })
    }
  }

  private updateAsistenciaFromVinculo(){ // (b)
    this.ctrl.fetchAsistenciaByPerson(this.vPerson).subscribe(list => {
      if(list && list.length){
        let vAsistencia = list[0];
        vAsistencia.locacion = this.locacion;
        vAsistencia.ndoc = this.vinculo.ndoc;
        vAsistencia.tdoc = this.vinculo.tdoc;
        vAsistencia.telefono = this.vinculo.telefono;
        vAsistencia.sexo = this.vinculo.sexo;
        vAsistencia.edad = this.edadActual;

        vAsistencia.requeridox.ndoc = this.vinculo.ndoc;
        vAsistencia.requeridox.tdoc = this.vinculo.tdoc;
        vAsistencia.requeridox.nombre = this.vinculo.nombre;
        vAsistencia.requeridox.apellido = this.vinculo.apellido;

        this.ctrl.manageCovidRecord(vAsistencia).subscribe(asis => {
          if(asis) this.vAsistencia = asis;
          this.saveMainPerson();
        })

      }else {
        this.saveMainPerson();
      }
    })
  }

  private updatePersonAddress(){
    if(!(this.locacion.street1 && this.locacion.city)) return;

    let personLocation = this.vPerson.locaciones && this.vPerson.locaciones.length && this.vPerson.locaciones[0];

    if(!personLocation){
      let address = new Address();
      address = Object.assign(address, this.locacion);

      this.vPerson.locaciones = [ address ]

    }else {
      personLocation =  Object.assign(personLocation, this.locacion);

    }
  }

  private updateCoreData(){
    this.vPerson.tdoc = this.vinculo.tdoc  || this.vPerson.tdoc;
    this.vPerson.ndoc = this.vinculo.ndoc  || this.vPerson.ndoc;
    this.vPerson.nombre = this.vinculo.nombre  || this.vPerson.nombre;
    this.vPerson.apellido = this.vinculo.apellido  || this.vPerson.apellido;
    this.vPerson.sexo = this.vinculo.sexo  || this.vPerson.sexo;
    this.vPerson.fenac = this.vinculo.fenac  || this.vPerson.fenac;
    this.vPerson.tdoc = this.vinculo.tdoc  || this.vPerson.tdoc;

    if(this.vinculo.telefono){

      let contactData = this.vPerson.contactdata && this.vPerson.contactdata.length && this.vPerson.contactdata[0];
      if(!contactData){
        contactData = new PersonContactData();
        this.vPerson.contactdata = [contactData];
      }
      contactData.data = this.vinculo.telefono;

    }
  }

  private initForSave(){
  	let today = new Date();
    //this.vinculo = {...this.vinculo, ...this.form.value} --->OjO... esto clona, no es lo buscado
    this.vinculo = Object.assign(this.vinculo, this.vinculoForm.value);
    this.locacion = Object.assign(this.locacion, this.addressForm.value);

    this.vinculo.hasOwnPerson = personModel.hasMinimumDataToBePerson(this.vinculo);

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

  private processBajaDeVinculo(){
    let familyList = this.person.familiares || [];

    familyList = familyList.filter(t => t._id !== this.vinculo._id)
    this.person.familiares = familyList;

    if(this.vPerson){
      this.ctrl.fetchAsistenciaByPerson(this.vPerson).subscribe(list => {
        if(list && list.length){
          let asistencia = list[0];

          this.ctrl.deleteCasoIndice(asistencia).then(asis => {
            this.saveMainPerson();
          })

        }else{
          this.saveMainPerson();
        }
      });

    }else {
      this.saveMainPerson();
    }
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
      tdoc:         [null, Validators.compose( [Validators.required])],

      ndoc:         [null],

      telefono:     [null],
      nucleo:       [null],
      vinculo:      [null],
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

  documProvisorio(){
      this.ctrl.fetchSerialDocumProvisorio().subscribe(serial =>{
        let prox =  serial.pnumero + serial.offset;
        this.vinculoForm.get('tdoc').setValue('PROV');
        this.vinculoForm.get('ndoc').setValue(prox);
      });
  }

  private initForEdit(){
    this.whiteList = this.currentNumDoc ? [this.currentNumDoc] : [];
    this.blackList = [ this.person.ndoc ];

    this.familyList.forEach(t => {
      if(t.ndoc !== this.currentNumDoc){
        this.blackList.push(t.ndoc);
      }
    })

    this.formClosed = false;

    let syncValidators =
                [
                  Validators.required, 
                  Validators.minLength(6),
                  Validators.maxLength(10),
                  Validators.pattern('[0-9]*')
                ];
   
    let asyncValidators = 
                [ this.dniExistenteValidator(this.vinculoForm, this.perSrv, this.docBelongsTo, this.whiteList, this.blackList) ];


    let ndocControl = this.vinculoForm.get('ndoc') as FormControl;
    ndocControl.setValidators(syncValidators);
    ndocControl.setAsyncValidators(asyncValidators);

    this.barrioList = personModel.getBarrioList(this.locacion.city);



    setTimeout(()=>{
       this.vinculoForm.reset(this.vinculo);
       this.addressForm.reset(this.locacion);
 
    }, 100)
  }

  private dniExistenteValidator(form:FormGroup, service: PersonService, message: object, whiteList?: Array<string>, blackList?: Array<string>): AsyncValidatorFn {
        let hasWhiteList = whiteList && whiteList.length;
        let hasBlackList = blackList && blackList.length;

        return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            let value = control.value;
            let tdoc = form.controls['tdoc'].value || 'DNI';
            message['error'] = '';

            return service.testPersonByDNI(tdoc, value).pipe(
                map(t => {

                    if(hasBlackList && blackList.indexOf(value) !== -1){
                      message['error'] = 'Documento pertenece a persona ya relacionada: ';
                      return message;
                    }

                    if(hasWhiteList && whiteList.indexOf(value) !== -1){ 
                      return null;
                    }

                    if(t && t.length){
                      message['error'] = 'Ya existe: ' + t[0].displayName; 
                      return message;
                    }

                    return null;
                })
             )
        }) ;
     }



  private closeDialogSuccess(){
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

