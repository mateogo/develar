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
					Alimento, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';


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
    fe_visita:   string;
    fe_visita_ts: number;
    ruta:         string;
    trabajador:   string;
    trabajadorId: string;
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
  selector: 'sol-table',
  templateUrl: './sol-list-table.component.html',
  styleUrls: ['./sol-list-table.component.scss']
})
export class SolListTableComponent implements OnInit {
  @Input() public displayedColumns =  ['select', "compNum", "avance", "personSlug", "fecomp_txa", "covid", "locacion", "osocial"];
  @Input() isColSelectionAllowed = true;
  @Output() private actionTriggered: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private table_columns = ['select',  "asistenciaId", "compName", "compNum", "avance", "personId", "personSlug", "fecomp_tsa", "fecomp_txa", "covid", "action", "slug", "locacion", "osocial",  "description", "sector", "estado", "ts_alta", "fe_visita", "fe_visita_ts", "ruta", "trabajador", "trabajadorId"];

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
    'ts_alta':    false,
    'fe_visita':  false,
    'ruta':       false,
    'trabajador': false,
  }


  private dataRecordsSource: BehaviorSubject<AsistenciaTable[]>;
  private readonly CERO   = 0;
  private readonly UNO    = 1;
  private readonly DOS    = 2;
  private readonly TRES   = 3;
  private readonly CUATRO = 4;
  private readonly CINCO  = 5;

  public selectedAction: string = 'no_definido';
  public actionList: Array<any> = [];

  public dataSource: DataSource<any>;

  public selection = new SelectionModel<AsistenciaTable>(true, []);

  constructor(
			private dsCtrl: SaludController,
			public dialogService: MatDialog
    ){
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
      //this.acumCurrencies(token)
    })

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


  openEditor(item, col){
    item.editflds[col] = item.editflds[col] > 1 ? 0 : item.editflds[col] + 1
    item.total = item.pu * item.qt;
    this.dsCtrl.updateAsistenciaListItem(item);
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
    //console.log('generic Dialog changeCheckBx: [%s] [%s]',  event.checked.valueOf() , argavancents.length)
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
        case 'slug':          [propertyA, propertyB] = [a.slug, b.slug]; break;
        case 'fecomp_txa':    [propertyA, propertyB] = [a.fecomp_tsa, b.fecomp_tsa]; break;
        case 'avance':        [propertyA, propertyB] = [a.avance, b.avance]; break;
        case 'ruta':          [propertyA, propertyB] = [a.ruta, b.ruta]; break;
        case 'trabajador':    [propertyA, propertyB] = [a.trabajadorId, b.trabajadorId]; break;
        case 'personSlug':    [propertyA, propertyB] = [a.personSlug, b.personSlug]; break;
        case 'fe_visita':     [propertyA, propertyB] = [a.fe_visita_ts, b.fe_visita_ts]; break;
      }

/*

    'select':     false,
    'compName':   false,
    'compNum':    false,
    'personSlug': false,
    'fecomp_tsa': false,
    'fecomp_txa': false,
    'action':     false,
    'slug':       false,
    'description':false,
    'sector':     false,
    'estado':     false,
    'avance':     false,
    'ts_alta':    false,
    'fe_visita':  false,
    'ruta':       false,
    'trabajador': false,


*/


      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {}

}
