import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  moduleId: module.id,
  selector: 'page-slider',
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.scss']
})
export class PageSliderComponent implements OnInit {
  pageTitle: string = 'Slider';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}