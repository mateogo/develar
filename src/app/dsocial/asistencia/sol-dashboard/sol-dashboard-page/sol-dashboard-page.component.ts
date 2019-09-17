import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { DsocialController } from '../../../dsocial.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia, 
          AsistenciaTable,
          AsistenciaBrowse,
					Alimento, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';
const CREATE = 'create';
const SEARCH = 'search';

@Component({
  selector: 'sol-dashboard-page',
  templateUrl: './sol-dashboard-page.component.html',
  styleUrls: ['./sol-dashboard-page.component.scss']
})
export class SolDashboardPageComponent implements OnInit {
	@Input() items: Array<Asistencia>;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();

  public searchTitle = 'Búsqueda de Solicitudes';
  public title = 'Solicitudes';
  public openEditor = true;
  public unBindList = [];
  public query: AsistenciaBrowse = new AsistenciaBrowse();

  public showData =  false;
	public showTable = false;
  public showGrid =  true;

  //Person
  public currentPerson: Person;
  public personFound = false;
  public altaPersona = false;
  private personId: string;


  // Sol de Asistencia
  public asistenciasList: Asistencia[];
  public itemsFound = false;
  public currentAsistencia:Asistencia;



  constructor(
      private dsCtrl: DsocialController,
    	private router: Router,
    	private route: ActivatedRoute,

    ) { }

  ngOnInit() {

  	if(this.items && this.items.length){
  		this.asistenciasList = this.items;
  		this.showData = true;
  	}

    let first = true;    
    this.personId = this.route.snapshot.paramMap.get('id')

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }

  initCurrentPage(){
    this.dsCtrl.personListener.subscribe(p => {
      this.currentPerson = p;

    })

    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    
    if(this.dsCtrl.activePerson && this.personId){
      if(this.dsCtrl.activePerson._id !== this.personId){
    		this.dsCtrl.setCurrentPersonFromId(this.personId);

      }
    }

    if(!this.dsCtrl.activePerson && this.personId){
    		this.dsCtrl.setCurrentPersonFromId(this.personId);
    }

    this.fetchSolicitudes(this.query);

  }

  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  fetchSolicitudes(query?: any){

    if(!query){
      query = new AsistenciaBrowse();
      query['avance'] = 'emitido';

      this.query = query;
    }

    Object.keys(query).forEach(key =>{
      if(query[key] == null || query[key] == 'no_definido' ) delete query[key];
      if(key === 'fecomp_h' || key === 'fecomp_d') delete query[key];
    })

    this.dsCtrl.fetchAsistenciaByQuery(query).subscribe(list => {
      if(list && list.length > 0){
        this.asistenciasList = list;
        this.dsCtrl.updateTableData();

        this.showData = true;

      }else {
        this.asistenciasList = [];

        this.showData = false;

      }

    })

  }


  asistenciaSelected(event: UpdateAsistenciaEvent){
    if(event.action === UPDATE){

    }
  }

  fetchAsistenciasList(){
    this.asistenciasList = [];
    let query = {};

    this.dsCtrl.fetchAsistenciaByQuery(query).subscribe(list => {
      if(list && list.length) this.asistenciasList = list;

      this.itemsFound = true;
  		this.showData = true;
    })
  }


  updateItem(event: UpdateAsistenciaEvent){
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
    let item = AsistenciaHelper.initNewAsistencia('alimentos', 'alimentos', this.currentPerson)

  }

  emitEvent(event:UpdateAsistenciaEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	});
  	}
  }

  tableAction(action){
    let selection = this.dsCtrl.selectionModel;
    let selected = selection.selected as AsistenciaTable[];
    selected.forEach(t =>{
      this.dsCtrl.updateAvanceAsistencia('asistencia', 'autorizado', t.asistenciaId);

    })
    setTimeout(()=>{
      this.fetchSolicitudes(this.query);
    },1000)

  }

  moveOn(e){
  	e.stopPropagation();
  	e.preventDefault();
  	console.log('moveON')
  }

  openSearchForm(){
    this.openEditor = !this.openEditor;
  }

  refreshSelection(query: AsistenciaBrowse){
    this.query = query;

    if(query.searchAction == SEARCH){
      this.fetchSolicitudes(this.query);
    }

  }

  updateAsistenciaList(event: UpdateAsistenciaListEvent){
    console.log('ToDo: updateAsistenciaList')

  }


}
