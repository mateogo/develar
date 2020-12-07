import {
  CollectionViewer,
  DataSource,
  SelectionModel,
} from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TurnoTable, Turno } from '../turno.model';
import { TurnosService } from '../turnos.service';
import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';

class TurnosDataSource extends DataSource<TurnoTable> {
  private data$: BehaviorSubject<TurnoTable[]>;

  constructor(
    recordsSource$: BehaviorSubject<TurnoTable[]>,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.data$ = recordsSource$;
  }

  connect(collectionViewer: CollectionViewer): Observable<TurnoTable[]> {
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

  disconnect(collectionViewer: CollectionViewer): void {}

  private _getSortedData(): TurnoTable[] {
    const data = this.data$.value.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'ndoc':
          [propertyA, propertyB] = [a.ndoc, b.ndoc];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}

const deleteTurnoDialog = {
  width: '330px',
  height: '260px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    title: 'Confirme la acción',
    body: '¿Confirma eliminación del turno?',
    accept: {
      action: 'accept',
      label: 'Aceptar',
    },
    cancel: {
      action: 'cancel',
      label: 'Cancelar',
    },
  },
};

@Component({
  selector: "turnos-browse-table",
  templateUrl: './turno-browse-table.component.html',
  styleUrls: ['./turno-browse-table.component.scss'],
})
export class TurnoBrowseTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = [
    'select',
    'ndoc',
    'displayName',
    'txFechaHora',
    'sede',
    'tipoConsulta',
    'detalle',
    'estado',
    'avance',
    'rowactions',
  ];

  public selection = new SelectionModel<TurnoTable>(true, []);
  public dataSource: TurnosDataSource;
  private dataRecordsSource: BehaviorSubject<
    TurnoTable[]
  > = new BehaviorSubject<TurnoTable[]>([]);

  constructor(
    private turnoService: TurnosService,
    private dialogService: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataRecordsSource = this.turnoService.dataRecordsSource;
  }

  ngOnInit(): void {
    this.dataSource = new TurnosDataSource(
      this.dataRecordsSource,
      this.paginator,
      this.sort
    );
  }

  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataRecordsSource.value.length;
    return numSelected === numRows;
  }

  public masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataRecordsSource.value.forEach((row) =>
          this.selection.select(row)
        );
  }

  private openDialog(config): Observable<any> {
    const dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed();
  }

  public editItem(turno: Turno): void {
    this.router.navigate(['editar', turno._id], { relativeTo: this.route });
  }

  public deleteItem(turno: Turno): void {
    this.openDialog(deleteTurnoDialog).subscribe((result) => {
      if (result === 'accept') {
        this.turnoService.delete(turno._id).then((isDeleted) => {
          this.dataRecordsSource.value.map((item) => {
            if (item._id === turno._id) {
              item.estado = 'Cancelado';
            }
          });
        });
      }
    });
  }
}
