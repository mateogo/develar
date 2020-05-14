import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';
import { MatCheckboxChange } from '@angular/material';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map }   from 'rxjs/operators';

import { MatPaginator, MatSort } from '@angular/material';

import { GenericDialogComponent } from '../../../../develar-commons/generic-dialog/generic-dialog.component';


import { SaludController } from '../../../salud.controller';

import {  Person } from '../../../../entities/person/person';

import { 	Asistencia,
					AsistenciaTable, 
					AsistenciaHelper } from '../../../asistencia/asistencia.model';


/**
 * @displayedColumns
    asistenciaId: string;
    compName:    string;
    compNum:     string;
    personId:    string;
    personSlug:  string;
    fecomp_tsa:  number;
    fecomp_txa:  string;
    action:      string;
    slug:        string;
    description: string;
    sector:      string;
    estado:      string;
    avance:      string;
    ts_alta:     number;
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
  selector: 'vigilancia-reportes-table',
  templateUrl: './vigilancia-reportes-table.component.html',
  styleUrls: ['./vigilancia-reportes-table.component.scss']
})
export class VigilanciaReportesTableComponent implements OnInit {
  @Input() public displayedColumns =  ['select', "compNum", "avance", "prioridad", "personSlug", "faudit_alta", "covid", "locacion", "osocial"];
  @Input() isColSelectionAllowed = true;
  @Output() private actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private table_columns = ['select',  "asistenciaId", "compName", "compNum", "avance", "prioridad", "personId", "ndoc", "personSlug", "telefono", "edad", "faudit_alta","faudit_um", "fecomp_tsa", "fecomp_txa", "covidAcutalSate", "covidSintoma", "covidAvance", "covid", "action","covidTxt", "reportadoPor", "fe_reportado", "lab_laboratorio", "lab_fe_toma", "lab_estado","slug", "locacion", "osocial",  "description", "sector", "estado", "ts_alta"];

  private table_columns_sel = {
    'select':     false,
    'compName':   false,
    'compNum':    false,
    'personSlug': false,
    'fecomp_tsa': false,
    'fecomp_txa': false,
    'action':     false,
    'locacion':   false,
    'osocial':    false,
    'covid':      false,
    'slug':       false,
    'description':false,
    'sector':     false,
    'estado':     false,
    'avance':     false,
    'prioridad':  false,
    'ts_alta':    false,
  }

  public itemsLength: number = 0;

  private dataRecordsSource: BehaviorSubject<AsistenciaTable[]>;

  public selectedAction: string = 'no_definido';

  public actionList: Array<any> = [];

  public dataSource: DataSource<any>;

  public selection = new SelectionModel<AsistenciaTable>(true, []);

  constructor(
			private dsCtrl: SaludController,
			public dialogService: MatDialog
    ){
    this.displayedColumns = LABORATORIO;
    this.dataRecordsSource = this.dsCtrl.asistenciasDataSource;
  }

  ngOnInit(){
    this.dataSource = new TableDataSource(this.dataRecordsSource, this.paginator, this.sort)
    this.dsCtrl.selectionModel = this.selection;
  	this.actionList = AsistenciaHelper.getOptionlist('tableactions');

    this.displayedColumns.forEach(elem =>{
      this.table_columns_sel[elem] = true;
    })

    this.dataRecordsSource.subscribe(token =>{
      this.itemsLength = token && token.length;
    })

  }

  ngOnChanges(){
    //c onsole.log('********** ngOnChanges;')
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
    this.dsCtrl.updateAsistenciaListItem(item);
  }

  changeAction(action: MatSelectChange){
    //c onsole.log('Action selected:[%s] [%s] [%s]', this.selectedAction, action.value, action.source.value ); 
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
    //c onsole.log('generic Dialog changeCheckBx: [%s] [%s]',  event.checked.valueOf() , argavancents.length)
  }

  getLabel(item:string, arr:Array<any>, prefix: string):string{
    let label =  arr.find(x => x.val === item).label
    if(item === 'no_definido') label = "";
    return prefix ? prefix + label : label;
  }

}



export class TableDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  constructor(private sourceData: BehaviorSubject<AsistenciaTable[]>,
              private _paginator: MatPaginator,
              private _sort: MatSort){
    super();

  }

  connect(): Observable<AsistenciaTable[]> {

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

  getSortedData(): AsistenciaTable[]{
    const data = this.sourceData.value.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'sector':        [propertyA, propertyB] = [a.sector, b.sector]; break;
        case 'compNum':       [propertyA, propertyB] = [a.asistenciaId, b.asistenciaId]; break;
        case 'action':        [propertyA, propertyB] = [a.action, b.action]; break;
        case 'prioridad':     [propertyA, propertyB] = [a.prioridad, b.prioridad]; break;
        case 'slug':          [propertyA, propertyB] = [a.slug, b.slug]; break;
        case 'fecomp_txa':    [propertyA, propertyB] = [a.fecomp_tsa, b.fecomp_tsa]; break;
        case 'avance':        [propertyA, propertyB] = [a.avance, b.avance]; break;
        case 'personSlug':    [propertyA, propertyB] = [a.personSlug, b.personSlug]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {}

}


const LABORATORIO = [
          'select',
          'personSlug',

]