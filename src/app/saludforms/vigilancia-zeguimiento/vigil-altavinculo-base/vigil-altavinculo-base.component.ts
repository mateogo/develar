import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
//import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
//import { CustomValidators } from 'ng2-validation';
import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../../salud/salud.controller';
import { Observable, of } from 'rxjs';

import { PersonService } from '../../../salud/person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../entities/person/person';

import {  Asistencia, 
          ContextoCovid,
          ContextoDenuncia,
          Locacion,
          Requirente,
          Novedad,
          MuestraLaboratorio, 
          UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';

import { devutils }from '../../../develar-commons/utils'
import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

//modals
import { VigilanciaSisaComponent } from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-sisa/vigilancia-sisa.component';
import { VigilanciaSisafwupComponent } from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-sisafwup/vigilancia-sisafwup.component';
import { VigilanciaSisahistoryComponent } from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-sisahistory/vigilancia-sisahistory.component';

import { VigilanciaSeguimientoComponent } from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-seguimiento/vigilancia-seguimiento.component';
import { VigilanciaSeguimientofwupComponent } from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-seguimientofwup/vigilancia-seguimientofwup.component';
import { VigilanciaSeguimientohistoryComponent } from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-seguimientohistory/vigilancia-seguimientohistory.component';
import { VigilanciaSeguimientocalendarComponent } from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-seguimientocalendar/vigilancia-seguimientocalendar.component';

import { VigilanciaInfeccionComponent }   from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-infeccion/vigilancia-infeccion.component';
import { VigilanciaLaboratorioComponent } from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-laboratorio/vigilancia-laboratorio.component';
import { VigilanciaVinculosComponent }    from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-vinculos/vigilancia-vinculos.component';
import { VigilanciaCoredataComponent }    from '../../../salud/vigilancia/vigilancia-zmodal/vigilancia-coredata/vigilancia-coredata.component';


const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';
const EVOLUCION = 'evolucion';
const CLOSE = 'closepanel';

const ROLE_ADMIN = 'vigilancia:admin';

const N_HAB_00 = 'NUC-HAB-00'

const FIEBRE_TXT = [
              'Tuvo 38 o más grados de fiebre en los últimos 14 días',
              'Cree haber tenido fiebre en los últimos 14 días',
              'No tuvo fiebre en los últimos 14 días',
      ]

const ACTION = {
	descartar:   'descartar',
	observacion: 'observacion',
	medico:      'medico',
	same:        'same',
	traslado:    'traslado',
	intenado:    'internado',
	derivado:    'derivado',
}



@Component({
  selector: 'vigil-altavinculo-base',
  templateUrl: './vigil-altavinculo-base.component.html',
  styleUrls: ['./vigil-altavinculo-base.component.scss']
})
export class VigilAltavinculoBaseComponent implements OnInit {
	@Input() asistencia: Asistencia;
  @Input() detailView = true;


  public tipoEdit = 1;

  private person: Person;
  private familyList: Array<FamilyData> = [];
	public vinculosList$: Observable<FamilyData[]>;

  private formAction = "";
  private fireEvent: UpdateAsistenciaEvent;


  public novedadesTitle = 'EVOLUCIÓN';

  public showAsistenciaView = true;
  public showButtons = false;
  public showEditor = false;
  public showPanel = true;
  public showVinculosData = true;

  public audit;
  public auditToken: Audit;
  public parentEntity: ParentEntity;


  constructor(
    public dialog: MatDialog,
    private perSrv: PersonService,
    private dsCtrl: SaludController,

  	) { 

	}


  ngOnInit() {
    this.audit = this.buildAudit(this.asistencia);
    this.auditToken = this.dsCtrl.getAuditData();

    this.parentEntity = {
      entityType: 'person',
      entityId: this.asistencia.idPerson,
      entitySlug: this.asistencia.requeridox.slug
    }
    //this.loadVinculosFam(this.asistencia);

  }

  closeFollowUpPanel(){
    this.showPanel = false;
  }


  viewPanelsSelected(e){

    //if(!(e && e.value && e.value.length)) return;

    this.manageAsistenciaView(e.value)
  }

  actionSelected(action){

  }

  addVinculo(){
    this.showVinculosData = false;
    this.buildVinculosFam(this.asistencia, null )
  }

  editVinculo(vinculo: FamilyData ){
    this.showVinculosData = false;
    this.buildVinculosFam(this.asistencia, vinculo )
  }



  private manageAsistenciaView(viewList){
    this.showAsistenciaView = false;

    setTimeout(() => {
      this.showAsistenciaView = true;
    },70)
  }



  private openVinculofamModal(nucleo: NucleoHabitacional, person: Person, vinculo: FamilyData, vPerson?: Person, vAsistencia?: Asistencia){
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
      if(res && res.token){
        this.asistencia = res.token;
        //this.loadVinculosFam(this.asistencia);
        this.showVinculosData = true;

      }else{
        this.showVinculosData = true;
      }
    });    
  }

  private checkUserPermission(role: string):boolean{
    return this.dsCtrl.isUserMemberOf(role);

  }


  private buildVinculosFam(token: Asistencia, vinculo: FamilyData){

    let personId = token.requeridox && token.requeridox.id
    let vinculoPerson: Person;
    this.vinculosList$ = new Observable<FamilyData[]>()

    if(!personId){
      this.dsCtrl.openSnackBar('Error: solicitud de vigilancia sin identificación de Persona', 'ATENCIÓN')
      return;
    }

    this.perSrv.fetchPersonById(personId).then(per => {
      if(per){
        this.person = per;
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
              this.dsCtrl.openSnackBar('Error: no se pudo recuperar la Persona perteneciente al vínculo', 'ATENCIÓN')
              return;

            }
          })

        }else {
          this.getReadyToOpenFamModal(this.person, vinculo, null, null);

        }


      }else {
        this.dsCtrl.openSnackBar('Error: no se pudo recuperar la Persona afectada', 'ATENCIÓN')
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

        this.openVinculofamModal(nucleoHabitacional, this.person, vinculo, vper, vasis);

    })
  }

