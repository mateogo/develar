import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxDatatableModule }               from '@swimlane/ngx-datatable';

import { CalendarModule, DateAdapter }   from 'angular-calendar';
import { adapterFactory }   from 'angular-calendar/date-adapters/date-fns';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { ChartsModule }                     from 'ng2-charts';

import { DevelarCommonsModule }             from '../develar-commons/develar-commons.module';

import { A2RoutingModule }                  from './a2-routing.module';

import { AlertComponent }                   from './alert/alert.component';
import { BreadcrumbComponent }              from './breadcrumb/breadcrumb.component';
import { NIHTimelineComponent }             from './ni-h-timeline/ni-h-timeline.component';
import { PageDashboardComponent }           from './pages/dashboard/dashboard.component';
import { PageDashboard2Component }          from './pages/dashboard-2/dashboard-2.component';
import { PageButtonComponent }              from './pages/material-components/button/button.component';
import { PageCardComponent }                from './pages/material-components/card/card.component';
import { PageCheckboxComponent }            from './pages/material-components/checkbox/checkbox.component';
import { PageChipsComponent }               from './pages/material-components/chips/chips.component';
import { PageDialogComponent }              from './pages/material-components/dialog/dialog.component';
import { DialogResultComponent }            from './pages/material-components/dialog/dialog.component';
import { PageIconComponent }                from './pages/material-components/icon/icon.component';
import { PageInputComponent }               from './pages/material-components/input/input.component';
import { PageListComponent }                from './pages/material-components/list/list.component';
import { PageMenuComponent }                from './pages/material-components/menu/menu.component';
import { PageProgressBarComponent }         from './pages/material-components/progress-bar/progress-bar.component';
import { PageProgressSpinnerComponent }     from './pages/material-components/progress-spinner/progress-spinner.component';
import { PageRadioButtonComponent }         from './pages/material-components/radio-button/radio-button.component';
import { PageSelectComponent }              from './pages/material-components/select/select.component';
import { PageSliderComponent }              from './pages/material-components/slider/slider.component';
import { PageSlideToggleComponent }         from './pages/material-components/slide-toggle/slide-toggle.component';
import { PageSnackbarComponent }            from './pages/material-components/snackbar/snackbar.component';
import { PageTabsComponent }                from './pages/material-components/tabs/tabs.component';
import { PageToolbarComponent }             from './pages/material-components/toolbar/toolbar.component';
import { PageTooltipComponent }             from './pages/material-components/tooltip/tooltip.component';

import { PageFileComponent }                from './pages/a2-components/file/file.component';
import { PageA2CardComponent }              from './pages/a2-components/a2-card/a2-card.component';
import { PageAlertComponent }               from './pages/a2-components/alert/alert.component';
import { PageBadgeComponent }               from './pages/a2-components/badge/badge.component';
import { PageBreadcrumbComponent }          from './pages/a2-components/breadcrumb/breadcrumb.component';

import { PageTypographyComponent }          from './pages/typography/typography.component';

import { PageAboutUsComponent }             from './pages/pages-service/about-us/about-us.component';
import { PageFaqComponent }                 from './pages/pages-service/faq/faq.component';
import { PageTimelineComponent }            from './pages/pages-service/timeline/timeline.component';
import { PageInvoiceComponent }             from './pages/pages-service/invoice/invoice.component';
import { PageLineChartComponent }           from './pages/charts/line-chart/line-chart.component';
import { PageBarChartComponent }            from './pages/charts/bar-chart/bar-chart.component';
import { PageDoughnutChartComponent }       from './pages/charts/doughnut-chart/doughnut-chart.component';
import { PageRadarChartComponent }          from './pages/charts/radar-chart/radar-chart.component';
import { PagePieChartComponent }            from './pages/charts/pie-chart/pie-chart.component';
import { PagePolarAreaChartComponent }      from './pages/charts/polar-area-chart/polar-area-chart.component';
import { PageDynamicChartComponent }        from './pages/charts/dynamic-chart/dynamic-chart.component';
import { PageCalendarComponent }            from './pages/calendar/calendar.component';
import { CalendarDialogComponent }          from './pages/calendar/calendar.component';
import { PageSimpleTableComponent }         from './pages/tables/simple-table/simple-table.component';
import { PageBootstrapTablesComponent }     from './pages/tables/bootstrap-tables/bootstrap-tables.component';
import { PageEditingTableComponent }        from './pages/tables/editing-table/editing-table.component';
import { PageFilteringTableComponent }      from './pages/tables/filtering-table/filtering-table.component';
import { PagePaginationTableComponent }     from './pages/tables/pagination-table/pagination-table.component';
import { PageFormElementsComponent }        from './pages/forms/form-elements/form-elements.component';
import { PageFormLayoutComponent }          from './pages/forms/form-layout/form-layout.component';
import { PageFormValidationComponent }      from './pages/forms/form-validation/form-validation.component';
import { PageLeafletMapComponent }          from './pages/maps/leaflet-map/leaflet-map.component';
import { PageWidgetsComponent }             from './pages/widgets/widgets.component';
import { PageGoogleMapComponent }           from './pages/maps/google-map/google-map.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,


    ChartsModule,
    NgxDatatableModule,
    LeafletModule.forRoot(),
    CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
    }),

    DevelarCommonsModule,

    A2RoutingModule,
  ],

  declarations : [    
    AlertComponent,
    BreadcrumbComponent,
    NIHTimelineComponent,

    PageDashboardComponent,
    PageDashboard2Component,
    PageButtonComponent,
    PageCardComponent,
    PageCheckboxComponent,
    PageChipsComponent,
    PageDialogComponent,
    DialogResultComponent,
    PageIconComponent,
    PageInputComponent,
    PageListComponent,
    PageMenuComponent,
    PageProgressBarComponent,
    PageProgressSpinnerComponent,
    PageRadioButtonComponent,
    PageSelectComponent,
    PageSliderComponent,
    PageSlideToggleComponent,
    PageSnackbarComponent,
    PageTabsComponent,
    PageToolbarComponent,
    PageTooltipComponent,
    PageFileComponent,
    PageA2CardComponent,
    PageAlertComponent,
    PageBadgeComponent,
    PageBreadcrumbComponent,
    PageTypographyComponent,
    PageAboutUsComponent,
    PageFaqComponent,
    PageTimelineComponent,
    PageInvoiceComponent,
    PageLineChartComponent,
    PageBarChartComponent,
    PageDoughnutChartComponent,
    PageRadarChartComponent,
    PagePieChartComponent,
    PagePolarAreaChartComponent,
    PageDynamicChartComponent,
    PageCalendarComponent,
    CalendarDialogComponent,
    PageSimpleTableComponent,
    PageBootstrapTablesComponent,
    PageEditingTableComponent,
    PageFilteringTableComponent,
    PagePaginationTableComponent,
    PageFormElementsComponent,
    PageFormLayoutComponent,
    PageFormValidationComponent,
    PageLeafletMapComponent,
    PageWidgetsComponent,
    PageGoogleMapComponent
  ],
  entryComponents: [DialogResultComponent,  CalendarDialogComponent ]
})
export class A2Module { }
