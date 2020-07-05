import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map }   from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { GenericDialogComponent } from '../../../../develar-commons/generic-dialog/generic-dialog.component';

import { LocacionHospitalaria, LocacionHospTable, LocacionEvent} from '../../locacion.model';

import { LocacionHelper } from '../../locacion.helper';

import { LocacionService } from '../../locacion.service';

const changeColumnFromTable = {
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
  selector: 'locacion-table',
  templateUrl: './locacion-table.component.html',
  styleUrls: ['./locacion-table.component.scss']
})
export class LocacionTableComponent implements OnInit {
  @Input() public displayedColumns =  ['select', "code", "type", "slug"];
  @Input() isColSelectionAllowed = true;
  @Output() private actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private table_columns =  ['select', "code", "type", "slug"];

  private table_columns_sel = {
    'select':     false,
    'code':       false,
    'type':       false,
    'slug':       false,
  }


  private dataRecordsSource: BehaviorSubject<LocacionHospTable[]>;
  private readonly CERO   = 0;
  private readonly UNO    = 1;
  private readonly DOS    = 2;
  private readonly TRES   = 3;
  private readonly CUATRO = 4;
  private readonly CINCO  = 5;

  public selectedAction: string = 'no_definido';
  public actionList: Array<any> = [];

  public dataSource: DataSource<any>;

  public selection = new SelectionModel<LocacionHospTable>(true, []);

  constructor(
			private locSrv: LocacionService,
			public dialogService: MatDialog
    ){
    this.dataRecordsSource = this.locSrv.locacionesDataSource;
  }

  ngOnInit(){
    this.dataSource = new TableDataSource(this.dataRecordsSource, this.paginator, this.sort)
    this.locSrv.selectionModel = this.selection;
  	this.actionList = LocacionHelper.getOptionlist('tableactions');

    this.displayedColumns.forEach(elem =>{
      this.table_columns_sel[elem] = true;
    })

    this.dataRecordsSource.subscribe(token =>{
    })

  }

  ngOnChanges(){
    //console.log('********** ngOnChanges;')
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataRecordsSource.value.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataRecordsSource.value.forEach(row => this.selection.select(row));
  }


  openEditor(item, col){
  	//ToDo
    item.editflds[col] = item.editflds[col] > 1 ? 0 : item.editflds[col] + 1
    item.total = item.pu * item.qt;
    //this.locSrv.updateAsistenciaListItem(item);
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
    changeColumnFromTable.data.itemplate = templ;
    this.openDialog(changeColumnFromTable).subscribe(result => {
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

}



export class TableDataSource extends DataSource<any> {
  constructor(private sourceData: BehaviorSubject<LocacionHospTable[]>,
              private _paginator: MatPaginator,
              private _sort: MatSort){
    super();
  }

  connect(): Observable<LocacionHospTable[]> {

    const displayDataChanges = [
      this.sourceData,
      this._paginator.page,
      this._sort.sortChange
    ];

    return merge(...displayDataChanges).pipe(
        map(() => {
          const data = this.getSortedData();

          const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
          return data.splice(startIndex, this._paginator.pageSize);
        })
     );

  }

  getSortedData(): LocacionHospTable[]{
    const data = this.sourceData.value.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'code':       [propertyA, propertyB] = [a.code, b.code]; break;
        case 'slug':       [propertyA, propertyB] = [a.slug, b.slug]; break;
        case 'type':       [propertyA, propertyB] = [a.type, b.type]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {}

}


