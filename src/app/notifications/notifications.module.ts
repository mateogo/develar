import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';


import { NotificationsRoutingModule } from './notifications-routing.module';

import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';
import { UserModule } from '../entities/user/user/user.module';

import { NotificationController } from './notification.controller';

import { NotificationCreateComponent } from './notification-create/notification-create.component';
import { NotificationBrowseComponent } from './notification-browse/notification-browse.component';
import { NotificationManageComponent } from './notification-manage/notification-manage.component';
import { NotificationConversationComponent } from './notification-conversation/notification-conversation.component';
import { NotificationsSocketComponent } from './notifications-socket/notifications-socket.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationBaseComponent } from './notification-base/notification-base.component';
import { NotificationEditComponent } from './notification-edit/notification-edit.component';

@NgModule({
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DevelarCommonsModule,
    UserModule
  ],

  declarations: [
  	NotificationCreateComponent,
  	NotificationBrowseComponent,
  	NotificationManageComponent,
  	NotificationConversationComponent,
  	NotificationsSocketComponent,
  	NotificationListComponent,
  	NotificationBaseComponent,
  	NotificationEditComponent
  ],
  exports: [
    NotificationCreateComponent,
    NotificationBrowseComponent,
    NotificationManageComponent,
    NotificationConversationComponent,

  ],
  providers: [
  	NotificationController
  ]
})
export class NotificationsModule { }
