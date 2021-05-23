import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { devutils }from '../../../../develar-commons/utils';
import {WorkLoad, AsistenciaFollowUp, UserWorkload, EventEmitted} from '../workload-helper';

const UPDATE = 'update';
const CANCEL = 'cancel';

@Component({
  selector: 'workload-zmodal-byuser',
  templateUrl: './workload-zmodal-byuser.component.html',
  styleUrls: ['./workload-zmodal-byuser.component.scss']
})
export class WorkloadZmodalByuserComponent implements OnInit {
  public displayAs = '';

  private result: EventEmitted;

  constructor(
        public dialogRef: MatDialogRef<WorkloadZmodalByuserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    console.log('Iaujuuuuu [%s]', this.data && this.data.asistencias.length);
  }

  onCancel(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }

  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }

}
