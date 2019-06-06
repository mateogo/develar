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

export interface UpdateItemListEvent {
      action: string;
      type: string;
      items: Array<PersonContactData|Address|FamilyData|OficiosData>;
};

export interface UpdatePersonEvent {
	action: string;
	token: string;
	person: Person;
};

export interface UpdateContactEvent {
	action: string;
	type: string;
	token: PersonContactData;
};

export interface UpdateAddressEvent {
      action: string;
      type: string;
      token: Address;
};

export interface UpdateEncuestaEvent {
      action: string;
      type: string;
      token: EncuestaAmbiental;
};

export interface UpdateFamilyEvent {
      action: string;
      type: string;
      token: FamilyData;
};

export interface UpdateOficiosEvent {
      action: string;
      type: string;
      token: OficiosData;
};

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
    estado: string = 'activo';
    encuesta: EncuestaAmbiental;
}


export class EncuestaAmbiental {
      _id: string;
      id_address: string;
      id_person: string;
      estado: string;
      ferel: number;
      fereltxt: string;
      tsocial: string;

      tipoviv: string;
      matviv: string;
      domterreno: string;
      aniosresid: number;
      qvivxlote: number;

      techoviv: string;
      pisoviv: string;
      qdormitorios: number;
      tventilacion: string;
      tcocina: string;
      ecocina: string;
      tbanio: string;
      ebanio: string;
      tmobiliario: string;
      emobiliario: string;

      agua: string;
      electricidad: string;
      cloaca: string;
      gas: string;
}

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

export class PersonContactData {
	tdato: string;
	data: string;
	type: string;
	slug: string;
	isPrincipal: boolean;
}

export class OficiosData {
    tdato: string;  // empleo formal/ informal / desocupado/ changa / oficio / independiente
    tocupacion: string; // operario / empleado/ jefe
    ocupacion: string; // libre
    lugar: string;
    qdiasmes: string;
    remuneracion: number = 0;
    ume_remun: string;
    estado: string;
    desde: string;
    hasta: string;
    comentario: string;
}


