import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserService }   from '../../../entities/user/user.service';

import { User }          from '../../../entities/user/user';

import { MainMenuItem, SubMenuItem } from './main-menu-item';
import { MAINMENUITEMS, COMPANY_MENU } from './mock-main-menu-items';

const DEFAULT = 'DEFAULT'

@Injectable()
export class MainMenuService {
	private menuChange = new Subject<MainMenuItem[]>();

  private currentUser: User;
  private currentCompany: string;
  private menuItems: MainMenuItem[] = [];
  private filteredItems: MainMenuItem[] = [];
  private hasAlreadyEmit = false;

  private _menuListener$ = this.menuChange.asObservable();

  constructor(
        private userService: UserService,
      ) { 

    this.userService.userEmitter.subscribe((user: User) =>{

      this.updateUserStatus(user);
    })
  }

  get menuListener$(){
    return this._menuListener$;
  }

  loadDefaultMenuItems(){
    let defaultMenu = Promise.resolve(MAINMENUITEMS);

    defaultMenu.then(mainMenuItems => this.emitMenuChange(mainMenuItems));
  }

  loadCompanyMenuItems(company?){
    if(!company) company = DEFAULT;
    this.currentCompany = company;
    this.menuItems = COMPANY_MENU[company] || COMPANY_MENU[DEFAULT];
    this.filterMenuItemsByUser();

  }

	private emitMenuChange(menu){
    this.hasAlreadyEmit = true;
		this.menuChange.next(menu);
	};


  private filterMenuItemsByUser(){
    if(!this.currentUser || !this.currentCompany ) return;

    if(this.hasAlreadyEmit) {
      this.emitMenuChange(this.filteredItems);
      return;
    }

    this.filteredItems = []
    let roles = (this.currentUser && this.currentUser.moduleroles) || []

    this.filteredItems = this.menuItems.filter(item => this.isValidItem(item, roles))
    this.filteredItems =  this.filteredItems.map(item => this.filterSubItems(item, roles))
    this.emitMenuChange(this.filteredItems);

  }


  private filterSubItems(item: MainMenuItem , roles: Array<string>): MainMenuItem{
    if(item.sub && item.sub.length){

      item.sub = item.sub.filter(sitem => this.isValidItem(sitem, roles));
    }

    return item
  }


  private isValidItem(item: MainMenuItem|SubMenuItem , roles: Array<string>): boolean{
    let valid = true;

    if(item.rolesOut && item.rolesOut.length){
      let hasRole = item.rolesOut.find(rejected => {
        return roles.find(t => t === rejected)
      })
      if(hasRole) return false;
    }

    if(item.rolesIn && item.rolesIn.length){
      let hasRole = item.rolesIn.find(required => {
        return roles.find(t => t === required)
      })
      if(!hasRole) return false;
    }

    return valid;
  }


  private updateUserStatus(user:User){

    if(user.username === 'invitado') return;
    if(this.currentUser !== user){
      this.currentUser = user;
      this.filterMenuItemsByUser();

    }

  }

}