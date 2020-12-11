import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmpresasController } from '../../../empresas/empresas.controller';
import { PersonTable } from '../../../entities/person/person';
import { UserService } from '../../../entities/user/user.service';
import { Router } from '@angular/router';

class IndustriasVinculadasDataSource extends DataSource<PersonTable> {
  private data$: BehaviorSubject<PersonTable[]>;

  constructor(
    recordsSource$: BehaviorSubject<PersonTable[]>,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.data$ = recordsSource$;
  }

  connect(collectionViewer: CollectionViewer): Observable<PersonTable[]> {
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

  private _getSortedData(): PersonTable[] {
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


@Component({
  selector: 'app-vinculos-browse-table',
  templateUrl: './vinculos-browse-table.component.html',
  styleUrls: ['./vinculos-browse-table.component.scss']
})
export class VinculosBrowseTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = [
    // 'select',
    'tdoc',
    'ndoc',
    'displayName',
    // 'N° de integrantes',
    'rowactions',
  ];

  public selection = new SelectionModel<PersonTable>(true, []);
  public dataSource: IndustriasVinculadasDataSource;
  private dataRecordsSource: BehaviorSubject<PersonTable[]> = new BehaviorSubject<PersonTable[]>([]);


  constructor(
    private empresaController: EmpresasController,
    private userService: UserService,
    private router: Router
  ) {
    this.dataRecordsSource = this.empresaController.dataRecordsSource;
   }

  ngOnInit(): void {
    this.dataSource = new IndustriasVinculadasDataSource(
      this.dataRecordsSource,
      this.paginator,
      this.sort
    );

    this.empresaController.fetchIndustriaFromUser(this.userService.currentUser).subscribe(items => {
      console.log('fetchIndustriaFromuser subscribe --> items %o', items);
      this.empresaController.updateTableData();
    });
  }

  public editItem(item): void {
    this.router.navigate(['/dashboard/industrias/editar/', item._id]);
  }

}
