import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecursosModalComponent } from './recursos-modal/recursos-modal.component';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit {

  @Input() admision;
  @Input() traslado;

  items = [
    {
      nombre: 'Camas',
      disponible: 10,
      total: 15
    },
    {
      nombre: 'Respiradores',
      disponible: 7,
      total: 9
    },
  ];

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  onClick(){
    const dialogRef = this.dialog.open(
      RecursosModalComponent,
      {
        width: '350px',
        data: {
          //TODO: Enviar lista de buffers (con pacientes) y recursos
          buffers: {
            admision: {
              pacientes: this.admision
            },
            traslado: {
              pacientes: this.traslado
            },
            externacion: { //???
              pacientes: [] //Vacío
            },
            salida: { //???
              pacientes: [] //Vacío
            }
          },

          recursos: {
            camas: [
              {
                id: '1.1'
              },
              {
                id: '1.2'
              }
            ],
            respiradores: [
              {
                id: '2.1'
              },
              {
                id: '2.2'
              },
              {
                id: '2.3'
              },
            ]
          }
        }
      }
    );

    dialogRef.afterClosed().subscribe(res => {
      //TODO: Recibir datos para el alta, emitir para que el componente padre dé el alta y actualice la vista
    });
  }

}
