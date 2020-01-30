import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Subject } from 'rxjs';

import { SisplanController } from '../../sisplan.controller';
import { devutils }from '../../../develar-commons/utils'

import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../sisplan.service';

//import { Budget, BudgetTable, BudgetBrowse, BudgetHelper } from '../pcultural.model';
import { Budget, BudgetTable, BudgetBrowse, BudgetHelper       } from '../presupuesto.model';

import { Person, personModel } from '../../../entities/person/person';






const UPDATE = 'update';
const TOKEN_TYPE = 'budget';
const CREATE = 'create';
const SEARCH = 'search';
const NAVIGATE = 'navigate';
const SEARCH_NEXT = 'search_next';



@Component({
  selector: 'budget-dashboard',
  templateUrl: './budget-dashboard.component.html',
  styleUrls: ['./budget-dashboard.component.scss']
})
export class BudgetDashboardComponent implements OnInit {
	@Input() items: Array<Budget>;
	@Output() updateItems = new EventEmitter<UpdateListEvent>();

  public searchTitle = 'Presupuesto General';
  public title = 'Presupuesto corriente';
  public openEditor = true;
  public unBindList = [];
  public query: BudgetBrowse = new BudgetBrowse();

  public showData =  false;
	public showTable = false;
  public showGrid =  true;

  public renderMap = false;
  public zoom = 15;
  public baseLatLng = {};


  //Person
  public currentPerson: Person;
  public personFound = false;
  public altaPersona = false;
  private personId: string;


  // Sol de Budget
  public budgetsList: Budget[];
  public itemsFound = false;
  public currentBudget:Budget;



  constructor(
      private dsCtrl: SisplanController,
    	private router: Router,
    	private route: ActivatedRoute,

    ) { }

  ngOnInit() {

  	if(this.items && this.items.length){
  		this.budgetsList = this.items;
  		this.showData = true;
  	}

    let first = true;
    this.personId = this.route.snapshot.paramMap.get('id')
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }

  initCurrentPage(){
    
    // if(this.dsCtrl.activePerson && this.personId && this.dsCtrl.activePerson._id !== this.personId){
    //     this.loadPerson(this.personId);
    // }

    // if(!this.dsCtrl.activePerson && this.personId){
    //     this.loadPerson(this.personId);
    // }

    // if(this.dsCtrl.activePerson){
    //     this.currentPerson = this.dsCtrl.activePerson;
    // }

    // current selector saved in Controller
    this.query = this.dsCtrl.budgetsSelector;
    this.fetchSolicitudes(this.query, SEARCH);
  }

  // loadPerson(id){
  //   this.dsCtrl.setCurrentPersonFromId(id).then(p => {
  //     if(p){
  //       this.currentPerson = p;

  //     }
  //   });
  // }


  /************************/
  /*    Sol/Budget   */
  /**********************/
  fetchSolicitudes(query: any, action: string){

    if(!query){
      query = new BudgetBrowse();
      query['avance'] = 'emitido';

      this.query = query;
    }

    if(action === SEARCH_NEXT){
      let last = this.getLastListed();
      if(last){
        this.query.fe_req_ts_h = last;
      }

    }

    Object.keys(query).forEach(key =>{
      if(query[key] == null || query[key] == 'no_definido' ) delete query[key];
      if(key === 'fe_req_h' || key === 'fe_req_d') delete query[key];
    })

    this.dsCtrl.fetchBudgetByQuery(query).subscribe(list => {
      console.log('QUERY [%s]',list&& list.length);
      if(list && list.length > 0){
        this.budgetsList = list;
        this.dsCtrl.updateBudgetsTableData();

        this.showData = true;

      }else {
        this.budgetsList = [];

        this.showData = false;

      }

    })

  }
  private getLastListed(){
    let last = 0;
    if(this.budgetsList && this.budgetsList.length){
      last = this.budgetsList[this.budgetsList.length - 1].fe_req_ts;
    }
    return last;
  }



  updateItem(event: UpdateEvent){
    if(event.action === UPDATE){
      // this.dsCtrl.manageAsistenciaRecord('asistencia',event.token).subscribe(t =>{
      //   if(t){
      //     event.token = t;
      //   }

      //   this.emitEvent(event);

      // });
    }
  }

  addItem(){
    let item = BudgetService.initNewBudget('produccion', 'musica', 'popular', 'Alta rapida');
  }

  emitEvent(event:UpdateEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	});
  	}
  }

  tableAction(action){
    let selection = this.dsCtrl.budgetsSelectionModel;
    let selected = selection.selected as BudgetTable[];

    if(action === 'editarencuestas'){
      //

    }

    setTimeout(()=>{
      this.fetchSolicitudes(this.query, SEARCH);
    },1000)

  }

  moveOn(e){
  	e.stopPropagation();
  	e.preventDefault();
  }

  openSearchForm(){
    this.openEditor = !this.openEditor;
  }

  refreshSelection(query: BudgetBrowse){
    this.showData = false;
    this.query = query;

    if(query.searchAction == SEARCH || query.searchAction == SEARCH_NEXT){
      this.fetchSolicitudes(this.query, query.searchAction);
    }

  }

  updateBudgetList(event: UpdateListEvent){
    if(event.action === NAVIGATE){
        this.router.navigate(['../', this.dsCtrl.navigationRoute('seguimiento')], {relativeTo: this.route});
     }
  }

}
