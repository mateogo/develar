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
  @Input() masterperiferia: any;
  @Input() recursos: Recurso[] = [];
  @Input() servicio: string =''
  @Output() asignarRecursosEvent = new EventEmitter<AsignarRecursoEvent>();

  public sinternaciones: SolicitudInternacion[] = [];

  public disponible;
  public camasList = [];
  public recursosList: Recurso[]  = [];

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.disponible = this.capacidad - this.ocupacion;

    this.recursosList = this.recursos.filter(rr => rr.estado === 'libre');
    this.buildSolinternacionesArray(this.masterperiferia);

  }
  private buildSolinternacionesArray(master){
    this.sinternaciones = [];

    Object.keys(master).forEach(key => {
      let solList = master[key] as SolicitudInternacion[];
      solList.forEach(s => {
        if(s.internacion.servicio === this.servicio){
          this.sinternaciones.push(s);
        }
      })
    })

  }
  private sliceInternacionFromArray(sol: SolicitudInternacion){
    this.sinternaciones = this.sinternaciones.filter(s => s != sol);
  }

  onClick(){
    const dialogRef = this.dialog.open(
      RecursosModalComponent,
      {
        width: '350px',
        data: {

          masterperiferia: this.sinternaciones,
          sinternaciones: this.sinternaciones,


          recursos: this.recursosList,
          servicio: this.servicio,
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: AsignarRecursoEvent) => {
      if(res && res.sinternacion){
        let solinternacion = res.sinternacion;
        if(solinternacion) this.sliceInternacionFromArray(solinternacion);

        this.asignarRecursosEvent.emit(res);        
      }
    });
  }

}
