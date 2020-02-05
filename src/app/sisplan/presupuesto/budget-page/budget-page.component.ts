import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { SisplanController } from '../../sisplan.controller';

import { devutils }from '../../../develar-commons/utils'

import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../sisplan.service';

import { Budget, BudgetItem, PculturalItem, BudgetHelper } from '../presupuesto.model';
import { Pcultural      } from '../../pcultural/pcultural.model';

const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';


@Component({
  selector: 'budget-page',
  templateUrl: './budget-page.component.html',
  styleUrls: ['./budget-page.component.scss']
})
export class BudgetPageComponent implements OnInit {

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

  public title;

  private unBindList = [];

  //Pcultural
  public pculturalList: PculturalItem[];

  //Observaciones
  public audit: Audit;
  public parentEntity: ParentEntity;

  public hasCurrentBudget: boolean = false;
  public showSummary: boolean = false;
 
  private hasBudgetIdOnURL: boolean = false;
  private currentBudget: Budget;
  private budgetId: string;

  public budgetCostList: BudgetItem[] = [];


  constructor(
    private dsCtrl: SisplanController,
    private route:  ActivatedRoute,
 		private router: Router,
  	) { 

	}



  ngOnInit() {
  	this.title = 'Presupuesto'

    let first = true;    
    this.budgetId = this.route.snapshot.paramMap.get('id')
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    if(!this.budgetId){
      this.hasBudgetIdOnURL = false;
    }

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);

  }

  initCurrentPage(){

    if(!this.budgetId){
      if(this.dsCtrl.activeBudget){
        this.budgetId = this.dsCtrl.activeBudget._id;
        this.initCurrentBudget(this.dsCtrl.activeBudget);

      } else {
        this.navigateToAltaBudget()
      }

    } else {
      if(!this.dsCtrl.activeBudget || this.dsCtrl.activeBudget._id !== this.budgetId){
        this.loadBudget(this.budgetId);

      } else {
        this.initCurrentBudget(this.dsCtrl.activeBudget);

      }

    }
  }

  initCurrentBudget(budget: Budget){

    if(budget && this.currentBudget && budget._id === this.currentBudget._id){
      return;
    }

    if(budget){

      this.currentBudget = budget;
      this.budgetCostList = budget.items || [];
      this.pculturalList = budget.pculturals || [];

      this.audit = this.dsCtrl.getAuditData();
      this.parentEntity = {
        entityType: 'budget',
        entityId:   this.currentBudget._id,
        entitySlug: this.currentBudget.slug
      }

      if(this.pculturalList && this.pculturalList.length){
        //todo
      }

      this.showSummary = true;
			this.hasCurrentBudget = true;
    }
 
  }

  /**********************/
  /*      Budget        */
  /**********************/
  loadBudget(id){
    this.dsCtrl.setCurrentBudgetFromId(id).then(pcul => {
      if(pcul){

        this.initCurrentBudget(pcul);

      }
    });
  }


  /**********************/
  /*      Events        */
  /**********************/
  updateCore(event: UpdateEvent){
    if(event.action === UPDATE){
      this.dsCtrl.updatePartialBudget(event);
      this.enableSummary();
    }

  }


  updatePculturalList(event:UpdateListEvent){
    if(event.action === UPDATE){
      //this.upsertBudgetCostItemsList(event);
      this.enableSummary();
 
    }
  }

  updateCostItems(event:UpdateListEvent){
    if(event.action === UPDATE){
      this.upsertBudgetCostItemsList(event);
    }
  }

  private upsertBudgetCostItemsList(event:UpdateListEvent){
    this.showSummary = false;
    this.currentBudget.items = event.items as BudgetItem[];
    this.enableSummary();

    let update: UpdateEvent = {
      action: event.action,
      token: event.type,
      payload: this.currentBudget
    };
    this.dsCtrl.updatePartialBudget(update);
  }


  /**********************/
  /*      Helpers        */
  /**********************/
  private navigateToAltaBudget(){
    if(this.hasBudgetIdOnURL){
      this.router.navigate(['../../', this.dsCtrl.navigationRoute('recepcion')], {relativeTo: this.route});

    } else {
      this.router.navigate(['../', this.dsCtrl.navigationRoute('recepcion')], {relativeTo: this.route});
    }

  }

  private enableSummary(){
    this.showSummary = false;
    setTimeout(()=>{this.showSummary = true}, 400);

  }

}

//http://develar-local.co:4200/cck/gestion/presupuesto/5e3200b1dd0e0d21128e88d7
//http://develar-local.co:4200/cck/gestion/presupuesto/5e31ea1b5d6d201d4e4dd2ec
