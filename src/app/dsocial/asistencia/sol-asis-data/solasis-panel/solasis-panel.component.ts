import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { DsocialController } from '../../../dsocial.controller';

import {  Person } from '../../../../entities/person/person';

import { ModalDialogComponent, DialogData, DialogActionData } from '../../../../develar-commons/modal-dialog/modal-dialog.component';

import { 	Asistencia, 
					Alimento, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../asistencia.model';
import { KitOptionList } from '../../../alimentos/alimentos.model';

const UPDATE = 'update';
const DELETE = 'delete';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE = 'navigate';

@Component({
  selector: 'solasis-panel',
  templateUrl: './solasis-panel.component.html',
  styleUrls: ['./solasis-panel.component.scss']
})
export class SolasisPanelComponent implements OnInit {
	@Input() items: Array<Asistencia>;
  @Input() person: Person;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();

  public title = 'Solicitudes de Asistencia';

	public showList = false;
  public showActiveList = false;
  public showFullList = true;

  public openEditor = true;
  public kitEntregaOptList: KitOptionList[];

  public activeitems: Array<Asistencia> = [];

  constructor(
      private dsCtrl: DsocialController,
      public dialog: MatDialog

    ) { }

  ngOnInit() {
    this.kitEntregaOptList = this.dsCtrl.kitAlimentosOptList;

  	if(this.items && this.items.length){
      this.filterActiveItems();
  		this.showList = true;
  	}

  }

  private filterActiveItems(){
    this.activeitems = [];
    setTimeout(()=>{
      this.activeitems = AsistenciaHelper.filterActiveAsistencias(this.items);

      if(this.activeitems && this.activeitems.length){
        this.showActiveView(true);

      }else{
        this.showActiveView(false);

      }


    },500);

  }

  updateItem(event: UpdateAsistenciaEvent){
    if(event.action === UPDATE){
      this.dsCtrl.manageAsistenciaRecord('asistencia',event.token).subscribe(t =>{
        if(t){
          event.token = t;

          this.filterActiveItems();
        }

        this.emitEvent(event);

      });

    } else if(event.action === NAVIGATE){
      this.emitEvent(event);


    } else if(event.action === DELETE){
      this.deleteItem(event.token)


      // this.dsCtrl.manageAsistenciaDeleteRecord('asistencia',event.token).subscribe(t =>{

      //   this.emitEvent(event);

      // });      

    }
  }

  private deleteItem(token:Asistencia){
    let isNew = token._id ? false: true;
    if(isNew){
      this.deleteFromListItems(token);
    }

  }

  deleteFromListItems(token: Asistencia){
    let index = this.items.indexOf(token);
    if(index !== -1){
      this.items.splice(index, 1)
    }
  }


  altaRapida1vez(){
    if(this.person && this.person.estado !== 'activo'){

      this.dsCtrl.openSnackBar('El registro del requirente no esta ACTIVO', 'Cerrar');

    }else{
      this.altaRapidaDialog();

    }

  }

  private altaRapidaDialog(){
    let dialog = {
      caption: 'ALTA RÁPIDA',
      title: 'Solicitud de Alimentos x ÚNICA VEZ',
      body: 'Estas por generar una Solicitud de Asistencia de ALIMENTOS. Justifica la decisión',
      accept: {
        action: 'alta',
        label: 'CONFIRMAR ALTA RÁPIDA'
      } ,
      cancel: {
        action: 'alta',
        label: 'CANCELAR'        
      } ,
      input: {
        value: '',
        label: 'Observación / Justificación',
        action: 'novedad'        
      },

    } as DialogData;

    this.openDialog(dialog)

  }

  private openDialog(dialog: DialogData): void {

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '450px',
      data: dialog
    });


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.createSolAsistenciaUnicaVez(result);
      }else {

      }

    });
  }

  private createSolAsistenciaUnicaVez(justifica: string){
    this.dsCtrl.createExpressAsistencia('alimentos', this.person, justifica).subscribe(alim => {
      if(alim){
        if(!this.items) this.items = [];
        if(!this.activeitems) this.activeitems = [];

        this.items.unshift(alim);
        this.activeitems.unshift(alim);

        this.showList = true;
      }
    })

  }


  addItem(){
    if(this.person && this.person.estado !== 'activo'){

      this.dsCtrl.openSnackBar('El registro del requirente no esta ACTIVO', 'Cerrar');

    }else{
      let item = AsistenciaHelper.initNewAsistencia('alimentos', 'alimentos')
      if(!this.items) this.items = [];
      if(!this.activeitems) this.activeitems = [];

      this.items.unshift(item);
      this.activeitems.unshift(item);

      this.showList = true;

    }

  }

  emitEvent(event:UpdateAsistenciaEvent){
  
  	if(event.action === UPDATE){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items
  	  });

  	} else if(event.action === NAVIGATE){
      this.updateItems.next({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      items: this.items
      });

    }
  }

  activeView(){
    this.showActiveView(true);
  }

  fullView(){
    this.showActiveView(false);
  }

  private showActiveView(active){
    if(active === true){
      this.title = 'Solicitudes de Asistencia (solo activas)';
    } else {
      this.title = 'Solicitudes de Asistencia (lista completa)';

    }
    this.showActiveList = active;
    this.showFullList = !active;
  }

}
