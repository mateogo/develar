import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BotonContador } from '../../base.model';

@Component({
  selector: 'app-botonera-container',
  templateUrl: './botonera-container.component.html',
  styleUrls: ['./botonera-container.component.scss']
})
export class BotoneraContainerComponent implements OnInit {

  //@Input() botones: BotonContador[];
  @Input() botones: BotonContador[];
  @Output() onButtonClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(idBoton){
    this.onButtonClick.emit(idBoton);
  }

}
