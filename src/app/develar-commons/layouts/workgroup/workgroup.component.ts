import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../shared-service';
import { NavbarComponent } from '../../navbar/default/navbar.component';

@Component({
  selector: 'workgroup-layout',
  templateUrl: './workgroup.component.html',
  styleUrls: ['./workgroup.component.scss']
})
export class WorkgroupLayoutComponent implements OnInit {
  pageTitle: any = "default pageTitle";
  @Input() openedSidebar: boolean = false;

  private subscription01;

  constructor( private _sharedService: SharedService ) {
    this.subscription01 = _sharedService.changeEmitted$.subscribe(
      title => {
        this.pageTitle = title;
      }
    );
  }

  ngOnInit() { 
  }

  sidebarState() {
    this.openedSidebar = !this.openedSidebar;
  }


}