import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  moduleId: module.id,
  selector: 'page-a2-card',
  templateUrl: 'a2-card.component.html',
  styleUrls: ['a2-card.component.scss']
})
export class PageA2CardComponent implements OnInit {
  pageTitle: string = 'Card';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}