import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {

  @Input() nombrePaciente;
  @Input() nombreCama?;
  @Output() onClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onPacienteClick(){
    //TODO: emitir id para identificar el botón
    this.onClick.emit('');
  }

}
