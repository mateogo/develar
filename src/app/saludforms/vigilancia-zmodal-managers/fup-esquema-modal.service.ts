import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../salud/salud.controller';

import { PersonService } from '../../salud/person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../entities/person/person';

import {  Asistencia, 
          UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../salud/asistencia/asistencia.model';

import { VigilanciaSeguimientoComponent } from '../../salud/vigilancia/vigilancia-zmodal/vigilancia-seguimiento/vigilancia-seguimiento.component';

const ROLE_ADMIN = 'vigilancia:admin';

const UPDATE =   'update';
const CANCEL =   'cancel';
const ERROR =    'error';

@Injectable()
export class FollowUpEsquemaModalService {
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

    this.validateCredentials(asistencia);

  	return this.dialogResult$;
  }

  private validateCredentials(asistencia: Asistencia){
    if(!this.checkUserPermission(ROLE_ADMIN)){

      this.fireError('Acceso restringido', 'ATENCIÓN')

    }else {
      this.loadAsistencia(asistencia._id)

    }    
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

  private checkIfHasFollowUpConfigured(asistencia): boolean{
    let valid = false;

    if(!asistencia.followUp) return valid;
    if(!(asistencia.followUp.isActive && asistencia.followUp.fe_inicio && asistencia.followUp.tipo) ) return valid;

    valid = true;
    return valid;
  }

  private checkUserPermission(role: string):boolean{
    return this.dsCtrl.isUserMemberOf(role);

  }


  private openModalDialog(asistencia: Asistencia){
    const dialogRef = this.dialog.open(
      VigilanciaSeguimientoComponent,
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
