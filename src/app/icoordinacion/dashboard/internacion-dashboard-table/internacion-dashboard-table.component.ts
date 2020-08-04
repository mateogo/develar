import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { BehaviorSubject, Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';

import {
  SolicitudInternacion,
  SolInternacionTable,
} from '../../../salud/internacion/internacion.model';

import { InternacionHelper } from '../../../salud/internacion/internacion.helper';
import { InternacionService } from '../../../salud/internacion/internacion.service';

const removeRelation = {
  width: '330px',
  height: '700px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    itemplate: '',
    caption: 'Seleccione columnas...',
    title: 'Confirme la acción',
    body: 'Se dará de baja la relación seleccionada en esta ficha',
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

/**
 * @title Internacion Dashboard Table Component
 */

@Component({
  selector: 'internacion-dashboard-table',
  templateUrl: './internacion-dashboard-table.component.html',
  styleUrls: ['./internacion-dashboard-table.component.scss'],
})
export class InternacionDashboardTableComponent implements OnInit {
  @Input() public displayedColumns = [ 'select', 'compNum', 'compName', 'sector', 'avance', 'slug', 'description' ];
  @Input() isColSelectionAllowed = true;
  @Output() private actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private table_columns = [ 'select', 'compNum', 'compName', 'sector', 'avance', 'slug', 'description' ];

  private table_columns_sel = {
    'select': false,
    'compNum': true,
    'compName': false,
    'sector': false,
    'avance': false,
    'slug': false,
    'description': false
  };

  public itemsLength = 0;
  private dataRecordsSource: BehaviorSubject<SolInternacionTable[]>;
  public selectedAction = 'no_definido';
  public actionList: Array<any> = [];
  public dataSource: DataSource<any>;
  public selection = new SelectionModel<SolInternacionTable>(true, []);

  constructor(
    private dsCtrl: InternacionService,
    public dialogService: MatDialog,
  ) {
    this.dataRecordsSource = this.dsCtrl.internacionesDataSource;
  }

  ngOnInit() {
    this.dataSource = new TableDataSource(
      this.dataRecordsSource,
      this.paginator,
      this.sort,
    );

    this.dsCtrl.selectionModel = this.selection;
    this.actionList = InternacionHelper.getOptionlist('tableActions');

    this.displayedColumns.forEach((elem) => {
      this.table_columns_sel[elem] = true;
    });

    this.dataRecordsSource.subscribe((token) => {
      this.itemsLength = token && token.length;
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataRecordsSource.value.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataRecordsSource.value.forEach((row) =>
        this.selection.select(row)
      );
  }

  openEditor(item, col) {
    item.editflds[col] = item.editflds[col] > 1 ? 0 : item.editflds[col] + 1;
    item.total = item.pu * item.qt;
  }

  changeAction(action: MatSelectChange) {
    this.triggerAction(action.value);
    setTimeout(() => {
      action.source.writeValue("no_definido");
    }, 1000);
  }

  triggerAction(action: string) {
    this.actionTriggered.next(action);
    this.selection.clear();
  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed();
  }

  buildColumDef() {
    this.displayedColumns = [];
    this.table_columns.forEach((col) => {
      if (this.table_columns_sel[col]) {
        this.displayedColumns.push(col);
      }
    });
  }

  openModalDialog(templ) {
    removeRelation.data.itemplate = templ;
    this.openDialog(removeRelation).subscribe((result) => {
      if (result === 'accept') {
        this.buildColumDef();
      }
    });
  }

  changeCheckBx(event: MatCheckboxChange, col, cols) {
  }

  getLabel(item: string, arr: Array<any>, prefix: string): string {
    let label = arr.find((x) => x.val === item).label;
    if (item === "no_definido") label = "";
    return prefix ? prefix + label : label;
  }
}

export class TableDataSource extends DataSource<any> {
  constructor(
    private sourceData: BehaviorSubject<SolInternacionTable[]>,
    private _paginator: MatPaginator,
    private _sort: MatSort,
  ) {
    super();
  }

  connect(): Observable<SolInternacionTable[]> {
    const displayDataChanges = [
      this.sourceData,
      this._paginator.page,
      this._sort.sortChange,
    ];

    return merge(...displayDataChanges).pipe(
      map(() => {
        const data = this.getSortedData();
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        return data.splice(startIndex, this._paginator.pageSize);
      }),
    );
  }

  getSortedData(): SolInternacionTable[] {
    const data = this.sourceData.value.slice();
    if (!this._sort.active || this._sort.direction == "") return data;

    return data.sort((a, b) => {
      let propertyA: number | string = "";
      let propertyB: number | string = "";

      switch (this._sort.active) {
        case "sector":
          [propertyA, propertyB] = [a.sector, b.sector];
          break;
        case "compNum":
          [propertyA, propertyB] = [a.asistenciaId, b.asistenciaId];
          break;
        case "action":
          [propertyA, propertyB] = [a.action, b.action];
          break;
        case "prioridad":
          [propertyA, propertyB] = [a.prioridad, b.prioridad];
          break;
        case "slug":
          [propertyA, propertyB] = [a.slug, b.slug];
          break;
        case "fecomp_txa":
          [propertyA, propertyB] = [a.fecomp_tsa, b.fecomp_tsa];
          break;
        case "avance":
          [propertyA, propertyB] = [a.avance, b.avance];
          break;
        case "personSlug":
          [propertyA, propertyB] = [a.personSlug, b.personSlug];
          break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) *
        (this._sort.direction == "asc" ? 1 : -1);
    });
  }

  disconnect() {}
}
