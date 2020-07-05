import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Observable,BehaviorSubject } from 'rxjs';

import { SaludController } from '../../../salud.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia,
          AsistenciaDataSource,
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../../asistencia/asistencia.model';

const UPDATE =     'update';
const EVOLUCION =  'evolucion';
const DELETE =     'delete';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE =   'navigate';
const PANEL_TYPE = 'solcovid'; // [solcovid|offline]

@Component({
  selector: 'solcovid-list',
  templateUrl: './solcovid-list.component.html',
  styleUrls: ['./solcovid-list.component.scss']
})
export class SolcovidListComponent implements OnInit {
	@Input() items: Array<Asistencia>;
  @Input() panelType = PANEL_TYPE;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();
  @Output() updateAsistencia = new EventEmitter<UpdateAsistenciaEvent>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public title = 'Solicitudes de ASISTENCIA';

	public showONE = false;
  public showTWO = false;
  public itemsLength: number = 0;

  private asistenciaList: BehaviorSubject<Asistencia[]>;
  private asistenciaDataSource: ArrayDataSource<Asistencia>;

  constructor(
      private dsCtrl: SaludController,
    ) { 
      this.asistenciaList = this.dsCtrl.asistenciaListener;


  }

  ngOnInit() {

    this.asistenciaList.subscribe(l => {
      this.itemsLength = l && l.length;

      if(this.itemsLength){
        if(this.panelType === PANEL_TYPE){
          this.showONE = true;

        }else {
          this.showTWO = true;

        }
      }
    })


    this.asistenciaDataSource = new AsistenciaDataSource(this.asistenciaList, this.paginator);

    setTimeout(()=> {
      this.asistenciaDataSource.connect().subscribe(list => {

      })


    }, 1500);






  }

  updateItem(event: UpdateAsistenciaEvent){
        this.emitEvent(event);
  }

  updateToken(event: UpdateAsistenciaEvent){
    this.updateAsistencia.next(event)
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