//NucleoHabitacional
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


  private buildAudit(token: Asistencia):string{
    let audit = ''
    let ts, sector, fecha, fecha_txt;
    let atendido = token.atendidox;

    if(atendido){
      ts =  atendido.slug;
      sector = atendido.sector;
      fecha = new Date(token.ts_prog);
      fecha_txt = fecha ? fecha.toString(): '';
      audit = `${ts} Sector: ${sector} ${fecha_txt}`
    }

    return audit;
  }

  private loadVinculosFam(token: Asistencia){
    this.showVinculosData = false;

    this.vinculosList$ = new Observable<FamilyData[]>()
    let personId = token.requeridox && token.requeridox.id

    if(!personId){
      return;
    }

    this.perSrv.fetchPersonById(personId).then(per => {
      if(per){
        let vinculos = per.familiares;

        if(vinculos && vinculos.length){
          this.sortProperly(vinculos);


          this.vinculosList$ = of(vinculos);
          this.showVinculosData = true;

        }else {
          return;

        }

      }else {
        return;
      }
    })

  }

  private sortProperly(vinculos: FamilyData[]){
    vinculos.sort((fel: FamilyData, sel: FamilyData)=> {
        if((fel.nucleo || 'NUC-HAB-01') < (sel.nucleo || 'NUC-HAB-01') ) return -1;

        else if((fel.nucleo || 'NUC-HAB-01') > (sel.nucleo || 'NUC-HAB-01')) return 1;

        else {
          if((fel.apellido + fel.nombre) < (sel.apellido + sel.nombre) ) return -1;

          else if((fel.apellido + fel.nombre) > (sel.apellido + sel.nombre)) return 1;

          else return 0
        }
    });

  }


}

