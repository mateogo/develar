import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { devutils }from '../../../../develar-commons/utils';
import {WorkloadHelper, WorkLoad, AsistenciaFollowUp, UserWorkload, WorkPlanToken, EventEmitted} from '../workload-helper';

const UPDATE = 'update';
const CANCEL = 'cancel';

@Component({
  selector: 'workload-zmodal-byuser',
  templateUrl: './workload-zmodal-byuser.component.html',
  styleUrls: ['./workload-zmodal-byuser.component.scss']
})
export class WorkloadZmodalByuserComponent implements OnInit {
  public displayAs = '';
  public showData= false;

  public user: UserWorkload;
  public asistencias: AsistenciaFollowUp[] = [];
  private result: EventEmitted;

  public actualState = [];
  public actualStateTxt = '';
  public workplan: Array<WorkPlanToken> = [];

  constructor(
        public dialogRef: MatDialogRef<WorkloadZmodalByuserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    console.log('Iaujuuuuu [%s]', this.data && this.data.asistencias.length);
    this.user = this.data.user;
    this.asistencias = this.data.asistencias;
    this.workplan = this.data.workplan || [];
    this.buildUserData(this.user);
    this.buildWorkData(this.asistencias);
    this.showData = true;


  }
  /*********
   * helpers
   */
  getRatio(q, t){
    if(t){
      return Math.floor(q/t * 100);

    }else{
      return 0;
    }
  }


  private buildUserData(user: UserWorkload){

  }
  private buildWorkData(asistencias: AsistenciaFollowUp[] ){
    this.actualState = [0, 0, 0, 0, 0, 0, 0, 0 ];
    this.actualState = asistencias.reduce((a, t)=> {
      a[t.actualState] += 1;
      return a;
    }, this.actualState);

    this.actualStateTxt = this.actualState.reduce((tx, val, index, arr)=> {
      let separator = tx ? ' | ' : '';
      if(arr[index]){
        tx +=  `${separator} ${WorkloadHelper.getOptionLabel('actualState', index)}: [${arr[index]}]`
      }
      return tx;

    },'')
    return this.actualState;
  }
  getLabel(type, val){
    return WorkloadHelper.getOptionLabel(type, val);
  }

  onCancel(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }

  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }

}
