import { BrowserModule }                    from '@angular/platform-browser';
import { NgModule, Directive }              from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule }                       from '@angular/http';
import { HttpClientModule}                  from '@angular/common/http';
import { BrowserAnimationsModule }          from '@angular/platform-browser/animations';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { NgbModule }                        from '@ng-bootstrap/ng-bootstrap';



import { DevelarCommonsModule }             from './develar-commons/develar-commons.module';


import { AppRoutingModule }                 from './app-routing.module';
import { AppComponent }                     from './app.component';

// Develar Components
import { UserService }                      from './entities/user/user.service';
import { SharedService }                    from './develar-commons/shared-service';




@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    DevelarCommonsModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],

  declarations : [
    AppComponent,
  ],

  entryComponents: [],
  bootstrap: [ AppComponent ],
  providers: [ UserService, SharedService]

})

export class AppModule { }
