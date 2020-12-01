import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../../entities/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class MustNotBeAWebUserGuard implements CanActivate{

    constructor(private _router : Router,
        private _userService : UserService) {}

    canActivate() : Observable<boolean>{
        let isUserWeb = this._userService.currentUser.isUsuarioWeb;
        let invitado = this._userService.currentUser['email'];

        if(isUserWeb || (invitado === 'invitado@develar')){
            this._router.navigate(['']);
        }else{
            return of(true);
        }
    }
}