import { Component, OnInit,OnChanges, Input, EventEmitter, HostListener } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { DataSource, SelectionModel } from '@angular/cdk/collections';

import { WorkGroupController } from '../workgroup.controller';
import { RecordCardService }   from '../../bookshelf.service';
import { RecordCard, SubCard, SelectData, cardHelper } from '../../recordcard';
import { Subject } from 'rxjs';
import { CardGraphProduct, graphUtilities, ProductTable }      from '../../cardgraph.helper';


@Component({
  selector: 'project-product',
  templateUrl: './project-product.component.html',
  styleUrls: ['./project-product.component.scss']
})
export class ProjectProductComponent implements OnInit, OnChanges {
	@Input() customalign: string = 'center';
  @Input() title: string;

  @Input()
  set model(entity: RecordCard){
    entity.carrousel = cardHelper.buildCarrousel(entity.slug, entity, 0);
    this.currentModel = entity;
  }
  get model(){
    return this.currentModel;
  }

  @Input()
  set relatedcards(models: SubCard[]){
    this.initSubCardData(models);
    this.currentSubcardList = models;
  }
  get relatedcards(){
    return this.currentSubcardList;
  }

  private currentModel: RecordCard;
  private currentSubcardList;
  private entityType = 'product';

  private showView: boolean = true;
  private showAssets: boolean = false;
  private showReferences: boolean = false;
  private milestoneLabel: string ;

  private predicateSelected: string;
  private predicateList = [];

  private productViewSelected: string;
  private viewList = [];


  private productList: CardGraphProduct[];
  private productEditList: CardGraphProduct[] = [];

  private models: RecordCard[];
  private subcards: SubCard[];
  private milestoneScrptn;
  private modelScrptn;


  constructor(
  		private route: ActivatedRoute,
  		private workgroupCtrl: WorkGroupController,
      private router: Router
  	) {
  }

  ngOnDestroy(){
    console.log('PROJECT-PRODUCT: noOnDestroy')
    this.milestoneScrptn.unsubscribe()
    this.modelScrptn.unsubscribe()

  }

  ngOnChanges(){
    console.log('ngOnChanges;')
  }

  ngOnInit() {
    console.log('*************project-product ***************')
    let id = this.route.snapshot.paramMap.get('id')
    this.workgroupCtrl.currentView = 'products';
    this.predicateList = graphUtilities.getPredicateOptions(this.entityType)
    this.viewList = graphUtilities.getProductViewOptions(this.entityType)    

    this.milestoneScrptn = this.workgroupCtrl.milestoneListener.subscribe(milestone =>{
      this.milestoneLabel = cardHelper.getMilestoneSlug(this.model, milestone);
    });

    this.modelScrptn = this.workgroupCtrl.modelListener.subscribe(model =>{
      model.carrousel = cardHelper.buildCarrousel(model.slug, model, 0);
      this.initEditorData(model);
      this.model = model;
    })

    this.workgroupCtrl.initRecordCardEdit(this.model, id);
  }



  @HostListener('mouseleave') onMouseLeave() {
      this.editSave();
  }

  // @HostListener('blur') onBlur() {
  //     this.editSave();
  // }


  addProductTokenToList(){
    this.productEditList.unshift(this.workgroupCtrl.addProductToList());
    this.productList = this.workgroupCtrl.getProductList();
  }

  editTableSelectedProductList(){
    this.productEditList = this.workgroupCtrl.fetchSelectedList();
  }

  cleanSelectedProductList(){
    this.productEditList = this.workgroupCtrl.fetchSelectedList();    
  }

  eliminarPredicado(){
    let aborrar: CardGraphProduct[] = this.workgroupCtrl.fetchSelectedList();
    let self = this;
    aborrar.forEach(prod => {
      this.deleteToken(prod);
    })
  }

  deleteToken(token: CardGraphProduct){
    this.workgroupCtrl.deleteProductFromList(token).then(action => {
      if(action){
        this.productList = this.workgroupCtrl.getProductList();
      }
    })
  }

