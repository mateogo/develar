import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

const timelineData: any[] = [
  {
    'label': '2017',
    'timeline': [
      {
        'date': '2 hours ago',
        'content': `Aenean lacinia bibendum nulla sed consectetur. Nullam id dolor id nibh ultricies vehicula ut id elit.`,
        'pointColor': '#ea8080'
      },
      {
        'date': '5 hours ago',
        'content': `Aenean lacinia bibendum nulla sed consectetur. Nullam id dolor id nibh ultricies vehicula ut id elit.
         Aenean lacinia bibendum nulla sed consectetur. Nullam id dolor id nibh ultricies vehicula ut id elit.`,
        'pointColor': '#915035'
      },
      {
        'date': '8 hours ago',
        'content': `Lorem ipsum dolor sit amet.`,
        'pointColor': '#B925FF'
      },
      {
        'date': '2 days ago',
        'content': `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
        'pointColor': '#C5CAE9'
      },
      {
        'date': '3 days ago',
        'content': `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet blanditiis doloremque earum itaque laborum, nobis non ratione rerum similique vel?`,
        'pointColor': '#FF8A65'
      },
      {
        'date': '5 days ago',
        'content': `Lorem ipsum dolor sit.`,
        'pointColor': '#B3E5FC'
      },
      {
        'date': 'July 10, 2017',
        'content': `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate.`,
        'pointColor': '#B2DFDB'
      },
      {
        'date': 'July 7, 2017',
        'content': `Lorem ipsum dolor sit amet, consectetur.`,
        'pointColor': '#3E5EFF'
      }
    ]
  },
  {
    'label': '2016',
    'timeline': [
      {
        'date': 'December 27, 2016',
        'content': `Lorem ipsum dolor sit.`,
        'pointColor': '#FFC6E6'
      },
      {
        'date': 'December 20, 2016',
        'content': `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur nam nisi veniam.`,
        'pointColor': '#FFA78D'
      },
      {
        'date': 'December 17, 2016',
        'content': `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate.`,
        'pointColor': '#F0F4C3'
      },
      {
        'date': 'December 12, 2016',
        'content': `Lorem ipsum dolor sit amet, consectetur.`,
        'pointColor': '#FFC6F1'
      },
      {
        'date': 'December 2, 2016',
        'content': `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur nam nisi veniam.`,
        'pointColor': '#488034'
      },
    ]
  }
];

@Component({
  selector: 'page-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class PageTimelineComponent implements OnInit {
  pageTitle: string = 'Timeline';
  timelineData: any[] = timelineData;

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
}
