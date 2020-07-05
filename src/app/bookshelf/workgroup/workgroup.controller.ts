import { Injectable }    from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';

//import { Observable }    from 'rxjs/Observable';
import { BehaviorSubject ,  Subject ,  Observable }       from 'rxjs';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { RecordCard, cardHelper, SelectData }    from '../recordcard';

import { DaoService }    from '../../develar-commons/dao.service';
import { UserService }   from '../../entities/user/user.service';
import { User }          from '../../entities/user/user';
import { SharedService } from '../../develar-commons/shared-service';
import { CardGraph, CardGraphProduct, ProductTable, graphUtilities }  from '../cardgraph.helper';
import { GenericDialogComponent } from '../../develar-commons/generic-dialog/generic-dialog.component';

const removeRelation = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Baja de relación',
    title: 'Confirme la acción',
    body: 'Se dará de baja la relación seleccionada en esta entidad',
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

const navOptions: Array<any> = [
    {val: 'view',        label: 'Vista',       slug:'Vista' },   
    {val: 'products',   label: 'Productos',   slug:'Productos' }, 
    {val: 'references',  label: 'Referencias', slug:'Referencias' },
];

const defaultNavigation = 'view';


function initForSave(model: RecordCard, user: User): RecordCard {
  console.log('initForSave: [%s] [%s] [%s]', user.displayName, user._id, model.slug)
  return model;
};

function initProductsForSave(model: RecordCard, productList: CardGraphProduct[], milestone: string, user: User): RecordCard {
  console.log('initProductsForSave: [%s] [%s] [%s]', user.displayName, user._id, model.slug)
  model.products = productList;
  return model;
};


@Injectable()
export class WorkGroupController {

  private model: RecordCard;
  private modelId;
  private emitModel = new Subject<RecordCard>();

  private emitMilestone = new Subject<string>();
  private currentMilestone: string;
  private personList: CardGraph[];

  private productList: CardGraphProduct[];

  private _predicate: string = 'no_definido';
  private _dirty: boolean = false;

  private _selectionModel: SelectionModel<ProductTable>
  private emitProductTable = new BehaviorSubject<ProductTable[]>([]);
  private workingView:string  = defaultNavigation;
  private _productview:  string ;
  private _tableActions: Array<any> = graphUtilities.getTableActionOptions();
  private _milestoneList: Array<SelectData>;

  constructor(
    private daoService: DaoService,
    public snackBar:    MatSnackBar,
    public userService: UserService,
    public dialogService: MatDialog,
    public sharedSrv:   SharedService ) { 

  }

  private handleError(error: any): Promise<any> {
    console.error('[%s]: Ocurrió un error: [%s]',whoami, error);
    return Promise.reject(error.message || error);
  }

  initRecordCardEdit(model: RecordCard, modelId: string){
    if(model){
      this.model = model;
      this.initBaseData();

    }else if(modelId){
      this.findById('recordcard', modelId);

    }else{
      this.initNewModel()
    }
  }

  initNewModel(){
    //this.model = recordcardModel.initNew('','',null,null);
    this.initBaseData();
  }

  initBaseData(){
    if(!this.modelId || (this.modelId !== this.model._id)){
      this.modelId = this.model._id;
      this.milestone = this.model._id;

    }else{
      this.milestone = this.milestone || this.model._id;

    }

    this.sharedSrv.emitChange(this.model.slug);
    
    this.loadRelatedPersons(this.model.persons);
    this.loadRelatedProducts(this.model.products);

    this._milestoneList = graphUtilities.buildMilestonesList(this.model);

    this.emitModel.next(this.model);
  }

  renderTableProduct(list){
    let tableData = graphUtilities.buildProductTable(list, this.milestoneList);
    this.emitProductTable.next(tableData);
  }

  renderTableGroupByePredicate(list, type: string){
    let tableData = graphUtilities.buildProductTableGroupByPredicate(list, type, this.milestoneList);
    this.emitProductTable.next(tableData);
  }


