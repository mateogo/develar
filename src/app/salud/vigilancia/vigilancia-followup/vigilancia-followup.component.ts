import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
//import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
//import { CustomValidators } from 'ng2-validation';
import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../salud.controller';

import { PersonService } from '../../person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../entities/person/person';

import {  Asistencia, 
          ContextoCovid,
          ContextoDenuncia,
          Locacion,
          Requirente,
          Novedad,
          MuestraLaboratorio, 
          UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../asistencia/asistencia.model';

import { devutils }from '../../../develar-commons/utils'
import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';

//modals
import { VigilanciaSisaComponent } from '../vigilancia-zmodal/vigilancia-sisa/vigilancia-sisa.component';
import { VigilanciaSisafwupComponent } from '../vigilancia-zmodal/vigilancia-sisafwup/vigilancia-sisafwup.component';
import { VigilanciaSisahistoryComponent } from '../vigilancia-zmodal/vigilancia-sisahistory/vigilancia-sisahistory.component';

import { VigilanciaSeguimientoComponent } from '../vigilancia-zmodal/vigilancia-seguimiento/vigilancia-seguimiento.component';
import { VigilanciaSeguimientofwupComponent } from '../vigilancia-zmodal/vigilancia-seguimientofwup/vigilancia-seguimientofwup.component';
import { VigilanciaSeguimientohistoryComponent } from '../vigilancia-zmodal/vigilancia-seguimientohistory/vigilancia-seguimientohistory.component';
import { VigilanciaSeguimientocalendarComponent } from '../vigilancia-zmodal/vigilancia-seguimientocalendar/vigilancia-seguimientocalendar.component';

import { VigilanciaInfeccionComponent }   from '../vigilancia-zmodal/vigilancia-infeccion/vigilancia-infeccion.component';
import { VigilanciaLaboratorioComponent } from '../vigilancia-zmodal/vigilancia-laboratorio/vigilancia-laboratorio.component';
import { VigilanciaVinculosComponent }    from '../vigilancia-zmodal/vigilancia-vinculos/vigilancia-vinculos.component';
import { VigilanciaCoredataComponent }    from '../vigilancia-zmodal/vigilancia-coredata/vigilancia-coredata.component';


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
  selector: 'vigilancia-followup',
  templateUrl: './vigilancia-followup.component.html',
  styleUrls: ['./vigilancia-followup.component.scss']
})
export class VigilanciaFollowupComponent implements OnInit {
	@Input() asistencia: Asistencia;
  @Input() detailView = true;
  @Input() viewList: Array<String> = [];
  @Input() showObservacionesPanel = false;
  @Output() fetchPerson = new EventEmitter<string>();

  public muestraslabList: Array<MuestraLaboratorio> = [];
  public audit;

	// public action;
 //  public sector;
	// public cPrefix;
	// public cName;
	// public cNum;
	// public slug;
	// public description;
	// public locacionTxt;
	// public fecha;
 //  public solicitante;
 //  public avance;
 //  public estado;
 //  public novedadesList = [];

 //  // Covid
 //  public indicacion;
 //  public fiebreTxt;
 //  public sintomasTxt;
 //  public contagioTxt;
 //  public contexto;

 //  public observacion;



  // public actionOptList = []; // AsistenciaHelper.getOptionlist('actions');
  // public sectorOptList =  AsistenciaHelper.getOptionlist('sectores');
  // public sectorActionRelation = AsistenciaHelper.getSectorActionRelation();
  // public avanceEstadoRelation = AsistenciaHelper.getAvanceEstadoRelation();
  // public ciudadesOptList = AsistenciaHelper.getOptionlist('ciudades');
  // public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  // public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  // public novedadOptList = AsistenciaHelper.getOptionlist('novedades');
  // public tcompPersonaFisica = personModel.tipoDocumPF;
  // public osocialOptList = AsistenciaHelper.getOptionlist('osocial');
  // public prioridadOptList = AsistenciaHelper.getOptionlist('prioridad');

  // public ciudadesList =   personModel.ciudades;
  // public barrioList = [];

  private workflowOptList = AsistenciaHelper.getWorkflow();
  public nextStepOptList = [];

	// public form: FormGroup;

 //  public showViewAlimento = false;
 //  public showEditAlimento = false;

  public isCovid = false;
  public isDenuncia = false;
  public showButtons = false;
  public tipoEdit = 1;

  private person: Person;
  private familyList: Array<FamilyData> = [];
  
  private formAction = "";
  private fireEvent: UpdateAsistenciaEvent;


  public novedadesTitle = 'EVOLUCIÓN';

  // manageAsistenciaView
  public showAsistenciaView = true;
  public showEditor = false;
  public showPanel = true;

  public auditToken: Audit;
  public parentEntity: ParentEntity;

  // asistencia





  constructor(
  	//private fb: FormBuilder,
    public dialog: MatDialog,
    private perSrv: PersonService,
    private dsCtrl: SaludController,

  	) { 
  		//this.form = this.buildForm();
	}



  ngOnInit() {
  	// this.buildData();
   //  this.buildCovidData();

    // if(this.asistencia.avance === 'autorizado'){
    //   this.avance = 'AUTORIZADO';
    // }else{

    //   this.avance = 'Pend Autorización';
    // }

    //this.buildNovedades_view(this.asistencia);
    this.buildMuestrasLaboratorio(this.asistencia);

    this.audit = this.buildAudit(this.asistencia);
    this.auditToken = this.dsCtrl.getAuditData();
    this.parentEntity = {
      entityType: 'person',
      entityId: this.asistencia.idPerson,
      entitySlug: this.asistencia.requeridox.slug
    }

    //this.nextStepOptList = this.buildWorkflow(this.asistencia);

  	//this.initForEdit(this.form, this.asistencia);

  }

