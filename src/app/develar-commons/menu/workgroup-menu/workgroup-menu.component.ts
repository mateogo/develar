import { Component, OnInit } from '@angular/core';

import { WorkgroupMenuItem } from './workgroup-menu-item';
import { WorkgroupMenuService }   from './workgroup-menu.observable.service';

@Component({
  selector: 'workgroup-menu',
  templateUrl: './workgroup-menu.component.html',
  styleUrls: ['./workgroup-menu.component.scss'],
  providers: [ WorkgroupMenuService ]
})
export class WorkgroupMenuComponent {
  mainMenuItems: WorkgroupMenuItem[];

  constructor(private menuService: WorkgroupMenuService) { 
    menuService.menuListener$.subscribe(
      items => {
        this.mainMenuItems = items;
      }
    );

  }

  getWorkgroupMenuItems(): void {
    //this.menuService.getWorkgroupMenuItems().then(mainMenuItems => this.mainMenuItems = mainMenuItems);
  }

  ngOnInit(): void {
    this.menuService.loadDefaultMenuItems()
    //this.getWorkgroupMenuItems();
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