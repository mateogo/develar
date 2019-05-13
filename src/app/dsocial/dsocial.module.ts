import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';

import { DsocialRoutingModule } from './dsocial-routing.module';
import { RecepcionPageComponent } from './recepcion-page/recepcion-page.component';
import { PersonFetchComponent } from './helpers/person-fetch/person-fetch.component';
import { TurnoSelectComponent } from './helpers/turno-select/turno-select.component';
import { PersonAltaComponent } from './helpers/person-alta/person-alta.component';
import { PersonBuscarComponent } from './helpers/person-buscar/person-buscar.component';
import { TurnosPageComponent } from './turnos/turnos-page/turnos-page.component';
import { TurnoSectorComponent } from './turnos/turno-sector/turno-sector.component';
import { TurnoViewComponent } from './turnos/turno-view/turno-view.component';
import { TsocialPageComponent } from './tsocial/tsocial-page/tsocial-page.component';
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

@NgModule({
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
  	CoreDataEditComponent, ContactDataBaseComponent, ContactDataEditComponent, ContactDataViewComponent, ContactDataPanelComponent, AddressDataBaseComponent, AddressDataEditComponent, AddressDataViewComponent, AddressDataPanelComponent, FamilyDataPanelComponent, FamilyDataBaseComponent, FamilyDataViewComponent, FamilyDataEditComponent, OficiosDataPanelComponent, OficiosDataBaseComponent, OficiosDataViewComponent, OficiosDataEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DevelarCommonsModule,
    DsocialRoutingModule
  ]
})
export class DsocialModule { }
