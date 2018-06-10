import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../develar-commons/shared-service';

const messages: any[] = [
  {
    from: 'Nancy',
    subject: 'HTML',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    avatar: 'assets/content/avatar-4.jpg'
  },
  {
    from: 'Mary',
    subject: 'Css',
    content: 'Lorem Ipsum has been the industrys standard',
    avatar: 'assets/content/avatar-3.jpg'
  },
  {
    from: 'Bobby',
    subject: 'Angular 2',
    content: 'It is a long established fact that a reader will be distracted by the readable content',
    avatar: 'assets/content/avatar-2.jpg'
  },
  {
    from: 'Roma',
    subject: 'Type Script',
    content: 'There are many variations of passages of',
    avatar: 'assets/content/avatar-1.jpg'
  },
  {
    from: 'Amanda',
    subject: 'PHP',
    content: 'Lorem Ipsum has been the industrys standard',
    avatar: 'assets/content/avatar-5.jpg'
  },
  {
    from: 'Tom',
    subject: 'Sql',
    content: 'There are many variations of passages of',
    avatar: 'assets/content/avatar-6.jpg'
  }
];
const folders: any[] = [
  {
    icon: 'android',
    badge: false,
    name: 'Android app',
    updated: 'March 21, 2017'
  },
  {
    icon: 'update',
    badge: false,
    name: 'Update plugins',
    updated: 'March 19, 2017'
  },
  {
    icon: 'bug_report',
    badge: false,
    name: 'Fix bugs',
    updated: 'March 22, 2017'
  },
  {
    icon: 'unarchive',
    badge: false,
    name: 'Create app design',
    updated: 'March 25, 2017'
  },
  {
    icon: 'content_copy',
    badge: 8,
    name: 'Create widgets',
    updated: 'March 16, 2017'
  },
  {
    icon: 'folder_open',
    badge: false,
    name: 'Documentation',
    updated: 'March 28, 2017'
  }
];

@Component({
  moduleId: module.id,
  selector: 'page-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class PageDashboardComponent {
  pageTitle: string = 'Dashboard';
  messages = messages;
  folders = folders;

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}

  // lineChart
  public lineChartData: any[] = [
    {
      data: [30, 42, 46, 51, 65, 73, 80],
      label: 'Users',
      borderWidth: 1,
      pointRadius: 1
    },
    {
      data: [42, 43, 52, 47, 65, 70, 79],
      label: 'Pages',
      borderWidth: 1,
      pointRadius: 1
    },
    {
      data: [51, 48, 45, 56, 61, 69, 67],
      label: 'Visits',
      borderWidth: 1,
      pointRadius: 1
    }
  ];
  public lineChartLabels: any[] = [
    'Mon.',
    'Tue.',
    'Wed.',
    'Thu.',
    'Fri.',
    'Sat.',
    'Sun.'
  ];
  public lineChartOptions: any = {
    responsiveAnimationDuration: 500,
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: true
        },
        ticks: {
          beginAtZero: true
        }
      }],
    }
  };
  public lineChartColors: any[] = [
    {
      backgroundColor: 'rgba(93,173,224,0.2)',
      borderColor: '#5dade0',
      pointBackgroundColor: '#5dade0',
      pointBorderColor: '#0e7cc5',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#000'
    },
    {
      backgroundColor: 'rgba(255,140,0,0.2)',
      borderColor: '#ff8c00',
      pointBackgroundColor: '#ff8c00',
      pointBorderColor: '#FF630B',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#000'
    },
    {
      backgroundColor: 'rgba(220,20,60,0.2)',
      borderColor: '#dc143c',
      pointBackgroundColor: '#dc143c',
      pointBorderColor: '#7E2303',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#000'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  // Radar
  public radarChartLabels: string[] = [
    'Designing',
    'Coding',
    'Support',
    'Marketing',
    'Sales',
    'Customization',
    'Updating'
  ];
  public radarChartData: any = [
    {
      data: [65, 59, 90, 81, 56, 55, 40],
      label: 'Plugins',
      borderWidth: 1,
      pointRadius: 1
    },
    {
      data: [28, 48, 40, 19, 96, 27, 100],
      label: 'Widgets',
      borderWidth: 1,
      pointRadius: 1
    }
  ];
  public radarChartColors: any[] = [
    {
      backgroundColor: 'rgba(93,173,224,0.2)',
      borderColor: '#5dade0',
      pointBackgroundColor: '#5dade0',
      pointBorderColor: '#0e7cc5',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#000'
    },
    {
      backgroundColor: 'rgba(255,140,0,0.2)',
      borderColor: '#ff8c00',
      pointBackgroundColor: '#ff8c00',
      pointBorderColor: '#FF630B',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#000'
    },
    {
      backgroundColor: 'rgba(220,20,60,0.2)',
      borderColor: '#dc143c',
      pointBackgroundColor: '#dc143c',
      pointBorderColor: '#7E2303',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#000'
    }
  ];
  public radarChartType: string = 'radar';
}