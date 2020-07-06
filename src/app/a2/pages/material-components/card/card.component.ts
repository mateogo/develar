import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  selector: 'page-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class PageCardComponent implements OnInit {
  pageTitle: string = 'Cards';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}