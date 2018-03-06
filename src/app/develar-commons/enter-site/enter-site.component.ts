import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import { User } from '../../entities/user/user';

import { UserService } from '../../entities/user/user.service';


@Component({
  selector: 'enter-site',
  templateUrl: './enter-site.component.html',
  styleUrls: ['./enter-site.component.scss']
})
export class EnterSiteComponent implements OnInit {
	private userListener: Subject<User>;

  constructor(
	  	private router: Router,
	  	private route: ActivatedRoute,
			private userService: UserService
  	) { }

  ngOnInit() {
  	console.log('****************** ingresando BEGINS ****************')
    this.userListener = this.userService.initLoginUser();

    this.userListener.subscribe(user =>{
      // console.log('**** minimalCtroller Constructor userListener :[%s]', user.username)
      // console.log('++++ user: [%s] [%s]', user.communityId, user.communityUrlpath);
      // console.log('**** navi: [%s] [%s]', this.naviCmty.id, this.naviCmty.url);
      // console.log('xxxx usrx: [%s] [%s]', this.userCmty.id, this.userCmty.url);

      this.updateUserStatus(user);
      if(user.username === 'invitado' ){
      	this.router.navigate(['/'])
      }else {

      	let urlPath = user.communityUrlpath || "";
      	this.router.navigate(['/', urlPath]);
      }

    })


  }

  updateUserStatus(user:User){
      console.log('**** minimalCtroller Constructor userListener :[%s]', user.username)
      console.log('++++ user: [%s] [%s]', user.communityId, user.communityUrlpath);
  }

}
