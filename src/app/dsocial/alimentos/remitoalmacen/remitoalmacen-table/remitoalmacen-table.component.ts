import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';
import { MatCheckboxChange } from '@angular/material';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map }   from 'rxjs/operators';

import { MatPaginator, MatSort } from '@angular/material';

import { GenericDialogComponent } from '../../../../develar-commons/generic-dialog/generic-dialog.component';


import { DsocialController } from '../../../dsocial.controller';

import {  Person } from '../../../../entities/person/person';

import { 	RemitoAlmacen, 
					UpdateRemitoEvent,
					AlimentosHelper,
					RemitoAlmacenTable } from '../../alimentos.model';

/**
 * @displayedColumns
 *  _id: string;
 *  predicate: string;
 *  displayAs: string;
 *  slug: string;
 *  entityId: string;
 *  qt: number;
 *  avance: string;
 *  fecomp_txa: number;
 *  moneda: string;
 *  total: number;
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
 * @title Asitencia Table Componet
 */

@Component({
  selector: 'remitoalmacen-table',
  templateUrl: './remitoalmacen-table.component.html',
  styleUrls: ['./remitoalmacen-table.component.scss']
})
export class RemitoalmacenTableComponent implements OnInit {
  @Input()  public  displayedColumns = ['select', 'compName', 'compNum', 'action', 'kitEntrega', 'person', 'slug', "sector", "avance", "fecomp_txa"];
  @Input()  public  isColSelectionAllowed = true;
  @Output() private actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private table_columns = ['select', 'asistenciaId', 'compName', 'compNum', 'action', 'kitEntrega', 'person', 'slug', "sector","avance", "fecomp_txa"];
  private table_columns_sel = {
    'select': false,
    'asistenciaId': false,
    'compName': false,
    'compNum': false,
    'action': false,
    'slug': false,
    "sector": false,
    "avance": false,
    "fecomp_txa": false,
    "person": false,
    "kitEntrega": false
  }


  private dataRecordsSource: BehaviorSubject<RemitoAlmacenTable[]>;
  private readonly CERO   = 0;
  private readonly UNO    = 1;
  private readonly DOS    = 2;
  private readonly TRES   = 3;
  private readonly CUATRO = 4;
  private readonly CINCO  = 5;

  public selectedAction: string = 'no_definido';
  public actionList: Array<any> = [];

  public dataSource: DataSource<any>;

  public selection = new SelectionModel<RemitoAlmacenTable>(true, []);

  constructor(
			private dsCtrl: DsocialController,
			public dialogService: MatDialog
    ){
    this.dataRecordsSource = this.dsCtrl.remitosDataSource;
  }

  ngOnInit(){
    this.dataSource = new TableDataSource(this.dataRecordsSource, this.paginator, this.sort)
    this.dsCtrl.remitosSelectionModel = this.selection;
  	this.actionList = AlimentosHelper.getOptionlist('tableactions');

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
    //console.log('generic Dialog changeCheckBx: [%s] [%s]',  event.checked.valueOf() , argavancents.length)
  }

  getLabel(item:string, arr:Array<any>, prefix: string):string{
    let label =  arr.find(x => x.val === item).label
    if(item === 'no_definido') label = "";
    return prefix ? prefix + label : label;
  }

  openEditor(item, col){
    item.editflds[col] = item.editflds[col] > 1 ? 0 : item.editflds[col] + 1
    item.total = item.pu * item.qt;
    this.dsCtrl.updateAsistenciaListItem(item);
  }

}



export class TableDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  constructor(private sourceData: BehaviorSubject<RemitoAlmacenTable[]>,
              private _paginator: MatPaginator,
              private _sort: MatSort){
    super();

  }

  connect(): Observable<RemitoAlmacenTable[]> {

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

  getSortedData(): RemitoAlmacenTable[]{
    const data = this.sourceData.value.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'sector': [propertyA, propertyB] = [a.sector, b.sector]; break;
        case 'action':      [propertyA, propertyB] = [a.action, b.action]; break;
        case 'slug':      [propertyA, propertyB] = [a.slug, b.slug]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {}

}
