import { RecordCard, SubCard, CardGraph, CardGraphProduct, CardGraphAsset, CardGraphImage, CardGraphPerson, CardGraphResource, PublicationConfig } from './recordcard.model';
import { devutils } from '../develar-commons/utils';


/****************************************/
/**            Tables                  */
/****************************************/
const DEFAULT_IMAGE_URL_BASE = "assets/content/";
const DEFAULT_IMAGE_URL_ARRAY = ['card-1.jpg', 'card-2.jpg', 'card-3.jpg'];
const DEFAULT_MAIN = DEFAULT_IMAGE_URL_BASE + DEFAULT_IMAGE_URL_ARRAY[0];

const ASSETS_NOT_SHOW = ['mainimage'];

const templateList: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'ficha',          label: 'Ficha',              slug:'ficha' },
		{val: 'portfolio',      label: 'Portfolio',          slug:'Portfolio' },
		{val: 'post',           label: 'Nota',               slug:'Nota' },
		{val: 'topbranding',    label: 'topbranding',        slug:'topbranding' },
		{val: 'topcarrousel',   label: 'topcarrousel',       slug:'topcarrousel' },
		{val: 'topcontacto',    label: 'topcontacto',        slug:'topcontacto' },
		{val: 'topservicios',   label: 'topservicios',       slug:'topservicios' },
		{val: 'topportfolio',   label: 'topportfolio',       slug:'topportfolio' }, 
		{val: 'topabout',       label: 'topabout',           slug:'topabout' },
		{val: 'topaboutlr',     label: 'topabout L-R',       slug:'topabout L-R'},
		{val: 'topmission',     label: 'topmission',         slug:'topmission' },
		{val: 'sidemenu',       label: 'sidemenu',           slug:'sidemenu' },
		{val: 'regcomercio',    label: 'registro comercios', slug:'Registro' } ,
		{val: 'regpersonas',    label: 'registro personas',  slug:'Registro' } ,
		{val: 'destacado',      label: 'destacado',          slug:'destacado' },
		{val: 'footer',         label: 'footer',             slug:'footer' },
		{val: 'carrousel',      label: 'carrousel',          slug:'carrousel' },
		{val: 'xternos',        label: 'renderizado x App',  slug:'Render externo' },
];

const scopeList: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'privado',        label: 'Privado',            slug:'Acceso solo al usuario creador' },
		{val: 'registrados',    label: 'Usuarios registrados',       slug:'Acceso sólo a usuarios registrados' },
		{val: 'publico',        label: 'Público',       slug:'Acceso general' },
];

const destaqueList: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',   slug:'Seleccione opción' },
		{val: 'destaque1',        label: 'Destaque 1Col',             slug:'Destaque 1Col' },
		{val: 'destaque2',        label: 'Destaque 2Col',             slug:'Destaque 2Col' },
		{val: 'destaque3',        label: 'Destaque 3Col',             slug:'Destaque 3Col' },
		{val: 'destaque4',        label: 'Destaque 4Col',             slug:'Destaque 4Col' },
		{val: 'carrousel1',       label: 'Carrousel ImgPpal',         slug:'Carrousel Imagen PPal' },
];

const subCardTypes: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'subficha',       label: 'Sub-ficha',          slug:'Ficha secundaria' },
		{val: 'milestone',       label: 'Hito/ Módulo',            slug:'Hito proyecto/ propuesta' },
];

