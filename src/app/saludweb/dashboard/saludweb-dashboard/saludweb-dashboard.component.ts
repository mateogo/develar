import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { NovedadesFollowUpService }  from '../../../saludforms/vigilancia-zmodal-managers/fup-novedades-modal.service';

import { SaludwebService } from '../../saludweb.service';

import { Asistencia, Novedad, ValidationToken, AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';

import { AccessData, ValidationError, EventUpdate, FechaBase } from '../../saludweb-model';

const UPDATE = 'update';

@Component({
  selector: 'saludweb-dashboard',
  templateUrl: './saludweb-dashboard.component.html',
  styleUrls: ['./saludweb-dashboard.component.scss'],
  providers: [ NovedadesFollowUpService ]
})
export class SaludwebDashboardComponent implements OnInit {
  public displayGoBackBtn = false;

  public showAuthenticationForm = false;
  public showEstado = false;
  public showError = false;
  public showCierre = false;

  public isCasoAlta: ValidationToken
  public adminNavigation = false;
  public diasEvolucion = 0;
  private currentAsistencia: Asistencia;

  public displayName;
  public displayNdoc;
  public errorList:Array<ValidationError> = []

  public errorMessage1: string;
  public errorMessage2: string;

  public cierreMessage1: string = 'Proceso concluido'


  constructor(
    private router: Router,
    private novedadService: NovedadesFollowUpService,
    private srv: SaludwebService
  ) { }

  ngOnInit(): void {

    this.dashboardReset();

  }

  public getCertificadoAlta(){
    this.srv.exportSolAltaAfectado(this.currentAsistencia._id);
    this.dashboardCierre();
  }

  public onCancel(){
    this.dashboardReset();
  }

  public resetPage(){
    this.dashboardReset();
  }

  public altaNovedad(){
    if(this.currentAsistencia){
      this.openNovedadesModal(this.currentAsistencia);
      let novedad: Novedad = null;
    }

  }

  public processData(event: EventUpdate){
    this.currentAsistencia = null;
    this.isCasoAlta =  new ValidationToken()
    this.diasEvolucion = 0;
    this.adminNavigation = event.adminNavigation;
    this.errorList = event.errors;

    if(event.action === 'error'){
      this.displayErrorData();

    }else if(event.action === 'cancelar'){
      this.cierreMessage1 = 'Proceso cancelado'
      this.dashboardCierre();

    }else if(event.action === 'fetched'){
      this.currentAsistencia = event.token;
      this.displayFetchedData(this.currentAsistencia);

    }

  }

  private displayFetchedData(asis: Asistencia){
    this.displayName = asis.requeridox.slug;
    this.displayNdoc = asis.ndoc;
    this.isCasoAlta = this.validateCertificadoAlta(asis);

    if(this.isCasoAlta.isValid){
      this.dashboardEstado();

    }else {
      let errorMsg = new ValidationError();
      errorMsg.messageId = this.isCasoAlta.statusMsg + '::' + this.isCasoAlta.errorType;
      errorMsg.messageTxt = this.isCasoAlta.errorMsg;
      this.errorList.push(errorMsg)
      this.displayErrorData();

    }

  }

  private displayErrorData(){
    this.errorMessage1 = 'No se puede emitir la constancia de alta en forma automática.'
    this.errorMessage2 = 'Para obtener mayor información sobre tu caso, comunicate al teléfono: 0800 222 7696 de 8:00 a 20:00hs'
    this.dashboardError();
  }



  private validateCertificadoAlta(asis:Asistencia): ValidationToken{
    let validationToken = AsistenciaHelper.isActualStateAlta(asis)
    return validationToken;
  }

  private dashboardReset(){
    this.currentAsistencia = null;
    this.isCasoAlta = new ValidationToken();
    this.diasEvolucion = 0;

    this.showAuthenticationForm = true;
    this.showError = false;
    this.showCierre = false;
    this.showEstado = false;
  }

  private dashboardEstado(){
    this.showAuthenticationForm = false;
    this.showError = false;
    this.showCierre = false;
    this.showEstado = true;
  }

  private dashboardError(){
    this.showAuthenticationForm = false;
    this.showEstado = false;
    this.showCierre = false;
    this.showError = true;
  }

  private dashboardCierre(){
    this.showAuthenticationForm = false;
    this.showEstado = false;
    this.showError = false;
    this.showCierre = true;
  }

  private openNovedadesModal(asistencia: Asistencia){
    let novedad: Novedad = new Novedad();
    novedad.isActive = true;
    novedad.intervencion = 'emitirCertifAlta';
    novedad = AsistenciaHelper.initNewNovedad(novedad.intervencion);
    let slug = this.errorList.reduce( (s, t)=> s  + t.messageTxt +  '/ ' , 'Solicitud de Constancia con errores : ')
    novedad.novedad = slug;


    this.novedadService.openDialog(asistencia, novedad).subscribe(editEvent =>{
      if(editEvent.action === UPDATE){
        // asistencia = editEvent.token;

      }else{
        //this.showList = true;

      }
    })


  }


}

