import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';

import { DataSource, SelectionModel } from '@angular/cdk/collections';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map }   from 'rxjs/operators';

import { GenericDialogComponent } from '../../develar-commons/generic-dialog/generic-dialog.component';

import { NotificationController } from '../notification.controller';
import { ConversationTable }  from '../notification.model';

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


@Component({
  selector: 'notification-table',
  templateUrl: './notification-browse.component.html',
  styleUrls: ['./notification-browse.component.scss'],
  providers: [GenericDialogComponent]
})
export class NotificationBrowseComponent implements OnInit, OnChanges {
  @Input() displayedColumns = [ 'select','fetxt', 'to', 'slug', 'folder'];
  @Input() isColSelectionAllowed = true;
  @Output() actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //private table_columns = ["select", "predicate", "milestoneLabel", "displayAs",  "slug", "entityId", "qtx", "qt", "ume", "freq", 'fume' , "pu", 'moneda', "total", 'ars', 'usd','eur', 'brl'];
  private table_columns = ["select", "fetxt", "type", "slug", 'folder', 'topic', 'from','to'];
  private table_columns_sel = {
                               "select":  false,
                               "fetxt":  false,
                               "type":   false,
                               "slug":   false,
                               "folder": false,
                               "topic":  false,
                               "to":    false,
                               "from":  false,
                              }

  private readonly CERO   = 0;
  private readonly UNO    = 1;
  private readonly DOS    = 2;
  private readonly TRES   = 3;
  private readonly CUATRO = 4;
  private readonly CINCO  = 5;

  private dataRecordsSource: BehaviorSubject<ConversationTable[]>;
  public selectedAction: string = 'no_definido';

  private slugFld = 0;
  private totalCurrency;
  public totals = [];

  public dataSource: DataSource<any>;

  // new SelectionModel<EntityType>(allowMultiSelect, initialSelection)
  public actionList: Array<any> = [];
  public selection = new SelectionModel<ConversationTable>(true, []);

  constructor(
  		private notifCtrl: NotificationController,
			public dialogService: MatDialog
    ){
    this.dataRecordsSource = this.notifCtrl.tableDataSource;
  }

  ngOnInit(){
    this.dataSource = new ConversationDataSource(this.dataRecordsSource, this.paginator, this.sort)
    this.notifCtrl.selectionModel = this.selection;
    this.actionList = this.notifCtrl.tableActions;

    this.displayedColumns.forEach(elem =>{
      this.table_columns_sel[elem] = true;
    })

    this.dataRecordsSource.subscribe(prod =>{
      //this.acumCurrencies(prod)
    })

    //load records
    //console.log('notification-browse fetch users')
    //this.notifCtrl.fetchUserConversations(null);
  }

  ngOnChanges(){
    //console.log('********** ngOnChanges;')
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

  // editor en la celda de la tabla
  openEditor(item, col){
    item.editflds[col] = item.editflds[col] > 1 ? 0 : item.editflds[col] + 1
    item.total = item.pu * item.qt;
    this.notifCtrl.updateEditedDataInTable(item);
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



export class ConversationDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  constructor(private sourceData: BehaviorSubject<ConversationTable[]>,
              private _paginator: MatPaginator,
              private _sort: MatSort){
    super();

  }

  connect(): Observable<ConversationTable[]> {
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

  getSortedData(): ConversationTable[]{
    const data = this.sourceData.value.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'slug':  [propertyA, propertyB] = [a.slug, b.slug]; break;
        case 'fe':       [propertyA, propertyB] = [a.fe, b.fe]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {}
}
