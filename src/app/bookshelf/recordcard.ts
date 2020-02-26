/*************
  RECORDCARD RecordCard recordcard
*********/
import { CardGraph } from './cardgraph.helper';
import { Asset } from '../develar-commons/develar-entities';
import { NotePiece } from '../develar-commons/noteeditor/note-model';


export class PublicationConfig {
	toPublish: boolean = false;
	scope: string = "privado";
	dateFrom: number = 0;
	dateTo: number = 0;
	publishOrder: string = "";
	topics: Array<string> = [];
	template: string = "";
	destaque: string = "";
	slug: string = "";
	constructor(data?){
		this.scope = 'publico';
		this.dateFrom = Date.now();
		this.dateTo = Date.now() + (86400000 * 30);
		if(data){
			this.toPublish = data.toPublish;
			this.scope = data.scope;
			this.publishOrder = data.publishOrder;
			this.dateFrom = data.dateFrom;
			this.dateTo = data.dateTo;
			this.topics = data.topics;
			this.template = data.template;
			this.destaque = data.destaque;
			this.slug = data.slug;
		}
	}
}

/**
export class PublishCard {
	toPublish: boolean = true;
	scope: string = "privado";
	dateFrom: number = 100;
	dateTo: number = 110;
	topic: Array<string> = [];
	template: string = "";
	slug: string = "";
	constructor(data?){
		this.slug = '';
		this.scope = 'publico';
		this.toPublish = true;
		this.dateFrom = Date.now();
		this.dateTo = Date.now();

	}

}

*/


export class SubCard {
	id: string;
	_id: string;
	cardId: string = "";
	topic: string = "general";
	subtitle: string = "";
	linkTo: string = "";
	slug: string = "";
	excerpt: string = "";
	description: string = "";
	mainimage: string = "";
	imagecredit: string = "";
	cardType: string = "";
	cardCategory: string = "";
	images:  Array<string> = [];
	viewimages:  Array<CardGraph> = [];
	carrousel: Carrousel;
	parent: string = "";
	noteDescriptor: Array<NotePiece> = [];

	constructor(slug: string){
		this.slug = slug;

	}
}

export class RecordCard {
	id: string;
	_id: string;
	cardId: string = "";
	topic: string = "general";
	subtitle: string = "";
	linkTo: string = "";
	publishDateTx: string = "";
	publishDate: number;
	slug: string = "";
	excerpt: string = "";
	description: string = "";
	mainimage: string = "";
	imagecredit: string = "";
	cardType: string = "";
	cardCategory: string = "";
	images: Array<string>;
	persons:  Array<CardGraph> = [];
	products:  Array<CardGraph> = [];
	assets:  Array<CardGraph> = [];
	viewimages:  Array<CardGraph> = [];
	resources:  Array<CardGraph> = [];
	relatedcards: Array<SubCard> = [];
	carrousel: Carrousel;
	parent: string = "";
	parents: Array<string> = [];
	user: string = "";
	userId: string = "";
	taglist: Array<string> = [];
	communitylist: Array<string> = [];
	publish: PublicationConfig;
	noteDescriptor: Array<NotePiece> = [];

	constructor(slug: string){
		this.slug = slug;

	}
}

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


class Carrousel {
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


const templateList: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'ficha',          label: 'ficha',              slug:'ficha' },
		{val: 'portfolio',      label: 'Portfolio',          slug:'Portfolio' },
		{val: 'post',           label: 'nota',               slug:'Nota' },
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
		{val: 'no_definido', 	  label: 'Seleccione opción',   slug:'Seleccione opción' },
		{val: 'privado',        label: 'Privado',             slug:'Acceso solo al usuario creador' },
		{val: 'registrados',    label: 'Usuarios registrados',  slug:'Acceso sólo a usuarios registrados' },
		{val: 'publico',        label: 'Público',              slug:'Acceso general' },
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
		{val: 'topmission',     label: 'Top misión',         slug:'Top misión'},
  	{val: 'topservicios',   label: 'Top servicios',      slug:'Top servicios' },
		{val: 'topportfolio',   label: 'Top portfolio',      slug:'Top portfolio' },
		{val: 'destacado',      label: 'Top destacado',      slug:'Destacado' },
		{val: 'portfolio',      label: 'Portfolio',          slug:'Portfolio' },
		{val: 'registro',       label: 'Registro',           slug:'Registro' },
		{val: 'footer',         label: 'Footer',             slug:'Footer' },
		{val: 'formcontacto',   label: 'Form de contacto',   slug:'Formulario de contacto' },
	]
};

const DEFAULT_IMAGE_URL_BASE = "assets/content/";
const DEFAULT_IMAGE_URL_ARRAY = ['card-1.jpg', 'card-2.jpg', 'card-3.jpg'];
const DEFAULT_MAIN = DEFAULT_IMAGE_URL_BASE + DEFAULT_IMAGE_URL_ARRAY[0];


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

