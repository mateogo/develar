import { Component, OnInit } from '@angular/core';
import { CentroOperacionesFacade } from '../../centro-operaciones.facade';
import { Observable} from 'rxjs';
import { BotonContador } from '../../../develar-commons/base.model';

import { MatDialog } from '@angular/material/dialog';
import { SolicitudesInternacionModalComponent } from '../../components/solicitudes-internacion-modal/solicitudes-internacion-modal.component';
import { TransitoModalComponent } from '../../components/servicio/transito-modal/transito-modal.component';

const SERVICIOS = [
  {
    id: 'uti',
    nombre: 'Terapia intensiva',
    solicitudes$: undefined
  },
  {
    id: 'ute',
    nombre: 'Terapia intermedia',
    solicitudes$: undefined
  },
  {
    id: 'is',
    nombre: 'Internación simple',
    solicitudes$: undefined
  },
  {
    id: 'ais',
    nombre: 'Aislamiento',
    solicitudes$: undefined
  },
  {
    id: 'gua',
    nombre: 'Guardia',
    solicitudes$: undefined
  },
  {
    id: 'ped',
    nombre: 'Pediatría',
    solicitudes$: undefined
  },
];

@Component({
  selector: 'app-centro-operaciones',
  templateUrl: './centro-operaciones.component.html',
  styleUrls: ['./centro-operaciones.component.scss']
})
export class CentroOperacionesComponent implements OnInit {

  solicitudesInternacion$: Observable<any[]>;
  locaciones$: Observable<any[]>;
  botonesServicios$: Observable<BotonContador[]>;

  capacidadEfectiva$: Observable<any>;
  capacidadReal$: Observable<any>;
  
  servicios;

  constructor(
    private _facade: CentroOperacionesFacade,
    private dialog: MatDialog,
  ) {
    this.solicitudesInternacion$ = this._facade.loadSolicitudesInternacion$();
    this.locaciones$             = this._facade.loadLocaciones$();
    this.botonesServicios$       = this._facade.loadBotonesServicios$();
  }
  
  ngOnInit() {
    //TODO: hacer corresponder esto con la realidad...
    this.servicios = SERVICIOS;
    
    this.servicios.forEach(s => {
      s.solicitudes$ = this.solicitudesInternacion$;
    });
  }

  controlesVer(option){
    console.log('ver %o', option);
  }

  onBotoneraClick(botonId){
    //TODO: abrir modal con los datos que se corresponden al botonId
    this.solicitudesInternacion$.subscribe(solicitudesInternacion => {
      this.botonesServicios$.subscribe(botones => {
        const dialogRef = this.dialog.open(
          SolicitudesInternacionModalComponent,
          {
            width: '80%',
            data: {
              titulo: botones.find(b => b.id === botonId).label,
              solicitudes: solicitudesInternacion.map(sol => sol.requeridox) //find usando el botonId
            }
          }
        );
  
        dialogRef.afterClosed().subscribe(seleccionadas => {
          //TODO: luego de seleccionar solicitudes de internación...
        });
      });
    });
  }

  onTransitoClick(locacion){
    this.solicitudesInternacion$.subscribe(solicitudesInternacion => {
      const dialogRef = this.dialog.open(
        TransitoModalComponent,
        {
          width: '450px',
          data: {
            pacientes: solicitudesInternacion.map(s => s.requeridox),
            nombreCentroSalud: locacion.name
          }
        }
      );
    
      dialogRef.afterClosed().subscribe(
        res => {
        //TODO: derivar los pacientes
        }
      );
    });

  }

  
}
