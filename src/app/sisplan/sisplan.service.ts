import { Pcultural, PculturalTable } from './pcultural/pcultural.model';
import { Budget, BudgetTable }       from './presupuesto/presupuesto.model';

import { devutils } from '../develar-commons/utils';

import { Serial }   from '../develar-commons/develar-entities';


/*****************/
/** METADATOS   */
/***************/

const defaultOptList: Array<any> = [
        {val: 'no_definido',  label: 'Sin selección' },
];

const programaOptList: Array<any> = [
        {val: 'no_definido',    label: 'Sin selección' },
        {val: 'febrero2020',    label: 'Febrero 2020'  },
        {val: 'marzo2020',      label: 'Marzo 2020'    },
];

const sectorOptList: Array<any> = [
        {val: 'no_definido',    label: 'Sin selección' },
        {val: 'produccion',     label: 'Producción'     },
        {val: 'operaciones',    label: 'Operaciones'     },
];

const sedeOptList: Array<any> = [
        {val: 'no_definido',    label: 'Sin selección' },
        {val: 'cck',            label: 'CCK'     },
];

const locacionMap = {
  no_definido: [
    {val: 'no_definido',   label: 'Sin selección' },
  ],

  cck: [
    {val: 'laballena',    label: 'La Ballena'     },
    {val: 'lacupula',     label: 'La Cúpula'      },
    {val: 'pzaseca',      label: 'Plaza Seca'     },
    {val: 'sargentina',   label: 'Sala Argentina' },
    {val: 'shonor',       label: 'Salón de Honor' },
    
    {val: 'tercero',      label: '3er Piso' },
    {val: 'sala303',      label: 'Sala 303' },
    {val: 'sala304',      label: 'Sala 304' },
    {val: 'sala305',      label: 'Sala 305' },
    {val: 'sala306',      label: 'Sala 306' },

    {val: 'auditorio',    label: 'Auditorios' },
    {val: 'cine',         label: 'Cine' },
    {val: 'xdeterminar',  label: 'a determinar...' },

  ],
};


  /*******************/
  /** BUDGET        */
  /*****************/

const monedas = [
      {val: 'ARS',    label: 'pesos',           slug:'Pesos Argentinos' },
      {val: 'USD',    label: 'usd',             slug:'Dolar USA' },
      {val: 'EUR',    label: 'euros',           slug:'Euros' },
      {val: 'BRL',    label: 'reales',          slug:'Reales' },
      {val: 'COP',    label: 'pesosCo',         slug:'Pesos Colombianos' },
      {val: 'UYU',    label: 'pesosUy',         slug:'Pesos Uruguayos' },
      {val: 'CLP',    label: 'pesosCl',         slug:'Pesos Chilenos' },
]


const freqOptList = [
        {val:'no_definido'  , label:'Unidad de Medida'},
        {val:'unidad'       , label:'UN'},
        {val:'porcentaje'   , label:'%'},
        {val:'hora'         , label:'hs'},
        {val:'dia'          , label:'días'},
        {val:'semana'       , label:'sem'},
        {val:'mes'          , label:'mes'},
        {val:'presentacion' , label:'presentaciones'},
        {val:'evento' ,       label:'evento(s)'},
        {val:'no_definido'  , label:'-------------'},
        {val:'pasaje'       , label:'pje'},
        {val:'alojamiento'  , label:'aloj'},
        {val:'tramo'        , label:'tram'},
];