function buildRecordcardDescriptor(entity: RecordCard): Array<NotePiece>{
	let notes: Array<NotePiece> = [];

	let note = new NotePiece();
	note.raw = entity.description;
	note.estado = 'activo';
	note.editorComp = 'medium';
	note.viewerComp = 'medium';
	note.header = entity.slug;
	note.sheader = entity.subtitle;
	note.type = 'paragraph';
	notes.push(note);

	return notes;
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
	card.excerpt = smodel.excerpt;
	card.description = smodel.description;
	card.imagecredit = smodel.imagecredit;
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
		//console.log('FETCHCARD: [%s] index[%s] offset[%s]', this.card.slug, this.card.mainimage, this.card.images.length);
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

class CardHelper {
	constructor(){

	}

	buildPublishToken(data?): PublicationConfig{
		return new PublicationConfig(data)
	}

	get templateList():Array<any>{
		return templateList;
	}

	get scopeList():Array<any>{
		return scopeList;
	}

	get destaqueList():Array<any>{
		return destaqueList;
	}

	initCard(data?):RecordCard {
		data = data || {};
    const card = new RecordCard('Sub contenido');
    Object.assign(card, data);
    return card;
  }

	initSubCard(data?) {
		data = data || {};
		let target = {images: '', topic: ''};
    const scard = new SubCard('Sub contenido');
    Object.assign(target, scard, data);
    target.images = this.buildImageString(scard.images)
    target.topic = target.topic || 'general';
    return target;
  }

  buildSubCardArray(models): Array<SubCard>{
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
	get subcardTypes():Array<any>{
		return subCardTypes;
	}

	getSubcardCategies(type):Array<any>{
		console.log('getSubardCat: [%s]', type)
		return subCardCategory[type] || cardCategories;
	}

	get cardTypes():Array<any>{
		return cardTypes;
	}

	get cardCategories():Array<any>{
		return cardCategories;
	}

	getCategories(type): Array<any> {
		return cardCategory[type] || cardCategories;
	}

	buildImageString(arr: Array<string>): string{
		let data = arr.join('\n');
		return data;
	}

	buildImageList(data): Array<string>{
	  let arr: Array<any> = [];

	  if(!data) return arr;
	  arr = data.trim().split(/\s*\n\s*/);
	  arr = arr.filter(item => item ? true : false).map(item => item.trim());
	  return arr;
	}	

	populateImages(entity: RecordCard): Array<string>{
		return populateImages(entity);
	}

	buildCarrousel(slug, data, start?): Carrousel{
		let ca = new Carrousel();
		ca.images = populateImages(data);
		ca.mainimage = data.mainimage || ca.mainimage;
		ca.slug = slug || data.slug || ca.slug;
		ca.start = start || ca.start;
		return ca;
	}

	buildRelatedCards(entity: RecordCard): Array<SubCard>{
	  let arr: Array<SubCard> = entity.relatedcards || [];
    arr.forEach(card => {
      card.carrousel = this.buildCarrousel(entity.slug, card, 0);
    });
    return arr;
	}

	buildShowFromModel(entity: RecordCard): ShowCards{
		return buildShowCards(entity);
	}

	promote(smodel: SubCard): RecordCard{
		let card = initRelatedCard(smodel);
		return card;
	}
	confirmSaveMessage(){
		return newPersonConfirm;
	}

	buildAggregateSelect(entity: RecordCard): Array<SelectData>{
	  let arr: Array<SubCard> = entity.relatedcards.filter(card => card.cardType === 'milestone') || [];
	  let selectArray:Array<SelectData> = arr.map(data => {
	  	return {val: data._id, label: '--' + data.slug, slug: data.slug}
	  })
	  selectArray.unshift({val: entity._id, label: entity.slug, slug: entity.slug});
	  selectArray.unshift({val: 'no_definido', label: 'Sin selección', slug: 'Hito no seleccionado'});
	  return selectArray;
	}

	getMilestoneSlug(entity: RecordCard, id: string): string{
		if(!entity) return id;
	  let arr: Array<SubCard> = entity.relatedcards.filter(card => card._id === id) || [];
	  if(!arr.length){
	  	return entity._id === id ? entity.slug : 'no definido';
	  }
	  return arr[0].slug;
	}

	buildRecordcardDescriptor(entity: RecordCard): Array<NotePiece>{
		let descriptor: Array<NotePiece>;
		if(entity.noteDescriptor && entity.noteDescriptor.length){
			descriptor = entity.noteDescriptor;
		}else{
			descriptor = buildRecordcardDescriptor(entity);
		}
		return descriptor;
	}

}

export const cardHelper = new CardHelper();
