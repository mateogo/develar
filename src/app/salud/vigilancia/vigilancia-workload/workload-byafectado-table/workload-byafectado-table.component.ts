import { Component, OnInit, Input } from '@angular/core';
import {WorkLoad, AsistenciaFollowUp, UserWorkload} from '../workload-helper';


@Component({
  selector: 'workload-byafectado-table',
  templateUrl: './workload-byafectado-table.component.html',
  styleUrls: ['./workload-byafectado-table.component.scss']
})
export class WorkloadByafectadoTableComponent implements OnInit {
  @Input() asistencias: Array<AsistenciaFollowUp> = []

  public showTable = false;

  constructor() { }

  ngOnInit(): void {
    this.showTable = true;
  }

}
