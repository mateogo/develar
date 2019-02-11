/****************************
       PERSON MODEL
=============================       
 exports:
 	Person
 	Address
 	PersonModel
****************************/

export interface PersonTable {
	personType: string;
	displayName: string;
	email: string;
};

class PersonTableData implements PersonTable {
	personType: string;
	displayName: string;
	email: string;

  _id: string = "";
  editflds = [0,0,0,0,0,0,0,0]

  constructor(data: any){
    this._id = data._id;
    this.personType = data.personType;
    this.displayName = data.displayName;
    this.email = data.email;
  }  
}


export class Person {
	id: string;
	_id: string;
	displayName: string;
	persontags: Array<any>;
	personType: string;
	email: string;
	locacion: string;
	pfisica: {
		nombre: string;
		apellido: string;
		tdocum: string;
		ndocum: string;
		fenac: Date;
		anac: number;
		mnac: number;
		dnac: number;


	};
	pjuridica: {
		rsocial: string;
		tipopj: string;
		tfiscal: string;
		nfiscal: string;
	};
	messages: Array<NotificationMessage>
	locaciones: Array<Address>;
	contactos: Array<any>;
	fichas: Array<RecordCardRelation>;
	audit:{
		hasUser: Boolean;
		fcreate: Date;
		fupdate: Date;
		fdelete: Date;
		estado: string;
		navance: string;
	};
	facetas: Array<any>;
	user: {
		userid: string;
		username: string;
	}
	communitylist: Array<string>;
	nombre: string;
	apellido: string;
	password: string;
	tdoc: string;
	ndoc: string;
	tprofesion: string;
	especialidad: string;
	ambito: string;
	termscond: boolean;
	estado: string;
	navance: string;
	confirmPassword: string;
	grupos: string;
	roles: string;
	modulos: string;
	moduleroles: Array<any>;

	constructor(
		displayName: string, email?:string, msj?:NotificationMessage, tdoc?:string, ndoc?:string){

		this.displayName = displayName;
		if(email) this.email = email;
		if(msj) this.messages = [msj];
		if(tdoc) this.tdoc = tdoc; else this.tdoc = "DNI";
		if(ndoc) this.ndoc = ndoc;
	}

}

export class NotificationMessage {
	content: string = "";
	fe: number = 0;
	type: string;
	from: string;
	constructor(data?){
		if(data){
			this.content = data.content || "";
			this.fe = data.fe || 0;
			this.type = data.type || 'notification';
			this.from = data.from || 'sistema';
		}
	}
}

export class RecordCardRelation {
	slug: string;
	subtitle: string;
	cardId: string;
	topic: string;
	cardType: string;
	cardCategory: string;
	constructor(data?){
		if(data){
			this.slug = data.slug || '';
			this.subtitle = data.subtitle || '';
			this.topic = data.topic || '';
		}

		this.cardType = 'vital';
		this.cardCategory = 'principal';
	}

}

export class Address {
	slug: string = '';
	description: string = '';
	isDefault: boolean = false;
	addType: string = 'principal';
  street1: string = '';
  street2: string = '';
  city: string = '';
  state: string = '';
  statetext:string= '';
  zip: string = '';
  country: string = 'AR';
}

