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
  selector: 'page-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class PageWidgetsComponent implements OnInit {
  pageTitle: string = 'Widgets';
  lat: number = 50.4664212;
  lng: number = 30.6;
  messages = messages;
  folders = folders;

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    responsiveAnimationDuration: 500
  };
  public barChartLabels: string[] = [
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017'
  ];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    {
      data: [59, 80, 81, 56, 55, 40],
      label: 'Angular JS',
      borderWidth: 1,
      pointRadius: 1
    },
    {
      data: [48, 40, 19, 86, 27, 90],
      label: 'React JS',
      borderWidth: 1,
      pointRadius: 1
    }
  ];

  // Pie
  public pieChartLabels: string[] = [
    'Angular',
    'PHP',
    'HTML'
  ];
  public pieChartData: any[] = [
    300,
    500,
    100
  ];
  public pieChartColors: any[] = [
    {
      backgroundColor: [
        "#778391",
        "#5dade0",
        "#3c4e62"
      ],
    }
  ];
  public pieChartType: string = 'pie';
  public pieChartOptions: any = {
    elements: {
      arc : {
        borderWidth: 0
      }
    },
    tooltips: false
  };

  //Doughnut
  public doughnutChartLabels: string[] = [
    'Angular',
    'PHP',
    'HTML'
  ];
  public doughnutChartData: number[] = [
    350,
    450,
    100
  ];
  public doughnutChartColors: any[] = [
    {
      backgroundColor: [
        "#778391",
        "#ff8c00",
        "#3c4e62"
      ],
    }
  ];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartOptions: any = {
    elements: {
      arc : {
        borderWidth: 0
      }
    },
    tooltips: false
  };

  // PolarArea
  public polarAreaChartLabels: string[] = [
    'Angular',
    'PHP',
    'HTML'
  ];
  public polarAreaChartData: number[] = [
    300,
    400,
    500
  ];
  public polarAreaChartColors: any[] = [
    {
      backgroundColor: [
        "#778391",
        "#dc143c",
        "#3c4e62"
      ],
    }
  ];
  public polarAreaChartType: string = 'polarArea';
  public polarAreaChartOptions: any = {
    elements: {
      arc : {
        borderWidth: 0
      }
    },
    tooltips: false
  };
}