const umeOptList = [
        {val:'no_definido'  , label:'Unidad de Medida'},
        {val:'noop'         , label:'no contable'},
        {val:'unidad'       , label:'UN'},
        {val:'global'       , label:'Global'},
        {val:'porcentaje'   , label:'%'},
        {val:'hora'         , label:'hs'},
        {val:'dia'          , label:'día'},
        {val:'semana'       , label:'sem'},
        {val:'mes'          , label:'mes'},
        {val:'artistanac'   , label:'artista nacional'},
        {val:'artistaext'   , label:'artista extranjero'},
        {val:'contrato'     , label:'contrato'},
        {val:'profesional'  , label:'profesional'},
        {val:'documento'    , label:'documento'},
        {val:'no_definido'  , label:'-------------'},
        {val:'pasaje'       , label:'pje'},
        {val:'tramo'        , label:'tram'},
        {val:'alojamiento'  , label:'aloj'},
        {val:'catering'     , label:'catering'},
        {val:'seguridad'    , label:'seg'},
        {val:'limpieza'     , label:'limpieza'},
        {val:'eqcomunic'    , label:'comunicación'},
        {val:'banioquim'    , label:'baño quím'},
        {val:'carpa'        , label:'carpa'},
        {val:'no_definido'  , label:'-------------'},        
        {val:'asistencia'   , label:'asistencia(s)'},
        {val:'tecnico'      , label:'técnico(s)'},
        {val:'persona'      , label:'persona(s)'},
        {val:'alquiler'     , label:'alquiler'},
        {val:'equipo'       , label:'equipo(s)'},
        {val:'tecnica'      , label:'técnica(s)'},
        {val:'escenario'    , label:'escenario(s)'},
        {val:'lucese'       , label:'luces Esc'},
        {val:'energiae'     , label:'energía Esc'},
        {val:'pantallae'    , label:'pantalla Esc'},
        {val:'sonidoe'      , label:'sonido Esc'},
        {val:'backline'     , label:'back line'},
        {val:'proyector'    , label:'proyector'},
        {val:'no_definido'  , label:'-------------'},
        {val:'seguro'       , label:'seguros'},
        {val:'constseco'    , label:'constr en seco'},
        {val:'mobiliario'   , label:'mobiliario'},
        {val:'trnsobra'     , label:'transporte obra arte'},
        {val:'trnscarga'    , label:'transporte carga'},
        {val:'trnspjero'    , label:'transporte pasajero'},
        {val:'marco'        , label:'marcos'},
        {val:'montaje'      , label:'montajes'},
        {val:'reproduccion' , label:'reproducciones'},
        {val:'no_definido'  , label:'-------------'},
        {val:'sadaic'       , label:'SADAIC'},
        {val:'argentores'   , label:'ARGENTORES'},
        {val:'derechos'     , label:'Derechos'},
        {val:'no_definido'  , label:'-------------'},
        {val:'banner'       , label:'banners'},
        {val:'cartel'       , label:'cartelería'},
        {val:'folleto'      , label:'folletos'},
        {val:'publicacion'  , label:'publicación'},
        {val:'no_definido'  , label:'-------------'},
        {val:'merchandising', label:'merchandising'},
        {val:'no_definido'  , label:'-------------'},
        {val:'grafica'      , label:'gráfica'},
        {val:'buso'         , label:'bienes de uso'},
        {val:'consumible'   , label:'consumible'},
        {val:'instalacion'  , label:'instalación'},
        {val:'obraartistica', label:'obra artística'},
        {val:'ciclo'        , label:'ciclo'},
        {val:'produccion'   , label:'producción'},
        {val:'presentacions', label:'presentaciones'},
        {val:'cubierto'     , label:'cubierto'},
        {val:'viaje'        , label:'viaje'},
        {val:'habitacion'   , label:'habitación'},
        {val:'funcion'      , label:'función'},
        {val:'congreso'     , label:'congreso'},
        {val:'litro'        , label:'litro'},
        {val:'metro'        , label:'metro'},
        {val:'kilo'         , label:'kilo'},
        {val:'otros'        , label:'otros'}
];


  /*******************/
  /** PCULTURALES   */
  /*****************/

const publicoOptList: Array<any> = [
        {val: 'no_definido',  label: 'Sin selección' },
        {val: 'general',      label: 'General' },
        {val: 'infantil',     label: 'Infantil' },
        {val: 'jovenes',      label: 'Jóvenes' },
        {val: 'amayores',     label: 'Adul Mayores'},
];

