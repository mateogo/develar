import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transito',
  templateUrl: './transito.component.html',
  styleUrls: ['./transito.component.scss']
})
export class TransitoComponent implements OnInit {

  @Input() servicios;
  @Input() label;
  @Output() onClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onTransitoClick(){
    this.onClick.emit();
  }
}
