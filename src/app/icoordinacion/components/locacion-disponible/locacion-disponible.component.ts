import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'locacion-disponible',
  templateUrl: './locacion-disponible.component.html',
  styleUrls: ['./locacion-disponible.component.scss']
})
export class LocacionDisponibleComponent implements OnInit {
  @Input() disponible;
  @Input() capacidades = [];
  @Input() viewList$: Observable<Array<string>>;

  private viewList:Array<string> = [];

  public disponibleList = []

  constructor() { }

  ngOnInit(): void {
    this.updateView();
    if(this.viewList$){
      this.viewList$.subscribe(list => {
        if(list && list.length){
          this.viewList = list;
          this.updateView();
        }
      })
    }
  }

  private updateView(){

    if(this.capacidades && this.capacidades.length && this.disponible){

      this.disponibleList = [];


      this.capacidades.forEach(t => {
        let token = this.disponible[t.val]
        if(token && (token.capacidad.total + token.ocupado.total >0)  && this.verifyServicio(t.val)){
          let data = {
            label:     t.label,
            capacidad: token.capacidad.total,
            ocupado:   token.ocupado.total,
            disponible: token.capacidad.total - token.ocupado.total
          }
          this.disponibleList.push(data);
        }
      })
    }    
  }

  private verifyServicio(servicio): boolean{
    let index = this.viewList.indexOf(servicio);
    let ok = index !== -1 ? true : false;

    return ok;
  }


}
