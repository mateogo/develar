import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';
import { Item } from './item';

const breadcrumb: Item[] = [
  {
    title: 'Home',
    link: '#',
    icon: ''
  },
  {
    title: 'UI Elements',
    link: '#',
    icon: ''
  },
  {
    title: 'Components',
    link: '#',
    icon: ''
  },
  {
    title: 'Breadcrumb',
    link: '',
    icon: ''
  }
];
const breadcrumbIcon: Item[] = [
  {
    title: 'Home',
    link: '#',
    icon: 'fa fa-home'
  },
  {
    title: 'UI Elements',
    link: '#',
    icon: 'fa fa-paper-plane'
  },
  {
    title: 'Components',
    link: '#',
    icon: 'fa fa-shopping-bag'
  },
  {
    title: 'Breadcrumb',
    link: '',
    icon: 'far fa-diamond'
  }
];
@Component({
  selector: 'page-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class PageBreadcrumbComponent implements OnInit {
  pageTitle: string = 'Breadcrumb';
  breadcrumb: Item[] = breadcrumb;
  breadcrumbIcon: Item[] =  breadcrumbIcon;

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}