export class FamilyData {
    nombre: string;
    apellido: string;
    tdoc: string = 'DNI';
    ndoc: string;
    vinculo: string;
    fenac: number = 0;
    fenactx: string;
    ecivil: string;
    nestudios: string;
    tprofesion: string;
    ocupacion: string;
    tocupacion: string;
    ingreso: string;
    estado: string;
    desde: string;
    hasta: string;
    comentario: string;
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
	contactdata: Array<PersonContactData>;
    familiares: Array<FamilyData>;
    oficios: Array<OficiosData>;
	nombre: string;
	apellido: string;
	password: string;
	tdoc: string;
	ndoc: string;
	tprofesion: string;
	nestudios: string;
	especialidad: string;
	nacionalidad: string;
	fenac: number;
	fenactx: string;
	ecivil: string;
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


const estados_viv: Array<any> = [
        {val: 'incompleto',     type:'completo',  label: 'Incompleto' },
        {val: 'basico',         type:'completo',  label: 'Básico' },
        {val: 'completo',       type:'completo',  label: 'Completo' },

        {val: 'insuficiente',   type:'suficiente',  label: 'Insuficiente'  },
        {val: 'suficiente',     type:'suficiente',  label: 'Suficiente'  },
        
        {val: 'adecuado',       type:'adecuado',  label: 'Adecuado'  },
        {val: 'inadecuado',     type:'adecuado',  label: 'Inadecuado'  },
        
        {val: 'bueno',          type:'calificacion',  label: 'Bueno'  },
        {val: 'regular',        type:'calificacion',  label: 'Regular'  },
        {val: 'malo',           type:'calificacion',  label: 'Malo'  },


];

const tipos_viv: Array<any> = [
        {val: 'interno',      type:'interno', label: 'interno' },
        {val: 'externo',      type:'interno', label: 'externo' },

        {val: 'cocinagas',     type:'cocina',  label: 'A gas'  },
        {val: 'cocinaelec',    type:'cocina',  label: 'Eléctrica' },
        {val: 'anafe',         type:'cocina',  label: 'Anafe'  },
        

        {val: 'insuficiente', type:'suficiente',  label: 'Insuficiente'  },
        {val: 'basico',       type:'suficiente',  label: 'Básico' },
        {val: 'suficiente',   type:'suficiente',  label: 'Suficiente'  },
        
        {val: 'propio',       type:'terreno', label: 'Propio' },
        {val: 'alquilado',    type:'terreno', label: 'Alquilado' },
        {val: 'cedido',       type:'terreno', label: 'Cedido' },
        {val: 'sindocum',     type:'terreno', label: 'SinDocum' },
        {val: 'credhipo',     type:'terreno', label: 'Crédito Hipot' },

        {val: 'casa',         type:'tvivienda', label: 'Casa' }, 
        {val: 'depto',        type:'tvivienda', label: 'Departamento' },
        {val: 'casilla',      type:'tvivienda', label: 'Casilla' },
        {val: 'otro',         type:'tvivienda', label: 'Otro' },

        {val: 'chapa',        type:'mvivienda', label: 'Chapa' },
        {val: 'ladrillo',     type:'mvivienda', label: 'Ladrillo' },
        {val: 'madera',       type:'mvivienda', label: 'Madera' },
        {val: 'otro',         type:'mvivienda', label: 'Otro' },

        {val: 'mampos',       type:'techo', label: 'mampos' },
        {val: 'chapa',        type:'techo', label: 'chapa' },
        {val: 'madera',       type:'techo', label: 'madera' },
        {val: 'tejas',        type:'techo', label: 'tejas' },
        {val: 'otro',         type:'techo', label: 'otro' },

        {val: 'mosaico',      type:'piso', label: 'mosaico' },
        {val: 'cemento',      type:'piso', label: 'cemento' },
        {val: 'ladrillo',     type:'piso', label: 'ladrillo' },
        {val: 'tierra',       type:'piso', label: 'tierra' },
        {val: 'otro',         type:'piso', label: 'otro' },

        {val: 'red',          type:'agua', label: 'red' },
        {val: 'pozo',         type:'agua', label: 'pozo' },
        {val: 'otro',         type:'agua', label: 'otro' },

        {val: 'red',          type:'electricidad', label: 'red' },
        {val: 'colgado',      type:'electricidad', label: 'colgado' },
        {val: 'otro',         type:'electricidad', label: 'otro' },

        {val: 'cloaca',       type:'cloaca', label: 'cloaca' },
        {val: 'pozociego',    type:'cloaca', label: 'pozociego' },
        {val: 'otro',         type:'cloaca', label: 'otro' },

        {val: 'red',          type:'gas', label: 'red' },
        {val: 'envasado',     type:'gas', label: 'envasado' },
        {val: 'otro',         type:'gas', label: 'otro' },

];


const oficios_estado: Array<any> = [
        {val: 'activo',       label: 'Activo',       slug:'Activo' },
        {val: 'terminado',    label: 'Terminado',    slug:'Terminado' },
        {val: 'encurso',      label: 'En curso',     slug:'En curso' },
        {val: 'despedido',    label: 'Despedido',    slug:'Despedido' },
        {val: 'renunciado',   label: 'Renunciado',   slug:'Renunciado' },
        {val: 'cierre',       label: 'Cierre',       slug:'Cierre' },
        {val: 'otro',         label: 'Otro',         slug:'Otro' },
];

const oficios_tdato: Array<any> = [
    {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
    {val: 'formal',       label: 'Formal' },
    {val: 'informal',     label: 'Informal' },
    {val: 'desocupado',   label: 'Desocupado' },
    {val: 'changa',       label: 'Changa' },
    {val: 'oficio',       label: 'Oficio' },
    {val: 'otro',         label: 'Otro' },

];

const oficios_umeremun: Array<any> = [
    {val: 'jornal',      label: 'Jornal' },
    {val: 'semanal',     label: 'Semanal' },
    {val: 'quincenal',   label: 'Quincenal' },
    {val: 'mes',         label: 'Mensual' },
    {val: 'anio',        label: 'Anual' },
    {val: 'otro',        label: 'Otro' },

];

const oficios_tocupacion: Array<any> = [
       {val: 'no_definido',     label: 'Seleccione opción',  slug:'Seleccione opción' },
        {val: 'empleadx',        label: 'Empleado/a',     slug:'Empleado/a' },
        {val: 'tecnicx',         label: 'Tecnico/a',      slug:'Tecnico/a' },
        {val: 'profesional',     label: 'Profesional',    slug:'agronomx' },
        {val: 'estudiante',      label: 'Estudiante',     slug:'agronomx' },
        {val: 'investigadxr',    label: 'Investigador/a', slug:'Investigador/a' },
        {val: 'operarix',        label: 'Operario/a',     slug:'Operario/a' },
        {val: 'amadecasa',       label: 'AmaDeCasa',      slug:'AmaDeCasa' },
        {val: 'jubiladx',        label: 'Jubilado/a',     slug:'Jubilado/a' },
        {val: 'docente',         label: 'Docente',        slug:'Docente' },
        {val: 'desocupax',       label: 'Desocupado/a',    slug:'Desocupado/a' },
        {val: 'otro',            label: 'Otra ocupación',  slug:'Otra ocupación' },
];



const profesiones: Array<any> = [
       {val: 'no_definido',     label: 'Seleccione opción',  slug:'Seleccione opción' },
        {val: 'empleadx',        label: 'Empleado/a',     slug:'Empleado/a' },
        {val: 'tecnicx',         label: 'Tecnico/a',      slug:'Tecnico/a' },
        {val: 'profesional',     label: 'Profesional',    slug:'agronomx' },
        {val: 'estudiante',      label: 'Estudiante',     slug:'agronomx' },
        {val: 'investigadxr',    label: 'Investigador/a', slug:'Investigador/a' },
        {val: 'operarix',        label: 'Operario/a',     slug:'Operario/a' },
        {val: 'amadecasa',       label: 'AmaDeCasa',      slug:'AmaDeCasa' },
        {val: 'jubiladx',        label: 'Jubilado/a',     slug:'Jubilado/a' },
        {val: 'docente',         label: 'Docente',        slug:'Docente' },
        {val: 'desocupax',       label: 'Desocupado/a',    slug:'Desocupado/a' },
        {val: 'otro',            label: 'Otra ocupación',  slug:'Otra ocupación' },
];


const contact_tdato: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',slug:'Seleccione opción' },
		{val: 'CEL',   label: 'CEL',    slug:'CEL' },
		{val: 'MAIL',  label: 'MAIL',   slug:'MAIL' },
		{val: 'FAM', 	 label: 'FAM',    slug:'FAM' },
		{val: 'CON', 	 label: 'CON',    slug:'CON' },
		{val: 'RSOC',  label: 'RSOC',   slug:'RSOC' },
		{val: 'TEL',   label: 'TEL',    slug:'TEL' },
		{val: 'WEB',   label: 'WEB',    slug:'WEB' },
];


const vinculo_familiar: Array<any> = [
        {val: 'no_definido',       label: 'Seleccione opción',slug:'Seleccione opción' },
        {val: 'pareja',   label: 'Pareja',    slug:'Pareja' },
        {val: 'esposx',   label: 'Esposo/a',  slug:'Esposo/a' },
        {val: 'hijx',     label: 'Hijo/a',    slug:'Hijo/a' },
        {val: 'padre',    label: 'Padre',     slug:'Padre' },
        {val: 'madre',    label: 'Madre',     slug:'Madre' },
        {val: 'tix',      label: 'Tío/a',     slug:'Tío/a' },
        {val: 'hermanx',  label: 'Hermana/o', slug:'Hermana/o' },
        {val: 'abuelx',   label: 'Abuela/o',  slug:'Abuela/o' },
        {val: 'nietx',    label: 'Nieto/a',   slug:'Nieto/a' },
        {val: 'sobrinx',  label: 'Sobrino/a', slug:'Sobrino/a' },
        {val: 'pariente', label: 'Pariente',  slug:'Pariente' },
        {val: 'otro',     label: 'Otro',      slug:'Otro' },
];

const estado_vinculo: Array<any> = [
        {val: 'no_definido',  label: 'Seleccione opción',slug:'Seleccione opción' },
        {val: 'activo',       label: 'Activo',         slug:'Activo' },
        {val: 'fallecido',    label: 'Fallecido/a',    slug:'Fallecido/a' },
        {val: 'separado',     label: 'Separado/a',     slug:'Separado/a' },
        {val: 'abandonado',   label: 'Abandonado/a',   slug:'Abandonado/a' },
        {val: 'otro',         label: 'Otro',           slug:'Otro' },
];


const contact_type: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',slug:'Seleccione opción' },
		{val: 'PER',    label: 'PER',    slug:'PER' },
		{val: 'LAB',    label: 'LAB',   slug:'LAB' },
		{val: 'PADRE',  label: 'PADRE',    slug:'PADRE' },
		{val: 'MADRE',  label: 'MADRE',    slug:'MADRE' },
		{val: 'REFS',   label: 'REFS',   slug:'REFS' },
		{val: 'MEDICO', label: 'MEDICO',    slug:'MEDICO' },
		{val: 'AMIGO',  label: 'AMIGO',    slug:'AMIGO' },
];



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

