import { NgModule }                     from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';

//import { DefaultLayoutComponent }       from './layouts/default/default.component';
//import { ExtraLayoutComponent }         from './layouts/extra/extra.component';


//Develar
// ENTIDADES: User

import { PageDashboardComponent }       from './pages/dashboard/dashboard.component';
import { PageDashboard2Component }      from './pages/dashboard-2/dashboard-2.component';
import { PageButtonComponent }          from './pages/material-components/button/button.component';
import { PageCardComponent }            from './pages/material-components/card/card.component';
import { PageCheckboxComponent }        from './pages/material-components/checkbox/checkbox.component';
import { PageChipsComponent }           from './pages/material-components/chips/chips.component';
import { PageDialogComponent }          from './pages/material-components/dialog/dialog.component';
import { PageIconComponent }            from './pages/material-components/icon/icon.component';
import { PageInputComponent }           from './pages/material-components/input/input.component';
import { PageListComponent }            from './pages/material-components/list/list.component';
import { PageMenuComponent }            from './pages/material-components/menu/menu.component';
import { PageProgressBarComponent }     from './pages/material-components/progress-bar/progress-bar.component';
import { PageProgressSpinnerComponent } from './pages/material-components/progress-spinner/progress-spinner.component';
import { PageRadioButtonComponent }     from './pages/material-components/radio-button/radio-button.component';
import { PageSelectComponent }          from './pages/material-components/select/select.component';
import { PageSliderComponent }          from './pages/material-components/slider/slider.component';
import { PageSlideToggleComponent }     from './pages/material-components/slide-toggle/slide-toggle.component';
import { PageSnackbarComponent }        from './pages/material-components/snackbar/snackbar.component';
import { PageTabsComponent }            from './pages/material-components/tabs/tabs.component';
import { PageToolbarComponent }         from './pages/material-components/toolbar/toolbar.component';
import { PageTooltipComponent }         from './pages/material-components/tooltip/tooltip.component';

import { PageAlertComponent }           from './pages/a2-components/alert/alert.component';
import { PageBadgeComponent }           from './pages/a2-components/badge/badge.component';
import { PageBreadcrumbComponent }      from './pages/a2-components/breadcrumb/breadcrumb.component';
import { PageA2CardComponent }          from './pages/a2-components/a2-card/a2-card.component';
import { PageFileComponent }            from './pages/a2-components/file/file.component';

import { PageTypographyComponent }      from './pages/typography/typography.component';

import { PageAboutUsComponent }         from './pages/pages-service/about-us/about-us.component';
import { PageFaqComponent }             from './pages/pages-service/faq/faq.component';
import { PageTimelineComponent }        from './pages/pages-service/timeline/timeline.component';
import { PageInvoiceComponent }         from './pages/pages-service/invoice/invoice.component';
import { PageLineChartComponent }       from './pages/charts/line-chart/line-chart.component';
import { PageBarChartComponent }        from './pages/charts/bar-chart/bar-chart.component';
import { PageDoughnutChartComponent }   from './pages/charts/doughnut-chart/doughnut-chart.component';
import { PageRadarChartComponent }      from './pages/charts/radar-chart/radar-chart.component';
import { PagePieChartComponent }        from './pages/charts/pie-chart/pie-chart.component';
import { PagePolarAreaChartComponent }  from './pages/charts/polar-area-chart/polar-area-chart.component';
import { PageDynamicChartComponent }    from './pages/charts/dynamic-chart/dynamic-chart.component';
import { PageCalendarComponent }        from './pages/calendar/calendar.component';
import { PageSimpleTableComponent }     from './pages/tables/simple-table/simple-table.component';
import { PageBootstrapTablesComponent } from './pages/tables/bootstrap-tables/bootstrap-tables.component';
import { PageEditingTableComponent }    from './pages/tables/editing-table/editing-table.component';
import { PageFilteringTableComponent }  from './pages/tables/filtering-table/filtering-table.component';
import { PagePaginationTableComponent } from './pages/tables/pagination-table/pagination-table.component';
import { PageFormElementsComponent }    from './pages/forms/form-elements/form-elements.component';
import { PageFormLayoutComponent }      from './pages/forms/form-layout/form-layout.component';
import { PageFormValidationComponent }  from './pages/forms/form-validation/form-validation.component';
import { PageGoogleMapComponent }       from './pages/maps/google-map/google-map.component';
import { PageLeafletMapComponent }      from './pages/maps/leaflet-map/leaflet-map.component';
import { PageWidgetsComponent }         from './pages/widgets/widgets.component';


const routes: Routes = [
  { path: 'dashboard', component: PageDashboardComponent },
  { path: 'dashboard-2', component: PageDashboard2Component },
  { path: 'typography', component: PageTypographyComponent },
  { path: 'widgets', component: PageWidgetsComponent },
  { path: 'calendar', component: PageCalendarComponent },
  { path: 'button', component: PageButtonComponent },
  { path: 'card', component: PageCardComponent },
  { path: 'checkbox', component: PageCheckboxComponent },
  { path: 'chips', component: PageChipsComponent },
  { path: 'dialog', component: PageDialogComponent },
  { path: 'icon', component: PageIconComponent },
  { path: 'input', component: PageInputComponent },
  { path: 'list', component: PageListComponent },
  { path: 'menu', component: PageMenuComponent },
  { path: 'progress-bar', component: PageProgressBarComponent },
  { path: 'progress-spinner', component: PageProgressSpinnerComponent },
  { path: 'radio-button', component: PageRadioButtonComponent },
  { path: 'select', component: PageSelectComponent },
  { path: 'slider', component: PageSliderComponent },
  { path: 'slide-toggle', component: PageSlideToggleComponent },
  { path: 'snackbar', component: PageSnackbarComponent },
  { path: 'tabs', component: PageTabsComponent },
  { path: 'toolbar', component: PageToolbarComponent },
  { path: 'tooltip', component: PageTooltipComponent },
  { path: 'file', component: PageFileComponent },
  { path: 'a2-card', component: PageA2CardComponent },
  { path: 'alert', component: PageAlertComponent },
  { path: 'badge', component: PageBadgeComponent },
  { path: 'breadcrumb', component: PageBreadcrumbComponent },
  { path: 'about-us', component: PageAboutUsComponent },
  { path: 'faq', component: PageFaqComponent },
  { path: 'timeline', component: PageTimelineComponent },
  { path: 'invoice', component: PageInvoiceComponent },
  { path: 'line-chart', component: PageLineChartComponent },
  { path: 'bar-chart', component: PageBarChartComponent },
  { path: 'doughnut-chart', component: PageDoughnutChartComponent },
  { path: 'radar-chart', component: PageRadarChartComponent },
  { path: 'pie-chart', component: PagePieChartComponent },
  { path: 'polar-area-chart', component: PagePolarAreaChartComponent },
  { path: 'dynamic-chart', component: PageDynamicChartComponent },
  { path: 'simple-table', component: PageSimpleTableComponent },
  { path: 'bootstrap-tables', component: PageBootstrapTablesComponent },
  { path: 'editing-table', component: PageEditingTableComponent },
  { path: 'filtering-table', component: PageFilteringTableComponent },
  { path: 'pagination-table', component: PagePaginationTableComponent },
  { path: 'form-elements', component: PageFormElementsComponent },
  { path: 'form-layout', component: PageFormLayoutComponent },
  { path: 'form-validation', component: PageFormValidationComponent },
  { path: 'google-map', component: PageGoogleMapComponent },
  { path: 'leaflet-map', component: PageLeafletMapComponent },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class A2RoutingModule {}
