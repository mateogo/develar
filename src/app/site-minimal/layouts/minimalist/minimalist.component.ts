import { Component, OnInit, Input } from '@angular/core';
import { SharedService }   from '../../../develar-commons/shared-service';

@Component({
  moduleId: module.id,
  selector:    'minimalist',
  templateUrl: 'minimalist.component.html',
  styleUrls:  ['minimalist.component.scss']
})
export class MinimalistLayoutComponent implements OnInit {
  pageTitle: any;
  navbarTmpl = 'default-navbar';

  get defaultNavbar(){
    return this.navbarTmpl === "default-navbar";
  }

  get lasargenNavbar(){
    return this.navbarTmpl === "lasargentinas";
  }

  @Input() openedSidebar: boolean = false;

  constructor( private _sharedService: SharedService ) {
    _sharedService.changeEmitted$.subscribe(
      title => {
        this.pageTitle = title;
      }
    );

    if(_sharedService.gldef.company === "lasargentinas"){
       this.navbarTmpl = 'lasargentinas';
    }


  }

  ngOnInit() { }


}