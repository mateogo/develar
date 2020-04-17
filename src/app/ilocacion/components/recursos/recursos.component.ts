import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecursosModalComponent } from './recursos-modal/recursos-modal.component';

import {     SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
                    Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
                    MasterAllocation, AsignarRecursoEvent } from '../../../salud/internacion/internacion.model';

import { LocacionHospitalaria, Recurso} from '../../../entities/locaciones/locacion.model';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit {
  @Input() capacidad = 0;
  @Input() ocupacion = 0;
  @Input() sinternaciones: SolicitudInternacion[];
  @Input() recursos: Recurso[] = [];
  @Input() servicio: string =''
  @Output() asignarRecursosEvent = new EventEmitter<AsignarRecursoEvent>();

  public disponible;
  public camasList = [];
  public recursosList: Recurso[]  = [];

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.disponible = this.capacidad - this.ocupacion;

    this.recursosList = this.recursos.filter(rr => rr.estado === 'libre');

  }

  onClick(){
    const dialogRef = this.dialog.open(
      RecursosModalComponent,
      {
        width: '350px',
        data: {

          masterperiferia: this.sinternaciones,


          recursos: this.recursosList,
          servicio: this.servicio,
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: AsignarRecursoEvent) => {
      this.asignarRecursosEvent.emit(res);
    });
  }

}
