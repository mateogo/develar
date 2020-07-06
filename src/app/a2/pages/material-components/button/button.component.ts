import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  selector: 'page-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class PageButtonComponent implements OnInit {
  pageTitle: string = 'Buttons';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}