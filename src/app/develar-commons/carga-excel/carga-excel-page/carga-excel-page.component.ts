import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { DaoService } from '../../dao.service';

@Component({
  selector: 'carga-excel-page',
  templateUrl: './carga-excel-page.component.html',
  styleUrls: ['./carga-excel-page.component.scss']
})
export class CargaExcelPageComponent implements OnInit {
  nrows : number;
  registros: Array<object> = [];
  columnsToDisplay: Array<string> = [];

  constructor(
      private daoService: DaoService
  	) { }

  ngOnInit() {
    const self = this
    this.getExcelNRows().then(
      function(value){
        console.log(value)
        self.nrows = value.nrows;
      } 
    );
  }

  getExcelNRows(): Promise<any>{
    return this.daoService.getExcelNRows();
  }
  getExcelRegistros(): Promise<any>{
    return this.daoService.getExcelRegistros();
  }

  cargarRegistros(){
    const self = this
    this.getExcelRegistros().then(
      function(value){
        console.log(value);
        self.registros = value.registros;
        self.columnsToDisplay = value.colHeaders;
      },
      function(reason){
        console.log(reason);
      }
    )
  }

}
