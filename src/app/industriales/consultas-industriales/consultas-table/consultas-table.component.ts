import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';
import { ConsultaHelper } from '../../../entities/consultas/consulta.helper';
import { Consulta, ConsultaTable } from '../../../entities/consultas/consulta.model';
import { ConsultasService } from '../../../entities/consultas/consultas.service';
import { PasesFromConsultaComponent } from '../../../entities/consultas/pases-from-consulta/pases-from-consulta.component';
import { UserService } from '../../../entities/user/user.service';


const ESTADO_END = 'cerrado';
@Component({
  selector: 'consultas-table',
  templateUrl: './consultas-table.component.html',
  styleUrls: ['./consultas-table.component.scss']
})
export class ConsultasTableComponent implements OnInit {

  @Output() cancelEvent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = [
    //'select',
    'tipo',
    'txFecha',
    'descripcion',
    'ejecucion',
    'rowactions'
  ];
  public selection = new SelectionModel<ConsultaTable>(true, []);
  public dataSource: ConsultasDataSource;
  private dataRecordsSource: BehaviorSubject<ConsultaTable[]> = new BehaviorSubject<ConsultaTable[]>([]);
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _service: ConsultasService,
    private _dialogService: MatDialog,
    private _userService: UserService,
  ) {
  }

  ngOnInit(): void {
    
    this.dataRecordsSource = this._service.dataRecordsSource;
    this.dataSource = new ConsultasDataSource(this.dataRecordsSource, this.paginator, this.sort);
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

  editItem(consulta: Consulta): void {
    this._router.navigate(['editar', consulta._id], { relativeTo: this._route });
  }



  public deleteItem(consulta: ConsultaTable): void {
    this.openDialog(deleteConsultaDialog).subscribe(result => {
      if (result === 'accept') {
        this._service.delete(consulta._id).then(isDeleted => {
          const pase = ConsultaHelper.generarPaseBaja(this._userService.currentUser);
          
          let consultaObj = consulta.consulta;
          pase.sector = consulta.sector;
          consultaObj.estado = pase.estado;
          consultaObj.ejecucion = pase.ejecucion;
          consultaObj.pases.push(pase);
          consultaObj.isActive = false;
          
          this._service.edit(consulta._id, consultaObj).then(success => {

            this.dataRecordsSource.value.map(item => {
              if (item._id === consulta._id) {
                item.estado = ESTADO_END;
                item.isActive = false;
                item.ejecucion = ConsultaHelper.getOptionLabel('ejecucion','anulado');
              }
            });
          });
        });
      }
    });
  }

  private openDialog(config): Observable<any> {
    const dialogRef = this._dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed();
  }


  showPases(consulta : Consulta) {
    const refDialog = this._dialogService.open(PasesFromConsultaComponent, {
      data : consulta._id
    })
  }


}



const deleteConsultaDialog = {
  width: '330px',
  height: '260px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    title: 'Confirme la acción',
    body: '¿Confirma eliminación de la consulta?',
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





class ConsultasDataSource extends DataSource<ConsultaTable> {
  private data$: BehaviorSubject<ConsultaTable[]>;

  constructor(
    recordsSource$: BehaviorSubject<ConsultaTable[]>,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.data$ = recordsSource$;
  }

  connect(collectionViewer: CollectionViewer): Observable<ConsultaTable[]> {
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

  private _getSortedData(): ConsultaTable[] {
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
