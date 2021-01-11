import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ArrayDataSource } from '@angular/cdk/collections';

import { BehaviorSubject }       from 'rxjs';

import { SaludController } from '../../../salud/salud.controller';

import { 	Asistencia, AsistenciaDataSource } from '../../../salud/asistencia/asistencia.model';


@Component({
  selector: 'vigil-seguimiento-panel',
  templateUrl: './vigil-seguimiento-panel.component.html',
  styleUrls: ['./vigil-seguimiento-panel.component.scss']
})
export class VigilSeguimientoPanelComponent implements OnInit {
  @Input() viewList: Array<String> = [];
  @Output() fetchPerson = new EventEmitter<string>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public title = 'Vigilancia epidemiológica';

	public showList = false;

  private asistenciaList: BehaviorSubject<Asistencia[]>;
  public asistenciaDataSource: ArrayDataSource<Asistencia>;

  public itemsLength: number = 0;


  constructor(
      private dsCtrl: SaludController,
    ) {
      this.asistenciaList = this.dsCtrl.asistenciaListener;

     }

  ngOnInit() {
    this.asistenciaList.subscribe(list => {
      this.itemsLength = list && list.length;
      this.showList = true;
    })

    this.asistenciaDataSource = new AsistenciaDataSource(this.asistenciaList, this.paginator);

    setTimeout(()=> {
      this.asistenciaDataSource.connect().subscribe(list => {
      })
    }, 1500);
  }

  vinculoSelected(personId: string){
    this.fetchPerson.next(personId);
  }


}



