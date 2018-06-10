import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared-service';
import { NavbarComponent } from '../../navbar/default/navbar.component';

@Component({
  moduleId: module.id,
  selector: 'presentacion-layout',
  templateUrl: 'presentacion.component.html',
  styleUrls: ['presentacion.component.scss']
})
export class PresentacionLayoutComponent implements OnInit {
  pageTitle: any;

  constructor( private _sharedService: SharedService ) {
    _sharedService.changeEmitted$.subscribe(
      title => {
        this.pageTitle = title;
      }
    );
  }

  ngOnInit() { }

}