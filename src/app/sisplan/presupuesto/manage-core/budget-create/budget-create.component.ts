import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { devutils }from '../../../../develar-commons/utils'

import { SisplanController } from '../../../sisplan.controller';
import { SisplanService, BudgetCostService, BudgetService }     from '../../../sisplan.service';

import { Pcultural, PculturalHelper } from '../../../pcultural/pcultural.model';
import { Budget, BudgetCost, BudgetHelper       } from '../../presupuesto.model';



const TOKEN_TYPE = 'budget';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';


@Component({
  selector: 'budget-create',
  templateUrl: './budget-create.component.html',
  styleUrls: ['./budget-create.component.scss']
})
export class BudgetCreateComponent implements OnInit {

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
  public umeOptList =       SisplanService.getOptionlist('qume');
  public currencyOptList =  SisplanService.getOptionlist('currency');
  public exchangeMap =      SisplanService.getOptionlist('exchange');
  
	public form: FormGroup;

  private formAction = "";

  private budget: Budget = new Budget();
  private budgetService: BudgetCostService;

  public budgetCost: BudgetCost;



  constructor(
  	private fb:     FormBuilder,
    private dsCtrl: SisplanController,
    private route:  ActivatedRoute,
    private router: Router,
  	) { 
      this.form = this.buildForm();
	}



  ngOnInit() {
  	this.initForEdit(this.form, this.budget);

  }

  onSubmit(){
  	this.initForSave(this.form, this.budget);
  	this.formAction = UPDATE;
  	this.emitEvent(this.formAction);
  }

  onCancel(){
  	this.formAction = CANCEL;
  	this.emitEvent(this.formAction);
  }

  deleteToken(){
    this.formAction = DELETE;
    this.emitEvent(this.formAction);

  }

  emitEvent(action:string){
    
    if(this.formAction === UPDATE){
      this.dsCtrl.manageBudgetRecord(this.budget).subscribe(token => {
        this.budget = token;
        this.navigateTo();
      })
    }


  }

  navigateTo(){
    this.router.navigate(['../', this.budget._id], {relativeTo: this.route});

  }


  changeSelectionValue(type, val){
    if(type === 'type'){
      this.changeStypeOptList(val);
    }

    if(type === 'sede'){
      this.changeLocacionOptList(val);
    }

    if(type === 'currency'){
      this.changeBudgetCurrency(val);
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

    this.budgetCost = this.budgetService.calculateARSCost(val);


  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
      slug:         [null, Validators.compose([Validators.required]) ],
      description:  [null],

      programa:     [null, Validators.compose([Validators.required]) ],
      type:         [null, Validators.compose([Validators.required]) ],
      stype:        [null, Validators.compose([Validators.required]) ],

      sector:       [null, Validators.compose([Validators.required]) ],
      sede:         [null],
      locacion:     [null],

      currency:     [null, Validators.compose([Validators.required]) ],
      e_cost:       [null, Validators.compose([Validators.required]) ],


      fe_req:       [null, Validators.compose([Validators.required]) ],

    });

    return form;
  }

  initForEdit(form: FormGroup, budget: Budget): FormGroup {
    this.changeStypeOptList(budget.type);
    this.changeLocacionOptList(budget.sede);

    this.budgetService = new BudgetCostService(budget, this.exchangeMap);

    this.budgetCost = this.budgetService.budgetCost;

		form.reset({
      slug:        budget.slug,
      description: budget.description,

      programa:    budget.programa,
      type:        budget.type,
      stype:       budget.stype,

      sector:      budget.sector,
      sede:        budget.sede,
      locacion:    budget.locacion,

      currency:     this.budgetCost.e_currency,
      e_cost:       this.budgetCost.e_cost,
      e_ARSCost:    this.budgetCost.e_ARSCost,
      e_changeRate: this.budgetCost.e_changeRate,

      fe_req:       budget.fe_req,



		});



    // this.actionOptList = this.sectorActionRelation[budget.sector] || [];
    // this.buildNovedades(budget.novedades)

		return form;
  }

 
	initForSave(form: FormGroup, budget: Budget): Budget {
		const fvalue = form.value;
		const entity = budget;

    entity.slug =  fvalue.slug;
    entity.description =  fvalue.description;

    entity.programa =  fvalue.programa;
    entity.type =      fvalue.type;
    entity.stype =     fvalue.stype;

    entity.sector =    fvalue.sector;

    entity.sede =      fvalue.sede;
    entity.locacion =  fvalue.locacion;


    entity.currency =  fvalue.currency;
    
    entity.e_currency =   fvalue.currency;
    entity.e_cost =       fvalue.e_cost;

    entity.fe_req =       fvalue.fe_req;

    this.budgetService.budget = entity
    this.budgetCost = this.budgetService.calculateARSCost(entity.currency);

    

    entity.e_ARSCost =    this.budgetCost.e_ARSCost;
    entity.e_changeRate = this.budgetCost.e_changeRate;
    entity.e_feRate =     this.budgetCost.e_feRate;



		return entity;
	}


}
