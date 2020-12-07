import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TurnoHelper } from '../../../entities/turnos/turno.helper';
import { Turno, TurnoTable } from '../../../entities/turnos/turno.model';

@Component({
  selector: 'turnos-industriales-browse-table',
  templateUrl: './turnos-industriales-browse-table.component.html',
  styleUrls: ['./turnos-industriales-browse-table.component.scss']
})
export class TurnosIndustrialesBrowseTableComponent implements OnInit {

  // -----------------------------------------------------
  // Datos para mostrar que me los pasa TurnosBrowse
  @Input() data$: Observable<Turno[]>;

  // -----------------------------------------------------
  // Emisor de evento de cancelación de turno
  @Output() cancelTurno: EventEmitter<string> = new EventEmitter<string>();

  public displayedColumns: string[] = [
    // 'select',
    'txFechaHora',
    'sede',
    'tipoConsulta',
    'detalle',
    'estado',
    'rowactions'
  ];
  private initialSelection = [];
  private allowMultiSelect = true;
  public selection = new SelectionModel<Turno>(this.allowMultiSelect, this.initialSelection);
  public dataSource: TurnosDataSource;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new TurnosDataSource(this.data$);
    this.dataSource.loadTurnos();
  }

  ngOnChanges(): void {
    if (this.dataSource) {
      this.dataSource.loadTurnos();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.turnosCountSubject.value;
    return numSelected === numRows;
  }


  masterToggle() {
    // this.isAllSelected() ?
    //     this.selection.clear() :
    //     this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public editItem(turno: Turno): void {
    this._router.navigate(['editar', turno._id], { relativeTo: this._route });
  }

  public deleteItem(turno: Turno): void {
    this.cancelTurno.emit(turno._id);
  }

}

class TurnosDataSource implements DataSource<TurnoTable> {
  private turnosSubject = new BehaviorSubject<TurnoTable[]>([]);
  public turnosCountSubject = new BehaviorSubject<Number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private data$: Observable<Turno[]>;
  public loading$ = this.loadingSubject.asObservable();


  constructor(
    data$: Observable<Turno[]>,
  ) {
    this.data$ = data$;
  }

  connect(collectionViewer: CollectionViewer): Observable<TurnoTable[]> {
    return this.turnosSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.turnosSubject.complete();
    this.loadingSubject.complete();
  }

  // loadTurnos(personId: string, filter: string, sortDirection: string, pageIndex: number, pageSize: number) {
  loadTurnos() {
    this.loadingSubject.next(true);

    this.data$.pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(turnos => {
      this.turnosCountSubject.next(turnos.length);
      this.turnosSubject.next(TurnoHelper.buildTurneraBrowseDataTable(turnos));
    });
  }
}