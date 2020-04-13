import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransitoModalComponent } from './transito-modal/transito-modal.component';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss']
})
export class ServicioComponent implements OnInit {

  @Input() nombre;
  @Input() disponibilidadTotal;
  @Input() disponibilidadActual;


  //Lista de pacientes que aplican para este servicio
  pacientes = [
    {
      dni: '22334455',
      name: 'Marco Aurelio',
      diagnostico: 'Adipisicing in exercitation'
    },
    {
        dni: '33445566',
        name: 'Julio César',
        diagnostico: 'Aliquip minim'
    },
    {
        dni: '22446688',
        name: 'Genghis Khan',
        diagnostico: 'Magna dolor'
    },
    {
        dni: '33557799',
        name: 'Isabel la Católica',
        diagnostico: 'Elit laborum dolore'
    }
  ];

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
