import { Component, OnInit, OnDestroy, Input, Output, OnChanges, HostListener, EventEmitter } from '@angular/core';

import { Product, Productit, ProductBaseData, productModel }    from '../product.model';
import { Person }    from '../../person/person';
import { ProductController }    from '../product.controller';

import { devutils } from '../../../develar-commons/utils';
import { Subject ,  Observable } from 'rxjs';

@Component({
  selector: 'productit',
  templateUrl: './productit.component.html',
  styleUrls: ['./productit.component.scss']
})
export class ProductitComponent implements OnInit, OnChanges, OnDestroy {
	public productId: string = "";
	public productName:string = "";
  private productFromDb: Product;
	
	private vendor: Person;
	public vendorId: string = "";
	public vendorName:string = "";

	private pumeList: Array<any> = [];
	private fumeList: Array<any> = [];
  private typeList: Array<any> = [];
	private currencyList:Array<any> = [];

	private lprecios: string = "";
	private marca: string = "";
	private modelo: string = "";

	public _openEditor: boolean = false;
	private editable: boolean = true;
  private _editMany: boolean = false;

	private token: Productit;
  private tokenId: string;
  private productEditList: Productit[];
  private modelScrptn;

  public editorTitle = "Alta nuevo detalle de producto";

  constructor(
    private productCtrl: ProductController

    ) { }

  ngOnDestroy(){
    this.modelScrptn.unsubscribe()

  }

  ngOnChanges(){

  }

  ngOnInit() {
  	this.currencyList =  devutils.currencies;
  	this.pumeList = productModel.getProductUmeList();
  	this.fumeList = productModel.getProductFumeList();

    this.modelScrptn = this.productCtrl.productItemListener.subscribe(model =>{
      this.initProductItemData(model);
      this.token = model;
    })

    this.productCtrl.initProductItEdit(this.token, this.tokenId);



  }

  updateTableList(){
    if(this.productId)
      this.productCtrl.findByQuery('productit', {productId: this.productId});    
  }

  initProductItemData(model){
    this.updateTableList();
  }

  initToSave(){
    this.token.vendorId = this.vendorId;
    this.token.vendorname = this.vendorName;
    this.token.productId = this.productId;
    this.token.productname = this.productName || this.productFromDb.slug;
  }

  save(target){
    if(this._editMany){
      this.saveMany(target);

    }else{
      this.initToSave()
      this.productCtrl.saveItemRecord().then(model =>{
        this.tokenId = model._id;
        this.productCtrl.initProductItEdit(model, model._id);
      });
    }
  }

  saveMany(target){
    let base = this.productCtrl.actualNewData(this.token);
    delete base['_id'];
    delete base['assets'];
    delete base['parents'];

    this.productEditList.forEach(prod =>{
      prod = this.productCtrl.updateCommonData(prod, base);
      this.saveToken(prod)
    });
    this.resetEditMany(this.token);
  }

  saveToken(prod: Productit){
    this.productCtrl.updateItemRecord(prod);
  }

  resetEditMany(token: Productit){
    this.productCtrl.initProductItEdit(this.token, this.token._id)
    this._editMany = false;
    this.productEditList = [];
  }

  saveNew(target){
    this.initToSave()
    this.productCtrl.cloneItemRecord().then(model =>{
      this.tokenId = model._id;
      this.productCtrl.initProductItEdit(model, model._id);
    });
  }


  updateProduct(productSelected: Product){
  	this.productFromDb = productSelected;
  	this.productId = productSelected._id;
  	this.productName = productSelected.name;

    this.typeList = productModel.getProductTypeList(productSelected.pclass);
    this.updateTableList();

    this.changeEditorTitle('Items de: ' + this.productName);

    this.inheritData(productSelected);
  	this.openEditor();

  }

  inheritData(product: Product){
    this.token.pmodel = product.pmodel;
    this.token.pbrand = product.pbrand;
    this.token.ptype = product.ptype;
    this.token.pume = product.pume;
    this.token.code = product.code;
  }

  updatePerson(personSelected: Person){
	  	this.vendor = personSelected;
	  	this.vendorId = personSelected._id;
	  	this.vendorName = personSelected.displayName;
	  	this.openEditor();
  }

  openEditor(){
  	if(this.productId && this.vendorId){
  		this._openEditor = true;
  	}else{
  		this._openEditor = false;
  	}

    this.changeEditorTitle();
  	return this._openEditor;
  }

  changePume(val){
  }
  changeFume(val){
  }
  changeType(val){
  }

  editTableSelectedProductList(){
    this.productEditList = this.productCtrl.fetchSelectedList();
    this.editMany();
  }

  changeEditorTitle(title?){
    if(!title){
      if(this._editMany){
        this.editorTitle = 'Edición múltiple'; 
      }else{
        this.editorTitle = 'Editando: ' + this.token.slug + ' (' + this.token._id + ')'; 
      }
    }else{
      this.editorTitle = title;
    }
    this.productCtrl.changePageTitle(this.editorTitle);
  }

  editMany(){
    if(!this.productEditList || !this.productEditList.length) return;
    this._editMany = this.productEditList.length > 1 ? true : false;

    this.token = this.productCtrl.buildCommonData(this.productEditList);

    this.tokenId = this.token._id;

    this.vendorId = this.token.vendorId;
    this.vendorName = this.token.vendorname;
    
    this.productId =  this.token.productId;
    this.productName = this.token.productname;
    
    this.productCtrl.initProductItEdit(this.token, this.tokenId);
    this.openEditor();

  }

  removeParentProduct(){
    this.productId =  null;
    this.productName = null;
    this.openEditor();
  }

  removeParentVendor(){
    this.vendorId = null;
    this.vendorName = null;
    this.openEditor();
  }

  actionTriggered(action){
    if(action === 'editone')      this.editTableSelectedProductList();
  }

}
