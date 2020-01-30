import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { SisplanController } from '../../sisplan.controller';

import { devutils }from '../../../develar-commons/utils'

import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../sisplan.service';

import { Budget, BudgetHelper       } from '../presupuesto.model';

const TOKEN_TYPE = 'budget';
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

  //Observaciones
  public audit: Audit;
  public parentEntity: ParentEntity;

  public hasCurrentBudget: boolean = false;
  private hasBudgetIdOnURL: boolean = false;
  private currentBudget: Budget;
  private budgetId: string;


  constructor(
    private dsCtrl: SisplanController,
    private route:  ActivatedRoute,
 		private router: Router,
  	) { 
  	console.log('0000000')

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
    console.log('1')

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
    console.log('3')

    if(budget && this.currentBudget && budget._id === this.currentBudget._id){
      return;
    }

    if(budget){

      this.currentBudget = budget;

      this.audit = this.dsCtrl.getAuditData();
      this.parentEntity = {
        entityType: 'budget',
        entityId:   this.currentBudget._id,
        entitySlug: this.currentBudget.slug
      }

			this.hasCurrentBudget = true;
    }
 
  }

  /**********************/
  /*      Budget        */
  /**********************/
  loadBudget(id){
    console.log('2')
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
    }

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

}

//http://develar-local.co:4200/cck/gestion/presupuesto/5e31ea1b5d6d201d4e4dd2ec
