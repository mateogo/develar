import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'locacion-periferia',
  templateUrl: './locacion-periferia.component.html',
  styleUrls: ['./locacion-periferia.component.scss']
})
export class LocacionPeriferiaComponent implements OnInit {

  @Input() periferiaOptList;
  @Input() periferiaData;
  @Output() onClick = new EventEmitter<void>();

  public periferiaList = [];

  constructor() { }

  ngOnInit(): void {

    if(this.periferiaOptList && this.periferiaOptList.length){
      this.periferiaList = [];

      this.periferiaOptList.forEach(t => {
        let periferia = this.periferiaData[t.val]
        if(periferia && periferia.length){
          let ocupacion = 0;
          let servicios  = [];
          periferia.forEach(p => {
            if(p.ocupado){
              ocupacion += p.ocupado;
              let token = {
                code: p.code,
                ocupado: p.ocupado
              }
              servicios.push(token);
            }
          })
          if(ocupacion > 0){
            this.periferiaList.push({
              label: t.label,
              servicios: servicios
            })
          }

        }
      })
    }

  }

  onTransitoClick(){
    this.onClick.emit();
  }

}
