import { Injectable }    from '@angular/core';
import { Observable ,  Subject ,  BehaviorSubject, of }    from 'rxjs';

import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { SharedService } from '../../develar-commons/shared-service';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Product, KitProduct, KitProductTableData, Productit, Productsn, ProductEvent, ProductitTable, ProductsnTable, ProductBaseData, UpdateProductEvent, KitProductModel, productModel } from './product.model';


import { devutils } from '../../develar-commons/utils';


import { Tag }                 from '../../develar-commons/develar-entities';

import { DaoService }  from '../../develar-commons/dao.service';
import { UserService } from '../../entities/user/user.service';
import { User }        from '../../entities/user/user';
import { Person }      from '../../entities/person/person';

const CANCEL = 'cancel';
const UPDATE = 'update';
const CREATE = 'create';
const TOKEN_TYPE = 'kitproducto';



const whoami = 'entity.controller';

const newEntityConfirm = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Alta de nueva entidad',
    title: 'Confirme la acción',
    body: 'Se dará de alta: ',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};

function initForSave(basicData: ProductBaseData, model: Product, user: User): Product {
  model.code = basicData.code;
  model.name = basicData.name;
  model.slug    = basicData.slug;

  model.ptype  = basicData.ptype;
  model.pclass = basicData.pclass;
  model.pbrand = basicData.pbrand;
  model.pmodel = basicData.pmodel;

  model.pinventory = basicData.pinventory;
  model.pume       = basicData.pume;
  model.pformula   = basicData.pformula;

  model.description = basicData.description;
  model.taglist = basicData.taglist;
  model.user = user.username;
  model.userId = user._id;


  return model;
};

function initItemForSave(model: Productit, user: User): Productit {
 
  return model;
};

function initProductSerialForSave(model: Productsn, user: User): Productsn {
 
  return model;
};

@Injectable()
export class ProductController {

  private backendUrl = 'api/products';
  private searchUrl  = 'api/products/search';
  private tags: Tag[] = [];

  private productmaster: Product;
  private productmasterId;
  private emitProductMaster = new Subject<Product>();
  private basicData: ProductBaseData;

  private productit;
  private productitId;

  private productsn: Productsn;
  private productsnId;

  private emitProductItem = new Subject<Productit>();
  private emitProductSerial = new Subject<Productsn>();
  private emitSerialsByOwner = new Subject<Productsn[]>();
  
  private productitList: Productit[] = [];
  private productsnList: Productsn[] = [];

  /*****************
    myProducts PAGE
  *****************/
  private myProductsListener: Subject<boolean>;
  private pageUser: User;
  private pagePerson: Person;




  private emitProductTable = new BehaviorSubject<ProductitTable[]>([]);
  private _selectionModel: SelectionModel<ProductitTable>

  private emitProductsnTable = new BehaviorSubject<ProductsnTable[]>([]);
  private _selectionsnModel: SelectionModel<ProductsnTable>

  /*****************
    KitProduct
  *****************/
  private productkit: KitProduct
  private productkitId;
  private productkitList: KitProduct[] = [];


  private emitProductkitTable = new BehaviorSubject<KitProductTableData[]>([]);
  private _selectionkitModel: SelectionModel<KitProductTableData>



  private _tableActions: Array<any> = productModel.tableActionOptions;

  private handleError(error: any): Promise<any> {
    console.error('[%s]: Ocurrió un error: [%s]',whoami, error);
    return Promise.reject(error.message || error);
  }

  constructor(
    private daoService: DaoService,
    public snackBar: MatSnackBar,
    public userService: UserService,
    public sharedSrv:   SharedService
    ) { 
  }

  findById<T>(type:string, modelId: string):Promise<T>{
    return this.daoService.findById<T>(type, modelId)
      .then(response => {
        if(response){
          this.manageResponse(type, response);
        }
        return response as T
      })
      .catch(err => {
        return err;
      });
  }

