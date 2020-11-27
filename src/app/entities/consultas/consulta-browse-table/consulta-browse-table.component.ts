import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { map } from 'rxjs/operators';



import { PersonService } from '../../person/person.service';
import { Consulta, ConsultaTable } from '../consulta.model';
import { ConsultaHelper } from '../consulta.helper';
import { ConsultasService } from '../consultas.service';
import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';
import { UserService } from '../../user/user.service';
import { PasesFromConsultaComponent } from '../pases-from-consulta/pases-from-consulta.component';
import { ConsultaToTurnoComponent } from '../consulta-to-turno/consulta-to-turno.component';
import { RequirenteTurno, Turno } from '../../turnos/turno.model';
import { devutils } from '../../../develar-commons/utils';
import { TurnosService } from '../../turnos/turnos.service';
import { UserWeb } from '../../user-web/user-web.model';


const ESTADO_END = 'cerrado';


class ConsultasDataSource extends DataSource<ConsultaTable> {
  private data$: BehaviorSubject<ConsultaTable[]>;

  constructor(
    recordsSource$: BehaviorSubject<ConsultaTable[]>,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.data$ = recordsSource$;
  }

  connect(collectionViewer: CollectionViewer): Observable<ConsultaTable[]> {
    const displayDataChanges = [
      this.data$,
      this._paginator.page,
      this._sort.sortChange,
    ];

    return merge(...displayDataChanges).pipe(
      map(() => {
        const data = this._getSortedData();
        this._paginator.length = data.length;
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        return data.splice(startIndex, this._paginator.pageSize);
      })
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {  }

  private _getSortedData(): ConsultaTable[] {
    const data = this.data$.value.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

      return data.sort((a, b) => {
        let propertyA: number | string = '';
        let propertyB: number | string = '';

        switch (this._sort.active) {
          // case 'ndoc':
          //   [propertyA, propertyB] = [a.ndoc, b.ndoc];
          //   break;
        }

        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (
          (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
        );
      });
  }
}






const deleteConsultaDialog = {
  width:  '330px',
  height: '260px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    title: 'Confirme la acción',
    body: '¿Confirma eliminación de la consulta?',
    accept: {
      action: 'accept',
      label: 'Aceptar'
    },
    cancel: {
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};




@Component({
  selector: 'consultas-browse-table',
  templateUrl: './consulta-browse-table.component.html',
  styleUrls: ['./consulta-browse-table.component.scss']
})
export class ConsultaBrowseTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = [
    'select',
    // 'ndoc',
    'displayName',
    'txFecha',
    'descripcion',
    'tipo',
    'ejecucion',
    'sector',
    'rowactions',
  ];

  public selection = new SelectionModel<ConsultaTable>(true, []);
  public dataSource: ConsultasDataSource;
  private dataRecordsSource: BehaviorSubject<ConsultaTable[]> = new BehaviorSubject<ConsultaTable[]>([]);

  constructor(
    private consultaService: ConsultasService,
    private turnoService: TurnosService,
    private dialogService: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private personService: PersonService
  ) {
    this.dataRecordsSource = this.consultaService.dataRecordsSource;

  }

  ngOnInit(): void {
    this.dataSource = new ConsultasDataSource(this.dataRecordsSource, this.paginator, this.sort);
  }

  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataRecordsSource.value.length;
    return numSelected === numRows;
  }

 public masterToggle(): void {
   this.isAllSelected() ?
     this.selection.clear() :
     this.dataRecordsSource.value.forEach(row => this.selection.select(row));
 }



 public editarItem(consulta: ConsultaTable): void {
  this.router.navigate(['editar', consulta._id], { relativeTo: this.route });
}

/**
 * Elimina una consulta; en realidad, es una eliminación 'lógica': cambia el
 * 'estado' de la consulta a 'baja' (i.e. consulta dada de baja)
 *
 * @param consulta El objeto Consulta que se va a eliminar
 */
public deleteItem(consulta: ConsultaTable): void {
  this.openDialog(deleteConsultaDialog).subscribe(result => {
    if (result === 'accept') {
      this.consultaService.delete(consulta._id).then(isDeleted => {

        const pase = ConsultaHelper.generarPaseBaja(this.userService.currentUser);
        let consultaObj = consulta.consulta;
        pase.sector = consulta.sector;
        consultaObj.estado = pase.estado;
        consultaObj.ejecucion = pase.ejecucion;
        consultaObj.isActive = false;
        consultaObj.pases.push(pase);
        this.consultaService.edit(consulta._id, consultaObj).then(success => {
          this.dataRecordsSource.value.map(item => {
            if (item._id === consulta._id) {
              item.estado = ESTADO_END;
              item.isActive = false;
              item.ejecucion = ConsultaHelper.getOptionLabel('ejecucion','anulado');
            }
          });
        });
      });
    }
  });
}

private openDialog(config): Observable<any> {
  const dialogRef = this.dialogService.open(GenericDialogComponent, config);
  return dialogRef.afterClosed();
}



  /**
   * Genera un turno a partir de una consulta, mediante ventana modal
   *
   * @param consulta Los datos de la consulta a partir de la que se genera
   *                 el turno
   */
  public turnoFromConsulta(consulta: Consulta) {
    const dialogRef = this.dialogService.open(ConsultaToTurnoComponent, {
      data: consulta
    });

    dialogRef.afterClosed().subscribe(result => {
      // result contiene los datos cargados en el formulario del
      // popup, con los que se creará el turno
      if (result && result.data) {
        const turno = new Turno();
        turno.requirente = new RequirenteTurno();

        turno.estado = 'activo';
        turno.avance = 'pendiente';
        turno.tipoConsulta = result.data.tipoConsulta;
        turno.sede = result.data.sede;
        turno.detalle = result.data.detalle;
        turno.txFecha = devutils.txFromDate(result.data.txFecha._d);
        turno.txHora = result.data.txHora;
        turno.tsFechaHora = devutils.dateFromTx(turno.txFecha + ' ' + turno.txHora).getTime();
        turno.source = 'admin';
        turno.turnoId = result.data.turnoId;

        // Para completar correctamente el turno, obtengo los datos de la persona
        const usuarioAgn = new UserWeb();
        usuarioAgn._id = consulta.requirente.userId;
        this.personService.fetchPersonByUserWeb(usuarioAgn).subscribe(person => {
          if (person && person.length > 0) {
            turno.requirente.userId = consulta.requirente.userId;
            turno.requirente.personId = person[0]._id;
            turno.requirente.ndoc = person[0].ndoc;
            turno.requirente.displayName = person[0].displayName;

            this.turnoService.create(turno).then(turnoResult => {
              if (turnoResult) {
                consulta.estado = 'Cumplido';
                this.consultaService.edit(consulta._id, consulta).then(consultaResult => {
                });
              } else {
                // TODO: Handle error
              }
            });
          } else {
            // TODO: Handle error
          }
        });
      }
    });
  }

public showPases(consulta: Consulta): void {
   this.dialogService.open(PasesFromConsultaComponent, {
     data : consulta._id});
 }
}
