import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';
import { NotificationsModule }    from '../notifications/notifications.module';

import { ChartsModule }                     from 'ng2-charts';

import { DsocialRoutingModule } from './salud-routing.module';
import { RecepcionPageComponent } from './recepcion-page/recepcion-page.component';
import { PersonFetchComponent } from './helpers/person-fetch/person-fetch.component';
import { TurnoSelectComponent } from './helpers/turno-select/turno-select.component';
import { PersonAltaComponent } from './helpers/person-alta/person-alta.component';
import { PersonBuscarComponent } from './helpers/person-buscar/person-buscar.component';
import { TurnosPageComponent } from './turnos/turnos-page/turnos-page.component';
import { TurnoSectorComponent } from './turnos/turno-sector/turno-sector.component';
import { TurnoViewComponent } from './turnos/turno-view/turno-view.component';
import { TsocialPageComponent } from './gestion/spersona-page/tsocial-page.component';
import { CoreDataBaseComponent } from './ciudadano/core-data/core-data-base/core-data-base.component';
import { CoreDataViewComponent } from './ciudadano/core-data/core-data-view/core-data-view.component';
import { CoreDataEditComponent } from './ciudadano/core-data/core-data-edit/core-data-edit.component';
import { ContactDataBaseComponent } from './ciudadano/contact-data/contact-data-base/contact-data-base.component';
import { ContactDataEditComponent } from './ciudadano/contact-data/contact-data-edit/contact-data-edit.component';
import { ContactDataViewComponent } from './ciudadano/contact-data/contact-data-view/contact-data-view.component';
import { ContactDataPanelComponent } from './ciudadano/contact-data/contact-data-panel/contact-data-panel.component';
import { AddressDataBaseComponent } from './ciudadano/address-data/address-data-base/address-data-base.component';
import { AddressDataEditComponent } from './ciudadano/address-data/address-data-edit/address-data-edit.component';
import { AddressDataViewComponent } from './ciudadano/address-data/address-data-view/address-data-view.component';
import { AddressDataPanelComponent } from './ciudadano/address-data/address-data-panel/address-data-panel.component';
import { FamilyDataPanelComponent } from './ciudadano/family-data/family-data-panel/family-data-panel.component';
import { FamilyDataBaseComponent } from './ciudadano/family-data/family-data-base/family-data-base.component';
import { FamilyDataViewComponent } from './ciudadano/family-data/family-data-view/family-data-view.component';
import { FamilyDataEditComponent } from './ciudadano/family-data/family-data-edit/family-data-edit.component';
import { OficiosDataPanelComponent } from './ciudadano/oficios-data/oficios-data-panel/oficios-data-panel.component';
import { OficiosDataBaseComponent } from './ciudadano/oficios-data/oficios-data-base/oficios-data-base.component';
import { OficiosDataViewComponent } from './ciudadano/oficios-data/oficios-data-view/oficios-data-view.component';
import { OficiosDataEditComponent } from './ciudadano/oficios-data/oficios-data-edit/oficios-data-edit.component';
import { AddressEvalViewComponent } from './ciudadano/address-data/address-eval-view/address-eval-view.component';
import { AddressEvalEditComponent } from './ciudadano/address-data/address-eval-edit/address-eval-edit.component';
import { SolasisBaseComponent } from './asistencia/sol-asis-data/solasis-base/solasis-base.component';
import { SolasisPanelComponent } from './asistencia/sol-asis-data/solasis-panel/solasis-panel.component';
import { SolasisEditComponent } from './asistencia/sol-asis-data/solasis-edit/solasis-edit.component';
import { SolasisViewComponent } from './asistencia/sol-asis-data/solasis-view/solasis-view.component';

import { SolListPageComponent } from './asistencia/sol-list/sol-list-page/sol-list-page.component';
import { SolListTableComponent } from './asistencia/sol-list/sol-list-table/sol-list-table.component';

