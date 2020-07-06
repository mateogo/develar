import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

const links = ['Link 1', 'Link 2', 'Link 3'];
const messages = [
  {
    from: 'Nancy',
    subject: 'HTML',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    avatar: 'assets/content/avatar-1.jpg'
  },
  {
    from: 'Mary',
    subject: 'Css',
    content: 'Lorem Ipsum has been the industrys standard',
    avatar: 'assets/content/avatar-2.jpg'
  },
  {
    from: 'Bobby',
    subject: 'Angular 2',
    content: 'It is a long established fact that a reader will be distracted by the readable content',
    avatar: 'assets/content/avatar-3.jpg'
  },
  {
    from: 'Roma',
    subject: 'Type Script',
    content: 'There are many variations of passages of',
    avatar: 'assets/content/avatar-4.jpg'
  }
];
const folders = [
  {
    name: 'Nancy',
    updated: 'Jan 21, 2017'
  },
  {
    name: 'Mary',
    updated: 'Jan 19, 2017'
  }
];
const notes = [
  {
    name: 'Bobby',
    updated: 'Jan 18, 2017'
  },
  {
    name: 'Roma',
    updated: 'Jan 17, 2017'
  }
];

@Component({
  selector: 'page-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PageListComponent implements OnInit {
  pageTitle: string = 'List';
  links = links;
  messages = messages;
  folders = folders;
  notes = notes;

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}