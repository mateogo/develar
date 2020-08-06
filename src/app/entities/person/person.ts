/****************************
       PERSON MODEL
=============================       
 exports:
 	Person
 	Address
 	PersonModel
****************************/
import { devutils } from '../../develar-commons/utils';

import { CardGraph, predicateType, graphUtilities, predicateLabels } from '../../develar-commons/asset-helper';

export interface PersonTable {
	personType: string;
	displayName: string;
	email: string;
};

export interface UpdateEventEmitter {
      action: string;
      ndoc: string;
      tdoc: string;

}

export interface UpdateItemListEvent {
      action: string;
      type: string;
      items: Array<PersonContactData|Address|FamilyData|BusinessMembersData|OficiosData|SaludData|CoberturaData|EncuestaAmbiental|CardGraph>;
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
      person?: Person;
};

export interface UpdateBusinessMemberEvent {
      action: string;
      type: string;
      token: BusinessMembersData;
};

export interface UpdateOficiosEvent {
      action: string;
      type: string;
      token: OficiosData;
};

export interface UpdateSaludEvent {
      action: string;
      type: string;
      token: SaludData;
};

export interface UpdateCoberturaEvent {
      action: string;
      type: string;
      token: CoberturaData;
};

export interface UpdateAmbientalEvent {
      action: string;
      type: string;
      token: EncuestaAmbiental;
};

export interface Geocoder {
  lat: number;
  lng: number;
  label: string;
}


export class Address {
    _id?: string;
    slug: string = '';
    estado: string = 'activo';
    description: string = '';
    isDefault: boolean = false;
    addType: string = 'principal';
    street1: string = '';
    street2: string = '';
    streetIn: string = '';
    streetOut: string = '';
    city: string = '';
    barrio?: string = '';
    state: string = 'buenosaires';
    statetext:string= 'Brown';
    zip: string = '';
    lat: number = 0;
    lng: number = 0;
    country: string = 'AR';
    encuesta: EncuestaAmbiental;
    estadoviv: string = 'activa';
    hasBanio?: boolean = true; // baño de uso exclusivo;
    hasHabitacion?: boolean = false; // Habitación de uso exclusivo;
    cualificacionviv: string = 'buena';
}

export class SaludData {
    type: string = '';
    tproblema: string = '';
    problema: string = '';
    fecha: string = '';
    fe_ts: number = 0;
    lugaratencion: string = '';
    slug: string = '';
}

export class CoberturaData {
    type: string = '';
    tingreso: string = '';
    slug: string = '';
    monto: number = 0;
    observacion: string = '';
    fecha: string = '';
    fe_ts: number = 0;
    estado: string = '';
}

export class DocumentData {
    type: string = '';
    slug: string = '';
    observacion: string = '';

    isTramitacionMAB: boolean;
    expedidopor: string = '';
    fechaexpe: string = '';
    tramitacionURL: string = '';
    tramitacionNro: string = '';

    fechavigencia: string = '';
    fechavigencia_ts: number = 0;
    estado: string = '';

}


export class EncuestaAmbiental {
      _id: string;
      id_address: string;
      id_person: string;
      
      street1: string;
      city: string;
      barrio: string;

      estado: string;
      ferel: number;
      fereltxt: string;
      tsocial: string;

      domterreno: string;
      aniosresid: number;
      qvivxlote: number;
      qhabitantes: number;

      tipoviv: string;
      matviv: string;
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
      iluminacion: string;
      observacion: string;
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
	tdato: string = 'CEL';
	data: string = '';
	type: string = 'PER';
	slug: string = 'Celular de contacto';
	isPrincipal: boolean = true;
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


export interface NucleoHabitacionalToken {
  address: Address;
  telefono: string;
  slug: string;
}

export interface NucleoHabitacional {
  [key: string]: NucleoHabitacionalToken;
}

export class FamilyData {
    _id?: string; 
    nombre: string = '';
    apellido: string = '';
    tdoc: string = 'DNI';
    ndoc: string = '';
    sexo: string = '';
    telefono: string = '';
    fenac: number = 0;
    fenactx: string = '';
    vinculo: string = 'contactx';
    estado: string = 'activo';
    hasOwnPerson: boolean = false;
    personId: string = '';
    nucleo: string = 'NUC-HAB-01';

    ecivil: string;
    nestudios: string;
    tocupacion: string;
    ocupacion: string;
    ingreso: string;
    desde: string;
    hasta: string;
    comentario: string = '';
}

export class BusinessMembersData {
    nombre: string;
    apellido: string;
    tdoc: string = 'DNI';
    ndoc: string;
    fenac: number = 0;
    fenactx: string;
    ecivil: string;
    email: string;
    phone: string;
    nestudios: string;
    tocupacion: string = 'seguridad';
    ocupacion: string = 'personal de prevención';
    ingreso: string;
    hasOwnPerson: boolean;
    personId: string;
    hasParentAddress: boolean = false;

    vinculo: string = 'seguridad';
    estado: string = 'activo';
    desde: string;
    hasta: string;
    comentario: string;
    assets: Array<CardGraph> = [];
}

export class BeneficiarioAlimentar {
  id: string;
  _id: string;

  ndoc:     string;
  cuil:     string;
  displayName: string;
  prov:     string;
  city:     string;
  calle:    string;
  callenro: string;
  dia:      string;
  hora:     string;
  caja:     string;
  slug:     string;
  orden:    string;
  estado:   string = 'pendiente';
  fecha:    string;
  fe_ts:    number = 0;
  email:   string;
  celular: string;


}


export class Person {
	id: string;
	_id: string;
	displayName: string;
  idbrown: string = "";// ojo
  isImported: boolean = false;// ojo

	persontags: Array<any>;
	personType: string;

	email: string;
  locacion: string;

  nombre: string;
  apellido: string;
  tdoc: string = 'DNI';
  ndoc: string;
  cuil: string;// ojo
  alerta: string;

  tprofesion: string;
  especialidad: string;
  ambito: string;
  nestudios: string;
  facetas: Array<string>;

  followUp: string = 'tsocial';

