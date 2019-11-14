import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

//import { ProductController }    from '../../../../entities/products/product.controller';
import { DsocialController } from '../../../dsocial.controller';

import { Person, personModel } from '../../../../entities/person/person';

import { RemitoAlmacen, AlimentosHelper, ItemAlmacen, UpdateRemitoEvent, KitOptionList } from '../../alimentos.model';

import { Product, KitProduct, KitItem, UpdateProductEvent, KitProductModel }    from '../../../../entities/products/product.model';

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

	public form: FormGroup;
  public showEdit = false;

  private formAction = "";

  private fireEvent: UpdateRemitoEvent;

  public itemsAlmacen: Array<ItemAlmacen> = [];
  public kitList: KitProduct[];
  public currentKit: KitProduct;
  public currentItemList: ItemAlmacen[];


  public kitEntregaOptList: KitOptionList[];

  constructor(
  	  private fb: FormBuilder,
      private dsCtrl: DsocialController,
  	) { 
  		this.form = this.buildForm();

      this.dsCtrl.loadKitAlimentosOptList();
	}



  ngOnInit() {
    this.dsCtrl.fetchKits('productkit', {}).subscribe(k =>{
        this.kitList = k;
        this.initForEdit(this.form, this.token);
    })

    this.kitEntregaOptList = this.dsCtrl.kitAlimentosOptList;
  }

  initForEdit(form: FormGroup, token: RemitoAlmacen): FormGroup {

    this.currentKitList(token);

    form.reset({
      slug:        token.slug,
      qty:         token.qty,
      kitEntrega:  token.kitEntrega,
    });
    this.buildKitItems(this.currentItemList, token.entregas)
    this.showEdit = true;

    return form;
  }

//http://develar-local.co:4200/dsocial/gestion/atencionsocial/5dc999b11f7ad913b69d81ba
  currentKitList(remito: RemitoAlmacen){
    console.log('REMIT kit[%s]', remito.kitEntrega);
    if(remito.kitEntrega){
      this.currentKit = this.findCurrentKit(remito.kitEntrega);
      this.currentItemList = this.buildItemList(this.currentKit, remito);
    }else{
      this.currentKit = null;
      this.currentItemList = [];
    }

  }

  buildItemList(kit: KitProduct, remito: RemitoAlmacen): ItemAlmacen[]{
    let kits = kit.products;
    let items = kits.map(t =>{
      return {
        productId: t.productId,
        code:      t.productCode,
        name:      t.productName,
        slug:      '',
        isKit:     1,
        ume:       t.productUME,
        qty:       t.item_qty * remito.qty
      } as ItemAlmacen
    });
    return items;
  }

  findCurrentKit(code): KitProduct{
    let kit = this.kitList.find(t => t.code === code);
    return kit;
  }

  buildForm(): FormGroup{
    let form: FormGroup;

    form = this.fb.group({
      slug:        [null],
      qty:         [null],
      kitEntrega:  [null],
    });

    return form;
  }

  //Kits
  buildKitItems(k: ItemAlmacen[], n: ItemAlmacen[]){
    k = k || [];
    let kitItemsFG = k.map(kit => this.fb.group(kit))
    let kitFormArray = this.fb.array(kitItemsFG);
    this.form.setControl('kits', kitFormArray);
  }

  get kits(): FormArray{
    return this.form.get('kits') as FormArray;
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

  handleProduct(product: Product){
    let item = this.buildNewItem(product);
    this.addKitItem(item);
  }

  buildNewItem(p:Product){
    return {
      productId: p._id,
      code: p.code,
      name: p.name,
      slug: p.slug,
      ume: p.pume,
      qty: 1
    } as ItemAlmacen
  }

  /*
  productId: string;
  isKit: number = 0; // 0: es un item cargado a mano 1: item que deviene de KIT
  code: string;
  name: string;
  slug: string;
  ume: string;
  qty: number;
  */


  updateItems(type, val){
    let formArray = this.form.get('kits') as FormArray;
    
    formArray.clear()

    this.currentKit = this.findCurrentKit(val);
    this.currentItemList = this.buildItemList(this.currentKit, this.token);

    this.currentItemList.forEach(t => {
      let kitItemFG = this.fb.group(t);
      formArray.push(kitItemFG);
    })

/*    

    let formArray = this.form.get('kits') as FormArray;

    let controls = formArray.controls 
    controls.forEach()


    this.currentItemList.forEach((t, i) => {
      formArray.removeAt(i);
    })

    this.currentKit = this.findCurrentKit(val);
    this.currentItemList = this.buildItemList(this.currentKit, this.token);

    this.currentItemList.forEach(t => {
      let kitItemFG = this.fb.group(t);
      formArray.push(kitItemFG);
    })
*/
  }

  removeKitItem(item){
    let formArray = this.form.get('kits') as FormArray;
    formArray.removeAt(item);
  }

  addKitItem(item:ItemAlmacen){
    let kitItemFG = this.fb.group(item);
    let formArray = this.form.get('kits') as FormArray;
    formArray.push(kitItemFG);

  }

  removeItem(e, item){
    e.preventDefault();
    this.removeKitItem(item);
  }

	initForSave(form: FormGroup, token: RemitoAlmacen): RemitoAlmacen {
		const fvalue = form.value;
		const entity = token;
    const kitItems: ItemAlmacen[] = fvalue.kits.map(t => Object.assign({}, t))

		entity.slug =         fvalue.slug;
		entity.qty =          fvalue.qty;
		entity.kitEntrega =   fvalue.kitEntrega;

		entity.estado = 'activo';
    entity.entregas = kitItems; //this.itemsAlmacen;


		return entity;
	}

}
//http://develar-local.co:4200/dsocial/gestion/alimentos/59701fab9c481d0391eb39b9