const subCardCategory = {
	subficha: [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'clase',          label: 'Clase',       slug:'Clase' },
		{val: 'tp',             label: 'Trabajo Práctico',  slug:'Trabajo Práctico' },
		{val: 'teoria',         label: 'Teoría',      slug:'Teoría' },
		{val: 'tema',           label: 'Tema/tópico', slug:'Tema/Tópico' },
		{val: 'examen',         label: 'Examen',      slug:'Examen' },
		{val: 'exposicion',     label: 'Exposición',  slug:'Exposición' },
		{val: 'documento',      label: 'Documento',   slug:'Documento' },
		{val: 'webresource',    label: 'Recurso Portal',  slug:'Recurso Portal' },
	],

	milestone: [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'estrategia',     label: 'Estrategia',   slug:'Estrategia' },
		{val: 'preparacion',    label: 'Preparación',  slug:'Preparación' },
		{val: 'ejecucion',      label: 'Ejecución',    slug:'Ejecución' },
		{val: 'evaluacion',     label: 'Evaluación',   slug:'Evaluación' },
		{val: 'modulo',         label: 'Módulo',       slug:'Módulo' },
		{val: 'tema',           label: 'Tema',         slug:'Tema' },
		{val: 'clase',          label: 'Clase',        slug:'Clase' },
		{val: 'evaluacion',     label: 'Evaluación',   slug:'Evaluación' },
		{val: 'cierre',         label: 'Cierre',       slug:'Cierre' },
	]
};

const cardTypes: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'ficha',          label: 'Ficha',              slug:'Ficha principal' },
		{val: 'post',           label: 'Nota',               slug:'Nota  Post' },
		{val: 'vital',          label: 'Ficha Vital',        slug:'Ficha Curriculum' },
		{val: 'propuesta',      label: 'Proposal',           slug:'Propuesta comercial' },
		{val: 'proyecto',       label: 'Proyecto',           slug:'Proyecto' },
		{val: 'subficha',       label: 'Sub-ficha',          slug:'Ficha secundaria' },
		{val: 'recurso', 	      label: 'Recurso',            slug:'Enlace a recurso' },
		{val: 'curso', 	        label: 'Curso seminario',    slug:'Curso, seminario, taller' },
		{val: 'presentacion', 	label: 'Presentación',       slug:'Presentación' },
		{val: 'comercios',      label: 'Recurso Comercios',  slug:'Recurso Gestión Comercios MAB' },
		{val: 'webresource',    label: 'Recurso Portal',     slug:'Recurso Portal' },

];

const cardCategories: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'tutorial', 	    label: 'Tutorial',           slug:'Tutorial' },
		{val: 'referencia', 	  label: 'Referencia/API',     slug:'Manual de referencia' },
		{val: 'ejercicio', 	    label: 'Ejercicio',          slug:'Ejercicio' },
		{val: 'ejemplo', 	      label: 'Ejemplo',            slug:'Ejemplo' },
		{val: 'evento', 	      label: 'Evento',             slug:'Evento/ Jornada/ Seminario' },
		{val: 'webresource',    label: 'Recurso Portal',     slug:'Recurso Portal' },
];

