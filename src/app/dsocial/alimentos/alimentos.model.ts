import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../dsocial.model';
import { Person }   from '../../entities/person/person';
import { Product, KitProduct } from '../../entities/products/product.model';
import { VoucherType } from '../asistencia/asistencia.model';
import { Asistencia, Pedido, ItemPedido  } from '../asistencia/asistencia.model';

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
		periodo:     string = 'UNICO';
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
	isKit: number = 0; // 0: es un item cargado a mano 1: item que deviene de KIT
	code: string;
	name: string;
	slug: string;
	ume: string;
	qty: number;

}

export class KitOptionList {
  val: string;
  label: string;
  kit: KitProduct;
}

export interface Tile {
		dia:      number;
		mes:      number;
		sem:      string;
		ciudad:   string;
		estado:   string;
		avance:   string;
		action:   string;
		sector:   string;
		tmov: string;
		deposito: string;
		cardinal: number;
		productId: string;
		code: string;
		name: string;
		ume: string;
		pclass: string;
		qty: number;
		id:       string;
}

export class DashboardBrowse {
		action:      string;
		sector:      string;
		estado:      string;
		avance:      string;
		fecharef?:   string;
}

export class RemitoalmacenBrowse {
		searchAction: string;
		fecomp_ts_d:        number;
		fecomp_ts_h:        number;
		action:      string;
		sector:      string;
		estado:      string;
		deposito:    string;
		avance:      string;
		fecharef?:   string;
		justCabecera?: boolean = false;

		constructor(){
		}
}

