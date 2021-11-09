import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Subject } from 'rxjs';

import { DsocialController } from '../../dsocial.controller';

import {  Person } from '../../../entities/person/person';

import { Observacion, ObservacionBrowse } from '../../../develar-commons/observaciones/observaciones.model';

import { 	Asistencia,
          AsistenciaTable,
					Alimento,
          AsistenciaSig,
					UpdateAsistenciaEvent,
					UpdateAlimentoEvent,
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia/asistencia.model';


const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';
const CREATE = 'create';
const SEARCH = 'search';
const NAVIGATE = 'navigate';
const SEARCH_NEXT = 'search_next';
const EXCEL= 'excel';

@Component({
  selector: 'obser-page',
  templateUrl: './obser-page.component.html',
  styleUrls: ['./obser-page.component.scss']
})
export class ObserPageComponent implements OnInit {
	@Input() items: Array<Asistencia>;

  public searchTitle = 'Explorar Observaciones';
  public title = 'Observaciones';
  public openEditor = true;
  public unBindList = [];
  public query: ObservacionBrowse = new ObservacionBrowse();

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
  public observacionesList: Observacion[];


  constructor(
      private dsCtrl: DsocialController,
    	private router: Router,
    	private route: ActivatedRoute,

    ) { }

  ngOnInit() {
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

    // current selector saved in Controller
    this.query = this.dsCtrl.observacionesSelector;
    //this.fetchSolicitudes(this.query, SEARCH);
  }


  openSearchForm(){
    this.openEditor = !this.openEditor;
  }

  refreshSelection(query: ObservacionBrowse){
    this.query = query;

    if(query.searchAction === SEARCH || query.searchAction === SEARCH_NEXT){
      this.fetchSolicitudes(this.query);

    } else if (query.searchAction === EXCEL) {
      this._exportExcel(this.query);
    }

  }

  /******************/
  /*    DAO        */
  /****************/
  private fetchSolicitudes(query: ObservacionBrowse){

    query = this._cleanQuery(query);

    this.dsCtrl.fetchObservacionesByQuery(query).subscribe(list => {
      if(list && list.length) {
        this.observacionesList = list;
        this.dsCtrl.updateObservacionesTableData(list);
        this.showData = true;
      }
      else {
        this.observacionesList = [];
        this.showData = false;
      }
    })
  }

  private _exportExcel(query: ObservacionBrowse): void {
    query = this._cleanQuery(query);
    this.dsCtrl.exportObservacionesByQuery(this.query);
  }

  private _cleanQuery(query: ObservacionBrowse): ObservacionBrowse{
    Object.keys(query).forEach(key =>{
      if(query[key] == null || query[key] == 'no_definido' ) delete query[key];

    })
    return query;
  }
  

  tableAction(action){
    // let selection = this.dsCtrl.selectionModel;
    // let selected = selection.selected as AsistenciaTable[];

    // if(action === 'autorizar'){
    //   selected.forEach(t =>{
    //     this.dsCtrl.updateAvanceAsistencia('asistencia', 'autorizado', t.asistenciaId);
    //   })
    // }

    // if(action === 'editarencuestas'){
    //   //

    // }

    // setTimeout(()=>{
    //   this.f etchSolicitudes(this.query, SEARCH);
    // },1000)

  }



  // updateAsistenciaList(event: UpdateAsistenciaListEvent){
  //   if(event.action === NAVIGATE){
  //       this.router.navigate(['../', this.dsCtrl.atencionRoute('seguimiento')], {relativeTo: this.route});
  //    }
  // }


}



