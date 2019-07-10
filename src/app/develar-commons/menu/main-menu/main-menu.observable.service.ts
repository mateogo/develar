import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { MainMenuItem } from './main-menu-item';
import { MAINMENUITEMS, COMPANY_MENU } from './mock-main-menu-items';

const DEFAULT = 'DEFAULT'

@Injectable()
export class MainMenuService {
	private menuChange = new Subject<MainMenuItem[]>();

	menuListener$ = this.menuChange.asObservable();

	loadMenu(menu){
		this.menuChange.next(menu);
	};


  loadDefaultMenuItems(){
    let defaultMenu = Promise.resolve(MAINMENUITEMS);

    defaultMenu.then(mainMenuItems => this.loadMenu(mainMenuItems));
  }

  loadCompanyMenuItems(company?){
  	if(!company) company = DEFAULT;
  	let items = COMPANY_MENU[company] || COMPANY_MENU[DEFAULT]
    let defaultMenu = Promise.resolve(items);

    defaultMenu.then(mainMenuItems => this.loadMenu(mainMenuItems));
  }

}