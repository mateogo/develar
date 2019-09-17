import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../dsocial.model';
import { Person }   from '../../entities/person/person';
import { sectores } from '../dsocial.model';

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

export class Alimento {
		id:          string;
		type:        string;
		fe_tsd:      number;
		fe_tsh:      number;
		fe_txd:      string;
		fe_txh:      string;
		freq:        number;
		qty:         number;
		observacion: string;
};

export class Encuesta {
		id:          string;
		fe_visita: string;
		fe_visita_ts: number;
		locacionId: string;
		ruta:        string;
		trabajador:  string;
		trabajadorId: string;

		preparacion: string;
		estado:      string = 'activo';
		avance:      string = 'emitido';
		evaluacion: string;

};

export class Asistencia {
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
		avance:      string = 'emitido';
		fe_visita:   string;
		ruta:        string;
		trabajadorId: string;
		avance_encuesta: string;
}

export interface AsistenciaAction {
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
        {val: 'materiales',  type:'Materiales',   label: 'Materiales' },
        {val: 'subsidio',    type:'Subsidio',     label: 'Subsidio' },
        {val: 'salud',       type:'Salud (RVI)',  label: 'Salud (RVI)' },
        {val: 'nutricion',   type:'Nutrición',    label: 'Nutrición' },
        {val: 'pension',     type:'Pensión',      label: 'Pensión' },
        {val: 'no_definido', type:'No definida',  label: 'No definida' },

];

const alimentosTypeOptList: Array<any> = [
        {val: 'standard',   type:'Estándar',      label: 'Estándar' },
        {val: 'infante',    type:'Infante',       label: 'Infante' },
        {val: 'teredad',    type:'Tercera Edad',  label: 'Tercera Edad' },
        {val: 'celiaco',    type:'Celíacos',      label: 'Celíacos' },
        {val: 'comedor',    type:'Comedor Comunitario', label: 'Comedor Comunitario' },
        {val: 'no_definido', type:'No definida',  label: 'No definida' },

];

const comprobantesOptList: Array<any> = [
        {val: 'sasistencia',   type:'S/Asistencia',    label: 'S/Asistencia' },
        {val: 'valimentos',    type:'V/Alimentos',     label: 'V/Alimentos' },
        {val: 'vmateriales',   type:'V/Materiales',   label: 'V/Materiales' },
        {val: 'ssubsidios',    type:'S/Subsidio',   label: 'S/Subsidio' },
];

const frecuenciaOptList: Array<any> = [
        {val: 'diaria',    type:'Diaria',           label: 'Diaria' },
        {val: 'semanal',   type:'Semanal',          label: 'Semanal' },
        {val: 'quincenal', type:'Quincenal',        label: 'Quincenal' },
        {val: 'mensual',   type:'Mensual',          label: 'Mensual' },
        {val: 'unica',     type:'Vez única',        label: 'Vez única' },
        {val: 'arequerim', type:'A requerimiento',  label: 'A requerimiento' },
];

const tableActions = [
      {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'autorizar',      label: 'Autorizar solicitud',    slug:'Autorizar solicitud' },
]

const estadosOptList = [
      {val: 'no_definido',    label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'activo',      label: 'Activa',      slug:'Activa' },
      {val: 'cumplido',    label: 'Cumplida',    slug:'Cumplida' },
      {val: 'suspendida',  label: 'Suspendida',  slug:'Suspendida' },
      {val: 'baja',        label: 'Baja',        slug:'Baja' },
]

const avanceOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'emitido',      label: 'Emitida',       slug:'Emitida' },
      {val: 'autorizado',   label: 'Autorizado',    slug:'Autorizado' },
      {val: 'rechazado',    label: 'Rechazado',     slug:'Rechazado' },
      {val: 'programado',   label: 'Programado',    slug:'Programado' },
      {val: 'enejecucion',  label: 'En ejecución',  slug:'En ejecución' },
      {val: 'cumplido',     label: 'Cumplido',      slug:'Cumplido' },
]

const avanceEncuestaOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
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
   encuesta: avanceEncuestaOptList
}


function getLabel(list, val){
		if(!list || !val) return '';
    return (list.find(item => item.val === val).label || val);
}

function getPrefixedLabel(list, prefix, val){
		let label = getLabel(list, val);
		if(label) {
			label = prefix + '::' + label;
		}
		return label;
}

export class AsistenciaHelper {

	static getOptionlist(type){
		return optionsLists[type] || optionsLists['default'];
	}

	static getOptionLabel(type, val){
		let list = this.getOptionlist(type);
		return getLabel(list, val);
	}

	static getPrefixedOptionLabel(type, prefix, val){
		let list = this.getOptionlist(type);
		return getPrefixedLabel(list, prefix, val);
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

	static initNewAsistenciaDeprecated(type ): Asistencia{
		let token = new Asistencia();
		if(type === 'alimentos'){
			token.modalidad = new Alimento();


		} else if(type === 'subsidio'){

		}

		return token;
	}

	static initNewAsistencia(action, sector, person?: Person, serial?: Serial, slug?){
		let ts = Date.now();
		let requirente = new Requirente();

		if(person){
			requirente.id = person._id;
			requirente.slug = person.displayName;
			requirente.tdoc = person.tdoc;
			requirente.ndoc = person.ndoc;
		}


		let token = new Asistencia();
		token.action = action;
		token.slug = slug || '';
		token.sector = sector;
		token.requeridox = requirente;

		if(serial){
			token.compPrefix = serial.compPrefix ;
			token.compName = serial.compName;
			token.compNum = serial.pnumero + "";
		}

		token.ts_alta = ts;
		token.ts_fin = 0
		token.ts_prog = ts;

		return token;
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
