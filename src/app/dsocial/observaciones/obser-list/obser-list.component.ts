import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObservacionTable } from '../../../develar-commons/observaciones/observaciones.model';
import { DsocialController } from '../../dsocial.controller';

@Component({
  selector: 'obser-list',
  templateUrl: './obser-list.component.html',
  styleUrls: ['./obser-list.component.scss']
})
export class ObserListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = [
    // 'select',
    'fe_tx',
    'type',
    'entitySlug',
    'observacion',
  ];

  public selection = new SelectionModel<ObservacionTable>(true, []);
  public dataSource: ObservacionesDataSource;

  private dataRecordsSource: BehaviorSubject<
    ObservacionTable[]
  >;
  public selectedAntecedentesFromMigrante$: BehaviorSubject<any[]>;
  public dataToShow$: BehaviorSubject<any[]>;
  private modo: string;
  constructor(
              private _service: DsocialController,
              private _router: Router,
  ) {
    this.dataRecordsSource = this._service.observacionesDataSource;
  }

  ngOnInit(): void {

    this.dataSource = new ObservacionesDataSource(
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

  public goToDetailedView(id: string): void {
    if(this.modo) {
      this._router.navigate(['/web','fichatecnica','vista-detallada',id]);
    } else {
      this._router.navigate(['/unidad-descripcion','vista-detallada',id]);
    }
  }

}

class ObservacionesDataSource extends DataSource<ObservacionTable> {
  private data$: BehaviorSubject<ObservacionTable[]>;

  constructor(
    recordsSource$: BehaviorSubject<ObservacionTable[]>,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.data$ = recordsSource$;
  }

  connect(): Observable<ObservacionTable[]> {
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

  disconnect(): void { }

  private _getSortedData(): ObservacionTable[] {
    const data = this.data$.value.slice();
    if (!this._sort || !this._sort?.active || this._sort?.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort?.active) {
        case 'fe_ts': {
          if (a.fe_ts && b.fe_ts) {
            [propertyA, propertyB] = [a.fe_ts, b.fe_ts];
          }
          break;
        }

      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (
        (valueA < valueB ? -1 : 1) * (this._sort?.direction === 'asc' ? 1 : -1)
      );
    });
  }
}

