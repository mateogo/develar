import { Component, OnInit, Input } from '@angular/core';
import {  CensoBienes,
          CensoIndustrias,
          CensoMaquinarias,
          CensoPatentes,
          CensoProductos,
          CensoExpectativas,
          CensoInversion,
          CensoRecursosHumanos,
          CensoComercializacion } from '../../../empresas/censo.model';

import { CensoIndustriasHelper, TipoEmpresa } from '../censo-industrial.helper';
import { CensoIndustriasService } from '../../../empresas/censo-service';
import { devutils } from '../../../develar-commons/utils';

@Component({
  selector: 'censo-industrial-view',
  templateUrl: './censo-industrial-view.component.html',
  styleUrls: ['./censo-industrial-view.component.scss']
})
export class CensoIndustrialViewComponent implements OnInit {
  @Input() censo: CensoIndustrias;

  //view data
  public coreData: CoreData;
  public estadoData: EstadoData;
  public maquinariasData: ActivosData;
  public bienesData: ActivosData;
  public productosData: ActivosData;
  public patentesData: ActivosData;
  public comercializacionData: ComercializacionData;
  public inversionesData: InversionesData;
  public rhumanosData: RhumanosData;
  public expectativasData: ExpectativasData;


  // optLists
  private estadosOptList = CensoIndustriasHelper.getOptionlist('estado');

  public showView = false;

  constructor() { }

  ngOnInit(): void {
    if(this.censo){
      this.buildCensoView(this.censo);
    }
  }

  getLabel(type: string, val: string){
    return CensoIndustriasService.getOptionLabel(type, val)
  }


  private buildCensoView(censo: CensoIndustrias){
    this.coreData = this._buildCoreData(censo);
    this.estadoData = this._buildEstadoData(censo);
    this.maquinariasData = this._buildMaquinariaData(censo);
    this.bienesData = this._buildBienesData(censo);
    this.productosData = this._buildProductosData(censo);
    this.patentesData = this._buildPatentesData(censo);
    this.comercializacionData = this._buildComercializacionData(censo);
    this.inversionesData = this._buildInversionesData(censo);
    this.expectativasData = this._buildExpectativasData(censo);
    this.rhumanosData = this._buildRecursosHumanosData(censo);

    this.showView = true;

  }

  private _buildRecursosHumanosData(censo: CensoIndustrias): RhumanosData{
    let data = new RhumanosData(censo);
    data.color = this._colorOfArray(censo.rhumanos);
    return data;
  }

  private _buildInversionesData(censo: CensoIndustrias): InversionesData{
    let data = new InversionesData(censo);
    data.color = this._colorOfArray(censo.inversiones);
    return data;
  }

  private _buildExpectativasData(censo: CensoIndustrias): ExpectativasData{
    let data = new ExpectativasData(censo);
    data.color = this._colorOfArray(censo.expectativas);
    return data;
  }

  private _buildComercializacionData(censo: CensoIndustrias): ComercializacionData{
    let data = new ComercializacionData(censo);
    data.color = this._colorOfArray(censo.comercializacion);
    return data;
  }

  private _buildPatentesData(censo: CensoIndustrias): ActivosData{
    let data = new ActivosData(censo, 'patentes');
    data.color = this._colorOfArray(censo.patentes);    
    return data;
  }

  private _buildProductosData(censo: CensoIndustrias): ActivosData{
    let data = new ActivosData(censo, 'productos');
    data.color = this._colorOfArray(censo.productos);    
    return data;
  }

  private _buildBienesData(censo: CensoIndustrias): ActivosData{
    let data = new ActivosData(censo, 'bienes');
    data.color = this._colorOfArray(censo.bienes);    
    return data;
  }

  private _buildMaquinariaData(censo: CensoIndustrias): ActivosData{
    let maquinariaData = new ActivosData(censo, 'maquinas');
    maquinariaData.color = this._colorOfArray(censo.maquinarias);
    return maquinariaData;
  }

  private _colorOfArray(arr ): string{
    let color = 'danger';
    if(arr && arr.length){
      color = 'info';
      if(arr && arr.length > 1) color = 'success';
    }

    return color;
  }

  private _buildEstadoData(censo: CensoIndustrias): EstadoData{
    let estadoData = new EstadoData(censo);
    return estadoData;
  }

