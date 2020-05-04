import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { AgmCoreModule }  from '@agm/core';
import { RouterModule}    from '@angular/router';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { DevelarMaterialModule }   from './develar-materials.module';
import { NgxDatatableModule }      from '@swimlane/ngx-datatable';
import { FileUploadModule }        from 'ng2-file-upload';

import { NavbarComponent }                from './navbar/default/navbar.component';
import { MainMenuComponent }              from './menu/main-menu/main-menu.component';
import { WorkgroupMenuComponent }         from './menu/workgroup-menu/workgroup-menu.component';
import { DefaultLayoutComponent }         from './layouts/default/default.component';
import { ExtraLayoutComponent }           from './layouts/extra/extra.component';
import { PresentacionLayoutComponent }    from './layouts/presentacion/presentacion.component';
import { WorkgroupLayoutComponent }       from './layouts/workgroup/workgroup.component';

import { Page404Component }        from '../develar-commons/errorpages/page-404.component';
import { Page500Component }        from '../develar-commons/errorpages/page-500.component';
import { DefaultSidebarComponent } from './sidebar/default-sidebar/defaultsidebar.component';
import { WorkgroupSidebarComponent } from './sidebar/workgroup-sidebar/workgroupsidebar.component';
import { BadgeComponent }          from './badge/badge.component';
import { AdditionNavbarComponent } from './addition-navbar/addition-navbar.component';
import { FooterComponent }         from './footer/footer.component';
import { LogoComponent }           from './logo/logo.component';
import { FileComponent }           from './file/file.component';
import { CarrouselComponent }      from './carrousel/carrousel.component';
import { GcseComponent }           from './gcse/gcse.component';
import { MediumEditorDirective }   from './medium-editor/medium.directive';
import { CrawlerComponent, CrawlerDialogComponent } from './crawler/crawler.component';
import { GenericDialogComponent }  from './generic-dialog/generic-dialog.component';
import { ModalDialogComponent }    from './modal-dialog/modal-dialog.component';
import { UploadComponent }         from './upload/upload.component';
import { AssetcreateComponent }    from './assets/assetcreate/assetcreate.component';
import { AsseteditComponent }      from './assets/assetedit/assetedit.component';
import { AssetPredicateComponent } from './assets/asset-predicate/asset-predicate.component';
import { AssetPageComponent }      from './assets/asset-page/asset-page.component';

import { UpdatefileComponent }     from './assets/updatefile/updatefile.component';
import { AssetSearchComponent }    from './assets/asset-search/asset-search.component';

import { FoldercreateComponent }    from './folders/foldercreate/foldercreate.component';
import { TagComponent }             from './tags/tags/tags.component';
import { ChipsDemo }                from './tags/tags/chip.demo';
import { A2CardComponent }          from './card/card.component';
import { BreadcrumbComponent }      from './breadcrumb/breadcrumb.component';

import { FoldereditComponent }      from './folders/folderedit/folderedit.component';
import { FolderBrowseComponent }    from './folders/folder-browse/folder-browse.component';
import { NoteBaseComponent }        from './note-base/note-base.component';

import { CommunityCreateComponent } from './community/community-create/community-create.component';
import { CommunityBaseComponent }   from './community/community-base/community-base.component';
import { CommunityTableComponent }  from './community/communit-table/community-table.component';
import { CommunitySelectorComponent} from './community/community-selector/community-selector.component';
import { CommunityRelationComponent} from './community/community-relation/community-relation.component';
import { EnterSiteComponent }        from './enter-site/enter-site.component';
import { NoteeditorComponent }       from './noteeditor/noteeditor/noteeditor.component';
import { NotepieceComponent }        from './noteeditor/notepiece/notepiece.component';
import { UtilsBrowsePersonComponent} from './browse/utils-browse-person/utils-browse-person.component';

import { CommunityController }  from './community/community.controller'
import { ModelController }      from './folders/model.controller';

import { ObservacionesBaseComponent }  from './observaciones/observaciones-base/observaciones-base.component';
import { ObservacionesPanelComponent } from './observaciones/observaciones-panel/observaciones-panel.component';
import { ObservacionesViewComponent }  from './observaciones/observaciones-view/observaciones-view.component';
import { ObservacionesEditComponent }  from './observaciones/observaciones-edit/observaciones-edit.component';

import { AssetService }         from './asset.service';
import { DaoService }           from './dao.service';   
import { TagService }           from './tag.service';
import { PrismHighlightService }     from './highlighter.service';

