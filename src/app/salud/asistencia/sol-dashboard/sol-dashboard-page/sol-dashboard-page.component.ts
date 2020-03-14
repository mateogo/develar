import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Subject } from 'rxjs';

import { SaludController } from '../../../salud.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia, 
          AsistenciaTable,
          AsistenciaBrowse,
					Alimento,
          AsistenciaSig, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';
const CREATE = 'create';
const SEARCH = 'search';
const NAVIGATE = 'navigate';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'sol-dashboard-page',
  templateUrl: './sol-dashboard-page.component.html',
  styleUrls: ['./sol-dashboard-page.component.scss']
})
export class SolDashboardPageComponent implements OnInit {
	@Input() items: Array<Asistencia>;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();

  public searchTitle = 'Navegar Solicitudes';
  public title = 'Solicitudes';
  public openEditor = true;
  public unBindList = [];
  public query: AsistenciaBrowse = new AsistenciaBrowse();

  public showData =  false;
	public showTable = false;
  public showGrid =  true;

  public renderMap = false;
  public zoom = 15;
  public baseLatLng = {};
  public mapData: AsistenciaSig[] = [];


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
      private dsCtrl: SaludController,
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
    
    if(this.dsCtrl.activePerson && this.personId && this.dsCtrl.activePerson._id !== this.personId){
        this.loadPerson(this.personId);
    }

    if(!this.dsCtrl.activePerson && this.personId){
        this.loadPerson(this.personId);
    }

    if(this.dsCtrl.activePerson){
        this.currentPerson = this.dsCtrl.activePerson;
    }

    // current selector saved in Controller
    this.query = this.dsCtrl.asistenciasSelector;
    this.fetchSolicitudes(this.query, SEARCH);
  }

  loadPerson(id){
    this.dsCtrl.setCurrentPersonFromId(id).then(p => {
      if(p){
        this.currentPerson = p;

      }
    });
  }


  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  fetchSolicitudes(query: any, action: string){

    if(!query){
      query = new AsistenciaBrowse();
      query['avance'] = 'emitido';

      this.query = query;
    }

    if(action === SEARCH_NEXT){
      let last = this.getLastListed();
      if(last){
        this.query.fecomp_ts_h = last;
      }

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
  private getLastListed(){
    let last = 0;
    if(this.asistenciasList && this.asistenciasList.length){
      last = this.asistenciasList[this.asistenciasList.length - 1].fecomp_tsa;
    }
    return last;
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

    if(action === 'autorizar'){
      selected.forEach(t =>{
        this.dsCtrl.updateAvanceAsistencia('autorizado', t.asistenciaId);
      })
    }

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

  refreshSelection(query: AsistenciaBrowse){
    this.query = query;

    if(query.searchAction == SEARCH || query.searchAction == SEARCH_NEXT){
      this.fetchSolicitudes(this.query, query.searchAction);
    }

  }

  updateAsistenciaList(event: UpdateAsistenciaListEvent){
    if(event.action === NAVIGATE){
        this.router.navigate(['../', this.dsCtrl.atencionRoute('seguimiento')], {relativeTo: this.route});
     }
  }

  mapRequest(act:string){
    if(act ==="map:show"){
      this.initMapToRender();

    }else if(act === "map:hide"){
      this.renderMap = false;


    }

  }

  initMapToRender(){
    let listener$: Subject<AsistenciaSig[]> = this.dsCtrl.fetchMapDataFromAsis(this.asistenciasList);
    listener$.subscribe(tokens => {
      if(tokens && tokens.length){
        this.baseLatLng = {
          lat: tokens[0].lat,
          lng: tokens[0].lng
        }
        
        tokens[0].asistencia.requeridox.slug


        this.mapData = tokens;
        this.renderMap = true;


      }
    })

    
  }


}

