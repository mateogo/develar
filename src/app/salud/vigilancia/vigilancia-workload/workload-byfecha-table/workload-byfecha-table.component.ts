import { Component, OnInit, Input } from '@angular/core';
import {WorkLoad, AsistenciaFollowUp, UserWorkload} from '../workload-helper';


@Component({
  selector: 'workload-byfecha-table',
  templateUrl: './workload-byfecha-table.component.html',
  styleUrls: ['./workload-byfecha-table.component.scss']
})
export class WorkloadByfechaTableComponent implements OnInit {
  @Input() workLoad: any;
  @Input() tsList: Array<number> = [];
  @Input() datesList: Array<{fets:number, fetx:string}> = [];

  public work_rows = ["casos", "telef", "inves", "covid", "altas",  "obito",  "sospe", "otros"]
  public work_labels = ["Casos", "c/Teléfono", "c/Investigación", "COVID+", "ALTA", "ÓBITO", "SOSPECHOSO", "OTROS"]

  public showTable = false;

  constructor() { }

  ngOnInit(): void {
    console.dir(this.workLoad)
    this.showTable = true;
  }

}
