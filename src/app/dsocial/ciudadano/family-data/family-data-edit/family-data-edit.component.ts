import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Observable } from 'rxjs';
import { map  }   from 'rxjs/operators';

import { Person, UpdateFamilyEvent, FamilyData, personModel } from '../../../../entities/person/person';

import { DsocialController } from '../../../dsocial.controller';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'family';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'family-edit',
  templateUrl: './family-data-edit.component.html',
  styleUrls: ['./family-data-edit.component.scss']
})
export class FamilyDataEditComponent implements OnInit {
	@Input() familymember: FamilyData;
	@Output() updateToken = new EventEmitter<UpdateFamilyEvent>();

	public form: FormGroup;
  public persontypes        = personModel.persontypes;
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public tocupacionPersonaFisica = personModel.oficiosTOcupacionList;
  public nivelEstudios      = personModel.nivelEstudios;
  public estadoCivil        = personModel.estadoCivilOL;
  public vinculos           = personModel.vinculosFamiliares;
  public estados            = personModel.estadosVinculo;

  public tDoc = 'DNI';
  public personError = false;
  public personErrorMsg = '';


  private provincias = personModel.provincias;
  private addTypes   = personModel.addressTypes;
  private paises     = personModel.paises;

  public docBelongsTo = {error: ''};

  private action = "";

  private fireEvent: UpdateFamilyEvent;

  constructor(
  	private fb: FormBuilder,
    private dsCtrl: DsocialController,
  	) { 
  		this.form = this.buildForm();
	}

  handlePerson(p: Person){
    this.acceptPersonaAsFamilyMember(p);
  }

  private acceptPersonaAsFamilyMember(p: Person){
    // validate
    // caso: OK
    this.familymember = personModel.buildFamilyDataFromPerson(p, this.familymember);
    this.initForEdit(this.form, this.familymember);

  }


  ngOnInit() {
    setTimeout(()=> {
      this.initForEdit(this.form, this.familymember);
    },200)
  }

  onSubmit(){
  	this.initForSave(this.form, this.familymember);
  	this.action = UPDATE;
  	this.emitEvent(this.action);
  }

  onCancel(){
  	this.action = CANCEL;
  	this.emitEvent(this.action);
  }

  deleteToken(){
    this.action = DELETE;
    this.emitEvent(this.action);

  }

  emitEvent(action:string){
  	this.updateToken.next({
  		action: action,
  		type: TOKEN_TYPE,
  		token: this.familymember
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

  hasError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }
 
  dniExistenteValidator(that:any, service: DsocialController, message: object): AsyncValidatorFn {
      return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
          let value = control.value;
          let tdoc = that.form.controls['tdoc'].value || 'DNI';

          return service.testPersonByDNI(tdoc,value).pipe(
              map(t => {
                  let invalid = false;
                  let txt = ''

                  if(t && t.length){ 
                      //invalid = true;
                      //txt = 'Documento existente: ' + t[0].displayName;
                      that.familymember.hasOwnPerson = true;
                      that.familymember.personId = t[0]._id;
                  }

                  // message['error'] = txt;
                  return invalid ? { 'mailerror': txt }: null;

              })
           )
      }) ;
  }


  changeSelectionValue(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
  }
 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      nombre:       [null, Validators.compose( [Validators.required])],
      apellido:     [null, Validators.compose( [Validators.required])],
      tdoc:         [null, Validators.compose( [Validators.required])],

      ndoc: [null, [Validators.required, 
                    Validators.minLength(6),
                    Validators.maxLength(10),
                    Validators.pattern('[0-9]*')], 
                    [this.dniExistenteValidator(this, this.dsCtrl, this.docBelongsTo)] ],

    	vinculo:      [null],
      fenactx:      [null, [this.fechaNacimientoValidator()] ],
      ecivil:       [null],
      nestudios:    [null],
      tocupacion:   [null],
    	ocupacion:    [null],
    	ingreso:      [null],
    	estado:       [null],
    	desde:        [null],
    	hasta:        [null],
    	comentario:   [null],
    });
    return form;
  }

  initForEdit(form: FormGroup, token: FamilyData): FormGroup {
		form.reset({
      nombre:       token.nombre,
      apellido:     token.apellido,
      tdoc:         token.tdoc,
      ndoc:         token.ndoc,
    	vinculo:      token.vinculo,
      fenactx:      token.fenactx,
      ecivil:       token.ecivil,
      nestudios:    token.nestudios,
      tocupacion:   token.tocupacion,
    	ocupacion:    token.ocupacion,
    	ingreso:      token.ingreso,
    	estado:       token.estado,
    	desde:        token.desde,
    	hasta:        token.hasta,
    	comentario:   token.comentario,
		});

		return form;
  }

	initForSave(form: FormGroup, token: FamilyData): FamilyData {
		const fvalue = form.value;
		const entity = token; 

		entity.nombre =       fvalue.nombre;
		entity.apellido =     fvalue.apellido;
		entity.tdoc =         fvalue.tdoc;
		entity.ndoc =         fvalue.ndoc;
		entity.vinculo =      fvalue.vinculo;
		entity.fenactx =      fvalue.fenactx;

    entity.fenactx = fvalue.fenactx;
    let dateD = devutils.dateFromTx(entity.fenactx);
    entity.fenac = dateD ? dateD.getTime() : 0;

		entity.ecivil =       fvalue.ecivil;
		entity.nestudios =    fvalue.nestudios;
		entity.tocupacion =   fvalue.tocupacion;
		entity.ocupacion =    fvalue.ocupacion;
		entity.ingreso =      fvalue.ingreso;
		entity.estado =       fvalue.estado;
		entity.desde =        fvalue.desde;
		entity.hasta =        fvalue.hasta;
		entity.comentario =   fvalue.comentario;
    entity.hasOwnPerson = personModel.hasMinimumDataToBePerson(entity);

		return entity;
	}

}