  clearToken(token: CardGraphProduct){
    console.log('clearToken')
    let index = this.productEditList.findIndex(x => x === token);

    if(index !== -1){
      this.productEditList.splice(index, 1);
    }
  }

  actionTriggered(action){
    console.log('project-product: actionTriggered:[%s]', action)
    if(action === 'editone')      this.editTableSelectedProductList();
    if(action === 'killpredicate') this.eliminarPredicado();
    if(action === 'limpiar') this.cleanSelectedProductList();
  }


  editSave(){
    if(this.workgroupCtrl.dirty){
      this.workgroupCtrl.saveProducts().then(model => {
        console.log('save [%s] [%s]', model.slug, model._id )
        this.continueEditing(model);
      })
    }
  }

  milestoneChange(milestone){
    console.log('milestone changed:......')
    this.productList = this.workgroupCtrl.getProductList();
  }

  goToBrowse(){
    this.router.navigate(['../../../'], { relativeTo:  this.route });
  }

  initEditorData(entity: RecordCard){
    this.milestoneLabel = cardHelper.getMilestoneSlug(entity, this.workgroupCtrl.milestone);
    this.predicateSelected = this.workgroupCtrl.predicate;

    console.log('*********************')
    console.log('productview: [%s] [%s] [%s] ',this.workgroupCtrl.productview , this.viewList[0].val, this.productViewSelected)

    this.workgroupCtrl.productview = this.workgroupCtrl.productview || this.viewList[0].val;
    this.productViewSelected = this.workgroupCtrl.productview;

    console.log('productview: [%s] [%s] [%s] ',this.workgroupCtrl.productview , this.viewList[0].val, this.productViewSelected)
    console.log('*********************')
    setTimeout(()=>{
      console.log('*********************')
      console.log('productview: [%s] [%s] [%s] ',this.workgroupCtrl.productview , this.viewList[0].val, this.productViewSelected)
      console.log('*********************')

    },2000);

    this.productList = this.workgroupCtrl.getProductList();
    this.currentSubcardList = cardHelper.buildRelatedCards(entity);

    entity.carrousel = cardHelper.buildCarrousel(entity.slug, entity, 0);
    this.initSubCardData(this.currentSubcardList );
  }

  initSubCardData(smodels: SubCard[]){
    smodels.forEach(card => {
      card.carrousel = cardHelper.buildCarrousel(card.slug, card, 0);
    });
  }

  changePredicate(val){
    this.workgroupCtrl.predicate = val;
    this.productList = this.workgroupCtrl.getProductList();
  }

  changeTableView(val){
    // ToDo: render table
    console.log('changeTableView: [%s]', val);
    this.workgroupCtrl.productview = val;
    this.productList = this.workgroupCtrl.getProductList();
  }

  /*********  NAVIGATION **********/
  navigationChange(target){
    console.log('navigation changed: [%s]', target);
    this.toggleView(target);
    if(target !== 'products'){
      console.log('***** navigateTo.....')
      this.navigateTo(target)
    }
  }

  navigateTo(target){
    if(target === 'products'){
      this.router.navigate(['../', 'objetivos'],{relativeTo: this.route});
    } else if(target === 'view'){
      this.router.navigate(['../'],{relativeTo: this.route});
    } else {
      this.router.navigate(['../'],{relativeTo: this.route});
    }
  }

  toggleView(view){
    this.showAssets = (view === 'products');
    this.showView = (view === 'view');
    this.showReferences = (view === 'references');
  }

  continueEditing(model){
    console.log('Continue editing: [%s] [%s]', model.slug, model._id);
  }

  editCancel(){
    this.navigateTo('view');
  }
}


/******
        <button *ngIf='predicatefld.value !== "no_definido"' mat-icon-button
            type="button" title="editar productos relacionados" color="accent" 
            (click)='editTableSelectedProductList()'>
            <mat-icon>mode_edit</mat-icon>
        </button>


  <div class="additional-info">
    <button mat-raised-button type="button" color="primary"
          (click)="editSave()" [disabled]="!true" >Guardar relación</button>

    <button mat-button type="button" color="accent" 
          (click)="editCancel()" >Cancelar</button>
  </div>


    background: rgba(#000,.1);



****/
