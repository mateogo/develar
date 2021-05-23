import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {WorkLoad, AsistenciaFollowUp, UserWorkload, EventEmitted} from '../workload-helper';
const ACTION = 'user:detail';
const FILTER = 'asis:filter';
const TYPE = 'user:workload';
@Component({
  selector: 'workload-byuser-table',
  templateUrl: './workload-byuser-table.component.html',
  styleUrls: ['./workload-byuser-table.component.scss']
})
export class WorkloadByuserTableComponent implements OnInit {
  @Input() usertable: Array<UserWorkload> = []
  @Output() useremit = new EventEmitter<EventEmitted>(null);
  public showTable = false;

  constructor() { }

  ngOnInit(): void {
    this.showTable = true;
  }
  
  viewUserDetails(e, user){
    e.preventDefault();
    e.stopPropagation();
    console.log('Click: [%s]',user.asignadoId );
    this.emitEvent(user, ACTION)

  }

  filterAsistencias(e, user){
    e.preventDefault();
    e.stopPropagation();
    console.log('Click: [%s]',user.asignadoId );
    this.emitEvent(user, FILTER)

  }

  private emitEvent(token: UserWorkload, action:string){
    this.useremit.next({
      action: action,
      type: TYPE,
      token: token
    })
  }

}
