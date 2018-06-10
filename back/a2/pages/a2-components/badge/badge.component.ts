import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  moduleId: module.id,
  selector: 'page-badge',
  templateUrl: 'badge.component.html',
  styleUrls: ['badge.component.scss']
})
export class PageBadgeComponent implements OnInit {
  pageTitle: string = 'Badge';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}