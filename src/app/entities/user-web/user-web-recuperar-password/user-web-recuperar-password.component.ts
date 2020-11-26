import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { NotificationService } from '../../../develar-commons/notifications.service';
import { PreguntaSecreta, UserWebHelper } from '../user-web.helper';
import { UserWebService } from '../user-web.service';

@Component({
  selector: 'user-web-recuperar-password',
  templateUrl: './user-web-recuperar-password.component.html',
  styleUrls: ['./user-web-recuperar-password.component.scss']
})
export class UserWebRecuperarPasswordComponent implements OnInit {

  showPassword : boolean = false;
  formGroup : FormGroup;
  private password = new FormControl('', Validators.required);
  private confirmPassword = new FormControl('', CustomValidators.equalTo(this.password));
  preguntasSecretas : PreguntaSecreta[];
  constructor(private _fb : FormBuilder,
    private _notificacionService : NotificationService,
    private _userWebService : UserWebService,
    private _router : Router) {
    this.preguntasSecretas = UserWebHelper.getPreguntasSecretasOptList();
   }

  ngOnInit(): void {
    this.initGroup();
  }

  verPassword() {
    let nodes = document.getElementsByClassName("password");
    for(let i = 0; i < nodes.length ; i++){
      let atributo = nodes[i].getAttribute('type');
      if (atributo === "password") {
        nodes[i].setAttribute('type', 'text');
      } else {
        nodes[i].setAttribute('type', 'password');
      }
    }    
    this.showPassword = this.showPassword ? false : true;
    
  }

  private initGroup() : void{
    this.formGroup = this._fb.group({
      username : [''],
      email : ['' , Validators.required],
      password : this.password,
      confirmPassword : this.confirmPassword,
      preguntaSecreta : ['', Validators.required],
      respuestaSecreta : ['', Validators.required]
    })
    
  }

  onSubmit(){
    let formGroup : RestorePasswordFormGroup = this.formGroup.getRawValue();

      let restore = {
        username : formGroup.email,
        email : formGroup.email,
        preguntaSecreta : formGroup.preguntaSecreta,
        respuestaSecreta : formGroup.respuestaSecreta,
        password : formGroup.password
      }
      restore.respuestaSecreta = this.eliminarDiacriticos(restore.respuestaSecreta.toLowerCase());
      this.resetPassword(restore);

  }

  private resetPassword(restore) : void {
    this._userWebService.resetPassword(restore).then( user => {
      if(user){
        this._notificacionService.success("Contraseña actualizada con éxito")
        this._router.navigateByUrl('usuariosweb');
      }else{
        this._notificacionService.error("Se ha producido un error al restablecer la contraseña")
      }
    })
  }

  eliminarDiacriticos(texto : string) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
  }

  volver(){
    this._router.navigate(['usuariosweb'])
  }

}

export class RestorePasswordFormGroup{
  password : string;
  confirmPassword : string;
  preguntaSecreta : string;
  respuestaSecreta : string;
  username : string;
  email : string;
}