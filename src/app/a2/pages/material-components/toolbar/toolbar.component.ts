import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  moduleId: module.id,
  selector: 'page-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss']
})
export class PageToolbarComponent {
  pageTitle: string = 'Toolbar';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}