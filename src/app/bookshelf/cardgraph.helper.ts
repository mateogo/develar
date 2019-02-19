import { RecordCard, SubCard, SelectData, cardHelper } from './recordcard';

/****************************************/
/**            CardGraph                */
/****************************************/
export interface CardGraph {
	displayAs: string;
	slug: string;
	predicate: string;
	avatar: string;
	description: string;
	entityId: string;
	entity: string;
}

class CardGraphBasae implements CardGraph {
	entity: string = "";
	displayAs: string = "";
	predicate: string = "";
	slug: string = "";
	description: string = "";
	avatar: string = "";
	entityId: string = "";
	constructor( type){
		this.entity = type;
	}	
}

class CardGraphPerson extends CardGraphBasae {
	entity: string;
	displayAs: string = "";
	predicate: string = "";
	slug: string = "";
	description: string = "";
	avatar: string = "";
	entityId: string = "";
	constructor(name?, predicate?){
		super('person');
		this.displayAs = name || this.displayAs;
		this.predicate = predicate || this.predicate;
	}	
}

export class CardGraphProduct extends CardGraphBasae {
	displayAs: string = "";
	slug: string = "";
	predicate: string = "";
	avatar: string = "";
	description: string = "";
	entity: string;
	entityId: string = "";

	qt: number = 0;
	ume: string = "unidad";
	freq: number = 1;
	fume: string = "unidad";
	pu: number = 0;
	fenec: Date; 
	fenectx: string;
	moneda: string = "ARS";
	countries: Array<string> = [];
	stages: Array<string> = [];
	milestoneId: string = "";
	goals: Array<string> = [];

	constructor(name?, predicate?){
		super('product');
		this.displayAs = name || this.displayAs;
		this.predicate = predicate || this.predicate;
	}	
}


class CardGraphResource extends CardGraphBasae {
	entity: string;
	displayAs: string = "";
	predicate: string = "enlace";
	slug: string = "";
	description: string = "";
	avatar: string = "";
	entityId: string = "";
	constructor(link?, predicate?){
		super('resource');
		this.entityId = link || this.entityId;
		this.predicate = predicate || this.predicate;
	}	
}

class CardGraphAsset extends CardGraphBasae {
	entity: string;
	displayAs: string = "";
	predicate: string = "documento";
	slug: string = "";
	description: string = "";
	avatar: string = "";
	entityId: string = "";
	constructor(link?, predicate?){
		super('asset');
		this.entityId = link || this.entityId;
		this.predicate = predicate || this.predicate;
	}	
}

class CardGraphImage extends CardGraphBasae {
	entity: string;
	displayAs: string = "";
	predicate: string = "mainimage";
	slug: string = "";
	description: string = "";
	avatar: string = "";
	entityId: string = "";
	constructor(link?, predicate?){
		super('image');
		this.entityId = link || this.entityId;
		this.predicate = predicate || this.predicate;
	}	
}


export interface ProductTable{
	predicate: string;
	predicateTx: string;
	displayAs: string;
	slug: string;
	entityId: string;
	milestoneId: string;
	qt: number;
	ume: string;
	freq: number;
	fume: string;
	pu: number;
	moneda: string;
	total: number;
	ars: number;
	usd: number;
	eur: number;
	brl: number;
}


class ProductTableData implements ProductTable{
	_id: string = "";
	predicate: string = "";
	predicateTx: string = "";
	displayAs: string = "";
	slug: string = "";
	entityId: string = "";
	freq: number = 1;
	fume: string = "unidad";
	qt: number = 0;
	ume: string = "";
	pu: number = 0;
	moneda: string = "";
	fumetx: string = "";
	qtx: string = "";
	total: number;
	ars: number;
	usd: number;
	eur: number;
	brl: number;
	milestoneId: string = "";
	milestoneLabel: string = ""
	editflds = [0,0,0,0,0,0,0,0]
	constructor(data: any,  milestones: Array<SelectData>){
		this._id = data._id;
		this.predicate = data.predicate;
		this.predicateTx = predicateLabel('product', data.predicate);
		this.displayAs = data.displayAs;
		this.slug = data.slug;
		this.entityId = data.entityId;
		this.qt = data.qt|| 0;
		this.ume = data.ume || 'unidad';
		this.freq = data.freq || 1;
		this.fume = data.fume || 'unidad';
		this.pu = data.pu || 0;
		this.moneda = data.moneda;
		this.total = data.total || this.qt * this.freq * this.pu; 
		this.milestoneId = data.milestoneId || "";
		this.milestoneLabel = graphUtilities.getMilestoneLabel(milestones, this.milestoneId);
		this.fumetx = fumeList.find(item => item.val === this.fume).label;
		this.qtx = umeTx(this.ume, this.fume, this.fumetx, this.qt, this.freq);
		this.ars = this.moneda === 'ARS' ? this.total : 0;
		this.usd = this.moneda === 'USD' ? this.total : 0;
		this.brl = this.moneda === 'BRL' ? this.total : 0;
		this.eur = this.moneda === 'EUR' ? this.total : 0;
	}	
}


