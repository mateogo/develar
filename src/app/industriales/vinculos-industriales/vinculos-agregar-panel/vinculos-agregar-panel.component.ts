import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  UpdatePersonVinculosEvent,
  UpdateItemListEvent,
  PersonVinculosData,
} from '../../../entities/person/person';

const TOKEN_TYPE = 'vinculos';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'app-vinculos-agregar-panel',
  templateUrl: './vinculos-agregar-panel.component.html',
  styleUrls: ['./vinculos-agregar-panel.component.scss'],
})
export class VinculosAgregarPanelComponent implements OnInit {
  @Input() items: Array<PersonVinculosData>;
  @Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Vincular una industria';
  public showList = false;
  public openEditor = true;

  constructor() {}

  ngOnInit() {
    if (this.items && this.items.length) {
      this.showList = true;
    }
  }

  updateItem(event: UpdatePersonVinculosEvent) {
    if (event.action === DELETE) {
      this.deleteItem(event.token);
    }

    this.emitEvent(event);
  }

  deleteItem(t: PersonVinculosData) {
    const index = this.items.indexOf(t);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  addItem() {
    const item = new PersonVinculosData();

    if (this.items) {
      this.items.push(item);
    } else {
      this.items = [item];
    }

    this.showList = true;
  }

  emitEvent(event: UpdatePersonVinculosEvent) {
    if (event.action !== CANCEL) {
      this.updateItems.next({
        action: UPDATE,
        type: TOKEN_TYPE,
        items: this.items as PersonVinculosData[],
      });
    }
  }
}
