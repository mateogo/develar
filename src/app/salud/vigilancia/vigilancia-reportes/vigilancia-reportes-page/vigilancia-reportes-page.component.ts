import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { SaludController } from '../../../salud.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia, 
          AsistenciaTable,
          VigilanciaBrowse,
          AsistenciaSig, 
					AsistenciaHelper } from '../../../asistencia/asistencia.model';

const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';
const COSTO = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11];
const EXPORT = 'export';

@Component({
  selector: 'vigilancia-reportes-page',
  templateUrl: './vigilancia-reportes-page.component.html',
  styleUrls: ['./vigilancia-reportes-page.component.scss']
})
export class VigilanciaReportesPageComponent implements OnInit {
  public searchTitle = 'Reportes Vigilancia Epidemiológica';
  public title = 'VIGILANCIA EPIDEMIOLÓGICA';
  public unBindList = [];
  public query: VigilanciaBrowse = new VigilanciaBrowse();

  public openBrowseEditor = true;
  public showData =  false;
	public showTable = false;
  public showEditor = false;
  public renderMap = false;

  public zoom = 15;
  public baseLatLng = {};
  public mapData: AsistenciaSig[] = [];
  public tableActualColumns: Array<string> = [];

  public hasExport = true;

  // Sol de Asistencia
  public asistenciasList: Asistencia[];
  public currentAsistencia:Asistencia;

  constructor(
      private dsCtrl: SaludController,
    	private router: Router,
    	private route: ActivatedRoute,

    ) { }

  ngOnInit() {
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

  private initCurrentPage(){
    this.query = this.dsCtrl.vigilanciaSelector;
  }

  openSearchForm(){
    this.openBrowseEditor = !this.openBrowseEditor;
  }

  refreshSelection(query: VigilanciaBrowse){// listener de solcovid-browse
    this.query = this.repasarQuery(query);

    if(query.searchAction == SEARCH || query.searchAction == SEARCH_NEXT){
      console.dir(this.query);
      this.fetchSolicitudes(this.query, query.searchAction);

    }else if(query.searchAction === EXPORT){
      this.dsCtrl.exportAsisprevencionByQuery(this.query);

    }
  }
  
  updateCurrentAsistencia(e){ //listener de solcovid-panel
    this.showEditor = false;
    this.currentAsistencia = null;
    this.fetchSolicitudes(this.query, SEARCH);
  }

  mapRequest(act:string){ // listener de solcovid-browse
    if(act ==="map:show"){
      this.initMapToRender();

    }else if(act === "map:hide"){
      this.renderMap = false;
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
  private repasarQuery(query: VigilanciaBrowse): VigilanciaBrowse{
    if(!query){
      query = new VigilanciaBrowse();
      query['avance'] = 'emitido';

      this.query = query;
    }
    
    return AsistenciaHelper.cleanQueryToken(query, true);
  }


  private fetchSolicitudes(query: VigilanciaBrowse, action: string){
    this.showData = false;
    console.dir(query)

    this.dsCtrl.fetchAsistenciaByQuery(query).subscribe(list => {
      if(list && list.length > 0){
        this.asistenciasList = list;
        
        this.sortProperly(this.asistenciasList);

        this.initTableData(this.asistenciasList);

      }else {
        this.asistenciasList = [];

        this.showData = false;

      }
    })
  }

  private initTableData(list: Asistencia[]){
    this.dsCtrl.updateTableData();

    if(this.query && this.query.reporte === 'LABORATORIO'){
      this.tableActualColumns = LABORATORIO

    }else {
      this.tableActualColumns = LABORATORIO

    }


    this.showData = true;
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



  tableAction(action){ // listener de sol-table
    this.showEditor = false;

    let selection = this.dsCtrl.selectionModel;
    let selected = selection.selected as AsistenciaTable[];

    if(action === 'autorizar'){
      selected.forEach(t =>{
        this.dsCtrl.updateAvanceAsistencia('autorizado', t.asistenciaId);
      })
    }
    if(action === 'editar'){
      let eventToEdit = selected && selected.length && selected[0];

      if(eventToEdit){
        this.editData(eventToEdit.asistenciaId)

      }
    }

    if(action === 'editarencuestas'){
    }

  }

  private editData(id: string){
    let token = this.asistenciasList.find(t => t._id === id);

    if(token){
      this.currentAsistencia = token;

      setTimeout(() =>{
        this.showEditor = true;
      }, 300)
    }else {
      this.currentAsistencia = null
    }

  }

  private initMapToRender(){
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


const LABORATORIO = [
          'select',
          'ndoc',
          'personSlug',
          'telefono',
          'edad',
          'covidActualState',
          'covidSintoma',
          'covidAvance',
          'covidTxt',
          'reportadoPor',
          'fe_reportado',
          'lab_laboratorio',
          'lab_fe_toma',
          'lab_estado'
]