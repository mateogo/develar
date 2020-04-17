import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BotonContador } from '../../base.model';

@Component({
  selector: 'app-boton-contador',
  templateUrl: './boton-contador.component.html',
  styleUrls: ['./boton-contador.component.scss']
})
export class BotonContadorComponent implements OnInit {

  @Input() boton: BotonContador;
  @Output() onClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onMatCardClick(){
    this.onClick.emit(this.boton.val);
  }

}
