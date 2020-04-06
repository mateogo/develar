import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Subject } from 'rxjs';

import { LocacionHospitalaria, LocacionHospTable, LocacionHospBrowse, LocacionEvent} from '../../locacion.model';

import { LocacionHelper } from '../../locacion.helper';
import { LocacionService } from '../../locacion.service';


const TOKEN_TYPE = 'locacionhospitalaria';

const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';
const CREATE = 'create';
const SEARCH = 'search';


@Component({
  selector: 'locacion-dashboard',
  templateUrl: './locacion-dashboard.component.html',
  styleUrls: ['./locacion-dashboard.component.scss']
})
export class LocacionDashboardComponent implements OnInit {
	@Input() items: Array<LocacionHospitalaria>;
	@Output() updateItems = new EventEmitter<LocacionEvent>();

 public currentLocacion:LocacionHospitalaria;

  public searchTitle = "Buacar Locaciones de Internación";
  public title =       "Locaciones";

	
	public openBrowsePanel = true;
	public showEditor = false;
	public showData =  false;

	public query: LocacionHospBrowse = new LocacionHospBrowse();

	public locacionesList: LocacionHospitalaria[];

  constructor(
      private locSrv: LocacionService,
    	private router: Router,
    	private route: ActivatedRoute,

    ) { }

  ngOnInit() {

  	if(this.items && this.items.length){
  		this.locacionesList = this.items;
  		this.showData = true;
  	}

		this.initCurrentPage();

  }

  initCurrentPage(){

    this.query = this.locSrv.locacionesSelector;
    this.fetchLocaciones(this.query);

  }


  /************************/
  /*    Sol/Locacion   */
  /**********************/
  private fetchLocaciones(query: any){
    this.showData = false;

  	this.cleanKeys(query);

    this.locSrv.fetchLocacionesByQuery(query).subscribe(list => {

      if(list && list.length > 0){
        this.locacionesList = list;
        
        let ts_now = Date.now();

        this.sortProperly(this.locacionesList, ts_now);

        this.locSrv.updateTableData();

        this.showData = true;

      }else {
        this.locacionesList = [];

        this.showData = false;

      }

    })

  }

	private cleanKeys(query){
		Object.keys(query).forEach(key =>{
      if(query[key] == null || query[key] == 'no_definido' ) delete query[key];
      if(key === 'fecomp_h' || key === 'fecomp_d') delete query[key];
    })
	
	}

  private sortProperly(records: LocacionHospitalaria[], ts_now: number){
    records.sort((fel: LocacionHospitalaria, sel: LocacionHospitalaria)=> {
			let cfel = fel.code;
			let csel = sel.code;

			if(cfel < csel ) return 1;

			else if(cfel > csel) return -1;

			else return 0;
    });
  }



  emitEvent(event:LocacionEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
	  		action: UPDATE,
	  		type: TOKEN_TYPE,
	  		items: this.items
  		});
  	}
  }

  tableActionEvent(action){
    this.showEditor = false;

    let selection = this.locSrv.selectionModel;
    let selected = selection.selected as LocacionHospTable[];

    if(action === 'editar'){
      let eventToEdit = selected && selected.length && selected[0];

      if(eventToEdit){
        this.editData(eventToEdit._id)

      }
    }

    if(action === 'editarencuestas'){
      //

    }

    setTimeout(()=>{
      //this.fetchLocaciones(this.query, SEARCH);
    },600)

  }

  private editData(id: string){
    let token = this.locacionesList.find(t => t._id === id);

    if(token){
      this.currentLocacion = token;

      setTimeout(() =>{
        this.showEditor = true;
      }, 300)
    }else {
      this.currentLocacion = null
    }

  }

  moveOn(e){
  	e.stopPropagation();
  	e.preventDefault();
  }

  openSearchForm(){
    this.openBrowsePanel = !this.openBrowsePanel;
  }

  refreshSelectionEvent(query: LocacionHospBrowse){
    this.query = query;
		this.fetchLocaciones(this.query);
  }

  updateLocacionList(event: LocacionEvent){

  }

  updateCurrentLocacion(e){
    this.showEditor = false;
    this.currentLocacion = null;
    this.fetchLocaciones(this.query);
  }


}
