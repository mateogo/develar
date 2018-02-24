import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  selector: 'page-bootstrap-tables',
  templateUrl: './bootstrap-tables.component.html',
  styleUrls: ['./bootstrap-tables.component.scss']
})
export class PageBootstrapTablesComponent implements OnInit {
  pageTitle: string = 'Bootstrap table';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}
