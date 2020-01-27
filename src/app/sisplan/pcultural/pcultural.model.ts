import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../../develar-commons/develar-entities';
import { Person }   from '../../entities/person/person';



/***********************/
/** Proyecto Cultural */
/*********************/
export class Pcultural {
		_id:          string; 
		compPrefix:  string = 'EVENTO';
		compName:    string = 'S/Evento';
		compNum:     string = '00000';

    type:        string;
    stype:       string;
		sector:      string;
		publico:     string;
		formato:     string;
		programa:    string;

		slug:        string;
		description: string;
		sede:        string;
		locacion:    string;

		estado:      string;
		avance:      string;
		aprobado:    string;

    fecomp:     string; 
    fecomp_ts:  number; 

		fe_label:    string; 
		fe_tsd:      number; 
		fe_tsh:      number; 
		fe_txd:      string; 
		fe_txh:      string;
		
		observacion: string;

};

export class PculturalTable {
    _id:          string; 
    compPrefix:  string;
    compName:    string;
    compNum:     string;

    type:        string;
    stype:       string;
    sector:      string;
    publico:     string;
    formato:     string;

    slug:        string;
    description: string;

    estado:      string;
    avance:      string;
    aprobado:    string;

    fecomp:     string; 
    fecomp_ts:  number; 


}

export class PculturalBrowse {
    searchAction: string;
    compPrefix:   string = 'EVENTO';
    compName:     string = 'S/Evento';

    compNum_d:    string;
    compNum_h:    string;

    fecomp_d:     string;
    fecomp_h:     string;
    fecomp_ts_d:  number;
    fecomp_ts_h:  number;
    sector:       string;
    type:         string;
    stype:        string;
    sede:         string;
    locacion:     string;
    programa:     string;
    formato:      string;
    publico:      string;
    estado:       string = 'activo';
    avance:       string;
    personId:     string;
}



const defaultOptList: Array<any> = [
        {val: 'no_definido',  label: 'Sin selección' },
];

const programaOptList: Array<any> = [
        {val: 'no_definido',    label: 'Sin selección' },
        {val: 'febrero2020',    label: 'Febrero 2020'  },
        {val: 'marzo2020',      label: 'Marzo 2020'    },
];

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
        {val: 'taller',        label: 'Taller'     },
        {val: 'seminario',     label: 'Seminario'     },
        {val: 'congreso',      label: 'Congreso'     },
        {val: 'muestraap',     label: 'Muestra Artes Plásticas'     },
];

const tipoEventoOptList: Array<any> = [
        {val: 'no_definido',    label: 'Sin selección' },
        {val: 'musica',         label: 'Música'     },
        {val: 'milonga',        label: 'Milonga'    },
        {val: 'literatura',     label: 'Literatura' },
];

const sectorOptList: Array<any> = [
        {val: 'no_definido',    label: 'Sin selección' },
        {val: 'produccion',     label: 'Producción'     },
        {val: 'operaciones',    label: 'Operaciones'     },
];


const stipoEventoMap = {
  musica: [
    {val: 'academica',   label: 'Académica' },
    {val: 'popular',     label: 'Popular' },
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
}

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
    
    {val: 'sala303',      label: 'Sala 303' },
    {val: 'sala304',      label: 'Sala 304' },
    {val: 'sala305',      label: 'Sala 305' },
    {val: 'sala306',      label: 'Sala 306' },

    {val: 'auditorio',    label: 'Auditorios' },

  ],
};

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


const avance_estadoRelation = {
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


const optionsLists = {
    default:      defaultOptList,
    formato:      formatoOptList,
    sede:         sedeOptList,
    estado:       estadosOptList,
    avance:       avanceOptList,
    programa:     programaOptList,
    type:         tipoEventoOptList,
    publico:      publicoOptList,
    sector:       sectorOptList,
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


export class PculturalHelper {
	static getOptionlist(type){
		return optionsLists[type] || optionsLists['default'];
	}

	static getSubTypeMap(){
		return stipoEventoMap;
	}

  static getLocacionMap(){
    return locacionMap;
  }


	static getAvanceEstadoRelation(){
		return avance_estadoRelation;
	}

	static getOptionLabelFromList(list, val){
		if(!val) return 'no-definido';
		return getLabel(list, val);
	}

	static getOptionLabel(type, val){
		if(!val) return 'no-definido';
		if(!type) return val;
		return getLabel(this.getOptionlist(type), val);
	}

	static getPrefixedOptionLabel(type, prefix, val){
		if(!val) return 'no-definido';
		if(!type) return prefix + '::' + val;
		return getPrefixedLabel(this.getOptionlist(type), prefix, val);
	}



}
