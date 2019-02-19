/*************
  RECORDCARD RecordCard recordcard model
*********/
import { Asset } from '../develar-commons/develar-entities';
import { SelectData, Carrousel } from './recordcard-helper';


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

export class CardGraphBasae implements CardGraph {
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

export class CardGraphPerson extends CardGraphBasae {
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

export class CardGraphResource extends CardGraphBasae {
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

export class CardGraphAsset extends CardGraphBasae {
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

export class CardGraphImage extends CardGraphBasae {
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


/****************************************/
/**           Breadcrumb         */
/****************************************/
export class BreadcrumbItem {
  title: string;
  icon:  string;
  link:  string;
}

/****************************************/
/**           PublicationConfig         */
/****************************************/
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
			this.dateFrom = data.dateFrom;
			this.dateTo = data.dateTo;
			this.publishOrder = data.publishOrder;
			this.topics = data.topics;
			this.template = data.template;
			this.destaque = data.destaque;
			this.slug = data.slug;
		}
	}
}



/****************************************/
/**            RecordCard             */
/****************************************/
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

	constructor(slug: string){
		this.slug = slug;

	}
}

