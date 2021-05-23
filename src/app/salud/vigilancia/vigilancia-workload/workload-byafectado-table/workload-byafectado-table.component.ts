import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {WorkloadHelper, WorkLoad, AsistenciaFollowUp, UserWorkload} from '../workload-helper';


@Component({
  selector: 'workload-byafectado-table',
  templateUrl: './workload-byafectado-table.component.html',
  styleUrls: ['./workload-byafectado-table.component.scss']
})
export class WorkloadByafectadoTableComponent implements OnInit {
  @Input() asistencias: Array<AsistenciaFollowUp> = []
  @Input() asistencia$: BehaviorSubject<AsistenciaFollowUp[]>;
  @Input() user$: BehaviorSubject<UserWorkload>;
  public user: UserWorkload;
  public showTable = false;
  public casos = 0;

  constructor() { }

  ngOnInit(): void {
    this.showTable = true;
    if(this.user$){
      this.user$.subscribe(user => {
        this.user = user;
      })
    }
    if(this.asistencia$){
      this.asistencia$.subscribe(tokens => {
        if(tokens && tokens.length){
          this.casos = tokens.length;
        }
      })
    }
  }
  getLabel(type: string, value: string){
    return WorkloadHelper.getOptionLabel(type, value);
  }

}
