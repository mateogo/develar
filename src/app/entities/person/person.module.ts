import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

//import { InMemoryWebApiModule }    from 'angular-in-memory-web-api';
//import { InMemoryDataService }     from '../../devel/in-memory-data.service';


import { NgxDatatableModule }      from '@swimlane/ngx-datatable';

import { DevelarCommonsModule }    from '../../develar-commons/develar-commons.module';


import { PersonRoutingModule }     from './person-routing.module';

import { PersonController }        from './person.controller';
import { PersonService }           from './person.service';
import { PersonComponent }         from './person/person.component';
import { PersonCreateComponent }   from './person-create/person-create.component';
import { PersonEditComponent }     from './person-edit/person-edit.component';
import { BrowsepersonComponent }   from './browseperson/browseperson.component';
import { PersonManageComponent }   from './person-manage/person-manage.component';
import { PersonTableComponent }    from './person-table/person-table.component';

//InMemoryWebApiModule.forRoot(InMemoryDataService),

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule.forRoot({
      messages:{
        emptyMessage: 'No hay datos para mostrar',
        totalMessage: 'total',
        selectedMessage: 'seleccionado'        
      }
    }),
    PersonRoutingModule,
    DevelarCommonsModule
  ],
  declarations: [
      PersonComponent,
      PersonCreateComponent,
      PersonEditComponent,
      BrowsepersonComponent,
      PersonManageComponent,
      PersonTableComponent
  ],
  exports:[
      BrowsepersonComponent
  ],
  providers: [PersonService, PersonController]
})
export class PersonModule { }