  nacionalidad: string;
  fenac: number;
  fenactx: string;
  ecivil: string;
  sexo: string;
  ts_alta: number;
  ts_umodif: number;
  user_alta: string;
  user_umodif: string;

  user: {
    userid: string;
    username: string;
  }
  communitylist: Array<string>;

  contactdata: Array<PersonContactData>;
  oficios: Array<OficiosData>;
  locaciones: Array<Address>;
  familiares: Array<FamilyData>;
  integrantes: Array<BusinessMembersData>;
  habilitaciones: Array<DocumentData>;
  permisos: Array<DocumentData>;

  salud: Array<SaludData>;
  cobertura: Array<CoberturaData>;
	messages: Array<NotificationMessage>
  ambiental: Array<EncuestaAmbiental>;
  fichas: Array<RecordCardRelation>;
  assets: Array<CardGraph>;



	audit:{
		hasUser: Boolean;
		fcreate: Date;
		fupdate: Date;
		fdelete: Date;
		estado: string;
		navance: string;
	};

	estado: string;
	navance: string;
  termscond: boolean;

  password: string;
  confirmPassword: string;
	grupos: string;
	roles: string;

  modulos: string;
	moduleroles: Array<any>;
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
        {val: 'interno',      type:'interno', label: 'Interno' },
        {val: 'externo',      type:'interno', label: 'Externo' },
        {val: 'otro',         type:'interno', label: 'Otro' },

        {val: 'cocinagas',     type:'cocina',  label: 'A gas'  },
        {val: 'cocinaelec',    type:'cocina',  label: 'Eléctrica' },
        {val: 'anafe',         type:'cocina',  label: 'Anafe'  },
        {val: 'noposee',       type:'cocina',  label: 'No posee'  },
        

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
        {val: 'adobe',        type:'mvivienda', label: 'Adobe' },
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
        {val: 'madera',       type:'piso', label: 'madera' },
        {val: 'mixtotc',      type:'piso', label: 'mixto tierra cemento' },
        {val: 'mixtocc',      type:'piso', label: 'mixto cerámica cemento' },
        {val: 'mixtoot',      type:'piso', label: 'mixto otros' },
        {val: 'ladrillo',     type:'piso', label: 'ladrillo' },
        {val: 'tierra',       type:'piso', label: 'tierra' },
        {val: 'otro',         type:'piso', label: 'otro' },

        {val: 'red',          type:'agua', label: 'red' },
        {val: 'pozo',         type:'agua', label: 'pozo' },
        {val: 'otro',         type:'agua', label: 'otro' },

