import { Component, OnInit, OnDestroy, Input, Output, OnChanges, HostListener, EventEmitter } from '@angular/core';

import { Product, Productsn, ProductBaseData, productModel }    from '../product.model';
import { Person }    from '../../person/person';
import { ProductController }    from '../product.controller';

import { devutils } from '../../../develar-commons/utils';
import { Subject ,  Observable } from 'rxjs';


@Component({
  selector: 'productsn',
  templateUrl: './productsn.component.html',
  styleUrls: ['./productsn.component.scss']
})
export class ProductsnComponent implements OnInit, OnChanges, OnDestroy {
	//private product: Product;
	public productId: string = "";
	public productName:string = "";
  public productFromDb: Product;
	
  public actualOwner: Person;
  public actualOwnerId: string = "";
  public actualOwnerName:string = "";

	public _openEditor: boolean = false;
  public _openTokenEditor:boolean = false;
	
  private editable: boolean = true;
  private _editMany: boolean = false;

	private token: Productsn;
  private tokenId: string;
  private productEditList: Productsn[];
  private modelScrptn;

  public editorTitle = "Alta nuevo producto identificado con número de serie";


  constructor(
    private productCtrl: ProductController
    ) { }

  ngOnDestroy(){
    this.modelScrptn.unsubscribe()
  }

  ngOnChanges(){

  }

  ngOnInit() {
    this.modelScrptn = this.productCtrl.productSerialListener.subscribe(model =>{
      this.initProductSerialData(model);
      this.token = model;
    })

    this.productCtrl.initProductSerialEdit(this.token, this.tokenId);
  }

  updateTableList(){
    if(this.productId)
      this.productCtrl.findSerialsByQuery('productsn', {productId: this.productId});    
  }

  initProductSerialData(model){
    this.updateTableList();
  }

  initToSave(){
    this.token.actualOwnerId = this.actualOwnerId;
    this.token.actualOwnerName = this.actualOwnerName;
    this.token.productId = this.productId;
    this.token.productName = this.productName || this.productFromDb.slug;
  }

  save(target){
    if(this._editMany){
      this.saveMany(target);

    }else{
      this.initToSave()
      this.productCtrl.saveItemRecord().then(model =>{
        this.tokenId = model._id;
        this.productCtrl.initProductSerialEdit(model, model._id);
      });
    }
  }

  saveMany(target){
    let base = this.productCtrl.actualProductSerialNewData(this.token);
    delete base['_id'];

    this.productEditList.forEach(prod =>{
      prod = this.productCtrl.updateProductSerialCommonData(prod, base);
      this.saveToken(prod)
    });
    this.resetEditMany(this.token);
  }

  saveToken(prod: Productsn){
    this.productCtrl.updateProductSerialRecord(prod);
  }

  resetEditMany(token: Productsn){
    this.productCtrl.initProductSerialEdit(this.token, this.token._id)
    this._editMany = false;
    this.productEditList = [];
  }

  saveNew(target){
    this.initToSave()
    this.productCtrl.cloneProductSerialRecord().then(model =>{
      this.tokenId = model._id;
      this.productCtrl.initProductSerialEdit(model, model._id);
    });
  }


  updateProduct(productSelected: Product){
  	this.productFromDb = productSelected;
  	this.productId = productSelected._id;
  	this.productName = productSelected.name;

    this.updateTableList();

    this.changeEditorTitle('Detalle identificado de: ' + this.productName);

    this.inheritData(productSelected);
  }

  inheritData(product: Product){
    this.token.code = product.code;
  }

  updatePerson(personSelected: Person){
      this.actualOwner = personSelected;
      this.actualOwnerId = personSelected._id;
      this.actualOwnerName = personSelected.displayName;
  }

 openNewTokensEditor(open:boolean){
   this._openTokenEditor = this.hasSelection(open);

   return this._openTokenEditor;
  }

  openEditor(open:boolean){
    this._openEditor = this.hasSelection(open);
    this.changeEditorTitle();
  	return this._openEditor;
  }

  private hasSelection(open:boolean):boolean{
    let hasSel = false;
    if (open && this.productId && this.actualOwnerId) hasSel = true;

    return hasSel;
  }


  editTableSelectedProductList(){
    this.productEditList = this.productCtrl.fetchSelectedProductSerialList();
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

    this.token = this.productCtrl.buildCommonSerialData(this.productEditList);

    this.tokenId = this.token._id;

    this.productId =  this.token.productId;
    this.productName = this.token.productName;
    
    this.productCtrl.initProductSerialEdit(this.token, this.tokenId);
    this.openEditor(true);

  }

  removeParentProduct(){
    this.productId =  null;
    this.productName = null;
    this.openEditor(false);
  }

  removeParentVendor(){
    this.actualOwnerId = null;
    this.actualOwnerName = null;
    this.openEditor(false);
  }
 
  actionTriggered(action){
    if(action === 'editone')      this.editTableSelectedProductList();
  }

}
