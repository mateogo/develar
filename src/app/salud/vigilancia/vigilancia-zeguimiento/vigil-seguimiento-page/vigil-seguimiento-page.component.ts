import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

import { SaludController } from '../../../salud.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia, 
          AsistenciaTable,
          VigilanciaBrowse,
					Alimento,
          AsistenciaSig, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../../asistencia/asistencia.model';

const UPDATE = 'update';
const CREATE = 'create';
const SEARCH = 'search';
const NAVIGATE = 'navigate';
const EVOLUCION = 'evolucion';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'vigil-seguimiento-page',
  templateUrl: './vigil-seguimiento-page.component.html',
  styleUrls: ['./vigil-seguimiento-page.component.scss']
})
export class VigilSeguimientoPageComponent implements OnInit {
	@Input() items: Array<Asistencia>;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();

  public searchTitle = 'Seguimiento de afectados/as';
  public title = 'Pandemia COVID-19';
  public unBindList = [];
  public query: VigilanciaBrowse = new VigilanciaBrowse();

  public showData =  false;
  public showEditor = false;

  public viewList: Array<string> = [];

  // Sol de Asistencia
  public asistenciasList: Asistencia[];
  public currentAsistencia:Asistencia;

  // DataSource
  public asistenciasListener = new BehaviorSubject<Asistencia[]>([])
 


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
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }

  /************************/
  /*   TEMPLATE EVENTS   */
  /**********************/
  refreshSelection(query: VigilanciaBrowse){
    this.query = query;
    this.viewList = this.query.viewList || [];

    if(query.searchAction == SEARCH || query.searchAction == SEARCH_NEXT){
      this.fetchSolicitudes(this.query, query.searchAction);
    }
  }


  updateCurrentAsistencia(e){
    this.showEditor = false;
    this.currentAsistencia = null;
    this.fetchSolicitudes(this.query, SEARCH);
  }
  
  vigilanciaAltaEvent(event: UpdateAsistenciaEvent){

    if(event.action === UPDATE){
      this.query = new VigilanciaBrowse();
      this.query.isVigilado = false;
      this.query.hasCovid = false;
      this.query.viewList = [];
      this.query.asistenciaId = event.token._id;

      this.fetchSolicitudes(this.query, SEARCH);
    }
  }

  vinculoSelected(personId: string){
    this.query = new VigilanciaBrowse();
    this.query.isVigilado = false;
    this.query.hasCovid = false;
    this.query.viewList = [];

    this.query.requirenteId = personId;

    this.fetchSolicitudes(this.query, SEARCH);
  }


  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  private fetchSolicitudes(query: any, action: string){
    this.showData = false;

    if(!query){
      query = new VigilanciaBrowse();
      query['avance'] = 'emitido';

      this.query = query;
    }

    AsistenciaHelper.cleanQueryToken(this.query, false);


    this.dsCtrl.fetchAsistenciaByQuery(query).subscribe(list => {
      if(list && list.length > 0){
        this.asistenciasList = list;

        if(query.casosIndice) this.asistenciasList = this.filterCasosIndice(this.asistenciasList);

        this.sortProperly(this.asistenciasList);

        this.dsCtrl.triggerAsistenciaEmitter(this.asistenciasList);

        this.showData = true;

      }else {
        this.dsCtrl.triggerAsistenciaEmitter([]);
        this.asistenciasList = [];

        this.showData = false;
      }

    })
  }

  private filterCasosIndice(list: Asistencia[]): Asistencia[]{
    list = list.filter(token => (!token.hasParent || token.contactosEstrechos));
    return list;
  }

  private sortProperly(records: Asistencia[]){

    records.sort((fel: Asistencia, sel: Asistencia)=> {
      let fprio = (fel.sisaevent && fel.sisaevent.fets_reportado) || fel.fenotif_tsa || fel.fecomp_tsa;
      let sprio = (sel.sisaevent && sel.sisaevent.fets_reportado) || sel.fenotif_tsa || sel.fecomp_tsa;

      if(fprio < sprio ) return -1;

      else if(fprio > sprio ) return 1;

      else{
        return 0;
      }


    });
  }


  /************************/
  /*   INIT ONCE         */
  /**********************/
	private initCurrentPage(){
    
    this.query = new VigilanciaBrowse();

  }


}

