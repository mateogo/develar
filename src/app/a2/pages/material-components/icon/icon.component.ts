import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  moduleId: module.id,
  selector: 'page-icon',
  templateUrl: 'icon.component.html',
  styleUrls: ['icon.component.scss']
})
export class PageIconComponent implements OnInit {
  pageTitle: string = 'Icon';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}