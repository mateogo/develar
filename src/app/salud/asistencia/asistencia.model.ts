import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../salud.model';
import { Person, Address }   from '../../entities/person/person';
import { sectores } from '../salud.model';

export class Requirente {
		id:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string;
		nombre?: string;
		apellido?: string; 
};
 
export class Atendido {
		id:      string;
		slug:    string;
		sector:  string;
};

export interface Tile {
		dia:      number;
		mes:      number;
		sem:      string;
		fenac:    number;
		ciudad:   string;
		sexo:     string;
		edadId:   string;
		estado:   string;
		avance:   string;
		action:   string;
		sector:   string;
		cardinal: number;
		id:       string;
}

export class Alimento {
		id:          string;
		type:        string ;
		periodo:     string = 'UNICO';
		fe_tsd:      number;
		fe_tsh:      number;
		fe_txd:      string;
		fe_txh:      string;
		freq:        string = 'unica';
		qty:         number = 1;
		observacion: string;
};

export class Modalidad {
		periodo:     string = 'UNICO';
		fe_tsd:      number = 0;
		fe_tsh:      number = 0;
		fe_txd:      string;
		fe_txh:      string;
		freq:        string = 'unica';
}

export class ItemPedido {
	slug: string;

	kitItem: number = 0; // 0: es un item cargado a mano 1: item que deviene de KIT
	productId: string;
	code: string;
	name: string;
	ume: string;
	qty: number = 1;
	punitario: number = 0;

}

export interface VoucherType {
  type: string;
  label: string;
  key: string;
  isRemitible: boolean;
  payload: Alimento|Pedido;

}


export class Pedido {
		id:             string;
		modalidad: Modalidad;
		type: string;

		deposito:       string;
    urgencia:       number = 1;
    kitId:          string;
    kitQty:         number = 1;
    observacion:    string;
    causa:          string;

		estado:         string = 'activo';
		avance:         string = 'emitido';
    items: Array<ItemPedido>  = [];
};



export class Encuesta {
		id:           string;
		fe_visita:    string;
		fe_visita_ts: number;
		locacionId:   string;
		ruta:         string;
		trabajador:   string;
		trabajadorId: string;
    urgencia:     number = 1;
    city:         string = '';
    barrio:       string = '';
		preparacion:  string;
		estado:       string = 'activo';
		avance:       string = 'programado';
		evaluacion:   string;

};

export class Novedad {
		_id?: string;
		tnovedad: string = 'operadorcom';
		novedad: string = '';
		fecomp_tsa:  number;
		fecomp_txa:  string;
		atendidox: Atendido;

		constructor(){
			let hoy = new Date();

			this.fecomp_tsa = hoy.getTime();
			this.fecomp_txa = devutils.txFromDate(hoy);
		}
}

export class ContextoCovid {
	hasFiebre: boolean = false;
	fiebreTxt: string = 'cree';
	fiebre: number = 37;
	fiebreRB: number = 3;

	hasDifRespiratoria: boolean = false;
	hasDolorGarganta: boolean = false;
	hasTos: boolean = false;
	sintomas: string;

	hasViaje: boolean = false;
	hasContacto: boolean = false;
	hasEntorno: boolean = false;
	contexto: string;

	esperaMedico: boolean = false;
	vistoMedico: boolean = false;
	indicacion: string;
	problema: string;

	necesitaSame:    boolean = false;
	esperaTraslado:  boolean = false;
	estaInternado:   boolean = false;
	estaEnDomicilio: boolean = false;


	hasCOVID: boolean = false;
	isCOVID: boolean = false;

}

export class Locacion {
    _id?: string;
    slug: string = '';
    street1: string = '';
    streetIn: string = '';
    streetOut: string = '';
    city: string = '';
    barrio?: string = '';
    lat: number = 0;
    lng: number = 0;
}


export class Asistencia {
		_id: string;
		compPrefix:  string = 'SOL';
		compName:    string = 'S/Asistencia';
		compNum:     string = '00000';

		idPerson:    string;
		ndoc:        string;
		tdoc:        string;
		telefono:    string;
		osocial:     string;
		osocialTxt:  string;

		sintomacovid: ContextoCovid;