  closeFollowUpPanel(){
    this.showPanel = false;
  }

  viewPanelsSelected(e){

    //if(!(e && e.value && e.value.length)) return;

    this.manageAsistenciaView(e.value)
  }

  actionTriggered(e){
    e.source._checked = false;
    this.manageModalEditors(e.value);
  
  }

  editLaboratorio(e){
    e.source._checked = false;
    this.openLaboratorioModal(e.value);
  }

  editVinculo(vinculo: FamilyData ){
    this.buildVinculosFam(this.asistencia, vinculo )
  }

  vinculoSelected(personId: string){
    //TODO
    this.fetchPerson.next(personId);
  }

  coreDataSelected(asistencia: Asistencia){
    console.log('coreData to EDIT: [%s]', asistencia.ndoc);
    this.buildCoreDataEdit(this.asistencia);
  }

  private manageAsistenciaView(viewList){
    console.log('ManageAsistenciaView [%s]', this.asistencia.telefono);
    this.showAsistenciaView = false;
    this.buildMuestrasLaboratorio(this.asistencia);
    this.viewList = viewList;

    setTimeout(() => {
      this.showAsistenciaView = true;
    },70)
  }


  public manageModalEditors(token: string){

    this.dsCtrl.fetchAsistenciaById(this.asistencia._id).then(asis =>{
      if(asis){
          this.asistencia = asis;
          if(token === 'sisa')          this.openSisaModal()
          if(token === 'sisafwup')      this.openSisaFwUpModal()
          if(token === 'historialsisa') this.openSisaHistoryModal()

          if(token === 'seguimiento')          this.openSeguimientoModal()
          if(token === 'seguimientofwup')      this.openSeguimientoFwUpModal()
          if(token === 'historialseguimiento') this.openSeguimientoHistoryModal()
          if(token === 'calendarioseguimiento') this.openCalendarioModal()

          if(token === 'infection')     this.openInfectionModal()

          if(token === 'laboratorio')   this.openLaboratorioModal(null)
          if(token === 'vinculofam')   this.buildVinculosFam(this.asistencia, null);

      }else{

        this.dsCtrl.openSnackBar('No se pudo recuperar la solicitud requerida', 'Cerrar');
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
      console.log('dialog CLOSED [%s]', res);

      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
    });    

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
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private openLaboratorioModal(muestralab: MuestraLaboratorio){
    const dialogRef = this.dialog.open(
      VigilanciaLaboratorioComponent,
      {
        width: '800px',
        data: {
          asistencia: this.asistencia,
          laboratorio: muestralab
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private openInfectionModal(){
    const dialogRef = this.dialog.open(
      VigilanciaInfeccionComponent,
      {
        width: '800px',
        data: {
          asistencia: this.asistencia,
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private checkUserPermission(role: string):boolean{
    return this.dsCtrl.isUserMemberOf(role);

  }

  private openSeguimientoModal(){
    if(!this.checkUserPermission(ROLE_ADMIN)){
      this.dsCtrl.openSnackBar('Acceso restringido', 'ACEPTAR');
      return;
    }

    const dialogRef = this.dialog.open(
      VigilanciaSeguimientoComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      // c onsole.log('dialog CLOSED')
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }

    });    
  }
  private checkIfHasFollowUpConfigured(): boolean{
    let ok = false;

    if(!this.asistencia.followUp) return ok;
    if(!(this.asistencia.followUp.isActive && this.asistencia.followUp.fe_inicio && this.asistencia.followUp.tipo) ) return ok;

    ok = true;
    return ok;
  }

  private openSeguimientoFwUpModal(){
    if(!this.checkIfHasFollowUpConfigured()){
      this.dsCtrl.openSnackBar('ATENCIÓN: No está definido correctamente el esquema de seguimiento. ', 'ACEPTAR');
      return;
    }

    const dialogRef = this.dialog.open(
      VigilanciaSeguimientofwupComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {

      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private openCalendarioModal(){
    if(!this.checkIfHasFollowUpConfigured()){
      this.dsCtrl.openSnackBar('Acceso restringido', 'ACEPTAR');
      return;
    }

    const dialogRef = this.dialog.open(
      VigilanciaSeguimientocalendarComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }


  
  private openSeguimientoHistoryModal(){
    const dialogRef = this.dialog.open(
      VigilanciaSeguimientohistoryComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }


  private openSisaHistoryModal(){
    const dialogRef = this.dialog.open(
      VigilanciaSisahistoryComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      // c onsole.log('dialog CLOSED')
    });    
  }

  private openSisaModal(){
    const dialogRef = this.dialog.open(
      VigilanciaSisaComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private openSisaFwUpModal(){

    if(!this.asistencia.sisaevent){
      this.dsCtrl.openSnackBar('Primero debes ingresar el caso en SISA', 'Cerrar');
      return;
    }
    const dialogRef = this.dialog.open(
      VigilanciaSisafwupComponent,
      {
        width: '800px',
        data: {

          asistencia: this.asistencia,

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token;
        this.manageAsistenciaView(this.viewList);
      }
      //c onsole.log('dialog CLOSED')
    });    
  }

  private buildCoreDataEdit(token: Asistencia){
    let personId = token.requeridox && token.requeridox.id
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
        return;
      }
    })

  }


  private buildVinculosFam(token: Asistencia, vinculo: FamilyData){

    let personId = token.requeridox && token.requeridox.id
    let vinculoPerson: Person;

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

  private buildMuestrasLaboratorio(token: Asistencia){
    this.muestraslabList = token.muestraslab || [];

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

}
