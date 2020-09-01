import { Component, OnInit } from '@angular/core';
import { DaoService } from '../../dao.service';
import { Asset } from '../../develar-entities';

const CORE = 'core';
const TOKEN_TYPE = 'assets';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'carga-excel-page',
  templateUrl: './carga-excel-page.component.html',
  styleUrls: ['./carga-excel-page.component.scss']
})
export class CargaExcelPageComponent implements OnInit {
  public title = 'Subir Archivo';
	public showEdit = false;
  public openEditor = true;

  asset : Asset;
  nrows : number;
  registros: Array<object> = [];
  columnsToDisplay: Array<string> = [];

  constructor(
      private daoService: DaoService
  	) { }

  ngOnInit() { }

  addItem(){
    this.showEdit = true;
  }

  selectAsset(asset){
    console.log(asset.path);
    this.asset = asset;

    const self = this
    this.getExcelData(this.asset.path).then(
      function(value){
        console.log(value);
        self.nrows = value.nrows;
        self.registros = value.registros;
        self.columnsToDisplay = value.colHeaders;
      },
      function(reason){
        console.log(reason);
      }
    )
  }

  onSubmit(){
    this.showEdit = false;
  }

  getExcelData(path: string): Promise<any>{
    let obj = {path: path}
    return this.daoService.getExcelData(obj);
  }

  import(path: string){
    let obj = {path: path}
    return this.daoService.importExcelData(obj);
  }

  cargarRegistros(){
    if(this.asset){
      this.import(this.asset.path).then(
        function(value){
          console.log(value);
          alert("importacion exitosa");
        },
        function(reason){
          console.log(reason);
        }
      )
    }
  }

}
