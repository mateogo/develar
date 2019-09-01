import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';
import { MatCheckboxChange } from '@angular/material';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';

import { map }   from 'rxjs/operators';

import { MatPaginator, MatSort } from '@angular/material';

import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';

import { PersonController } from '../person.controller';
import { PersonTable }  from '../person';

/**
 * @displayedColumns
			personType: string;
			displayName: string;
			email: string;
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
  selector: 'person-table',
  templateUrl: './person-table.component.html',
  styleUrls: ['./person-table.component.scss']
})
export class PersonTableComponent implements OnInit, OnChanges {

  @Input()  displayedColumns = ['select', 'personType','displayName', 'email'];
  @Input()  isColSelectionAllowed = true;
  @Output() actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private table_columns = ["select",  'personType','displayName', 'email'];
  private table_columns_sel = {
     "select": false,
     "personType": false,
     "displayName": false,
     "email": false
  }


  private dataRecordsSource: BehaviorSubject<PersonTable[]>;
  private readonly CERO   = 0;
  private readonly UNO    = 1;
  private readonly DOS    = 2;
  private readonly TRES   = 3;
  private readonly CUATRO = 4;

  public selectedAction: string = 'no_definido';
  public actionList: Array<any> = [];

  private slugFld = 0;
  private totalCurrency;
  public  totals = [];

  public dataSource: DataSource<any>;


  // new SelectionModel<EntityType>(allowMultiSelect, initialSelection)
  public selection = new SelectionModel<PersonTable>(true, []);

  constructor(private personCtrl: PersonController,
              public dialogService: MatDialog
    ){
    this.dataRecordsSource = this.personCtrl.tableDataSource;
  }

  ngOnInit(){
    this.dataSource = new CommunityDataSource(this.dataRecordsSource, this.paginator, this.sort)
    this.personCtrl.selectionModel = this.selection;
    this.actionList = this.personCtrl.tableActions;

    this.displayedColumns.forEach(elem =>{
      this.table_columns_sel[elem] = true;
    })

    this.dataRecordsSource.subscribe(prod =>{
      //this.acumCurrencies(prod)
    })
  }

  ngOnChanges(){
    console.log('********** ngOnChanges;')
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
    console.log('open Editor. Click [%s] [%s]', item._id, item.displayName);
    item.editflds[col] = item.editflds[col] > 1 ? 0 : item.editflds[col] + 1
    item.total = item.pu * item.qt;
    this.personCtrl.updateCommunityList(item);
  }

  changeAction(action: MatSelectChange){
    //console.log('Action selected:[%s] [%s] [%s]', this.selectedAction, action.value, action.source.value ); 
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
        console.log('Accepted selected');
        this.buildColumDef();
      } 

    }) 
  }

  changeCheckBx(event:MatCheckboxChange , col, cols){
    //console.log('generic Dialog changeCheckBx: [%s] [%s]',  event.checked.valueOf() , arguments.length)
  }

  getLabel(item:string, arr:Array<any>, prefix: string):string{
    let label =  arr.find(x => x.val === item).label
    if(item === 'no_definido') label = "";
    return prefix ? prefix + label : label;
  }

}



export class CommunityDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  constructor(private sourceData: BehaviorSubject<PersonTable[]>,
              private _paginator: MatPaginator,
              private _sort: MatSort){
    super();
    console.log('Constructor Community Data Source: [%s]', this._sort)
  }

  connect(): Observable<PersonTable[]> {
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

  getSortedData(): PersonTable[]{
    const data = this.sourceData.value.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'personType':   [propertyA, propertyB] = [a.personType, b.personType]; break;
        case 'displayName':  [propertyA, propertyB] = [a.displayName, b.displayName]; break;
        case 'email':        [propertyA, propertyB] = [a.email, b.email]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {}
}
