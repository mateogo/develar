import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../../entities/person/person';

import { RemitoAlmacen, AlimentosHelper, ItemAlmacen, UpdateRemitoEvent } from '../../alimentos.model';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';


@Component({
  selector: 'remitoalmacen-create',
  templateUrl: './remitoalmacen-create.component.html',
  styleUrls: ['./remitoalmacen-create.component.scss']
})
export class RemitoalmacenCreateComponent implements OnInit {
	@Input() token: RemitoAlmacen;
	@Output() updateToken = new EventEmitter<UpdateRemitoEvent>();

kitentrega

	public form: FormGroup;

  private formAction = "";

  private fireEvent: UpdateRemitoEvent;

  public itemsAlmacen: Array<ItemAlmacen> = [];


  public kitEntregaOptList =  AlimentosHelper.getOptionlist('kitentrega');

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
  	this.formAction = UPDATE;
  	this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }

  emitEvent(action:string){
  	this.updateToken.next({
  		action: action,
  		type: TOKEN_TYPE,
  		token: this.token
  	});

  }

  changeSelectionValue(type, val){
    this.updateItems(type, val);

  }

  updateItems(type, val){
    let kit = AlimentosHelper.getKitItems('kititems', val);

    this.itemsAlmacen = kit.map((token, k) => {
      return {
        productId: token.id,
        qty: token.qty,
        slug: token.slug,
        ume: token.ume
      }

    })

  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			slug:        [null],
			qty:         [null],
			kitEntrega:  [null, Validators.compose([Validators.required])],
    });

    return form;
  }

  initForEdit(form: FormGroup, token: RemitoAlmacen): FormGroup {
		form.reset({
			slug:        token.slug,
			qty:         token.qty,
			kitEntrega:  token.kitEntrega,
		});

		return form;
  }

	initForSave(form: FormGroup, token: RemitoAlmacen): RemitoAlmacen {
		const fvalue = form.value;
		const entity = token;

		entity.slug =         fvalue.slug;
		entity.qty =          fvalue.qty;
		entity.kitEntrega =   fvalue.kitEntrega;

		entity.estado = 'activo';
    entity.entregas = this.itemsAlmacen;


		return entity;
	}

}
//http://develar-local.co:4200/dsocial/gestion/alimentos/59701fab9c481d0391eb39b9