const ciudadesBrown: Array<any> = [
    {val: 'no_definido',     label: 'Seleccione opción',slug:'Seleccione opción' },
    {val: 'adrogue',         label: 'Adrogué ',slug:'Argentina' },
    {val: 'malvinas',        label: 'Malvinas ',slug:'Argentina' },
    {val: 'burzaco',         label: 'Burzaco ',slug:'Argentina' },
    {val: 'orione',          label: 'Orione ',slug:'Argentina' },
    {val: 'glew',            label: 'Glew ',slug:'Argentina' },
];



const paisesOL = [
	    {val: "no_definido", label: 'Seleccione País'},
      {val: "AR", label:'Argentina'},
      {val: "BO", label:'Bolivia'},
      {val: "BR", label:'Brasil'},
      {val: "CL", label:'Chile'},
      {val: "CO", label:'Colombia'},
     	{val: "CR", label:'Costa Rica'},
      {val: "CU", label:'Cuba'},
      {val: "EC", label:'Ecuador'},
      {val: "GT", label:'Guatemala'},
      {val: "GY", label:'Guayana'},
      {val: "GF", label:'Guayana Francesa'},
      {val: "HN", label:'Honduras'},
      {val: "MX", label:'México'},
      {val: "PY", label:'Paraguay'},
      {val: "PE", label:'Perú'},
      {val: "UY", label:'Uruguay'},
      {val: "VE", label:'Venezuela'},
      {val: "xx", label:'---------------'},
      {val: "AF", label:'Afganistán'},
      {val: "AL", label:'Albania'},
      {val: "DE", label:'Alemania'},
      {val: "AD", label:'Andorra'},
      {val: "AO", label:'Angola'},
      {val: "AI", label:'Anguilla'},
      {val: "AQ", label:'Antártida'},
      {val: "AG", label:'Antigua y Barbuda'},
      {val: "AN", label:'Antillas Holandesas'},
      {val: "SA", label:'Arabia Saudí'},
      {val: "DZ", label:'Argelia'},
      {val: "AM", label:'Armenia'},
      {val: "AW", label:'Aruba'},
      {val: "AU", label:'Australia'},
      {val: "AT", label:'Austria'},
      {val: "AZ", label:'Azerbaiyán'},
      {val: "BS", label:'Bahamas'},
      {val: "BH", label:'Bahrein'},
      {val: "BD", label:'Bangladesh'},
      {val: "BB", label:'Barbados'},
      {val: "BE", label:'Bélgica'},
      {val: "BZ", label:'Belice'},
      {val: "BJ", label:'Benin'},
      {val: "BM", label:'Bermudas'},
      {val: "BY", label:'Bielorrusia'},
      {val: "MM", label:'Birmania'},
      {val: "BA", label:'Bosnia y Herzegovina'},
      {val: "BW", label:'Botswana'},
      {val: "BN", label:'Brunei'},
      {val: "BG", label:'Bulgaria'},
      {val: "BF", label:'Burkina Faso'},
      {val: "BI", label:'Burundi'},
      {val: "BT", label:'Bután'},
      {val: "CV", label:'Cabo Verde'},
      {val: "KH", label:'Camboya'},
      {val: "CM", label:'Camerún'},
      {val: "CA", label:'Canadá'},
      {val: "TD", label:'Chad'},
      {val: "CN", label:'China'},
      {val: "CY", label:'Chipre'},
      {val: "VA", label:'Ciudad del Vaticano (Santa Sede)'},
      {val: "KM", label:'Comores'},
      {val: "CG", label:'Congo'},
      {val: "CD", label:'Congo, República Democrática del'},
      {val: "KR", label:'Corea'},
      {val: "KP", label:'Corea del Norte'},
      {val: "CI", label:'Costa de Marfíl'},
      {val: "HR", label:'Croacia (Hrvatska)'},
      {val: "DK", label:'Dinamarca'},
      {val: "DJ", label:'Djibouti'},
      {val: "DM", label:'Dominica'},
      {val: "EG", label:'Egipto'},
      {val: "SV", label:'El Salvador'},
      {val: "AE", label:'Emiratos Árabes Unidos'},
      {val: "ER", label:'Eritrea'},
      {val: "SI", label:'Eslovenia'},
      {val: "ES", label:'España'},
      {val: "US", label:'Estados Unidos'},
      {val: "EE", label:'Estonia'},
      {val: "ET", label:'Etiopía'},
      {val: "FJ", label:'Fiji'},
      {val: "PH", label:'Filipinas'},
      {val: "FI", label:'Finlandia'},
      {val: "FR", label:'Francia'},
      {val: "GA", label:'Gabón'},
      {val: "GM", label:'Gambia'},
      {val: "GE", label:'Georgia'},
      {val: "GH", label:'Ghana'},
      {val: "GI", label:'Gibraltar'},
      {val: "GD", label:'Granada'},
      {val: "GR", label:'Grecia'},
      {val: "GL", label:'Groenlandia'},
      {val: "GP", label:'Guadalupe'},
      {val: "GU", label:'Guam'},
      {val: "GN", label:'Guinea'},
      {val: "GQ", label:'Guinea Ecuatorial'},
      {val: "GW", label:'Guinea-Bissau'},
      {val: "HT", label:'Haití'},
      {val: "HU", label:'Hungría'},
      {val: "IN", label:'India'},
      {val: "ID", label:'Indonesia'},
      {val: "IQ", label:'Irak'},
      {val: "IR", label:'Irán'},
      {val: "IE", label:'Irlanda'},
      {val: "BV", label:'Isla Bouvet'},
      {val: "CX", label:'Isla de Christmas'},
      {val: "IS", label:'Islandia'},
      {val: "KY", label:'Islas Caimán'},
      {val: "CK", label:'Islas Cook'},
      {val: "CC", label:'Islas de Cocos o Keeling'},
      {val: "FO", label:'Islas Faroe'},
      {val: "HM", label:'Islas Heard y McDonald'},
      {val: "FK", label:'Islas Malvinas'},
      {val: "MP", label:'Islas Marianas del Norte'},
      {val: "MH", label:'Islas Marshall'},
      {val: "UM", label:'Islas menores de Estados Unidos'},
      {val: "PW", label:'Islas Palau'},
      {val: "SB", label:'Islas Salomón'},
      {val: "SJ", label:'Islas Svalbard y Jan Mayen'},
      {val: "TK", label:'Islas Tokelau'},
      {val: "TC", label:'Islas Turks y Caicos'},
      {val: "VI", label:'Islas Vírgenes (EE.UU.)'},
      {val: "VG", label:'Islas Vírgenes (Reino Unido)'},
      {val: "WF", label:'Islas Wallis y Futuna'},
      {val: "IL", label:'Israel'},
      {val: "IT", label:'Italia'},
      {val: "JM", label:'Jamaica'},
      {val: "JP", label:'Japón'},
      {val: "JO", label:'Jordania'},
      {val: "KZ", label:'Kazajistán'},
      {val: "KE", label:'Kenia'},
      {val: "KG", label:'Kirguizistán'},
      {val: "KI", label:'Kiribati'},
      {val: "KW", label:'Kuwait'},
      {val: "LA", label:'Laos'},
      {val: "LS", label:'Lesotho'},
      {val: "LV", label:'Letonia'},
      {val: "LB", label:'Líbano'},
      {val: "LR", label:'Liberia'},
      {val: "LY", label:'Libia'},
      {val: "LI", label:'Liechtenstein'},
      {val: "LT", label:'Lituania'},
      {val: "LU", label:'Luxemburgo'},
      {val: "MK", label:'Macedonia, Ex-República Yugoslava de'},
      {val: "MG", label:'Madagascar'},
      {val: "MY", label:'Malasia'},
      {val: "MW", label:'Malawi'},
      {val: "MV", label:'Maldivas'},
      {val: "ML", label:'Malí'},
      {val: "MT", label:'Malta'},
      {val: "MA", label:'Marruecos'},
      {val: "MQ", label:'Martinica'},
      {val: "MU", label:'Mauricio'},
      {val: "MR", label:'Mauritania'},
      {val: "YT", label:'Mayotte'},
      {val: "FM", label:'Micronesia'},
      {val: "MD", label:'Moldavia'},
      {val: "MC", label:'Mónaco'},
      {val: "MN", label:'Mongolia'},
      {val: "MS", label:'Montserrat'},
      {val: "MZ", label:'Mozambique'},
      {val: "NA", label:'Namibia'},
      {val: "NR", label:'Nauru'},
      {val: "NP", label:'Nepal'},
      {val: "NI", label:'Nicaragua'},
      {val: "NE", label:'Níger'},
      {val: "NG", label:'Nigeria'},
      {val: "NU", label:'Niue'},
      {val: "NF", label:'Norfolk'},
      {val: "NO", label:'Noruega'},
      {val: "NC", label:'Nueva Caledonia'},
      {val: "NZ", label:'Nueva Zelanda'},
      {val: "OM", label:'Omán'},
      {val: "NL", label:'Países Bajos'},
      {val: "PA", label:'Panamá'},
      {val: "PG", label:'Papúa Nueva Guinea'},
      {val: "PK", label:'Paquistán'},
      {val: "PN", label:'Pitcairn'},
      {val: "PF", label:'Polinesia Francesa'},
      {val: "PL", label:'Polonia'},
      {val: "PT", label:'Portugal'},
      {val: "PR", label:'Puerto Rico'},
      {val: "QA", label:'Qatar'},
      {val: "UK", label:'Reino Unido'},
      {val: "CF", label:'República Centroafricana'},
      {val: "CZ", label:'República Checa'},
      {val: "ZA", label:'República de Sudáfrica'},
      {val: "DO", label:'República Dominicana'},
      {val: "SK", label:'República Eslovaca'},
      {val: "RE", label:'Reunión'},
      {val: "RW", label:'Ruanda'},
      {val: "RO", label:'Rumania'},
      {val: "RU", label:'Rusia'},
      {val: "EH", label:'Sahara Occidental'},
      {val: "KN", label:'Saint Kitts y Nevis'},
      {val: "WS", label:'Samoa'},
      {val: "AS", label:'Samoa Americana'},
      {val: "SM", label:'San Marino'},
      {val: "VC", label:'San Vicente y Granadinas'},
      {val: "SH", label:'Santa Helena'},
      {val: "LC", label:'Santa Lucía'},
      {val: "ST", label:'Santo Tomé y Príncipe'},
      {val: "SN", label:'Senegal'},
      {val: "SC", label:'Seychelles'},
      {val: "SL", label:'Sierra Leona'},
      {val: "SG", label:'Singapur'},
      {val: "SY", label:'Siria'},
      {val: "SO", label:'Somalia'},
      {val: "LK", label:'Sri Lanka'},
      {val: "PM", label:'St. Pierre y Miquelon'},
      {val: "SZ", label:'Suazilandia'},
      {val: "SD", label:'Sudán'},
      {val: "SE", label:'Suecia'},
      {val: "CH", label:'Suiza'},
      {val: "SR", label:'Surinam'},
      {val: "TH", label:'Tailandia'},
      {val: "TW", label:'Taiwán'},
      {val: "TZ", label:'Tanzania'},
      {val: "TJ", label:'Tayikistán'},
      {val: "TF", label:'Territorios franceses del Sur'},
      {val: "TP", label:'Timor Oriental'},
      {val: "TG", label:'Togo'},
      {val: "TO", label:'Tonga'},
      {val: "TT", label:'Trinidad y Tobago'},
      {val: "TN", label:'Túnez'},
      {val: "TM", label:'Turkmenistán'},
      {val: "TR", label:'Turquía'},
      {val: "TV", label:'Tuvalu'},
      {val: "UA", label:'Ucrania'},
      {val: "UG", label:'Uganda'},
      {val: "UZ", label:'Uzbekistán'},
      {val: "VU", label:'Vanuatu'},
      {val: "VN", label:'Vietnam'},
      {val: "YE", label:'Yemen'},
      {val: "YU", label:'Yugoslavia'},
      {val: "ZM", label:'Zambia'},
      {val: "ZW", label:'Zimbabue'},
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
		{val: 'DNI', 	     label: 'DNI',                slug:'DNI' },
		{val: 'LE',        label: 'LE',                 slug:'Libreta Enrolam' },
		{val: 'LC',        label: 'LC',                 slug:'Libreta Cívica' },
		{val: 'PROV',      label: 'PROVISORIA',         slug:'Identif Provisoria' },
		{val: 'CUIL',      label: 'CUIL',               slug:'CUIL' },
		{val: 'CUIT',      label: 'CUIT',               slug:'CUIT' },
		{val: 'PAS',       label: 'PASP',               slug:'Pasaporte' },
		{val: 'CI',        label: 'CI',                 slug:'Cédula de Identidad' },
		{val: 'EXT',       label: 'DNI-EXT',            slug:'Extranjeros' },
];

