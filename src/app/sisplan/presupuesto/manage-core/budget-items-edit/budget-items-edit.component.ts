import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';

import { devutils }from '../../../../develar-commons/utils'

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, BudgetCostService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetItem, BudgetCost, BudgetHelper   } from '../../presupuesto.model';
import { Product, ProductBaseData, productModel }    from '../../../../entities/products/product.model';

const TOKEN_TYPE = 'budget_items';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';


@Component({
  selector: 'budget-items-edit',
  templateUrl: './budget-items-edit.component.html',
  styleUrls: ['./budget-items-edit.component.scss']
})
export class BudgetItemsEditComponent implements OnInit {
	@Input() token: BudgetItem;
	@Input() budget: Budget;
	@Output() updateToken = new EventEmitter<UpdateEvent>();

  public sectorOptList =    SisplanService.getOptionlist('sector');
  public formatoOptList =   SisplanService.getOptionlist('formato');
  public programaOptList =  SisplanService.getOptionlist('programa');
  public publicoOptList =   SisplanService.getOptionlist('publico');

  public typeOptList =      SisplanService.getOptionlist('type');
  public stypeOptList =     [];
  public stypeOptMap =      SisplanService.getSubTypeMap();

  public sedeOptList =      SisplanService.getOptionlist('sede');
  public locacionOptList =  [];
  public locacionOptMap =   SisplanService.getLocacionMap();

  public fumeOptList =      SisplanService.getOptionlist('fume');
  public qumeOptList =       SisplanService.getOptionlist('qume');
  public currencyOptList =  SisplanService.getOptionlist('currency');
  public exchangeMap =      SisplanService.getOptionlist('exchange');
  
  public  budgetCost: BudgetCost;
  private budgetCostService: BudgetCostService;

	public form: FormGroup;

	private product: Product;
	public  productText: string = "";

  private formAction = "";


  constructor(
  	private fb:      FormBuilder,
    private dsCtrl:  SisplanController,
  	) { 
      this.form = this.buildForm();
	}



  ngOnInit() {
  	this.initForEdit(this.form, this.token);

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

  onDelete(){
    this.formAction = DELETE;
    this.emitEvent(this.formAction);

  }

  emitEvent(action:string){
    console.log('todo');
    
    // if(this.formAction === UPDATE){
    //   this.dsCtrl.manageBudgetRecord(this.token).subscribe(token => {
    //     this.token = token;
    //     console.log('Exito: [%s]', token.slug)
    //     this.navigateTo();
    //   })
    // }

    let event = {
      action:  action,
      token:   TOKEN_TYPE,
      payload: this.token
    } as UpdateEvent;

    this.updateToken.next(event)
  }


  changeSelectionValue(type, val){
    if(type === 'type'){
      this.changeStypeOptList(val);
    }

    if(type === 'currency'){
      this.changeBudgetCurrency(val);
    }


    if(type === 'sede'){
      this.changeLocacionOptList(val);
    }

  }

  private changeStypeOptList(parent: string){
      this.stypeOptList = this.stypeOptMap[parent] || [];

      if(this.stypeOptList.length === 1){
        this.form.get('stype').setValue(this.stypeOptList[0].val);

      }

  }

  private changeLocacionOptList(parent: string){
      this.locacionOptList = this.locacionOptMap[parent] || [];

      if(this.locacionOptList.length === 1){
        this.form.get('locacion').setValue(this.locacionOptList[0].val);

      }

  }

  private changeBudgetCurrency(val){

    this.budgetCost = this.budgetCostService.calculateARSCost(val);
    console.dir(this.budgetCost);


  }


  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      slug:     [null],
      currency: [null],
      fume:     [null],
      qume:     [null],
      freq:     [null],
      qty:      [null],
      importe:  [null],

    });

    return form;
  }

  initForEdit(form: FormGroup, item: BudgetItem): FormGroup {

    this.budgetCostService = new BudgetCostService(new Budget(), this.exchangeMap);

    if(item.productId){

    	this.dsCtrl.fetchProductById(item.productId).then(p =>{
    		if(p){
    			this.product = p;
  				this.productText = `Producto seleccionado: ${item.productSlug} (${item.productId})	`;

    			this.budgetCostService.item = item;

    		}else{
  				this.productText = `El producto seleccionado ${item.productSlug} es inexistente`;

    		}
    	})

    }else {
    	this.productText = 'No hay producto seleccionado';
    	
    }

		form.reset({

      slug:        item.slug,
      currency:    item.currency,
      fume:        item.fume,
      qume:        item.qume,
      freq:        item.freq,
      qty:         item.qty,
      importe:     item.importe,

		});

		return form;
  }

	initForSave(form: FormGroup,  item: BudgetItem): BudgetItem {
		const fvalue = form.value;
		const entity = item;

		entity.slug =         fvalue.slug;
		entity.currency =     fvalue.currency;
		entity.fume =         fvalue.fume;
		entity.qume =         fvalue.qume;
		entity.freq =         fvalue.freq;
		entity.qty =          fvalue.qty;
		entity.importe =      fvalue.importe;

		entity.productId = this.product._id;
		entity.productSlug = this.product.name;

		this.budgetCostService.evaluateItemCost(entity);

		return entity;
	}





/////////////////////////////////////////



  handleProduct(p: Product){
  	if(p){
  		this.product = p;
  		this.productText = `Producto seleccionado: ${p.name} (${p._id})	`;
  	}else {
  		this.productText = '';
  	}

  	console.log('handleProduct:[%s]', p.name)
    //this.insertProduct(p);
  }

}

