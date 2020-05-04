import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'locacion-disponible',
  templateUrl: './locacion-disponible.component.html',
  styleUrls: ['./locacion-disponible.component.scss']
})
export class LocacionDisponibleComponent implements OnInit {
  @Input() disponible;
  @Input() capacidades = [];

  public disponibleList = []

  constructor() { }

  ngOnInit(): void {
  	if(this.capacidades && this.capacidades.length && this.disponible){

  		this.disponibleList = [];

  		this.capacidades.forEach(t => {
  			let token = this.disponible[t.val]
  			if(token && (token.capacidad + token.ocupado >0) ){
  				let data = {
  					label:     t.label,
  					capacidad: token.capacidad,
  					ocupado:   token.ocupado,
  					disponible: token.capacidad - token.ocupado
  				}
  				this.disponibleList.push(data);
  			}
  		})
  	}
  }

}
