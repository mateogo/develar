import { Component, OnInit, Input } from '@angular/core';
import {WorkLoad, AsistenciaFollowUp, UserWorkload} from '../workload-helper';

@Component({
  selector: 'workload-byuser-table',
  templateUrl: './workload-byuser-table.component.html',
  styleUrls: ['./workload-byuser-table.component.scss']
})
export class WorkloadByuserTableComponent implements OnInit {
  @Input() usertable: Array<UserWorkload> = []
  public showTable = false;

  constructor() { }

  ngOnInit(): void {
    this.showTable = true;
  }

}
