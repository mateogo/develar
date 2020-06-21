import { BrowserModule }                    from '@angular/platform-browser';
import { NgModule, Directive }              from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS }                  from '@angular/common/http';
import { BrowserAnimationsModule }          from '@angular/platform-browser/animations';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { NgbModule }                        from '@ng-bootstrap/ng-bootstrap';



import { DevelarCommonsModule }             from './develar-commons/develar-commons.module';


import { AppRoutingModule }                 from './app-routing.module';
import { AppComponent }                     from './app.component';

// Develar Components
import { UserService }                      from './entities/user/user.service';
import { SharedService }                    from './develar-commons/shared-service';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
//import { InterceptHttpService } from './salud/internacion/tests/intercept-http.service';




@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DevelarCommonsModule,
    AppRoutingModule,
    NgbModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects]),
  ],

  declarations : [
    AppComponent,
  ],

  entryComponents: [],
  bootstrap: [ AppComponent ],
  //providers: [ {provide: HTTP_INTERCEPTORS, useClass: InterceptHttpService, multi: true }, UserService, SharedService ]
  providers: [ UserService, SharedService ]

})

export class AppModule { }
