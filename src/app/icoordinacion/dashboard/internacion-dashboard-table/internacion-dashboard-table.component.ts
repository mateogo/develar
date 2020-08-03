import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";
import { MatCheckboxChange } from "@angular/material/checkbox";

import { BehaviorSubject, Observable, merge } from "rxjs";
import { map } from "rxjs/operators";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { GenericDialogComponent } from "../../../develar-commons/generic-dialog/generic-dialog.component";

import { SaludController } from "../../../salud/salud.controller";

import {
  SolicitudInternacion,
  SolInternacionTable,
} from "../../../salud/internacion/internacion.model";

import { InternacionHelper } from "../../../salud/internacion/internacion.helper";
import { InternacionService } from "../../../salud/internacion/internacion.service";

/**
 * @displayedColumns
    asistenciaId: string;
    compName:    string;
    compNum:     string;
    personId:    string;
    personSlug:  string;
    fecomp_tsa:  number;
    fecomp_txa:  string;
    action:      string;
    slug:        string;
    description: string;
    sector:      string;
    estado:      string;
    avance:      string;
    ts_alta:     number;
 */

const removeRelation = {
  width: "330px",
  height: "700px",
  hasBackdrop: true,
  backdropClass: "yellow-backdrop",
  data: {
    itemplate: "",
    caption: "Seleccione columnas...",
    title: "Confirme la acción",
    body: "Se dará de baja la relación seleccionada en esta ficha",
    accept: {
      action: "accept",
      label: "Aceptar",
    },
    cancel: {
      action: "cancel",
      label: "Cancelar",
    },
  },
};

/**
 * @title Internacion Dashboard Table Component
 */

@Component({
  selector: "internacion-dashboard-table",
  templateUrl: "./internacion-dashboard-table.component.html",
  styleUrls: ["./internacion-dashboard-table.component.scss"],
})
export class InternacionDashboardTableComponent implements OnInit {
  @Input()
  public displayedColumns = [
    "select",
    "compNum",
    "avance",
    "prioridad",
    "personSlug",
    "faudit_alta",
    "covid",
    "locacion",
    "osocial",
  ];
  @Input()
  isColSelectionAllowed = true;
  @Output()
  private actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  private table_columns = [
    "select",
    "_id",
    "estado",
    "queue"
  ];

  private table_columns_sel = {
    "select": false,
    "_id": false, 
    "estado": false,
    "queue": false
  };

  // private table_columns = [
  //   "select",
  //   "asistenciaId",
  //   "compName",
  //   "compNum",
  //   "avance",
  //   "prioridad",
  //   "personId",
  //   "ndoc",
  //   "personSlug",
  //   "telefono",
  //   "edad",
  //   "qcontactos",
  //   "asignadoSlug",
  //   "fup_fe_inicio",
  //   "faudit_alta",
  //   "faudit_um",
  //   "fecomp_tsa",
  //   "fecomp_txa",
  //   "covidAcutalSate",
  //   "covidSintoma",
  //   "covidAvance",
  //   "covid",
  //   "action",
  //   "covidTxt",
  //   "reportadoPor",
  //   "fe_reportado",
  //   "lab_laboratorio",
  //   "lab_fe_toma",
  //   "lab_estado",
  //   "slug",
  //   "locacion",
  //   "osocial",
  //   "description",
  //   "sector",
  //   "estado",
  //   "ts_alta",
  // ];

  // private table_columns_sel = {
  //   "select": false,
  //   "compName": false,
  //   "compNum": false,
  //   "personSlug": false,
  //   "fecomp_tsa": false,
  //   "fecomp_txa": false,
  //   "action": false,
  //   "qcontactos": false,
  //   "asignadoSlug": false,
  //   "fup_fe_inicio": false,
  //   "locacion": false,
  //   "osocial": false,
  //   "covid": false,
  //   "slug": false,
  //   "description": false,
  //   "sector": false,
  //   "estado": false,
  //   "avance": false,
  //   "prioridad": false,
  //   "ts_alta": false,
  // };

  public itemsLength: number = 0;
  private dataRecordsSource: BehaviorSubject<SolInternacionTable[]>;
  public selectedAction: string = "no_definido";
  public actionList: Array<any> = [];
  public dataSource: DataSource<any>;
  public selection = new SelectionModel<SolInternacionTable>(true, []);

  constructor(
    private dsCtrl: InternacionService,
    public dialogService: MatDialog,
  ) {
    // this.displayedColumns = LABORATORIO;
    this.dataRecordsSource = this.dsCtrl.internacionesDataSource;
    console.log('Arrancando el componente Table...');
    console.log(this.dataRecordsSource)
  }

  ngOnInit() {
    this.dataSource = new TableDataSource(
      this.dataRecordsSource,
      this.paginator,
      this.sort,
    );

    this.dsCtrl.selectionModel = this.selection;
    this.actionList = InternacionHelper.getOptionlist("tableactions");

    this.displayedColumns.forEach((elem) => {
      this.table_columns_sel[elem] = true;
    });

    this.dataRecordsSource.subscribe((token) => {
      this.itemsLength = token && token.length;
    });
  }

  // ngOnChanges() {

  // }

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
      if (this.table_columns_sel[col]) this.displayedColumns.push(col);
    });
  }

  openModalDialog(templ) {
    removeRelation.data.itemplate = templ;
    this.openDialog(removeRelation).subscribe((result) => {
      if (result === "accept") {
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