        {val: 'red',          type:'electricidad', label: 'red' },
        {val: 'colgado',      type:'electricidad', label: 'enganche' },
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

const followUpOptList: Array<any> = [  
        {val: 'no_definido',  label: 'No definido',  slug:'Seleccione opción' },
        {val: 'tsocial',       label: 'TS',           slug:'TS' },
        {val: 'habitat',       label: 'Habitat',      slug:'Habitat' },
        {val: 'altaweb',       label: 'AltaWeb',      slug:'AltaWeb' },
 ];


const oficios_tdato: Array<any> = [
    {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
    {val: 'formal',       label: 'Formal' },
    {val: 'informal',     label: 'Informal' },
    {val: 'desocupado',   label: 'Desocupado' },
    {val: 'changa',       label: 'Changa' },
    {val: 'oficio',       label: 'Oficio autónomo' },
    {val: 'cuentapropia', label: 'Cuentapropista' },
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
        {val: 'seguridad',       label: 'Seguridad',      slug:'Seguridad' },
        {val: 'reciclador',      label: 'Reciclador urbano',  slug:'Reciclador urbano' },
        {val: 'microemprendim',  label: 'Microemprendimiento',  slug:'Microemprendimiento' },
        {val: 'profesional',     label: 'Profesional',    slug:'Profesional' },
        {val: 'estudiante',      label: 'Estudiante',     slug:'Estudiante' },
        {val: 'investigadxr',    label: 'Investigador/a', slug:'Investigador/a' },
        {val: 'operarix',        label: 'Operario/a',     slug:'Operario/a' },
        {val: 'amadecasa',       label: 'AmaDeCasa',      slug:'AmaDeCasa' },
        {val: 'jubiladx',        label: 'Jubilado/a',     slug:'Jubilado/a' },
        {val: 'pensionadx',      label: 'Pensionado/a',   slug:'Pensionado/a' },
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
        {val: 'pensionadx',      label: 'Pensionado/a',   slug:'Pensionado/a' },
        {val: 'docente',         label: 'Docente',        slug:'Docente' },
        {val: 'comerciante',     label: 'Comerciante',     slug:'Comerciante' },
        {val: 'prevencion',      label: 'Personal de prevención', slug:'Personal de prevención' },
        {val: 'desocupax',       label: 'Desocupado/a',    slug:'Desocupado/a' },
        {val: 'otro',            label: 'Otra ocupación',  slug:'Otra ocupación' },
];


const contact_tdato: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',slug:'Seleccione opción' },
		{val: 'CEL',   label: 'CEL',    slug:'CEL' },
		{val: 'MAIL',  label: 'MAIL',   slug:'MAIL' },
		{val: 'FAM', 	 label: 'FAM',    slug:'FAM' },
		{val: 'RSOC',  label: 'RSOC',   slug:'RSOC' },
		{val: 'TEL',   label: 'TEL',    slug:'TEL' },
		{val: 'WEB',   label: 'WEB',    slug:'WEB' },
];

const contact_type: Array<any> = [
    {val: 'no_definido',     label: 'Seleccione opción',slug:'Seleccione opción' },
    {val: 'PER',    label: 'PER',      slug:'PER' },
    {val: 'LAB',    label: 'LAB',      slug:'LAB' },
    {val: 'PADRE',  label: 'PADRE',    slug:'PADRE' },
    {val: 'MADRE',  label: 'MADRE',    slug:'MADRE' },
    {val: 'PAREJA', label: 'PAREJA',   slug:'PAREJA' },
    {val: 'REFS',   label: 'REF Social',     slug:'REFS' },
    {val: 'REFPI',  label: 'REF Intendente', slug:'REFPI' },
    {val: 'REFPC',  label: 'REF Consejal',   slug:'REFPC' },
    {val: 'REFPD',  label: 'REF Diputado/a',   slug:'REFPD' },
    {val: 'REFPO',  label: 'REF Otro/a',       slug:'REFPD' },
    {val: 'MEDICO', label: 'MEDICO/A',   slug:'MEDICO' },
    {val: 'AMIGO',  label: 'AMIGO/A',    slug:'AMIGO' },
    {val: 'VECINO', label: 'VECINO/A',   slug:'VECINO' },
];

const vinculo_familiar: Array<any> = [
        {val: 'no_definido',       label: 'Seleccione opción',slug:'Seleccione opción' },
        {val: 'pareja',   label: 'Pareja',    slug:'Pareja' },
        {val: 'esposx',   label: 'Esposo/a',  slug:'Esposo/a' },
        {val: 'hijx',     label: 'Hijo/a',    slug:'Hijo/a' },
        {val: 'padre',    label: 'Padre',     slug:'Padre' },
        {val: 'madre',    label: 'Madre',     slug:'Madre' },
        {val: 'contactx', label: 'Contacto c/riesgo contagio',  slug:'Otro c/riesgo contagio' },
        {val: 'tix',      label: 'Tío/a',     slug:'Tío/a' },
        {val: 'hermanx',  label: 'Hermana/o', slug:'Hermana/o' },
        {val: 'abuelx',   label: 'Abuela/o',  slug:'Abuela/o' },
        {val: 'nietx',    label: 'Nieto/a',   slug:'Nieto/a' },
        {val: 'sobrinx',  label: 'Sobrino/a', slug:'Sobrino/a' },
        {val: 'pariente', label: 'Pariente',  slug:'Pariente' },
        {val: 'vecinx',   label: 'Vecino/a',  slug:'Vecino/a' },
        {val: 'otro',     label: 'Otro',      slug:'Otro' },
];

const vinculo_laboral: Array<any> = [
        {val: 'no_definido',    label: 'Seleccione opción',slug:'Seleccione opción' },
        {val: 'titular',        label: 'Titular',            slug:'Titular' },
        {val: 'socio',          label: 'Socio/a',            slug:'Socio/a' },
        {val: 'apoderado',      label: 'Apoderado/a',        slug:'Apoderado/a' },
        {val: 'seguridad',      label: 'Personal de seguridad', slug:'Personal de seguridad' },
        {val: 'comercial',      label: 'Comercial',          slug:'Comercial' },
        {val: 'administrativo', label: 'Administrativo/a',   slug:'Administrativo/a' },
        {val: 'otro',           label: 'Otro',               slug:'Otro' },
];

const estado_vinculo: Array<any> = [
        {val: 'no_definido',  label: 'Seleccione opción',slug:'Seleccione opción' },
        {val: 'activo',       label: 'Activo',         slug:'Activo' },
        {val: 'fallecido',    label: 'Fallecido/a',    slug:'Fallecido/a' },
        {val: 'separado',     label: 'Separado/a',     slug:'Separado/a' },
        {val: 'abandonado',   label: 'Abandonado/a',   slug:'Abandonado/a' },
        {val: 'otro',         label: 'Otro',           slug:'Otro' },
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

const saludOptList: Array<any> = [
    {val: 'embarazo',           label: 'Embarazo',    },
    {val: 'enfermedad',         label: 'Enfermedad',    },
    {val: 'discapacidad',       label: 'Discapacidad ', },
];

const saludSubtiposOptList = {
  enfermedad: [
    {val: 'inespecifica',   label: 'Inespecifica' },
    {val: 'psiquica',       label: 'Psíquica'     },
    {val: 'motriz',         label: 'Motriz'     },
    {val: 'respiratoria',   label: 'Respiratoria'     },
    {val: 'viral',          label: 'Viral'     },
    {val: 'sexual',         label: 'Sexual'     },
    {val: 'circulatoria',   label: 'Circulatoria'     },
    {val: 'digestiva',      label: 'Digestiva'     },
    {val: 'visual',         label: 'Visual'     },
    {val: 'auditiva',       label: 'Auditiva'     },
    {val: 'percepcion',     label: 'Percepción'     },
    {val: 'piel',           label: 'Piel'     },
  ],

  embarazo: [
    {val: 'embarazo',   label: 'Embarazada' },
    {val: 'nacido',     label: 'Nacido/a' },
    {val: 'prematuro',  label: 'Prematuro/a' },
    {val: 'aborto',     label: 'Embarazo interrumpido' },
  ],

  discapacidad: [
    {val: 'inespecifica',   label: 'Inespecifica' },
    {val: 'psiquica',       label: 'Psíquica'     },
    {val: 'motriz',         label: 'Motriz'     },
    {val: 'auditiva',       label: 'Auditiva'     },
    {val: 'visual',         label: 'visual'     },
  ],

}

const coberturaOptList: Array<any> = [
    {val: 'ingreso',        label: 'Ingreso',    },
    {val: 'cobertura',      label: 'Cobertura',    },
    {val: 'pension',        label: 'Pensión',    },
    {val: 'auh',            label: 'AUH',    },
    {val: 'asisprovincial', label: 'Asis provincial',    },
    {val: 'asisnacional',   label: 'Asis nacional',    },
    {val: 'asismunicipal',  label: 'Asis municipal',    },
    {val: 'otros',          label: 'Otras coberturas/asistencias',    },
];

const estadoCoberturaOptList: Array<any> = [
    {val: 'pendiente',     label: 'Pendiente'  },
    {val: 'activa',        label: 'Activa'     },
    {val: 'suspendida',    label: 'Suspendida' },
    {val: 'baja',          label: 'Baja'       },
];


const coberturaSubtiposOptList = {
  ingreso: [
    {val: 'noposee',  label: 'No posee' },
    {val: 'ingreso',  label: 'Ingreso' },
    {val: 'salario',  label: 'Salario' },
    {val: 'changa',   label: 'Changa' },
    {val: 'oficio',   label: 'Oficio' },
    {val: 'comercio', label: 'Comercio' },
  ],
  cobertura: [
    {val: 'noposee',    label: 'No posee' },
    {val: 'osocial',    label: 'Obra Social' },
    {val: 'medprepaga', label: 'Med Prepaga' },
    {val: 'pami',       label: 'PAMI' },
  ],
  pension: [
    {val: 'noposee',   label: 'No posee' },
    {val: 'pension',   label: 'Pensión' },
  ],
  auh: [
    {val: 'noposee',    label: 'No posee' },
    {val: 'auh',        label: 'AUH' },
    {val: 'talimentar', label: 'AUH-TARJETA ALIMENTAR' },
    {val: 'aeps',       label: 'AEPS-Embarazo para Protección Social' },
    {val: 'auhdis',     label: 'AUH-Hijo discapacitado' },
  ],
  asisprovincial: [
    {val: 'noposee',     label: 'No posee' },
    {val: 'masvida',     label: 'Plan Más Vida' },
    {val: 'aprovincial', label: 'Otros planes provinciales' },
  ],
  asisnacional: [
    {val: 'noposee',   label: 'No posee' },
    {val: 'pnsa',      label: 'PlanNacSegAlim PNSA' },
    {val: 'anacional', label: 'Otros planes nacionales' },
  ],
  asismunicipal: [
    {val: 'noposee',    label: 'No posee' },
    {val: 'amunicipal', label: 'Otros planes municipales' },
  ],
  otros: [
    {val: 'noposee',   label: 'No posee' },
    {val: 'otros',     label: 'Otras coberturas/asistencias' },
  ],

}

const addressTypes: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',slug:'Seleccione opción' },
		{val: 'principal',      label: 'Principal',        slug:'Locación principal' },
		{val: 'particular',     label: 'Particular',       slug:'Domicilio particular' },
		{val: 'fiscal', 	      label: 'Fiscal',           slug:'Domicilio fiscal' },
    {val: 'dni',            label: 'DNI',              slug:'Domicilio en el DNI' },
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
    {val: 'no_definido',         cp:'1800', label: 'Seleccione opción',slug:'Seleccione opción' },
    {val: 'adrogue',             cp:'1846', label: 'Adrogué ',   slug:'Adrogué' },
    {val: 'burzaco',             cp:'1852', label: 'Burzaco ',   slug:'Burzaco' },
    {val: 'calzada',             cp:'1847', label: 'Rafael Calzada ',   slug:'Rafael Calzada' },
    {val: 'claypole',            cp:'1849', label: 'Claypole',   slug:'Claypole' },
    {val: 'donorione',           cp:'1850', label: 'Don Orione', slug:'Don Orione' },
    {val: 'glew',                cp:'1856', label: 'Glew',       slug:'Glew' },
    {val: 'longchamps',          cp:'1854', label: 'Longchamps', slug:'Longchamps' },
    {val: 'malvinasargentinas',  cp:'1846', label: 'Malvinas Argentinas',slug:'Malvinas Argentinas' },
    {val: 'marmol',              cp:'1845', label: 'J.Mármol',   slug:'J.Mármol' },
    {val: 'ministrorivadavia',   cp:'1852', label: 'Ministro Rivadavia',slug:'Ministro Rivadavia' },
    {val: 'solano',              cp:'1846', label: 'San Fco Solano',   slug:'San Fco Solano' },
    {val: 'sanjose',             cp:'1846', label: 'San José',   slug:'San José' },
    {val: 'extradistrito',       cp:'0000', label: 'Extra distrito',   slug:'Fuera del Municipio de Brown' },
];


const barriosNotDefined: Array<any> = [
    {val: 'no_definido',  label: 'No definido',slug:'No definido' },
    {val: 'centro',       label: 'Centro ',slug:'Centro' }
];

const barriosOptList = {
  adrogue: [
    {val: 'adrogue',    label: 'Adrogué Ctro' },
    {val: 'vattuone',   label: 'Vattuone'     },
    {val: 'no_definido',   label: 'No definido' },
  ],

  burzaco: [
    {val: 'burzaco',    label: 'Burzaco Ctro' },
    {val: 'elhornero',    label: 'El Hornero' },
    {val: 'lapilarica',    label: 'La Pilarica' },
    {val: 'elcanario',    label: 'El Canario' },
    {val: 'barriolindo',    label: 'Barrio Lindo' },
    {val: 'lacumbre',    label: 'La Cumbre' },
    {val: 'arzano',    label: 'Arzano' },
    {val: 'elencuentro',    label: 'El Encuentro' },
    {val: 'betharran',    label: 'Betharrán' },
    {val: 'lalucy',    label: 'La Lucy' },
    {val: 'solis',    label: 'Solís' },
    {val: 'sanpablo',    label: 'San Pablo' },
    {val: 'almafuerte',    label: 'Almafuerte' },
    {val: 'elrecuerdo',    label: 'El Recuerdo' },
    {val: 'laciudadoculta',    label: 'La Ciudad Oculta' },
    {val: 'laprimavera',    label: 'La Primavera' },
    {val: 'donalejandro',    label: 'Don Alejandro' },
    {val: 'lacarlota',    label: 'La Carlota' },
    {val: 'sakura',    label: 'Sakura' },
    {val: 'eltriangulo',    label: 'El Triángulo' },
    {val: 'viplastic',    label: 'Viplastic' },
    {val: 'parqueroma',    label: 'Parque Roma' },
    {val: 'ibañez',    label: 'Ibañez' },
    {val: 'sanjuandecorimayo',    label: 'San Juan de Corimayo' },
    {val: 'parquedecorimayo',    label: 'Parque Corimayo' },
    {val: 'corimayo',    label: 'Corimayo' },
    {val: 'primerajunta',    label: 'Primera Junta' },
    {val: 'lasrosas',    label: 'Las Rosas' },
    {val: 'elgaucho',    label: 'El Gaucho' },
    {val: 'lomasdeburzaco',    label: 'Lomas de Burzaco' },
    {val: 'luzyfuerza',    label: 'Luz y Fuerza' },
    {val: 'no_definido',   label: 'No definido' },
  ],

  calzada: [
    {val: 'calzada',    label: 'Calzada Ctro' },
    {val: '14denoviembre',    label: '14 de Noviembre' },
    {val: '2deabril',    label: '2 de Abril' },
    {val: 'sangeronimo',    label: 'San Gerónimo' },
    {val: 'asuncion',    label: 'Asunción' },
    {val: 'zabala',    label: 'Zabala' },
    {val: 'sanjavier',    label: 'San Javier' },
    {val: 'no_definido',   label: 'No definido' },
  ],

  claypole: [
    {val: 'claypole',    label: 'Claypole Centro' },
    {val: 'laesther',    label: 'La Esther' },
    {val: 'elcastillo',    label: 'El Castillo' },
    {val: 'donorione',    label: 'Don Orione' },
    {val: 'suther',    label: 'Suther' },
    {val: 'martinfierro',    label: 'Martín Fierro' },
    {val: 'cerrito',    label: 'Cerrito' },
    {val: 'conjhabitdonorione',    label: 'Conj Habit Don Orione' },
    {val: 'sideco',    label: 'Sideco' },
    {val: 'eltriangulo',    label: 'El Triángulo' },
    {val: 'lajovita',    label: 'La Jovita' },
    {val: 'lastunas',    label: 'Las Tunas' },
    {val: 'horizonte',    label: 'Horizonte' },
    {val: 'santaclara',    label: 'Santa Clara' },
    {val: 'barrioparque',    label: 'Barrio Parque' },
    {val: 'eltrebol',    label: 'El Trébol' },
    {val: 'saenz',    label: 'Sáenz' },
    {val: 'medallamilagrosa',    label: 'Medalla Milagrosa' },
    {val: 'pintemar',    label: 'Pintemar' },
    {val: 'sanlucas',    label: 'San Lucas' },
    {val: 'marianomoreno',    label: 'Mariano Moreno' },
    {val: 'monteverde',    label: 'Monteverde' },
    {val: 'sanluis',    label: 'San Luis' },
    {val: 'no_definido',   label: 'No definido' },
  ],

  donorione: [
    {val: 'donorione',    label: 'Don Orione' },
    {val: 'no_definido',   label: 'No definido' },
    {val: 'no_definido',   label: 'No definido' },
  ],

  glew: [
    {val: 'glew',    label: 'Glew Centro' },
    {val: 'gorriti',    label: 'Gorriti' },
    {val: 'uocra',    label: 'UOCRA' },
    {val: 'parqueroma',    label: 'Parque Roma' },
    {val: 'progreso',    label: 'Progreso' },
    {val: 'cotepa',    label: 'Cotepa' },
    {val: 'eltrebol',    label: 'El Trébol' },
    {val: 'losalamos',    label: 'Los Alamos' },
    {val: 'quintacastillo',    label: 'Quinta del Castillo' },
    {val: 'upcn',    label: 'UPCN' },
    {val: 'telepostal',    label: 'Telepostal' },
    {val: 'losaromos',    label: 'Los Aromos' },
    {val: 'ipona',    label: 'Ipona' },
    {val: 'villaparís',    label: 'Villa París' },
    {val: 'amancay',    label: 'Amancay' },
    {val: 'altosdeglew',    label: 'Los Altos de Glew' },
    {val: 'supa',    label: 'Supa' },
    {val: 'almafuerte',    label: 'Almafuerte' },
    {val: 'kanmar',    label: 'Kanmar' },
    {val: 'santarosa',    label: 'Santa Rosa' },
    {val: 'gendarmeria',   label: 'Gendarmería' },
    {val: 'no_definido',   label: 'No definido' },
  ],

  longchamps: [
    {val: 'longchamps',    label: 'Longchamps Centro' },
    {val: 'rayodesol',    label: 'Rayo de Sol' },
    {val: 'ampliacionsantarita',    label: 'Ampl. Santa Rita' },
    {val: 'santarita',    label: 'Santa Rita' },
    {val: 'jorgenewber',    label: 'Jorge Newber' },
    {val: 'lacarmen',    label: 'La Carmen' },
    {val: 'ferroviario',    label: 'Ferroviario' },
    {val: 'losfrutales',    label: 'Los Frutales' },
    {val: 'santaadela',    label: 'Santa Adela' },
    {val: 'camporamos',    label: 'Campo Ramos' },
    {val: 'doñasol',    label: 'Doña Sol' },
    {val: 'santamaria',    label: 'Santa María' },
    {val: 'sakura',    label: 'Sakura' },
    {val: 'laesperanza',    label: 'La Esperanza' },
    {val: 'eltriángulo',    label: 'El Triángulo' },
    {val: 'longchampseste',    label: 'Longchamps Este' },
    {val: 'casasblancas',    label: 'Casas Blancas' },
    {val: 'amutun1',    label: 'Amutun 1' },
    {val: 'amutun2',    label: 'Municipal' },
    {val: 'municipal',    label: 'Amutun 2' },
    {val: 'losstud',    label: 'Los Stud' },
    {val: 'donluis',    label: 'Don Luis' },
    {val: 'villaparis',    label: 'Villa París' },
    {val: 'amancay',    label: 'Amancay' },
    {val: 'no_definido',   label: 'No definido' },
  ],

  malvinasargentinas: [
    {val: 'malvinasargentinas',    label: 'Malvinas Argentinas' },
    {val: 'elcanario',    label: 'El Canario' },
    {val: 'barriolindo',    label: 'Barrio Lindo' },
    {val: 'lomaverde',    label: 'Loma Verde' },
    {val: 'elencuentro',    label: 'El Encuentro' },
    {val: 'betharran',    label: 'Betharrán' },
    {val: 'no_definido',   label: 'No definido' },
   ],

  marmol: [
    {val: 'marmol',    label: 'Mármol Ctro' },
    {val: 'martinarin',    label: 'Martín Arín' },
    {val: 'arca',    label: 'Arca' },
    {val: 'no_definido',   label: 'No definido' },
   ],

  ministrorivadavia: [
    {val: 'ministrorivadavia',    label: 'Ministro Rivadavia Ctro' },
    {val: 'tsuji',    label: 'Tsuje' },
    {val: 'parquerivadavia',    label: 'Parque Rivadavia' },
    {val: 'lujan',    label: 'Luján' },
    {val: 'gralbelgrano',    label: 'Gral Belgrano' },
    {val: 'lospinos',    label: 'Los Pinos' },
    {val: 'gendarmeria',    label: 'Gendarmería' },
    {val: 'no_definido',   label: 'No definido' },
  ],
  solano: [
    {val: 'solano',    label: 'Solano' },
    {val: 'nuevapompeya',    label: 'Nueva Pompeya' },
    {val: 'loschalet',    label: 'Los Chalet' },
    {val: 'loseucaliptus',    label: 'Los Eucaliptus' },
    {val: 'losmonoblock',    label: 'Los Monoblock' },
    {val: 'lastunas',    label: 'Las Tunas' },
    {val: 'zabala',    label: 'Zabala' },
    {val: 'villalaura',    label: 'Villa Laura' },
    {val: 'guadalupe',    label: 'Guadalupe' },
    {val: 'santacatalina',    label: 'Santa Catalina' },
    {val: 'sangustin',    label: 'San Agustín' },
    {val: 'lomasdesolano',    label: 'Las Lomas de Solano' },
    {val: 'santaisabel',    label: 'Santa Isabel' },
    {val: 'no_definido',   label: 'No definido' },
  ],
  sanjose: [
    {val: 'sanjose',    label: 'San José Ctro' },
    {val: 'tierradejerusalen',    label: 'Tierra de Jerusalén' },
    {val: '27demarzo',    label: '27 de marzo' },
    {val: 'sanmarcos',    label: 'San Marcos' },
    {val: 'lagloria',    label: 'La Gloria' },
    {val: '8denoviembre',    label: '8 de Noviembre' },
    {val: 'sanramon',    label: 'San Ramón' },
    {val: '8dediciembre',    label: '8 de Diciembre' },
    {val: 'latablada',    label: 'La Tablada' },
    {val: 'evita',    label: 'Evita' },
    {val: 'puertoargentino',    label: 'Puerto Argentino' },
    {val: 'launion',    label: 'La Unión' },
    {val: 'sanagustin',    label: 'San Agustín' },
    {val: 'virgendelujan',    label: 'Vírgen de Luján' },
    {val: 'elombu',    label: 'El Ombú' },
    {val: 'no_definido',   label: 'No definido' },
  ],
  extradistrito: [
    {val: 'extradistrito',    label: 'Extra distrito' },
    {val: 'no_definido',   label: 'No definido' },
    ]

};


const sexoOptList: Array<any> = [
    {val: 'F',        label: 'Femenino',      slug:'Femenino' },
    {val: 'M',        label: 'Masculino',     slug:'Masculino' },
    {val: 'GAP',      label: 'Auto percibido',slug:'Auto percibido' },
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
    {val: 'PROV',      label: 'PROVISORIA',         slug:'Identif Provisoria' },
		{val: 'LE',        label: 'LE',                 slug:'Libreta Enrolam' },
		{val: 'LC',        label: 'LC',                 slug:'Libreta Cívica' },
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
    {val: 'separadox',     label: 'Separado/a',       slug:'Separado/a' },
		{val: 'conviviendx',   label: 'Conviviendo',      slug:'Conviviendo' },
    {val: 'viudx',         label: 'Viudo/a',          slug:'Viudo/a' },
		{val: 'otra',          label: 'Otra',             slug:'Otra' },
];

const estadoVivienda: Array<any> = [
    {val: 'activa',         label: 'Activa',         slug:'Activa' },
    {val: 'archivo',        label: 'Archivada',      slug:'Archivada' },
    {val: 'ribera',         label: 'Ribera Acumar',  slug:'Ribera Acumar' },
    {val: 'destino',        label: 'Destino Acumar', slug:'Destino Acumar' },
];
const estadoPersona: Array<any> = [
    {val: 'activo',       label: 'Registro Activo',            slug:'Registro Activo' },
    {val: 'pendiente',    label: 'Pendiente de validar TS',    slug:'Pendiente de validar TS' },
    {val: 'baja',         label: 'Baja',                       slug:'Baja' },
    {val: 'invalidado',   label: 'Invalidado para ALIMENTOS',  slug:'Invalidado para ALIMENTOS' },
];

const cualificacionVivienda: Array<any> = [
    {val: 'buena',        label: 'Buena',                 slug:'Buena' },
    {val: 'precaria',     label: 'Precaria',              slug:'Precaria' },
    {val: 'acumar',       label: 'Migra s/Plan Acumar',   slug:'Migra s/Plan Acumar' },
    {val: 'inhabitable',  label: 'Riesgo habitacional',   slug:'Riesgo habitacional' },
];


const nivelEstudios: Array<any> = [
    {val: 'inicial',        label: 'Nivel inicial',           slug:'Nivel inicial' },
    {val: 'primario',       label: 'Primario',                slug:'Primario' },
		{val: 'primarioq', 	    label: 'Primario en curso',       slug:'Primario en curso' },
    {val: 'primariox',      label: 'Primario incompleto',     slug:'Primario incompleto' },
		{val: 'secundario',     label: 'Secundario',              slug:'Secundario' },
    {val: 'secundarioq',    label: 'Secundario en curso',     slug:'Secundario en curso' },
    {val: 'secundariox',    label: 'Secundario incompleto',   slug:'Secundario incompleto' },
		{val: 'terciario',      label: 'Terciario',               slug:'Terciario' },
    {val: 'terciarioq',     label: 'Terciario en curso',      slug:'Terciario en curso' },
    {val: 'terciariox',     label: 'Terciario incompleto',    slug:'Terciario incompleto' },
		{val: 'universitario',  label: 'Universitario',           slug:'Universitario' },
    {val: 'universitarioq', label: 'Universitario en curso',  slug:'Universitario en curso' } ,
    {val: 'universitariox', label: 'Universitario incompleto', slug:'Universitario incompleto' },
		{val: 'posgrado',       label: 'Posgrado',                slug:'Posgrado' },
    {val: 'posgradox',      label: 'Posgrado incompleto',     slug:'Posgrado incompleto' },
		{val: 'doctorado',      label: 'Doctorado',               slug:'Doctorado' },
    {val: 'doctoradox',     label: 'Doctorado incompleto',    slug:'Doctorado incompleto' },
    {val: 'noposee',        label: 'No Posee',                slug:'No Posee' },
		{val: 'otra',           label: 'Otra',              slug:'Otra' },
];

const obrasSociales = [
      {val: 'no_definido',  label: 'Seleccioneopción',   slug:'Seleccione opción' },
      {val: 'noposee',      label: 'No posee',  slug:'No posee' },
      {val: 'OSOCIAL',      label: 'O/SOCIAL',  slug:'O/SOCIAL' },
      {val: 'PAMI',         label: 'PAMI',      slug:'PAMI' },
      {val: 'mprivada',     label: 'Privado',   slug:'Privado' },
      {val: 'otra',         label: 'Otra',      slug:'Otra' },
];



function initNewModel(displayName:string, email:string){
  let entity = new Person(displayName, email);
  return entity;
}

function getOptListIndex(item, list:Array<any>): number {
    if(!item) return -1;
    return  list.findIndex(token => token.val === item)
}

function getLabel(item, list:Array<any>): string {
		if(!item) return '';

		let p = list.find(token => token.val === item)

		if(p){
			return p.label;
		}
		return item;
}

function getSubLabel(type, item, container): string {
    if(!item || !type) return '';
    let slist = container[type] || [];
    return getLabel(item, slist);
}

