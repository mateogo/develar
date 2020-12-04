import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';

import { EmpresasController } from '../../empresas.controller';
import { CensoIndustriasController } from '../../censo.controller';
import { CensoIndustriasService, UpdateListEvent } from '../../censo-service';

import { CensoIndustrias, CensoIndustriasTable, EstadoCenso, Empresa, CensoData } from '../../censo.model';

import { Person } from '../../../entities/person/person';

import { UserService } from '../../../entities/user/user.service';

const ESTADO_END = 'cerrado';

@Component({
  selector: 'app-censo-table',
  templateUrl: './censo-table.component.html',
  styleUrls: ['./censo-table.component.scss']
})
export class CensoTableComponent implements OnInit {

  @Output() cancelEvent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = [
    //'select',
    'compNum',
    'fecomp',
    'slug',
    'navance',
    'rowactions'
  ];
  public selection = new SelectionModel<CensoIndustriasTable>(true, []);
  public dataSource: CensoIndustriasDataSource;
  private dataRecordsSource: BehaviorSubject<CensoIndustriasTable[]> = new BehaviorSubject<CensoIndustriasTable[]>([]);

  constructor(
      private _router: Router,
      private _route: ActivatedRoute,
      private _censoCtrl: CensoIndustriasController,
      private _dialogService: MatDialog,
      private _userService: UserService,
    ) {
  }

  ngOnInit(): void {
    this.dataRecordsSource = this._censoCtrl.dataRecordsSource;
    this.dataSource = new CensoIndustriasDataSource(this.dataRecordsSource, this.paginator, this.sort);
  }

  
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataRecordsSource.value.length;
    return numSelected === numRows;
  }

 public masterToggle(): void {
   this.isAllSelected() ?
     this.selection.clear() :
     this.dataRecordsSource.value.forEach(row => this.selection.select(row));
 }

  editItem(censo: CensoIndustrias): void {
    this._router.navigate(['/mab/empresas/gestion/censo2020'], { relativeTo: this._route });
  }

 // http://develar-local.co:4200/mab/empresas/gestion/censo2020



  // public deleteItem(consulta: CensoIndustriasTable): void {
  //   this.openDialog(deleteConsultaDialog).subscribe(result => {
  //     if (result === 'accept') {
  //       this._censoCtrl.delete(consulta._id).then(isDeleted => {
  //         const pase = CensoIndustriasService.generarPaseBaja(this._userService.currentUser);
          
  //         let consultaObj = consulta.consulta;
  //         pase.sector = consulta.sector;
  //         consultaObj.estado = pase.estado;
  //         consultaObj.ejecucion = pase.ejecucion;
  //         consultaObj.pases.push(pase);
  //         consultaObj.isActive = false;
  //         this._censoCtrl.edit(consulta._id, consultaObj).then(success => {
  //           console.log(success)
  //           this.dataRecordsSource.value.map(item => {
  //             if (item._id === consulta._id) {
  //               item.estado = ESTADO_END;
  //               item.isActive = false;
  //               item.ejecucion = CensoIndustriasService.getOptionLabel('ejecucion','anulado');
  //             }
  //           });
  //         });
  //       });
  //     }
  //   });
  // }

  private openDialog(config): Observable<any> {
    const dialogRef = this._dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed();
  }



}



const deleteConsultaDialog = {
  width: '330px',
  height: '260px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    title: 'Confirme la acción',
    body: '¿Confirma eliminación de este censo?',
    accept: {
      action: 'accept',
      label: 'Aceptar'
    },
    cancel: {
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};





class CensoIndustriasDataSource extends DataSource<CensoIndustriasTable> {
  private data$: BehaviorSubject<CensoIndustriasTable[]>;

  constructor(
    recordsSource$: BehaviorSubject<CensoIndustriasTable[]>,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.data$ = recordsSource$;
  }

  connect(collectionViewer: CollectionViewer): Observable<CensoIndustriasTable[]> {
    const displayDataChanges = [
      this.data$,
      this._paginator.page,
      this._sort.sortChange,
    ];

    return merge(...displayDataChanges).pipe(
      map(() => {
        const data = this._getSortedData();
        this._paginator.length = data.length;
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        return data.splice(startIndex, this._paginator.pageSize);
      })
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {  }

  private _getSortedData(): CensoIndustriasTable[] {
    const data = this.data$.value.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

      return data.sort((a, b) => {
        let propertyA: number | string = '';
        let propertyB: number | string = '';

        switch (this._sort.active) {
          // case 'ndoc':
          //   [propertyA, propertyB] = [a.ndoc, b.ndoc];
          //   break;
        }

        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (
          (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
        );
      });
  }

}

