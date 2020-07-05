import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map }   from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';

import { DsocialController } from '../../dsocial.controller';

import { 	RemitoAlmacen, 
					UpdateRemitoEvent,
					AlimentosHelper,
					ProductosAlmacenTable } from '../../alimentos/alimentos.model';


const columSelectionDialog = {
  width:  '330px',
  height: '700px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    itemplate: '',
    caption:'Seleccione columnas...',
    title: 'Confirme la acción',
    body: 'Se dará de baja la relación seleccionada en esta ficha',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};


@Component({
  selector: 'alimentostablero-table',
  templateUrl: './alimentostablero-table.component.html',
  styleUrls: ['./alimentostablero-table.component.scss']
})
export class AlimentostableroTableComponent implements OnInit {
  @Input()  public  displayedColumns = ['select', 'name', 'qty', 'ume', 'pclass', 'sector', 'action'];
  @Input()  public  isColSelectionAllowed = true;
  @Output() private actionTriggered: EventEmitter<string> = new EventEmitter();
	@Input()  public dataRecordsSource: BehaviorSubject<ProductosAlmacenTable[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private table_columns = ['select', 'code', 'name', 'qty', 'ume', 'pclass', 'sector', 'action', 'deposito', 'tmov'];
  private table_columns_sel = {
    'select': false,
 		'sector': false,
 		'action': false,
 		'deposito': false,
 		'tmov': false,
    'pclass': false,
 		'code': false,
 		'name': false,
    'qty': false,
 		'ume': false,
  }


  
  public selectedAction: string = 'no_definido';
  public actionList: Array<any> = [];

  public dataSource: DataSource<any>;

  public selection = new SelectionModel<ProductosAlmacenTable>(true, []);

  constructor(
			private dsCtrl: DsocialController,
			public dialogService: MatDialog
    ){
  }

  ngOnInit(){
    this.dataSource = new TableDataSource(this.dataRecordsSource, this.paginator, this.sort)
    //this.dsCtrl.remitosSelectionModel = this.selection;
  	this.actionList = AlimentosHelper.getOptionlist('tableroactions');

    this.displayedColumns.forEach(elem =>{
      this.table_columns_sel[elem] = true;
    })

    this.dataRecordsSource.subscribe(token =>{
      //this.acumCurrencies(token)
    })

  }

  ngOnChanges(){
    //console.log('********** ngOnChanges;')
  }

  // action: [entregar|limpiar]
  triggerAction(action: string){
    this.actionTriggered.next(action);
    this.selection.clear();
  }


  /********************
    Table Helper Functions
  *********************/

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;

    const numRows     = this.dataRecordsSource.value.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataRecordsSource.value.forEach(row => this.selection.select(row));
  }

  changeAction(action: MatSelectChange){
    //console.log('Action selected:[%s] [%s] [%s]', this.selectedAction, action.value, action.source.value ); 
    this.triggerAction(action.value);
    setTimeout(()=>{
        action.source.writeValue('no_definido')  
    },1000  );
  }

  changeCheckBx(event:MatCheckboxChange , col, cols){
    //console.log('generic Dialog changeCheckBx: [%s] [%s]',  event.checked.valueOf() , argavancents.length)
  }

  openModalDialog(templ){
    columSelectionDialog.data.itemplate = templ;
    this.openDialog(columSelectionDialog).subscribe(result => {

      if(result==='accept'){
        this.buildColumDef();
      } 

    }) 
  }

  private openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }

  private buildColumDef(){
    this.displayedColumns = [];
    this.table_columns.forEach(col => {
      if(this.table_columns_sel[col]) this.displayedColumns.push(col);
    })
  }


  getActionLabel(item:string, arr:Array<any>, prefix: string):string{
    let label =  arr.find(x => x.val === item).label
    if(item === 'no_definido') label = "";
    return prefix ? prefix + label : label;
  }

}


export class TableDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  constructor(private sourceData: BehaviorSubject<ProductosAlmacenTable[]>,
              private _paginator: MatPaginator,
              private _sort: MatSort){
    super();

  }

  connect(): Observable<ProductosAlmacenTable[]> {

    const displayDataChanges = [
      this.sourceData,
      this._paginator.page,
      this._sort.sortChange
    ];

    return merge(...displayDataChanges).pipe(
        map(() => {
          const data = this.getSortedData();

          // Grab the page's slice of data.
          const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
          return data.splice(startIndex, this._paginator.pageSize);
        })
     );

  }

  getSortedData(): ProductosAlmacenTable[]{
    const data = this.sourceData.value.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'sector':   [propertyA, propertyB] = [a.sector, b.sector];  break;
        case 'action':   [propertyA, propertyB] = [a.action, b.action];  break;
        case 'deposito': [propertyA, propertyB] = [a.deposito, b.deposito];     break;
        case 'tmov':     [propertyA, propertyB] = [a.tmov, b.tmov];      break;
        case 'code':     [propertyA, propertyB] = [a.code, b.code];      break;
        case 'pclass':   [propertyA, propertyB] = [a.pclass, b.pclass];  break;
        case 'name':     [propertyA, propertyB] = [a.name, b.name];      break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {}

}
