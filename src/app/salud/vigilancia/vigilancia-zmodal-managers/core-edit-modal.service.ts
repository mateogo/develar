import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../salud.controller';

import { PersonService } from '../../person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../entities/person/person';

import {  Asistencia, 
          UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../asistencia/asistencia.model';

import { VigilanciaCoredataComponent }    from '../vigilancia-zmodal/vigilancia-coredata/vigilancia-coredata.component';

const UPDATE =   'update';
const CANCEL =   'cancel';
const ERROR =    'error';

@Injectable()
export class CoreEditModalService {
  private person: Person;
	private asistencia: Asistencia;
	private closeResult$ = new Subject<UpdateAsistenciaEvent>();

  constructor(
    public dialog: MatDialog,
    private perSrv: PersonService,
    private dsCtrl: SaludController,

  	) {}

  whoami(){
  	console.log('CoreEditModal')
  }

  openDialog(asistencia: Asistencia ): Subject<UpdateAsistenciaEvent>{
  	console.log('Hey!')
  	this.asistencia = asistencia;
  	this.loadAsistencia(asistencia._id)

  	return this.closeResult$;

  }

  private loadAsistencia(asistenciaId){
    this.dsCtrl.fetchAsistenciaById(asistenciaId).then(asis=> {
    	if(asis){
    		this.asistencia = asis;
  			this.loadPerson(this.asistencia);

    	}else {
        this.dsCtrl.openSnackBar('Error: No se pudo recuperar la Asistencia', 'ATENCIÓN')
    		this.fireError('Error: No se pudo recuperar la Asistencia')
    		return;

    	}

    })

  }


  private loadPerson(token: Asistencia){
    let personId = token.idPerson;
    let vinculoPerson: Person;

    if(!personId){
      this.dsCtrl.openSnackBar('Error: solicitud de vigilancia sin identificación de Persona', 'ATENCIÓN')
      return;
    }

    this.perSrv.fetchPersonById(personId).then(per => {
      if(per){
        this.person = per;

          this.openCoreEditModal(this.person, this.asistencia);

      }else {
        this.dsCtrl.openSnackBar('Error: no se pudo recuperar la Persona afectada', 'ATENCIÓN')
    		this.fireError('Error: no se pudo recuperar la Persona afectada')

        return;
      }
    })

  }

  private openCoreEditModal(person: Person, asistencia?: Asistencia){
    const dialogRef = this.dialog.open(
      VigilanciaCoredataComponent,
      {
        width: '800px',
        data: {
          asistencia: asistencia,
          person: person,
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
        if(res) this.closeResult$.next(res);
        else this.fireCancel();
    });    

  }

  private fireError(msj: string){
  	this.closeResult$.next({
  		action: ERROR,
  		type: msj,
  		token: this.asistencia
  	} as UpdateAsistenciaEvent)
  }

  private fireCancel(){
  	this.closeResult$.next({
  		action: CANCEL,
  		type: 'operación cancelada',
  		token: null
  	} as UpdateAsistenciaEvent)
  }

}
