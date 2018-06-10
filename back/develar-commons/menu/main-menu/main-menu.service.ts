import { Injectable } from '@angular/core';

import { MainMenuItem } from './main-menu-item';
import { MAINMENUITEMS } from './mock-main-menu-items';

@Injectable()
export class MainMenuService {
  getMainMenuItems(): Promise<MainMenuItem[]> {
    return Promise.resolve(MAINMENUITEMS);
  }
}