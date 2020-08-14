import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaludController } from '../../../salud/salud.controller';
import { NovedadesFollowUpService }  from '../../vigilancia-zmodal-managers/fup-novedades-modal.service';

import { PersonService } from '../../../salud/person.service';

import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../entities/person/person';

import {  Asistencia,
					Novedad,
					UpdateNovedadEvent,
          UpdateAsistenciaListEvent,
          AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';


const UPDATE = 'update';
const DELETE = 'delete';
const TOKEN_TYPE = 'asistencia';
const NAVIGATE = 'navigate';


@Component({
  selector: 'vigil-novedad-panel',
  templateUrl: './vigil-novedad-panel.component.html',
  styleUrls: ['./vigil-novedad-panel.component.scss'],
  providers: [ NovedadesFollowUpService ]
})
export class VigilNovedadPanelComponent implements OnInit {
	@Input() items: Array<Novedad>;
	@Input() asistencia: Asistencia;
	@Output() updateItems = new EventEmitter<UpdateAsistenciaListEvent>();

  public title = 'Novedades y tareas';

	public showList = false;
  public showActiveList = false;
  public showFullList = true;
  private showListMode = true;


  public openEditor = true;
  public activeitems: Array<Novedad> = [];

  constructor(
    private novedadService: NovedadesFollowUpService

    ) { }

  ngOnInit(): void {
 
  	if(this.items && this.items.length){
      this.showList = true;
      this.toggleActiveView();
      //this.filterActiveItems();
  	}


  }

  activeView(){
    this.toggleActiveView();
  }

  addItem(){

    this.openNovedadesModal(null);

    // let item = AsistenciaHelper.initNewNovedad('tarea', 'epidemiologia','hisopar', 1, '01/08/2020');
    // if(!this.items) this.items = [];
    // if(!this.activeitems) this.activeitems = [];

    // this.items.unshift(item);
    // this.activeitems.unshift(item);

    // this.showList = true;

  }
  private openNovedadesModal(novedad: Novedad){

    this.novedadService.openDialog(this.asistencia, novedad).subscribe(editEvent =>{
      if(editEvent.action === UPDATE){
        this.asistencia = editEvent.token;
        //this.manageAsistenciaView(this.viewList);        
      }
    })


  }



  updateNovedad(event: UpdateNovedadEvent){
    if(event.action === UPDATE){
      // // this.dsCtrl.manageAsistenciaRecord(event.token).subscribe(t =>{
      // //   if(t){
      // //     event.token = t;

      // //     this.filterActiveItems();
      // //   }

      //   this.emitEvent(event);

      // });

    } else if(event.action === NAVIGATE){
      this.emitEvent(event);


    } else if(event.action === DELETE){
      this.deleteItem(event.token)


    }
  }

  private deleteItem(token: Novedad){
    let isNew = token._id ? false: true;
    if(isNew){
      this.deleteFromListItems(token);
    }

  }

  private filterActiveItems(){
    this.activeitems = [];
    setTimeout(()=>{
      this.activeitems = AsistenciaHelper.filterActiveNovedades(this.items);

      if(this.activeitems && this.activeitems.length){
        this.toggleActiveView();

      }else{
        this.toggleActiveView();

      }

    },500);

  }

  private deleteFromListItems(token: Novedad){
    let index = this.items.indexOf(token);
    if(index !== -1){
      this.items.splice(index, 1)
    }
  }

  private emitEvent(event:UpdateNovedadEvent){
  
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



  toggleActiveView(){
    this.showListMode = !this.showListMode;

    if(this.showListMode === true){
      this.title = 'Novedades y tareas pendientes';
    } else {
      this.title = 'Novedades TODAS';

    }
    this.showActiveList = this.showListMode;
    this.showFullList = !this.showListMode;
  }



}