const estadoCivil: Array<any> = [
		{val: 'solterx', 	     label: 'Soltero/a',        slug:'Soltero/a' },
		{val: 'casadx',        label: 'Casado/a',         slug:'Casado/a' },
		{val: 'divorciadx',    label: 'Divorciado/a',     slug:'Divorciado/a' },
		{val: 'conviviendx',   label: 'Conviviendo',      slug:'Conviviendo' },
		{val: 'otra',          label: 'Otra',             slug:'Otra' },
];

const nivelEstudios: Array<any> = [
		{val: 'primario', 	    label: 'Primario',          slug:'Primario' },
		{val: 'secundariox',    label: 'Secundario (incompleto)',    slug:'Secundario (incompleto)' },
		{val: 'secundario',     label: 'Secundario',        slug:'Secundario' },
		{val: 'terciariox',     label: 'Terciario (incompleto)',     slug:'Terciario (incompleto)' },
		{val: 'terciario',      label: 'Terciario',         slug:'Terciario' },
		{val: 'universitariox', label: 'Universitario (incompleto)', slug:'Universitario (incompleto)' },
		{val: 'universitario',  label: 'Universitario',     slug:'Universitario' },
		{val: 'posgradox',      label: 'Posgrado (incompleto)',      slug:'Posgrado (incompleto)' },
		{val: 'posgrado',       label: 'Posgrado',          slug:'Posgrado' },
		{val: 'doctoradox',     label: 'Doctorado (incompleto)',     slug:'Doctorado (incompleto)' },
		{val: 'doctorado',      label: 'Doctorado',         slug:'Doctorado' },
		{val: 'otra',           label: 'Otra',              slug:'Otra' },
];




