import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../develar-commons/shared-service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TurnoQuery } from '../turno.model';
import { TurnosService } from '../turnos.service';


@Component({
  selector: 'app-turnos',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.scss'],
})
export class TurnoComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public showData = false;

  public pageTitle = 'Gestión de turnos';


  constructor(
    private _shared: SharedService,
    private _turnoService: TurnosService,
  ) {
    this._shared.emitChange(this.pageTitle);
  }

  ngOnInit(): void { }


  public fetchTurno(query: TurnoQuery): void {
    this._turnoService.fetchTurnosByQuery(query).subscribe(turnosList => {
      if (turnosList && turnosList.length > 0) {
        this._turnoService.updateTableData();
        this.showData = true;
      } else {
        this.showData = false;
      }
    });
  }
}
