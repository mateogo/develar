import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule }          from '@angular/forms';

import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';


import { SaludModule } from '../salud/salud.module';
import { SaludFormsRoutingModule } from './salud-forms-routing.module';
import { EpidemioInvestigPageComponent } from './pages/epidemio-investig-page/epidemio-investig-page.component';
import { InvestigEpidemioEditComponent } from './components/investig-epidemio-edit/investig-epidemio-edit.component';

import { VigilSeguimientoPageComponent }   from './vigilancia-zeguimiento/vigil-seguimiento-page/vigil-seguimiento-page.component';
import { VigilSeguimientoBrowseComponent } from './vigilancia-zeguimiento/vigil-seguimiento-browse/vigil-seguimiento-browse.component';
import { VigilSeguimientoPanelComponent }  from './vigilancia-zeguimiento/vigil-seguimiento-panel/vigil-seguimiento-panel.component';
import { VigilSeguimientoBaseComponent }   from './vigilancia-zeguimiento/vigil-seguimiento-base/vigil-seguimiento-base.component';
import { VigilSeguimientoManageComponent } from './vigilancia-zeguimiento/vigil-seguimiento-manage/vigil-seguimiento-manage.component';

import { VigilAltavinculoBaseComponent }   from './vigilancia-zeguimiento/vigil-altavinculo-base/vigil-altavinculo-base.component';
import { VigilVinculoViewComponent } from './vigilancia-zeguimiento/vigil-vinculo-view/vigil-vinculo-view.component';
import { VigilNovedadPanelComponent } from './novedades/vigil-novedad-panel/vigil-novedad-panel.component';
import { VigilNovedadBaseComponent } from './novedades/vigil-novedad-base/vigil-novedad-base.component';
import { VigilNovedadEditComponent } from './novedades/vigil-novedad-edit/vigil-novedad-edit.component';
import { VigilNovedadViewComponent } from './novedades/vigil-novedad-view/vigil-novedad-view.component';
import { VigilNovedadfwupViewComponent } from './novedades/vigil-novedadfwup-view/vigil-novedadfwup-view.component';
import { VigilNovedadfwupEditComponent } from './novedades/vigil-novedadfwup-edit/vigil-novedadfwup-edit.component';


@NgModule({
  declarations: [	EpidemioInvestigPageComponent,
  								InvestigEpidemioEditComponent,
  								VigilSeguimientoPageComponent,
  								VigilSeguimientoBrowseComponent,
  								VigilSeguimientoPanelComponent,
  								VigilSeguimientoBaseComponent,
  								VigilSeguimientoManageComponent,
                  VigilAltavinculoBaseComponent,
                  VigilVinculoViewComponent,
                  VigilNovedadPanelComponent,
                  VigilNovedadBaseComponent,
                  VigilNovedadEditComponent,
                  VigilNovedadViewComponent,
                  VigilNovedadfwupViewComponent,
                  VigilNovedadfwupEditComponent
								],
  imports: [
    CommonModule,
    SaludFormsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DevelarCommonsModule,
    SaludModule,
  ]
})
export class SaludFormsModule { }