function initNewModel(displayName:string, email:string){
  let entity = new Person(displayName, email);
  return entity;
}

function getLabel(item, list:Array<any>): string {
		if(!item) return '';

		let p = list.find(token => token.val === item)

		if(p){
			return p.label;
		}
		return ''
	}



class PersonModel {
	constructor(){

	}

    //Oficios
// const oficios_estado: Array<any> = [
// const oficios_tdato: Array<any> = [
// const oficios_tocupacion: Array<any> = [
// const oficios_umeremun: Array<any> = [
    // Datos de Contacto
    get oficiosEstadoList():Array<any>{
        return oficios_estado;
    }
    get oficiosTDatoList():Array<any>{
        return oficios_tdato;
    }
    get oficiosUmeRemunList():Array<any>{
        return oficios_umeremun;
    }
    get oficiosTOcupacionList():Array<any>{
        return oficios_tocupacion;
    }

    getEstadosVivienda(token):Array<any>{
      let arr = estados_viv.filter(t => token === t.type );
      return arr;
    }
    getEstadoVivLabel(item, token):string {      
      return getLabel(item, estados_viv.filter(t => token === t.type ));
    }

    getTiposVivienda(token):Array<any>{
      let arr = tipos_viv.filter(t => token === t.type );
      return arr;
    }
    getTiposVivLabel(item, token):string {      
      return getLabel(item, tipos_viv.filter(t => token === t.type ));
    }