const cardCategory = {
	propuesta: [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'desarrollo',     label: 'Business Devel',     slug:'Business development' },
		{val: 'regulatoria',    label: 'Regulatorio',        slug:'Regulatory affairs' },
		{val: 'ip',             label: 'Prop Intlectual',    slug:'Propiedad Intelectual' },
	],

	proyecto: [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'desarrollo',     label: 'Desarrollo',         slug:'Desarrollo' },
		{val: 'investigacion',  label: 'Investigación',      slug:'Investigación' },
		{val: 'auditoria',      label: 'Auditoría',          slug:'Auditoría' },
	],

	vital: [
		{val: 'no_definido', 	 label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'principal',     label: 'Faceta principal',   slug:'Faceta principal' },
		{val: 'graduacion',    label: 'Graduación',         slug:'Graduación' },
		{val: 'proyecto',      label: 'Proyecto personal',  slug:'Proyecto personal' },
		{val: 'premio',        label: 'Premio recibido',    slug:'Premio recibido' },
		{val: 'portfolio',     label: 'Portfolio',          slug:'Portfolio' },
	],

	curso: [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'curso',          label: 'Curso',         slug:'Curso' },
		{val: 'formacion',      label: 'Formación',     slug:'Formación' },
		{val: 'seminario',      label: 'Seminario',     slug:'Seminario' },
		{val: 'taller',         label: 'Taller',        slug:'Taller' },
		{val: 'jornada',        label: 'Jornada',       slug:'Jornada' }, 
	],

	ficha: [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'documento',      label: 'Documento',          slug:'Documento general' },
		{val: 'tutorial', 	    label: 'Tutorial',           slug:'Tutorial' },
		{val: 'referencia', 	  label: 'Referencia/API',     slug:'Manual de referencia' },
		{val: 'ejercicio', 	    label: 'Ejercicio',          slug:'Ejercicio' },
		{val: 'ejemplo', 	      label: 'Ejemplo',            slug:'Ejemplo' },
	],

	post: [
		{val: 'no_definido', 	 label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'accion',        label: 'Acción territorial', slug:'Acción territorial' },
		{val: 'agenda',        label: 'Agenda',             slug:'Agenda' },
		{val: 'politica',      label: 'Política',           slug:'Política' },
		{val: 'derechos',      label: 'Derechos Humanos',   slug:'Derechos Humanos' },
		{val: 'internacional', label: 'Internacional',      slug:'Internacional' },
		{val: 'economia',      label: 'Economía',           slug:'Economía' },
		{val: 'libros',        label: 'Libros',             slug:'Libros' },
		{val: 'noticias',      label: 'Noticias',           slug:'Noticias' },
		{val: 'eventos',       label: 'Eventos',            slug:'Eventos' },
	],

	subficha: [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'documento',      label: 'Documento',          slug:'Documento general' },
		{val: 'tutorial', 	    label: 'Tutorial',           slug:'Tutorial' },
		{val: 'referencia', 	  label: 'Referencia/API',     slug:'Manual de referencia' },
		{val: 'ejercicio', 	    label: 'Ejercicio',          slug:'Ejercicio' },
		{val: 'ejemplo', 	      label: 'Ejemplo',            slug:'Ejemplo' },
	],

	recurso: [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'documento',      label: 'Documento',          slug:'Documento' },
		{val: 'audio',          label: 'Audio',              slug:'Audio' },
		{val: 'video',          label: 'Video',              slug:'Video' },
	],

	presentacion: [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'comercial',      label: 'Comercial',          slug:'Comercial general' },
		{val: 'academica', 	    label: 'Académica',          slug:'Académica' },
	],

	comercios: [
		{val: 'no_definido', 	  label: 'Seleccione opción',   slug:'Seleccione opción' },
		{val: 'dashboard',      label: 'Dashboard comercios', slug:'Ficha auxiliar para el dashboard de comercios' },
		{val: 'seguridad',      label: 'Dashboard personal de seguridad', slug:'Ficha auxiliar para el dashboard del personal de seguridad' },
	],

	webresource: [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'topbranding',    label: 'Top branding',       slug:'Top branding' },
		{val: 'topcarrousel',   label: 'Top carrousel',      slug:'Top carrousel' },
		{val: 'topabout',       label: 'Top about',          slug:'Top about' },
		{val: 'topaboutlr',     label: 'Top about L-R',      slug:'Top about L-R'},
		{val: 'topservicios',   label: 'Top servicios',      slug:'Top servicios' },
		{val: 'topportfolio',   label: 'Top portfolio',      slug:'Top portfolio' },
		{val: 'destacado',      label: 'Top destacado',      slug:'Destacado' },
		{val: 'portfolio',      label: 'Portfolio',          slug:'Portfolio' },
		{val: 'footer',         label: 'Top footer',         slug:'Footer' },
		{val: 'formcontacto',   label: 'Form de contacto',   slug:'Formulario de contacto' },
	]
};


