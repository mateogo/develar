import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person } from '../../../../entities/person/person';

import { 	Asistencia, 
					Alimento, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';


import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'alimentos';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'alimentos-edit',
  templateUrl: './solicita-alimentos-edit.component.html',
  styleUrls: ['./solicita-alimentos-edit.component.scss']
})
export class SolicitaAlimentosEditComponent implements OnInit {
	@Input() token: Alimento;
	@Output() updateToken = new EventEmitter<UpdateAlimentoEvent>();



	public form: FormGroup;


  private action = "";
  private fireEvent: UpdateAlimentoEvent;

  public alimentosOptList =  AsistenciaHelper.getOptionlist('alimentos');
  public frecuencaOptList =  AsistenciaHelper.getOptionlist('frecuencia');

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
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      type:        [null, Validators.compose([Validators.required])],
      freq:        [null, Validators.compose([Validators.required])],
      qty:         [null, Validators.compose([Validators.required])],
      fechad:      [null],
      fechah:      [null],
      observacion: [null],
    });

    return form;
  }

  initForEdit(form: FormGroup, token: Alimento): FormGroup {
		form.reset({
      type:         token.type,
      freq:         token.freq,
      qty:          token.qty,
      fechad:       token.fe_txd,
      fechah:       token.fe_txh,
      observacion:  token.observacion,
		});

		return form;
  }

	initForSave(form: FormGroup, token: Alimento): Alimento {
		const fvalue = form.value;
		const entity = token;

    entity.type =         fvalue.type;
    entity.freq =         fvalue.freq;
    entity.qty =          fvalue.qty;
    entity.fe_txd =       fvalue.fechad;
    entity.fe_txh =       fvalue.fechah;
    entity.observacion =  fvalue.observacion;

		return entity;
	}

}

