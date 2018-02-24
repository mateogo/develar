import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';

@Component({
  selector: 'page-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class PageBarChartComponent implements OnInit {
  pageTitle: string = 'Bar Chart';

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012'
  ];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  public randomize():void {
    let _barChartData: any[] = new Array(this.barChartData.length);
    for (let i = 0; i < this.barChartData.length; i++) {
      _barChartData[i] = {data: new Array(this.barChartData[i].data.length), label: this.barChartData[i].label};
      for (let j = 0; j < this.barChartData[i].data.length; j++) {
        _barChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.barChartData = _barChartData;
  }
}
