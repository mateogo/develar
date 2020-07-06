import { Component, OnInit } from '@angular/core';

import { MainMenuItem, SubMenuItem } from './main-menu-item';
import { MainMenuService } from './main-menu.observable.service';
import { gldef } from '../../develar.config';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: [ './main-menu.component.scss' ],
  providers: [ MainMenuService ]
})
export class MainMenuComponent {
  mainMenuItems: MainMenuItem[];


  constructor(
        private mainMenuService: MainMenuService
      ) { 


    mainMenuService.menuListener$.subscribe(
      items => {
        this.mainMenuItems = items;
      }
    );

  }

  getMainMenuItems(): void {
    //this.mainMenuService.getMainMenuItems().then(mainMenuItems => this.mainMenuItems = mainMenuItems);
  }

  ngOnInit(): void {

    //this.mainMenuService.loadDefaultMenuItems()
    this.mainMenuService.loadCompanyMenuItems(gldef.mainmenu);
    //this.getMainMenuItems();
  }

  toggle(event: Event, item: any, el: any) {
    event.preventDefault();

    let items: any[] = el.mainMenuItems;

    if (item.active) {
      item.active = false;
    } else {
      for (let i = 0; i < items.length; i++) {
        items[i].active = false;
      }
      item.active = true;
    }
  }




}