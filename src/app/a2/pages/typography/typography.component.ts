import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../develar-commons/shared-service';

@Component({
  selector: 'page-typography',
  templateUrl: './typography.component.html'
})
export class PageTypographyComponent implements OnInit {
  pageTitle: string = 'Typography';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}