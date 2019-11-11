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
		type:        string = 'standard';
		periodo:     string = 'UNICO';
		fe_tsd:      number;
		fe_tsh:      number;
		fe_txd:      string;
		fe_txh:      string;
		freq:        string = 'mensual';
		qty:         number = 1;
		observacion: string;
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
		avance:       string = 'emitido';
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
        {val: 'encuesta',    type:'EncuestaSocAmb', label: 'Encuesta' },
        {val: 'alimentos',   type:'Alimentos',    label: 'Alimentos' },
        {val: 'habitacional',  type:'Habitacional',  label: 'Habitacional' },
        {val: 'sanitaria',  type:'Sanitaria',  label: 'Sanitaria' },
        {val: 'subsidio',    type:'Subsidio',     label: 'Subsidio' },
        {val: 'salud',       type:'Salud (RVI)',  label: 'Salud (RVI)' },
        {val: 'nutricion',   type:'Nutrición',    label: 'Nutrición' },
        {val: 'pension',     type:'Pensión',      label: 'Pensión' },
        {val: 'migracion',   type:'Desplazam habitat', label: 'Desplazamiento x zona inundable' },
        {val: 'no_definido', type:'Sin selección',  label: 'Sin selección' },

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
  ],

  discapacidad: [
    {val: 'discapacidad',   label: 'Discapacidad' },
  ],

  masvida: [
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  tsocial: [
    {val: 'alimentos',   label: 'Alimentos' },
    {val: 'encuesta',    label: 'Encuesta' },
    {val: 'sanitaria',   label: 'Sanitaria' },
    {val: 'habitat',     label: 'Habitat' },
  ],

  nutricion: [
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  inhumacion: [
    {val: 'inhumacion',  label: 'Inhumacion' },
  ],

  terceraedad: [
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  pensiones: [
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  familia: [
    {val: 'alimentos',   label: 'Alimentos' },
  ],

  referentebarrial: [
    {val: 'alimentos',    label: 'Alimentos' },
    {val: 'habitacional', label: 'Habitacional' },
  ],

  direccion: [
    {val: 'alimentos',   label: 'Alimentos' },
    {val: 'encuesta',    label: 'Encuesta' },
    {val: 'sanitaria',   label: 'Sanitaria' },
    {val: 'habitat',     label: 'Habitat' },
  ],

  habitat: [
    {val: 'habitat',     label: 'Habitat' },
  ],

  cimientos: [
    {val: 'cimientos',     label: 'Envión-Cimientos' },
  ],
}



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
      {val: 'entregado',    label: 'Entregado',      slug:'Entregado' },
      {val: 'autorizado',   label: 'Autorizado',    slug:'Autorizado' },
      {val: 'rechazado',    label: 'Rechazado',     slug:'Rechazado' },
      {val: 'programado',   label: 'Programado',    slug:'Programado' },
      {val: 'enejecucion',  label: 'En ejecución',  slug:'En ejecución' },
      {val: 'cumplido',     label: 'Cumplido',      slug:'Cumplido' },
]

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



const optionsLists = {
	 default: default_option_list,
   actions: asisActionOptList,
   comprobantes: comprobantesOptList,
   alimentos: alimentosTypeOptList,
   frecuencia: frecuenciaOptList,
   tableactions: tableActions,
   sectores: sectores,
   ciudades: ciudadesBrown,
   estado: estadosOptList,
   avance: avanceOptList,
   encuesta: avanceEncuestaOptList,
   urgencia: urgenciaOptList,
   periodo: periodoOptList
}


function getLabel(list, val){
		let t = list.find(item => item.val === val)
		return t ? t.label : val;
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

	let error = {
		valid: true,
		message: 'OK'
	};

	let countEntregas = 0;
	let expectedRaciones = asistencia.modalidad.qty;
	let expectedEntregas = expectedQty('periodo', asistencia.modalidad.periodo);
	let expectedFrecuencia = expectedQty('frecuencia', asistencia.modalidad.freq);

	let today = new Date();
	let mesActual = today.getMonth();
	if(today.getTime() < asistencia.modalidad.fe_tsd  || today.getTime() > asistencia.modalidad.fe_tsh ){
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

	static filterActiveAsistencias(list: Asistencia[]): Asistencia[]{
		if(!list || !list.length) return [];

		let filteredList = list.filter(t => {
			let valid = true;
			if(t.estado !== "activo"){
				valid = false;
				return valid;
			}

			// Alimentos
			let alimento = t.modalidad;
			if(alimento && alimento.fe_txd && alimento.fe_txh){

				if(!devutils.isWithinPeriod(alimento.fe_txd, alimento.fe_txh)) valid = false;

			}
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
		q.action = "alimentos";
		q.sector = "alimentos";
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