export const predicateType = {
	person: {
		predicates: [
			{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
			{val: 'fichacv',        label: 'Ficha Curriculum',   slug:'Ficha Curriculum' },
			{val: 'client',         label: 'Cliente',            slug:'Cliente' },
			{val: 'referral',       label: 'Referencia',         slug:'Referencia' },
			{val: 'sponsor',        label: 'Sponsor',            slug:'Sponsor' },
			{val: 'cro',            label: 'Productor',          slug:'Productor' },
			{val: 'contacto',       label: 'Contacto',           slug:'contacto' },
			{val: 'director',       label: 'Director',           slug:'director' },
			{val: 'prjleader',      label: 'Project leader',     slug:'prjleader' },
			{val: 'qa',             label: 'Analista calidad',   slug:'Analista calidad' },
			{val: 'autor',          label: 'Autor',              slug:'Autor' },
			{val: 'coautor',        label: 'Co-Autor',           slug:'Co-Autor' },
			{val: 'revisor',        label: 'Revisor',            slug:'Revisor' },
			{val: 'traductor',      label: 'Traductor',          slug:'Traductor' },
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
			{val: 'requerido',      label: 'Prod requerido',    slug:'requerido' },
			{val: 'entregable',     label: 'Prod entregable',   slug:'Prod entregable' },
			{val: 'cotizacion',     label: 'Cotización',        slug:'Item cotización' },
			{val: 'presupuesto',    label: 'Presupuesto',       slug:'Item presupuesto' },
			{val: 'expensas',       label: 'Expensas',          slug:'Item expensas' },
		]
	},
	asset: {
		predicates: [
			{val: 'no_definido', 	  label: 'Seleccione opción', slug:'Seleccione opción' },
			{val: 'mainimage',      label: 'mainimage',         slug:'mainimage' },
			{val: 'images',         label: 'images',            slug:'images' },
			{val: 'documento',      label: 'documento',         slug:'documento' },
			{val: 'presentacion',   label: 'presentacion',      slug:'presentacion' },
			{val: 'background',     label: 'background',        slug:'background' },
			{val: 'video',          label: 'video',             slug:'video' },
			{val: 'audio',          label: 'audio',             slug:'audio' },
		]
	},
	image: {
		predicates: [
			{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
			{val: 'mainimage',      label: 'Imagen principal',   slug:'Imagen principal de la ficha' },
			{val: 'images',         label: 'Carrousel',          slug:'Lista de imágenes Carrousel' },
			{val: 'avatar',         label: 'Avatar',             slug:'Avatar' },

		]
	}

}

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


/****************************************/
/**            Dialogs                  */
/****************************************/

const newPersonConfirm = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Alta de nueva persona',
    title: 'Confirme la acción',
    body: 'Se dará de una nueva person con nombre: ',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};


/****************************************/
/**            Carrousel               */
/****************************************/

export class Carrousel {
	slug: string = "Carrousel";
	mainimage: string = DEFAULT_MAIN;	
	images:  Array<string> = [];
	start: number = 0;
}

export interface SelectData {
	val:string;
	label:string;
	slug: string;
}




/****************************************/
/**            ProductTable             */
/****************************************/
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
		this.milestoneLabel = GraphUtils.getMilestoneLabel(milestones, this.milestoneId);
		this.fumetx = fumeList.find(item => item.val === this.fume).label;
		this.qtx = umeTx(this.ume, this.fume, this.fumetx, this.qt, this.freq);
		this.ars = this.moneda === 'ARS' ? this.total : 0;
		this.usd = this.moneda === 'USD' ? this.total : 0;
		this.brl = this.moneda === 'BRL' ? this.total : 0;
		this.eur = this.moneda === 'EUR' ? this.total : 0;
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

	// Function begins execution
	plist.forEach(product => {
		let token:ProductTable = groupedList.find(x => criteria(x, product));
		if(token){
			token = tokenAcum(groupedList, token, product);

		}else{
			token = tokenInit(groupedList, product, milestones);

		}
	});

	calculateProm(groupedList);
	return groupedList;
}
// End tableGroupByPredicate


/****************************************/
/**         Helper functions            */
/****************************************/

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
    model.entityId = data._id;
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


function predicateLabel(type, item){
	if(predicateType[type]){
		let label = predicateType[type].predicates.find(x => x.val === item );			

		if(label) return label.label;	
	}
	return 'no_definido';	
}