const states = [
						{val: 'no_definido', 	  label: 'Seleccione opción', country:'Seleccione opción' },
	          {val: "CABA",           label: 'CABA', country: 'AR'},
	          {val: "buenosaires",    label: 'Buenos Aires',  country: 'AR'},
						{val: "catamarca",      label: 'Catamarca',     country: 'AR'},
						{val: "chaco",          label: 'Chaco',         country: 'AR'},
						{val: "chubut",         label: 'Chubut',        country: 'AR'},
						{val: "cordoba",        label: 'Córdoba',       country: 'AR'},
						{val: "corrientes",     label: 'Corrientes',    country: 'AR'},
						{val: "entrerios",      label: 'Entre Ríos',    country: 'AR'},
						{val: "formosa",        label: 'Formosa',       country: 'AR'},
						{val: "jujuy",          label: 'Jujuy',         country: 'AR'},
						{val: "lapampa",        label: 'La Pampa',      country: 'AR'},
						{val: "larioja",        label: 'La Rioja',      country: 'AR'},
						{val: "mendoza",        label: 'Mendoza',       country: 'AR'},
						{val: "misiones",       label: 'Misiones',      country: 'AR'},
						{val: "neuquen",        label: 'Neuquén',       country: 'AR'},
						{val: "rionegro",       label: 'Río Negro',     country: 'AR'},
						{val: "salta",          label: 'Salta',         country: 'AR'},
						{val: "sanjuan",        label: 'San Juan',      country: 'AR'},
						{val: "sanluis",        label: 'San Luis',      country: 'AR'},
						{val: "santacruz",      label: 'Santa Cruz',    country: 'AR'},
						{val: "santafe",        label: 'Santa Fe',      country: 'AR'},
						{val: "santiagodelestero", label: 'Santiago del Estero',  country: 'AR'},
						{val: "tierradelfuego",  label: 'Tierra del Fuego',       country: 'AR'},
						{val: "tucuman",         label: 'Tucumán',      country: 'AR'},
];


const dummyaddresses: Address[] = [
      {street1: '123 Main',street2: '123 Main',  isDefault:false, addType: 'particular', slug: '', description: '',   city: 'Anywhere',  state: 'CA', statetext: 'CALIFORNIA', zip: '94801', country:''},
      {street1: '456 Maple',street2: '456 Maple', isDefault:true, addType: 'comercial',  slug: '', description: '',   city: 'Somewhere', state: 'VA', statetext: 'VISCONSIN',  zip: '23226', country:''}
];



const addressTypes: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',slug:'Seleccione opción' },
		{val: 'principal',      label: 'Principal',        slug:'Locación principal' },
		{val: 'particular',     label: 'Particular',       slug:'Domicilio particular' },
		{val: 'fiscal', 	      label: 'Fiscal',           slug:'Domicilio fiscal' },
		{val: 'comercial', 	    label: 'Comercial',        slug:'Domicilio comercial' },
		{val: 'entrega', 	      label: 'Lugar entrega',    slug:'Lugar de entrega' },
		{val: 'sucursal', 	    label: 'Sucursal',         slug:'Sucursal' },
		{val: 'deposito',       label: 'Depósito',         slug:'Depósito' },
		{val: 'admin',          label: 'Administración',   slug:'Sede administración' },
		{val: 'fabrica',        label: 'Fabrica',          slug:'Sede fábrica' },
		{val: 'pagos',          label: 'Pagos',            slug:'Sede pagos' },
		{val: 'rrhh',           label: 'Recursos humanos', slug:'Sede recursos humanos' },
		{val: 'biblioteca',     label: 'Biblioteca',       slug:'Sede Biblioteca' },
		{val: 'dependencia',    label: 'Dependencia',      slug:'Otras dependencias' },
];

const countries: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',slug:'Seleccione opción' },
		{val: 'AR', 	          label: 'Argentina ',slug:'Argentina' }
];


const ptypes: Array<any> = [
		{val: 'no_definido', label: 'Seleccione opción',slug:'Seleccione opción' },
		{val: 'fisica', 	   label: 'Persona física',   slug:'' },
		{val: 'juridica',    label: 'Persona jurídica', slug:'' },
		{val: 'ideal', 	     label: 'Persona ideal',    slug:'' },
		{val: 'alias', 	     label: 'Alias persona',    slug:'' },
		{val: 'colectivo', 	     label: 'colectivo',    slug:'colectivo' },
		{val: 'grupo', 	     label: 'grupo',    slug:'grupo' },
		{val: 'institución', 	     label: 'institución',    slug:'institución' },
		{val: 'cooperativa', 	     label: 'cooperativa',    slug:'cooperativa' },
		{val: 'editorial', 	     label: 'editorial',    slug:'editorial' },
		{val: 'osc', 	     label: 'osc',    slug:'osc' },
];

