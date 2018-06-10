import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  moduleId: module.id,
  selector: 'page-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss']
})
export class PageMenuComponent implements OnInit {
  pageTitle: string = 'Menu';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}