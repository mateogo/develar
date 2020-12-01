import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../../entities/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class MustBeLoggedInGuard implements CanActivate{

    constructor(private _router : Router,
        private _userService : UserService) {}

    canActivate() : Observable<boolean>{
        let isLogin = this._userService.userlogged;
        if(!isLogin){
            this._router.navigate(['usuariosweb']);
        }else{
            return of(true);
        }
    }
}
