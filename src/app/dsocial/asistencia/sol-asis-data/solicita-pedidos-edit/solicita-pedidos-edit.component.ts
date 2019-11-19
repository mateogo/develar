import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { DsocialController } from '../../../dsocial.controller';

import { CustomValidators } from 'ng2-validation';

import { Person } from '../../../../entities/person/person';
import { Product, KitProduct, KitItem, UpdateProductEvent, KitProductModel }    from '../../../../entities/products/product.model';

import { AlimentosHelper } from '../../../alimentos/alimentos.model';

import { 	Asistencia, 
					Alimento, 
					Pedido,
					Modalidad,
					ItemPedido,
					UpdatePedidoEvent, 
					AsistenciaHelper } from '../../asistencia.model';

import { KitOptionList } from '../../../alimentos/alimentos.model';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'pedido';
const CANCEL = 'cancel';
const UPDATE = 'update';

@Component({
  selector: 'solicita-pedidos-edit',
  templateUrl: './solicita-pedidos-edit.component.html',
  styleUrls: ['./solicita-pedidos-edit.component.scss']
})
export class SolicitaPedidosEditComponent implements OnInit {
	@Input() pedido: Pedido;
  @Input() asistencia: Asistencia;
  @Input() kitOptList:KitOptionList[] = [];

	@Output() updateToken = new EventEmitter<UpdatePedidoEvent>();

	public form: FormGroup;

  private action = "";
  private fireEvent: UpdatePedidoEvent;

  public depositoOptList =  AsistenciaHelper.getOptionlist('deposito');
  public alimentosOptList =  AsistenciaHelper.getOptionlist('alimentos');
  public pedidosOptList =  AsistenciaHelper.getOptionlist('pedidos');
  public frecuencaOptList =  AsistenciaHelper.getOptionlist('frecuencia');
  public periodoOptList =    AsistenciaHelper.getOptionlist('periodo');
  public causasOptList =   AsistenciaHelper.getOptionlist('causa');
  public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  public avanceEstadoRelation = AsistenciaHelper.getAvanceEstadoRelation();

  public kitEntregaOptList: KitOptionList[];
  public currentKit: KitProduct;
  public currentItemList: ItemPedido[];

  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
	}

  ngOnInit() {
  	this.initForEdit(this.form, this.pedido, this.asistencia);
    this.kitEntregaOptList = this.kitOptList;
  }

  onSubmit(){
  	this.initForSave(this.form, this.pedido);
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
  		token: this.pedido
  	});

  }

  changeSelectionValue(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
    if(type==='avance'){
      this.estadoOptList = this.avanceEstadoRelation[val] || [];
      if(this.pedido.avance === val && this.pedido.estado){
        this.form.get('estado').setValue(this.pedido.estado);

      } else if(this.estadoOptList.length === 1){
        this.form.get('estado').setValue(this.estadoOptList[0].val);

      }else {
        this.form.get('estado').setValue(null);

      }
    }

  }

  changePeriodo(type, val){
      //this.form.controls['city'].setValue(t.city);
    if(!this.asistencia) return;
    let date_from = devutils.dateFromTx(this.asistencia.fecomp_txa);
    let date_to = devutils.dateFromTx(this.asistencia.fecomp_txa);
    let freq = this.form.controls['freq'].value;

    let datex;

    if(type==="periodo" && val==="3M"){
      datex =  devutils.projectedDate(date_to, 0, 3);

    }else if(type==="periodo" && val==="6M"){
      datex =  devutils.projectedDate(date_to, 0, 6);

    }else if(type==="periodo" && val==="9M"){
      datex =  devutils.projectedDate(date_to, 0, 9);

    }else if(type==="periodo" && val==="12M"){
      datex =  devutils.projectedDate(date_to, 0, 12);

    }

    if(val === 'UNICO'){
      this.form.get('freq').setValue('unica');

    }else {
      if(freq && freq === 'unica'){
        this.form.get('freq').setValue('mensual');

      }
    }

    this.form.controls['fechad'].setValue(devutils.txFromDate(date_from));
    this.form.controls['fechah'].setValue(devutils.txFromDate(date_to));
  }


  private initForEdit(form: FormGroup, pedido: Pedido, asistencia: Asistencia): FormGroup {

    let modalidad: Modalidad = pedido.modalidad || new Modalidad();
    let fecha = new Date();
    let action = asistencia.action || '';
    this.currentItemList = pedido.items || [];

    form.reset({
      periodo:      modalidad.periodo,
      fechad:       modalidad.fe_txd || devutils.txFromDate(fecha),
      fechah:       modalidad.fe_txh || devutils.txFromDate(fecha),
      freq:         modalidad.freq,

      type:         pedido.type || action,
      qty:          pedido.kitQty,
      deposito:     pedido.deposito,
      causa:        pedido.causa,
      estado:       pedido.estado,
      avance:       pedido.avance,
      observacion:  pedido.observacion,
    });

    this.buildKitItems(this.currentItemList)

    return form;
  }

  private buildKitItems(k: ItemPedido[]){
    k = k || [];
    let kitItemsFG = k.map(kit => this.fb.group(kit))
    let kitFormArray = this.fb.array(kitItemsFG);
    this.form.setControl('items', kitFormArray);
  }

  get items(): FormArray{
    return this.form.get('items') as FormArray;
  }

  handleProduct(product: Product){
    let item = this.buildNewItem(product);
    this.addKitItem(item);
  }

