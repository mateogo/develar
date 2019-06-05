import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../dsocial.model';
import { Person }   from '../../entities/person/person';
import { Product } from '../../entities/products/product.model';

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

export class Parent {
		id:      string;
		type:    string;
		action:  string;
		compNum: string;

}

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
export class ItemAlmacen {
	productId: string;
	qty: number;
	ume: string;
	slug: string;

}


export class RemitoAlmacen {
		_id: string;
		compPrefix:  string = 'REM';
		compName:    string = 'R/Entrega';
		compNum:     string = '00000';
		personId:    string;
		parentId:    string;
		kitEntrega:  string;
		qty:         number = 1; 
		deposito:    string = 'almacen';
		tmov:        string = 'entrega';
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
		parent: Parent;
		requeridox:  Requirente;
		atendidox:   Atendido;
		entregas:    Array<ItemAlmacen>;
};

export interface UpdateRemitoEvent {
	action: string;
	type: string;
	token: RemitoAlmacen;
};



export class RemitoAlmacenModel {
	static initNewRemito(action, slug, sector, serial: Serial, person: Person){
		let ts = Date.now();
		let requirente = new Requirente();
		requirente.id = person._id;
		requirente.slug = person.displayName;
		requirente.tdoc = person.tdoc;
		requirente.ndoc = person.ndoc;

		let token = new RemitoAlmacen();
		if(serial){
			token.compPrefix = serial.compPrefix ;
			token.compName = serial.compName;
			token.compNum = serial.pnumero + "";
		}

		token.action = action;
		token.slug = slug;
		token.sector = sector;
		token.estado = 'pendiente';
		token.ts_alta = ts;
		token.ts_fin = 0
		token.ts_prog = ts;
		token.requeridox = requirente;

		return token;
	}

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
        {val: 'alimentos',   type:'Alimentos',    label: 'Alimentos' },
        {val: 'subsidio',    type:'Subsidio',     label: 'Subsidio' },
        {val: 'materiales',  type:'Materiales',   label: 'Materiales' },

];

const alimentosTypeOptList: Array<any> = [
        {val: 'standard',   type:'Estándar',      label: 'Estándar' },
        {val: 'infante',    type:'Infante',       label: 'Infante' },
        {val: 'teredad',    type:'Tercera Edad',  label: 'Tercera Edad' },
        {val: 'celiaco',    type:'Celíacos',      label: 'Celíacos' },
        {val: 'comedor',    type:'Comedor Comunitario', label: 'Comedor Comunitario' },

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

const kitEntregaOptList: Array<any> = [
        {val: 'standard',   type:'Estándar',      label: 'Estándar' },
        {val: 'infante',    type:'Infante',       label: 'Infante' },
        {val: 'teredad',    type:'Tercera Edad',  label: 'Tercera Edad' },
        {val: 'celiaco',    type:'Celíacos',      label: 'Celíacos' },
        {val: 'comedor',    type:'Comedor Comunitario', label: 'Comedor Comunitario' },
];

const productByKit = {
	standard: [
			{val: 'arroz',  id:'101',  slug:'Arroz 1kg',            ume:'kg', qty: 1},
			{val: 'fideos', id:'102',  slug:'Fideos de sémola 1kg', ume:'kg', qty: 2},
			{val: 'leche',  id:'103',  slug:'Leche sachet',         ume:'L',  qty: 2},
	],
	infante: [
			{val: 'atun',      id:'201',  slug:'Atún al agua',          ume:'lata', qty: 1},
			{val: 'papilla',   id:'202',  slug:'Nestún  ',              ume:'kg', qty: 2},
			{val: 'lechebebe', id:'203',  slug:'Leche Infante',         ume:'L',  qty: 2},
	],
	teredad: [
			{val: 'arroz',   id:'301',   slug:'Arroz 1kg',            ume:'kg', qty: 1},
			{val: 'fideos',  id:'302',   slug:'Fideos de sémola 1kg', ume:'kg', qty: 2},
			{val: 'leche',   id:'303',   slug:'Leche sachet',         ume:'L',  qty: 2},
	],
	celiaco: [
			{val: 'arroz',    id:'401',  slug:'Arroz 1kg',            ume:'kg', qty: 1},
			{val: 'fideos',   id:'402',  slug:'Fideos de sémola 1kg', ume:'kg', qty: 2},
			{val: 'leche',    id:'403',  slug:'Leche sachet',         ume:'L',  qty: 2},
	],
	comedor: [
			{val: 'arroz',   id:'501',   slug:'Arroz 1kg',            ume:'kg', qty: 1},
			{val: 'fideos',  id:'502',   slug:'Fideos de sémola 1kg', ume:'kg', qty: 2},
			{val: 'leche',   id:'503',   slug:'Leche sachet',         ume:'L',  qty: 2},
	]

}

const tmovOptList: Array<any> = [
        {val: 'entrega',        type:'S',  label: 'Entrega' },
        {val: 'ingreso',        type:'E',  label: 'Ingreso' },
        {val: 'transferencia',  type:'M',  label: 'Transf depósito' },
        {val: 'deventrega',     type:'E',  label: 'Dev entrega' },
        {val: 'devingreso',     type:'S',  label: 'Dev ingreso' },
];

const optionsLists = {
   actions: asisActionOptList,
   comprobantes: comprobantesOptList,
   alimentos: alimentosTypeOptList,
   frecuencia: frecuenciaOptList,
   kitentrega: kitEntregaOptList,
   kititems: productByKit,
   tmov: tmovOptList,
};


function getLabel(list, val){
    return (list.find(item => item.val === val).label || val);
}


export class AlimentosHelper {
	static getOptionlist(type){
		if(optionsLists[type]){
			return optionsLists[type];

		}else{
			return default_option_list;

		}
	}

	static getKitItems(type, val ){
		return   optionsLists[type][val] || [];
	}

	static getOptionLabel(type, val){
		let list = this.getOptionlist(type);
		return getLabel(list, val);
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


}