export class ProductosAlmacenTable {
		_id: string;
		sector:      string;
		action:      string;
		estado:      string = 'activo';
		avance:      string = 'emitido';
		deposito:      string = 'almacen';
		tmov:      string = 'entrega';
		code: string;
		name: string;
		ume: string;
		pclass: string;
		qty: number;
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
		dni:         string = 'dni';
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
	static initNewRemito(action, slug, sector, serial: Serial, person: Person, voucherType: VoucherType, kitEntrega?, qty?){
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
		token.kitEntrega = kitEntrega;
		token.qty = qty || 1;
		token.slug = slug;
		token.sector = sector;
		token.estado = 'pendiente';
		token.ts_alta = ts;
		token.ts_fin = 0
		token.ts_prog = ts;
		token.requeridox = requirente;

		return token;
	}


/****
	slug: string;

	kitItem: number = 0; // 0: es un item cargado a mano 1: item que deviene de KIT
	productId: string;
	code: string;
	name: string;
	ume: string;
	qty: number = 1;
	punitario: number = 0;


***/
	static bindItemListFromAsistencia(asistencia: Asistencia): ItemAlmacen[]{
		let itemList: ItemAlmacen[] = [];

		if(!(asistencia && asistencia.pedido && asistencia.pedido.items && asistencia.pedido.items.length)){
			return itemList;
		}

		let items = asistencia.pedido.items;

		itemList = items.map(t =>{
			return 	{
								productId: t.productId,
								isKit: 0,
								code: t.code,
								name: t.name,
								slug: t.slug,
								ume: t.ume,
								qty: t.qty,
							}
		});

		return itemList;
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

const avanceOptList = [
      {val: 'no_definido',  label: 'Sin selección',  slug:'Sin selección' },
      {val: 'emitido',      label: 'Emitido',       slug:'Emitida' },
      {val: 'entregado',    label: 'Entregado',     slug:'Entregado' },
      {val: 'anulado',      label: 'Anulado',       slug:'Anulado' },
]


const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];

const asisActionOptList: Array<any> = [
        {val: 'alimentos',   type:'Alimentos',    label: 'Alimentos' },
        {val: 'subsidio',    type:'Subsidio',     label: 'Subsidio' },
        {val: 'habitacional',  type:'Habitacional',   label: 'Habitacional' },

];

const alimentosTypeOptList: Array<any> = [
        {val: 'standard',   type:'Estándar',      label: 'Estándar' },
        {val: 'infante',    type:'Infante',       label: 'Infante' },
        {val: 'teredad',    type:'Adultos mayores',  label: 'Adultos mayores' },
        {val: 'celiaco',    type:'Celíacos',      label: 'Celíacos' },
        {val: 'comedor',    type:'Comedor comunitario', label: 'Comedor comunitario' },

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
        {val: 'teredad',    type:'Adultos mayores',  label: 'Adultos mayores' },
        {val: 'celiaco',    type:'Celíacos',      label: 'Celíacos' },
        {val: 'comedor',    type:'Comedor Comunitario', label: 'Comedor Comunitario' },
];

const depositosOptList = [
	{val: 'almacen',      type: 'Galpón',          label: 'Galpón'                    , locacion: 'erezcano',  telefono: '11 2222 3333'},
	{val: 'burzaco',      type: 'delegacion',      label: 'Del Burzaco',          locacion:	'9 de Julio y Roca', telefono: '4299-2273'},
	{val: 'claypole',     type: 'delegacion',      label: 'Del Claypole',         locacion:	'17 de Octubre 920',         telefono: '4291-1944'},
	{val: 'donorione',    type: 'delegacion',      label: 'CIC Don Orione',       locacion:	'Eva Perón y Río Colorado', telefono: '4268-5419'},
	{val: 'glew',         type: 'delegacion',      label: 'Del Glew',             locacion:	'Sarmiento y Alem',          telefono: '(02224)420792'},
	{val: 'josemarmol',   type: 'delegacion',      label: 'Del José Marmol',      locacion:	'Bynnon y 20 de Septiembre', telefono: '4291-1066'},
	{val: 'longchamps',   type: 'delegacion',      label: 'Cám Comer Longchamps',locacion:	'Burgward 1030',         telefono: '4293-4299'},
	{val: 'malvinas',     type: 'delegacion',      label: 'Del Malvinas Arg',     locacion:	'Policastro 2389',           telefono: '4297-8615'},
	{val: 'minrivadavia', type: 'delegacion',      label: 'Del Min Rivadavia',    locacion:	'25 de Mayo y Quiroga',      telefono: '4279-0052'},
	{val: 'rcalzada',     type: 'delegacion',      label: 'Del Rafael Calzada',   locacion:	'Guemes 1996',               telefono: '4291-1666'},
	{val: 'solano',       type: 'delegacion',      label: 'Del San Fco Solano',   locacion:	'Lirio 423',                 telefono: '4277-5203'},
	{val: 'sanjose',      type: 'delegacion',      label: 'Del San José',         locacion:	'Salta 1915',                telefono: '4211-1007'},
  
	{val: 'secretaria',   type: 'secretaria',      label: 'Secretaría Erézcano',                   locacion:	'Erézcano 1252',               telefono: '4293-4299'},
	{val: 'cicglew',      type: 'cic',             label: 'CIC Glew',      locacion:	'Garibaldi 220, entre Berutti y Lestrade',    telefono: '3740-0875'},
	{val: 'cicburzaco',   type: 'cid',             label: 'UFF Burzaco',   locacion:	'Cerretti y España - Burzaco', telefono: '4299-2273'},
	{val: 'cicmarmol',    type: 'cic',             label: 'CIC J. Marmol', locacion:	'Frías y San Luis',            telefono: '4291-1066'},
  
	{val: 'regionvi',     type:'Región VI-Lomas',  label: 'Región VI-Lomas' , locacion: 'erezcano',  telefono: '11 2222 3333'},
	{val: 'envio',        type:'Envío domicilio',  label: 'Envío domicilio' , locacion: 'erezcano',  telefono: '11 2222 3333'},
  
	{val: 'proveedor',    type:'Proveedor',        label: 'Proveedor'       , locacion: 'erezcano',  telefono: '11 2222 3333'},
	{val: 'otro',         type:'Otro',             label: 'Otro'            , locacion: 'erezcano',  telefono: '11 2222 3333'},
	{val: 'no_definido',  type:'Sin selección',    label: 'Sin selección' },
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

const tableroActionsOptList = [
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
		default: default_option_list,
		actions: asisActionOptList,
		comprobantes: comprobantesOptList,
		alimentos: alimentosTypeOptList,
		frecuencia: frecuenciaOptList,
		kitentrega: kitEntregaOptList,
		depositos: depositosOptList,
		kititems: productByKit,
		tmov: tmovOptList,
		tableactions: tableActionsOptList,
		tableroactions: tableroActionsOptList,
		ume: umeOptList,
		avance: avanceOptList
};


function getLabel(list, val){
		let t = list.find(item => item.val === val)
		return t ? t.label : val;
}


export class AlimentosHelper {

	static getOptionlist(type){
		return optionsLists[type] || optionsLists['default'];
	}

	static getKitItems(type, val ){
		return   optionsLists[type][val] || [];
	}

	static getOptionLabel(type, val){
		if(!val) return 'no-definido';
		if(!type) return val;
		return getLabel(this.getOptionlist(type), val);
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


	static tileToTableData(token: Tile): ProductosAlmacenTable{
		let td = new ProductosAlmacenTable();
		td.sector = token.sector;
		td.action = token.action;
		td.estado = token.estado;
		td.avance = token.avance;
		td.deposito = token.deposito;
		td.tmov = token.tmov;
		td.code = token.code;
		td.name = token.name;
		td.ume = token.ume;
		td.pclass = token.pclass;
		td.qty = token.qty;
		td._id = token.productId;
		return td;
	
	}

	static buildTableroTable(list: Tile[]){
		return list.map(token => {
			let td = new ProductosAlmacenTable();

			td.sector = token.sector;
			td.action = token.action;
			td.estado = token.estado;
			td.avance = token.avance;
			td.deposito = token.deposito;
			td.tmov = token.tmov;
			td.code = token.code;
			td.name = token.name;
			td.pclass = token.pclass;
			td.ume = token.ume;
			td.qty = token.qty;
			td._id = token.productId;
			return td;

		})
	}


	static buildDataTable(list: RemitoAlmacen[]){
		return list.map(token => {
			let td = new RemitoAlmacenTable();
			td._id        = token._id;
			td.compPrefix = token.compPrefix;
			td.compName   = token.compName;
			td.compNum    = token.compNum;
			td.qty        = token.qty;
			td.deposito   = this.getOptionLabel('depositos', token.deposito);
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
			td.dni        = (token.requeridox && token.requeridox.ndoc) || 'dni';
			td.requeridox = token.requeridox;
			td.atendidox  = token.atendidox;
			td.entregas   = token.entregas;
			return td;
		})

	}

	static defaultQueryForTablero(): DashboardBrowse{
		let q = new DashboardBrowse();
		q.estado = "no_definido";
		q.avance = "no_definido";
		q.action = "no_definido";
		q.sector = "no_definido";

		return q;
	}

	static defaultQueryForAlmacen(): RemitoalmacenBrowse{
		let q = new RemitoalmacenBrowse();
		q.estado = "no_definido";
		q.avance = "no_definido";
		q.action = "no_definido";
		q.sector = "no_definido";
		q.searchAction = 'search';

		return q;
	}


}
