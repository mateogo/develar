import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { Product, KitProduct, KitItem, UpdateProductEvent, KitProductModel }    from '../../product.model';
import { ProductController }    from '../../product.controller';

import { Observable ,  Subject}        from 'rxjs';

const CANCEL = 'cancel';
const UPDATE = 'update';
const CREATE = 'create';
const TOKEN_TYPE = 'kitproducto';

@Component({
  selector: 'product-kit-edit',
  templateUrl: './product-kit-edit.component.html',
  styleUrls: ['./product-kit-edit.component.scss']
})
export class ProductKitEditComponent implements OnInit {
	@Input() kitProduct: KitProduct = new KitProduct();
  @Input() kit$: Subject<KitProduct>  = new Subject<KitProduct>();
	@Output() updateToken = new EventEmitter<UpdateProductEvent>();

	pageTitle: string = 'Kit de Productos';

	public form: FormGroup;
  public openEditor = false;

  public meContent: string = '';
  public mePlaceholder: string = 'Descripción';
  private action = CANCEL;

  public kitList: KitItem[] = [];

  public estadoOptList =  KitProductModel.getOptionlist('estado');
	public kitTypeOptList = KitProductModel.getOptionlist('kittype');

  constructor(
  	private fb: FormBuilder,
    private productCtrl: ProductController
  	) { 
    this.form = this.fb.group({
      code:        [null,  Validators.compose([Validators.required])],
      name:        [null,  Validators.compose([Validators.required])],
      type:        [null],
      slug:        [null,  Validators.compose([Validators.required])],
      qty:         [null],
      estado:      [null],
    });
  }

  ngOnInit() {
  	this.initDataToEdit();
    this.kit$.subscribe(t => {
      this.kitProduct = t;
      this.initDataToEdit();
    })


  }

  initDataToEdit(){
  	this.formReset(this.kitProduct);

  }

  formReset(model){
    this.form.reset({
      code:     model.code,
      name:     model.name,
      type:     model.type,
      slug:     model.slug,
      qty:      model.qty,
      estado:   model.estado
    })
    this.buildKitItems(model.products)
  }

  buildKitItems(p: KitItem[]){
    p = p || [];
    let kitItemsFG = p.map(kit => this.fb.group(kit))
    let kitFormArray = this.fb.array(kitItemsFG);
    this.form.setControl('kits', kitFormArray);
  }

  get kits(): FormArray{
    return this.form.get('kits') as FormArray;
  }

  removeKitItem(item){
    let formArray = this.form.get('kits') as FormArray;
    formArray.removeAt(item);
  }

  addKitItem(item:KitItem){
    let kitItemFG = this.fb.group(item);
    let formArray = this.form.get('kits') as FormArray;
    formArray.push(kitItemFG);

  }

  removeItem(e, item){
    e.preventDefault();
    this.removeKitItem(item);
  }

  onSubmit(){
  	this.initForSave(this.form, this.kitProduct);
  	this.action = this.kitProduct._id ? UPDATE : CREATE;
  	this.emitEvent(this.action, this.kitProduct);
    this.cleanForm();
  }

  onCancel(){
    this.cleanForm();
  }

  cleanForm(){
    setTimeout(()=>{
      this.kitProduct = new KitProduct();
      this.initDataToEdit();
    },1000)
  }

  initForSave(form: FormGroup, kitProduct: KitProduct){
  	const fvalue = form.value;

    const kitItems: KitItem[] = fvalue.kits.map(t => Object.assign({}, t))

		kitProduct.code =    fvalue.code;
		kitProduct.name =    fvalue.name;
		kitProduct.type =    fvalue.type;
		kitProduct.slug =    fvalue.slug;
		kitProduct.qty =     fvalue.qty;
    kitProduct.estado =  fvalue.estado;

    kitProduct.products = kitItems;

		return kitProduct;
  }

  handleProduct(p: Product){
    this.insertProduct(p);
  }

  insertProduct(p:Product){
    let item = this.kitList.find(t => t.productId === p._id);
    let kit = {
        productId: p._id,
        productCode: p.code,
        productName: p.name,
        productUME: p.pume,
        item_qty: 1
      }


    if(!item) {
      this.kitList.push(kit);
      this.addKitItem(kit);
    }

  }
  
  changeProductClass(type, value){
    //

  }


  emitEvent(action:string, token: KitProduct){
  	this.updateToken.next({
  		action: action,
  		type: TOKEN_TYPE,
  		token: token
  	});
  }

}