const formatoOptList: Array<any> = [
        {val: 'no_definido',   label: 'Sin selección' },
        {val: 'ciclo',         label: 'Ciclo'     },
        {val: 'concierto',     label: 'Concierto'     },
        {val: 'ensamble',      label: 'Ensamble'     },
        {val: 'taller',        label: 'Taller'     },
        {val: 'seminario',     label: 'Seminario'     },
        {val: 'congreso',      label: 'Congreso'     },
        {val: 'milonga',       label: 'Milonga'     },
        {val: 'evento',        label: 'Evento'     },
        {val: 'muestraap',     label: 'Muestra Artes Plásticas'     },
];

const tipoEventoOptList: Array<any> = [
        {val: 'no_definido',    label: 'Sin selección' },
        {val: 'musica',         label: 'Música'     },
        {val: 'milonga',        label: 'Milonga'    },
        {val: 'danza',          label: 'Danza'      },
        {val: 'literatura',     label: 'Literatura' },
        {val: 'cine',           label: 'Cine' },
        {val: 'tallerinfantil', label: 'Taller infantil' },
        {val: 'especial',       label: 'Evento especial' },
];

const stipoEventoMap = {
  musica: [
    {val: 'academica',   label: 'Académica' },
    {val: 'popular',     label: 'Popular' },
    {val: 'concierto',   label: 'Concierto' },
    {val: 'karaoke',     label: 'Karaoke' },
    {val: 'organo',      label: 'Órgano' },
    {val: 'homenaje',    label: 'Homenaje' },
  ],

  milonga: [
    {val: 'milonga',     label: 'Milonga' },
  ],

  literatura: [
    {val: 'narrativa',   label: 'Narrativa' },
    {val: 'poesia',      label: 'Poesía' },
    {val: 'homenaje',    label: 'Homenaje' },
  ],

  tallerinfantil: [
    {val: 'taller',     label: 'Inespecífico' },
  ],

  danza: [
    {val: 'danza',     label: 'Inespecífico' },
  ],

  cine: [
    {val: 'cine',     label: 'Ciclos de Cine' },
  ],

  especial: [
    {val: 'especial',     label: 'Evento especial' },
    {val: 'efemeride',    label: 'Evento alusivo a la fecha' },
  ],


}


const estadosOptList = [
      {val: 'no_definido',    label: 'Sin selección',  slug:'Seleccione opción' },
      {val: 'activo',      label: 'Activa',      slug:'Activa' },
      {val: 'cumplido',    label: 'Cumplida',    slug:'Cumplida' },
      {val: 'suspendido',  label: 'Suspendida',  slug:'Suspendida' },
      {val: 'baja',        label: 'Baja',        slug:'Baja' },
]

const avanceOptList = [
      {val: 'no_definido',  label: 'Sin selección',  slug:'Sin selección' },
      {val: 'emitido',      label: 'Emitida',       slug:'Emitida' },
      {val: 'entregado',    label: 'Entregado',     slug:'Entregado' },
      {val: 'enejecucion',  label: 'En ejecución',  slug:'En ejecución' },
      {val: 'aprobado',     label: 'Aprobado',      slug:'Aprobado' },
      {val: 'autorizado',   label: 'Autorizado',    slug:'Autorizado' },
      {val: 'cumplido',     label: 'Cumplido',      slug:'Cumplido' },
      {val: 'pendiente',    label: 'Pendiente',     slug:'Pendiente' } ,
      {val: 'programado',   label: 'Programada',    slug:'Programada' },
      {val: 'derivadoVI',   label: 'Derivado ZVI',     slug:'Derivado ZVI' },
      {val: 'rechazado',    label: 'Rechazado',     slug:'Rechazado' },
      {val: 'incumplido',   label: 'No cumplido',   slug:'No cumplido' },
      {val: 'devuelto',     label: 'Devolución',   slug:'Devolución' },
      {val: 'incompleto',   label: 'Incompleto',   slug:'Incompleto' },
      {val: 'anulado',      label: 'Anulado',       slug:'Anulado' },
]


