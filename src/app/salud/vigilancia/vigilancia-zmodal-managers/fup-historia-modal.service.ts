import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../salud.controller';

import { PersonService } from '../../person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../entities/person/person';

import {  Asistencia, 
          UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../asistencia/asistencia.model';

import { VigilanciaSeguimientohistoryComponent } from '../vigilancia-zmodal/vigilancia-seguimientohistory/vigilancia-seguimientohistory.component';


const UPDATE =   'update';
const CANCEL =   'cancel';
const ERROR =    'error';

@Injectable()
export class FollowUpHistoriaModalService {
  private person: Person;
	private asistencia: Asistencia;
	private dialogResult$ = new Subject<UpdateAsistenciaEvent>();

  constructor(
    public dialog: MatDialog,
    private perSrv: PersonService,
    private dsCtrl: SaludController,

  	) {}


  openDialog(asistencia: Asistencia ): Subject<UpdateAsistenciaEvent>{
  	this.asistencia = asistencia;
  	this.loadAsistencia(asistencia._id)
  	return this.dialogResult$;
  }

  private loadAsistencia(asistenciaId){
    this.dsCtrl.fetchAsistenciaById(asistenciaId).then(asis=> {
    	if(asis){

    		this.asistencia = asis;

        this.openModalDialog(this.asistencia);

    	}else {
    		this.fireError('Error: No se pudo recuperar la Asistencia', 'ATENCIÓN')
    		return;
    	}

    })

  }


  private openModalDialog(asistencia: Asistencia){
    const dialogRef = this.dialog.open(
      VigilanciaSeguimientohistoryComponent,
      {
        width: '800px',
        data: {
          asistencia: asistencia,
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
