import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CensoIndustriasTable } from '../censo.model';
import { CensoIndustrialService } from '../censo-industrial.service';


class CensosIndustriasDataSource extends DataSource<CensoIndustriasTable> {
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

        console.log('censo industrias dsdata --> %o', data);

        this._paginator.length = data.length;
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        return data.splice(startIndex, this._paginator.pageSize);
      })
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  private _getSortedData(): CensoIndustriasTable[] {
    const data = this.data$.value.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'fecomp':
          [propertyA, propertyB] = [a.fecomp_tsa, b.fecomp_tsa];
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


@Component({
  selector: 'app-censo-industrial-table',
  templateUrl: './censo-industrial-table.component.html',
  styleUrls: ['./censo-industrial-table.component.scss']
})
export class CensoIndustrialTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = [
    'select',
    'fecomp_txa',
    'empresa',
    'avance',
    'rowactions',
  ];


  public selection = new SelectionModel<CensoIndustriasTable>(true, []);
  public dataSource: CensosIndustriasDataSource;
  private dataRecordsSource: BehaviorSubject<CensoIndustriasTable[]> = new BehaviorSubject<CensoIndustriasTable[]>([]);


  constructor(
    private censoService: CensoIndustrialService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataRecordsSource = this.censoService.dataRecordsSource;
  }

  ngOnInit(): void {
    this.dataSource = new CensosIndustriasDataSource(
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

  public editItem(item: CensoIndustriasTable) {
    this.router.navigate(['/mab/empresas/gestion/censo2021/', item._id]);
  }
}
