export class ConsultaCensoQuery {
    _id : string;
    txFecha : string;
     tsFechaHora : number;
     txHora : string;
     userId : string;
     userNombre : string;
     userEdad : number;
     hits : number;
     palabras : string[];
 }
 
 export class ConsultaCenso {
    _id : string;
    query : CensoFeatureQuery;
   txFecha : string;
   tsFechaHora : number;
   txHora : string;
   user : UserMinimal;
   hits : number;
   palabras : string[];
 }
 
 export class UserMinimal {
   userId : string;
   nombre : string;
   edad : number;
 }
 
 
 
 export class BusquedaTable {
     _id: string;
     descripcion : string[];
     txFechaHora: string;
     tsFechaHora: number;
     recurso : string;
     query : CensoFeatureQuery;
   }
   
export class CensoFeatureQuery {
    logica: string;

    fechaDesde: number;
    fechaHasta: number;
    avance: string; 
    empresa: string;
    asignadoId: string; // 

    condiciones: Array<Condiciones>;
    constructor(){
        this.condiciones = [ new Condiciones() ];
        this.avance = 'todos';
    }
}
  
export class Condiciones {
    termino: string;
    buscarEn: string = 'title';
    tipoBusqueda: string = 'aprox';
}

export class CondicionBusqueda {
    key: string;
    label: string;
}
  
export const buscarEnOptList: CondicionBusqueda[] = [
    {  key: 'all',        label: 'Todos los campos'},
    {  key: 'alltext',    label: 'Todos los campos (xPalabra)' },
    {  key: 'alltext',    label: 'Todos los campos (xPalabra)' },

];
    
export const tipoBusquedaOptList: CondicionBusqueda[] = [
    { key: 'aprox',       label: 'Aproximado' },
    { key: 'exact',       label: 'Termino Exacto'},
    { key: 'verdadero',   label: 'VERDADERO'},
    { key: 'falso',       label: 'FALSO'},
];

const estadosOptList: CondicionBusqueda[] = [
    { key: 'enproceso',  label: 'En proceso' },
    { key: 'completado', label: 'Completados' },
    { key: 'aprobado',   label: 'Aprobados' },
    { key: 'todos',      label: 'Todos' },
];

export const logicaOptList: CondicionBusqueda[] = [
    {key: 'and',    label: 'Y'  },
    {key: 'or',     label: 'O'  },
    {key: 'not',    label: 'NO',},
];


/***
 * CUADRO-1 APERTURA POR ESTADO
 */

const aperturaXEstadoOptList: CondicionBusqueda[] = [
    { key: 'total',      label: 'TOTAL EMPRESAS' },
    { key: 'noiniciado', label: 'NO INICIADO' },
    { key: 'enproceso',  label: 'EN PROCESO' },
    { key: 'completado', label: 'COMPLETADAS' },
    { key: 'aprobado',   label: 'APROBADAS' },
];

const aperturaXUbicacionOptList: CondicionBusqueda[] = [
    { key: 'dentrosip',  label: 'Empresas dentro del SIP' },
    { key: 'fuerasip',   label: 'Empresas fuera del SIP' },
];

/***
 * CUADRO-2 ACTIVIDADES EMPRESA
 */
export class ActividadEmpresa {
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
      this.empresaSlug = empresa['empresaSlug'];
  
      this.rubro = actividad['rubro'];
      this.seccion = actividad['seccion'];
      this.codigo = actividad['codigo'];
      this.level = actividad['level'];
      this.type = actividad['type'];
      this.anio = actividad['anio'];
      this.rubro = actividad['rubro'];
    }
  }

/***
 * CUADRO-3 TAMAÑO EMPRESA
 */
 export class TamanioEmpresa {
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
  
  
/***
 * CENSO EMPRESARIAL HELPER CLASS
 */
const default_option_list: Array<any> = [
    { val: 'nodefinido', type: 'nodefinido', label: 'nodefinido' },
  ];
  

  function getLabel(list, val) {
    let t = list.find((item) => item.val === val);
    return t ? t.label : val;
  }
  

const optionsLists = {
    default: default_option_list,
    estados: estadosOptList,
    tipoBusqueda: tipoBusquedaOptList,
    buscarEn: buscarEnOptList,
    logical: logicaOptList,
    // cuadro Apertura x Estado
    apertura: aperturaXEstadoOptList,
    ubicacion: aperturaXUbicacionOptList,

} 
  

export class CensoEmpresarialHelper {

    static getConditionlist(type: string): CondicionBusqueda[] {
        return optionsLists[type] || optionsLists['default'];
    }

    static getOptionlist(type: string) {
        return optionsLists[type] || optionsLists['default'];
    }

    static getOptionLabelFromList(list: any, val: string) {
        if (!val) return 'no-definido';
        return getLabel(list, val);
    }
    
    static cleanQueryToken(query: CensoFeatureQuery): CensoFeatureQuery {
        if (!query) { return null; }
    
        Object.keys(query).forEach((key) => {
          if (query[key] == null || query[key] === 'no_definido') { delete query[key]; }
        });
    
        return query;
      }
        

}
