import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './entities/user/user.service';

@Component({
  moduleId: module.id,
  selector: 'app',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['../assets/sass/style.scss']
})
export class AppComponent {
	
	constructor(
    private userService: UserService,
    private router: Router) {
	}

	ngOnInit(){
		if(!this.userService || !this.userService.currentUser){
			this.router.navigate(['/develar/ingresar'])
		}
	}

}
