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
	timeout: any;

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
			if(users && users.length){

				users.sort((f,s)=> {
					if(f.username < s.username) return -1;
					if(f.username > s.username) return 1;
					return 0;
				})

				this.users = users;
				setTimeout(() => { this.loadingIndicator = false; }, 1500);

			}else{
				this.users = [];
			}
		});
	}

 	ngOnInit(): void {
 		this.getUsers();
		this.columns = [
			{ prop: 'username',    name: 'UsuariO' , minWidth:'150'},
			{ prop: 'email',        name: 'Correo electrónico', minWidth:'250' },
			{ prop: 'displayName', name: 'Mostrar como...', minWidth:'250' },
			{ prop: '_id', name: 'Acciones', width:'150' , sortable: false, cellTemplate: this.actionsTmpl},
		];

 	}

	onSelect(user: User): void{
		this.selectedUser = user;
	}

	onPage(e){
		clearTimeout(this.timeout);
		setTimeout(()=>{
			//console.log('paged!', e);
		},100)

	}

}


/**
	paginating
  class="material fullscreen"
  [rows]="users"
  style="top: 52px"
  [limit]="20"
  [headerHeight]="50"
  [rowHeight]="50"
  [footerHeight]="50"
  [loadingIndicator]="loadingIndicator"
  (page)="onPage($event)"
  [columnMode]="'force'">



	inline-editing
  <ngx-datatable-column name="Gender">
    <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-row="row" let-value="value">
      <span
        title="Double click to edit"
        (dblclick)="editing[rowIndex + '-gender'] = true"
        *ngIf="!editing[rowIndex + '-gender']"
      >
        {{ value }}
      </span>
      <select
        *ngIf="editing[rowIndex + '-gender']"
        (blur)="editing[rowIndex + '-gender'] = false"
        (change)="updateValue($event, 'gender', rowIndex)"
        [value]="value"
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </ng-template>
  </ngx-datatable-column>


*/