const avanceEstadoMap = {
  no_definido: [
    {val: 'no_definido',   label: 'Sin selección' },
  ],

  emitido: [
    {val: 'activo',    label: 'Activa' },
  ],

  entregado: [
    {val: 'activo',    label: 'Activa' },
    {val: 'cumplido',  label: 'Cumplido' },
  ],

  enejecucion: [
    {val: 'activo',    label: 'Activa' },
  ],

  aprobado: [
    {val: 'activo',    label: 'Activa' },
    {val: 'cumplido',  label: 'Cumplido' },
  ],

  autorizado: [
    {val: 'activo',    label: 'Activa' },
    {val: 'cumplido',  label: 'Cumplido' },
  ],

  cumplido: [
    {val: 'cumplido',  label: 'Cumplido' },
  ],

  pendiente: [
    {val: 'activo',     label: 'Activa' },
    {val: 'suspendido', label: 'Suspendido' },
  ],

  programado: [
    {val: 'activo',    label: 'Activa' },
  ],

  derivadoVI: [
    {val: 'activo',     label: 'Activa' },
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  rechazado: [
    {val: 'activo',     label: 'Activa' },
    {val: 'suspendido', label: 'Suspendido' },
    {val: 'baja',       label: 'Baja' },
  ],

  incumplido: [
    {val: 'suspendido', label: 'Suspendido' },
    {val: 'baja',       label: 'Baja' },
  ],

  devuelto: [
    {val: 'activo',     label: 'Activa' },
    {val: 'suspendido', label: 'Suspendido' },
    {val: 'baja',       label: 'Baja' },
  ],

  incompleto: [
    {val: 'activo',     label: 'Activa' },
    {val: 'suspendido', label: 'Suspendido' },
    {val: 'baja',       label: 'Baja' },
  ],

  anulado: [
    {val: 'baja',       label: 'Baja' },
  ]

}

const tableActionsOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'editar',       label: 'Editar Evento',    slug:'Editar Evento' },
]

/*****************/
/**    API      */
/***************/

const optionsLists = {
    default:      defaultOptList,

    sector:       sectorOptList,
    programa:     programaOptList,
    sede:         sedeOptList,

    type:         tipoEventoOptList,
    formato:      formatoOptList,
    publico:      publicoOptList,
    estado:       estadosOptList,
    avance:       avanceOptList,

    tableactions: tableActionsOptList,
}

function getLabel(list, val){
    let t = list.find(item => item.val === val)
    return t ? t.label : val;
}

function getOptListToken(list, val){
    let t = list.find(item => item.val === val)
    return t ? t : null;
}

function getPrefixedLabel(list, prefix, val){
    let label = getLabel(list, val);
    if(label) {
      label = prefix ? prefix + ': ' + label : ' ' + label
    }
    return label;
}

/*****************/
/**  BUDGET     */
/***************/
export class BudgetService {

  static filterActiveBudgets(list: Budget[]): Budget[]{
    if(!list || !list.length) return [];

    let filteredList = list.filter(t => {
      let valid = true;

      return valid;
    })

    return filteredList;
  }

  static initNewBudget(sector, type, stype, slug,  serial?: Serial){
    let ts = Date.now();
    let token = new Budget();


    token.fecomp = devutils.txFromDateTime(ts);
    token.fecomp_ts = ts;

    token.sector = sector;
    token.type =   type;
    token.stype =  stype;
    token.slug =   slug;

    token.description = '';

    if(serial){
      token.compPrefix = serial.compPrefix ;
      token.compName = serial.compName;
      token.compNum = serial.pnumero + "";
    }

    token.estado = 'activo';
    token.avance = 'emitido';

    return token;
  }

  static budgetSerial(type, name, sector, peso){
    let serial = new Serial();
    serial.type =    'budget';  // type
    serial.name =    'budget';  // name
    serial.tserial = 'budget';
    serial.sector =  'budget';  // sector;
    serial.tdoc =    'evento';
    serial.letra =   'X';       //peso

    serial.anio = 0;
    serial.mes = 0;
    serial.dia = 0;
    serial.estado = 'activo';
    serial.punto = 0;
    serial.pnumero = 1;
    serial.offset = 0;
    serial.slug = 'Solicitud de Presupuesto CCK';
    serial.compPrefix = 'PRE';
    serial.compName = 'S/Presupuesto';
    serial.showAnio = false;
    serial.resetDay = false;
    serial.fe_ult = 0;

    return serial;
  }

