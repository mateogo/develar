import { Component, OnInit } from '@angular/core';
import { DaoService } from '../../dao.service';
import { Asset } from '../../develar-entities';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GenericDialogComponent } from '../../generic-dialog/generic-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'carga-excel-page',
  templateUrl: './carga-excel-page.component.html',
  styleUrls: ['./carga-excel-page.component.scss']
})
export class CargaExcelPageComponent implements OnInit {
  importTypes = ["sisa", "..."];

  public title = 'Subir Archivo';
	public showEdit = false;

  asset : Asset;
  nrows : number;
  registros: Array<object> = [];
  columnsToDisplay: Array<string> = [];
  selectedImportType: string;

  constructor(
      private daoService: DaoService,
      public dialogService: MatDialog,
      public snackBar: MatSnackBar,

  	) { }

  ngOnInit() { }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }

  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,
    });
    snck.onAction().subscribe((e)=> {
    })
  }

  toggleAssetUpload(){
    this.showEdit = !this.showEdit;
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

  testearImportacion(){
    if(this.asset && this.selectedImportType){
      const self = this
      this.importExcelData(true, this.selectedImportType, this.asset.path).then(
        function(value){
          console.log(value);
          self.openSnackBar("Servidor dice: "+value["respuesta"], "cerrar");
        },
        function(reason){
          console.log(reason);
        }
      )
    }else{
      this.openSnackBar("Falta seleccionar asset", "cerrar");
    }
  }

  importarDatos(){
    if(this.asset && this.selectedImportType){
      const self = this
      let content = `
        Está seguro de realizar la operación? <br><br>
        Archivo a importar: ${this.asset.originalname} <br>
  			Tipo de importación: ${this.selectedImportType} <br>
        Cantidad de filas: ${this.nrows} <br>
 	    `;
      importacionConfirm.data.body = content;
      importacionConfirm.data.caption = "Importación"

      this.openDialog(importacionConfirm).subscribe(result => {
          if(result === 'accept'){
            this.importExcelData(false, this.selectedImportType, this.asset.path).then(
              function(value){
                console.log(value);
                self.openSnackBar(`Importacion de ${self.selectedImportType} exitosa!`, "cerrar");
              },
              function(reason){ console.log(reason); }
            );
          }
        });
    }else{
      this.openSnackBar("Falta seleccionar asset", "cerrar");
    }
  }

  getExcelData(path: string): Promise<any>{
    return this.daoService.getExcelData({path: path});
  }

  importExcelData(isTesting: boolean, importType: string, path: string){
    let query = {
      importType: importType,
      path: path,
      isTesting: isTesting
    };
    return this.daoService.importExcelData(query);
  }
}

const importacionConfirm = {
  width:  '400px',
  height: '300px',
  hasBackdrop: false,
  data: {
    caption:'Titulo',
    body: 'Mensaje',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
}