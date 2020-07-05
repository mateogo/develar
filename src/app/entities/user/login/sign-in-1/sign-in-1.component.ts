import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject }       from 'rxjs';

@Component({
  selector: 'user-sign-in-1',
  templateUrl: './sign-in-1.component.html',
  styleUrls: ['./sign-in-1.component.scss']
})
export class UserSignIn1Component implements OnInit {
  constructor(
  	private router: Router,
    public dialog: MatDialog, 
  	private userService: UserService
  	) {
  }
  
  model: User;
  dialogRef: MatDialogRef<DialogUserComponent>;
  userlistener: BehaviorSubject<User>;

  ngOnInit() {
    this.model = this.userService.currentUser;
    if(this.model.email === 'invitado@develar') this.model.email = "";

    this.userlistener = this.userService.userEmitter;

    this.userlistener.subscribe(user =>{
      user.password = '';
      this.model = user;
      if(this.model.email === 'invitado@develar') this.model.email = "";
    })

  }

  onSubmit() {
  	this.loginUser();
    //this.router.navigate(['/develar/gestion/dashboard']);
  }

  openDialog() {
    let config = {
      width: '430px',
      height: '250px',
      //hasBackdrop: true,
      //backdropClass: 'yellow-backdrop',
      data:{
        message: 'Intente nuevamente o comuníquese con el administrador'
      }
    };

    let dialogRef = this.dialog.open(DialogUserComponent, config);
    //dialogRef.updateSize('430px', '220px');
    dialogRef.afterClosed().subscribe(result => {
      //this.selectedOption = result;
    });
  }

  loginUser(){
  	this.userService.login(this.model).then(user => {

  		this.userService.currentUser = user;

  		this.router.navigate(['/ingresando']);

  	})
  	.catch((err) =>{
      this.openDialog();
  	});


  }

  loginGoogle(e){
    e.stopPropagation();
    e.preventDefault();
    window.location.href = '/api/users/login/google';
  }

}


@Component({
  selector: 'dialog-result',
  templateUrl: 'user-dialog.html',
})
export class DialogUserComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
}
