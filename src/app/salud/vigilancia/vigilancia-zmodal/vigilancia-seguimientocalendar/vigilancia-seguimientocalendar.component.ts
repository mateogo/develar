import { Component, ViewChild, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { devutils }from '../../../../develar-commons/utils';

import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventInput } from '@fullcalendar/core';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick

import { SaludController } from '../../../salud.controller';

import {   Asistencia, AfectadoFollowUp, AfectadoUpdate, UpdateAsistenciaEvent,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';


const UPDATE = 'update';
const BROWSE = 'browse';
const CANCEL = 'cancel';
const SISA_VIEW = 'sisa:view';
//npm install --save @fullcalendar/angular @fullcalendar/core @fullcalendar/daygrid

@Component({
  selector: 'vigilancia-seguimientocalendar',
  templateUrl: './vigilancia-seguimientocalendar.component.html',
  styleUrls: ['./vigilancia-seguimientocalendar.component.scss']
})
export class VigilanciaSeguimientocalendarComponent implements OnInit {
  @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent; // the #calendar in the template

  public calendarVisible = false;
  public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  public calendarWeekends = true;


  public asistencia: Asistencia;
  public token: AfectadoUpdate; // from DB
  public tokenData: TokenData; // template usage

	public tokenList: AfectadoUpdate[] = [];
	public eventList: EventInput[] = [];

  private result: UpdateAsistenciaEvent;

  public displayAs = '';

  public showAfectadoFollowUp = false;
  private inicioDate: string = null;

 
  constructor(
        public dialogRef: MatDialogRef<VigilanciaSeguimientocalendarComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any ) {
  }

  ngOnInit(): void {
  	
  	this.asistencia = this.data.asistencia
  	this.buildAfectadoFollowUp(this.asistencia);

  	this.token = new AfectadoUpdate();

  	this.result = {
							  		action: BROWSE,
							  		type: SISA_VIEW,
							  		token: this.asistencia
  								} as  UpdateAsistenciaEvent;
  }


  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast() {
  	if(!this.inicioDate) return;
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(this.inicioDate); // call a method on the Calendar object
  }

  handleDateClick(arg) {
    if (confirm('Funcionalidad aún no implementada ' + arg.dateStr + ' ?')) {
      this.eventList = this.eventList.concat({ // add new event data. must create new array
        title: 'New Event',
        start: arg.date,
        allDay: arg.allDay
      })
    }
  }


  private buildAfectadoFollowUp(entity: Asistencia){
    this.displayAs = this.asistencia.requeridox ? this.asistencia.requeridox.slug + ' ' + (this.asistencia.telefono || '') : '';

    if(!entity.followUp){
      this.showAfectadoFollowUp = false;
      return;
    }
    this.tokenData = new TokenData(entity.followUp);

    this.tokenList = entity.seguimEvolucion || [];
    this.buildTokenEvents(this.tokenList, entity.followUp, entity);
    this.sortProperly(this.tokenList);

    this.showAfectadoFollowUp = true;
    this.calendarVisible = true;
  }


  private buildTokenEvents(list: AfectadoUpdate[], followUp: AfectadoFollowUp, sinternacion: Asistencia){
  	this.eventList = list.map(t =>{
  		let dateTx = devutils.txInvertedFromDate(new Date(t.fets_llamado));
  		return {
  			title: `LL: ${t.resultado}: ${t.vector}`,
  			start: dateTx
  		} as EventInput
  	})

  	if(followUp && followUp.fets_inicio){
  		let hisopado = this.filterNecesidadDeLaboratorio(sinternacion)
  		let hisopadoYa = hisopado.needsHisopado ? ' ¡HISOPAR! ' : '';
  		let covid = hisopado.isCovid ? 'COVID' : '';
  		this.inicioDate = devutils.txInvertedFromDate(new Date(followUp.fets_inicio));

	  	this.eventList.push({
	  			title: `Seguimiento: ${followUp.tipo} Días:#${hisopado.dias}  ${covid}  ${hisopadoYa} `,
	  			start: devutils.txInvertedFromDate(new Date(followUp.fets_inicio)), 
	  			end: devutils.txInvertedFromDate(new Date()), 
	  		} as EventInput)
  	}

  }



  private sortProperly(records: AfectadoUpdate[]){
    records.sort((fel: AfectadoUpdate, sel: AfectadoUpdate)=> {
        if(fel.fets_llamado < sel.fets_llamado ) return 1;

        else if(fel.fets_llamado > sel.fets_llamado) return -1;

        else return 0;
    });
  }

  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }

	private filterNecesidadDeLaboratorio(token: Asistencia): HisopadoYa{
		let response = new HisopadoYa();
		let today = new Date()
		let today_ts = today.getTime();
		let feReferencia_ts = null;
		let isCovid = false;

		// caso 1
		if(!(token.followUp)) return response;
		feReferencia_ts = token.followUp.fets_inicio;
		response.hasFollowUp = true;
		let diasSeguimiento = (today_ts - feReferencia_ts) / (1000 * 60 * 60 * 24) ;
		response.dias = Math.floor(diasSeguimiento);

		if(token.infeccion){
		  if(token.infeccion.actualState === 1){
		    isCovid = true;
		    response.isCovid = true;
		    feReferencia_ts = token.infeccion.fets_confirma
				diasSeguimiento = (today_ts - feReferencia_ts) / (1000 * 60 * 60 * 24) ;
				response.dias = Math.floor(diasSeguimiento);

		  }

		  // caso 2
		  if(token.infeccion.actualState === 3 || token.infeccion.actualState === 4 || token.infeccion.actualState === 5   ) return response;
		}

		if(diasSeguimiento< 14) return response;


		if(token.muestraslab && token.muestraslab.length){
		  let muestras = token.muestraslab;
		  let fechaLab = null

		  muestras.forEach(mu => {
		    if(mu.resultado === 'descartada') {
		      fechaLab = mu.fets_resestudio
		    }
		  })

		  if(fechaLab){
		      if((today_ts - fechaLab) / (1000 * 60 * 60 * 24) < 2) return response;
		      else {
		      	response.needsHisopado = true;
		      	return response;
		      }

		  }else{
		  	response.needsHisopado = true;
		    return response;
		  }
		  
		}else{
			response.needsHisopado = true;
		  return response;
		}

	}
}

class HisopadoYa {
	dias: number = 0;
	hasFollowUp = false;
	isCovid = false;
	needsHisopado = false;	
}

class CalendarData {
	title: string = '';
	start: string = '';
	end: string = '';
	allDay: string = ''
}

class TokenData {
  token: AfectadoFollowUp
	vector: string; 
	tipo: string; 
	lastCall: string; 

  constructor(token:AfectadoFollowUp){
    this.token = token;

		this.vector = AsistenciaHelper.getOptionLabel('vectorSeguim', token.vector);
		this.tipo = AsistenciaHelper.getOptionLabel('tipoFollowUp', token.tipo);
		this.lastCall = AsistenciaHelper.getOptionLabel('resultadoSeguim', token.lastCall);
  }

}
