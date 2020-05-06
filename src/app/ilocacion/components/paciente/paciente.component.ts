import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SolicitudInternacion, AsignarRecursoEvent } from '../../../salud/internacion/internacion.model';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {

  @Input() nombrePaciente;
  @Input() nombreCama?;
  @Input() sinternacion: SolicitudInternacion;
  @Output() onClick = new EventEmitter<SolicitudInternacion>();

  constructor() { }

  ngOnInit(): void {
  }

  onPacienteClick(){
    //TODO: emitir id para identificar el botón
    this.onClick.emit(this.sinternacion);
  }

}