    getOficiosEstadoLabel(item){
        return getLabel(item, oficios_estado);
    }
    getOficiosTDatoLabel(item){
        return getLabel(item, oficios_tdato);
    }
    getOficiosUMELabel(item){
        return getLabel(item, oficios_umeremun);
    }
    getOficiosTOcupacionLabel(item){
        return getLabel(item, oficios_tocupacion);
    }

    // Datos de Contacto
    get contactTipoList():Array<any>{
    	return contact_tdato;
    }

    getContactTipoDato(item): string {
    	return getLabel(item, contact_tdato);
    }

    get contactTypeList():Array<any>{
    	return contact_type;
    }

    getContactType(item): string {
    	return getLabel(item, contact_type);
    }
    // END Datos de Contacto


    initNew(displayName:string, email:string){
        return initNewModel(displayName, email);
    }

    getPersonDocum(p:Person|FamilyData):string{
    	let ndoc = (p.tdoc ? p.tdoc + ': ' : '') + (p.ndoc ? p.ndoc : '');
    	return ndoc ? ndoc : 'Docum no informado';
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

    get estadoCivilOL():Array<any>{
    	return estadoCivil;
    }

    getEstadoCivilLabel(item): string {
    	return getLabel(item, estadoCivil);
    }


    get persontypes():Array<any>{
    	return ptypes;
    }

    getPersonDisplayName(p:Person|FamilyData):string{
      let token = 'Sin nombre';
      if((p as Person).displayName){
        token = (p as Person).displayName;
      }

      if(p.nombre && p.apellido){
        token = p.apellido + ", " + p.nombre;
      }
      return token;
    }

    get tipoDocumPF():Array<any>{
    	return tiposCompPersonaFisica;
    }

    get paises(): Array<any> {
    	return paisesOL;
    }

    getNacionalidad(pais): string {
    	return getLabel(pais, paisesOL);
    }

    get estadosVinculo(): Array<any> {
        return estado_vinculo;
    }
    getEstadoVinculo(item): string {
        return getLabel(item, estado_vinculo);       
    }

    get vinculosFamiliares(): Array<any>{
        return vinculo_familiar;
    }

    getVinculo(item): string {
        return getLabel(item, vinculo_familiar);       
    }

    get profesiones():Array<any>{
    	return profesiones;
    }

    getProfesion(item): string {
    	return getLabel(item, profesiones);
    }

    get nivelEstudios():Array<any> {
    	return nivelEstudios;
    }

    getNivelEducativo(item):string {
    	return getLabel(item, nivelEstudios);
    }

    get countries():Array<any>{
    	return countries;
    }

    get ciudades():Array<any>{
      return ciudadesBrown;
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

