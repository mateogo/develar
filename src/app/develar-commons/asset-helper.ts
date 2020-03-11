/****************************************/
/**            CardGraph                */
/****************************************/
export interface CardGraph {
	entity: string;
	displayAs: string;
	predicate: string;
	slug: string;
	description: string;
	avatar: string;
	entityId: string;
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
	personasset: {
		formTitle: 'Recursos digitales',
		formAddLabel: 'Agregar nuevo objeto digital'
	},
	asset: {
		formTitle: 'Recursos relacionados',
		formAddLabel: 'Agregar nuevo objeto digital'
	},
	censoasset: {
		formTitle: 'Recursos digitales',
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
			{val: 'featureimage',   label: 'featureimage',             slug:'featureimage' },
			{val: 'images',         label: 'images',             slug:'images' },
			{val: 'documento',      label: 'documento',             slug:'documento' },
			{val: 'presentacion',   label: 'presentacion',             slug:'presentacion' },
			{val: 'background',     label: 'background',             slug:'background' },
			{val: 'video',          label: 'video',             slug:'video' },
			{val: 'audio',          label: 'audio',             slug:'audio' },

		]
	},
	personasset: {
		predicates: [
			{val: 'no_definido', 	  label: 'Seleccione opción',  		slug:'Seleccione opción' },
			{val: 'dnia',           label: 'DNI Anverso',           slug:'DNI Anverso' },
			{val: 'dnir',           label: 'DNI Reverso',           slug:'DNI Reverso' },
			{val: 'partidanacim',   label: 'Partida nacimiento',    slug:'Partida Nacimiento' },
			{val: 'avatar',         label: 'Avatar',             		slug:'Avatar personal' },
			{val: 'featureimage',   label: 'Imagen Destacada',   		slug:'Imagen para vista detallada' },
			{val: 'documento',      label: 'Otros documentos',      slug:'Otros documentos' },
			{val: 'images',         label: 'Otras imágenes',        slug:'Otras imágenes' },
			{val: 'subsidio',       label: 'Subsidio digitalizado', slug:'Subsidio' },
		]
	},
	censoasset: {
		predicates: [
			{val: 'no_definido', 	  label: 'Seleccione opción',  		slug:'Seleccione opción' },
			{val: 'dnia',           label: 'DNI Anverso',           slug:'DNI Anverso' },
			{val: 'dnir',           label: 'DNI Reverso',           slug:'DNI Reverso' },
			{val: 'acta',           label: 'Acta',                  slug:'Acta' },
			{val: 'licencia',       label: 'Licen;Marca;Patente',   slug:'Licen;Marca;Patente' },
			{val: 'habilitacion',   label: 'Habilitación',          slug:'Habilitación' },
			{val: 'avatar',         label: 'Avatar',             		slug:'Avatar personal' },
			{val: 'featureimage',   label: 'Imagen Destacada',   		slug:'Imagen para vista detallada' },
			{val: 'documento',      label: 'Otros documentos',      slug:'Otros documentos' },
			{val: 'images',         label: 'Otras imágenes',        slug:'Otras imágenes' },
			{val: 'subsidio',       label: 'Subsidio digitalizado', slug:'Subsidio' },
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

function personassetAdapter(model, data, entity, predicate){
    model.slug =        data.slug;
    model.description = data.description;
    model.displayAs =   data.assetId;
    model.entityId =    data._id || data.assetId;
    model.predicate =   predicate || 'documento'
    model.entity =      entity || 'asset';
    return model;
}

function censoassetAdapter(model, data, entity, predicate){
    model.slug =        data.slug;
    model.description = data.description;
    model.displayAs =   data.assetId;
    model.entityId =    data._id || data.assetId;
    model.predicate =   predicate || 'documento'
    model.entity =      entity || 'asset';
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

	censoasset: {
		initCardGraph: function(list){
			let graph = new CardGraphAsset();
			if(list && list.length >0){
				graph.predicate = list[0].predicate;
				graph.slug = list[0].slug;
			}
			return graph;
		},

		initCardGrpahFromAsset: function(data, predicate){
			let graph = censoassetAdapter(new CardGraphAsset(), data, 'asset', predicate)

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

	personasset: {
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


	buildGraphList<T>(type, list):T[]{
		let util = extendedUtilites[type];
		return util.buildCardGraphList(list);
	},



}