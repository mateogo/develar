import { Component, OnInit, Input } from '@angular/core';
import { SharedService }   from '../../../develar-commons/shared-service';

@Component({
  selector: 'pba-layout',
  templateUrl: './pba-layout.component.html',
  styleUrls: ['./pba-layout.component.scss']
})
export class PbaLayoutComponent implements OnInit {
  pageTitle: any;
  @Input() openedSidebar: boolean = false;

  constructor( private _sharedService: SharedService ) {
    _sharedService.changeEmitted$.subscribe(
      title => {
        this.pageTitle = title;
      }
    );

  }

  ngOnInit() { }

}