import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  moduleId: module.id,
  selector: 'page-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['checkbox.component.scss']
})
export class PageCheckboxComponent implements OnInit {
  pageTitle: string = 'Checkbox';
  checked: boolean = false;
  indeterminate: boolean = false;
  align: string = 'start';
  disabled:boolean = false;

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}