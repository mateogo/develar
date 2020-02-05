import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { SisplanController } from '../../../sisplan.controller';

import { SisplanService, BudgetService, UpdateListEvent, UpdateEvent } from '../../../sisplan.service';

import { Budget, BudgetHelper } from '../../presupuesto.model';
import { Pcultural       }      from '../../../pcultural/pcultural.model';



const UPDATE = 'update';
const DELETE = 'delete';
const TOKEN_TYPE = 'budget';
const NAVIGATE = 'navigate';


@Component({
  selector: 'budget-core-panel',
  templateUrl: './budget-core-panel.component.html',
  styleUrls: ['./budget-core-panel.component.scss']
})
export class BudgetCorePanelComponent implements OnInit {
	@Input() items: Array<Budget>;
  @Input() pcultural: Pcultural;
	@Output() updateItems = new EventEmitter<UpdateListEvent>();

  public title = 'Presupuestos';

	public showList = false;
  public showActiveList = false;
  public showFullList = true;

  public openEditor = true;

  public activeitems: Array<Budget> = [];

  //Budget
  public budgetList: Budget[] = [];

  constructor(
      private dsCtrl: SisplanController,
    ) { }

  ngOnInit() {

  	if(this.items && this.items.length){
      this.filterActiveItems();
  		this.showList = true;
  	}else{
      if(this.pcultural) this.initBudgetListFromPcultural(this.pcultural);
    }

  }

  private filterActiveItems(){
    this.activeitems = [];
    setTimeout(()=>{
      this.activeitems = BudgetService.filterActiveBudgets(this.items);

      if(this.activeitems && this.activeitems.length){
        this.showActiveView(true);

      }else{
        this.showActiveView(false);

      }


    },500);

  }

  /**********************/
  /*      Budget        */
  /**********************/
  private initBudgetListFromPcultural(currentPcultural: Pcultural){
    this.showList = false;
    this.items = [];
    if(!currentPcultural) return;

    this.dsCtrl.fetchBudgetByPcultural(currentPcultural._id).subscribe(list => {
      this.items = list || [];
      this.sortProperly(this.items);

      this.showList = true;
    })
  }

  private sortProperly(records){
    records.sort((fel, sel)=> {
      if(fel.fe_req_ts < sel.fe_req_ts) return 1;
      else if(fel.fe_req_ts > sel.fe_req_ts) return -1;
      else return 0;
    })
  }

  updateBudgetList(event: UpdateListEvent){
    if(event.action === UPDATE){
      this.initBudgetListFromPcultural(this.pcultural);
    }

  }


  updateItem(event: UpdateEvent){
    if(event.action === UPDATE){
      this.dsCtrl.manageBudgetRecord(event.payload as Budget).subscribe(t =>{
        if(t){
          event.payload = t;
          if(this.pcultural) this.initBudgetListFromPcultural(this.pcultural);
          else this.filterActiveItems();
        }

        this.emitEvent(event);

      });

    } else if(event.action === NAVIGATE){
      this.emitEvent(event);


    } else if(event.action === DELETE){
      this.deleteItem(event.payload as Budget)


      // this.dsCtrl.manageAsistenciaDeleteRecord('asistencia',event.token).subscribe(t =>{

      //   this.emitEvent(event);

      // });      

    }
  }

  private deleteItem(token: Budget){
    let isNew = token._id ? false: true;
    if(isNew){
      this.deleteFromListItems(token);
    }

  }

  deleteFromListItems(token: Budget){
    let index = this.items.indexOf(token);
    if(index !== -1){
      this.items.splice(index, 1)
    }
  }

  addItem(){
    let spec = {
        sector: 'produccion',
        type:   'musica',
        stype:  'popular',
        slug:   'alta rápida' ,
        sede:   'cck',
        locacion: '',
        programa: ''     
    }

    if(this.pcultural){
      spec.slug = this.pcultural.slug;
      spec.sector = this.pcultural.sector;
      spec.type = this.pcultural.type;
      spec.stype = this.pcultural.stype;
      spec.sede = this.pcultural.sede;
      spec.locacion = this.pcultural.locacion;
      spec.programa = this.pcultural.programa;
    }

    let item = BudgetService.initNewBudget(spec);
    if(!this.items) this.items = [];
    if(!this.activeitems) this.activeitems = [];

    this.items.unshift(item);
    this.activeitems.unshift(item);

    this.showList = true;

  }

  emitEvent(event:UpdateEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	  });

  	} else if(event.action === NAVIGATE){
      this.updateItems.next({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      items: this.items
      });

    }
  }

  activeView(){
    this.showActiveView(true);
  }

  fullView(){
    this.showActiveView(false);
  }

  private showActiveView(active){
    if(active === true){
      this.title = 'Eventos Culturales (solo activas)';
    } else {
      this.title = 'Eventos Culturales (lista completa)';

    }
    this.showActiveList = active;
    this.showFullList = !active;
  }


}
