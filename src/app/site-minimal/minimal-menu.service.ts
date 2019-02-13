import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { MainMenuItem, SocialMediaItem } from './menu-helper';
import * as itemList    from './layouts/main-menu-items';

@Injectable({
  providedIn: 'root'
})
export class MinimalMenuService {
  constructor() { }
 

 	private menuChange = new Subject<MainMenuItem[]>();
  private socialChange = new Subject<SocialMediaItem[]>();

	menuListener$ = this.menuChange.asObservable();
  socialListener$ = this.socialChange.asObservable();

	loadMenu(menu){
		this.menuChange.next(menu);
	};

  loadDefaultMenuItems(token){
    let defaultMenu = Promise.resolve(itemList[token]);

    defaultMenu.then(mainMenuItems => this.loadMenu(mainMenuItems));
  }


  loadSocialItems(token){
    let defaultMenu = Promise.resolve(itemList[token]);
    defaultMenu.then(socialItems => this.socialChange.next(socialItems));
  }



  getMainMenuItems(token): Promise<MainMenuItem[]> {
    return Promise.resolve(itemList[token]);
  }
}