/********
    export class ItemPedido {
      slug: string;

      kitItem: number = 0; // 0: es un item cargado a mano 1: item que deviene de KIT
      productId: string;
      code: string;
      name: string;
      ume: string;
      qty: number = 1;
      punitario: number = 0;
    }
******/

  private buildNewItem(p: Product){
    return {
      productId:  p._id,
      code:       p.code,
      name:       p.name,
      slug:       p.slug,
      ume:        p.pume,
      punitario:  0,
      kitItem:    0,
      qty: 1
    } as ItemPedido
  }

  addKitItem(item:ItemPedido){
    let kitItemFG = this.fb.group(item);
    let formArray = this.form.get('items') as FormArray;
    formArray.push(kitItemFG);
  }

  removeItem(e, item){
    e.preventDefault();
    this.removeKitItem(item);
  }

  private removeKitItem(item){
    let formArray = this.form.get('items') as FormArray;
    formArray.removeAt(item);
  }

  updateItems(type, val){
    let formArray = this.form.get('items') as FormArray;
    
    formArray.clear()

    this.currentItemList.forEach(t => {
      let kitItemFG = this.fb.group(t);
      formArray.push(kitItemFG);
    })

  }

  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      type:        [null, Validators.compose([Validators.required])],
      freq:        [null, Validators.compose([Validators.required])],
      qty:         [null, Validators.compose([Validators.required])],
      periodo:     [null],
      fechad:      [null],
      fechah:      [null],

      deposito:    [null,  Validators.compose([Validators.required])],
      urgencia:    [null],
      causa:       [null,  Validators.compose([Validators.required])],
      estado:      [null,  Validators.compose([Validators.required])],
      avance:      [null,  Validators.compose([Validators.required])],
      observacion: [null],
    });

    return form;
  }

  //Kits
	initForSave(form: FormGroup, pedido: Pedido): Pedido {
		const fvalue = form.value;
		const entity = pedido;
		let modalidad: Modalidad = new Modalidad();
    const itemArray: ItemPedido[] = fvalue.items.map(t => Object.assign({}, t))

    let dateD = devutils.dateFromTx(fvalue.fechad);
    let dateH = devutils.dateFromTx(fvalue.fechah);

    modalidad['periodo'] = fvalue.periodo;
    modalidad['freq'] =    fvalue.freq;

    modalidad['fe_txd'] =  fvalue.fechad;
    modalidad['fe_tsd'] =  dateD ? dateD.getTime() : 0;

    modalidad['fe_txh'] = fvalue.fechah;
    modalidad['fe_tsh'] = dateH ? dateH.getTime() : 0;

    entity.type =        fvalue.type;

    entity.kitQty =      fvalue.qty;
    entity.deposito =    fvalue.deposito;
    entity.observacion = fvalue.observacion;
    entity.estado =      fvalue.estado;
    entity.avance =      fvalue.avance;
    entity.causa =       fvalue.causa;

    entity.modalidad = modalidad;
    entity.items = itemArray;

		return entity;
	}

}
