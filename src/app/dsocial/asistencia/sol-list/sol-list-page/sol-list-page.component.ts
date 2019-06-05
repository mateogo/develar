import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { DsocialController } from '../../../dsocial.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia, 
          AsistenciaTable,
					Alimento, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';

const UPDATE = 'update';
const TOKEN_TYPE = 'asistencia';
const CREATE = 'create';

@Component({
  selector: 'sol-list-page',
  templateUrl: './sol-list-page.component.html',
  styleUrls: ['./sol-list-page.component.scss']
})
export class SolListPageComponent implements OnInit {
	@Input() items: Array<Asistencia>;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();

  public title = 'Solicitudes de Asistencia';
  public openEditor = true;
  public unBindList = [];

	public showTable = false;

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
  		this.showTable = true;
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
      console.log('personListener [%s]', (p? p.displayName :'NO-PERSON'))
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

    this.fetchSolicitudes();

  }

  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  fetchSolicitudes(){
    this.dsCtrl.fetchAsistenciaByQuery({avance: 'emitido'}).subscribe(list => {
      if(list && list.length > 0){
        this.asistenciasList = list;
        this.dsCtrl.updateTableData();

        this.showTable = true;

      }

    })

  }


  asistenciaSelected(event: UpdateAsistenciaEvent){
    console.log('AlimentosPage: openEditor: [%s]', event.action);
    if(event.action === UPDATE){
      console.log('asistencia Selected UPDATE BUBBLED')

    }
  }

  fetchAsistenciasList(){
    this.asistenciasList = [];
    let query = {};

    this.dsCtrl.fetchAsistenciaByQuery(query).subscribe(list => {
      if(list && list.length) this.asistenciasList = list;

      this.itemsFound = true;
  		this.showTable = true;
    })
  }


  updateItem(event: UpdateAsistenciaEvent){
  	console.log('update Asistencia-Panel: [%s]', event.action);
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
    console.log('=== Asistencia DATA Panel ====');
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	});
  	}
  }

  tableAction(action){
    console.log('action bubbled[%s]', action);
    let selection = this.dsCtrl.selectionModel;
    let selected = selection.selected as AsistenciaTable[];
    selected.forEach(t =>{
      this.dsCtrl.updateAvanceAsistencia('asistencia', 'autorizado', t.asistenciaId);
      console.log(t.compNum);

    })
    setTimeout(()=>{
      this.fetchSolicitudes();
    },1000)

  }


}

