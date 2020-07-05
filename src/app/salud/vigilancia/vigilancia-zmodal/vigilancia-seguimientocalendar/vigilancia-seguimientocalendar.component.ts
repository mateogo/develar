import { Component, ViewChild, OnInit, Inject } from '@angular/core';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { devutils }from '../../../../develar-commons/utils';

import { ModalDialogComponent, DialogData } from '../../../../develar-commons/modal-dialog/modal-dialog.component';
import { GenericDialogComponent } from '../../../../develar-commons/generic-dialog/generic-dialog.component';

import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventInput } from '@fullcalendar/core';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick

import { VigilanciaSeguimientofwupComponent } from '../vigilancia-seguimientofwup/vigilancia-seguimientofwup.component';

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
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
  @ViewChild('seguimiento') templateRef;


  public calendarVisible = false;
  public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  public calendarWeekends = true;


  public asistencia: Asistencia;
  public actualFup: AfectadoUpdate;
  public token: AfectadoUpdate; // from DB
  public tokenData: TokenData; // template usage

	public tokenList: AfectadoUpdate[] = [];
	public eventList: EventInput[] = [];

  private result: UpdateAsistenciaEvent;

  public displayAs = '';

  public showAfectadoFollowUp = false;
  private inicioDate: string = null;

 
  constructor(
        public dialog: MatDialog,
        private dsCtrl: SaludController,

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


  handleEventClick(e) {
    this.actualFup = e.event.extendedProps.token;

    let message = `Evolución: ${this.actualFup.vector} Síntoma: ${this.actualFup.sintoma} Comentario: ${this.actualFup.slug}  Indicaciones: ${this.actualFup.indicacion}`
    //this.dsCtrl.openSnackBar(message, 'CERRAR',{horizontalPosition: 'center', verticalPosition: 'bottom'})

    let dialog = {
      caption: 'VIGILANCIA EPIDEMIOLÓGICA',
      title: 'Contacto con afectado/a',
      body: message,
      cancel: {
        action: 'alta',
        label: 'CERRAR'        
      } ,
      input: {
        value: '',
        label: 'Comentario',
        action: 'novedad'        
      },
      itemplate: this.templateRef

    } as DialogData;

    this.openDialog(dialog)

  }

  private openDialog(dialog: DialogData): void {

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '450px',
      data: dialog
    });


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //c onsole.log('result')
      }else {
        //c onsole.log('null result')
      }

    });
  }





  handleDateClick(arg) {
    let date = arg.date;
    this.openVinculofamModal(date);
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
      let data = AsistenciaHelper.getOptionToken('vectorSeguim',( t.resultado === 'nocontesta' ? 'sindato' : t.vector) || 'sindato');
  		return {
  			title: `LL:${t.slug}`,
  			start: dateTx,
        textColor: data.color,
        backgroundColor: data.background,
        token: t
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
          token: followUp
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

  private openVinculofamModal(date?: Date){
    const dialogRef = this.dialog.open(
      VigilanciaSeguimientofwupComponent,
      {
        width: '800px',
        data: {
          asistencia: this.asistencia,
          fupDate: date
        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      if(res && res.token){
        this.asistencia = res.token
        let seguimiento = this.asistencia.seguimEvolucion[this.asistencia.seguimEvolucion.length-1]


        let dateTx = devutils.txInvertedFromDate(new Date(seguimiento.fets_llamado));
        let event =  {
          title: `LL: ${seguimiento.resultado}: ${seguimiento.vector}`,
          start: dateTx,
          token: seguimiento
        }as EventInput

        let calendarApi = this.calendarComponent.getApi();
        calendarApi.addEvent(event);
        this.closeDialogSuccess()

      }
      //c onsole.log('dialog CLOSED')
    });    
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
