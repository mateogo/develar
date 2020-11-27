import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { devutils } from '../../../develar-commons/utils';
import { Turno, TurnoDisponible } from '../../../entities/turnos/turno.model';

import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnosService } from '../../../entities/turnos/turnos.service';
import { TurnoHelper } from '../../../entities/turnos/turno.helper';

const ESTADO_POS_EDIT = 'pendiente';

@Component({
  selector: 'turnos-industriales-edit-form',
  templateUrl: './turnos-industriales-edit-form.component.html',
  styleUrls: ['./turnos-industriales-edit-form.component.scss']
})
export class TurnosIndustrialesEditFormComponent implements OnInit {

 // Turno actual
 @Input() public turno: Turno;
 @Input() public isEdit = false;
 // ----------------------------------


 /**
  * form es el formulario que _muestra_ los datos actuales del turno
  * formEdit es el formulario que permite editar la fecha y hora del turno
  *
  */
 public form: FormGroup;
 public formEdit: FormGroup;

 public tipoConsultaList = [];
 public sedesList = [];

 // Contiene los turnos disponibles
 public availableSlots = [];

 // Contiene los días en los que no hay turnos disponibles
 hasAvailableSlotsList = [];

 public currentFecha: string;
 public currentHora: string;

 // ----------------------------------
 // Fecha mínima a partir de la que puede elegirse un turno (hoy)
 public minDate = new Date();


 // ----------------------------------
 // Leyendas
 public altaTitle = 'Solicitar turno';
 public altaSubtitle = 'Complete el formulario para solicitar un nuevo turno';
 public altaButton = 'Dar de alta';
 public altaCancelButton = 'Cancelar alta';

 public editTitle = 'Consultar / Modificar el turno solicitado';
 // public editSubtitle = 'Puede editar en el formulario los datos de su turno';
 public editSubtitle = 'Confirme la fecha y hora de su turno';
 public editButton = 'Guardar cambios';
 public editCancelButton = 'Cancelar edición';

 // ----------------------------------
 // Cancelar alta o edición
 @Output() public cancelEdit: EventEmitter<Boolean> = new EventEmitter<Boolean>(false);

 // ----------------------------------
 // Crear o actualizar un turno
 @Output() public upsertTurno: EventEmitter<Turno> = new EventEmitter<Turno>();

 constructor(
   private _fb: FormBuilder,
   private _turnoService: TurnosService
 ) {
   this.tipoConsultaList = TurnoHelper.getTipoConsultaList();
   this.sedesList = TurnoHelper.getSedesList();
   this.hasAvailableSlotsList = [];
 }

 ngOnInit(): void {
   this.initForm(this.turno);
   this.initSlotsDatepicker();
 }

 ngOnChanges(changes: SimpleChanges): void {
   this.initForm(this.turno);
 }

 changeSelectionValue(key, value){
   if(key === 'txHora') {
     this.currentFecha = devutils.datePickerToTx(this.form.get('txFecha').value);
     this.currentHora =  this.form.get('txHora').value;
   }
 }
 doBuildTurno(): void {
   // this.turno = this.initForSave(this.form, this.turno);
   this.turno = this.initForSave(this.formEdit, this.turno);
   this.upsertTurno.emit(this.turno);
 }

 doCancelEdit() {
   this.cancelEdit.emit(true);
 }


 onTipoConsultaChange(tipoConsulta: string): void {
   this.form
     .get('sede')
     .setValue(
       this.tipoConsultaList.find((item) => item.val === tipoConsulta).sede
     );
 }



 private buildHorario(dateTx: string, sede: string): void {
   this._turnoService.fetchAvailableSlots(sede, dateTx).subscribe((turnosDisponibles) => {
     if (turnosDisponibles && turnosDisponibles.length > 0) {
       this.availableSlots = turnosDisponibles
         .map((item) => ({ sede: TurnoHelper.getOptionLabel('sede', item.sede), slug: item.slug, val: item.hora, slotId: item._id }));
         this.formEdit.get('txHora').setValue(this.availableSlots[0]);
     }
   });
 }


 private initForSave(form, entity) {
   const fvalue = form.value;
   entity.sede = fvalue.sede;
   entity.tipoConsulta = fvalue.tipoConsulta;
   entity.detalle = fvalue.detalle;
   entity.txFecha = devutils.datePickerToTx(fvalue.txFecha);
   entity.txHora = fvalue.txHora.slug;
   entity.turnoId = fvalue.txHora.slotId;
   entity.avance = ESTADO_POS_EDIT;
   entity.tsFechaHora = devutils.datePickerToDate(fvalue.txFecha).setHours(fvalue.txHora.val);
   entity.estado = 'activo';

   return entity;
 }

