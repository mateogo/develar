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
		kit:     string;
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


export class RemitoAlmacenTable {
		_id: string;
		compPrefix:  string = 'REM';
		compName:    string = 'R/Entrega';
		compNum:     string = '00000';
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
		kit:         string = 'Estándard';
		person:      string;
		parent: Parent;
		requeridox:  Requirente;
		atendidox:   Atendido;
		entregas:    Array<ItemAlmacen>;
};

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

export interface UpdateRemitoListEvent {
      action: string;
      type: string;
      items: Array<RemitoAlmacen>;
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
        {val:'L'            , label:'litro'},
        {val:'metro'        , label:'metro'},
        {val:'kilo'         , label:'kilo'},
        {val:'kg'           , label:'kilo'},
        {val:'lata'         , label:'lata'},
        {val:'otros'        , label:'otros'}
];



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

const tableActionsOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'entregar',     label: 'Entregar alimentos',    slug:'Entregar alimentos' },
]


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
   tableactions: tableActionsOptList,
   ume: umeOptList
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

		if(!val || !type) return 'no-definido';

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

	static buildDataTable(list: RemitoAlmacen[]){
		return list.map(token => {
			let td = new RemitoAlmacenTable();
			td._id        = token._id;
			td.compPrefix = token.compPrefix;
			td.compName   = token.compName;
			td.compNum    = token.compNum;
			td.qty        = token.qty;
			td.deposito   = token.deposito;
			td.tmov       = token.tmov;
			td.fecomp_tsa = token.fecomp_tsa;
			td.fecomp_txa = token.fecomp_txa;
			td.action     = token.action;
			td.slug       = token.slug;
			td.description = token.description;
			td.sector     = token.sector;
			td.estado     = token.estado;
			td.avance     = token.avance;
			td.parent     = token.parent;
			td.kitEntrega = (this.getOptionLabel('kitentrega',(token.kitEntrega || 'standard'))) || 'ESTÁNDAR';
			td.kit        = (token.parent && this.getOptionLabel('kitentrega',(token.parent.kit || 'standard'))) || 'ESTÁNDAR';
			td.person     = (token.requeridox && token.requeridox.slug) || 'beneficiario';
			td.requeridox = token.requeridox;
			td.atendidox  = token.atendidox;
			td.entregas   = token.entregas;
			return td;
		})

	}


}