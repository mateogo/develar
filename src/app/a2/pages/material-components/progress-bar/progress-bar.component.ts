import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  moduleId: module.id,
  selector: 'page-progress-bar',
  templateUrl: 'progress-bar.component.html',
  styleUrls: ['progress-bar.component.scss']
})
export class PageProgressBarComponent implements OnInit {
  pageTitle: string = 'Progress bar';
  sidebar: boolean;
  navbar: boolean;
  determinateProgressValue: number = 50;
  bufferProgressValue: number = 30;
  bufferBufferValue: number = 40;

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  stepDeterminateProgressVal(val: number) {
    this.determinateProgressValue += val;
  }

  stepBufferProgressVal(val: number) {
    this.bufferProgressValue += val;
  }

  stepBufferBufferVal(val: number) {
    this.bufferBufferValue += val;
  }

  ngOnInit() {}
}