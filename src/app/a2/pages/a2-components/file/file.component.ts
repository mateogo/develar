import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  moduleId: module.id,
  selector: 'page-file',
  templateUrl: 'file.component.html',
  styleUrls: ['file.component.scss']
})
export class PageFileComponent implements OnInit {
  pageTitle: string = 'File';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}