  findByQuery<T>(type:string, query: any){
    this.daoService.search<Productit>(type, query).subscribe(list => {
      this.productitList = list;
      this.updateTableData();
    })
  }

  updateTableData(){
    let tableData = productModel.buildProductTable(this.productitList);
    this.emitProductTable.next(tableData);
  }

  manageResponse(type, response){
    if(type==='product'){
      this.productmaster = response;
      this.initBaseData();

    }else if(type === 'productit'){
      this.productit = response;
      this.initProductItemData();

    }else if(type === 'productsn'){
      this.productsn = response;
      this.initProductSerialData();
    }
  }

  /*****************
    myProducts PAGE
  *****************/
  initMyProductsListener():Subject<boolean>{
    let initListener = new Subject<boolean>();
    this.initMyProductPage(initListener);

    return initListener;
  }

  private initMyProductPage(listener:Subject<boolean>){
    this.pageUser = this.userService.currentUser;
    this.userService.getPerson().then(token => {
      this.pagePerson = token;
      listener.next(true);

    });
  }

  get actualOwner():Person {
    return this.pagePerson;
  }



  /*****************
    productSn PRODUCT-IDENTIFIED by SERIAL NUMBER
  *****************/
  findSerialsByQuery<T>(type:string, query: any){
    this.daoService.search<Productsn>(type, query).subscribe(list => {
      this.productsnList = list;
      this.updateSerialTableData();
    })
  }

  updateSerialTableData(){
    let tableData = productModel.buildSerialTable(this.productsnList);
    this.emitProductsnTable.next(tableData);
  }


  get productSerialListener():Subject<Productsn>{
    return this.emitProductSerial;
  }

  get serialsByOwner():Subject<Productsn[]>{
    return this.emitSerialsByOwner;
  }


  fetchSerialsByOwner(){
    if(!this.pagePerson){
      return;

    }
    let query = {
      actualOwnerId: this.pagePerson._id
    }

    this.daoService.search<Productsn>('productsn', query ).subscribe(list => {
      this.productsnList = list;
      this.emitSerialsByOwner.next(list);
      this.updateSerialTableData();
    })

  }


  initProductSerialEdit(model: Productsn, modelId: string){
    if(model){
      this.productsn = model;
      this.initProductSerialData();
    }else if(modelId){
      this.findById<Productsn>('productsn', modelId);
    }else{
      this.initNewProductSerial();
    }
  }

  initNewProductSerial(){
    this.productsn = productModel.initNewProductSerial('instancia de producto identificado');
    this.initProductSerialData();
  }

  initProductSerialData(){
    this.productsnId = this.productsn._id
    this.emitProductSerial.next(this.productsn);
    this.changePageTitle('Instancias identificadas de Producto');

  }

  // ****** Search ******************
  searchProductSerialBySlug(slug): Observable<Productsn[]>{
    return this.daoService.search<Productsn>('productsn', {slug: slug});
  }



  // ****** SAVE ******************
  saveSerialToken(token:string, parentProduct:Product, event:ProductEvent){
    this.productsn = productModel.buildNewProductSerial(token, parentProduct, event);

    this.daoService.create<Productsn>('productsn', this.productsn).then( (model) =>{
              return model;
            });

  }




  saveSerialList(serialList:Array<string>, parentProduct:Product, event: ProductEvent){
    serialList.forEach(token => {
      this.saveSerialToken(token, parentProduct, event);
    })

  }

