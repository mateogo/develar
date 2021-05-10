import { devutils } from '../../develar-commons/utils';
import { Person, CoberturaData } from '../person/person';
import { CardGraph } from '../../develar-commons/asset-helper';
import { ArrayDataSource, CollectionViewer } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map } from 'rxjs/operators';

export class Empresa {
  empresaId: string;
  slug: string;
  tdoc: string;
  ndoc: string;
}

export class Responsable {
  responsableId: string;
  slug: string;
  tdoc: string;
  ndoc: string;
}

export interface EstadoCenso {
  estado: string;
  navance: string;
  isCerrado: boolean;
  ts_alta: number;
  ts_umodif: number;
  fecierre_txa: string;
  fecierre_tsa: number;
  cerradoPor: Responsable;
}

export class CensoData {
  codigo: string = 'censo:empresarial:2021:01';
  type: string = 'censo:anual';
  anio: number = 2020;
  q: string = 'q1';
  sector: string = 'produccion';
  slug: string = 'Censo Industrias - MAB 2020';
}

export class CensoActividad {
  _id?: string;
  type: string;
  level: number; //porcentaje de la facturación o la inversión
  codigo: string;
  seccion: string;
  rubro: string;
  slug: string;
  rol: string;
  anio: number;
}

export class CensoBienes {
  _id?: string;
  type: string;
  slug: string;

  tactividad: string;
  actividadId: string;

  isImportada: boolean = false;
  origen: string;
  parancelaria: string;

  isExportable: boolean = false;
  exportableTxt: string;
  propExportada: number; // todo

  isSustituible: boolean = false;
  sustituibleTxt: string;

  isInnovacion: boolean = false;
  innovacionTxt: string;

  anio: number;
  destino: string; // destino de la produccion opciones ídem origen
  capainstalada: number; // unidades año
  capautilizada: number; // unidades año

  competencia: string;
  competenciaTxt: string;
  competenciaOrigen: string;

  level: number; //porcentaje de la facturación o la inversión
}

export class CensoIndustriasQuery {
  fechaDesde: number;
  fechaHasta: number;
  avance: string; // CensoIndustrias.estado.navance
  empresa: string; // CensoIndustrias.empresa.slug ??
  asignadoId: string; // 
}

/**************************/
/**   CENSO INDUSTRIAS  **/
/************************/
export class CensoIndustrias {
  _id: string;
  compPrefix: string = 'CENSO';
  compName: string = 'CEN';
  compNum: string = '00000';

  action: string = 'censo';
  sector: string = 'produccion';

  categoriaEmp: string;
  rubroEmp: string;

  fecomp_tsa: number;
  fecomp_txa: string;

  empresa: Empresa;

  responsable: Responsable;

  estado: EstadoCenso;
  actividades: Array<CensoActividad>;
  bienes: Array<CensoBienes>;

  assets: Array<CardGraph> = [];

  censo: CensoData;
}

/**************************/
/**   CENSO INDUSTRIAS  **/
/************************/
export class CensoIndustriasTable {
  _id: string;
  compNum: string = '00000';

  action: string = 'censo';
  sector: string = 'produccion';
  slug: string = '';

  categoriaEmp: string;
  rubroEmp: string;

  fecomp_tsa: number;
  fecomp: string;
  navance: string;

  empresa: string;
}

export class CensoListDataSource extends ArrayDataSource<CensoIndustrias> {

  constructor(private sourceData: BehaviorSubject<CensoIndustrias[]>,
              private _paginator: MatPaginator){
    super(sourceData);
  }

  connect(): Observable<CensoIndustrias[]> {

    const displayDataChanges = [
      this.sourceData,
      this._paginator.page
    ];

    return merge(...displayDataChanges).pipe(
        map(() => {
          const data = this.sourceData.value.slice()

          const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
          return data.splice(startIndex, this._paginator.pageSize);
        })
     );
  }

  disconnect() {}

}

