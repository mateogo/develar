import { NgModule }     from '@angular/core';
import {	MatButtonModule,
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
					MatToolbarModule
       } from '@angular/material';

import {MatBadgeModule}     from '@angular/material/badge';
import {MatTableModule}     from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule}      from '@angular/material/sort';
import {MatTooltipModule}   from '@angular/material/tooltip'

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
	]
})
export class DevelarMaterialModule {}


//for i in "md\-autocomplete" "md\-checkbox" "md\-progressbar" "md\-buttontoggle" ; do echo $i; ack $i;  done;
//for i in "md\-card" "md\-chips" "md\-datepicker" "md\-dialog" "md\-gridList" "md\-icon"; do echo $i; ack $i;  done;
//for i in "md\-input" "md\-list" "md\-menu" "md\-progressspinner" "md\-radio"; do echo $i; ack $i;  done;
//for i in ; do echo $i; ack $i;  done;

