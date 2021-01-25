import { Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';

import { DaoService }    from '../develar-commons/dao.service';
import { PersonService } from '../salud/person.service';

import { Person, PersonContactData, Address, UpdatePersonEvent }        from '../entities/person/person';
import { Asistencia } from '../salud/asistencia/asistencia.model';
import { devutils } from '../develar-commons/utils';

const ASIS_PREVENCION_RECORD = 'asisprevencion'


@Injectable()
export class SaludwebService {

  constructor(
    private daoService: DaoService,
    private personSrv: PersonService,
    //private dialogService: MatDialog,
    private snackBar:    MatSnackBar,
		) {
      console.log('Service SALUDWEB created')
  }

  fetchPersonById(id: string): Promise<Person>{
    return this.personSrv.fetchPersonById(id);
  }
  
  fetchPersonByDni(ndoc: string):Subject<Person>{
    return this.personSrv.fetchPersonByDNI('DNI', ndoc);
  }

  fetchAsistenciaByPerson(person:Person){
    let query = {
      idPerson: person._id
    }
    return this.daoService.search<Asistencia>(ASIS_PREVENCION_RECORD, query);
  }


  /***************************/
  /** Certificado Alta ****/
  /***************************/
  exportSolAltaAfectado(asisId:any){
    console.log('EXPORT SOL ALTA BEGIN')
    let url = `api/pdf/solaltaepidemioform/${asisId}/constancia.pdf`;
    const windw = window.open(url, 'about:blank')
  }

  /***************************/
  /** Notification HELPER ****/
  /***************************/
  openSnackBar(message: string, action: string, config?: any) {
    config = config || {}
    config = Object.assign({duration: 3000}, config)

    let snck = this.snackBar.open(message, action, config);

    snck.onAction().subscribe((e)=> {
      //c onsole.log('action???? [%s]', e);
    })
  }


  /********************************/
  /** Update Telefono y Fenac ****/
  /******************************/

  updateBasicData(person: Person, telefono: string, fenactx: string){
    this.updateCoreData(person, telefono);
    person.fenactx = fenactx;
    person.fenac = devutils.dateNumFromTx(fenactx);
    this.personSrv.updatePersonPromise(person).then(p => {
      if(p){
        console.log('PersonUpdate - updateBasicData')
      }
    })
  }

  private updateCoreData(person: Person, telefono: string){
    let contactList = person.contactdata;

    if(contactList && contactList.length){
      let datoAnterior = contactList.find(t => t.data === telefono);
      if(datoAnterior){
        datoAnterior.slug = 'Dato validado por vecino/a. Formulatio Constancia ALTA-COVID-19'
      }else {
        let contactData = new PersonContactData();
        contactData.data = telefono;
        contactData.slug = 'Dato informado por el vecino/a. Formulario Constancia ALTA-COVID-19'
        person.contactdata.push(contactData);  
      }

    }else {
      let contactData = new PersonContactData();
      contactData.data = telefono;
      contactData.slug = 'Dato informado por el vecino/a. Formulario Constancia ALTA-COVID-19'
      person.contactdata = [contactData];
  
    }
  }



}