    // {val: 'no_definido',     label: 'Seleccione opción',slug:'Seleccione opción' },
    // {val: 'principal',      label: 'Principal',        slug:'Locación principal' },
    // {val: 'particular',     label: 'Particular',       slug:'Domicilio particular' },
    // {val: 'fiscal',         label: 'Fiscal',           slug:'Domicilio fiscal' },
    // {val: 'dni',            label: 'DNI',              slug:'Domicilio en el DNI' },
    // {val: 'comercial',       label: 'Comercial',        slug:'Domicilio comercial' },
    // {val: 'entrega',         label: 'Lugar entrega',    slug:'Lugar de entrega' },
    // {val: 'sucursal',       label: 'Sucursal',         slug:'Sucursal' },
    // {val: 'deposito',       label: 'Depósito',         slug:'Depósito' },
    // {val: 'admin',          label: 'Administración',   slug:'Sede administración' },
    // {val: 'fabrica',        label: 'Fabrica',          slug:'Sede fábrica' },
    // {val: 'pagos',          label: 'Pagos',            slug:'Sede pagos' },
    // {val: 'rrhh',           label: 'Recursos humanos', slug:'Sede recursos humanos' },
    // {val: 'biblioteca',     label: 'Biblioteca',       slug:'Sede Biblioteca' },
    // {val: 'dependencia',    label: 'Dependencia',      slug:'Otras dependencias' },




