import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationManageComponent } from './notification-manage/notification-manage.component';
import { NotificationCreateComponent } from './notification-create/notification-create.component';
import { NotificationsSocketComponent } from './notifications-socket/notifications-socket.component';

const routes: Routes = [
	{
		path:'alta',
		component: NotificationCreateComponent
	},
  {
    path:'navegar',
    component: NotificationManageComponent
  },
  {
    path:'socket',
    component: NotificationsSocketComponent
  }

]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
  	RouterModule
  ]
})
export class NotificationsRoutingModule { }
