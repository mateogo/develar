import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationService } from '../../../develar-commons/notifications.service';
import { UserWeb } from '../user-web.model';
import { UserWebService } from '../user-web.service';

@Component({
  selector: 'user-web-ingresar',
  templateUrl: './user-web-ingresar.component.html',
  styleUrls: ['./user-web-ingresar.component.scss']
})
export class UserWebIngresarComponent implements OnInit {

  private userListener: Subject<UserWeb>;
  public form : FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private _userWebService: UserWebService,
    private _notificacionService: NotificationService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.initGroup();
  }

  initGroup(): void {
    this.form = this._formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  onSubmit(): void {
    let datos = new UserPassword();
    datos = this.form.value;
    this.login(datos)
  }

  onNavigateHome(): void {
    this._router.navigate(['']);
  }

  login(datos: UserPassword): void {

    this._userWebService.login(datos).then((user) => {
      if (user) {
        // this._notificacionService.success("Inicio de sesión correcto");
        this.loadLoginUser();
        // this._router.navigate(['/web/usuario/dashboard']);
        this._router.navigate(['/ingresando']);
      } else {
        this._notificacionService.error("Credenciales incorrectas");
      }
    }).catch((err) => {
      
      this._notificacionService.error("Credenciales incorrectas");
    });
  }

  private loadLoginUser(): void {
    this.userListener = this._userWebService.initLoginUser();

    // this.userListener.subscribe((user) => {
    //   console.log(user)
    //   if (user) {
    //     // this.goHome();
    //   }
    // });
  }
}

export class UserPassword {
  username: string;
  password: string;
}