const entityTableActions = [
      {val: 'no_definido',   label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'editone',      label: 'Editar registro',    slug:'editone' },
      {val: 'navigate',     label: 'Navegar comunidad',    slug:'Cambiar a esta comunidad' },
]

const tiposCompPersonaFisica: Array<any> = [
		{val: 'DNI', 	     label: 'DNI',  slug:'DNI' },
		{val: 'LE',        label: 'Libreta Enrolamiento',    slug:'Libreta Enrolam' },
		{val: 'LC',        label: 'Libreta Cívica',    slug:'Libreta Cívica' },
		{val: 'PAS',       label: 'Pasaporte',          slug:'Pasaporte' },
		{val: 'CI',        label: 'Cédula de Identidad',          slug:'Cédula de Identidad' },
		{val: 'EXT',       label: 'Extranjeros',          slug:'Extranjeros' },
];



const profesiones: Array<any> = [
   	{val: 'no_definido',    label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'agronomx',       label: 'Agrónoma',     slug:'Agrónoma' },
		{val: 'antropologx',    label: 'Antropóloga',  slug:'Antropóloga' },
		{val: 'artesanx',       label: 'Artesana',     slug:'Artesana' },
		{val: 'biologx',        label: 'Bióloga',      slug:'Bióloga' },
		{val: 'bioquimicx',     label: 'Bioquímica',   slug:'Bioquímica' },
		{val: 'economista',     label: 'Economista',   slug:'Economista' },
		{val: 'entrenadorx',    label: 'Entrenadora',  slug:'Entrenadora' },
		{val: 'informaticx',    label: 'Informática',  slug:'Informática' },
		{val: 'musicx',         label: 'Música',       slug:'Música' },
		{val: 'obrerx',         label: 'Obrera',       slug:'Obrera' },
		{val: 'soldadorx',      label: 'Soldadora',    slug:'Soldadora' },
		{val: 'transportista',  label: 'Transportista', slug:'Transportista' },
];


function initNewModel(displayName:string, email:string){
  let entity = new Person(displayName, email);
  return entity;
}


class PersonModel {
	constructor(){

	}
	
  initNew(displayName:string, email:string){
    return initNewModel(displayName, email);
  }

	get addressTypes():Array<any>{
		return addressTypes;
	}

	initAddress(data?):Address {
		data = data || {};
    const address = new Address();
    Object.assign(address, data);
    return address;
  }

	initRelatedCard(data?):RecordCardRelation {
		data = data || {};
    const ficha = new RecordCardRelation(data);
    return ficha;
  }

  fetchAddrTypeLabel(value):string{
    return addressTypes.find(item => item.val === value).slug;
  }

  fetchProvinceLabel(value):string{
    return states.find(item => item.val === value).label;
  }


  get dummyaddresses():Array<any>{
  	return dummyaddresses;
  }

	get persontypes():Array<any>{
		return ptypes;
	}

	get tipoDocumPF():Array<any>{
		return tiposCompPersonaFisica;
	}

	get profesiones():Array<any>{
		return profesiones;
	}

	get countries():Array<any>{
		return countries;
	}

	personType(code):string {
		if(!code) return ''
		return ptypes.find(item => item.val === code).label;
	}

	get provincias():Array<any>{
		const country = 'AR';
		var prov:Array<any> = states.filter(item => item.country === country);
		return  prov;
	}

  get tableActionOptions(){
    return entityTableActions;
  }

  buildPersonTable(elist: Array<Person>): PersonTable[]{
    let list: Array<PersonTable>;

    list = elist.map(item => {
      let token: PersonTable = new PersonTableData(item);
      return token;
    });

    return list;
  }


}

export const personModel = new PersonModel();


/***

var foo: Foo;
foo = (() => {}) as Foo;
foo.bar = "initialized!";

You could do something like this, which ensures you pass all required properties:

function mix<T, U extends {[k: string]: {}}>(func: T, properties: U): T & U {
    Object.keys(properties).forEach(k => (func as any)[k] = properties[k]);
    return func as T & U;
}

var foo: Foo;
foo = mix(() => {}, { bar: 'initialized'});


***/