  function defaultAddress(list: Address[]): Address {
    let address = list[0];
    let ponderacion = 0;
    // ponderacion: 0: sin ponderar
    // ponderacion: 1: comercial|entrega|deposito|fabrica|pagos|rrhh|biblioteca|dependencia
    // ponderacion: 2: dni
    // ponderacion: 3: fiscal
    // ponderacion: 4: particular
    // ponderacion: 5: principal
    list.forEach(t => {
      if(t.addType=== 'principal'){
        address = t;
        ponderacion = 5;

      }else if(t.addType=== 'particular' && ponderacion <= 4){
        address = t;
        ponderacion = 4;

      }else if(t.addType=== 'fiscal' && ponderacion <= 3){
        address = t;
        ponderacion = 3;

      }else if(t.addType=== 'dni' && ponderacion <= 2){
        address = t;
        ponderacion = 2;

      } else {
        address = t;
        ponderacion = 1;

      }


    });


    return address;
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

    get estadosPersona():Array<any>{
        return estadoPersona;
    }

    get estadoVivOptList():Array<any>{
        return estadoVivienda;
    }
    get followUpOptList():Array<any>{
        return followUpOptList;
    }

    get cualificacionVivOptList():Array<any>{
        return cualificacionVivienda;
    }

    get sexoList():Array<any>{
      return sexoOptList;
    }

    getEstadosVivienda(token):Array<any>{
      let arr = estados_viv.filter(t => token === t.type );
      return arr;
    }
    getEstadoVivLabel(item, token):string {      
      return getLabel(item, estados_viv.filter(t => token === t.type ));
    }

    getEstadoPersonaLabel(item):string {
      return getLabel(item, estadoPersona);

    }

    getTiposVivienda(token):Array<any>{
      let arr = tipos_viv.filter(t => token === t.type );
      return arr;
    }
    getTiposVivLabel(item, token, prefix?):string {
      let data = getLabel(item, tipos_viv.filter(t => token === t.type ));
      if(data && prefix) data = prefix + ' ' + data;
      return data;
    }


    getFollowUpLabel(item){
        return getLabel(item, followUpOptList);
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
    getSexoLabel(item){
        return getLabel(item, sexoOptList);
    }

    // Datos de Salud
    get saludTypeList():Array<any>{
    	return saludOptList;
    }

    getSaludTypeDato(item): string {
      return getLabel(item, saludOptList);
    }

    getSaludSubTypeDato(type, item): string {
      return getSubLabel(type, item, saludSubtiposOptList);
    }


    getSaludSubTypeList(type): Array<any> {
      return saludSubtiposOptList[type] || saludSubtiposOptList['enfermedad'];
    }

    // Datos de Cobertura
    get coberturaTypeList():Array<any>{
      return coberturaOptList;
    }

    getObraSocial(coberturas: CoberturaData[]): CoberturaData{
      if(coberturas && coberturas.length){
        let cobertura = coberturas.find(t=>{
          if(t.estado === 'activa' && t.type === 'cobertura') return true;
          else return false;
        })
        return cobertura;

      }else {
        return null
      }

    }

    setObraSocial(coberturas: CoberturaData[], tingreso: string, slug: string ): CoberturaData[]{
      let cobertura: CoberturaData;
      let hoy = new Date();
      coberturas = coberturas || [];

      if(coberturas && coberturas.length){
        cobertura = coberturas.find(t=>{
          if(t.estado === 'activa' && t.type === 'cobertura') return true;
          else return false;
        })

      }

      if(cobertura){
        cobertura.tingreso = tingreso;
        cobertura.slug = slug;
        cobertura.monto = 0;
        cobertura.estado = 'activa';
        cobertura.observacion = cobertura.observacion  || 'Informado en investigación epidemiológica COVID';
        cobertura.fecha = cobertura.fecha || devutils.txFromDate(hoy);
        cobertura.fe_ts = cobertura.fe_ts  || hoy.getTime();
        cobertura.estado = 'activa';

      }else {
        cobertura = new CoberturaData();
        cobertura.type = 'cobertura';
        cobertura.tingreso = tingreso ;
        cobertura.slug = slug;
        cobertura.monto = 0;
        cobertura.observacion = 'Informado en investigación epidemiológica COVID';
        cobertura.fecha = devutils.txFromDate(hoy);
        cobertura.fe_ts = hoy.getTime();
        cobertura.estado = 'activa';

        coberturas.push(cobertura);
      }

      return coberturas;

    }

    getCoberturaTypeDato(item): string {
      return getLabel(item, coberturaOptList);
    }

    getCoberturaSubTypeDato(type, item): string {
      return getSubLabel(type, item, coberturaSubtiposOptList);
    }

    getCoberturaSubTypeList(type): Array<any> {
      return coberturaSubtiposOptList[type] || coberturaSubtiposOptList['ingreso'];
    }

    get coberturaOptList():Array<any>{
      return estadoCoberturaOptList;
    }

    getCoberturaEsadoLabel(item){
        return getLabel(item, estadoCoberturaOptList);
    }

    // END Datos de cobertura

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


    initNew(displayName:string, email:string){
        return initNewModel(displayName, email);
    }

    getPersonDocum(p:Person|FamilyData|BusinessMembersData):string{

    	let ndoc = (p.ndoc ? p.ndoc : '');

      if(ndoc){
        ndoc = (p.tdoc ? p.tdoc + ': ' + ndoc : ndoc);
      }

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

    fetchDefaultAddress(list: Address[]): Address {
      if(!list || !list.length) return null;
      if(list.length === 1) return list[0];
      return defaultAddress(list);

    }

    fetchCP(city){
      let index = getOptListIndex(city, ciudadesBrown);
      if(index !== -1){
        return ciudadesBrown[index].cp;
      }else {
        return '';
      }

    }

    displayAddress(list: Address[]): string {
      let data = ''
      let address: Address;
      if(list && list.length) {
        address = this.fetchDefaultAddress(list);
        data = address.street1 + ' ' + this.getCiudadLabel(address.city); 

      }

      return data;
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

    getPersonDisplayName(p: Person|FamilyData|BusinessMembersData):string{
      let token = (p as Person).displayName;

      if((p as Person).personType === 'fisica'){
        return this.getPersonFamilyName(p);
      }

      return token || this.getPersonFamilyName(p) || 'Sin nombre';
    }

    getPersonFamilyName(p:Person|FamilyData|BusinessMembersData):string{
      let token = (p as Person).displayName;

      if(!token && p.nombre && p.apellido || (p as Person).personType !== "fisica"){
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

    get vinculosLaborales(): Array<any>{
        return vinculo_laboral;
    }
    getVinculoLaboral(item): string {
        return getLabel(item, vinculo_laboral);
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

    get osociales():Array<any> {
      return obrasSociales;
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
  
    getCiudadLabel(item):string{
      return getLabel(item, ciudadesBrown);
    }

    getBarrioList(type): Array<any> {
      console.log('getBarrioList: [%s]', type)
      if(!type) return barriosNotDefined
      return barriosOptList[type] || barriosNotDefined;
    }

    getBarrioLabel(type, item):string {
      return getLabel(item, (barriosOptList[type] || barriosNotDefined));
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

    hasMinimumDataToBePerson(p: BusinessMembersData | FamilyData): boolean{
      let acceptable = true;

      if(!(p.nombre && p.apellido && p.tdoc && p.ndoc)){
        acceptable = false;
      }

      return acceptable;
    }

    buildFamilyDataFromPerson(p:Person, fam:FamilyData):FamilyData{
      if(!fam) fam = new FamilyData();

      fam.nombre = p.nombre;
      fam.apellido = p.apellido;
      fam.tdoc = p.tdoc;
      fam.ndoc = p.ndoc;
      fam.sexo = p.sexo;
      fam.fenactx = p.fenactx;
      fam.fenac = p.fenac || devutils.dateNumFromTx(p.fenactx);
      fam.ecivil = p.ecivil;
      fam.nestudios = p.nestudios;
      fam.tocupacion = p.tprofesion;
      fam.ocupacion = p.especialidad;

      fam.hasOwnPerson = true;
      fam.personId = p._id;

      return fam;
    }

    buildBusinessMemberFromPerson(p:Person, member:BusinessMembersData): BusinessMembersData{
      if(!member) member = new BusinessMembersData();

      member.nombre = p.nombre;
      member.apellido = p.apellido;
      member.tdoc = p.tdoc;
      member.ndoc = p.ndoc;
      member.fenactx = p.fenactx;
      member.fenac = p.fenac || devutils.dateNumFromTx(p.fenactx);
      member.ecivil = p.ecivil;
      member.nestudios = p.nestudios;
      member.tocupacion = p.tprofesion;
      member.ocupacion = p.especialidad;

      member.hasOwnPerson = true;
      member.personId = p._id;

      return member;
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

// actualiza un campo del ítem ièsimo del array
db.personas.updateOne({"_id" : ObjectId("5ed2b61e6d180d380de635cb")},{$set: {'familiares.0.nombre':'MACARENA ROCIO'}})

***/