  // ****** SAVE ******************
  saveRecord(){
    this.model = initForSave(this.model, this.userService.currentUser);

    if(this.modelId){
      return this.daoService.update<RecordCard>('recordcard', this.modelId, this.model).then((model) =>{
              console.log('update OK, opening snakbar[%s] [%s]', this.model.slug, model.slug)
              //this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });

    }else{
      return this.daoService.create<RecordCard>('recordcard', this.model).then((model) =>{
              console.log('create OK, opening snakbar')
              //this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });
    }
  }

  // ****** SAVE ******************
  saveProducts(){
    this.dirty = false;

    let token = this.productList[0];
    this.model = initProductsForSave(this.model,this.productList, this.milestone, this.userService.currentUser);
    return this.daoService.update<RecordCard>('recordcard', this.modelId, this.model).then((model) =>{
        //this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
        return model;
      });
  }

  findById(type:string, modelId: string):Promise<RecordCard>{
    return this.daoService.findById<RecordCard>('recordcard', modelId)
      .then((response: RecordCard) => {
        if(response){
          this.model = response;
          this.initBaseData();
        }
        return response

      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }

  set dirty(pred){
    this._dirty = pred;
  }
  get dirty(){
    return this._dirty;
  }

  set predicate(pred){
    this._predicate = pred;
  }
  get predicate(){
    return this._predicate;
  }
  get navoptions(){
    return navOptions
  }
  
  get productview(){
    return this._productview;
  }
  set productview(view){
    this._productview = view;
  }

  set milestone(val){
    this.currentMilestone = val;
    this.emitMilestone.next(val);
  }
  get milestone(){
    return this.currentMilestone;
  }

  get milestoneList(): Array<SelectData>{
    return this._milestoneList;
  }

  milestoneLabel(id:string): string{
    return graphUtilities.getMilestoneLabel(this.milestoneList, id)
  }

  get currentView(){
    return this.workingView
  }
  set currentView(view){
    this.workingView = view;
  }

  get modelListener():Subject<RecordCard>{
    return this.emitModel;
  }

  get milestoneListener():Subject<string>{
    return this.emitMilestone;
  }

  get actualModel():RecordCard{
    return this.model;
  }

  get actualModelId(){
    return this.modelId;
  }
  
  get productsDataSource(): BehaviorSubject<ProductTable[]>{
    return this.emitProductTable;
  }

  get selectionModel(): SelectionModel<ProductTable>{
    return this._selectionModel;
  }

  set selectionModel(selection: SelectionModel<ProductTable>){
    this._selectionModel = selection;
  }

  getPersonList():CardGraph[]{
    return this.personList;
  }
  
  get tableActions(){
    return this._tableActions;
  }

  doSelectedAction(action){
  }

  filterProductList():CardGraphProduct[]{
    let list: CardGraphProduct[];
    list = this.productList.filter((product: CardGraphProduct) =>{
      let valid = true;
      // modo de no filtrar nada...
      if(this.predicate === 'no_definido') return true;

      if(this.milestone!=='no_definido' && product.milestoneId && (product.milestoneId !== this.milestone)) valid = false;
      if(product.predicate !== this.predicate) valid = false;
      return valid;
    });

    return list;
  }

  filterSelectedList():CardGraphProduct[]{
    let list: CardGraphProduct[];
    let selected = this.selectionModel.selected as any;

    list = this.productList.filter((product: any) =>{
      let valid = selected.find(model => {
        return (model._id === product._id)
      });
      return valid;
    });
    return list;
  }

  updateProductListItem(item ):void{
    let pr: CardGraphProduct = this.productList.find((product:any) => product._id === item._id);
    this.dirty = true;
    if(pr){
      pr.qt = item.qt;
      pr.pu = item.pu;
      pr.slug = item.slug;
    }
  }

  getPredicateLabel(entity, key){
    return graphUtilities.getPredicateLabel(entity, key);
  }

  getProductList():CardGraphProduct[]{
    let list = this.filterProductList();

    // Render table in detail mode or groupBy mode
    if(this.productview === 'detallada'){
      this.renderTableProduct(list);
    }else{
      this.renderTableGroupByePredicate(list, this.productview);
    }
    return list;
  }

  fetchSelectedList():CardGraphProduct[]{
    let list = this.filterSelectedList();
    return list;
  }

  loadRelatedPersons(persons: CardGraph[]) {
    if(!persons.length){
      this.personList = [];

    }else{      
      this.personList = graphUtilities.buildGraphList('person',persons);
    }
  }

  addProductToList(){
    let token = graphUtilities.cardGraphFromProduct('product', this.productList, this.milestone);
    token.predicate = this.predicate;
    this.productList.unshift(token);
    return token;
  }

  deleteProductFromList(token: CardGraphProduct): Promise<boolean>{
    return new Promise((resolve, reject) => {
      let index = this.flushProductFromList(false, token, this.productList);
      if(index !== -1){
        this.openDialog(removeRelation).subscribe(result => {

          if(result==='accept') {
            this.flushProductFromList(true, token, this.productList);
            resolve(true);

          }else{
            resolve(false);
          }
        })
      }      
    })

  }

  flushProductFromList(flush: boolean, token: CardGraphProduct, list:CardGraphProduct[]): number{
    let index = list.findIndex(x => x === token);
    
    if(index !== -1 && flush){
      list.splice(index, 1);
    }
    return index;
  }


  loadRelatedProducts(products: CardGraph[]) {
    if(!products.length){
      this.productList = [];

    }else{      
      this.productList = graphUtilities.buildGraphList<CardGraphProduct>('product', products);
    }
  }

  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 1000,

    });

    snck.onAction().subscribe((e)=> {
      //console.log('action???? [%s]', e);
    })
  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }


}
