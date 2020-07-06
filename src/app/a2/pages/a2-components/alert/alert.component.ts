import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  selector: 'page-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class PageAlertComponent implements OnInit {
  pageTitle: string = 'Alert';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}