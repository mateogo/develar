import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../salud.controller';

import { PersonService } from '../../person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../entities/person/person';

import {  Asistencia, 
          UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../asistencia/asistencia.model';

import { VigilanciaVinculosComponent }    from '../vigilancia-zmodal/vigilancia-vinculos/vigilancia-vinculos.component';

const ROLE_ADMIN = 'vigilancia:admin';

const UPDATE =   'update';
const CANCEL =   'cancel';
const ERROR =    'error';
const N_HAB_00 = 'NUC-HAB-00'

@Injectable()
export class ContactoEstrechosModalService {
  private person: Person;
  private familyList: FamilyData[];
	private asistencia: Asistencia;
	private dialogResult$ = new Subject<UpdateAsistenciaEvent>();

  constructor(
    public dialog: MatDialog,
    private perSrv: PersonService,
    private dsCtrl: SaludController,
  	) {}

  openDialog(asistencia: Asistencia, vinculo: FamilyData ): Subject<UpdateAsistenciaEvent>{
  	this.asistencia = asistencia;

    this.loadPerson(asistencia, vinculo);

  	return this.dialogResult$;
  }

  private loadPerson(token: Asistencia, vinculo: FamilyData){
    let personId = token.idPerson;
    let vinculoPerson: Person;

    if(!personId){
      this.fireError('Error: solicitud de vigilancia sin identificación de Persona', 'ATENCIÓN')
      return;
    }

    this.perSrv.fetchPersonById(personId).then(per => {
      if(per){
        this.person = per;
        //this.openCoreEditModal(this.person, this.asistencia);

        this.familyList = per.familiares || [];

        // el vínculo que se quiere editar, si es que existe
        if(vinculo && vinculo.personId){
          this.perSrv.fetchPersonById(vinculo.personId).then(vper => {
            if(vper){
              this.dsCtrl.fetchAsistenciaByPerson(vper).subscribe(list => {
                if(list && list.length){
                  this.getReadyToOpenFamModal(this.person, vinculo, vper, list[0]);

                }else {
                  this.getReadyToOpenFamModal(this.person, vinculo, vper, null);

                }
              })

            }else{
              this.fireError('Error: no se pudo recuperar la Persona perteneciente al vínculo', 'ATENCIÓN')
              return;
            }
          })

        }else {
          this.getReadyToOpenFamModal(this.person, vinculo, null, null);

        }

      }else {
        this.fireError('Error: no se pudo recuperar la Persona afectada', 'ACEPTAR')
        return;
      }
    })

  }

  private getReadyToOpenFamModal(person: Person, vinculo: FamilyData, vper?: Person, vasis?: Asistencia){
    let nucleoHabitacional: NucleoHabitacional = {};
    let personAddress = person && person.locaciones && person.locaciones.length && person.locaciones[0]

    if(personAddress){
      this.insertAddressToNucleoList(N_HAB_00, nucleoHabitacional, person, person.locaciones[0]);
    }

    let promiseArray = this.buildNucleosHabitacionales(nucleoHabitacional, person.familiares);
    Promise.all(promiseArray).then(data => {

        this.openModalDialog(nucleoHabitacional, this.person, vinculo, vper, vasis);

    })
  }


  private insertAddressToNucleoList(nucleo: string, nucleoList: NucleoHabitacional, person:Person, address: Address){
    let telefono = (person && person.contactdata && person.contactdata.length && person.contactdata[0].data) || '';
    if(nucleoList[nucleo]){
      nucleoList[nucleo].telefono = telefono ? (nucleoList[nucleo].telefono + '/ ' + telefono) : (nucleoList[nucleo].telefono || '');

    }else {
      let slug = nucleo + '::' + address.street1 + ' - ' + address.city;
      nucleoList[nucleo] = {
                              address: address,
                              telefono: telefono,
                              slug: slug
                            }

    }
    return nucleoList;
  }


  private buildNucleosHabitacionales(habNucleoList: NucleoHabitacional, familyList: FamilyData[]){
    let promiseArray = [];

    if(familyList && familyList.length){

      familyList.forEach(member => {
        if(member && member.personId && member.nucleo){

            let promiseMember = new Promise((resolve, reject)=>{
              this.perSrv.fetchPersonById(member.personId).then(pMember => {
                if(pMember && pMember.locaciones && pMember.locaciones.length){
                  habNucleoList = this.insertAddressToNucleoList(member.nucleo, habNucleoList, pMember, pMember.locaciones[0]); 
                }
                resolve(true);
              })

            })//end Promise
            promiseArray.push(promiseMember)

        }// end if member.personId
      })//end forEach
    }

    return promiseArray;
  }



  private openModalDialog(nucleo: NucleoHabitacional, person: Person, vinculo: FamilyData, vPerson?: Person, vAsistencia?: Asistencia){
    const dialogRef = this.dialog.open(
      VigilanciaVinculosComponent,
      {
        width: '800px',
        data: {
          nucleoHabitacional: nucleo,
          asistencia: this.asistencia,
          person: person,
          vinculo: vinculo,
          vPerson: vPerson || null,
          vAsistencia: vAsistencia || null,
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
