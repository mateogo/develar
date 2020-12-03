import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
  UpdatePersonVinculosEvent,
  PersonVinculosData,
} from '../../../entities/person/person';

const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'app-vinculos-agregar-base',
  templateUrl: './vinculos-agregar-base.component.html',
  styleUrls: ['./vinculos-agregar-base.component.scss'],
})
export class VinculosAgregarBaseComponent implements OnInit {
  @Input() token: PersonVinculosData;
  @Output() updateToken = new EventEmitter<UpdatePersonVinculosEvent>();

  public showView = true;
  public showEdit = false;
  public openEditor = false;

  constructor() {}

  ngOnInit() {
    if (!this.token.apellido && !this.token.nombre) {
      this.editToken();
    }
  }

  manageToken(event: UpdatePersonVinculosEvent) {
    this.openEditor = false;
    this.showEdit = false;
    this.showView = true;
    this.emitEvent(event);
  }

  emitEvent(event: UpdatePersonVinculosEvent) {
    if (event.action !== CANCEL) {
      this.updateToken.next(event);
    }
  }

  editToken() {
    this.openEditor = !this.openEditor;
    this.showView = !this.showView;
    this.showEdit = !this.showEdit;
  }

  removeToken() {}
}
