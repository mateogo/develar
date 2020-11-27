import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'presentacion-layout',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.scss']
})
export class PresentacionLayoutComponent implements OnInit {
  pageTitle: any;
  navbarTmpl = 'nonavbat';
  isHomeView$: Observable<boolean>;

  get defaultNavbar(){
    return this.navbarTmpl === "default-navbar";
  }

  get userWebNavbar(){
    return this.navbarTmpl === "webUser-navbar";
  }

  get noNavbar(){
    return this.navbarTmpl === "nonavbat";
  }

  constructor( private _sharedService: SharedService ) {
    
    _sharedService.changeEmitted$.subscribe(
      title => {
        this.pageTitle = title;
      }
    );

    this.isHomeView$ = _sharedService.isHomeViewEmitted$;

    if(_sharedService.gldef.mainmenutpl){

       this.navbarTmpl = _sharedService.gldef.mainmenutpl;
    }
  }

  ngOnInit() { }

}