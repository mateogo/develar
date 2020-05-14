import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

import { SaludController } from '../../salud.controller';

import {  Person } from '../../../entities/person/person';

import { 	Asistencia, 
          AsistenciaTable,
          VigilanciaBrowse,
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
const EVOLUCION = 'evolucion';
const SEARCH_NEXT = 'search_next';
const COSTO = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11];


@Component({
  selector: 'vigilancia-page',
  templateUrl: './vigilancia-page.component.html',
  styleUrls: ['./vigilancia-page.component.scss']
})
export class VigilanciaPageComponent implements OnInit {
	@Input() items: Array<Asistencia>;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();

  public searchTitle = 'Vigilancia epidemiológica';
  public title = 'Pandemia COVID-19';
  public openEditor = true;
  public unBindList = [];
  public query: VigilanciaBrowse = new VigilanciaBrowse();

  public showData =  false;
	public showTable = false;
  public showGrid =  true;
  public showEditor = false;

  public renderMap = false;
  public zoom = 15;
  public baseLatLng = {};
  public mapData: AsistenciaSig[] = [];
  public viewList: Array<string> = [];


  //Person
  public currentPerson: Person;
  public personFound = false;
  public altaPersona = false;
  private personId: string;


  // Sol de Asistencia
  public asistenciasList: Asistencia[];
  public itemsFound = false;
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

  tableAction(action){
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
      //

    }

    setTimeout(()=>{
      //this.fetchSolicitudes(this.query, SEARCH);
    },1000)

  }

  openSearchForm(){
    this.openEditor = !this.openEditor;
  }


  updateAsistenciaList(event: UpdateAsistenciaListEvent){
    if(event.action === NAVIGATE){
        this.router.navigate(['../', this.dsCtrl.atencionRoute('seguimiento')], {relativeTo: this.route});
     }

    if(event.action === EVOLUCION){
      //this.fetchSolicitudes(this.query, SEARCH);
     }
  }

  updateCurrentAsistencia(e){
    this.showEditor = false;
    this.currentAsistencia = null;
    this.fetchSolicitudes(this.query, SEARCH);
  }
  

  mapRequest(act:string){
    if(act ==="map:show"){
      this.initMapToRender();

    }else if(act === "map:hide"){
      this.renderMap = false;


    }

  }

  vigilanciaAltaEvent(event: UpdateAsistenciaEvent){

    if(event.action === UPDATE){
      this.query = new VigilanciaBrowse();
      this.query.isVigilado = false;
      this.query.hasCovid = false;
      this.query.viewList = [];
      this.query.asistenciaId = event.token._id;
      //this.viewList = this.query.viewList || [];
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

    Object.keys(query).forEach(key =>{
      if(query[key] == null || query[key] == 'no_definido' ) delete query[key];

      if(key === 'fecomp_h' || key === 'fecomp_d') delete query[key];
      if(key === 'isVigilado'       && !query[key]) delete query[key];
      if(key === 'hasCovid'         && !query[key]) delete query[key];
      if(key === 'casoCovid'        && !query[key]) delete query[key];
      if(key === 'vigiladoCovid'    && !query[key]) delete query[key];
      if(key === 'necesitaLab'      && !query[key]) delete query[key];
      if(key === 'isSeguimiento'    && !query[key]) delete query[key];
      if(key === 'isActiveSisa'     && !query[key]) delete query[key];
      if(key === 'pendLaboratorio'  && !query[key]) delete query[key];
      if(key === 'qIntents'         && !query[key]) delete query[key];
      if(key === 'qNotSeguimiento'  && !query[key]) delete query[key];
      if(key === 'qDaysSisa'        && !query[key]) delete query[key];
      if(key === 'qNotConsultaSisa' && !query[key]) delete query[key];
      if(key === 'casosIndice'      && !query[key]) delete query[key];
    })

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
    list = list.filter(token => !token.hasParent);
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

  //const COSTO = [1, 2, 3, 4, 6];
  private  costo (asis: Asistencia, ts:number){
    let peso = this.getPesoAsistencia(asis);

    return (ts - asis.fecomp_tsa) * COSTO[peso];
  }

  private getPesoAsistencia(asis: Asistencia): number{
    let peso = 0;
    let covid = asis.sintomacovid;

    if( !covid || asis.tipo === 2) return peso;
    peso += (covid.hasFiebre ? (covid.fiebre > 38 ? 2: 1) : 0);
    peso += ( covid.hasDifRespiratoria ? 2: 0);
    peso += ( (covid.hasDolorGarganta || covid.hasTos )? 1: 0);
    peso += ( (covid.hasViaje || covid.hasContacto || covid.hasEntorno) ? 3: 0);

    if(peso>8) peso = 8

    return peso;
  }

  private getLastListed(){
    let last = 0;
    if(this.asistenciasList && this.asistenciasList.length){
      last = this.asistenciasList[this.asistenciasList.length - 1].fecomp_tsa;
    }
    return last;
  }


  /*   EDIT  Sol/Asistencia   */
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



  /************************/
  /*    MAP RENDER   */
  /**********************/
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

  /************************/
  /*   PERSON            */
  /**********************/
	private initCurrentPage(){
    
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
    this.query = this.dsCtrl.vigilanciaSelector;
    //this.fetchSolicitudes(this.query, SEARCH);
  }

  private loadPerson(id){
    this.dsCtrl.setCurrentPersonFromId(id).then(p => {
      if(p){
        this.currentPerson = p;

      }
    });
  }

  /************************/
  /*   DEPRECATED            */
  /**********************/

  // asistenciaSelected(event: UpdateAsistenciaEvent){
  //   if(event.action === UPDATE){

  //   }
  // }

  // updateItem(event: UpdateAsistenciaEvent){
  //   if(event.action === UPDATE){

  //   }
  // }

  // addItem(){
  //   let item = AsistenciaHelper.initNewAsistencia('alimentos', 'alimentos', this.currentPerson)

  // }

  // emitEvent(event:UpdateAsistenciaEvent){
  
  // 	if(event.action === UPDATE){
  // 		this.updateItems.next({
  // 		action: UPDATE,
  // 		type: TOKEN_TYPE,
  // 		items: this.items
  // 	});
  // 	}
  // }
  // moveOn(e){
  // 	e.stopPropagation();
  // 	e.preventDefault();
  // }


}
