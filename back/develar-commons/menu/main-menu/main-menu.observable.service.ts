import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { MainMenuItem } from './main-menu-item';
import { MAINMENUITEMS } from './mock-main-menu-items';

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

}