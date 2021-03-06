import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../salud/salud.controller';

import { PersonService } from '../../salud/person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../entities/person/person';

import {  Asistencia, 
          Novedad,
          UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../salud/asistencia/asistencia.model';

import { VigilanciaNovedadesComponent } from '../../salud/vigilancia/vigilancia-zmodal/vigilancia-novedades/vigilancia-novedades.component';

const ROLE_ADMIN = 'vigilancia:admin';
const UPDATE =   'update';
const CANCEL =   'cancel';
const ERROR =    'error';

@Injectable()
export class NovedadesFollowUpService {
  private person: Person;
  private asistencia: Asistencia;
  private dialogResult$ = new Subject<UpdateAsistenciaEvent>();

  constructor(
    public dialog: MatDialog,
    private perSrv: PersonService,
    private dsCtrl: SaludController,

    ) {}


  openDialog(asistencia: Asistencia, novedad: Novedad ): Subject<UpdateAsistenciaEvent>{
    this.asistencia = asistencia;

    this.loadAsistencia(asistencia._id, novedad);

    return this.dialogResult$;
  }


  private loadAsistencia(asistenciaId, novedad: Novedad){
    this.dsCtrl.fetchAsistenciaById(asistenciaId).then(asis=> {
      if(asis){

        this.asistencia = asis;
        this.openModalDialog(this.asistencia, novedad);

      }else {
        this.fireError('Error: No se pudo recuperar la Asistencia', 'ATENCIÓN')
        return;
      }

    })
  }

  private openModalDialog(asistencia: Asistencia, novedad: Novedad){
    const dialogRef = this.dialog.open(
      VigilanciaNovedadesComponent,
      {
        width: '800px',
        data: {
          asistencia: asistencia,
          novedad: novedad

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
        if(res) this.dialogResult$.next(res);
        else this.fireCancel();
    });    

  }

  private fireError(msj: string, action: string){
    this.dsCtrl.openSnackBar(msj, action);

    this.dialogResult$.next({
      action: ERROR,
      type: msj,
      token: this.asistencia
    } as UpdateAsistenciaEvent)
  }

  private fireCancel(){
    this.dialogResult$.next({
      action: CANCEL,
      type: 'operación cancelada',
      token: null
    } as UpdateAsistenciaEvent)
  }

}
