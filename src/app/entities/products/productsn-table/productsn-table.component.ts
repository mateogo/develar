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

import { ProductController } from '../product.controller';
import { ProductsnTable }  from '../product.model';

/**
 * @displayedColumns
 *  _id: string;
 *  slug: string;
 *  feTxt: string;
 */

const removeRelation = {
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



/**
 * @title Product Table Componet
 */
@Component({
  selector: 'productsn-table',
  templateUrl: './productsn-table.component.html',
  styleUrls:  ['./productsn-table.component.scss'],
  providers: [GenericDialogComponent]
})
export class ProductsnTableComponent implements OnInit, OnChanges {
  @Input() public displayedColumns = ['select', 'code', 'feTxt', 'slug', 'actualOwnerName', 'productName' ];
  @Input() isColSelectionAllowed = true;
  @Output() private actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private table_columns = ["select", 'code','feTxt', "slug" , 'actualOwnerName', 'estado', 'productName'];
  private table_columns_sel = {
     "select": false,
     "code": false,
     "feTxt": false,
     "slug": false,
     "actualOwnerName": false,
     "estado": false,
     "productName": false
  }


  private dataRecordsSource: BehaviorSubject<ProductsnTable[]>;
  private readonly CERO   = 0;
  private readonly UNO    = 1;
  private readonly DOS    = 2;
  private readonly TRES   = 3;
  private readonly CUATRO = 4;
  private readonly CINCO  = 5;

  public selectedAction: string = 'no_definido';
  public actionList: Array<any> = [];

  private slugFld = 0;
  private totalCurrency;
  public totals = [];

  public dataSource: DataSource<any>;


  // new SelectionModel<EntityType>(allowMultiSelect, initialSelection)
  public selection = new SelectionModel<ProductsnTable>(true, []);

  constructor(private productCtrl: ProductController,
              public dialogService: MatDialog
    ){
    this.dataRecordsSource = this.productCtrl.productsnDataSource;
  }

  ngOnInit(){
    this.dataSource = new ProductDataSource(this.dataRecordsSource, this.paginator, this.sort)
    this.productCtrl.selectionsnModel = this.selection;
    this.actionList = this.productCtrl.tableActions;

    this.displayedColumns.forEach(elem =>{
      this.table_columns_sel[elem] = true;
    })

    this.dataRecordsSource.subscribe(prod =>{
      //this.acumCurrencies(prod)
    })

  }

  ngOnChanges(){

  }



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataRecordsSource.value.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataRecordsSource.value.forEach(row => this.selection.select(row));
  }


  openEditor(item, col){
    item.editflds[col] = item.editflds[col] > 1 ? 0 : item.editflds[col] + 1
    item.total = item.pu * item.qt;
    this.productCtrl.updateProductListItem(item);
  }

  changeAction(action: MatSelectChange){
    this.triggerAction(action.value);
    setTimeout(()=>{
        action.source.writeValue('no_definido')  
    },1000  );
  }

  triggerAction(action: string){
    this.actionTriggered.next(action);
    this.selection.clear();
  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }

  buildColumDef(){
    this.displayedColumns = [];
    this.table_columns.forEach(col => {
      if(this.table_columns_sel[col]) this.displayedColumns.push(col);
    })
  }

  openModalDialog(templ){
    removeRelation.data.itemplate = templ;
    this.openDialog(removeRelation).subscribe(result => {
      if(result==='accept'){
        this.buildColumDef();
      } 

    }) 
  }

  changeCheckBx(event:MatCheckboxChange , col, cols){

  }

  getLabel(item:string, arr:Array<any>, prefix: string):string{
    let label =  arr.find(x => x.val === item).label
    if(item === 'no_definido') label = "";
    return prefix ? prefix + label : label;
  }

}



export class ProductDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  constructor(private sourceData: BehaviorSubject<ProductsnTable[]>,
              private _paginator: MatPaginator,
              private _sort: MatSort){
    super();

  }

  connect(): Observable<ProductsnTable[]> {

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

  getSortedData(): ProductsnTable[]{
    const data = this.sourceData.value.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'code':      [propertyA, propertyB] = [a.code, b.code]; break;
        case 'slug':      [propertyA, propertyB] = [a.slug, b.slug]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {}
}

//{{actionList.find(it=>it.val==selectedAction).label}}