		idbrown:     string;
		fecomp_tsa:  number;
		fecomp_txa:  string;
		action:      string = 'covid';
		slug:        string;
		description: string;
		sector:      string;
		estado:      string = 'activo';
		avance:      string = 'emitido';
		ts_alta:     number;
		ts_fin:      number;
		ts_prog:     number;
		locacion:    Locacion;
		novedades:   Array<Novedad>;;
		requeridox:  Requirente;
		atendidox:   Atendido;
		modalidad:   Alimento;
		encuesta:    Encuesta;
		pedido:      Pedido;

};

export class AsistenciaTable {
		_id: string;
		asistenciaId: string;
		compName:    string;
		compNum:     string;
		personId:    string;
		personSlug:  string;
		fecomp_tsa:  number;
		fecomp_txa:  string;
		action:      string;
		slug:        string;
		description: string;
		sector:      string;
		estado:      string;
		avance:      string;
		ts_alta:     number;

		fe_visita:   string;
		fe_visita_ts: number;
		ruta:         string;
		trabajador:   string;
		trabajadorId: string;

};


export class DashboardBrowse {
		action:      string;
		sector:      string;
		estado:      string;
		avance:      string;
		fecharef?:   string;
}

export class AsistenciaBrowse {
		searchAction: string;
		compPrefix:  string = 'SOL';
		compName:    string = 'S/Asistencia';
		compNum_d:   string;
		requirenteId: string;
		compNum_h:   string;
		idPerson:    string;
		fecomp_d:    string;
		fecomp_h:    string;
		fecomp_ts_d:    number;
		fecomp_ts_h:    number;
		action:      string;
		sector:      string;
		estado:      string = 'activo';
		avance:      string;
		fe_visita:   string;
		ruta:        string;
		barrio:      string;
		city:        string;
		urgencia:    number;
		trabajadorId: string;
		avance_encuesta: string;
}

export interface AsistenciaSig {
	asistencia: Asistencia;
	locacion: any;
	lat: number;
	lng: number;
}

export interface AsistenciaAction  {
	id_turno: string;
	turno: Asistencia;
	action: string;
	estado: string;
	resultado?: string;
	atendidox?: Atendido;
	modalidad?: Alimento;
	observación?: string;
}

export interface UpdateAsistenciaEvent {
	action: string;
	type: string;
	selected?: boolean;
	token: Asistencia;
};

export interface UpdateAlimentoEvent {
	action: string;
	type: string;
	token: Alimento;
};

export interface UpdateEncuestaEvent {
	action: string;
	type: string;
	token: Encuesta;
};

export interface UpdatePedidoEvent {
	action: string;
	type: string;
	token: Pedido;
};

export interface UpdateAsistenciaListEvent {
      action: string;
      type: string;
      items: Array<Asistencia>;
};


export class AsistenciaslModel {
	static asistenciasPorPersonQuery(action, name){

		let query = {
			action: action,
			name: name,
			estado: 'pendiente',
		};

		return query;
	}

}


const obrasSociales = [
      {val: 'no_definido',  label: 'Seleccioneopción',   slug:'Seleccione opción' },
      {val: 'noposee',      label: 'No posee',  slug:'No posee' },
      {val: 'OSOCIAL',      label: 'O/SOCIAL',  slug:'O/SOCIAL' },
      {val: 'PAMI',         label: 'PAMI',      slug:'PAMI' },
      {val: 'mprivada',     label: 'Privado',   slug:'Privado' },
      {val: 'otra',         label: 'Otra',      slug:'Otra' },
];


const indicacionOptList: Array<any> = [
        {val: 'nodefinido',     type:'nodefinido',    label: 'nodefinido' },
        {val: 'aislamiento',    type:'aislamiento',    label: 'aislamiento' },
        {val: 'ctrlsintomas',   type:'ctrlsintomas',    label: 'ctrlsintomas' },
        {val: 'esperemedico',   type:'esperemedico',    label: 'esperemedico' },
        {val: 'esperesame',     type:'esperesame',    label: 'esperesame' },
        {val: 'urgeguarida',     type:'urgeguardia',    label: 'urgeguardia' },
];

const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];

