import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder,FormControl, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, debounceTime  }   from 'rxjs/operators';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SaludController } from '../../../salud.controller';

import { devutils }from '../../../../develar-commons/utils';

import {   Asistencia, MuestraLaboratorio, UpdateAsistenciaEvent,
           AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { Person, FamilyData, personModel } from '../../../../entities/person/person';
import { PersonService } from '../../../person.service';

const UPDATE = 'update';
const CANCEL = 'cancel';
const VINCULO_ESTADO = 'vinculofam:estado';

@Component({
  selector: 'vigilancia-vinculos',
  templateUrl: './vigilancia-vinculos.component.html',
  styleUrls: ['./vigilancia-vinculos.component.scss']
})
export class VigilanciaVinculosComponent implements OnInit {

  public form: FormGroup;
  public formClosed = false;

  public asistencia: Asistencia;
  public person: Person;
  public isNewVinculo = false;

  public vinculo: FamilyData;
  public familyList: Array<FamilyData> = [];

  public estadoOptList =   AsistenciaHelper.getOptionlist('estadoVinculosFam');
  public vinculosOptList = AsistenciaHelper.getOptionlist('vinculosFam');
  public sexoOptList = AsistenciaHelper.getOptionlist('sexo');
  public tdocOptList = AsistenciaHelper.getOptionlist('tdoc');

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
    this.asistencia = this.data.asistencia
    this.person = this.data.person;
    this.currentNumDoc = '';

    this.familyList = this.person.familiares || [];

    this.vinculo = this.data.vinculo ;

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
    }

    this.result = {
                    action: UPDATE,
                    type: VINCULO_ESTADO,
                    token: this.asistencia
                  } as  UpdateAsistenciaEvent;

    this.initForEdit();
  }

  onSubmit(){
    this.formClosed = true;
    this.result.action = UPDATE;
  	this.initForSave()
  	this.saveToken();
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

  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
  }

  changeActualState(estado){
    //c onsole.log('Estado COVID: [%s]', estado);
  }

  // template Events:
  hasError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
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
        this.person = per;
        this.ctrl.updateCurrentPerson(per);
        this.ctrl.manageCovidRelation(this.person, this.asistencia).subscribe(sol => {
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

//        this.ctrl.openSnackBar('Se produjo un error al intentar guardar sus datos', 'ATENCIÓN');


  private saveToken(){

		this.perSrv.updatePersonPromise(this.person).then(per =>{
			if(per){
				this.ctrl.openSnackBar('Actualización exitosa', 'Cerrar');
				this.closeDialogSuccess()

			}else{
				this.ctrl.openSnackBar('Se produjo un error al intentar guardar sus datos', 'ATENCIÓN');
			}
		})    
  }

  private initForSave(){
  	let today = new Date();
    //this.vinculo = {...this.vinculo, ...this.form.value} --->OjO... esto clona, no es lo buscado
    this.vinculo = Object.assign(this.vinculo, this.form.value);
    this.vinculo.hasOwnPerson = personModel.hasMinimumDataToBePerson(this.vinculo);

 		if(this.isNewVinculo){
 			this.familyList.push(this.vinculo);
 		}  

 		this.person.familiares = this.familyList;

    this.result.token = this.asistencia;
    this.result.type = VINCULO_ESTADO;
		//Recibido vía alerta SISA por afectado que vive en Brown
  }

  private initForm(){

    this.form = this.fb.group({
      nombre:       [null, Validators.compose( [Validators.required])],
      apellido:     [null, Validators.compose( [Validators.required])],
      tdoc:         [null, Validators.compose( [Validators.required])],

      ndoc: [null],

    	telefono:     [null],
      vinculo:      [null],
    	sexo:         [null],
      fenactx:      [null],
    	estado:       [null],
    	comentario:   [null],
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
       let value = this.form.value.fenactx
       let validAge = devutils.validAge(value);
       if(validAge){
           edad = devutils.edadActual(devutils.dateFromTx(value)) + '';
       }
       return edad;
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
                  Validators.minLength(7),
                  Validators.maxLength(10),
                  Validators.pattern('[0-9]*')
                ];
    let asyncValidators = 
                [ this.dniExistenteValidator(this.form, this.perSrv, this.docBelongsTo, this.whiteList, this.blackList) ];


    let ndocControl = this.form.get('ndoc') as FormControl;
    ndocControl.setValidators(syncValidators);
    ndocControl.setAsyncValidators(asyncValidators);


    setTimeout(()=>{
       this.form.reset(this.vinculo);
 
    }, 100)
  }

  private dniExistenteValidator(form:FormGroup, service: PersonService, message: object, whiteList?: Array<string>, blackList?: Array<string>): AsyncValidatorFn {
        let hasWhiteList = whiteList && whiteList.length;
        let hasBlackList = blackList && blackList.length;

        return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            let value = control.value;
            let tdoc = form.controls['tdoc'].value || 'DNI';
            message['error'] = '';

            return service.testPersonByDNI(tdoc,value).pipe(
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
