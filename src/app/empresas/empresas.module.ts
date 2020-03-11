import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmpresasRoutingModule } from './empresas-routing.module';

import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';
import { MinimalModule } from '../site-minimal/minimal.module';

import { TimebasedModule }  from '../timebased/timebased.module';

//modules

import { EmpresaCoreBaseComponent }     from './master-data/empresa-core/empresa-core-base/empresa-core-base.component';
import { EmpresaCoreEditComponent }     from './master-data/empresa-core/empresa-core-edit/empresa-core-edit.component';
import { EmpresaCoreViewComponent }     from './master-data/empresa-core/empresa-core-view/empresa-core-view.component';
import { EmpresaCoreStatusComponent }   from './master-data/empresa-core/empresa-core-status/empresa-core-status.component';
import { EmpresaAddressBaseComponent }  from './master-data/empresa-address/empresa-address-base/empresa-address-base.component';
import { EmpresaAddressEditComponent }  from './master-data/empresa-address/empresa-address-edit/empresa-address-edit.component';
import { EmpresaAddressViewComponent }  from './master-data/empresa-address/empresa-address-view/empresa-address-view.component';
import { EmpresaAddressPanelComponent } from './master-data/empresa-address/empresa-address-panel/empresa-address-panel.component';
import { EmpresaMembersPanelComponent } from './master-data/empresa-members/empresa-members-panel/empresa-members-panel.component';
import { EmpresaMembersBaseComponent }  from './master-data/empresa-members/empresa-members-base/empresa-members-base.component';
import { EmpresaMembersEditComponent }  from './master-data/empresa-members/empresa-members-edit/empresa-members-edit.component';
import { EmpresaMembersViewComponent }  from './master-data/empresa-members/empresa-members-view/empresa-members-view.component';
import { EmpresaContactdataPanelComponent } from './master-data/empresa-contactdata/empresa-contactdata-panel/empresa-contactdata-panel.component';
import { EmpresaContactdataBaseComponent }  from './master-data/empresa-contactdata/empresa-contactdata-base/empresa-contactdata-base.component';
import { EmpresaContactdataEditComponent }  from './master-data/empresa-contactdata/empresa-contactdata-edit/empresa-contactdata-edit.component';
import { EmpresaContactdataViewComponent }  from './master-data/empresa-contactdata/empresa-contactdata-view/empresa-contactdata-view.component';

import { RegistroEmpresaPageComponent }     from './master-data/empresa-page/registro-empresa-page.component';

import { DashboardComercioPageComponent } from './dashboard/dashboard-comercio-page/dashboard-comercio-page.component';

import { EmpresasLayoutComponent } from './layouts/empresas-layout/empresas-layout.component';
import { EmpresasNavbarComponent } from './layouts/empresas-navbar/empresas-navbar.component';
import { EmpresasFooterComponent } from './layouts/empresas-footer/empresas-footer.component';
import { CensoindustriasBannerComponent } from './banners/censoindustrias-banner/censoindustrias-banner.component';
import { CensoPageComponent } from './censo/censo-page/censo-page.component';
import { CensoCoreEditComponent } from './censo/censo-data/censo-core/censo-core-edit/censo-core-edit.component';
import { CensoPanelComponent } from './censo/censo-data/censo-panel/censo-panel/censo-panel.component';
import { CensoActividadEditComponent } from './censo/censo-data/censo-actividad/censo-actividad-edit/censo-actividad-edit.component';
import { CensoActividadViewComponent } from './censo/censo-data/censo-actividad/censo-actividad-view/censo-actividad-view.component';
import { CensoBaseComponent } from './censo/censo-data/censo-base/censo-base/censo-base.component';
import { CensoCoreViewComponent } from './censo/censo-data/censo-core/censo-core-view/censo-core-view.component';
import { CensoProductosViewComponent } from './censo/censo-data/censo-productos/censo-productos-view/censo-productos-view.component';
import { CensoProductosEditComponent } from './censo/censo-data/censo-productos/censo-productos-edit/censo-productos-edit.component';
import { EmpresaDocumentosBaseComponent } from './master-data/empresa-documentos/empresa-documentos-base/empresa-documentos-base.component';
import { EmpresaDocumentosEditComponent } from './master-data/empresa-documentos/empresa-documentos-edit/empresa-documentos-edit.component';
import { EmpresaDocumentosViewComponent } from './master-data/empresa-documentos/empresa-documentos-view/empresa-documentos-view.component';
import { EmpresaDocumentosPanelComponent } from './master-data/empresa-documentos/empresa-documentos-panel/empresa-documentos-panel.component';
import { CensoAssetsPanelComponent } from './censo/censo-data/censo-assets/censo-assets-panel/censo-assets-panel.component';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EmpresasRoutingModule,
    ReactiveFormsModule,
    DevelarCommonsModule,
    MinimalModule,
    TimebasedModule
  ],

  declarations: [
  	EmpresaCoreBaseComponent,
  	EmpresaCoreEditComponent,
  	EmpresaCoreViewComponent,
    EmpresaCoreStatusComponent,
  	EmpresaAddressBaseComponent,
  	EmpresaAddressEditComponent,
  	EmpresaAddressViewComponent,
  	EmpresaAddressPanelComponent,
  	EmpresaMembersPanelComponent,
  	EmpresaMembersBaseComponent,
  	EmpresaMembersEditComponent,
  	EmpresaMembersViewComponent,
  	EmpresaContactdataPanelComponent,
  	EmpresaContactdataBaseComponent,
  	EmpresaContactdataEditComponent,
  	EmpresaContactdataViewComponent,
    RegistroEmpresaPageComponent,
  	DashboardComercioPageComponent,
  	EmpresasLayoutComponent,
    EmpresasFooterComponent,
    EmpresasNavbarComponent,
    CensoindustriasBannerComponent,
    CensoPageComponent,
    CensoCoreEditComponent,
    CensoPanelComponent,
    CensoActividadEditComponent,
    CensoActividadViewComponent,
    CensoBaseComponent,
    CensoCoreViewComponent,
    CensoProductosViewComponent,
    CensoProductosEditComponent,
    EmpresaDocumentosBaseComponent,
    EmpresaDocumentosEditComponent,
    EmpresaDocumentosViewComponent,
    EmpresaDocumentosPanelComponent,
    CensoAssetsPanelComponent
  ],

})
export class EmpresasModule { }