  static buildDataTable(list: Budget[]){
    return list.map(token => {
      let td = new BudgetTable();
      td._id        = token._id;
      td.compPrefix = token.compPrefix;
      td.compName   = token.compName;
      td.compNum    = token.compNum;
      td.slug       = token.slug;
      td.description = token.description;
      td.sector     = token.sector;
      td.estado     = token.estado;
      td.avance     = token.avance;
      return td;
    })

  }

}



export class SisplanService {

  /*****************/
  /** METADATOS   */
  /***************/
  static getOptionlist(type){
    return optionsLists[type] || optionsLists['default'];
  }

  static getOptionLabel(type, val){
    if(!val) return 'no-definido';
    if(!type) return val;
    return getLabel(this.getOptionlist(type), val);
  }

  static getOptionLabelFromList(list, val){
    if(!val) return 'no-definido';
    return getLabel(list, val);
  }

  static getPrefixedOptionLabel(type, prefix, val){
    if(!val) return 'no-definido';
    if(!type) return prefix + '::' + val;
    return getPrefixedLabel(this.getOptionlist(type), prefix, val);
  }



  /** PCULTURALES   */
  static getSubTypeMap(){
    return stipoEventoMap;
  }

  static getLocacionMap(){
    return locacionMap;
  }

  static getAvanceMap(){
    return avanceEstadoMap;
  }



  /*******************/
  /** PCULTURALES   */
  /*****************/

	static filterActivePculturales(list: Pcultural[]): Pcultural[]{
		if(!list || !list.length) return [];

		let filteredList = list.filter(t => {
			let valid = true;

			return valid;
		})

		return filteredList;
	}

  static initNewPcultural(sector, type, stype, slug,  serial?: Serial){
    let ts = Date.now();
    let token = new Pcultural();


    token.fecomp = devutils.txFromDateTime(ts);
    token.fecomp_ts = ts;

    token.sector = sector;
    token.type =   type;
    token.stype =  stype;
    token.slug =   slug;

    token.description = '';

    if(serial){
      token.compPrefix = serial.compPrefix ;
      token.compName = serial.compName;
      token.compNum = serial.pnumero + "";
    }

    token.estado = 'activo';
    token.avance = 'emitido';

    return token;
  }

	static pculturalSerial(type, name, sector, peso){
		let serial = new Serial();
		serial.type =    'pcultural';     // type
		serial.name =    'pcultural';      // name
		serial.tserial = 'pcultural';
		serial.sector =  'pcultural';    // sector;
		serial.tdoc =    'evento';
		serial.letra =   'X';  //peso

		serial.anio = 0;
		serial.mes = 0;
		serial.dia = 0;
		serial.estado = 'activo';
		serial.punto = 0;
		serial.pnumero = 1;
		serial.offset = 0;
		serial.slug = 'Solicitud de evento cultural CCK';
		serial.compPrefix = 'EVENTO';
		serial.compName = 'S/Evento';
		serial.showAnio = false;
		serial.resetDay = false;
		serial.fe_ult = 0;

		return serial;
	}

  static buildDataTable(list: Pcultural[]){
    return list.map(token => {
      let td = new PculturalTable();
      td._id        = token._id;
      td.compPrefix = token.compPrefix;
      td.compName   = token.compName;
      td.compNum    = token.compNum;
      td.fecomp_ts  = token.fecomp_ts;
      td.fecomp     = token.fecomp;
      td.slug       = token.slug;
      td.description = token.description;
      td.sector     = token.sector;
      td.estado     = token.estado;
      td.avance     = token.avance;
      return td;
    })

  }

}

export interface UpdateListEvent {
  action: string;
  type:   string;
  items:  Array<Pcultural>;
};


export interface UpdateEvent {
  action:  string;
  token:   string;
  payload: Pcultural;
};