 private initForm(turno: Turno): void {
   this.currentFecha = turno.txFecha;
   this.currentHora = turno.txHora;
   /**
    * Si el turno tiene setteado su propiedad 'source' en 'admin', quiere decir
    * que fue creado por un administrativo mediante la vista de gestión;
    * por lo tanto se veda la modificación del tipo de consulta, la sede
    * y la descripción, siendo posible cambiar sólo la fecha y la hora del
    * turno.
    */
   this.form = this._fb.group({
     _id: [turno ? turno._id : null],
     txFecha: [{ value: turno ? turno.txFecha : new Date(), disabled: true }],
     txHora: [{ value: turno ? turno.txHora : null, disabled: true }],
     tipoConsulta: [{ value: turno ? turno.tipoConsulta : null, disabled: true }],
     sede: [{ value: turno ? turno.sede : null, disabled: true}],
     detalle: [{ value: turno ? turno.detalle : null, disabled: true }],
   });

   this.formEdit = this._fb.group({
     _id: [turno ? turno._id : null],
     turnoId: [turno ? turno.turnoId : null],
     txFecha: [{ value: turno ? devutils.dateFromTx(turno.txFecha) : new Date() }, Validators.required],
     // txHora: [{ value: turno ? turno.txHora : null }, Validators.required],
     txHora: [{ value: null }, Validators.required],
     tipoConsulta: [{ value: turno ? turno.tipoConsulta : null, disabled: true }],
     sede: [{ value: turno ? turno.sede : null, disabled: true}],
     detalle: [{ value: turno ? turno.detalle : null, disabled: true }],
   });
 }

 async  initSlotsDatepicker() {
   const sede = this.form.get('sede').value;

   const availableSlotsList = await this._turnoService.fetchAllAvailableSlots(sede);
   //c onsole.log('initSlotsDatepicker[availableSlotsList=%o]', availableSlotsList);
   this.parseSlotsDatePicker(availableSlotsList);
 }

 private parseSlotsDatePicker(slots: TurnoDisponible[]): void {
   const slotsCount = slots.length;

   //c onsole.log('parseSlotsDatePicker[slotsCount=%d]', slotsCount);

   for (let k = 0; k < slotsCount; k++) {
     let fechaHoy = new Date(new Date().setHours(0, 0, 0, 0));
     let hoy = fechaHoy.getDay();
     let distancia = slots[k].dow - hoy;

     if (distancia > 1) {
       //c onsole.log('fechaHoy=%s, fechaHoy.getDate=%s, distancia=%s', fechaHoy, fechaHoy.getDate(), distancia);

       this.hasAvailableSlotsList.push(fechaHoy.setDate(fechaHoy.getDate() + distancia));
     }
   }

   // Rellenar la semana que viene:
   const auxFechaHoy = new Date(new Date().setHours(0, 0, 0, 0));
   auxFechaHoy.setDate(auxFechaHoy.getDate() + (8 - auxFechaHoy.getDay()));

   for (let k = 0; k < 5; k++) {
     //c onsole.log('auxFechaHoy=%s, auxFechaHoy.getDate=%s', auxFechaHoy, auxFechaHoy.getDate());
     this.hasAvailableSlotsList.push(auxFechaHoy.getTime());
     auxFechaHoy.setDate(auxFechaHoy.getDate() + 1);
   }



   //c onsole.log(auxFechaHoy);

   //c onsole.log(this.hasAvailableSlotsList);

   // Remuevo duplicados
   this.hasAvailableSlotsList = this.hasAvailableSlotsList.filter((value, index, self) => {
     return self.indexOf(value) === index;
   });

   //c onsole.log(this.hasAvailableSlotsList);
 }

 /**
  * Función encargada del filtro de días para el datepicker
  *
  * @param d Objeto Date pasado por el DatePicker a la función
  */
 public filterDaysForDatepicker(d: Date): boolean {
   const day = moment(d).toDate();

   if (this.hasAvailableSlotsList.indexOf(day.getTime()) !== -1) {
     return true;
   }

   return false;
 }
 /**
  * Se activa al seleccionar una fecha distinta en el selector
  *
  * @param event Contiene información del evento, en particular de la fecha
  */
 onDateChange(event): void {
   let fecha = devutils.datePickerToDate(event.value);
   if(!fecha) return;

   let dateTx = devutils.txFromDate(fecha);

   let dow = fecha.getDay();
   let sede = this.form.get('sede').value;

   //c onsole.log('onDateChange() [fecha=%s, sede=%s]', dateTx, sede);
   this.buildHorario(dateTx, sede);


 }

 public onSelectionChange(type: string, val: any): void {
   //c onsole.log('onSelectionChange() [type=%s, val=%o]', type, val);
 }

 /**
  * Función auxiliar usada para comparar los datos relacionados con el
  * mat-select de hora (slot); al ser un objeto completo requiere un
  * comparador personalizado
  */
 compareSlots(s1: TurnoDisponible, s2: TurnoDisponible) {
   if (s1._id === s2._id) {
     return true;
   }

   return false;
 }
}