const asisActionOptList: Array<any> = [
        {val: 'no_definido',    isRemitible: false, key:'',          type:'Sin selección',     label: 'Sin selección' },
        {val: 'covid',      isRemitible: false,  key:'modalidad',  type:'covid',         label: 'COVID' },
        {val: 'prevencion',      isRemitible: false,  key:'modalidad',  type:'prevencion',         label: 'Llamado prevención' },
        {val: 'same',      isRemitible: false,  key:'modalidad',  type:'same',         label: 'Derivar SAME' },

];

const novedadesTypeOptList: Array<any> = [
        {val: 'operadorcom',  label: 'Operador/a COM' },
        {val: 'solmedicx',    label: 'Médico/a' },
        {val: 'enviarsame',   label: 'SAME' },
        {val: 'recomendacion',label: 'Recomendación' },
        {val: 'evolucion',    label: 'Evolución' },
        {val: 'otros',        label: 'Otros' },
        {val: 'no_definido',  label: 'Sin selección' },
];


const pedidosTypeOptList: Array<any> = [
        {val: 'covid',    type:'covid',     label: 'COVID' },
        {val: 'prevencion',    type:'prevencion',     label: 'Prevención' },
        {val: 'same',    type:'same',     label: 'SAME' },
        {val: 'no_definido',  type:'Sin selección', label: 'Sin selección' },
];

const entregaDesdeOptList: Array<any> = [
        {val: 'no_definido',  type:'Sin selección', label: 'Sin selección' },
];

const causasOptList: Array<any> = [
        {val: 'emergencia',     type:'Emergencia',  label: 'Emergencia' },
        {val: 'covid',          type:'COVID',       label: 'Posible COVID' },
        {val: 'otro',           type:'Otro',     label: 'Otro' },
        {val: 'no_definido',    type:'Sin selección', label: 'Sin selección' },
];

			// {val:'com',          serial:'salud',       label: 'COM',               style: {'background-color': "#f2cded"}},
			// {val:'prevencion',   serial:'salud',       label: 'Médico/a prevención', style: {'background-color': "#f2cded"}},
			// {val:'same',         serial:'salud',       label: 'SAME',              style: {'background-color': "#f2aded"}},
			// {val:'direccion',    serial:'salud',       label: 'Dirección Médica' , style: {'background-color': "#f2dded"}},


const sector_actionRelation = {
  com: [
    {val: 'covid',   label: 'Atención telefónica COVID' },
  ],

  prevencion: [
    {val: 'atenciontel',   label: 'Atención telefónica' },
    {val: 'same',   label: 'Requerir Same' },
    {val: 'prevencion',       label: 'Seguimiento de prevención' },
  ],

  same: [
    {val: 'same',   label: 'Gestionar SAME' },
  ],

  direccion: [
    {val: 'atenciontel',   label: 'Atención telefónica' },
    {val: 'same',   label: 'Requerir Same' },
    {val: 'prevencion',       label: 'Seguimiento de prevención' },
  ],

}


const followUpOptList: Array<any> = [  
        {val: 'no_definido',  label: 'No definido',  slug:'Seleccione opción' },
        {val: 'tsocial',       label: 'TS',           slug:'TS' },
        {val: 'habitat',       label: 'Habitat',      slug:'Habitat' },
 ];


const alimentosTypeOptList: Array<any> = [
        {val: 'no_definido', type:'Sin selección',  label: 'Sin selección' },

];

const comprobantesOptList: Array<any> = [
        {val: 'sasistencia',   type:'S/Asistencia',    label: 'S/Asistencia' },
];

const frecuenciaOptList: Array<any> = [
        {val: 'diaria',    q: 31, type:'Diaria',           label: 'Diaria' },
        {val: 'semanal',   q: 4, type:'Semanal',          label: 'Semanal' },
        {val: 'quincenal', q: 2, type:'Quincenal',        label: 'Quincenal' },
        {val: 'mensual',   q: 1, type:'Mensual',          label: 'Mensual' },
        {val: 'unica',     q: 1, type:'Vez única',        label: 'Vez única' },
        {val: 'unicavez',  q: 1, type:'Vez única',        label: '---------------' },
        {val: 'arequerim', q: 1, type:'A requerimiento',  label: 'A requerimiento' },
];

const tableActions = [
      {val: 'no_definido',  label: 'Seleccione opción',   slug:'Seleccione opción' },
      {val: 'editarencuestas',       label: 'Edición entrevistas SA',        slug:'Edición entrevistas SA' },
      {val: 'autorizar',    label: 'Autorizar solicitud', slug:'Autorizar solicitud' },
]

