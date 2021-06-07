import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';

import { devutils } from '../../../../develar-commons/utils';
import { AyudaEnLineaService } from '../../../../develar-commons/ayuda-en-linea.service';
import { CensoEmpresarialModalService }    from '../../zmanagers/censo-modals.service';

//import {  } from '../../censo.model';
import { CensoFeatureQuery, Condiciones, CondicionBusqueda, buscarEnOptList,tipoBusquedaOptList, CensoEmpresarialHelper} from '../../censo-empresarial-helper';
import { CensoIndustrialService } from '../../censo-industrial.service';

import { CensoIndustrias, UpdateCensoEvent } from '../../../../empresas/censo.model';
import { nomencladorList } from '../../../../empresas/nomenclador-data';


@Component({
  selector: 'censo-cuadro-actividad',
  templateUrl: './censo-cuadro-actividad.component.html',
  styleUrls: ['./censo-cuadro-actividad.component.scss'],
  providers: [ CensoEmpresarialModalService ]
})
export class CensoCuadroActividadComponent implements OnInit {
  public censos$: Observable<CensoIndustrias[]>

  private censoList: CensoIndustrias[] = [];

  private subscribers: Array<Subscription> = []

  public dataframe: Map<string, Actividad> ;

  private totalEmpresas = 535;
  private totalEmpresasSip = 280;
  private totalEmpresasNoSip = 155; 
  

  public showDumpData = true;

  public data$ = new BehaviorSubject<any>({});
  public actividadesList: Array<string> = [];
  public showData = false;


  constructor(
    private censoService: CensoIndustrialService,
    private modalService: CensoEmpresarialModalService,

  ) { 
    this.censos$ = this.censoService.censoListSource$
  }

  ngOnInit(): void {
    this.initOnce();
  }

  ngOnDestroy(): void{
    this.subscribers.forEach(t => { t.unsubscribe(); })
  }

  getRubroOf(actividad: string){
    return this.dataframe.get(actividad);
  }

  showEmpresas(actividad){
    let token =  this.dataframe.get(actividad);
    this.modalService.openActividadEmpresa(token.empresas, 'actividades:empresa')
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

      let actividades = censo.actividades;
      if(actividades && actividades.length){
        actividades.forEach(ac => {
          let index = ac.rubro;
          
          if(map.has(index)){
            let token = map.get(index)
            token.count += 1;
            let empresa_token = new ActividadEmpresa(censo.empresa, ac);
            token.empresas.push(empresa_token)

          }else {
            let nuevo_token = new Actividad(ac, nomencladorList);
            let empresa_token = new ActividadEmpresa(censo.empresa, ac);
            nuevo_token.empresas.push(empresa_token);
            map.set(index, nuevo_token);
          }
    
        })
      }

      return map;
    }, this.dataframe)
    this.actividadesList = Array.from(this.dataframe.keys());
    this.actividadesList.sort((pe, se) => (pe>se ? 1 : -1))
    this.showData = true;

  }

  private initAcumulators(): Map<string, Actividad>{
    let map = new Map();
    return map;
  }

}
class Actividad {
  rubro: string;
  seccion: string;
  codigo: string;
  count = 1;
  label: string;
  empresas: Array<ActividadEmpresa> = [];
  constructor (actividad: any, nomenclador){
    this.rubro = actividad['rubro'];
    this.seccion = actividad['seccion'];
    this.codigo = actividad['codigo'];
    let label = nomenclador.find(t => t['val'] === actividad['rubro'])
    this.label = label ? label.label : actividad['rubro']
  }
}


class ActividadEmpresa {
  rubro: string;
  seccion: string;
  codigo: string;
  slug: string;
  anio: number;
  level: string;
  type: string;
  empresaId: string;
  empresaSlug: string;
  constructor(empresa:any, actividad:any){
    this.empresaId = empresa['empresaId'];
    this.empresaSlug = empresa['slug'];

    this.rubro = actividad['rubro'];
    this.seccion = actividad['seccion'];
    this.codigo = actividad['codigo'];
    this.level = actividad['level'];
    this.type = actividad['type'];
    this.anio = actividad['anio'];
    this.slug = actividad['slug'];
  }
}
