import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { BehaviorSubject ,  Subject ,  Observable, merge }       from 'rxjs';

import { map }   from 'rxjs/operators';





import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';

import { CommunityController } from '../community.controller';
import { CommunityTable }  from '../community.model';

/**
 * @displayedColumns
 *  _id: string;
 *  predicate: string;
 *  displayAs: string;
 *  slug: string;
 *  entityId: string;
 *  qt: number;
 *  ume: string;
 *  pu: number;
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
 * @title Community Table Componet
 */
@Component({
  selector: 'community-table',
  templateUrl: './community-table.component.html',
  styleUrls:  ['./community-table.component.scss'],
  providers: [GenericDialogComponent]
})
export class CommunityTableComponent implements OnInit, OnChanges {
  @Input()  displayedColumns = ['select', 'code','eclass', 'etype', 'slug'];
  @Input()  isColSelectionAllowed = true;
  @Output() actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //private table_columns = ["select", "predicate", "milestoneLabel", "displayAs",  "slug", "entityId", "qtx", "qt", "ume", "freq", 'fume' , "pu", 'moneda', "total", 'ars', 'usd','eur', 'brl'];
  private table_columns = ["select", 'code','eclass','etype', "slug","name", "displayAs"];
  private table_columns_sel = {
     "select": false,
     "code": false,
     "eclass": false,
     "etype": false,
     "slug": false,
     "name": false,
     "displayAs": false,
  }


  private dataRecordsSource: BehaviorSubject<CommunityTable[]>;
  private readonly CERO   = 0;
  private readonly UNO    = 1;
  private readonly DOS    = 2;
  private readonly TRES   = 3;
  private readonly CUATRO = 4;
  private readonly CINCO  = 5;

  public  selectedAction: string = 'no_definido';
  public actionList: Array<any> = [];

  private slugFld = 0;
  private totalCurrency;
  public totals = [];

  public dataSource: DataSource<any>;


  // new SelectionModel<EntityType>(allowMultiSelect, initialSelection)
  public selection = new SelectionModel<CommunityTable>(true, []);

  constructor(private communityCtrl: CommunityController,
              public dialogService: MatDialog
    ){
    this.dataRecordsSource = this.communityCtrl.tableDataSource;
  }

  ngOnInit(){
    this.dataSource = new CommunityDataSource(this.dataRecordsSource, this.paginator, this.sort)
    this.communityCtrl.selectionModel = this.selection;
    this.actionList = this.communityCtrl.tableActions;

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
    this.communityCtrl.updateCommunityList(item);
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



export class CommunityDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  constructor(private sourceData: BehaviorSubject<CommunityTable[]>,
              private _paginator: MatPaginator,
              private _sort: MatSort){
    super();
  }

  connect(): Observable<CommunityTable[]> {
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

  getSortedData(): CommunityTable[]{
    const data = this.sourceData.value.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'code':      [propertyA, propertyB] = [a.code, b.code]; break;
        case 'eclass':    [propertyA, propertyB] = [a.eclass, b.eclass]; break;
        case 'etype':     [propertyA, propertyB] = [a.etype, b.etype]; break;
        case 'name':      [propertyA, propertyB] = [a.name, b.name]; break;
        case 'displayAs': [propertyA, propertyB] = [a.displayAs, b.displayAs]; break;
        case 'slug':      [propertyA, propertyB] = [a.slug, b.slug]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {}
}
