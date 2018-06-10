import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { WorkgroupMenuItem } from './workgroup-menu-item';
import { WORKGROUPITEMS    } from './workgroup-menu-items';

@Injectable()
export class WorkgroupMenuService {
	private menuChange = new Subject<WorkgroupMenuItem[]>();

	menuListener$ = this.menuChange.asObservable();

	loadMenu(menu){
		this.menuChange.next(menu);
	};


  loadDefaultMenuItems(){
    let defaultMenu = Promise.resolve(WORKGROUPITEMS);

    defaultMenu.then(mainMenuItems => this.loadMenu(mainMenuItems));
  }

}