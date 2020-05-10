import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';

import { ArrayDataSource, CollectionViewer } from '@angular/cdk/collections';

import { BehaviorSubject,  Observable, merge, of }       from 'rxjs';
import { map } from 'rxjs/operators';

import { SaludController } from '../../salud.controller';

import {  Person } from '../../../entities/person/person';

import { 	Asistencia, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia/asistencia.model';

const UPDATE =     'update';
const EVOLUCION =  'evolucion';
const DELETE =     'delete';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE =   'navigate';
const CANCEL =   'cancel';
const CLOSE = 'closepanel';

@Component({
  selector: 'vigilancia-list',
  templateUrl: './vigilancia-list.component.html',
  styleUrls: ['./vigilancia-list.component.scss']
})
export class VigilanciaListComponent implements OnInit {
	@Input() items: Array<Asistencia>;
  @Input() viewList: Array<String> = [];

	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();
  @Output() fetchPerson = new EventEmitter<string>();
  @Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public title = 'Vigilancia epidemiológica';

	public showList = false;

  private currentAvance: string;

  private paginator$: Observable<any>;
  
  private asistenciaList: BehaviorSubject<Asistencia[]>;
  private asistenciaDataSource: ArrayDataSource<Asistencia>;

  public itemsLength: number = 0;

  private colViewer: CollectionViewer;



  constructor(
      private dsCtrl: SaludController,
    ) {
      this.asistenciaList = this.dsCtrl.asistenciaListener;

     }

  ngOnInit() {

  	// if(this.items && this.items.length){
  	// 	//this.showList = true;
  	// }

    //this.colViewer = new Subjec


    this.asistenciaList.subscribe(l => {
      this.itemsLength = l && l.length;
      this.showList = true;
    })


    this.asistenciaDataSource = new AsistenciaDataSource(this.asistenciaList, this.paginator);

    setTimeout(()=> {
      this.asistenciaDataSource.connect().subscribe(list => {

        // this.items = list;
        // console.log('list connected: [%s]', list && list.length)

      })


    }, 1500);




  }

  updateItem(event: UpdateAsistenciaEvent){
        this.emitEvent(event);
  }

  vinculoSelected(personId: string){
    this.fetchPerson.next(personId);
  }

  emitEvent(event:UpdateAsistenciaEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	  });
    } else if(event.action === EVOLUCION){
      this.updateItems.next({
      action: EVOLUCION,
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


}


class AsistenciaDataSource extends ArrayDataSource<Asistencia> {

  constructor(private sourceData: BehaviorSubject<Asistencia[]>,
              private _paginator: MatPaginator){
    super(sourceData);
  }

  connect(): Observable<Asistencia[]> {

    const displayDataChanges = [
      this.sourceData,
      this._paginator.page
    ];

    return merge(...displayDataChanges).pipe(
        map(() => {
          const data = this.sourceData.value.slice()

          const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
          return data.splice(startIndex, this._paginator.pageSize);
        })
     );
  }

  disconnect() {}

}



