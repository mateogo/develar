import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'locacion-servicios',
  templateUrl: './locacion-servicios.component.html',
  styleUrls: ['./locacion-servicios.component.scss']
})
export class LocacionServiciosComponent implements OnInit {
  @Input() servicios;

  public serviciosList = [];


  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if(this.servicios && this.servicios.length){
      this.serviciosList = this.servicios.filter(t=> (t.nominal + t.ocupado)>0).map(t => {
        t['disponible'] = t.nominal - t.ocupado;
        return t;
      })

    }

  }

}
