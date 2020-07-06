import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  selector: 'page-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class PageProgressSpinnerComponent implements OnInit {
  pageTitle: string = 'Progress spinner';
  sidebar: boolean;
  navbar: boolean;
  progressValue: number = 40;

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  step(val: number) {
    this.progressValue += val;
  }

  ngOnInit() {}
}