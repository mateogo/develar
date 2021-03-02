import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../entities/user/user';
import { UserWeb } from "../../../entities/user-web/user-web.model"
import { UserService } from '../../../entities/user/user.service';

@Component({
  selector: 'user-datos-dashboard',
  templateUrl: './user-datos-dashboard.component.html',
  styleUrls: ['./user-datos-dashboard.component.scss']
})
export class UserDatosDashboardComponent implements OnInit {

  public title: string = "Usuario/a";
  public subtitle : string = "Mis datos de perfil";
  public user$: BehaviorSubject<UserWeb>; 
  id : string;
  constructor(
    private _router: Router,
    private _userService : UserService) { }

  ngOnInit(): void {
    this.user$ = this._userService.userEmitter as BehaviorSubject<UserWeb>;
    this.id = this._userService.currentUser._id;
  }


  goToEditUserData() : void {
    this._router.navigate(['dashboard','usuario',this.id])
  }

}