import { SegumientoPageComponent } from './seguimiento/segumiento-page/segumiento-page.component';
import { PrioritySelectComponent } from './helpers/priority-select/priority-select.component';
import { SaludDataBaseComponent } from './ciudadano/salud-data/salud-data-base/salud-data-base.component';
import { SaludDataEditComponent } from './ciudadano/salud-data/salud-data-edit/salud-data-edit.component';
import { SaludDataPanelComponent } from './ciudadano/salud-data/salud-data-panel/salud-data-panel.component';
import { SaludDataViewComponent } from './ciudadano/salud-data/salud-data-view/salud-data-view.component';
import { CoberturaDataBaseComponent } from './ciudadano/cobertura-data/cobertura-data-base/cobertura-data-base.component';
import { CoberturaDataEditComponent } from './ciudadano/cobertura-data/cobertura-data-edit/cobertura-data-edit.component';
import { CoberturaDataPanelComponent } from './ciudadano/cobertura-data/cobertura-data-panel/cobertura-data-panel.component';
import { CoberturaDataViewComponent } from './ciudadano/cobertura-data/cobertura-data-view/cobertura-data-view.component';
import { AmbientalDataBaseComponent } from './ciudadano/ambiental-data/ambiental-data-base/ambiental-data-base.component';
import { AmbientalDataEditComponent } from './ciudadano/ambiental-data/ambiental-data-edit/ambiental-data-edit.component';
import { AmbientalDataPanelComponent } from './ciudadano/ambiental-data/ambiental-data-panel/ambiental-data-panel.component';
import { AmbientalDataViewComponent } from './ciudadano/ambiental-data/ambiental-data-view/ambiental-data-view.component';
import { SolDashboardPageComponent } from './asistencia/sol-dashboard/sol-dashboard-page/sol-dashboard-page.component';
import { SolasisBrowseComponent } from './asistencia/sol-asis-data/solasis-browse/solasis-browse.component';


import { PersonAssetsPanelComponent } from './ciudadano/person-assets/person-assets-panel/person-assets-panel.component';
import { SolcovidEditComponent } from './covid/sol-covid-data/solcovid-edit/solcovid-edit.component';
import { SolcovidPageComponent } from './covid/sol-covid-page/solcovid-page/solcovid-page.component';
import { SolcovidFollowupComponent } from './covid/sol-covid-data/solcovid-followup/solcovid-followup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DsocialRoutingModule,
    ReactiveFormsModule,
    DevelarCommonsModule,
    ChartsModule,
    NotificationsModule,
  ],
  declarations: [
  	RecepcionPageComponent, 
  	PersonFetchComponent, 
  	TurnoSelectComponent, 
  	PersonAltaComponent, 
  	PersonBuscarComponent, 
  	TurnosPageComponent, 
  	TurnoSectorComponent, 
  	TurnoViewComponent, 
  	TsocialPageComponent, 
  	CoreDataBaseComponent, 
  	CoreDataViewComponent, 
  	CoreDataEditComponent,
    ContactDataBaseComponent,
    ContactDataEditComponent,
    ContactDataViewComponent,
    ContactDataPanelComponent,
    AddressDataBaseComponent,
    AddressDataEditComponent,
    AddressDataViewComponent,
    AddressDataPanelComponent,
    FamilyDataPanelComponent,
    FamilyDataBaseComponent,
    FamilyDataViewComponent,
    FamilyDataEditComponent,
    OficiosDataPanelComponent,
    OficiosDataBaseComponent,
    OficiosDataViewComponent,
    OficiosDataEditComponent,
    AddressEvalViewComponent,
    AddressEvalEditComponent,
    SolasisBaseComponent,
    SolasisPanelComponent,
    SolasisEditComponent,
    SolasisViewComponent,
    SolListPageComponent,
    SolListTableComponent,
    SegumientoPageComponent,
    PrioritySelectComponent,
    SaludDataBaseComponent,
    SaludDataEditComponent,
    SaludDataPanelComponent,
    SaludDataViewComponent,
    CoberturaDataBaseComponent,
    CoberturaDataEditComponent,
    CoberturaDataPanelComponent,
    CoberturaDataViewComponent,
    AmbientalDataBaseComponent,
    AmbientalDataEditComponent,
    AmbientalDataPanelComponent,
    AmbientalDataViewComponent,
    SolDashboardPageComponent,
    SolasisBrowseComponent,
    PersonAssetsPanelComponent,
    SolcovidEditComponent,
    SolcovidPageComponent,
    SolcovidFollowupComponent,
  ]
})
export class SaludModule { }