export const predicateLabels = {
	default:{
		formTitle: 'Elementos relacionados',
		formAddLabel: 'Agregar nueva relación'
	},
	person:{
		formTitle: 'Personas relacionadas',
		formAddLabel: 'Agregar nueva relación a persona'
	},
	product:{
		formTitle: 'Productos/ Objetivos relacionadas',
		formAddLabel: 'Agregar nueva relación a producto'
	},
	resource: {
		formTitle: 'Enlaces relacionados (URL)',
		formAddLabel: 'Agregar nuevo enlace a recurso digital'
	},
	asset: {
		formTitle: 'Recursos relacionados',
		formAddLabel: 'Agregar nuevo objeto digital'
	},
	image: {
		formTitle: 'Imágenes relacionadas',
		formAddLabel: 'Agregar nueva imagen'
	}


}


export const predicateType = {
	person: {
		predicates: [
			{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
			{val: 'autor',          label: 'Autor',              slug:'Autor' },
			{val: 'coautor',        label: 'Co-Autor',           slug:'Co-Autor' },
			{val: 'revisor',        label: 'Revisor',            slug:'Revisor' },
			{val: 'traductor',      label: 'Traductor',          slug:'Traductor' },
			{val: 'fichacv',        label: 'Ficha Curriculum',   slug:'Ficha Curriculum' },
			{val: 'client',         label: 'Cliente',            slug:'Cliente' },
			{val: 'referral',       label: 'Referencia',         slug:'Referencia' },
			{val: 'sponsor',        label: 'Sponsor',            slug:'Sponsor' },
			{val: 'cro',            label: 'Productor',          slug:'Productor' },
			{val: 'contacto',       label: 'Contacto',           slug:'contacto' },
			{val: 'director',       label: 'Director',           slug:'director' },
			{val: 'prjleader',      label: 'Project leader',     slug:'prjleader' },
			{val: 'qa',             label: 'Analista calidad',   slug:'Analista calidad' },
			{val: 'autorizante',    label: 'Autorizante',        slug:'Autorizante' },
			{val: 'citado',         label: 'Citado',             slug:'Citado' },
			{val: 'editor',         label: 'Editor',             slug:'Editor' },
			{val: 'stakeholer',     label: 'Interesado',         slug:'Interesado/ stakeholder' },
			{val: 'productor',      label: 'Productor',          slug:'Productor' },
			{val: 'referente',      label: 'Referente',          slug:'Referente clave / Especialista' },
			{val: 'relacionado',    label: 'Relacionado',        slug:'Entidad relacionada' },
		]
	},
	resource: {
		predicates: [
			{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
			{val: 'enlace',         label: 'Enlace',             slug:'Enlace' },
			{val: 'fuente',         label: 'Fuente principal',   slug:'Portal propio' },
			{val: 'foro',           label: 'Foro',               slug:'Foro' },
			{val: 'ejemplo',        label: 'Ejemplo',            slug:'Ejemplo' },
			{val: 'tutorial',       label: 'Tutorial',           slug:'Tutorial' },
			{val: 'medio',          label: 'Medio',              slug:'Medio' },
			{val: 'documento',      label: 'Documento',          slug:'Documento' },
			{val: 'comunidad',      label: 'Comunidad',          slug:'Comunidad' },
			{val: 'navegacion',     label: 'Enlace a ficha',     slug:'Relación entre fichas' },

		]
	},
	product: {
		predicates: [
			{val: 'no_definido', 	  label: 'Seleccione opción', slug:'Seleccione opción' },
			{val: 'objetivo',       label: 'Objetivo',          slug:'Objetivo específico' },
			{val: 'resultado',      label: 'Resultado',         slug:'resultado' },
			{val: 'requerido',      label: 'Prod requerido',         slug:'requerido' },
			{val: 'entregable',     label: 'Prod entregable',        slug:'Prod entregable' },
			{val: 'cotizacion',     label: 'Cotización',        slug:'Item cotización' },
			{val: 'presupuesto',    label: 'Presupuesto',       slug:'Item presupuesto' },
			{val: 'expensas',       label: 'Expensas',          slug:'Item expensas' },
		]
	},
	asset: {
		predicates: [
			{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
			{val: 'mainimage',      label: 'mainimage',             slug:'mainimage' },
			{val: 'featureimage',      label: 'featureimage',             slug:'featureimage' },
			{val: 'images',         label: 'images',             slug:'images' },
			{val: 'documento',      label: 'documento',             slug:'documento' },
			{val: 'presentacion',   label: 'presentacion',             slug:'presentacion' },
			{val: 'background',     label: 'background',             slug:'background' },
			{val: 'video',          label: 'video',             slug:'video' },
			{val: 'audio',          label: 'audio',             slug:'audio' },

		]
	},
	image: {
		predicates: [
			{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
			{val: 'mainimage',      label: 'Imagen principal',   slug:'Imagen principal de la ficha' },
			{val: 'featureimage',   label: 'Imagen Destacada',   slug:'Imagen para vista detallada' },
			{val: 'images',         label: 'Carrousel',          slug:'Lista de imágenes Carrousel' },
			{val: 'avatar',         label: 'Avatar',             slug:'Avatar' },

		]
	}

}


const	profesiones =  [
	   	{val: 'no_definido',    label: 'Seleccione opción',  slug:'Seleccione opción' },
			{val: 'agronomx',       label: 'Agrónoma',     slug:'Agrónoma' },
			{val: 'artesanx',       label: 'Artesana',     slug:'Artesana' },
			{val: 'informatico',    label: 'Informática',  slug:'Informática' },
			{val: 'antropologo',    label: 'Antropóloga',  slug:'Antropóloga' },
			{val: 'biologo',        label: 'Bióloga',      slug:'Bióloga' },
			{val: 'musico',         label: 'Música',       slug:'Música' },
			{val: 'economista',     label: 'Economista',   slug:'Economista' },
			{val: 'entrenador',     label: 'Entrenadora',  slug:'Entrenadora' },
			{val: 'obrero',         label: 'Obrera',       slug:'Obrera' },
			{val: 'soldador',       label: 'Soldadora',    slug:'Soldadora' },
		];


const productTableActions = [
			{val: 'no_definido', 	label: 'Seleccione opción',  slug:'Seleccione opción' },
			{val: 'editone',      label: 'Editar registro',    slug:'editone' },
			{val: 'editlista',    label: 'Edición múltiple',   slug:'editlista' },
			{val: '---------',    label: '--------------',     slug:'--------------' },
			{val: 'limpiar',      label: 'Limpiar lista',      slug:'limpiar' },
			{val: '---------',    label: '--------------',     slug:'--------------' },
			{val: 'killpredicate',     label: 'Eliminar relación producto',      slug:'Elimina el producto de esta relación' },
]

const monedas = [
			{val: 'ARS',    label: 'pesos',           slug:'Pesos Argentinos' },
			{val: 'USD',    label: 'usd',             slug:'Dolar USA' },
			{val: 'EUR',    label: 'euros',           slug:'Euros' },
			{val: 'BRL',    label: 'reales',          slug:'Reales' },
			{val: 'COP',    label: 'pesosCo',         slug:'Pesos Colombianos' },
			{val: 'UYU',    label: 'pesosUy',         slug:'Pesos Uruguayos' },
			{val: 'CLP',    label: 'pesosCl',         slug:'Pesos Chilenos' },
]

const viewOptions = [
			{val: 'detallada',    label: 'Detallada',      slug:'Vista detallada' },
			{val: 'predicado',    label: 'xPredicado',     slug:'Vista resumen por predicado' },
			{val: 'milestone',    label: 'xHito',          slug:'Vista resumen por hito, etapa, supbroceso' },
			{val: 'producto',     label: 'xProducto',      slug:'Vista resumen por producto' },
			{val: 'ume',          label: 'xUn de medida',  slug:'Vista resumen por unidad de medida' },
			{val: 'moneda',       label: 'xMoneda',        slug:'Vista resumen por moneda' },
]

const fumeList = [
        {val:'no_definido'  , label:'Unidad de Medida'},
        {val:'unidad'       , label:'UN'},
        {val:'porcentaje'   , label:'%'},
        {val:'hora'         , label:'hs'},
        {val:'dia'          , label:'días'},
        {val:'semana'       , label:'sem'},
        {val:'mes'          , label:'mes'},
        {val:'persona'      , label:'per'},
        {val:'espacio'      , label:'amb'},
        {val:'no_definido'  , label:'-------------'},
        {val:'pasaje'       , label:'pje'},
        {val:'alojamiento'  , label:'aloj'},
        {val:'tramo'        , label:'tram'},
];

/***
Australia Dollar 	AUD
Great Britain Pound 	GBP
Euro 	EUR
Japan Yen 	JPY
Switzerland Franc 	CHF
USA Dollar 	USD
Afghanistan Afghani 	AFN
Albania Lek 	ALL
Algeria Dinar 	DZD
Angola Kwanza 	AOA
Argentina Peso 	ARS
Armenia Dram 	AMD
Aruba Florin 	AWG
Australia Dollar 	AUD
Austria Schilling 	ATS (EURO)
Belgium Franc 	BEF (EURO)
Azerbaijan New Manat 	AZN
Bahamas Dollar 	BSD
Bahrain Dinar 	BHD
Bangladesh Taka 	BDT
Barbados Dollar 	BBD
Belarus Ruble 	BYR
Belize Dollar 	BZD
Bermuda Dollar 	BMD
Bhutan Ngultrum 	BTN
Bolivia Boliviano 	BOB
Bosnia Mark 	BAM
Botswana Pula 	BWP
Brazil Real 	BRL
Great Britain Pound 	GBP
Brunei Dollar 	BND
Bulgaria Lev 	BGN
Burundi Franc 	BIF
CFA Franc BCEAO 	XOF
CFA Franc BEAC 	XAF
CFP Franc 	XPF
Cambodia Riel 	KHR
Canada Dollar 	CAD
Cape Verde Escudo 	CVE
Cayman Islands Dollar 	KYD
Chili Peso 	CLP
China Yuan/Renminbi 	CNY
Colombia Peso 	COP
Comoros Franc 	KMF
Congo Franc 	CDF
Costa Rica Colon 	CRC
Croatia Kuna 	HRK
Cuba Convertible Peso 	CUC
Cuba Peso 	CUP
Cyprus Pound 	CYP (EURO)
Czech Koruna 	CZK
Denmark Krone 	DKK
Djibouti Franc 	DJF
Dominican Republich Peso 	DOP
East Caribbean Dollar 	XCD
Egypt Pound 	EGP
El Salvador Colon 	SVC
Estonia Kroon 	EEK (EURO)
Ethiopia Birr 	ETB
Euro 	EUR
Falkland Islands Pound 	FKP
Finland Markka 	FIM (EURO)
Fiji Dollar 	FJD
Gambia Dalasi 	GMD
Georgia Lari 	GEL
Germany Mark 	DMK (EURO)
Ghana New Cedi 	GHS
Gibraltar Pound 	GIP
Greece Drachma 	GRD (EURO)
Guatemala Quetzal 	GTQ
Guinea Franc 	GNF
Guyana Dollar 	GYD
Haiti Gourde 	HTG
Honduras Lempira 	HNL
Hong Kong Dollar 	HKD
Hungary Forint 	HUF
Iceland Krona 	ISK
India Rupee 	INR
Indonesia Rupiah 	IDR
Iran Rial 	IRR
Iraq Dinar 	IQD
Ireland Pound 	IED (EURO)
Israel New Shekel 	ILS
Italy Lira 	ITL (EURO)
Jamaica Dollar 	JMD
Japan Yen 	JPY
Jordan Dinar 	JOD
Kazakhstan Tenge 	KZT
Kenya Shilling 	KES
Kuwait Dinar 	KWD
Kyrgyzstan Som 	KGS
Laos Kip 	LAK
Latvia Lats 	LVL (EURO)
Lebanon Pound 	LBP
Lesotho Loti 	LSL
Liberia Dollar 	LRD
Libya Dinar 	LYD
Lithuania Litas 	LTL (EURO)
Luxembourg Franc 	LUF (EURO)
Macau Pataca 	MOP
Macedonia Denar 	MKD
Malagasy Ariary 	MGA
Malawi Kwacha 	MWK
Malaysia Ringgit 	MYR
Maldives Rufiyaa 	MVR
Malta Lira 	MTL (EURO)
Mauritania Ouguiya 	MRO
Mauritius Rupee 	MUR
Mexico Peso 	MXN
Moldova Leu 	MDL
Mongolia Tugrik 	MNT
Morocco Dirham 	MAD
Mozambique New Metical 	MZN
Myanmar Kyat 	MMK
NL Antilles Guilder 	ANG
Namibia Dollar 	NAD
Nepal Rupee 	NPR
Netherlands Guilder 	NLG (EURO)
New Zealand Dollar 	NZD
Nicaragua Cordoba Oro 	NIO
Nigeria Naira 	NGN
North Korea Won 	KPW
Norway Kroner 	NOK
Oman Rial 	OMR
Pakistan Rupee 	PKR
Panama Balboa 	PAB
Papua New Guinea Kina 	PGK
Paraguay Guarani 	PYG
Peru Nuevo Sol 	PEN
Philippines Peso 	PHP
Poland Zloty 	PLN
Portugal Escudo 	PTE (EURO)
Qatar Rial 	QAR
Romania New Lei 	RON
Russia Rouble 	RUB
Rwanda Franc 	RWF
Samoa Tala 	WST
Sao Tome/Principe Dobra 	STD
Saudi Arabia Riyal 	SAR
Serbia Dinar 	RSD
Seychelles Rupee 	SCR
Sierra Leone Leone 	SLL
Singapore Dollar 	SGD
Slovakia Koruna 	SKK (EURO)
Slovenia Tolar 	SIT (EURO)
Solomon Islands Dollar 	SBD
Somali Shilling 	SOS
South Africa Rand 	ZAR
South Korea Won 	KRW
Spain Peseta 	ESP (EURO)
Sri Lanka Rupee 	LKR
St Helena Pound 	SHP
Sudan Pound 	SDG
Suriname Dollar 	SRD
Swaziland Lilangeni 	SZL
Sweden Krona 	SEK
Switzerland Franc 	CHF
Syria Pound 	SYP
Taiwan Dollar 	TWD
Tanzania Shilling 	TZS
Thailand Baht 	THB
Tonga Pa'anga 	TOP
Trinidad/Tobago Dollar 	TTD
Tunisia Dinar 	TND
Turkish New Lira 	TRY
Turkmenistan Manat 	TMM
USA Dollar 	USD
Uganda Shilling 	UGX
Ukraine Hryvnia 	UAH
Uruguay Peso 	UYU
United Arab Emirates Dirham 	AED
Vanuatu Vatu 	VUV
Venezuela Bolivar 	VEB
Vietnam Dong 	VND
Yemen Rial 	YER
Zambia Kwacha 	ZMK
Zimbabwe Dollar 	ZWD
****/
 
const dateToStr = function(date) {
    var prefix = '00';

    var da = (prefix+date.getDate()).substr(-prefix.length);
    var mo = (prefix+(date.getMonth()+1)).substr(-prefix.length);
    var ye = date.getFullYear();
    return da+"/"+mo+"/"+ye;
};

const parseDateStr = function(str) {
    //console.log('parseDate BEGIN [%s]',str)

    var mx = str.match(/(\d+)/g);
    var ty = new Date();
    if(mx.length === 0) return ty;
    if(mx.length === 1){
        if(mx[0]<0 || mx[0]>31) return null;
        else return new Date(ty.getFullYear(),ty.getMonth(),mx[0]);
    }
    if(mx.length === 2){
        if(mx[0]<0 || mx[0]>31) return null;
        if(mx[1]<0 || mx[1]>12) return null;
        else return new Date(ty.getFullYear(),mx[1]-1,mx[0]);
    }
    if(mx.length === 3){
        if(mx[0]<0 || mx[0]>31) return null;
        if(mx[1]<0 || mx[1]>12) return null;
        if(mx[2]<1000 || mx[2]>2020) return null;
        else return new Date(mx[2],mx[1]-1,mx[0]);
    }
    if(mx.length === 4){
        if(mx[0]<0 || mx[0]>31) return null;
        if(mx[1]<0 || mx[1]>12) return null;
        if(mx[2]<1000 || mx[2]>2020) return null;
        if(mx[3]<0 || mx[3]>24) return null;
        else return new Date(mx[2],mx[1]-1,mx[0],mx[3],0);
    }
    if(mx.length === 5){
        if(mx[0]<0 || mx[0]>31) return null;
        if(mx[1]<0 || mx[1]>12) return null;
        if(mx[2]<1000 || mx[2]>2020) return null;
        if(mx[3]<0 || mx[3]>24) return null;
        if(mx[4]<0 || mx[4]>60) return null;
        else return new Date(mx[2],mx[1]-1,mx[0],mx[3],mx[4]);
    }
}



function umeTx(ume, fume, fumetx, qt, freq){
	let text = ""
	if(freq === 1 && fume === 'unidad'){
		text = qt + ' ' + ume
	}else {
		text = qt + ' ' + ume + ' x ' + freq + ' ' + fumetx ;
	}
	return text;
}


function tableGroupByPredicate(plist: Array<CardGraphProduct>, type: string, milestones: Array<SelectData>): ProductTable[]{
	let groupedList: Array<ProductTable> = [];
	let order = 0;

	function calculateProm(list: Array<ProductTable>){
		list.forEach(pt => {
			if(pt.total && pt.qt){
				pt.pu = pt.total / pt.qt;
			}
		})
	}

	function criteria(token: ProductTable, product: CardGraphProduct): boolean{
		let match = false;

		if(type === 'predicado'){
			if(token.predicate === product.predicate && token.ume === product.ume && token.moneda === product.moneda)
				match = true;
		}

		if(type === 'milestone'){
			if(token.milestoneId === product.milestoneId && token.ume === product.ume && token.moneda === product.moneda)
				match = true;
		}

		if(type === 'producto'){
			if(token.predicate === product.predicate && token.entityId === product.entityId && token.ume === product.ume && token.moneda === product.moneda)
				match = true;
		}

		if(type === 'ume'){
			if(token.ume === product.ume && token.moneda === product.moneda)
				match = true;
		}

		if(type === 'moneda'){
			if(token.moneda === product.moneda)
				match = true;
		}

		return match;
	}

	function selectData(product){
		let moneda    = ['moneda'];
		let ume       = ['ume'];
		let predicado = ['predicado', 'producto'];
		let producto  = ['producto'];
		let milestone = ['milestone'];

		order +=1;
		let data = {
			_id: order,
		}
		data["qt"]        =  qt(product);
		data["total"]     =  total(product);
		data["moneda"]    =  product.moneda;
		data["ars"]       =  data['moneda'] === 'ARS' ? total(product) : 0;
		data["usd"]       =  data['moneda'] === 'USD' ? total(product) : 0;
		data["brl"]       =  data['moneda'] === 'BRL' ? total(product) : 0;
		data["eur"]       =  data['moneda'] === 'EUR' ? total(product) : 0;

		if(ume.indexOf(type)!== -1){
			data["ume"]    =  product.ume;
		}

		if(moneda.indexOf(type)!== -1){
			//data["moneda"]    =  product.moneda;
		}

		if(predicado.indexOf(type)!== -1){
			data["predicate"] =  product.predicate;
			data["ume"]       =  product.ume;
		}

		if(milestone.indexOf(type)!== -1){
			data["milestoneId"] =  product.milestoneId;
			data["ume"]       =  product.ume;
		}

		if(producto.indexOf(type)!== -1){
			data["predicate"] =  product.predicate;
			data['displayAs'] = product.displayAs;
			data['slug']      = product.slug;
			data["entityId"]  =  product.entityId;

			data["ume"]       =  product.ume;
		}

		return data;
	}

	function total(product: CardGraphProduct):number{
		let qt = isNaN(+product.qt) ? 0 : product.qt;
		let freq = isNaN(+product.freq) ? 0 : product.freq;
		let pu = isNaN(+product.pu) ? 0 : product.pu;
		return qt * freq * pu;
	}

	function qt(product: CardGraphProduct):number{
		let qt = isNaN(+product.qt) ? 0 : product.qt;
		return qt;
	}

	function freq(product: CardGraphProduct):number{
		let freq = isNaN(+product.freq) ? 0 : product.freq;
		return freq;
	}

	function tokenAcum(list:ProductTable[], token:ProductTable, product:CardGraphProduct){
		let importe = total(product);
		token.total += importe;
		token.qt += qt(product);
		token.freq += freq(product);
		token.ars += token.moneda === 'ARS' ? importe : 0;
		token.usd += token.moneda === 'USD' ? importe : 0;
		token.brl += token.moneda === 'BRL' ? importe : 0;
		token.eur += token.moneda === 'EUR' ? importe : 0;
		return token;
	}

	function tokenInit(list:ProductTable[], product:CardGraphProduct, milestones: Array<SelectData>){
		let data = selectData(product);
		let token:ProductTable = new ProductTableData(data, milestones);
		list.push(token);
		return token;
	}

	plist.forEach(product => {
		let token:ProductTable = groupedList.find(x => criteria(x, product));
		if(token){
			token = tokenAcum(groupedList, token, product);
		  //console.log('token: ACUM pred::[%s]  qt:[%s]  pu:[%s]  total:[%s] ', token.predicate, token.qt, token.pu, token.total)

		}else{
			token = tokenInit(groupedList, product, milestones);
		  //console.log('token: INIT pred::[%s]  qt:[%s]  pu:[%s]  total:[%s] ', token.predicate, token.qt, token.pu, token.total)

		}
	});

	calculateProm(groupedList);
	return groupedList;
}

function predicateLabel(type, item){
	if(predicateType[type]){
		let label = predicateType[type].predicates.find(x => x.val === item );			

		if(label) return label.label;	
	}
	return 'no_definido';	
}

function googleAdapter(model, data, entity, predicate){
    model.slug = data.title;
    model.description = data.snippet;
    model.displayAs = data.formattedUrl;
    model.entityId = data.link;
    model.predicate = predicate || 'enlace'
    model.entity = entity || 'resource';
    return model;
}

function assetAdapter(model, data, entity, predicate){
    model.slug = data.slug;
    model.description = data.description;
    model.displayAs = data.assetId;
    model.entityId = data._id || data.assetId;
    model.predicate = predicate || 'documento'
    model.entity = entity || 'asset';
    return model;
}

function imageAdapter(model, data, entity, predicate){
    model.slug = data.slug;
    model.description = data.description;
    model.displayAs = data.assetId;
    model.entityId = data._id;
    model.predicate = predicate || 'mainimage'
    model.entity = entity || 'image';
    return model;
}


const extendedUtilites = {
	person: {
		initCardGraph: function(list){
			let graph = new CardGraphPerson();
			if(list && list.length >0){
				graph.predicate = list[0].predicate;
				graph.slug = list[0].slug;
			}
			return graph;
		},

	  buildCardGraphList(rawList): Array<CardGraphPerson>{
	  	let graphs: Array<CardGraphPerson>;
	  	let token: CardGraphPerson;
	  	graphs = rawList.map(model =>{
	  		token = new CardGraphPerson();
	  		Object.assign(token, model);
	  		return token;
	  	})
	  	return graphs;
	  }
	},
	product: {
		initCardGraph: function(list){
			let graph = new CardGraphProduct();
			if(list && list.length >0){
				graph.predicate = list[0].predicate;
				graph.slug = list[0].slug;
			}
			return graph;
		},

		initCardGrpahFromProduct(list, milestone){
			let graph = this.initCardGraph(list);
			graph.milestoneId = milestone;
			return graph;
		},

	  buildCardGraphList(rawList): Array<CardGraphProduct>{
	  	let graphs: Array<CardGraphProduct>;
	  	let token:CardGraphProduct;
	  	graphs = rawList.map(model =>{
	  		token = new CardGraphProduct();
	  		Object.assign(token, model);
	  		return token;
	  	})
	  	return graphs;
	  }
	},


	resource: {
		initCardGraph: function(list){
			let graph = new CardGraphResource();
			if(list && list.length >0){
				graph.predicate = list[0].predicate;
				graph.slug = list[0].slug;
			}
			return graph;
		},

		initCardGrpahFromGoogleSearch: function(data, predicate){
			let graph = googleAdapter(new CardGraphResource(), data, 'resource', predicate)

			return graph;
		},

	  buildCardGraphList(rawList): Array<CardGraphResource>{
	  	let graphs: Array<CardGraphResource>;
	  	let token:CardGraphResource;
	  	graphs = rawList.map(model =>{
	  		token = new CardGraphResource();
	  		Object.assign(token, model);
	  		return token;
	  	})
	  	return graphs;
	  }
	},

	asset: {
		initCardGraph: function(list){
			let graph = new CardGraphAsset();
			if(list && list.length >0){
				graph.predicate = list[0].predicate;
				graph.slug = list[0].slug;
			}
			return graph;
		},

		initCardGrpahFromAsset: function(data, predicate){
			let graph = assetAdapter(new CardGraphAsset(), data, 'asset', predicate)

			return graph;
		},


	  buildCardGraphList(rawList): Array<CardGraphAsset>{
	  	let graphs: Array<CardGraphAsset>;
	  	let token:CardGraphAsset;
	  	graphs = rawList.map(model =>{
	  		token = new CardGraphAsset();
	  		Object.assign(token, model);
	  		return token;
	  	})
	  	return graphs;
	  }
	},

	image: {
		initCardGraph: function(list){
			let graph = new CardGraphImage();
			if(list && list.length >0){
				graph.predicate = list[0].predicate;
				graph.slug = list[0].slug;
			}
			return graph;
		},

		initCardGrpahFromAsset: function(data, predicate){
			let graph = imageAdapter(new CardGraphImage(), data, 'image', predicate)

			return graph;
		},


	  buildCardGraphList(rawList): Array<CardGraphImage>{
	  	let graphs: Array<CardGraphImage>;
	  	let token:CardGraphImage;
	  	graphs = rawList.map(model =>{
	  		token = new CardGraphImage();
	  		Object.assign(token, model);
	  		return token;
	  	})
	  	return graphs;
	  }
	}


}



export const graphUtilities = {
	getPredicateLabel(type, item){
		return predicateLabel(type, item)
	},

	getPredicateOptions(type){
		return predicateType[type].predicates;
	},

	getProductViewOptions(type){
		return viewOptions;
	},

	getCurrencies(){
		return monedas;
	},

	getFumelist(){
		return fumeList;

	},

	getTableActionOptions(){
		return productTableActions;

	},

	getProfesionesLabel(token){
		if(!token) return "";
		let item = profesiones.find(item => item.val === token);
		if(item) return item.label;
		else return "";

	},

	initNewCardGraph(type, list):CardGraph{
		return extendedUtilites[type].initCardGraph(list);
	},

	cardGraphFromGoogleSearch(type, data, predicate):CardGraph{
		return extendedUtilites[type].initCardGrpahFromGoogleSearch(data, predicate);
	},

	cardGraphFromProduct(type, list, milestone):CardGraphProduct{
		return extendedUtilites[type].initCardGrpahFromProduct(list, milestone);
	},

	cardGraphFromAsset(type, data, predicate):CardGraph{
		return extendedUtilites[type].initCardGrpahFromAsset(data, predicate);
	},

	buildProductTable(plist: Array<CardGraphProduct>, milestones: Array<SelectData>): ProductTable[]{
		let list: Array<ProductTable>;

		list = plist.map(item => {
			let token: ProductTable = new ProductTableData(item, milestones);
			return token;
		});

		return list;
	},

	buildProductTableGroupByPredicate(plist: Array<CardGraphProduct>, type: string, milestones: Array<SelectData>): ProductTable[]{
		let list: Array<ProductTable>;
		list = tableGroupByPredicate(plist, type, milestones);

		return list;
	},

	buildGraphList<T>(type, list):T[]{
		let util = extendedUtilites[type];
		return util.buildCardGraphList(list);
	},

	buildMilestonesList(entity: RecordCard): Array<SelectData>{
	  let arr: Array<SubCard> = entity.relatedcards.filter(card => card.cardType === 'milestone') || [];
	  let selectArray:Array<SelectData> = arr.map(data => {
	  	return {val: data._id, label: '--' + data.slug, slug: data.slug}
	  })
	  selectArray.unshift({val: entity._id, label: entity.slug, slug: entity.slug});
	  selectArray.unshift({val: 'no_definido', label: 'Sin selección', slug: 'Hito no seleccionado'});
	  return selectArray;
	},

	getMilestoneLabel(list: Array<SelectData>, id: string): string{
		if(!id) return 'no_definido';
		if(!list || !list.length) return id;
	  let arr = list.find(card => card.val === id);
	  if(!arr){
	  	return 'no definido';
	  }
	  return arr.label;
	},

	dateFromTx(datex){
		return parseDateStr(datex);
	},

	txFromDate(date){
		return dateToStr(date);
	}

}