const urgenciaOptList = [
      {val: 1,  label: 'Baja',  slug:'Urgencia baja' },
      {val: 2,  label: 'Media', slug:'Urgencia media' },
      {val: 3,  label: 'Alta',  slug:'Urgencia alta' },
]

const periodoOptList = [
      {val: "UNICO", q:0,  label: 'Única vez', slug:'Entrega única' },
      {val: "3M",    q:3,  label: ' 3 meses',  slug:'Período de validez: 3 meses' },
      {val: "6M",    q:6,  label: ' 6 meses',  slug:'Período de validez: 6 meses' },
      {val: "9M",    q:9,  label: ' 9 meses',  slug:'Período de validez: 9 meses' },
      {val: "12M",   q:12, label: '12 meses',  slug:'Período de validez: 12 meses' },
]

const estadosOptList = [
      {val: 'no_definido',    label: 'Sin selección',  slug:'Seleccione opción' },
      {val: 'activo',      label: 'Activa',      slug:'Activa' },
      {val: 'cumplido',    label: 'Cumplida',    slug:'Cumplida' },
      {val: 'cerrado',     label: 'Cerrado',    slug:'Cerrado' },
      {val: 'suspendido',  label: 'Suspendida',  slug:'Suspendida' },
      {val: 'baja',        label: 'Baja',        slug:'Baja' },
]

const avanceOptList = [
      {val: 'no_definido',    label: 'Sin selección',  slug:'Sin selección' },
      {val: 'emitido',        label: 'Emitida',        slug:'Emitida' },
      {val: 'descartado',     label: 'Descartado',     slug:'Descartado' },
      {val: 'enobservacion',  label: 'En observación', slug:'En observación' },
      {val: 'enaislamiento',  label: 'En aislamiento', slug:'En aislamiento' },
      {val: 'esperamedico',   label: 'Espera médico/a', slug:'Espera médico/a' },
      {val: 'esperasame',     label: 'Espera SAME',    slug:'Espera SAME' },
      {val: 'hospitalizado',  label: 'Hospitalizado',  slug:'Hospitalizado' },
      {val: 'derivado',       label: 'Derivado',       slug:'Derivado' },
      {val: 'dadodealta',     label: 'Alta médica',    slug:'Alta médica' },
      {val: 'fallecido',      label: 'Fallecido',      slug:'Fallecido' },
      {val: 'anulado',        label: 'Anulado',        slug:'Anulado' },
]


const workflow = {
  no_definido: [
    {val: 'no_definido',   label: 'Sin selección' },
  ],

  emitido: [
      {val: 'descartado',     label: 'Descartado',     slug:'Descartado' },
      {val: 'esperamedico',   label: 'Espera médico/a', slug:'Espera médico/a' },
  ],

  descartado: [
      {val: 'descartado',     label: 'Descartado',     slug:'Descartado' },
    	{val: 'enobservacion',  label: 'En observación', slug:'En observación' },
  ],

  enobservacion: [
    	{val: 'enobservacion',  label: 'En observación', slug:'En observación' },
      {val: 'descartado',     label: 'Descartado',     slug:'Descartado' },
      {val: 'enaislamiento',  label: 'En aislamiento', slug:'En aislamiento' },
      {val: 'esperamedico',   label: 'Espera médico/a', slug:'Espera médico/a' },
  ],

  enaislamiento: [
      {val: 'enaislamiento',  label: 'En aislamiento', slug:'En aislamiento' },
      {val: 'descartado',     label: 'Descartado',     slug:'Descartado' },
      {val: 'esperamedico',   label: 'Espera médico/a', slug:'Espera médico/a' },
  ],

  esperamedico: [
      {val: 'esperamedico',   label: 'Espera médico/a', slug:'Espera médico/a' },
      {val: 'descartado',     label: 'Descartado',     slug:'Descartado' },
      {val: 'enobservacion',  label: 'En observación', slug:'En observación' },
      {val: 'enaislamiento',  label: 'En aislamiento', slug:'En aislamiento' },
      {val: 'esperasame',     label: 'Espera SAME',    slug:'Espera SAME' },
  ],

  esperasame: [
      {val: 'esperasame',     label: 'Espera SAME',    slug:'Espera SAME' },
      {val: 'hospitalizado',  label: 'Hospitalizado',  slug:'Hospitalizado' },
      {val: 'derivado',       label: 'Derivado',       slug:'Derivado' },
      {val: 'anulado',        label: 'Anulado',        slug:'Anulado' },
  ],

  hospitalizado: [
      {val: 'derivado',       label: 'Derivado',       slug:'Derivado' },
      {val: 'dadodealta',     label: 'Alta médica',    slug:'Alta médica' },
      {val: 'fallecido',      label: 'Fallecido',      slug:'Fallecido' },
  ],

  derivado: [
      {val: 'dadodealta',     label: 'Alta médica',    slug:'Alta médica' },
      {val: 'fallecido',      label: 'Fallecido',      slug:'Fallecido' },
  ],


}


