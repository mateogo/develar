import { Component, OnInit, Input } from '@angular/core';
import { SharedService }   from '../../../develar-commons/shared-service';
import { Observable } from 'rxjs';

@Component({
  selector:    'minimalist',
  templateUrl: './minimalist.component.html',
  styleUrls:  ['./minimalist.component.scss']
})
export class MinimalistLayoutComponent implements OnInit {
  pageTitle: any;
  navbarTmpl = 'default-navbar';
  isHomeView$: Observable<boolean>;

  get defaultNavbar(){
    return this.navbarTmpl === "default-navbar";
  }

  get lasargenNavbar(){
    return this.navbarTmpl === "lasargentinas";
  }

  get utopiasNavbar(){
    return this.navbarTmpl === "utopias";
  }


  @Input() openedSidebar: boolean = false;

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