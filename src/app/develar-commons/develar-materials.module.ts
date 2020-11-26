import { NgModule }     from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import {MatBadgeModule}     from '@angular/material/badge';
import {MatTableModule}     from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule}      from '@angular/material/sort';
import {MatTooltipModule}   from '@angular/material/tooltip';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

@NgModule({
	imports: [
		MatButtonModule,
		MatButtonToggleModule,
		MatAutocompleteModule,
   	MatCheckboxModule,
		MatCardModule,
		MatDatepickerModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatNativeDateModule,
		MatMenuModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatTabsModule,
		MatExpansionModule,
		MatToolbarModule,
		MatTableModule,
		MatBadgeModule,
		MatPaginatorModule,
		MatSortModule,
		MatTooltipModule
	],
	exports:[
		MatButtonModule,
		MatButtonToggleModule,
		MatAutocompleteModule,
   	MatCheckboxModule,
		MatCardModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatNativeDateModule,
		MatMenuModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatTabsModule,
		MatExpansionModule,
		MatToolbarModule,
		MatTableModule,
		MatBadgeModule,
		MatPaginatorModule,
		MatSortModule,
		MatTooltipModule
	],
	providers : [	
		{provide : MAT_DATE_LOCALE, useValue: 'es-AR'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
	{provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
]
})
export class DevelarMaterialModule {}


//for i in "md\-autocomplete" "md\-checkbox" "md\-progressbar" "md\-buttontoggle" ; do echo $i; ack $i;  done;
//for i in "md\-card" "md\-chips" "md\-datepicker" "md\-dialog" "md\-gridList" "md\-icon"; do echo $i; ack $i;  done;
//for i in "md\-input" "md\-list" "md\-menu" "md\-progressspinner" "md\-radio"; do echo $i; ack $i;  done;
//for i in ; do echo $i; ack $i;  done;