const avance_estadoRelation = {
  no_definido: [
    {val: 'no_definido',   label: 'Sin selección' },
  ],

  emitido: [
    {val: 'activo',   label: 'Activa' },
  ],

  descartado: [
    {val: 'cerrado',   label: 'Cerrado' },
  ],

  enobservacion: [
    {val: 'activo',   label: 'Activa' },
  ],

  enaislamiento: [
    {val: 'activo',   label: 'Activa' },
  ],

  esperamedico: [
    {val: 'activo',   label: 'Activa' },
  ],

  esperasame: [
    {val: 'activo',   label: 'Activa' },
  ],

  hospitalizado: [
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  derivado: [
    {val: 'cerrado',   label: 'Cerrado' },
  ],

  cumplido: [
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  dadodealta: [
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  fallecido: [
    {val: 'cerrado',   label: 'Cerrado' },
  ],

  anulado: [
    {val: 'baja',   label: 'Baja' },
  ]


}


const avanceEncuestaOptList = [
      {val: 'no_definido',  label: 'Sin selección',  slug:'Sin selección' },
      {val: 'emitido',      label: 'Emitida',          slug:'Emitida' },
      {val: 'programado',   label: 'Programado',       slug:'Programado' },
      {val: 'visitado',     label: 'Visita cumplida',  slug:'Visita cumplida' },
      {val: 'noencontrado', label: 'Referente no encontrado',  slug:'Referente no encontrado' },
      {val: 'informado',    label: 'Informe cargado',  slug:'Informe cargado' },
      {val: 'aprobado',     label: 'Informe aprobado', slug:'Informe aprobado' },
      {val: 'suspendido',   label: 'Suspendido',       slug:'Suspendido' },
]

const ciudadesBrown: Array<any> = [
    {val: 'no_definido',         label: 'Seleccione opción',slug:'Seleccione opción' },
    {val: 'adrogue',             label: 'Adrogué ',   slug:'Adrogué' },
    {val: 'burzaco',             label: 'Burzaco ',   slug:'Burzaco' },
    {val: 'calzada',             label: 'Calzada ',   slug:'Calzada' },
    {val: 'claypole',            label: 'Claypole',   slug:'Claypole' },
    {val: 'donorione',           label: 'Don Orione', slug:'Don Orione' },
    {val: 'glew',                label: 'Glew',       slug:'Glew' },
    {val: 'longchamps',          label: 'Longchamps', slug:'Longchamps' },
    {val: 'malvinasargentinas',  label: 'Malvinas Argentinas',slug:'Malvinas Argentinas' },
    {val: 'marmol',              label: 'J.Mármol',   slug:'J.Mármol' },
    {val: 'ministrorivadavia',   label: 'Ministro Rivadavia',slug:'Ministro Rivadavia' },
    {val: 'sanjose',             label: 'San José',   slug:'San José' },
    {val: 'extradistrito',       label: 'Extra distrito',   slug:'Fuera del Municipio de Brown' },
];

const MODALIDAD_ALIMENTO =     'alimentos';
const MODALIDAD_HABITACIONAL = 'habitacional';
const MODALIDAD_SANITARIA =    'sanitaria';
const MODALIDAD_ENCUESTA =     'encuesta';


function validateCoreAsistencia(as: Asistencia, valid: boolean): boolean {
	if(as.estado !== "activo"){
		valid = false;
	}

	return valid;
}

function validateAlimentosAsistencia(as: Asistencia, valid: boolean): boolean {
	if(!valid) return valid;

	let alimento = as.modalidad;
	if(alimento && alimento.fe_txd && alimento.fe_txh){

		if(!devutils.isWithinPeriod(alimento.fe_txd, alimento.fe_txh)) valid = false;

	}

	return valid;
}

function validatePedidosAsistencia(as: Asistencia, valid: boolean): boolean {
	if(!valid) return valid;

	let pedido = as.pedido;
	let modalidad = pedido ? pedido.modalidad : null;
	if(pedido && modalidad && modalidad.fe_txd && modalidad.fe_txh){

		if(!devutils.isWithinPeriod(modalidad.fe_txd, modalidad.fe_txh)) valid = false;

	}

	return valid;
}
/****
export class Modalidad {
		periodo:     string = 'UNICO';
		fe_tsd:      number = 0;
		fe_tsh:      number = 0;
		fe_txd:      string;
		fe_txh:      string;
		freq:        string = 'unica';
}

export class ItemPedido {
	slug: string;

	kitItem: number = 0; // 0: es un item cargado a mano 1: item que deviene de KIT
	productId: string;
	code: string;
	name: string;
	ume: string;
	qty: number = 1;
	punitario: number = 0;

}

export interface VoucherType {
  type: string;
  label: string;
  key: string;
  isRemitible: boolean;
  payload: Alimento|Pedido;

}


export class Pedido {
		id:             string;
		modalidad: Modalidad;
		type: string;

		deposito:       string;
    urgencia:       number = 1;
    kitId:          string;
    kitQty:         number = 1;
    observacion:    string;
    causa:          string;

		estado:         string = 'activo';
		avance:         string = 'emitido';
    items: Array<ItemPedido>  = [];
};

**/




const optionsLists = {
	 default: default_option_list,
   actions: asisActionOptList,
   comprobantes: comprobantesOptList,
   alimentos: alimentosTypeOptList,
   followup: followUpOptList,
   frecuencia: frecuenciaOptList,
   tableactions: tableActions,
   sectores: sectores,
   ciudades: ciudadesBrown,
   estado: estadosOptList,
   avance: avanceOptList,
   encuesta: avanceEncuestaOptList,
   urgencia: urgenciaOptList,
   pedidos: pedidosTypeOptList,
   periodo: periodoOptList,
   deposito: entregaDesdeOptList,
   novedades: novedadesTypeOptList,
   causa: causasOptList,
   indicaciones: indicacionOptList,
   osocial: obrasSociales,
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

function expectedQty(type, val){
		if(!val) return 'no-definido';
		if(!type) return 0;
		let list = optionsLists[type]
		let t = list.find(item => item.val === val)
		return t ? t.q : 0;
}



export class AsistenciaHelper {

	static getOptionlist(type){
		return optionsLists[type] || optionsLists['default'];
	}

	static getSectorActionRelation(){
		return sector_actionRelation;
	}

	static getAvanceEstadoRelation(){
		return avance_estadoRelation;
	}

	static getWorkflow(){
		return workflow;
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

	static buildRequirente(person: Person): Requirente {
		console.log('BuildRequirente [%s]', person && person.displayName)
		let req:Requirente = {
			id:   person._id ,
			slug: person.displayName ,
			tdoc: person.tdoc ,
			ndoc: person.ndoc 
		}

		return req;
	}

	static buildCovidRequirente(person: Person): Requirente {
		let req: Requirente;
		if(person && person._id){
			req = {
				id:   person._id ,
				slug: person.displayName ,
				nombre: person.nombre,
				apellido: person.apellido,
				tdoc: person.tdoc ,
				ndoc: person.ndoc 
			}

		}else{
			req = {
				id:   null,
				slug: person.displayName ,
				tdoc: person.tdoc ,
				ndoc: person.ndoc,
				nombre: person.nombre,
				apellido: person.apellido,
			}

		}

		return req;
	}

	/***
     devuelve NUEVA lista de asistencias filtradas
     fitros:
     	estado === activo
     	alimentos:
     		que esté en el período
     	pedidos:
     		que esté en el período
	*/

	static filterActiveAsistencias(list: Asistencia[]): Asistencia[]{
		if(!list || !list.length) return [];

		let filteredList = list.filter(t => {
			let valid = true;
			valid = validateCoreAsistencia(t, valid);
			valid = validateAlimentosAsistencia(t, valid);
			valid = validatePedidosAsistencia(t, valid);

			return valid;
		})

		return filteredList;
	}


  static asistenciasSortProperly(records: Asistencia[]): Asistencia[]{
    records.sort((fel, sel)=> {
      if(!fel.fecomp_tsa) fel.fecomp_tsa = 0;
      if(!sel.fecomp_tsa) sel.fecomp_tsa = 0;

      if(fel.fecomp_tsa < sel.fecomp_tsa) return 1;
      else if(fel.fecomp_tsa > sel.fecomp_tsa) return -1;
      else return 0;
    });
    return records;
  }


  static isAsistenciaImperfecta(asistencia:Asistencia): boolean{
  	let isImperfecta = false;
  	if(asistencia.estado !== 'activo') return isImperfecta;

    if(asistencia.action === MODALIDAD_ALIMENTO) {
    	if(!asistencia.modalidad) isImperfecta = true;

    } else if(asistencia.action === MODALIDAD_HABITACIONAL){
    	if(!asistencia.pedido) isImperfecta = true;


    } else if(asistencia.action === MODALIDAD_SANITARIA){
    	if(!asistencia.pedido) isImperfecta = true;


    } else if(asistencia.action === MODALIDAD_ENCUESTA){
    	if(!asistencia.encuesta) isImperfecta = true;

    }
    
    return isImperfecta;
  }


	static initNewAsistenciaDeprecated(type ): Asistencia{
		let token = new Asistencia();
		if(type === 'alimentos'){
			token.modalidad = new Alimento();


		} else if(type === 'subsidio'){

		}

		return token;
	}

	static workfloStep(token: Asistencia, step: any){
		let avance = step.val;
		let estados = sector_actionRelation[avance] || [];
		let nuevoEstado = estados.length ? estados[0] : '';	
		token.estado = nuevoEstado ? nuevoEstado : token.estado;
		token.avance = avance;
		return token;
	}

/*
		searchAction: string;
		compPrefix:  string = 'SOL';
		compName:    string = 'S/Asistencia';
		compNum_d:   string;
		requirenteId: string;
		compNum_h:   string;
		idPerson:    string;
		fecomp_d:    string;
		fecomp_h:    string;
		fecomp_ts_d:    number;
		fecomp_ts_h:    number;
		action:      string;
		sector:      string;
		estado:      string = 'activo';
		avance:      string = 'emitido';
		fe_visita:   string;
		ruta:        string;
		barrio:      string;
		city:        string;
		urgencia:    number;
		trabajadorId: string;
		avance_encuesta: string;

		_id: string;
		compPrefix:  string = 'SOL';
		compName:    string = 'S/Asistencia';
		compNum:     string = '00000';
		idPerson:    string;
		fecomp_tsa:  number;
		fecomp_txa:  string;
		action:      string = 'alimentos';
		slug:        string;
		description: string;
		sector:      string;
		estado:      string = 'activo';
		avance:      string = 'emitido';
		ts_alta:     number;
		ts_fin:      number;
		ts_prog:     number;
		requeridox:  Requirente;
		atendidox:   Atendido;
		modalidad:   Alimento;
		encuesta:    Encuesta;



*/
	static initNewAsistencia(action, sector, person?: Person, serial?: Serial, slug?){
		let ts = Date.now();
		let requirente: Requirente;
		let token = new Asistencia();
		let novedad = new Novedad();

		if(person){
			requirente = AsistenciaHelper.buildRequirente(person);
			token.idPerson = person._id;
		}else{
			requirente = new Requirente();
			token.idPerson = '';
		}

		token.fecomp_txa = devutils.txFromDateTime(ts);
		token.fecomp_tsa = ts;

		token.action = action;
		token.slug = slug || 'Atención telefónica en el COM';
		token.sector = sector;
		token.requeridox = requirente;
		token.description = '';

		if(serial){
			token.compPrefix = serial.compPrefix ;
			token.compName = serial.compName;
			token.compNum = serial.pnumero + "";
		}else{
			token.compPrefix = 'SOL' ;
			token.compName = 'S/Asistencia';
			token.compNum = '';
		}

		token.ts_alta = ts;
		token.ts_fin = 0
		token.ts_prog = ts;
		token.estado = 'activo';
		token.avance = 'emitido';
		token.novedades = [ novedad ];

		return token;
	}

	static initNewAsistenciaCovid(action, sector, person?: Person, serial?: Serial, slug?){
		let ts = Date.now();
		let requirente: Requirente;
		let token = new Asistencia();
		let novedad = new Novedad();

		novedad.tnovedad = "operadorcom";
		novedad.novedad  = 'Llamado recibido en el COM';

		if(person){
			requirente = AsistenciaHelper.buildCovidRequirente(person);
			token.idPerson = person._id;
		}else{
			requirente = new Requirente();
			token.idPerson = '';
		}

		token.fecomp_txa = devutils.txFromDateTime(ts);
		token.fecomp_tsa = ts;

		token.action = action;
		token.slug = slug || '';
		token.sector = sector;
		token.requeridox = requirente;
		token.description = '';

		if(serial){
			token.compPrefix = serial.compPrefix ;
			token.compName = serial.compName;
			token.compNum = serial.pnumero + "";
		}else{
			token.compPrefix = 'SOL' ;
			token.compName = 'S/Asistencia';
			token.compNum = '';
		}

		token.ts_alta = ts;
		token.ts_fin = 0
		token.ts_prog = ts;
		token.estado = 'activo';
		token.avance = 'emitido';
		token.novedades = [ novedad ];

		return token;
	}

	static isAsistenciaRemitible(asistencia: Asistencia): boolean {
		let isRemitible = true;



		return isRemitible;
	}

	static getVoucherType(asistencia: Asistencia): VoucherType{
		let token = getOptListToken(this.getOptionlist('actions'), asistencia.action);
		if(!token) return null;

		let remitible = token.isRemitible;
		let payload = asistencia[token.key];

		if(!payload) remitible = false;

		let label = token.key === 'alimentos' ? 'Voucher alimentos' : 'Voucher productos';

		let voucherType = {
			type: asistencia.action,
			isRemitible: remitible,
			key: token.key,
			label: label,
			payload: payload,


		} as VoucherType;

		return voucherType;
	}



/*
		id:          string;
		type:        string = 'standard';
		periodo:     string = 'UNICO';
		fe_tsd:      number;
		fe_tsh:      number;
		fe_txd:      string;
		fe_txh:      string;
		freq:        string = 'mensual';
		qty:         number = 1;
		observacion: string;

*/

	static initNewAlimento(fe: string, fe_ts: number):Alimento{
		let alimento = new Alimento();
		alimento.fe_txd = fe;
		alimento.fe_txh = fe;
		alimento.fe_tsd = fe_ts;
		alimento.fe_tsh = fe_ts;
		return alimento;
	}

	static defaultQueryForTablero(): DashboardBrowse{
		let q = new DashboardBrowse();
		q.estado = "no_definido";
		q.avance = "no_definido";
		q.action = "no_definido";
		q.sector = "no_definido";

		return q;
	}





	static buildDataTable(list: Asistencia[]){

		return list.map(sol => {
			let td = new AsistenciaTable();
			td.asistenciaId = sol._id;
			td.compName = sol.compName;
			td.compNum = sol.compNum;
			td.personId = sol.idPerson;
			td.personSlug = sol.requeridox.slug;
			td.fecomp_tsa = sol.fecomp_tsa;
			td.fecomp_txa = sol.fecomp_txa;
			td.action = this.getOptionLabel('actions', sol.action);
			td.slug = sol.slug;
			td.description = sol.description;;
			td.sector = sol.sector;
			td.estado = sol.estado;
			td.avance = sol.avance;
			td.ts_alta = sol.ts_alta;

			if(sol.encuesta){
				td.fe_visita = sol.encuesta.fe_visita;
				td.fe_visita_ts = sol.encuesta.fe_visita_ts;
				td.ruta = sol.encuesta.ruta;
				td.trabajador = sol.encuesta.trabajador;
				td.trabajadorId = sol.encuesta.trabajadorId;
			}else{
				td.fe_visita = sol.fecomp_txa;
				td.fe_visita_ts = sol.fecomp_tsa;
				td.ruta = '';
				td.trabajador = '';
				td.trabajadorId = '';
			}

			return td;
		})

	}

}
