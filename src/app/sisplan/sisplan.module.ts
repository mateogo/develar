import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { ProductModule } from '../entities/products/product.module';
import { SisplanRoutingModule } from './sisplan-routing.module';

import { DevelarCommonsModule }        from '../develar-commons/develar-commons.module';
import { NotificationsModule }         from '../notifications/notifications.module';
import { PculturalPageComponent }      from './pcultural/pcultural-page/pcultural-page.component';
import { PculturalCreateComponent }    from './pcultural/pcultural-create/pcultural-create.component';
import { PculturalCoreBaseComponent }  from './pcultural/manage-core/pcultural-core-base/pcultural-core-base.component';
import { PculturalCoreEditComponent }  from './pcultural/manage-core/pcultural-core-edit/pcultural-core-edit.component';
import { PculturalCoreViewComponent }  from './pcultural/manage-core/pcultural-core-view/pcultural-core-view.component';
import { PculturalCorePanelComponent } from './pcultural/manage-core/pcultural-core-panel/pcultural-core-panel.component';
import { PculturalBrowseComponent }    from './pcultural/manage-core/pcultural-browse/pcultural-browse.component';
import { PculturalDashboardComponent } from './pcultural/pcultural-dashboard/pcultural-dashboard.component';
import { BudgetCreateComponent }       from './presupuesto/manage-core/budget-create/budget-create.component';
import { BudgetBrowseComponent } from './presupuesto/manage-core/budget-browse/budget-browse.component';
import { BudgetCoreBaseComponent } from './presupuesto/manage-core/budget-core-base/budget-core-base.component';
import { BudgetCoreEditComponent } from './presupuesto/manage-core/budget-core-edit/budget-core-edit.component';
import { BudgetCorePanelComponent } from './presupuesto/manage-core/budget-core-panel/budget-core-panel.component';
import { BudgetCoreViewComponent } from './presupuesto/manage-core/budget-core-view/budget-core-view.component';
import { BudgetPageComponent } from './presupuesto/budget-page/budget-page.component';
import { BudgetDashboardComponent } from './presupuesto/budget-dashboard/budget-dashboard.component';
import { BudgetSummaryComponent } from './presupuesto/manage-core/budget-summary/budget-summary.component';
import { BudgetItemsViewComponent } from './presupuesto/manage-core/budget-items-view/budget-items-view.component';
import { BudgetItemsPanelComponent } from './presupuesto/manage-core/budget-items-panel/budget-items-panel.component';
import { BudgetItemsBaseComponent } from './presupuesto/manage-core/budget-items-base/budget-items-base.component';
import { BudgetItemsEditComponent } from './presupuesto/manage-core/budget-items-edit/budget-items-edit.component';
import { BudgetPculturalsBaseComponent } from './presupuesto/manage-core/budget-pculturals-base/budget-pculturals-base.component';
import { BudgetPculturalsPanelComponent } from './presupuesto/manage-core/budget-pculturals-panel/budget-pculturals-panel.component';
import { BudgetPculturalsViewComponent } from './presupuesto/manage-core/budget-pculturals-view/budget-pculturals-view.component';



@NgModule({
  declarations: [
  	PculturalPageComponent,
  	PculturalCreateComponent,
  	PculturalCoreBaseComponent,
  	PculturalCoreEditComponent,
  	PculturalCoreViewComponent,
  	PculturalCorePanelComponent,
  	PculturalBrowseComponent,
  	PculturalDashboardComponent,
  	BudgetCreateComponent,
  	BudgetBrowseComponent,
  	BudgetCoreBaseComponent,
  	BudgetCoreEditComponent,
  	BudgetCorePanelComponent,
  	BudgetCoreViewComponent,
  	BudgetPageComponent,
  	BudgetDashboardComponent,
  	BudgetSummaryComponent,
  	BudgetItemsViewComponent,
  	BudgetItemsPanelComponent,
  	BudgetItemsBaseComponent,
  	BudgetItemsEditComponent,
  	BudgetPculturalsBaseComponent,
  	BudgetPculturalsPanelComponent,
  	BudgetPculturalsViewComponent,
    
  	],
  imports: [
    CommonModule,
    FormsModule,
    SisplanRoutingModule,
    ReactiveFormsModule,
    DevelarCommonsModule,
    NotificationsModule,
    ProductModule
  ]
})
export class SisplanModule { }
