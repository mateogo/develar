import { Component, OnInit, OnDestroy, Input, Output, OnChanges, HostListener, EventEmitter } from '@angular/core';

import { Product, Productsn, ProductBaseData, productModel }    from '../product.model';
import { Person }    from '../../person/person';
import { ProductController }    from '../product.controller';

import { devutils } from '../../../develar-commons/utils';
import { Subject ,  Observable } from 'rxjs';

@Component({
  selector: 'myproducts-browse',
  templateUrl: './myproducts-page.component.html',
  styleUrls: ['./myproducts-page.component.scss']
})
export class MyproductsPageComponent implements OnInit {

	//private product: Product;
	public productId: string = "";
	public productName:string = "";
  public productFromDb: Product;

  public serialOwner: Person;
	
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
    console.log('noOnDestroy')
    this.modelScrptn.unsubscribe()

  }

  ngOnChanges(){
    console.log('ngOnChanges;')
  }

  ngOnInit() {

    // this.modelScrptn = this.productCtrl.productSerialListener.subscribe(model =>{
    //   this.initProductSerialData(model);
    //   this.token = model;
    // })

    // this.productCtrl.initProductSerialEdit(this.token, this.tokenId);

    console.log('PRODUCT-PAGE init')
    this.modelScrptn = this.productCtrl.serialsByOwner.subscribe(list =>{
      console.log('PRODUCT-PAGE listener subscribe');
      this.actualOwner = this.productCtrl.actualOwner;

      if(this.actualOwner){
        this.actualOwnerId = this.actualOwner._id;
        this.actualOwnerName = this.actualOwner.displayName;
      }

    });

    this.productCtrl.fetchSerialsByOwner();

  }


  updateTableList(){
    this.productCtrl.fetchSerialsByOwner();
  }

  initProductSerialData(model){
    //console.log('initProductSerialData [%s]', model)
    this.updateTableList();
  }

  initToSave(){
    console.log('InitToSave');
    //this.token.actualOwnerId = this.actualOwnerId;
    //this.token.actualOwnerName = this.actualOwnerName;
    //this.token.productId = this.productId;
    this.token.productName = this.productName || this.productFromDb.slug;
  }

  save(target){
    if(this._editMany){
      this.saveMany(target);

    }else{
      this.initToSave()
      this.productCtrl.updateProductSerialRecord(this.token).then(model =>{
        this.tokenId = model._id;
        this.productCtrl.fetchSerialsByOwner();
        this.closeEditor();
      });
    }
  }

  saveMany(target){
    let base = this.productCtrl.actualProductSerialNewData(this.token);
    delete base['_id'];

    this.productEditList.forEach(prod =>{
      console.log('forEach: [%s] [%s]', prod.slug, prod._id);
      prod = this.productCtrl.updateProductSerialCommonData(prod, base);
      //this.token = prod;
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

  closeEditor(){
    this._openEditor = false;

  }

  private hasSelection(open:boolean):boolean{
    let hasSel = false;
    if (open && this.productId ) hasSel = true;

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
    this.actualOwnerName = this.token.actualOwnerName;

    
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
  addNewCerradura(){
    this._openTokenEditor = true;
  }
 
  actionTriggered(action){
    console.log('productsn-component: actionTriggered:[%s]', action)
    if(action === 'editone')      this.editTableSelectedProductList();
  }

}


//59701fab9c481d0391eb39b9
//59701ef09c481d0391eb39b8

//[5a81c3e50154ba0874d5b62f]