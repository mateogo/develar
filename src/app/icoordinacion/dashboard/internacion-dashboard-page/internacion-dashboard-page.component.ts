import { Component, OnInit } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { Person, personModel } from "../../../entities/person/person";

import {
  SolInternacionBrowse,
  SolicitudInternacion,
  SolInternacionTable,
} from "../../../salud/internacion/internacion.model";

import { InternacionService } from "../../../salud/internacion/internacion.service";
import { InternacionHelper } from "../../../salud/internacion/internacion.helper";

import { devutils } from "../../../develar-commons/utils";

const SEGUIMIENTO = "SEGUIMIENTO";
const SEARCH = "search";
const EXPORT = "export";

@Component({
  selector: "internacion-dashboard-page",
  templateUrl: "./internacion-dashboard-page.component.html",
  styleUrls: ["./internacion-dashboard-page.component.scss"],
})
export class InternacionDashboardPageComponent implements OnInit {
  public query: SolInternacionBrowse;

  public data$ = new BehaviorSubject<any>({});

  public showData: boolean = false;

  constructor(
    private dsCtrl: InternacionService,
  ) {}

  ngOnInit(): void {
    this.query = new SolInternacionBrowse();
  }

  refreshSelection(query: SolInternacionBrowse): void {
    console.log('internacion dasboard page query(%o)', query)

    this.query = InternacionHelper.cleanQueryToken(query, false);
    this.data$.next(this.query);

    this.showData = false;

    console.log("Refresh Selection: listo para buscar");

    if (query.searchAction === SEARCH) {
      this.dsCtrl.fetchInternacionesByQuery(this.query).subscribe((list) => {
        if (list && list.length) {
          console.log("(%s) resultados de búsqueda: (%o)", list.length, list);
          this.data$.next(list);          
          this.initTableData(list);
        } else {
          console.log("Sin Resultados");
        }
      });
    } else if (query.searchAction === EXPORT) {
      //TODO: Exportar datos a Excel
      console.log("TODO: Exportar datos a Excel");
    }
  }

  private initTableData(list: SolicitudInternacion[]) {
    this.dsCtrl.updateTableData();
    this.showData = true;
  }
  
  tableAction(action) { 
    // this.showEditor = false;
    console.log("tableAction(%s)", action);
    let selection = this.dsCtrl.selectionModel;
    let selected = selection.selected as SolInternacionTable[];

    if (action === "editar") {
      let eventToEdit = selected && selected.length && selected[0];

      if (eventToEdit) {
        // this.editData(eventToEdit.asistenciaId)
      }
    }
  }
}
