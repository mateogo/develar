import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SaludwebService } from '../../saludweb.service';

import { Asistencia, AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';

import { AccessData, ValidationError, EventUpdate, FechaBase } from '../../saludweb-model';

@Component({
  selector: 'saludweb-dashboard',
  templateUrl: './saludweb-dashboard.component.html',
  styleUrls: ['./saludweb-dashboard.component.scss']
})
export class SaludwebDashboardComponent implements OnInit {
  public displayGoBackBtn = false;

  public showAuthenticationForm = false;
  public showEstado = false;
  public showError = false;
  public showCierre = false;

  public isCasoAlta = false;
  public diasEvolucion = 0;
  private currentAsistencia: Asistencia;

  public displayName;
  public displayNdoc;

  public errorMessage1: string;
  public errorMessage2: string;

  public cierreMessage1: string = 'Proceso concluido'


  constructor(
    private router: Router,
    private srv: SaludwebService
  ) { }

  ngOnInit(): void {
    this.dashboardReset();

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.displayGoBackBtn = this.router.url.startsWith('/dashboard/industrias/editar');
    //   }
    // });

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


  public processData(event: EventUpdate){
    this.currentAsistencia = null;
    this.isCasoAlta = false;
    this.diasEvolucion = 0;

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

    this.dashboardEstado();


  }

  private displayErrorData(){
    this.errorMessage1 = 'No se puede emitir la constancia de alta en forma automática.'
    this.errorMessage2 = 'Para obtener mayor información sobre tu caso, comunicate al teléfono: 2222 3333'
    this.dashboardError();


  }



  private validateCertificadoAlta(asis:Asistencia):boolean{
    let isValidAlta = AsistenciaHelper.isActualStateAlta(asis)
    let febase: FechaBase;

    if(isValidAlta){
      febase = AsistenciaHelper.fechaBaseParaCalculoAlta(asis)
      if(febase.fets_inicio){
        this.diasEvolucion = Math.floor((Date.now() - febase.fets_inicio) / (1000 * 60 * 60 * 24));
      }
    }

    return (isValidAlta && this.diasEvolucion)? true: false;
  }

  private dashboardReset(){
    this.currentAsistencia = null;
    this.isCasoAlta = false;
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

}