import { DumpDataComponent }                from './components/dump-data/dump-data.component';
import { ControlesComponent }               from './components/controles/controles.component';
import { MosaicoComponent }                 from './components/mosaico/mosaico.component';
import { BotonContadorComponent }           from './components/boton-contador/boton-contador.component';
import { BotoneraContainerComponent }       from './containers/botonera-container/botonera-container.component';
import { AltaRapidaPacienteModalComponent } from './alta-rapida-paciente-modal/alta-rapida-paciente-modal.component';

DumpDataComponent

@NgModule({
  imports: [
  	CommonModule,
    RouterModule,
    DevelarMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    FileUploadModule,

    AgmCoreModule.forRoot({
      // ant: apiKey: 'AIzaSyAU9f7luK3J31nurL-Io3taRKF7w9BItQE'
      apiKey: 'AIzaSyAJpFOgoCTiLudPL1lChcn-kIm-zlses0w'

    }),
  ],
  declarations: [
    NavbarComponent,
    MainMenuComponent,
    WorkgroupMenuComponent,
    DefaultLayoutComponent,
    ExtraLayoutComponent,
    PresentacionLayoutComponent,
    WorkgroupLayoutComponent,

    Page404Component,
    Page500Component,
    BadgeComponent,
    A2CardComponent,
    DefaultSidebarComponent,
    WorkgroupSidebarComponent,
    AdditionNavbarComponent,
    FooterComponent,
    LogoComponent,
    CarrouselComponent,
    FileComponent,
    GcseComponent,
    CrawlerComponent,
    MediumEditorDirective,
    CrawlerDialogComponent,
    GenericDialogComponent,
    ModalDialogComponent,
    UploadComponent,
    AssetcreateComponent,
    FoldercreateComponent,
    FolderBrowseComponent,
    TagComponent,
    ChipsDemo,
    FoldereditComponent,
    AsseteditComponent,
    AssetPredicateComponent,
    AssetPageComponent,
    UpdatefileComponent,
    AssetSearchComponent,
    NoteBaseComponent,
    NoteeditorComponent,
    NotepieceComponent,
    UtilsBrowsePersonComponent,
    CommunityCreateComponent,
    CommunityBaseComponent,
    CommunityRelationComponent,
    EnterSiteComponent,
    CommunityTableComponent,
    CommunitySelectorComponent,
    ObservacionesBaseComponent,
    ObservacionesPanelComponent,
    ObservacionesEditComponent,
    ObservacionesViewComponent,
    BreadcrumbComponent,
    ControlesComponent,
    DumpDataComponent,
    MosaicoComponent,
    BotonContadorComponent,
    BotoneraContainerComponent,
    AltaRapidaPacienteModalComponent, 
  ],
  exports:[
    DevelarMaterialModule,
    AgmCoreModule,
    FileUploadModule,

    NavbarComponent,
    MainMenuComponent,
    WorkgroupMenuComponent,
    DefaultLayoutComponent,
    ExtraLayoutComponent,
    PresentacionLayoutComponent,
    WorkgroupLayoutComponent,

    Page404Component,
    Page500Component,
    BadgeComponent,
    A2CardComponent,
    DefaultSidebarComponent,
    WorkgroupSidebarComponent,
    AdditionNavbarComponent,
    FooterComponent,
    LogoComponent,
    CarrouselComponent,
    FileComponent,
    GcseComponent,
    CrawlerComponent,
    MediumEditorDirective,
    GenericDialogComponent,
    ModalDialogComponent,
    UploadComponent,
    AssetcreateComponent,
    FoldercreateComponent,
    TagComponent,
    FolderBrowseComponent,
    FoldereditComponent,
    AsseteditComponent,
    AssetPredicateComponent,
    AssetPageComponent,
    UpdatefileComponent,
    AssetSearchComponent,
    NoteBaseComponent,
    NoteeditorComponent,
    NotepieceComponent,
    UtilsBrowsePersonComponent,
    CommunityCreateComponent,
    CommunityBaseComponent,
    CommunityRelationComponent,
    EnterSiteComponent,
    ObservacionesBaseComponent,
    ObservacionesPanelComponent,
    ObservacionesEditComponent,
    ObservacionesViewComponent,
    CommunityTableComponent,
    CommunitySelectorComponent,
    BreadcrumbComponent,
    ControlesComponent,
    DumpDataComponent,
    MosaicoComponent,
    BotonContadorComponent,
    BotoneraContainerComponent,
    AltaRapidaPacienteModalComponent,
    
  ],
  providers: [AssetService, DaoService, ModelController, TagService, CommunityController, PrismHighlightService],
  entryComponents: [    CrawlerDialogComponent, 
                        GenericDialogComponent, 
                        AltaRapidaPacienteModalComponent,
                        ModalDialogComponent]
})
export class DevelarCommonsModule { }
