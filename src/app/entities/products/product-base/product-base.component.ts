import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Product, ProductBaseData, productModel }    from '../product.model';
import { ProductController }    from '../product.controller';


import { Observable ,  Subject}        from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap }   from 'rxjs/operators';


function fetchData(form: FormGroup, model: ProductBaseData): ProductBaseData {
	const fvalue = form.value;
  model.code   = fvalue.code;
  model.name   = fvalue.name;
  model.slug   = fvalue.slug;
  model.pclass  = fvalue.pclass;
  model.ptype   = fvalue.ptype;
  model.pbrand  = fvalue.pbrand;
  model.pmodel  = fvalue.pmodel;
  model.pinventory = fvalue.pinventory;
  model.pume = fvalue.pume;
  model.pformula = fvalue.pformula;
  model.description = fvalue.description;
	return model;
};

@Component({
  selector: 'product-base',
  templateUrl: './product-base.component.html',
  styleUrls: ['./product-base.component.scss']
})
export class ProductBaseComponent implements OnInit {
	@Input()
		get productBase(){
			return this.pbmodel;
		}
		set productBase(productBaseModel){
			this.pbmodel = productBaseModel;
      this.tags = productBaseModel.taglist;
		}
  @Input() entityId;
  @Input() entityName;
  @Input() editable: boolean = true;
  @Output() updateProduct: EventEmitter<Product> = new EventEmitter<Product>();

	pageTitle: string = 'Datos básicos producto';

	public form: FormGroup;
  public openEditor = false;

  public meContent: string = '';
  public mePlaceholder: string = 'Descripción';

  private status = false;
  private pbmodel: ProductBaseData;
  private modelId: string;
  private tags = [];
  private pclasssList = [];
  private ptypeList = [];
  private pinventoryList = [];
  private pumeList = [];
  private pformulaList = [];
  public slugFld = "";
  private searchTerms = new Subject<string>();
  public products: Observable<Product[]>;
  private modelListener: Subject<Product>;
  private productEntity: Product ;


  @HostListener('mouseleave') onMouseLeave() {
      this.promoteData();
  }

  @HostListener('blur') onBlur() {
      this.promoteData();
  }

  constructor(
  	private fb: FormBuilder,
    private productCtrl: ProductController
  	) { 
    this.form = this.fb.group({
      code:        [null,  Validators.compose([Validators.required])],
      name:        [null,  Validators.compose([Validators.required])],
      slug:        [null,  Validators.compose([Validators.required])],
      pclass:      [null,  Validators.compose([Validators.required])],
      ptype:       [null],
      pbrand:      [null],
      pmodel:      [null],
      pinventory:  [null],
      pume:        [null],
      pformula:    [null],
      description: [null],
    });
  }

  ngOnInit() {
    this.pclasssList    = productModel.getProductClassList();
    this.ptypeList      = productModel.getProductTypeList(this.pclasssList[0]);
    this.pumeList       = productModel.getProductUmeList();
    this.pformulaList   = productModel.getProductFormulaList();
    this.pinventoryList = productModel.getProductInventoryList();

    this.modelListener = this.productCtrl.getModelListener();

    this.modelListener.subscribe(model =>{
      this.productEntity = model;
      this.modelId = model._id;
      this.pbmodel = this.productCtrl.getBasicData();
      this.initDataToEdit();
    })

    if(this.pbmodel){
      this.initDataToEdit();
    }else{
      this.productCtrl.initProductEdit(this.productEntity, this.entityId);
      //this.pbmodel = productModel.initNew('producto/objetivo',null,null,null);
    }

    this.products = this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(t => t && t.length >2 && !(/[^a-z0-9,ñ\s]+/ig.test(t))),
        switchMap(term => this.productCtrl.searchBySlug(term))
      );
  }

  initDataToEdit(){
    this.slugFld = this.entityName || this.pbmodel.slug;
    if(this.pbmodel.pclass){
      this.ptypeList = productModel.getProductTypeList(this.pbmodel.pclass);    
    }
    this.updateProduct.emit(this.productEntity);
    this.formReset(this.pbmodel);
  }

  formReset(model){
    this.form.reset({
      name:     model.name,
      code:     model.code,
      slug:     model.slug,
      ptype:    model.ptype,
      pclass:   model.pclass,
      pbrand:   model.pbrand,
      pmodel:   model.pmodel,
      pume:     model.pume,
      pformula: model.pformula,
      description:  model.description,
      pinventory:   model.pinventory
    })
  }

  /*********  SAVE & ?? **********/
  save(target:string){
    this.promoteData();
    this.productCtrl.saveRecord().then(model =>{
      this.continueEditing(model);
    })
  }

  continueEditing(model){
    this.productCtrl.initProductEdit(model, model._id);
  }
  


  // ****** PROMOTE ******************
  promoteData(){
    this.pbmodel = fetchData(this.form, this.pbmodel);
  }
  // ******  END PROMOTE ******************


  search(term){
    this.searchTerms.next(term)
  }

  selectEntity(product){
    if(product){
      this.productCtrl.initProductEdit(product, product._id);

      this.pbmodel = product;
      this.formReset(this.pbmodel);
      this.slugFld = this.pbmodel.slug;
      this.updateProduct.emit(product);
    }
  }

  addTags(tags){
    this.pbmodel.taglist = tags;
    this.tags = tags;
  }

  editToken(){
    if(this.openEditor){
      this.promoteData();
    }
    this.openEditor = !this.openEditor;
  }

  descriptionUpdateContent(content){
  }

  changeProductInventory(val){
  }

  changeProductUme(val){
  }

  changeProductFormula(val){
  }

  changeProductClass(val){
    this.ptypeList = productModel.getProductTypeList(val);
  }

  changeProductType(val){
  }


}
