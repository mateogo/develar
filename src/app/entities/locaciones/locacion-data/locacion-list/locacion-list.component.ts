import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { LocacionHospitalaria, LocacionEvent} from '../../locacion.model';

import { LocacionHelper } from '../../locacion.helper';

import { LocacionService } from '../../locacion.service';

const UPDATE =     'update';
const EVOLUCION =  'evolucion';
const DELETE =     'delete';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE =   'navigate';

@Component({
  selector: 'locacion-list',
  templateUrl: './locacion-list.component.html',
  styleUrls: ['./locacion-list.component.scss']
})
export class LocacionListComponent implements OnInit {
  @Input() locaciones: Array<LocacionHospitalaria>;
  @Output() updateItems = new EventEmitter<LocacionEvent>();

  public title = 'Locaciones de Internación';
  public showList = false;

  constructor(
      private locSrv: LocacionService,
    ) { }

  ngOnInit() {

    if(this.locaciones && this.locaciones.length){
      this.showList = true;
    }
  }

  updateItemEevent(event: LocacionEvent){
        this.emitEvent(event);
  }

  private emitEvent(event:LocacionEvent){
    if(event.action === UPDATE){
      this.updateItems.next({
      action: UPDATE,
      type: TOKEN_TYPE,
      items: this.locaciones
      });
    } else if(event.action === EVOLUCION){
      this.updateItems.next({
      action: EVOLUCION,
      type: TOKEN_TYPE,
      items: this.locaciones
      });

    } else if(event.action === NAVIGATE){
      this.updateItems.next({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      items: this.locaciones
      });
    }
  }

}
