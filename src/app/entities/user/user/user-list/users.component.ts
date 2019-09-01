import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router }   from '@angular/router';

import { SharedService } from '../../../../develar-commons/shared-service';

import { User } from '../../user';
import { UserService } from '../../user.service';


@Component({
	selector: 'users-list',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})


export class UsersComponent implements OnInit { 
	pageTitle: string = 'Usuarios registrados';
	users: User[] = [];

	selectedUser: User;

  @ViewChild('actionsTmpl', { static: true }) public actionsTmpl: TemplateRef<any>;

	columns = [];
	rows = [];
	loadingIndicator: boolean = true;

	constructor(
		private userService: UserService, 
		private _sharedService: SharedService,

		private router: Router
		){ 
      this._sharedService.emitChange(this.pageTitle);
		}


	delete(user: User): void {
		this.userService
			.delete(user.id)
			.then(() => {
				this.users = this.users.filter(h => h !== user);
				if (this.selectedUser === user) { this.selectedUser = null; }
			});
	}

	getUsers(): void{
		this.userService.getUsers().then(users => {
			this.users = users;
			setTimeout(() => { this.loadingIndicator = false; }, 1500);
		});
	}

 	ngOnInit(): void {
 		this.getUsers();
		this.columns = [
			{ prop: 'id',          name: 'ID', minWidth:'65'},
			{ prop: 'username',    name: 'UsuariO' , minWidth:'150'},
			{ prop: 'email',        name: 'Correo electrónico', minWidth:'250' },
			{ prop: 'displayName', name: 'Mostrar como...', minWidth:'250' },
			{ prop: '_id', name: 'Acciones', width:'150' , sortable: false, cellTemplate: this.actionsTmpl},
		];

 	}

	onSelect(user: User): void{
		this.selectedUser = user;
	}

}