import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Observable } from 'rxjs';
import { map  }   from 'rxjs/operators';

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

  form: FormGroup;

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
  public docBelongsTo = {error: ''};
  public tDoc = "DNI";
  private currentNumDoc = '';

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
    this.result.action = UPDATE;
  	this.initForSave()
  	this.saveToken();
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
    if(this.isValidRetrievedPerson(p)) {
    	this.acceptPersonaAsFamilyMember(p);
    }

  }

  private acceptPersonaAsFamilyMember(p: Person){
    // validate
    // caso: OK
		this.vinculo = personModel.buildFamilyDataFromPerson(p, this.vinculo);
		this.initForEdit()
  }

  private isValidRetrievedPerson(per: Person): boolean{
  	let ok = true;
  	if(per.ndoc === this.vinculo.ndoc ) return ok; // estoy recuperando la misma persona
  	if(per.ndoc === this.person.ndoc ) return false; // es la parent person, daría vinculo circular;

  	let check = this.familyList.find(fam => fam.ndoc === per.ndoc);
  	if(check)  return false; // es de otro integrante


  	return ok;
  }




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

      ndoc: [null, [Validators.required, 
                    Validators.minLength(7),
                    Validators.maxLength(10),
                    Validators.pattern('[0-9]*')], 
                    [this.dniExistenteValidator(this, this.perSrv, this.docBelongsTo)] ],

    	telefono:     [null],
      vinculo:      [null],
    	sexo:         [null],
      fenactx:      [null, [this.fechaNacimientoValidator()] ],
    	estado:       [null],
    	comentario:   [null],
    });

  }
  // dniExistenteValidator(that:any, service: PersonService, message: object): AsyncValidatorFn {
  //     return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
  //         let value = control.value;
  //         let tdoc = that.form.controls['tdoc'].value || 'DNI';

  //         return service.testPersonByDNI(tdoc,value).pipe(
  //             map(t => {
  //                 let invalid = false;
  //                 let txt = ''

  //                 if(t && t.length){ 
  //                     invalid = true;
  //                     txt = 'Documento existente: ' + t[0].displayName;
  //                 }

  //                 message['error'] = txt;
  //                 return invalid ? { 'mailerror': txt }: null;

  //             })
  //          )
  //     }) ;
  // }

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
    this.form.reset(this.vinculo);
  }


  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }


}