  saveProductSerialRecord(){
    this.productsn = initProductSerialForSave(this.productsn, this.userService.currentUser);

    if(this.productsnId){
      return this.daoService.update<Productsn>('productsn', this.productsnId, this.productsn).then((model) =>{
              this.openSnackBar('Actualización exitosa id: ' + model._id, 'cerrar');
              return model;
            });


    }else{
      return this.daoService.create<Productsn>('productsn', this.productsn).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });

    }
  }

  updateProductSerialRecord(token: Productsn){
    this.productsn = token;
    this.productsnId = token._id;
    return this.saveProductSerialRecord();

  }

  cloneProductSerialRecord(){
      this.productsn = initProductSerialForSave(this.productsn, this.userService.currentUser);
      return this.daoService.create<Productsn>('productsn', this.productsn).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });
  }

  /*******************************
    productKit ProductKit KIT kit
  *******************************/
  manageKits(token: UpdateProductEvent){
    const listener$ = new Subject<KitProduct>();
    if(token.action === UPDATE){
      this.updateKit(listener$, token.token);
    }else {
      this.createKit(listener$, token.token);
    }

    return listener$;

  }

  updateKit(listener$: Subject<KitProduct>, model: KitProduct){
    this.daoService.update<KitProduct>('productkit', model._id, model).then((model) =>{
      this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
      listener$.next(model);
    });
  }

  createKit(listener$: Subject<KitProduct>, model: KitProduct){
    this.daoService.create<KitProduct>('productkit', model).then((model) =>{
      this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
      listener$.next(model);
    });
  }

  deleteKit(id: string){
    this.daoService.delete('productkit', id).then(() =>{
      this.openSnackBar('Se ha eliminado el KIT id: ' + id, 'cerrar');

    })
  }


  /**
    Load ProductKit List
  **/

  fetchKits(type:string, query: any){
    this.daoService.search<KitProduct>(type, query).subscribe(list => {
      this.productkitList = list;
      this.updateKitTableData();
    })
  }

  updateKitTableData(){
    let tableData = KitProductModel.buildKitTable(this.productkitList);
    this.emitProductkitTable.next(tableData);

  }




  /*****************
    Table ProductKIT 
  *****************/
  get productkitDataSource(): BehaviorSubject<KitProductTableData[]>{
    return this.emitProductkitTable;
  }

  get selectionkitModel(): SelectionModel<KitProductTableData>{
    return this._selectionkitModel;
  }

  set selectionkitModel(selection: SelectionModel<KitProductTableData>){
    this._selectionkitModel = selection;
  }

  updateProductKitListItem(item ):void{
    let pr: KitProduct = this.productkitList.find((product:any) => product._id === item._id);
    if(pr){
      pr.slug = item.slug;
    }
  }

  addKitProductToList(){
  }

  fetchSelectedProductKitList():KitProduct[]{
    let list = this.filterSelectedProductKitList();
    return list;
  }

  filterSelectedProductKitList():KitProduct[]{
    let list: KitProduct[];
    let selected = this.selectionkitModel.selected as any;

    list = this.productkitList.filter((product: any) =>{
      let valid = selected.find(model => {
        return (model._id === product._id)
      });
      return valid;
    });
    return list;
  }



  /*****************
    productItem PRODUCT-ITEM
  *****************/
  get productItemListener():Subject<Productit>{
    return this.emitProductItem;
  }

  initProductItEdit(model: Productit, modelId: string){
    if(model){
      this.productit = model;
      this.initProductItemData();
    }else if(modelId){
      this.findById<Productit>('productit', modelId);
    }else{
      this.initNewProductItem();
    }
  }

  initNewProductItem(){
    this.productit = productModel.initNewProductItem('nuevo item producto');
    this.initProductItemData();
  }

  initProductItemData(){
    this.productitId = this.productit._id
    this.emitProductItem.next(this.productit);
    this.changePageTitle('items de producto')

  }

  // ****** Search ******************
  searchProductItemBySlug(slug): Observable<Productit[]>{
    return this.daoService.search<Productit>('productit', {slug: slug});
  }

  // ****** SAVE ******************
  saveItemRecord(){
    this.productit = initItemForSave(this.productit, this.userService.currentUser);

    if(this.productitId){
      return this.daoService.update<Productit>('productit', this.productitId, this.productit).then((model) =>{
              this.openSnackBar('Actualización exitosa id: ' + model._id, 'cerrar');
              return model;
            });


    }else{
      return this.daoService.create<Productit>('productit', this.productit).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });

    }
  }

  updateItemRecord(token: Productit){
    this.productit = token;
    this.productitId = token._id;
    this.saveItemRecord();

  }

  cloneItemRecord(){
      this.productit = initItemForSave(this.productit, this.userService.currentUser);
      return this.daoService.create<Productit>('productit', this.productit).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });
  }

  /*****************
    product PRODUCT
  *****************/
  getModelListener():Subject<Product>{
    return this.emitProductMaster;
  }

  getBasicData():ProductBaseData {
    return this.basicData;
  }

  initProductEdit(model: Product, modelId: string){
    if(model){
      this.productmaster = model;
      this.initBaseData();
    }else if(modelId){
      this.findById<Product>('product', modelId);
    }else{
      this.initNewModel()

    }
  }

  initNewModel(){
    this.productmaster = productModel.initNew('','',null,null);
    this.initBaseData();

  }

  initBaseData(){
    this.productmasterId = this.productmaster._id
    this.basicData = {
      code: this.productmaster.code,
      name: this.productmaster.name, 
      slug: this.productmaster.slug,
      
      pclass: this.productmaster.pclass,
      ptype:  this.productmaster.ptype, 
      pbrand: this.productmaster.pbrand, 
      pmodel: this.productmaster.pmodel, 

      pinventory: this.productmaster.pinventory,
      pume:       this.productmaster.pume,
      pformula:   this.productmaster.pformula,

      description: this.productmaster.description, 
      taglist:     this.productmaster.taglist
    }
    this.emitProductMaster.next(this.productmaster);
  }

  // ****** Search ******************
  searchBySlug(slug): Observable<Product[]>{
    if(!(slug && slug.trim())){
      return of([] as Product[]);
    }
    return this.daoService.search<Product>('product', {slug: slug})
  }

  // ****** SAVE ******************
  saveRecord(){
    this.productmaster = initForSave(this.basicData, this.productmaster, this.userService.currentUser);
    if(this.productmasterId){
      return this.daoService.update<Product>('product', this.productmasterId, this.productmaster).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });


    }else{
      return this.daoService.create<Product>('product', this.productmaster).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });

    }
  }


  /*****************
    Utils
  *****************/
  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,

    });

    snck.onAction().subscribe((e)=> {

    })
  }

  setTags(tags:Tag[]){
    this.tags = tags;
  }

  changePageTitle(title){
    setTimeout(()=>{
      this.sharedSrv.emitChange(title);
    },1000)
  }

  /*****************
    Table ProductIt Common
  *****************/
  buildCommonData(list: Productit[]): Productit{
    if(list.length === 1) return list[0];

    let memo: Productit = Object.assign({}, list[0]);
    let keys = Object.keys(memo);

    memo = list.reduce((memo, item) =>{
      keys.forEach(key => {
        if( memo[key] !== item[key]) {
          if(typeof memo[key] == "number" ) memo[key] = 0;
          else if( memo[key] instanceof Array) memo[key] = [];
          else if(memo[key] instanceof Object) memo[key] = {};
          else memo[key] = "";
        }

      })

      // memo.code = memo.code === item.code ? memo.code : "";
      // memo.slug = memo.slug === item.slug ? memo.slug : "";
      // memo.ptype = memo.ptype === item.ptype ? memo.ptype : "";
      // memo.pbrand = memo.pbrand === item.pbrand ? memo.pbrand : "";
      // memo.pmodel = memo.pmodel === item.pmodel ? memo.pmodel : "";
      // memo.vendorId = memo.vendorId === item.vendorId ? memo.vendorId : "";
      // memo.productId = memo.productId === item.productId ? memo.productId : "";
      // memo.pume = memo.pume === item.pume ? memo.pume : "";
      // memo.fume = memo.fume === item.fume ? memo.fume : "";
      // memo.moneda = memo.moneda === item.moneda ? memo.moneda : "";
      // memo.vendorpl = memo.vendorpl === item.vendorpl ? memo.vendorpl : "";
      // memo.vendorurl = memo.vendorurl === item.vendorurl ? memo.vendorurl : "";
      // memo.pu = memo.pu === item.pu ? memo.pu : 0;
      return memo;
    }, memo);
    return memo;
  }

  actualNewData(edited: Productit){
    let base = {};
    Object.keys(edited).forEach(key =>{
      if(edited[key]) base[key] = edited[key];
    })
    return base;
  }

  updateCommonData(actual: Productit, edited){
    Object.assign(actual, edited);
    return actual;
  }


  /*****************
    Table ProductSerialCommon
  *****************/

  buildCommonSerialData(list: Productsn[]): Productsn{
    if(list.length === 1) return list[0];

    let memo: Productsn = Object.assign({}, list[0]);
    let keys = Object.keys(memo);

    memo = list.reduce((memo, item) =>{
      keys.forEach(key => {
        if( memo[key] !== item[key]) {
          if(typeof memo[key] == "number" ) memo[key] = 0;
          else if( memo[key] instanceof Array) memo[key] = [];
          else if(memo[key] instanceof Object) memo[key] = {};
          else memo[key] = "";
        }

      })
      return memo;
    }, memo);
    return memo;
  }


  actualProductSerialNewData(edited: Productsn){
    let base = {};
    Object.keys(edited).forEach(key =>{
      if(edited[key]) base[key] = edited[key];
    })
    return base;
  }

  updateProductSerialCommonData(actual: Productsn, edited){
    Object.assign(actual, edited);
    return actual;
  }


  /*****************
    Table Product common
  *****************/
  get tableActions(){
    return this._tableActions;
  }


  /*****************
    Table ProductItem
  *****************/
  get productsDataSource(): BehaviorSubject<ProductitTable[]>{
    return this.emitProductTable;
  }

  get selectionModel(): SelectionModel<ProductitTable>{
    return this._selectionModel;
  }

  set selectionModel(selection: SelectionModel<ProductitTable>){
    this._selectionModel = selection;
  }
  
  updateProductListItem(item ):void{
    let pr: Productit = this.productitList.find((product:any) => product._id === item._id);
    if(pr){
      pr.pu = item.pu;
      pr.slug = item.slug;
    }
  }

  addProductitToList(){
    // let token = graphUtilities.cardGraphFromProduct('product', this.productList, this.milestone);
    // token.predicate = this.predicate;
    // this.productList.unshift(token);
    // return token;
  }

  fetchSelectedList():Productit[]{
    let list = this.filterSelectedList();
    return list;
  }

  filterSelectedList():Productit[]{
    let list: Productit[];
    let selected = this.selectionModel.selected as any;

    list = this.productitList.filter((product: any) =>{
      let valid = selected.find(model => {
        return (model._id === product._id)
      });
      return valid;
    });
    return list;
  }


  /*****************
    Table ProductSn (serial number identified products)
  *****************/
  get productsnDataSource(): BehaviorSubject<ProductsnTable[]>{
    return this.emitProductsnTable;
  }

  get selectionsnModel(): SelectionModel<ProductsnTable>{
    return this._selectionsnModel;
  }

  set selectionsnModel(selection: SelectionModel<ProductsnTable>){
    this._selectionsnModel = selection;
  }

  updateProductSerialListItem(item ):void{
    let pr: Productsn = this.productsnList.find((product:any) => product._id === item._id);
    if(pr){
      pr.slug = item.slug;
    }
  }

  addProductsnToList(){
  }

  fetchSelectedProductSerialList():Productsn[]{
    let list = this.filterSelectedProductSerialList();
    return list;
  }

  filterSelectedProductSerialList():Productsn[]{
    let list: Productsn[];
    let selected = this.selectionsnModel.selected as any;

    list = this.productsnList.filter((product: any) =>{
      let valid = selected.find(model => {
        return (model._id === product._id)
      });
      return valid;
    });
    return list;
  }


}
