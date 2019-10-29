import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';

import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';

import { MatCheckboxChange } from '@angular/material';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map }   from 'rxjs/operators';

import { MatPaginator, MatSort } from '@angular/material';

import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';

import { TimebasedController } from '../../timebased-controller';

import { RolNocturnidadTableData }  from '../../timebased.model';

@Component({
  selector: 'rol-noche-list',
  templateUrl: './rol-noche-list.component.html',
  styleUrls: ['./rol-noche-list.component.scss']
})
export class RolNocheListComponent implements OnInit {
  @Input() public displayedColumns = ['select', 'compNum', 'ferol_txa', 'slug', 'estado' ];

  @Input() isColSelectionAllowed = true;
  @Output() private actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private table_columns = ['select', 'compName', 'compNum', 'idPerson', 'fecomp_txa', 'ferol_txa', 'action', 'slug', 'description', 'estado', 'avance' ];
  private table_columns_sel = {
			'select': false,
			'compName': false,
			'compNum': false,
			'idPerson': false,
			'fecomp_txa': false,
			'ferol_txa': false,
			'action': false,
			'slug': false,
			'description': false,
			'estado': false,
			'avance': false,
  }

  private dataRecordsSource: BehaviorSubject<RolNocturnidadTableData[]>;
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
  public selection = new SelectionModel<RolNocturnidadTableData>(true, []);

  constructor(private tbCtrl: TimebasedController,
              public dialogService: MatDialog
    ){
    this.dataRecordsSource = this.tbCtrl.rolnocturnidadDataSource;

  }

  ngOnInit(){
    this.dataSource = new RolNocturnidadDataSource(this.dataRecordsSource, this.paginator, this.sort)
    this.tbCtrl.selectionkitModel = this.selection;
    this.actionList = this.tbCtrl.tableActions;

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
  }

  changeCheckBx(event:MatCheckboxChange , col, cols){
  }

  getLabel(item:string, arr:Array<any>, prefix: string):string{
    let label =  arr.find(x => x.val === item).label
    if(item === 'no_definido') label = "";
    return prefix ? prefix + label : label;
  }

}



export class RolNocturnidadDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  constructor(private sourceData: BehaviorSubject<RolNocturnidadTableData[]>,
              private _paginator: MatPaginator,
              private _sort: MatSort){
    super();

  }

  connect(): Observable<RolNocturnidadTableData[]> {

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

  getSortedData(): RolNocturnidadTableData[]{
    const data = this.sourceData.value.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'slug':      [propertyA, propertyB] = [a.slug, b.slug]; break;
        case 'estado':    [propertyA, propertyB] = [a.estado, b.estado]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {}

}

