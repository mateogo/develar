import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';

import { devutils } from '../../../../develar-commons/utils';
import { AyudaEnLineaService } from '../../../../develar-commons/ayuda-en-linea.service';

//import {  } from '../../censo.model';
import { CensoFeatureQuery, Condiciones, CondicionBusqueda, buscarEnOptList,tipoBusquedaOptList, CensoEmpresarialHelper} from '../../censo-empresarial-helper';
import { CensoIndustrialService } from '../../censo-industrial.service';

import { CensoIndustrias } from '../../../../empresas/censo.model';


@Component({
  selector: 'censo-cuadro-estado',
  templateUrl: './censo-cuadro-estado.component.html',
  styleUrls: ['./censo-cuadro-estado.component.scss']
})
export class CensoCuadroEstadoComponent implements OnInit, OnDestroy {
  public censos$: Observable<CensoIndustrias[]>

  private censoList: CensoIndustrias[] = [];

  public aperturasCol = CensoEmpresarialHelper.getOptionlist('apertura');
  public ubicacionRow = CensoEmpresarialHelper.getOptionlist('ubicacion');
  private subscribers: Array<Subscription> = []

  public dataframe: Map<string, Array<number>>;
  private totalEmpresas = 535;
  private totalEmpresasSip = 280;
  private totalEmpresasNoSip = 155; 
  

  public showDumpData = true;

  public data$ = new BehaviorSubject<any>({});
  public showData = false;


  constructor(
    private censoService: CensoIndustrialService
  ) { 
    this.censos$ = this.censoService.censoListSource$
  }

  ngOnInit(): void {
    this.initOnce();
  }

  ngOnDestroy(): void{
    this.subscribers.forEach(t => { t.unsubscribe(); })
  }

  getLabelOf(row:number, label: any){
    if(label['key'] === 'total'){
      return 'Empresas SIP: ' + this.totalEmpresasSip;
    }else {
      let base = 10;
      if(this.dataframe.has(label['key'])){
        base = this.dataframe.get(label['key'])[0];

      }else {

      }
      let porcentaje = Math.round(base/this.totalEmpresasSip * 1000)/10;
      return base + ' / (' + porcentaje  + '%)'     
    }

  }

  private initOnce(){
    let sub = this.censoService.censoListSource$.subscribe(censos => {
      this.censoList = censos
      this.buildInfo(this.censoList);
    })
    this.subscribers.push(sub);
  }

  private buildInfo(censos: CensoIndustrias[]){
    this.data$.next(censos);
    this.dataframe = this.initAcumulators();
    censos.reduce((map, censo) => {
      let avance = censo.estado.navance;
      if(map.has(avance)){
        map.get(avance)[0] += 1;
        map.get('noiniciado')[0] -= 1;
      }

      return map;
    }, this.dataframe)
    this.showData = true;

  }

  private initAcumulators(): Map<string, Array<number>>{
    let map = new Map();
    this.aperturasCol.forEach(t =>{
      map.set(t.key, [0, 0])
    })
    map.get(this.aperturasCol[0].key)[0] = this.totalEmpresasSip;
    map.get(this.aperturasCol[1].key)[0] = this.totalEmpresasSip;
    return map;

  }

}
