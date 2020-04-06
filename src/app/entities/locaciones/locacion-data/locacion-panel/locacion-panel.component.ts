import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ModalDialogComponent, DialogData, DialogActionData } from '../../../../develar-commons/modal-dialog/modal-dialog.component';

import { LocacionHospitalaria, LocacionEvent} from '../../locacion.model';

import { LocacionHelper } from '../../locacion.helper';

import { LocacionService } from '../../locacion.service';


const UPDATE = 'update';
const CANCEL = 'cancel';
const DELETE = 'delete';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE = 'navigate';


@Component({
  selector: 'locacion-panel',
  templateUrl: './locacion-panel.component.html',
  styleUrls: ['./locacion-panel.component.scss']
})
export class LocacionPanelComponent implements OnInit {
	@Input() items: Array<LocacionHospitalaria>;
  @Input() locacion: LocacionHospitalaria;
	@Output() locacionesEventEmitted = new EventEmitter<LocacionEvent>();

  public title = 'Locaciones de internacón';

	public showList = false;

  public openEditor = true;

  constructor(
      private locSrv: LocacionService,
      public dialog: MatDialog

    ) { }

  ngOnInit() {

  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: LocacionEvent){
    if(event.action === UPDATE){

    	this.locacion = event.token;
      this.locSrv.manageLocacionesRecord(this.locacion).subscribe(t =>{
        if(t){
          event.token = t;
          this.locacion = t;
        }

        this.emitEvent(event);

      });

    } else if(event.action === NAVIGATE){
      this.emitEvent(event);


    } else if(event.action === DELETE){
      this.deleteItem(event.token)

    } else if(event.action === CANCEL){
      this.emitEvent(event);

    }
  }

  private deleteItem(token:LocacionHospitalaria){
    let isNew = token._id ? false: true;
    if(isNew){
      this.deleteFromListItems(token);
    }

  }

  private deleteFromListItems(token: LocacionHospitalaria){
    let index = this.items.indexOf(token);
    if(index !== -1){
      this.items.splice(index, 1)
    }
  }



  addItemEvent(){

  }

  altaRapidaServicio(){
    // futuros usos, o borrar
  }

  
  private emitEvent(event:LocacionEvent){
  
  	if(event.action === UPDATE){
  		this.locacionesEventEmitted.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	  });

  	} else if(event.action === NAVIGATE){
      this.locacionesEventEmitted.next({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      items: this.items
      });

    }
  }


}
