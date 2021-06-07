import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';

import { devutils } from '../../../../develar-commons/utils';
import { AyudaEnLineaService } from '../../../../develar-commons/ayuda-en-linea.service';
import { CensoEmpresarialModalService }    from '../../zmanagers/censo-modals.service';

import { CensoIndustriasHelper } from '../../censo-industrial.helper';

import { CensoIndustrialService } from '../../censo-industrial.service';

import { CensoIndustrias, UpdateCensoEvent } from '../../../../empresas/censo.model';


@Component({
  selector: 'censo-cuadro-tamanio',
  templateUrl: './censo-cuadro-tamanio.component.html',
  styleUrls: ['./censo-cuadro-tamanio.component.scss'],
  providers: [ CensoEmpresarialModalService ]
})
export class CensoCuadroTamanioComponent implements OnInit {
  public censos$: Observable<CensoIndustrias[]>

  private censoList: CensoIndustrias[] = [];


  private subscribers: Array<Subscription> = []

  public dataframe: Map<string, Tamanio> ;


  public showDumpData = true;
  public tipoEmpOptList = CensoIndustriasHelper.getOptionlist('tipoEmp')

  public data$ = new BehaviorSubject<any>({});
  public rubrosList: Array<string> = [];
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

  getTokenOf(actividad: string){
    return this.dataframe.get(actividad);
  }

  showEmpresas(actividad){
    let token =  this.dataframe.get(actividad);
    this.modalService.openTamanioEmpresa(token.empresas, 'actividades:empresa')
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
      if(!censo.categoriaEmp || !censo.rubroEmp) return map;

      let rubro = censo.categoriaEmp + ':' + censo.rubroEmp;
      let rubro_cat = this.findCategoriaRubro(censo.categoriaEmp, censo.rubroEmp)
      let empresa = new TamanioEmpresa(censo.empresa, rubro_cat.categoria, rubro_cat.rubro)
      if(map.has(rubro)){
        let token = map.get(rubro);
        token.count +=1;
        token.empresas.push(empresa);

      }else {
        let token = new Tamanio(censo.categoriaEmp, censo.rubroEmp, rubro_cat)
        token.empresas.push(empresa);
        map.set(rubro, token)        
      }

      return map;
    }, this.dataframe)

    this.rubrosList = Array.from(this.dataframe.keys());
    this.rubrosList.sort((pe, se) => (pe>se ? 1 : -1))
    this.showData = true;

  }

  private initAcumulators(): Map<string, Tamanio>{
    let map = new Map();
    return map;
  }

  private findCategoriaRubro(categoria:string, rubro: string){
    const cats = ['micro', 'pequenia','mediana1', 'mediana2'];
    let index = cats.indexOf(categoria);
    if(index<0 || index>3){
      return {
        categoria: categoria,
        rubro: rubro
      } as RubroCategoria;

    }


    let token = this.tipoEmpOptList[index].find(t => t.categoria === categoria && t.rubro === rubro);
    if(token){
      return {
        categoria: token.categoria_lbl,
        rubro: token.rubro_lbl
      } as RubroCategoria;
    }else {
      return {
        categoria: categoria,
        rubro: rubro
      } as RubroCategoria;

    }


  }

}

class Tamanio {
  rubroEmp: string;
  categoriaEmp: string;

  rubro: string;
  categoria: string;
  count = 1;
  empresas: Array<TamanioEmpresa> = [];

  constructor (categoriaEmp: string, rubroEmp:string, rubro_cat: RubroCategoria){
    this.rubroEmp = rubroEmp;
    this.categoriaEmp = categoriaEmp;
    this.rubro = rubro_cat.rubro;
    this.categoria = rubro_cat.categoria;
  }
}

interface RubroCategoria {
  rubro:string;
  categoria:string;
}


class TamanioEmpresa {
  rubro: string;
  categoria: string;
  empresaId: string;
  empresaSlug: string;
  constructor(empresa: any, categoriaEmp: string, rubroEmp: string){
    this.empresaId = empresa['empresaId'];
    this.empresaSlug = empresa['slug'];

    this.categoria = categoriaEmp;
    this.rubro = rubroEmp;
  }
}
