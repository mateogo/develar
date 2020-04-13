import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-capacidad',
  templateUrl: './capacidad.component.html',
  styleUrls: ['./capacidad.component.scss']
})
export class CapacidadComponent implements OnInit {

  @Input() capacidadEfectiva;
  @Input() capacidadReal;

  constructor() { }

  ngOnInit(): void {
  }

}