  private _buildCoreData(censo: CensoIndustrias): CoreData{
    let coreData = new CoreData(censo);
    let actividades = censo.actividades;
    if(actividades && actividades.length){
      coreData.actividades = actividades.map(t => {
        const { rubro, seccion, codigo, level, type, anio, slug } = t;
        // c onsole.log('Actividad: [%s]: [%s]', codigo, CensoIndustriasHelper.getActividadOptionLabel(codigo, 'codigo'));
        let actividadLabel = CensoIndustriasHelper.getActividadOptionLabel(codigo, 'codigo')
        let actividad = (CensoIndustriasHelper.getOptionLabel('actividad', type) + '            ').substr(0, 20);
        return `${actividadLabel || ''} : [${level}] Inicio: ${anio || '0000'}: ${actividad} |  ${slug || ''}`;
      })
    }
    return coreData;
  }

}

class RhumanosData {
  censo: CensoIndustrias;
  slug = '';
  count = 0;
  color = '';
  rhumanos: CensoRecursosHumanos[];

  constructor(source: CensoIndustrias){
    this.censo = source;
    this.slug = 'recursos humanos';
    this.rhumanos = source.rhumanos;
    if(this.rhumanos && this.rhumanos.length) this.count = this.rhumanos.length;
  }
}

class ExpectativasData {
  censo: CensoIndustrias;
  slug = '';
  count = 0;
  color = '';
  expectativas: CensoExpectativas[];

  constructor(source: CensoIndustrias){
    this.censo = source;
    this.slug = 'expectativas';
    this.expectativas = source.expectativas;
    if(this.expectativas && this.expectativas.length) this.count = this.expectativas.length;
  }
}

class InversionesData {
  censo: CensoIndustrias;
  slug = '';
  count = 0;
  color = '';
  inversiones: CensoInversion[];

  constructor(source: CensoIndustrias){
    this.censo = source;
    this.slug = 'inversiones';
    this.inversiones = source.inversiones;
    if(this.inversiones && this.inversiones.length) this.count = this.inversiones.length;
  }
}

class ComercializacionData {
  censo: CensoIndustrias;
  slug = '';
  count = 0;
  color = '';
  comercializacion: CensoComercializacion[];
  mercadosCount = 0;

  constructor(source: CensoIndustrias){
    this.censo = source;
    this.slug = 'comercialización';
    this.comercializacion = source.comercializacion;
    if(this.comercializacion && this.comercializacion.length) this.count = this.comercializacion.length;
  }
}



class ActivosData {
  censo: CensoIndustrias;
  type = '';
  slug = '';
  color: string;
  count = 0;
  maquinarias: CensoMaquinarias[] = [];
  bienes: CensoBienes[] = [];
  productos: CensoProductos[] = [];
  patentes: CensoPatentes[] = [];

  constructor(censo: CensoIndustrias, token: string){
    if(token === 'maquinas'){
      this.slug = 'máquinas';
      this.maquinarias = censo.maquinarias;
      if(this.maquinarias && this.maquinarias.length) this.count = this.maquinarias.length;

    }else if(token === 'productos'){
      this.slug = 'productos';
      this.productos = censo.productos;
      if(this.productos && this.productos.length) this.count = this.productos.length;

    }else if(token === 'bienes'){
      this.slug = 'materias primas';
      this.bienes = censo.bienes;
      if(this.bienes && this.bienes.length) this.count = this.bienes.length;

    }else if(token === 'patentes'){
      this.slug = 'patentes';
      this.patentes = censo.patentes;
      if(this.patentes && this.patentes.length) this.count = this.patentes.length;

    }
  }
}

class CoreData {
  censo: CensoIndustrias;
  compNum: string;
  fecomp_txa: string;
  rubroEmp: string = '';
  categoriaEmp: string = '';
  actividades: Array<string> = [];

  constructor(source: CensoIndustrias){
    this.censo = source;
    let tipoEmpresa:TipoEmpresa = CensoIndustriasHelper.findRubroCategoria(source.rubroEmp, source.categoriaEmp )
    if(tipoEmpresa){
      this.rubroEmp = tipoEmpresa.rubro_lbl;
      this.categoriaEmp = tipoEmpresa.categoria_lbl;  
    }
  }

}


class EstadoData {
  censo: CensoIndustrias;
  estado: string;
  avance: string;
  feult: string;
  color: string;
  fecomp_txa: string;
  constructor(source: CensoIndustrias){
    this.censo = source;
    this.avance = CensoIndustriasHelper.getOptionLabel('avance', source.estado.navance);
    this.feult = devutils.txFromDateTime(source.estado.ts_umodif);
    this.color = CensoIndustriasHelper.getOptionToken('avance', source.estado.navance, 'color' );
  }
}
