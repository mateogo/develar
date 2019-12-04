import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../dsocial.model';
import { Person }   from '../../entities/person/person';
import { sectores } from '../dsocial.model';
import { RemitoAlmacen } from '../alimentos/alimentos.model';

export class Requirente {
		id:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string; 
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

export class Asistencia {
		_id: string;
		compPrefix:  string = 'SOL';
		compName:    string = 'S/Asistencia';
		compNum:     string = '00000';
		idPerson:    string;
		idbrown:     string;
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


const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];

const asisActionOptList: Array<any> = [
        {val: 'no_definido',    isRemitible: false, key:'',          type:'Sin selección',     label: 'Sin selección' },
        {val: 'alimentos',      isRemitible: true,  key:'modalidad', type:'Alimentos',         label: 'Alimentos' },
        {val: 'sanitaria',      isRemitible: true,  key:'pedido',    type:'Sanitaria',         label: 'Sanitaria' },
        {val: 'habitacional',   isRemitible: true,  key:'pedido',    type:'Habitacional',      label: 'Habitacional' },
        {val: 'encuesta',       isRemitible: false, key:'',          type:'InformeSocAmb',     label: 'Informe S/Ambiental (en domiciliio)' },
        {val: 'informese',      isRemitible: false, key:'',          type:'InformeSocEco',     label: 'Informe S/Económico (en sede)' },
        {val: 'relocalizacion', isRemitible: false, key:'',          type:'Relocalización',    label: 'Relocalización' },
        {val: 'subsidio',       isRemitible: false, key:'',          type:'Subsidio',          label: 'Subsidio' },
        {val: 'salud',          isRemitible: true,  key:'pedido',    type:'Salud (RVI)',       label: 'Salud (RVI)' },
        {val: 'nutricion',      isRemitible: true,  key:'pedido',    type:'Nutrición',         label: 'Nutrición' },
        {val: 'pension',        isRemitible: false, key:'',          type:'Pensión',           label: 'Pensión' },
        {val: 'migracion',      isRemitible: false, key:'',          type:'Desplazam habitat', label: 'Desplazamiento x zona inundable' },

];

const pedidosTypeOptList: Array<any> = [
        {val: 'alimentos',    type:'Alimentos',     label: 'Alimentos' },
        {val: 'habitacional', type:'Habitacional',  label: 'Habitacional' },
        {val: 'sanitaria',    type:'Sanitaria',     label: 'Sanitaria' },
        {val: 'nutricion',    type:'Nutrición',     label: 'Nutrición' },
        {val: 'no_definido',  type:'Sin selección', label: 'Sin selección' },
];

const entregaDesdeOptList: Array<any> = [
        {val: 'galpon',       type:'Galpón',     label: 'Galpón' },
        {val: 'proveedor',    type:'Proveedor',  label: 'Proveedor' },
        {val: 'secretaria',    type:'Secretaría',  label: 'Secretaría' },
        {val: 'regionvi',     type:'Región VI-Lomas',  label: 'Región VI-Lomas' },
        {val: 'envio',        type:'Envío domicilio',     label: 'Envío domicilio' },
        {val: 'otro',         type:'Otro',     label: 'Otro' },
        {val: 'no_definido',  type:'Sin selección', label: 'Sin selección' },
];

const causasOptList: Array<any> = [
        {val: 'incendio',       type:'Incendio',     label: 'Incendio' },
        {val: 'emergencia',     type:'Emergencia',  label: 'Emergencia' },
        {val: 'estudios',       type:'Requiere estudios',     label: 'Requiere estudios' },
        {val: 'vision',         type:'Problema de visión',     label: 'Problema de visión' },
        {val: 'discapacidad',   type:'Discapacidad',     label: 'Discapacidad' },
        {val: 'bajopeso',       type:'Bajo peso',     label: 'Bajo peso' },
        {val: 'enfermedad',     type:'Enfermedad',     label: 'Enfermedad' },
        {val: 'otro',           type:'Otro',     label: 'Otro' },
        {val: 'no_definido',    type:'Sin selección', label: 'Sin selección' },
];


/**

			{val:'alimentos',    serial:'alimentos',   label: 'Alimentos',         style: {'background-color': "#f2cded"}},
			{val:'regionvi',     serial:'regionvi',    label: 'Región VI',         style: {'background-color': "#f2aded"}},
			{val:'discapacidad', serial:'discapacidad',label: 'Discapacidad',      style: {'background-color': "#f2bded"}}, 
			{val:'masvida',      serial:'masvida',     label: 'Plan MasVida',      style: {'background-color': "#f2cded"}},
			{val:'tsocial',      serial:'tsocial',     label: 'Trabajador/a Social', style: {'background-color': "#f2cded"}},
			{val:'nutricion',    serial:'nutricion',   label: 'Nutrición',         style: {'background-color': "#f2dded"}},
			{val:'inhumacion',   serial:'inhumacion',  label: 'Inhumación',        style: {'background-color': "#f2dded"}},
			{val:'terceraedad',  serial:'terceraedad', label: 'Adultos mayores',      style: {'background-color': "#f2dded"}},
			{val:'pensiones',    serial:'pensiones',   label: 'Pensiones',         style: {'background-color': "#f2dded"}},
			{val:'familia',      serial:'familia',     label: 'Acomp. Integral de Familia',  style: {'background-color': "#f2dded"}},
			{val:'referentebarrial',   serial:'referentebarrial',   label: 'Referente Barrial',   style: {'background-color': "#f2dded"}},
			{val:'direccion',    serial:'direccion',   label: 'Atención Especial', style: {'background-color': "#f2dded"}},
			{val:'habitat',      serial:'habitat',     label: 'Habitat',           style: {'background-color': "#f2dded"}},


**/


const sector_actionRelation = {
  alimentos: [
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  regionvi: [
    {val: 'sanitaria',   label: 'Sanitaria' },
    {val: 'alimentos',   label: 'Alimentos' },
    {val: 'salud',       label: 'Salud' },
  ],

  discapacidad: [
    {val: 'discapacidad',   label: 'Discapacidad' },
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  masvida: [
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  tsocial: [
    {val: 'alimentos',   label: 'Alimentos' },
    {val: 'sanitaria',   label: 'Sanitaria' },
    {val: 'habitacional', label: 'Habitacional' },
    {val: 'encuesta',    label: 'Informe S/Ambiental en domicilio' },
    {val: 'informese',   label: 'Relevam S/Econom en sede' },
  ],

  nutricion: [
    {val: 'nutricion',   label: 'Nutrición' },
    {val: 'alimentos',   label: 'Alimentos' },
    {val: 'sanitaria',   label: 'Sanitaria' },
  ],

  inhumacion: [
    {val: 'inhumacion',  label: 'Inhumacion' },
  ],

  terceraedad: [
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  pensiones: [
    {val: 'pension',     label: 'Tramitación pensión' },
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  familia: [
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  referentebarrial: [
    {val: 'alimentos',    label: 'Alimentos' },
    {val: 'habitacional', label: 'Habitacional' },
    {val: 'sanitaria',    label: 'Sanitaria' },
  ],

  direccion: [
    {val: 'alimentos',    label: 'Alimentos' },
    {val: 'sanitaria',    label: 'Sanitaria' },
    {val: 'habitacional', label: 'Habitacional' },
    {val: 'encuesta',     label: 'Informe S/Ambiental en domicilio' },
    {val: 'informese',    label: 'Relevam S/Econom en sede' },
  ],

  habitat: [
    {val: 'relocalizacion', label: 'Relocalización' },
    {val: 'habitacional',   label: 'Habitacional' },
    {val: 'alimentos',      label: 'Alimentos' },
    {val: 'sanitaria',      label: 'Sanitaria' },
    {val: 'encuesta',       label: 'Informe S/Ambiental en domicilio' },
    {val: 'informese',      label: 'Relevam S/Econom en sede' },
  ],

  cimientos: [
    {val: 'cimientos',     label: 'Envión-Cimientos' },
    {val: 'alimentos',    label: 'Alimentos' },
  ],

 subsidios: [
    {val: 'subsidio',     label: 'Tramitación subsidio' },
    {val: 'alimentos',    label: 'Alimentos' },
  ],
}


const followUpOptList: Array<any> = [  
        {val: 'no_definido',  label: 'No definido',  slug:'Seleccione opción' },
        {val: 'tsocial',       label: 'TS',           slug:'TS' },
        {val: 'habitat',       label: 'Habitat',      slug:'Habitat' },
 ];


const alimentosTypeOptList: Array<any> = [
        {val: 'standard',   type:'Estándar',      label: 'Estándar' },
        {val: 'infante',    type:'Infante',       label: 'Infante' },
        {val: 'teredad',    type:'Adultos mayores',  label: 'Adultos mayores' },
        {val: 'celiaco',    type:'Celíacos',      label: 'Celíacos' },
        {val: 'comedor',    type:'Comedor Comunitario', label: 'Comedor Comunitario' },
        {val: 'no_definido', type:'Sin selección',  label: 'Sin selección' },

];

const comprobantesOptList: Array<any> = [
        {val: 'sasistencia',   type:'S/Asistencia',    label: 'S/Asistencia' },
        {val: 'valimentos',    type:'V/Alimentos',     label: 'V/Alimentos' },
        {val: 'vmateriales',   type:'V/Materiales',   label: 'V/Materiales' },
        {val: 'ssubsidios',    type:'S/Subsidio',   label: 'S/Subsidio' },
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
    {val: 'activo',   label: 'Activa' },
  ],

  entregado: [
    {val: 'activo',   label: 'Activa' },
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  enejecucion: [
    {val: 'activo',   label: 'Activa' },
  ],

  aprobado: [
    {val: 'activo',   label: 'Activa' },
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  autorizado: [
    {val: 'activo',   label: 'Activa' },
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  cumplido: [
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  pendiente: [
    {val: 'activo',   label: 'Activa' },
    {val: 'suspendido',   label: 'Suspendido' },
  ],

  programado: [
    {val: 'activo',   label: 'Activa' },
  ],

  derivadoVI: [
    {val: 'activo',   label: 'Activa' },
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  rechazado: [
    {val: 'activo',   label: 'Activa' },
    {val: 'suspendido',   label: 'Suspendido' },
    {val: 'baja',   label: 'Baja' },
  ],

  incumplido: [
    {val: 'suspendido',   label: 'Suspendido' },
    {val: 'baja',   label: 'Baja' },
  ],

  devuelto: [
    {val: 'activo',   label: 'Activa' },
    {val: 'suspendido',   label: 'Suspendido' },
    {val: 'baja',   label: 'Baja' },
  ],

  incompleto: [
    {val: 'activo',   label: 'Activa' },
    {val: 'suspendido',   label: 'Suspendido' },
    {val: 'baja',   label: 'Baja' },
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
   causa: causasOptList
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


function validateFlujoEntregas(asistencia: Asistencia, entregas: RemitoAlmacen[]):any{
	let entregasMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
	let expectedEntregas;
	let expectedFrecuencia;
	let fe_tsd = 0;
	let fe_tsh = 0;
	let expectedRaciones = 0;


	let error = {
		valid: true,
		message: 'OK'
	};

	let today = new Date();
	let mesActual = today.getMonth();

	let countEntregas = 0;

	if(asistencia.action === 'habitat') asistencia.action = 'habitacional';
	let voucherType = AsistenciaHelper.getVoucherType(asistencia)

	if(voucherType.key === 'modalidad'){
		expectedEntregas = expectedQty('periodo', asistencia.modalidad.periodo);
		expectedFrecuencia = expectedQty('frecuencia', asistencia.modalidad.freq);
		fe_tsd = asistencia.modalidad.fe_tsd
		fe_tsh = asistencia.modalidad.fe_tsh
		expectedRaciones = asistencia.modalidad.qty;

	}else{
		expectedEntregas = expectedQty('periodo', asistencia.pedido.modalidad.periodo);
		expectedFrecuencia = expectedQty('frecuencia', asistencia.pedido.modalidad.freq);
		fe_tsd = asistencia.pedido.modalidad.fe_tsd
		fe_tsh = asistencia.pedido.modalidad.fe_tsh
		expectedRaciones = asistencia.pedido.kitQty;

	}

	if(today.getTime() < fe_tsd  || today.getTime() > fe_tsh ){
		error['valid'] = false;
		error['message'] ='Período de entregas vencido';
		return error;
	}

	entregas.forEach(t => {
		countEntregas += t.qty;
		let mes = new Date(t.fecomp_tsa).getMonth();
		entregasMes[mes] += t.qty;
	})

	if(entregasMes[mesActual] >= expectedFrecuencia * expectedRaciones){
		error['valid'] = false;
		error['message'] ='Excede entregas del período';
		return error;
	}

	if(countEntregas >= expectedFrecuencia * expectedEntregas * expectedRaciones){
		error['valid'] = false;
		error['message'] ='Excede cantidad de entregas';
		return error;
	}


	return error;
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
		let req:Requirente = {
			id:   person._id ,
			slug: person.displayName ,
			tdoc: person.tdoc ,
			ndoc: person.ndoc 
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

  static checkVoucherConditions(asistencia: Asistencia, entregas: RemitoAlmacen[] ): any{
  	//ToDo
  	let anteriores: RemitoAlmacen[] = [];
  	let valid = {message: 'OK', valid: true};

  	entregas.forEach(t =>{
  		if(t.parentId === asistencia._id){
  			anteriores.push(t);
  		}
  	});

  	if(anteriores && anteriores.length){

  		valid = validateFlujoEntregas(asistencia, anteriores)
  	}


  	return valid;
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
		token.avance = 'emitido'

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
