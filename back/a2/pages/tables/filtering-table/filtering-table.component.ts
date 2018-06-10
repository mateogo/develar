import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'page-filtering-table',
  templateUrl: './filtering-table.component.html',
  styleUrls: ['./filtering-table.component.scss']
})
export class PageFilteringTableComponent implements OnInit {
  pageTitle: string = 'Filtering table';
  rows = [];
  temp = [];
  loadingIndicator: boolean = true;
  columns = [
    { prop: 'name' },
    { name: 'Company' },
    { name: 'Gender' }
  ];

  constructor( private _sharedService: SharedService ) {
    this.fetch((data) => {
      // cache our list
      this.temp = [...data];

      // push our inital complete list
      this.rows = data;
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
    this._sharedService.emitChange(this.pageTitle);
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/table-data.json');

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  updateFilter(event) {
    const val = event.target.value;

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
  }

  ngOnInit() {}
}
