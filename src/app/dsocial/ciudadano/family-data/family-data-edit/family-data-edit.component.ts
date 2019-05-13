import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, UpdateFamilyEvent, FamilyData, personModel } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'family';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'family-edit',
  templateUrl: './family-data-edit.component.html',
  styleUrls: ['./family-data-edit.component.scss']
})
export class FamilyDataEditComponent implements OnInit {

	@Input() token: FamilyData;
	@Output() updateToken = new EventEmitter<UpdateFamilyEvent>();

	public form: FormGroup;
  public persontypes        = personModel.persontypes;
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public tprofPersonaFisica = personModel.profesiones;
  public nivelEstudios      = personModel.nivelEstudios;
  public estadoCivil        = personModel.estadoCivilOL;
  public vinculos           = personModel.vinculosFamiliares;
  public estados            = personModel.estadosVinculo;


  private provincias = personModel.provincias;
  private addTypes   = personModel.addressTypes;
  private paises     = personModel.paises;

  private action = "";

  private fireEvent: UpdateFamilyEvent;

  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}



  ngOnInit() {
  	this.initForEdit(this.form, this.token);

  }

  onSubmit(){
  	this.initForSave(this.form, this.token);
  	this.action = UPDATE;
  	this.emitEvent(this.action);
  }

  onCancel(){
  	this.action = CANCEL;
  	this.emitEvent(this.action);
  }

  emitEvent(action:string){
  	this.updateToken.next({
  		action: action,
  		type: TOKEN_TYPE,
  		token: this.token
  	});

  }

  changeSelectionValue(type, val){
    console.log('Change [%s] nuevo valor: [%s]', type, val);
  }
 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      nombre:       [null],
      apellido:     [null],
      tdoc:         [null],
      ndoc:         [null],
    	vinculo:      [null],
      fenactx:      [null],
      ecivil:       [null],
      nestudios:    [null],
      tprofesion:   [null],
    	ocupacion:    [null],
    	tocupacion:   [null],
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
      tprofesion:   token.tprofesion,
    	ocupacion:    token.ocupacion,
    	tocupacion:   token.tocupacion,
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
		entity.ecivil =       fvalue.ecivil;
		entity.nestudios =    fvalue.nestudios;
		entity.tprofesion =   fvalue.tprofesion;
		entity.ocupacion =    fvalue.ocupacion;
		entity.tocupacion =   fvalue.tocupacion;
		entity.ingreso =      fvalue.ingreso;
		entity.estado =       fvalue.estado;
		entity.desde =        fvalue.desde;
		entity.hasta =        fvalue.hasta;
		entity.comentario =   fvalue.comentario;


    if(fvalue.fenactx){
      entity.fenac = devutils.dateFromTx(fvalue.fenactx).getTime();
    }else{
      entity.fenac = 0;
    }
		return entity;
	}

}