function getDefaultImage(entity): string{
		let ok = true;
    let offset = 0; // Math.floor(Math.random() * 100 ) % 3;
    if(ok) return DEFAULT_IMAGE_URL_BASE + DEFAULT_IMAGE_URL_ARRAY[offset];
    else return null;
}

/**
  @entity:{
	   images: [urls]
	   mainimage: url-string
	   slug: string
	   useDefault: boolean=true; 
	   startAt: offset
  }
*/
function populateImages(entity): Array<string>{
  let arr: Array<string>;
  if(!entity.images) arr = [];
  else arr = entity.images.map(item => item);

  let defaultImage: string = getDefaultImage(entity);
  
  if(entity.mainimage){
    arr.unshift(entity.mainimage);
  }

  if(!arr.length && defaultImage ){
    arr.push(defaultImage);    
  }

  arr = arr.filter(item => (item && item.length>3));
  return arr;
}


function buildOpeningCard(show:ShowCards, model:RecordCard){
	let openingcard = new RecordCard(model.slug);
	let smodels:Array<SubCard> = [];
	Object.assign(openingcard, model);
	openingcard.relatedcards = smodels;
	show.openingcard = openingcard;
}

function initRelatedCard(smodel):RecordCard{
	let card = new RecordCard(smodel.slug);
	let smodels:Array<SubCard> = [];

	card.id = smodel.id;
	card._id = smodel._id;
	card.cardId = smodel.cardId;
	card.topic = smodel.topic || 'general';
	card.subtitle = smodel.subtitle;
	card.linkTo = smodel.linkTo;
	card.slug = smodel.slug;
	card.description = smodel.description;
	card.mainimage = smodel.mainimage;
	card.cardType = smodel.cardType;
	card.cardCategory = smodel.cardCategory;
	card.images = smodel.images;
	card.relatedcards = smodels;

	return card;
}

function buildRegistry(show:ShowCards, model:RecordCard){
	let models = model.relatedcards;
	let registry = {};
	let topics = [];
	let card: RecordCard;

	if(!models.length){
		models.push(initRelatedCard(model))
	}


	if(!models.length) return;
	
	models.forEach(smodel => {
		card = initRelatedCard(smodel);
		let topic = card.topic;
		if(topics.indexOf(topic) !== -1){
			registry[topic].push(card);
		}else{
			topics.push(topic);
			registry[topic] = [card];
		}
	})

	topics.sort();

	topics.forEach(topic => {
		registry[topic].sort((a,b) =>{
			if(a.cardId < b.cardId) return -1;
			if(a.cardId > b.cardId) return 1;
			return 0;
		})
	})
	show.content = registry;
	show.topicNames = topics;
}

