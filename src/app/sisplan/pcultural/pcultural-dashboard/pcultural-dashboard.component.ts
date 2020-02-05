import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Subject } from 'rxjs';

import { SisplanController } from '../../sisplan.controller';
import { devutils }from '../../../develar-commons/utils'

import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

import { SisplanService, UpdateListEvent, UpdateEvent } from '../../sisplan.service';

import { Pcultural, PculturalTable, PculturalBrowse, PculturalHelper } from '../pcultural.model';

import { Person, personModel } from '../../../entities/person/person';

const UPDATE = 'update';
const TOKEN_TYPE = 'pcultural';
const CREATE = 'create';
const SEARCH = 'search';
const NAVIGATE = 'navigate';
const SEARCH_NEXT = 'search_next';


@Component({
  selector: 'pcultural-dashboard',
  templateUrl: './pcultural-dashboard.component.html',
  styleUrls: ['./pcultural-dashboard.component.scss']
})
export class PculturalDashboardComponent implements OnInit {
	@Input() items: Array<Pcultural>;
	@Output() updateItems = new EventEmitter<UpdateListEvent>();

  public searchTitle = 'Programación de eventos';
  public title = 'Eventos Culturales';
  public openEditor = true;
  public unBindList = [];
  public query: PculturalBrowse = new PculturalBrowse();

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


  // Sol de Pcultural
  public pculturalesList: Pcultural[];
  public itemsFound = false;
  public currentPcultural:Pcultural;



  constructor(
      private dsCtrl: SisplanController,
    	private router: Router,
    	private route: ActivatedRoute,

    ) { }

  ngOnInit() {

  	if(this.items && this.items.length){
  		this.pculturalesList = this.items;
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
    this.query = this.dsCtrl.pculturalesSelector;
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
  /*    Sol/Pcultural   */
  /**********************/
  fetchSolicitudes(query: any, action: string){

    if(!query){
      query = new PculturalBrowse();
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

    this.dsCtrl.fetchPculturalByQuery(query).subscribe(list => {
      if(list && list.length > 0){
        this.pculturalesList = list;
        this.dsCtrl.updatePculturalesTableData();

        this.showData = true;

      }else {
        this.pculturalesList = [];

        this.showData = false;

      }

    })

  }
  private getLastListed(){
    let last = 0;
    if(this.pculturalesList && this.pculturalesList.length){
      last = this.pculturalesList[this.pculturalesList.length - 1].fecomp_ts;
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
    let item = SisplanService.initNewPcultural('produccion', 'musica', 'popular', 'Alta rapida');
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
    let selection = this.dsCtrl.pculturalesSelectionModel;
    let selected = selection.selected as PculturalTable[];

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

  refreshSelection(query: PculturalBrowse){
    this.showData = false;
    this.query = query;

    if(query.searchAction == SEARCH || query.searchAction == SEARCH_NEXT){
      this.fetchSolicitudes(this.query, query.searchAction);
    }

  }

  updatePculturalList(event: UpdateListEvent){
    if(event.action === NAVIGATE){
        this.router.navigate(['../', this.dsCtrl.navigationRoute('seguimiento')], {relativeTo: this.route});
     }
  }


}
