import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { MainMenuItem } from './menu-helper';
import * as itemList    from './layouts/main-menu-items';

@Injectable({
  providedIn: 'root'
})
export class MinimalMenuService {
  constructor() { }
 

 	private menuChange = new Subject<MainMenuItem[]>();

	menuListener$ = this.menuChange.asObservable();

	loadMenu(menu){
		this.menuChange.next(menu);
	};


  loadDefaultMenuItems(token){
    let defaultMenu = Promise.resolve(itemList[token]);

    defaultMenu.then(mainMenuItems => this.loadMenu(mainMenuItems));
  }

  getMainMenuItems(token): Promise<MainMenuItem[]> {
    return Promise.resolve(itemList[token]);
  }
}