function buildShowCards(entity: RecordCard): ShowCards{
	let show = new ShowCards(entity);
	buildOpeningCard(show, entity);
	buildRegistry(show, entity);

	return show;

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




/****************************************/
/**         Helper Classes            */
/****************************************/
// GraphUtils

export class GraphUtils {
	static getPredicateLabel(type, item){
		return predicateLabel(type, item)
	};

	static getPredicateOptions(type){
		return predicateType[type].predicates;
	};

	static getProductViewOptions(type){
		return viewOptions;
	};

	static getCurrencies(){
		return monedas;
	};

	static getFumelist(){
		return fumeList;
	};

	static getTableActionOptions(){
		return productTableActions;
	};

	static initNewCardGraph(type, list):CardGraph{
		return extendedUtilites[type].initCardGraph(list);
	};

	static cardGraphFromGoogleSearch(type, data, predicate):CardGraph{
		return extendedUtilites[type].initCardGrpahFromGoogleSearch(data, predicate);
	};

	static cardGraphFromProduct(type, list, milestone):CardGraphProduct{
		return extendedUtilites[type].initCardGrpahFromProduct(list, milestone);
	};

	static cardGraphFromAsset(type, data, predicate):CardGraph{
		return extendedUtilites[type].initCardGrpahFromAsset(data, predicate);
	};

	static buildProductTable(plist: Array<CardGraphProduct>, milestones: Array<SelectData>): ProductTable[]{
		let list: Array<ProductTable>;

		list = plist.map(item => {
			let token: ProductTable = new ProductTableData(item, milestones);
			return token;
		});
		return list;
	};

	static buildProductTableGroupByPredicate(plist: Array<CardGraphProduct>, type: string, milestones: Array<SelectData>): ProductTable[]{
		let list: Array<ProductTable>;
		list = tableGroupByPredicate(plist, type, milestones);
		return list;
	};

	static buildGraphList<T>(type, list):T[]{
		let util = extendedUtilites[type];
		return util.buildCardGraphList(list);
	};

	static fetchAuthorString(list: CardGraphPerson[]):string {
		let author = ""

		list.forEach(token => {
			if(token.predicate === "autor"){
				if(author) {
					author = author + "; " + token.displayAs;

				}else{
					author = "Por: " + token.displayAs;

				}
			}
		});

		return author;
	}

	static buildMilestonesList(entity: RecordCard): Array<SelectData>{
	  let arr: Array<SubCard> = entity.relatedcards.filter(card => card.cardType === 'milestone') || [];
	  let selectArray:Array<SelectData> = arr.map(data => {
	  	return {val: data._id, label: '--' + data.slug, slug: data.slug}
	  })
	  selectArray.unshift({val: entity._id, label: entity.slug, slug: entity.slug});
	  selectArray.unshift({val: 'no_definido', label: 'Sin selección', slug: 'Hito no seleccionado'});
	  return selectArray;
	};

	static getMilestoneLabel(list: Array<SelectData>, id: string): string{
		if(!id) return 'no_definido';
		if(!list || !list.length) return id;
	  let arr = list.find(card => card.val === id);
	  if(!arr){
	  	return 'no definido';
	  }
	  return arr.label;
	};

	static dateFromTx(datex){
		return devutils.dateFromTx(datex);
	};

	static txFromDate(date){
		return devutils.txFromDate(date);
	}

  static assetShowList(type:string, tokens: CardGraphAsset[]): CardGraphAsset[]{

		let list =  extendedUtilites[type].buildCardGraphList(tokens);

  	list = tokens.filter(token => {
  		let test = true;

  		if(ASSETS_NOT_SHOW.indexOf(token.predicate) !== -1) test = false;

  		return test;
  	})

  	return list;
  }	
}
// End: GraphUtils


// ShowCards
export class ShowCards {
	public slug: string = "";
	public card: RecordCard;
	public openingcard: RecordCard;
	
	private mainmodel: RecordCard;

	public currIndex: number = 0;
	private currScroll: boolean = true;
	public currOffset: number = 0;
	public currTopic: string;

	private registry = {};
	private topics = [];

	fetchCard(topic, offset){
		this.card = this.registry[topic][offset];
		return this.card;
	}

	initTopicShow(topic){
		this.currTopic = topic;
		this.currOffset = 0;
		this.currIndex = this.registry[topic].length;
		return this.fetchCard(this.currTopic, this.currOffset);
	}
	
	getNextCard(){
		if(this.currOffset + 1 < this.currIndex){
			this.currOffset += 1;

		}else if(this.currScroll){
			this.currOffset = 0;
		}
		return this.fetchCard(this.currTopic, this.currOffset);
	}

	getPreviousCard(){
		if(this.currOffset - 1 >= 0){
			this.currOffset -= 1;

		}else if(this.currScroll){
			this.currOffset = this.currIndex - 1;
		}
		return this.fetchCard(this.currTopic, this.currOffset);
	}

	get content(){
		return this.registry;
	}

	get topicNames(){
		return this.topics;
	}
	set topicNames(topicnames){
		this.topics = topicnames;
	}

	set content(reg){
		this.registry = reg;
	}


	constructor(entity: RecordCard){
		this.mainmodel = entity;
	}	
}
// End: ShowCards

//  Cardhelper
export class CardHelper {
	constructor(){

	}

	static buildPublishToken(data?): PublicationConfig{
		return new PublicationConfig(data)
	}

	static get templateList():Array<any>{
		return templateList;
	}

	static get scopeList():Array<any>{
		return scopeList;
	}

	static initCard(data?):RecordCard {
		data = data || {};
    const card = new RecordCard('Sub contenido');
    Object.assign(card, data);
    return card;
  }

	static initSubCard(data?) {
		data = data || {};
		let target = {images: '', topic: ''};
    const scard = new SubCard('Sub contenido');
    Object.assign(target, scard, data);
    target.images = this.buildImageString(scard.images)
    target.topic = target.topic || 'general';
    return target;
  }

  static buildSubCardArray(models): Array<SubCard>{
  	let scards: Array<SubCard>;
  	let card:SubCard;
  	scards = models.map(model =>{
  		card = new SubCard(model.slug);
  		card.topic = card.topic || 'general';

  		Object.assign(card, model);
  		return card;
  	})
  	return scards;
  }

	static get subcardTypes():Array<any>{
		return subCardTypes;
	}

	static getSubcardCategies(type):Array<any>{
		return subCardCategory[type] || cardCategories;
	}

	static get cardTypes():Array<any>{
		return cardTypes;
	}

	static get cardCategories():Array<any>{
		return cardCategories;
	}

	static getCategories(type): Array<any> {
		return cardCategory[type] || cardCategories;
	}

	static buildImageString(arr: Array<string>): string{
		let data = arr.join('\n');
		return data;
	}

	static buildImageList(data): Array<string>{
	  let arr: Array<any> = [];

	  if(!data) return arr;
	  arr = data.trim().split(/\s*\n\s*/);
	  arr = arr.filter(item => item ? true : false).map(item => item.trim());
	  return arr;
	}	

	static populateImages(entity: RecordCard): Array<string>{
		return populateImages(entity);
	}

	static buildCarrousel(slug, data, start?): Carrousel{
		let ca = new Carrousel();
		ca.images = populateImages(data);
		ca.mainimage = data.mainimage || ca.mainimage;
		ca.slug = slug || data.slug || ca.slug;
		ca.start = start || ca.start;
		return ca;
	}

	static buildRelatedCards(entity: RecordCard): Array<SubCard>{
	  let arr: Array<SubCard> = entity.relatedcards || [];
    arr.forEach(card => {
      card.carrousel = this.buildCarrousel(entity.slug, card, 0);
    });
    return arr;
	}

	static buildShowFromModel(entity: RecordCard): ShowCards{
		return buildShowCards(entity);
	}

	static promote(smodel: SubCard): RecordCard{
		let card = initRelatedCard(smodel);
		return card;
	}

	static confirmSaveMessage(){
		return newPersonConfirm;
	}

	static buildAggregateSelect(entity: RecordCard): Array<SelectData>{
	  let arr: Array<SubCard> = entity.relatedcards.filter(card => card.cardType === 'milestone') || [];
	  let selectArray:Array<SelectData> = arr.map(data => {
	  	return {val: data._id, label: '--' + data.slug, slug: data.slug}
	  })
	  selectArray.unshift({val: entity._id, label: entity.slug, slug: entity.slug});
	  selectArray.unshift({val: 'no_definido', label: 'Sin selección', slug: 'Hito no seleccionado'});
	  return selectArray;
	}

	static getMilestoneSlug(entity: RecordCard, id: string): string{
		if(!entity) return id;
	  let arr: Array<SubCard> = entity.relatedcards.filter(card => card._id === id) || [];
	  if(!arr.length){
	  	return entity._id === id ? entity.slug : 'no definido';
	  }
	  return arr[0].slug;
	}
}
// End: Cardhelper

