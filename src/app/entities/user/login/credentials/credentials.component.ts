import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { BehaviorSubject }       from 'rxjs/BehaviorSubject';

import { User } from '../../user';
import { UserService } from '../../user.service';
//import { SharedService } from '../../develar-commons/shared-service';
import { gldef } from '../../../../develar-commons/develar.config';


const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));


function buildMailContent(data):string {
  if(gldef.company === 'picris'){
      const tmpl = `
      <p>Estimadx  ${data.displayName}: </p>
      <p>Se ha cambiado con éxito su clave de acceso a ${gldef.url}</p>
      <p>Nunca comparta o devele su contraseña.</p>

      <h2>Sus datos de acceso son:</h2>
     
       <p><strong>URL: </strong>  ${gldef.url}</p>
       <p><strong>Nombre de usuario: </strong> ${data.username}</p>
       <p><strong>Correo electrónico: </strong> ${data.email}</p>
       <h4>Estamos atentos por cualquier asistencia que Usted pudiera necesitar.</h4>

      <h4>Equipo de desarrollo</h4>

      `;
    return tmpl;

  }else if(gldef.company === 'masuno') {
      const tmpl = `
      <p>Estimadx  ${data.displayName}: </p>
      <p>Se ha cambiado con éxito su clave de acceso a ${gldef.url}</p>
      <p>Nunca comparta o devele su contraseña.</p>

      <h2>Sus datos de acceso son:</h2>
     
       <p><strong>URL: </strong>  ${gldef.url}</p>
       <p><strong>Nombre de usuario: </strong> ${data.username}</p>
       <p><strong>Correo electrónico: </strong> ${data.email}</p>
       <h4>Estamos atentos por cualquier asistencia que Usted pudiera necesitar.</h4>


      <h4>Equipo de desarrollo</h4>

      `;
    return tmpl;

  }else {
      const tmpl = `
      <p>Estimadx  ${data.displayName}: </p>
      <p>Se ha cambiado con éxito su clave de acceso a ${gldef.url}</p>
      <p>Nunca comparta o devele su contraseña.</p>

      <h2>Sus datos de acceso son:</h2>
     
       <p><strong>URL: </strong>  ${gldef.url}</p>
       <p><strong>Nombre de usuario: </strong> ${data.username}</p>
       <p><strong>Correo electrónico: </strong> ${data.email}</p>
       <h4>Estamos atentos por cualquier asistencia que Usted pudiera necesitar.</h4>


      <h4>Equipo de desarrollo</h4>

      `;
    return tmpl;
  }
}

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {
	pageTitle: string = 'Bienvenido a develar';

	public form: FormGroup;
	submitted = false;

	users: User[];
	model: User;
  modelId:  string;
  userlistener: BehaviorSubject<User>;


  constructor( 
		private router: Router,
  	private route: ActivatedRoute,
  	private fb: FormBuilder, 
		private userService: UserService) {

      this.form = this.fb.group({
        password: password,
        confirmPassword: confirmPassword,
      });
  }

  ngOnInit() {
    // this.userlistener = this.userService.userEmitter;
    // this.userlistener.subscribe(user =>{
    //   this.model = user;
    //   console.log('SignUp: [%s]  [%s]', (this.model && this.model._id), (this.model && this.model.username) )
    //   this.initForEdit()
    // })

    this.modelId = this.route.snapshot.paramMap.get('id');
		this.initUserToEdit(this.modelId);


    // setTimeout(()=>{
    //   this.model = this.userService.currentUser;
    //   if(this.model.username !== 'invitado'){
    //     //this.initForEdit();
    //   }
    // }, 2000)

  }

  initUserToEdit(id: string){

    this.userService.getUser(this.modelId).then(user => {
      //console.log('User fetch!: [%s] [%s] [%s] [%s]', user.id, user.username, user.estado, user.termscond);

      this.model = user;
      this.model.id = this.model._id;
      //console.log('User fetch!: [%s] [%s] [%s] [%s]', user.id, user.username, this.termsofuse, user.termscond);
	    this.form.reset({
	      password:  this.model.password,
	      confirmPassword:  this.model.confirmPassword,
	    });

    });
  }

 
  onSubmit() {
    this.model = this.initUserForSave();

    if(this.model._id){
      this.userService.credentials(this.model).then(user => {
        this.sendMailTo(user);
        this.router.navigate(['/ingresar/login']);
      });

    }

  }

  sendMailTo(model: User){
    const content = this.userService.sendMailFactory();
    content.mailTo = model.email;
    content.mailFrom = 'intranet.develar@gmail.com';
    content.mailSubject = 'Registración de usuario';
    content.mailBody = buildMailContent({
      username: model.username,
      displayName: model.displayName,
      email: model.email
    });

    this.userService.send(content)

  }

  initForEdit(){
    this.form.reset({
      password:  this.model.password,
      confirmPassword:  this.model.confirmPassword,
    });
  }
 
  initUserForSave(): User {
    const formModel = this.form.value;

    this.model.password    = formModel.password;
    this.model.confirmPassword = formModel.confirmPassword;

    return this.model;
  }
 

	get debugMe(){
		return JSON.stringify(this.model);
	}
}
