import { ArrayDataSource, CollectionViewer } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map } from 'rxjs/operators';


import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../salud.model';
import { Person, Address }   from '../../entities/person/person';
import { sectores } from '../salud.model';

//Pointers:
//  fwup AfectadoFollowUp
//  avigi Asistencia
// icovid: InfectionFollowUp

export class Requirente {
		id:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string;
		sexo?: string;
		fenac?: string;
		edad?: number;
		nombre?: string;
		apellido?: string; 
};
 
export class Atendido {
		id:      string;
		slug:    string;
		sector:  string;
};

export class Audit {
	userId:      string;
	username:    string;
	ts_alta: number;
};

export interface Tile {
		dia:      number;
		mes:      number;
		sem:      string;
		fenac:    number;
		ciudad:   string;
		sexo:     string;
		edadId:   string;
		estado:   string;
		avance:   string;
		action?:   string;
		sintoma?:  string;
		sector:   string;
		cardinal: number;
		id:       string;
}

export class Alimento {
		id:          string;
		type:        string ;
		periodo:     string = 'UNICO';
		fe_tsd:      number;
		fe_tsh:      number;
		fe_txd:      string;
		fe_txh:      string;
		freq:        string = 'unica';
		qty:         number = 1;
		observacion: string;
};

export class Modalidad {
		periodo:     string = 'UNICO';
		fe_tsd:      number = 0;
		fe_tsh:      number = 0;
		fe_txd:      string;
		fe_txh:      string;
		freq:        string = 'unica';
}

export class ItemPedido {
	slug: string;

	kitItem: number = 0; // 0: es un item cargado a mano 1: item que deviene de KIT
	productId: string;
	code: string;
	name: string;
	ume: string;
	qty: number = 1;
	punitario: number = 0;

}

export interface VoucherType {
  type: string;
  label: string;
  key: string;
  isRemitible: boolean;
  payload: Alimento|Pedido;

}


export class Pedido {
		id:             string;
		modalidad: Modalidad;
		type: string;

		deposito:       string;
    urgencia:       number = 1;
    kitId:          string;
    kitQty:         number = 1;
    observacion:    string;
    causa:          string;

		estado:         string = 'activo';
		avance:         string = 'emitido';
    items: Array<ItemPedido>  = [];
};



export class Encuesta {
		id:           string;
		fe_visita:    string;
		fe_visita_ts: number;
		locacionId:   string;
		ruta:         string;
		trabajador:   string;
		trabajadorId: string;
    urgencia:     number = 1;
    city:         string = '';
    barrio:       string = '';
		preparacion:  string;
		estado:       string = 'activo';
		avance:       string = 'programado';
		evaluacion:   string;

};
export class AvancesNovedad {
		fe_nov: string;
		fets_nov: number = 0;
		ejecucion: string = ''; //ejecucionOptList
		sector: string = '';
		intervencion: string = '';
		slug: string = '';
		isCumplida: boolean = false;
		userId: string;
		userSlug: string;
}


export class Novedad {
		_id?: string;
		isActive: boolean = false;
		tnovedad: string = 'operadorcom'; //novedadesTypeOptList
		novedad: string = '';
		sector: string = '';  // salud.model.sectores
		intervencion: string = ''; // intervencionOptList
		urgencia: number = 0; // 1,2,3

		fecomp_txa:  string;
		fecomp_tsa:  number;

		hasNecesidad: boolean = false;
		fe_necesidad: string = '';
		fets_necesidad: number = 0;

		hasCumplimiento: boolean = false;
		estado: string = 'activa'; // estadosOptList
		avance: string = 'emitido'; // deprecated
		ejecucion: string = 'emitido'; // ejecucionOptList

		actividades: AvancesNovedad[] = [];
		atendidox: Atendido;

		constructor(){
			let hoy = new Date();

			this.fecomp_tsa = hoy.getTime();
			this.fecomp_txa = devutils.txFromDate(hoy);
		}
}

export class ContextoDenuncia {
		denunciante: string; 
		dendoc: string;
		dentel: string;
		inombre: string;
		iapellido: string; 
		islug: string; 
}

export class ContextoCovid {
	hasFiebre: boolean = false;
	fiebreTxt: string = 'cree';
	fiebre: number = 37;
	fiebreRB: number = 3;

	hasViaje: boolean = false;
	hasContacto: boolean = false;
	hasEntorno: boolean = false;

	hasTrabajoAdulMayores: boolean = false;
	hasTrabajoHogares: boolean = false;
	hasTrabajoPolicial: boolean = false;
	hasTrabajoHospitales: boolean = false;
	hasTrabajoSalud: boolean = false;
	// sintomas
	hasSintomas:boolean = false;

	hasDifRespiratoria: boolean = false;
	hasDolorGarganta: boolean = false;
	hasTos: boolean = false;
	hasNeumonia:boolean = false;
	hasDolorCabeza:boolean = false;
	hasFaltaGusto: boolean = false;
	hasFaltaOlfato: boolean = false;
	sintomas: string;

	hasDiarrea:boolean = false;
	hasDiabetes:boolean = false;
	hasHta:boolean = false;
	hasCardio:boolean = false;
	hasPulmonar:boolean = false;
	hasEmbarazo:boolean = false;
	hasCronica:boolean = false;
	hasFumador:boolean = false;
	hasObesidad:boolean = false;
	comorbilidad: string = "" // observaciones y otras comorbilidades

	fe_inicio: string = '' // InfectionFollowUp.fe_inicio //fecha de inicio de síntomas
	sintoma: string = "sindato" // estado general InfectionFollowUp.sintoma
	fe_prevAlta: string = '' // InfectionFollowUp.fe_alta //fecha prevista de alta para el caso covid confirmado
	isInternado: boolean = false; // InfectionFollowUp.isInternado;
	tinternacion: string = 'nointernado' // tipo de internacion // tinternacionOptList
	internacionSlug: string = '' // lugar de internación
	derivacion: string //si necesita derivación // derivacionOptList
	derivaSaludMental: boolean = false;
	derivaDesarrollo: boolean = false;
	derivaHisopado: boolean = false;
	derivaOtro: boolean = false;
	derivacionSlug: string = ''; 

	trabajo: string;   // InfectionFollowUp.trabajo
	trabajoSlug: string; // InfectionFollowUp.trabajoTxt

	contexto: string;

	esperaMedico: boolean = false;
	vistoMedico: boolean = false;
	indicacion: string;
	problema: string;

	necesitaSame:    boolean = false;
	esperaTraslado:  boolean = false;
	estaInternado:   boolean = false;
	estaEnDomicilio: boolean = false;

	hasCOVID: boolean = false;
	isCOVID: boolean = false;
	//
	fe_investig: string = '';
	fets_investig: number = 0;
	userInvestig: string = '';
	userId: string = '';
	actualState: number;
	avanceCovid: string;
}

export class CasoIndice {
	parentId: string;
	slug: string;
	actualState: number;
	nucleo: string;
}

export class Locacion {
    _id?: string;
    street1: string = '';
    street2: string = '';
    streetIn: string = '';
    streetOut: string = '';
    hasBanio?: boolean = false;
    hasHabitacion?: boolean = false;
    city: string = '';
    barrio?: string = '';
    lat: number = 0;
    lng: number = 0;
    zip: string = '';
}

// avigi
export class Asistencia {
		_id: string;
		compPrefix:  string = 'SOL';
		compName:    string = 'S/Asistencia';
		compNum:     string = '00000';
		tipo:        number = 1; // 1: COVID 2:Denuncia  3:IVR 4:Detectar
		prioridad:   number = 2; // 1:baja 2:media 3: alta

		idPerson:    string;
		ndoc:        string;
		tdoc:        string;
		sexo:        string;
		fenactx:     string;
		edad:        string;
		telefono:    string;
		osocial:     string;
		osocialTxt:  string;

		contactosEstrechos?:number = 0; // helper de listado

		idbrown:     string;
		fecomp_tsa:  number;
		fecomp_txa:  string;
		fenotif_tsa:  number;
		fenotif_txa:  string;

		action:      string = 'covid';
		slug:        string;
		description: string;

		sector:      string;
		estado:      string = 'activo';
		avance:      string = 'emitido';
		ts_alta:     number;
		ts_fin:      number;
		ts_prog:     number;

		sintomacovid: ContextoCovid;
		denuncia: ContextoDenuncia;

		locacion:    Locacion;
		requeridox:  Requirente;
		atendidox:   Atendido;

		modalidad:   Alimento;
		encuesta:    Encuesta;
		pedido:      Pedido;

		isVigilado:     boolean;
		hasSeguimiento: boolean;
		isCovid:        boolean;
		isInternado:    boolean;
		hasParent:      boolean;
		casoIndice:   CasoIndice;

		infeccion:    InfectionFollowUp;
		internacion:  InternacionAsis;
		sisaevent:    SisaEvent;
		followUp:     AfectadoFollowUp;

		novedades:         Array<Novedad>;
		muestraslab:       Array<MuestraLaboratorio>;
		sisaEvolucion:     Array<SisaEvolucion>;
		seguimEvolucion:   Array<AfectadoUpdate>;
		contextoAfectados: Array<ContextoAfectados>;
		morbilidades:      Array<Morbilidad>;
};

// modo de contagio
const avanceInfectionOptList = [
	{ val: 'comunitario', label: 'Comunitario'},
	{ val: 'contacto',    label: 'Contacto estrecho'},
	{ val: 'nexo',        label: 'Contacto conviviente'},
	{ val: 'viaje',       label: 'Por viaje'},
	{ val: 'essalud',     label: 'Es personal de salud'},
	{ val: 'esesencial',  label: 'Es personal esencial'},
	{ val: 'internacion', label: 'Internación previa'},
	{ val: 'sinnexo',     label: 'Sin nexo epidemiológico'},
	{ val: 'otro',        label: 'Otro'},
	{ val: 'sindato',     label: 'Sin dato'},

];

const sintomaOptList = [
	{ val: 'asintomatico',   label: 'Asintomático'},
	{ val: 'sintomatico',    label: 'Sintomático: Leve'},
	{ val: 'bueno',          label: 'Sintomático: Bueno'},
	{ val: 'regular',        label: 'Sintomático: Regular'},
	{ val: 'malo',           label: 'Sintomático: Malo'},
	{ val: 'grave',          label: 'Sintomático: Grave'},
	{ val: 'uti',            label: 'UTI'},
	{ val: 'arm',            label: 'ARM'},
	/** { val: 'enrecuperacion', label: 'En recuperación'}, */
	{ val: 'alta',           label: 'Alta'},
	{ val: 'fallecido',      label: 'Fallecido'},
	{ val: 'sindato',        label: 'Sin dato'},
	
];

const tinternacionOptList = [
	{ val: 'nointernado',    label: 'No internado'},
	{ val: 'domiciliaria',   label: 'Domiciliaria'},
	{ val: 'aislamiento',    label: 'Aislamiento'},
	{ val: 'internacion',    label: 'HOSP-Sala común'},
	{ val: 'uti',            label: 'HOSP-UTI'},
	{ val: 'obito',          label: 'Óbito'},
	{ val: 'alta',           label: 'ALTA'},
];

const derivacionOptList = [
	{ val: 'norequiere',    label: 'Ninguno'},
	{ val: 'domiciliaria',  label: 'En domicilio'},
	{ val: 'aislamiento',   label: 'Centro de aislamiento'},
	{ val: 'hospitalario',  label: 'Centro hospitalario'},
	{ val: 'privado',       label: 'Derivación a inst privada'},
];

const lugartrabajoOptList = [
	{ val: 'municipal',       label: 'Trabajador/a Municipal'},
	{ val: 'seguridad',       label: 'Cuerpos y Fuerzas de Seguridad'},
	{ val: 'salud',           label: 'Trabajador/a de la Salud'},
	{ val: 'geriatrico',      label: 'Geriátrico'},
	{ val: 'hogar',           label: 'Hogar/Merendero'},
	{ val: 'logistica',       label: 'Lógistica/ Transporte'},
	{ val: 'enfermerodom',    label: 'Atiende persona dependiente (a domicilio)'},
	{ val: 'bombero',         label: 'Bombero'},
	{ val: 'comercio',        label: 'Comercio/Empresa'},
	{ val: 'limpieza',        label: 'Limpieza'},
	{ val: 'atiendepúblico',  label: 'Otro atiende público'},
	{ val: 'cuentapropia',    label: 'Cuenta propia'},
	{ val: 'amadecasa',       label: 'Ama de casa'},
	{ val: 'industria',       label: 'Industria'},
	{ val: 'oficio',          label: 'Oficio independiente'},
	{ val: 'otro',            label: 'Otro'},
	{ val: 'sindato',         label: 'Sin dato'},
];

const institucionalizadoOptList = [
	{ val: 'noinstitucionalizado', label: 'No institucionalizado'},
	{ val: 'geriatrico',  label: 'Geriátrico'},
	{ val: 'seguridad',   label: 'Comisaría'},
	{ val: 'hogar',       label: 'Hogar'},
	{ val: 'salud',       label: 'Hospital'},
	{ val: 'otro',        label: 'Otro'},
	{ val: 'sindato',     label: 'Sin dato'},
];

// icovid
export class InfectionFollowUp {
	isActive: boolean = false;
	isInternado: boolean = false;
	isExtradistrito: boolean = false;
	hasCovid: boolean = false;

	actualState: number = 6 // 0:sano; 1:COVID; 2:Recuperado; 3: Descartado; 4: Fallecido; 5: alta
													//estadoActualAfectadoOptList
	mdiagnostico: string = 'noconfirmado'; //mdiagnosticoOptList

	fe_inicio: string = '';  
	fe_confirma: string = '';
	fe_alta: string = '';

	avance: string = 'sindato'; //avanceInfectionOptList
	sintoma: string = 'sindato'; // sintomaOptList
	locacionSlug: string = '' // lugar de internación
	tinternacion: string = 'nointernado'; // tipo de internacion

	institucion: string = 'noinstitucionalizado'; //institucionalizadoOptList
	institucionTxt: string = 'No institucionalizado';

	trabajo: string = 'sindato'; //lugartrabajoOptList
	trabajoTxt: string = ''; 

	qcoworkers:  number = 0;
	qcovivientes: number = 0 ;
	qotros: number = 0;
	slug: string = '';

	fets_inicio: number = 0; 
	fets_confirma: number = 0;
	fets_alta: number = 0;
}

// extra-distrito: TOTO
const estadoActualAfectadoOptList = [
	{ val: 0, label: 'SOSPECHA'},
	{ val: 1, label: 'COVID+'},
	{ val: 2, label: 'DESCARTADO'},
	{ val: 4, label: 'FALLECIDO'},
	{ val: 5, label: 'DE ALTA'},
	{ val: 6, label: 'EN MONITOREO'},
];

// Método de Diagnóstico COVID
const mdiagnosticoOptList = [
	{ val: 'noconfirmado', label: 'NO CONFIRMADO'},
	{ val: 'laboratorio',  label: 'LABORATORIO'},
	{ val: 'nexo',         label: 'NEXO EPIDEMIOLÓGICO'},
	{ val: 'clinica',      label: 'CLÍNICA'},
	{ val: 'descartado',   label: 'DESCARTADO'},
];

const tipoLocacionOptList = [
	{val: 'HOSP:DIS',    enDistrito: true, tipo: 'HOSP', isPublica: true,   label: 'Hospital (DIS)'},
	{val: 'AISL:DIS',    enDistrito: true, tipo: 'AISL', isPublica: true,   label: 'Aislam (DIS)'},
	{val: 'CAPS:DIS',    enDistrito: true, tipo: 'CAPS', isPublica: true,   label: 'CAPS (DIS)'},
	{val: 'PRIV:DIS',    enDistrito: true, tipo: 'PRIV', isPublica: false,  label: 'Clínica (DIS)'},
	{val: 'HOGAR:DIS',   enDistrito: true, tipo: 'HOME', isPublica: false,  label: 'En domicilio (DIS)'},

	{val: 'HOSP:XDIS',   enDistrito: true, tipo: 'HOSP', isPublica: true,   label: 'Hospital (X-DIS)'},
	{val: 'AISL:XDIS',   enDistrito: true, tipo: 'AISL', isPublica: true,   label: 'Aislam (X-DIS)'},
	{val: 'CAPS:XDIS',   enDistrito: true, tipo: 'CAPS', isPublica: true,   label: 'CAPS (X-DIS)'},
	{val: 'PRIV:XDIS',   enDistrito: true, tipo: 'PRIV', isPublica: false,  label: 'Clínica (X-DIS)'},
	{val: 'HOGAR:XDIS',  enDistrito: true, tipo: 'HOME', isPublica: false,  label: 'En domicilio (X-DIS)'},
];

const tipoCuidadoOptList = [
    {val: 'intensivos',    label: 'CUIDADOS INTENSIVOS'     },
    {val: 'intermedios',   label: 'CUIDADOS INTERMEDIOS'    },
    {val: 'pediatrica',    label: 'ATENCIÓN PEDIÁTRICA'     },
    {val: 'aislamiento',   label: 'AISLAMIENTO PREVENTIVO'  },
    {val: 'ambulatorios',  label: 'SERVICIO AMBULATORIO'    },
];


export class InternacionAsis {
		isActive: boolean; // si hay internación activa en este momento.
		tipoCuidado: string; // tipoCuidadoOptList
		tipoLocacion: string; // tipoInternacionOptList HOS/AIS/HOGAR

		locacionId:         string;
		locacionSlug:       string;
		locacionTxt:        string;
		fe_internacion:     string;
		fe_alta:            string; 
		hasSolinternacion:  boolean;
}


const avanceSisaOptList = [
    {val: 'sospecha',       label: 'Sospecha'        },
    {val: 'confirmado',     label: 'Confirmado'      },
    {val: 'descartado',     label: 'Descartado'      },
    {val: 'contacto',       label: 'Contacto de caso COVID'    },
    {val: 'sindato',        label: 'Sin dato'       },
];

export class SisaEvent {
	isActive:     boolean = false; // si hay registro en sisa en este momento.
	sisaId:       string = '';
	reportadoPor: string = 'MAB';

	fe_reportado: string = ''; 
	fe_baja:      string = ''; 
	fe_consulta: string = ''; 
	avance:       string = 'sospecha'; //avanceSisaOptList
	slug:         string = '';

	fets_reportado: number = 0;
	fets_baja:      number = 0;
	fets_consulta:  number = 0;
}

export class SisaEvolucion {
	fe_consulta:  string = ''; 
	isActive:     boolean = true;
	avance:       string = ''; //avanceSisaOptList
	slug:         string = '';

	fets_consulta:  number = 0;
}

const tipoMuestraLaboratorioOptList = [
	{ val: 'hisopadopcr', label: 'Hisopado:PCR' },
];

const estadoMuestraLaboratorioOptList = [
	{ val: 'presentada', label: 'Presentada' },
	{ val: 'norecibida', label: 'No recibida por el Lab' },
	{ val: 'nopresentada',  label: 'No figura en SISA'  },
];

const locMuestraOptList = [
	{ val: 'emergen107', label: 'Emergencia/107' },
	{ val: 'detectar',   label: 'Operativo DeTecTar' },
	{ val: 'CAPS01',     label: 'CAPS-01 Min Rivadavia' },
	{ val: 'CAPS06',     label: 'CAPS-06 Los álamos' },
	{ val: 'CAPS12',     label: 'CAPS-12 Don Orione' },
	{ val: 'CAPS15',     label: 'CAPS-15 Glew 2' },
	{ val: 'CAPS16',     label: 'CAPS-16 Rafael Calzada' },
	{ val: 'CAPS26',     label: 'CAPS-26 USAmb Burzaco' },
	{ val: 'otro',       label: 'Otro/ extra-Muni'  },
];

const resultadoMuestraLaboratorioOptList = [
	{ val: 'confirmada',  label: 'Positiva / Detectable'    },
	{ val: 'descartada',  label: 'Negativa / No detectable' },
	{ val: 'pendiente',   label: 'Pendiente resultado'  },
	{ val: 'noanalizada', label: 'No apta para análisis'  },
	{ val: 'invalidada',  label: 'No cumple criterio epidemio' },
];

		// estado: verificado|no_verificado|invalido
		// resultado: pcr_positivo, pcr_negativo, sisa_descartó, sisa_invalidó

export class MuestraLaboratorio {
	_id?: string; 
	isActive: boolean = true;

	secuencia: string = '1ER LAB'; // labsequenceOptList

	muestraId: string = '';
	fe_toma: string = '';
	tipoMuestra: string = 'hisopado'; // tipoMuestraLaboratorioOptList

	locacionId: string = ''; // locMuestraOptList
	locacionSlug: string = '';

	laboratorio: string = '';
	laboratorioTel: string = '';

	metodo: string = 'pcr';

	fe_resestudio: string = ''; 
	fe_notificacion: string = ''; 

	alerta: string = ''; 

	estado: string = 'presentada';   // estadoMuestraLaboratorioOptList
	resultado: string = 'pendiente'; //resultadoMuestraLaboratorioOptList
	slug: string = ''; 

	fets_toma: number = 0;
	fets_resestudio: number = 0; 
	fets_notificacion: number = 0; 

}

export class ContextoAfectados {
	personId: string;
	slug: string;
	relacion: string;
	hasActiveCovid: boolean;
	hasActiveFollowing: boolean;
} 



const tipoSeguimientoAfectadoOptList = [
	{ val: 'sospecha',  label: 'Sospecha'},
	{ val: 'infectado', label: 'Confirmado'},
	{ val: 'monitoreo', label: 'Monitoreo'},
];

const faseAfectadoOptList = [

	{ val: 'fase0',      label: 'Investigación epidemiológica'},
	{ val: 'fase1',      label: 'Primera fase seguimiento'},
	{ val: 'fase2',      label: 'Segunda fase seguimiento'},
	{ val: 'finalizado', label: 'Seguimiento finalizado'},

];



export class AsignadosSeguimiento {
	userId: string;
	userSlug: string;
	userArea: string;
}


// fwup
export class AfectadoFollowUp {
	isActive: boolean = false;
	isAsistido: boolean = false; // se le hace seguimiento asistencial?

	altaVigilancia: boolean = false; // no se le hace más seguimiento epidemiológico, caso de alta
	altaAsistencia: boolean = false; // no se le hace más seguimiento asistencial

	fe_inicio: string = '';
	fe_ucontacto: string = '';
	fe_ullamado: string = '';

	parentId: string;   // caso indice: ID de la SOL/Asistencia
	parentSlug: string; // caso índice

	qllamados: number = 0;   // llamados totales
	qcontactos: number = 0; // llamados con respuesta del afectado

	lastCall: string = 'logrado';// resultadoSeguimientoOptList 'pendiente|logrado|nocontesta'
	qIntents: number = 0;

	tipo: string = 'sospecha'; //tipoSeguimientoAfectadoOptList
	sintoma: string = 'sindato'; //sintomaOptList
	vector: string = 'inicia'; //vectorSeguimientoOptList
	fase: string = 'fase0' //faseAfectadoOptList

	// asignados: Array<AsignadosSeguimiento> = [];
	slug: string = 'Inicia seguimiento de afectado/a';


	//Caso indice asignado a... 
	isAsignado: boolean = false;
	asignadoId: string = '';
	asignadoSlug: string = '';

	//Es contacto, y por lo tanto es monitoreado por...
	isContacto: boolean = false;
	derivadoId: string = '';
	derivadoSlug: string = '';


	fets_inicio:    number = 0;
	fets_ucontacto: number = 0;
	fets_ullamado:  number = 0;

}

const resultadoSeguimientoOptList = [
	{ val: 'logrado',      label: 'Logrado'},
	{ val: 'nocontesta',   label: 'No contesta'},
	{ val: 'notelefono',   label: 'Teléfono incorrecto/ inexistente'},
];

const vectorSeguimientoOptList = [
	{ val: 'inicia',    color:'#efefef', background: '#423bff', label: 'Inicia seguimiento'},
	{ val: 'estable',   color:'#efefef', background: '#807d00', label: 'Evolución estable'},
	{ val: 'mejora',    color:'#efefef', background: '#008f00', label: 'Mejoría/ Favorable'},
	{ val: 'desmejora', color:'#efefef', background: '#b51835', label: 'Desmejora/ Desfavorable'},
	{ val: 'sindato',   color:'#efefef', background: '#5d5d5d', label: 'Sin dato'},
];

export class AfectadoUpdate {
	isActive: boolean = false;
	isAsistido: boolean = false;
	altaVigilancia: boolean = false; // no se le hace más seguimiento epidemiológico, caso de alta
	altaAsistencia: boolean = false; // no se le hace más seguimiento asistencial


	fe_llamado: string = '';
	resultado: string = ''; // resultadoSeguimientoOptList
	tipo: string = 'sospecha'; //tipoSeguimientoAfectadoOptList
	
	internadoFup: number = 0; // helper para edicion
	locacionSlug: string = '' // helper para edicion

	vector: string = 'inicia'; //vectorSeguimientoOptList
	sintoma: string = ''; // sintomaOptList
	slug: string = ''; // mensaje
	indicacion: string = ''; // mensaje

	fets_llamado: number = 0;
	audit: Audit;
}


const activeMorbilidadOptList = [
	{ val: 'hereditaria',    label: 'Hereditaria'},
	{ val: 'cronica',    label: 'Crónica'},
	{ val: 'presente',    label: 'Presente'},

];
const tipoMorbilidadOptList = [
	{ val: 'cardíaca',        label: 'Cardíaca'},
	{ val: 'respiratoria',    label: 'Respiratoria'},
	{ val: 'infeccion',       label: 'Infección'},
	{ val: 'fiebre',          label: 'Fiebre'},
	{ val: 'epoc',            label: 'EPOC'},
	{ val: 'otra',            label: 'Otra'},

];
export class Morbilidad {
	active:  string; //activeMorbilidadOptList
	tipo:    string; // tipoMorbilidadOptList
	hasTipo: boolean;
	qty:     number;
	slug:    string;
}


function buildDomiciliosData(list: Array<any>): AsistenciaTable[]{
		return list.map(token => {
			let td = new AsistenciaTable();

			td.asistenciaId = token.parentId;
			td.personSlug = token.parentSlug;
			td.ndoc = token.ndoc;
			td.fecomp_tsa = token.fets_confirma;
			td.fecomp_txa = token.fe_confirma;

			td.action = 'apoyoAislamiento';


			td.locacion = token.address;
			td.city = token.city;
			td.barrio = token.barrio;
			td.street2 = token.street2;
			td.nucleo = token.nucleo;
			td.qty = token.qty;



			return td;
		}) as AsistenciaTable[];
}

function buildTableData(list: Asistencia[]): AsistenciaTable[]{

		return list.map(sol => {
			let td = new AsistenciaTable();

			td.asistenciaId = sol._id;

			let prioridad = sol.prioridad || 2; 
			td.prioridad = AsistenciaHelper.getOptionLabel('prioridad', prioridad);

			td.compName = sol.compName;
			td.compNum = sol.compNum;
			td.fecomp_tsa = sol.fecomp_tsa;
			td.fecomp_txa = sol.fecomp_txa;
			td.ts_alta = sol.ts_alta;

			td.personId = sol.idPerson;
			td.ndoc = (sol.requeridox && sol.requeridox.ndoc) || sol.ndoc;
			td.personSlug = sol.requeridox.nombre ? (sol.requeridox.apellido ? sol.requeridox.apellido + ', ' + sol.requeridox.nombre : sol.requeridox.nombre) : (sol.requeridox.slug ? sol.requeridox.slug: '');
			td.edad = sol.edad ? sol.edad : '';
			td.telefono = sol.telefono || '';

			td.action = AsistenciaHelper.getOptionLabel('actions', sol.action);
			td.slug = sol.slug;
			td.description = sol.description;;
			td.sector = sol.sector;
			td.estado = sol.estado;
			td.avance = AsistenciaHelper.getOptionLabel('avance', sol.avance);

			td.osocial = sol.osocial + '::' + sol.osocialTxt
			td.osocial = sol.osocial ? sol.osocial + (sol.osocialTxt ? '::' + sol.osocialTxt : '') : ''
			td.faudit_alta = ((new Date(sol.ts_alta)).toString()).substr(0,21);
			td.faudit_um = ((new Date(sol.ts_prog)).toString()).substr(0,21);



			if(sol.sintomacovid && sol.tipo === 1){
				td.covid = covidToPrint(sol.sintomacovid);
			}
			if(sol.denuncia && sol.tipo === 2){
				td.covid = denunciaToPrint(sol.denuncia);
			}

			if(sol.locacion){
				td.locacion = locacionToPrint(sol.locacion);
			}

			td.qcontactos = sol.contactosEstrechos;
			if(sol.followUp){
				if(sol.followUp.isAsignado){
					td.asignadoSlug = sol.followUp.asignadoSlug;
					td.asignadoId = sol.followUp.asignadoId;

				}else {
					td.asignadoSlug = '';
					td.asignadoId = null;

				}

				td.fup_isActive = sol.followUp.isActive;
				td.fup_isAsistido = sol.followUp.isAsistido;
				td.fup_fe_inicio = sol.followUp.fe_inicio;

			}

			td.covidTxt = ''
			td.covidActualState= '';
			td.covidSintoma = '';
			td.covidAvance = ''
			
			if(sol.infeccion){

				let fecha = sol.infeccion.actualState === 1 ?  devutils.txDayMonthFormatFromDateNum(sol.infeccion.fets_inicio): devutils.txDayMonthFormatFromDateNum(sol.infeccion.fets_confirma);
				td.covidTxt =  AsistenciaHelper.getPrefixedOptionLabel('avanceInfection', '', sol.infeccion.avance) + ' :: ' +fecha;
				td.covidActualState = AsistenciaHelper.getActualStateOptionLabel('estadoActualInfection', '',sol.infeccion.actualState);
				td.covidAvance = AsistenciaHelper.getPrefixedOptionLabel('avanceInfection', '',sol.infeccion.avance);
				td.covidSintoma = AsistenciaHelper.getPrefixedOptionLabel('sintomaInfection', '',sol.infeccion.sintoma);
			}

			td.lab_laboratorio = '';
			td.lab_estado = '';
			td.lab_resultado = '';
			td.lab_fe_toma = '';
			td.lab_fets_toma = 0;
			td.lab_qty = 0;
			td.labTxt = '';
			let laboratorios = sol.muestraslab;

			if(laboratorios && laboratorios.length){
				let lab = laboratorios[laboratorios.length -1]
				td.lab_estado =  AsistenciaHelper.getPrefixedOptionLabel('estadoMuestraLab', '',lab.estado);
				td.lab_resultado =  AsistenciaHelper.getPrefixedOptionLabel('resultadoMuestraLab', '',lab.resultado);
				td.lab_fe_toma = lab.fe_toma;
				td.lab_fets_toma = lab.fets_toma;
				td.lab_qty = laboratorios.length -1
				td.lab_laboratorio = lab.laboratorio;
				td.labTxt = td.lab_resultado + '' + td.lab_fe_toma ;
			}

			td.reportadoPor = '';
			td.fe_reportado = '';
			if(sol.sisaevent){
				td.fe_reportado = sol.sisaevent.fe_reportado;
				td.reportadoPor = sol.sisaevent.reportadoPor;
			}

	
			td.fupTxt = '';
			return td;
		})

}

class ContactosVigilados {
  personSlug: string;
  
  
}

class Algo {
	asis_qty: number = 0 ; //
}

class ContactsByNucleo{
	[key: string]: Array<ContactByNucleo>
} 

class ContactByNucleo{
	slug: string;
	personId: string;
	asitenciaId: string;
	nucleo: string;
	telefono: string;
} 

class ContactManager {

  asis_qty: number = 0 ; // cantidad de contactos con asistencia vigente

  asistenciaId: string; // id de la asitencia índice
  telefono: string; // telefonos recolectados;
  city: string; // ciudad del caso índice

  nucleos: Array<string> = []; // nucleos existentes;
  contactos: ContactsByNucleo;


}

export class AsistenciaGeolocalizacion {
		etiqueta: string = 'Persona'
		tipo: string = 'SOSPECHA'

		asistenciaId: string = '';
		link: string = '';

		compNum:     string = '';
		personId:    string = '';
		personSlug:  string = '';
		ndoc:        string = '';
		fecomp_txa:  string = '';

		covid: string = '';
		city: string = '';
		barrio: string = '';
		street1: string = '';
		nucleo: string = '';
		statetext: string = '';
		locacion?: Locacion;

		edad: string = '';
		telefono: string = '';
		lat: number = 0;
		lon: number = 0;

}


export class AsistenciaTable {
		_id: string;
		asistenciaId: string = '';
		compName:    string = 'S/Asistencia';
		compNum:     string = '';
		personId:    string = '';
		personSlug:  string = '';
		ndoc:        string = '';
		fecomp_tsa:  number = 0;
		fecomp_txa:  string = '';
		action:      string = '';
		slug:        string = '';
		description: string = '';
		osocial:  string = '';
		sector:      string = '';
		estado:      string = '';
		avance:      string = '';
		ts_alta:     number = 0;
		prioridad:   string = '';
		denuncia:    string = '';

		covid: string = '';
		locacion: string ='';
		city: string = '';
		barrio: string = '';
		street2: string = '';
		nucleo: string = '';
		qty: number = 0; 

		faudit_alta:  string = '';
		faudit_um:    string = '';

		edad: string = '';
		telefono: string = '';
		covidTxt: string = '';

		covidActualState: string = '';
		covidSintoma: string = '';
		covidAvance: string = '';
		reportadoPor: string = '';
		fe_reportado: string = '';
		labTxt: string = '';
		fupTxt: string = '';

		asignadoSlug: string = '';
		fup_isActive: boolean = false;
		fup_isAsistido: boolean = false;

		asignadoId: string = '';
		fup_fe_inicio: string = '';
		qcontactos: number = 0;
		
		lab_laboratorio: string = '';
		lab_estado: string = '';
		lab_resultado: string = '';
		lab_fe_toma: string = '';
		lab_fets_toma: number = 0;
		lab_qty: number = 0;


};


export class DashboardBrowse {
		sintoma:      string;
		sector:      string;
		estado:      string;
		avance:      string;
		fecharef?:   string;
		locacionhosp?:   string = 'no_definido';
}

export class AsistenciaBrowse {
		searchAction: string;
		compPrefix:  string = 'SOL';
		compName:    string = 'S/Asistencia';
		compNum_d:   string;
		requirenteId: string;
		tipo: string;
		compNum_h:   string;
		idPerson:    string;
		fecomp_d:    string;
		fecomp_h:    string;
		fecomp_ts_d:    number;
		fecomp_ts_h:    number;
		action:      string;
		sector:      string;
		estado:      string = 'activo';
		avance:      string;
		fe_visita:   string;
		ruta:        string;
		barrio:      string;
		city:        string;
		urgencia:    number;
		trabajadorId: string;
		avance_encuesta: string;
}

export class VigilanciaBrowse {
		searchAction: string;
		compPrefix:  string = 'SOL';
		compName:    string = 'S/Asistencia';
		compNum_d:   string;
		requirenteId: string;
		compNum_h:   string;
		actualState: string|number;
		rebuildLatLon: boolean = false;
		fecomp_d:    string;
		fecomp_h:    string;
		fecomp_ts_d:  number;
		fecomp_ts_h:  number;
		action:      string = '';
		sector:      string = '';
		estado:      string = 'activo';
		avance:      string = '';

		reporte:  string; // reportesVigilanciaOptList

		asistenciaId: string;

		viewList?:   Array<string>;

		isActiveSisa: boolean = false;
		avanceSisa: string = '';
		qDaysSisa: number = 0;
		qNotConsultaSisa: number = 0;

		userId: string = ''; // usado para filtrale casos al operador
		asignadoId: string = ''; // usado para buscar expresamente casos asignados a...

		isVigilado: boolean = false;
		pendLaboratorio: boolean = false; // lista solo registros con resultados de LAB pendientes
		hasCovid:   boolean = false;

		casoCovid:   boolean = false;
		hasParent: boolean;
		vigiladoCovid:   boolean = false;


		necesitaLab: boolean = false;
		locacionId:   string = ''; // refiere a muestraslab.locacionId
		isSeguimiento: boolean = false;
		tipoSeguimiento: string;
		qIntents: number = 0;
		qNotSeguimiento: number = 0;

		casosIndice: number = 0;

		avanceCovid: string = '';

		sintomaCovid: string = '';
		hasPrexistentes: boolean = false;
		feDesde?: string = '';
		feHasta?: string = '';
		feDesde_ts?: number = 0;
		feHasta_ts?: number = 0;
		barrio:      string = '';
		city:        string = '';

		fenovd: string = '';
		fenovh: string = '';
		avanceNovedad: string = '';
		sectorNovedad: string = '';
		intervencion: string = '';
		ejecucion: string = '';
		fenovd_ts: number = 0;
		fenovh_ts: number = 0;
		resultado: string = '';
		urgencia:  number;
		trabajadorId: string;

}

export interface AsistenciaSig {
	asistencia: Asistencia;
	locacion: any;
	lat: number;
	lng: number;
}

export interface AsistenciaAction  {
	id_turno: string;
	turno: Asistencia;
	action: string;
	estado: string;
	resultado?: string;
	atendidox?: Atendido;
	modalidad?: Alimento;
	observación?: string;
}

export interface UpdateAsistenciaEvent {
	action: string;
	type: string;
	selected?: boolean;
	token: Asistencia;
};

export interface UpdateNovedadEvent {
	action: string;
	type: string;
	selected?: boolean;
	token: Novedad;
};

export interface UpdateAlimentoEvent {
	action: string;
	type: string;
	token: Alimento;
};

export interface UpdateEncuestaEvent {
	action: string;
	type: string;
	token: Encuesta;
};

export interface UpdatePedidoEvent {
	action: string;
	type: string;
	token: Pedido;
};

export interface UpdateAsistenciaListEvent {
      action: string;
      type: string;
      items: Array<Asistencia|Novedad>;
};


export class AsistenciaDataSource extends ArrayDataSource<Asistencia> {

  constructor(private sourceData: BehaviorSubject<Asistencia[]>,
              private _paginator: MatPaginator){
    super(sourceData);
  }

  connect(): Observable<Asistencia[]> {

    const displayDataChanges = [
      this.sourceData,
      this._paginator.page
    ];

    return merge(...displayDataChanges).pipe(
        map(() => {
          const data = this.sourceData.value.slice()

          const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
          return data.splice(startIndex, this._paginator.pageSize);
        })
     );
  }

  disconnect() {}

}



export class AsistenciaslModel {
	static asistenciasPorPersonQuery(action, name){

		let query = {
			action: action,
			name: name,
			estado: 'pendiente',
		};

		return query;
	}

}

export class HisopadoYa {
	dias: number = 0;
	hasFollowUp = false;
	isCovid = false;
	needsHisopado = false;	
}

export class OptList {
	val: string;
	label: string;
	slug?: string;
	isRemitible?: boolean = false;
	key?: string;
	type?: string;
	tipo?: string;
	order?: string;
	q?: number;
}

const obrasSociales = [
      {val: 'no_definido',  label: 'Seleccioneopción',   slug:'Seleccione opción' },
      {val: 'noposee',      label: 'No posee',  slug:'No posee' },
      {val: 'OSOCIAL',      label: 'O/SOCIAL',  slug:'O/SOCIAL' },
      {val: 'PAMI',         label: 'PAMI',      slug:'PAMI' },
      {val: 'mprivada',     label: 'Privado',   slug:'Privado' },
      {val: 'otra',         label: 'Otra',      slug:'Otra' },
];


const indicacionOptList: Array<any> = [
        {val: 'nodefinido',     type:'nodefinido',    label: 'nodefinido' },
        {val: 'aislamiento',    type:'aislamiento',    label: 'aislamiento' },
        {val: 'ctrlsintomas',   type:'ctrlsintomas',    label: 'ctrlsintomas' },
        {val: 'esperemedico',   type:'esperemedico',    label: 'esperemedico' },
        {val: 'esperesame',     type:'esperesame',    label: 'esperesame' },
        {val: 'urgeguarida',     type:'urgeguardia',    label: 'urgeguardia' },
];

const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];


const nucleoHabitacionalOptList: Array<any> = [
				{val: 'NUC-HAB-01',   label: 'Núcleo HAB-01' },
				{val: 'NUC-HAB-02',   label: 'Núcleo HAB-02' },
				{val: 'NUC-HAB-03',   label: 'Núcleo HAB-03' },
				{val: 'NUC-HAB-04',   label: 'Núcleo HAB-04' },
				{val: 'NUC-HAB-05',   label: 'Núcleo HAB-05' },
				{val: 'NUC-HAB-06',   label: 'Núcleo HAB-06' },
				{val: 'NUC-HAB-07',   label: 'Núcleo HAB-07' },
				{val: 'NUC-HAB-08',   label: 'Núcleo HAB-08' },
				{val: 'NUC-HAB-09',   label: 'Núcleo HAB-09' },
				{val: 'NUC-HAB-10',   label: 'Núcleo HAB-10' },
				{val: 'NUC-HAB-11',   label: 'Núcleo HAB-11' },
				{val: 'NUC-HAB-12',   label: 'Núcleo HAB-12' },
				{val: 'NUC-HAB-13',   label: 'Núcleo HAB-13' },
				{val: 'NUC-HAB-14',   label: 'Núcleo HAB-14' },
				{val: 'NUC-HAB-15',   label: 'Núcleo HAB-15' },

];

const asisActionOptList: Array<any> = [
        {val: 'no_definido', isRemitible: false,  key:'',           type:'Sin selección',  label: 'Sin selección' },
        {val: 'denuncia',    isRemitible: false,  key:'modalidad',  type:'denuncia',       label: 'Denuncia' },
        {val: 'covid',       isRemitible: false,  key:'modalidad',  type:'covid',          label: 'COVID' },
        {val: 'prevencion',  isRemitible: false,  key:'modalidad',  type:'prevencion',     label: 'Llamado prevención' },
        {val: 'same',        isRemitible: false,  key:'modalidad',  type:'same',           label: 'Derivar SAME' },
        {val: 'epidemiologia', isRemitible: false,  key:'modalidad',  type:'epidemio',     label: 'Epidemiología' },

];

const novedadesTypeOptList: Array<any> = [
        {val: 'no_definido',  label: 'Sin selección' },
        {val: 'urgencia',     label: 'Alerta - Urgencia' },
        {val: 'seguimiento',  label: 'Seguimiento telefónico' },
        {val: 'investigacion', label: 'Seguim/Invest Epidemio' },
        {val: 'derivacion',   label: 'Requerim Derivación' },
        {val: 'intervencion', label: 'Intervención' },
        {val: 'datos',        label: 'Gestionar datos (tel equivocado)' },
        {val: 'notifsistema', label: 'Notificaciones aplicativo' },
        {val: 'notificacion', label: 'Notificaciones' },
        {val: 'documentos',   label: 'Emisión certificado' },
        {val: 'plasma',       label: 'Gestión plasma' },
        {val: 'otros',        label: 'Otros' },
];

const evolucionTypeOptList: Array<any> = [
        {val: 'alimentos',    label: 'Asis Alimentaria (SDDSS)' },
        {val: 'tramites',     label: 'Tramitación, compra' },
        {val: 'medicamento',  label: 'Requiere medicamentos (SS)' },
        {val: 'vigilancia',   label: 'Reportar a Vigilancia Epidemio' },
];


const pedidosTypeOptList: Array<any> = [
        {val: 'covid',    type:'covid',     label: 'COVID' },
        {val: 'prevencion',    type:'prevencion',     label: 'Prevención' },
        {val: 'same',    type:'same',     label: 'SAME' },
        {val: 'epidemio',    type:'epidemio',     label: 'Epidemiología' },
        {val: 'no_definido',  type:'Sin selección', label: 'Sin selección' },
];

const entregaDesdeOptList: Array<any> = [
        {val: 'no_definido',  type:'Sin selección', label: 'Sin selección' },
];

const causasOptList: Array<any> = [
        {val: 'emergencia',     type:'Emergencia',    label: 'Emergencia' },
        {val: 'covid',          type:'COVID',         label: 'Posible COVID' },
        {val: 'otro',           type:'Otro',          label: 'Otro' },
        {val: 'no_definido',    type:'Sin selección', label: 'Sin selección' },
];

			// {val:'com',          serial:'salud',       label: 'COM',               style: {'background-color': "#f2cded"}},
			// {val:'prevencion',   serial:'salud',       label: 'Médico/a prevención', style: {'background-color': "#f2cded"}},
			// {val:'same',         serial:'salud',       label: 'SAME',              style: {'background-color': "#f2aded"}},
			// {val:'direccion',    serial:'salud',       label: 'Dirección Médica' , style: {'background-color': "#f2dded"}},


const sector_actionRelation = {
  ivr: [
    {val: 'covid',    label: 'Atención telefónica COVID' },
    {val: 'denuncia', label: 'Denuncia COVID' },
    {val: 'same',     label: 'Requerir Same' },
  ],

  com: [
    {val: 'covid',    label: 'Atención telefónica COVID' },
    {val: 'denuncia', label: 'Denuncia COVID' },
    {val: 'same',     label: 'Requerir Same' },
  ],

  prevencion: [
    {val: 'emergencia',      label: 'Atención telefónica' },
    {val: 'same',             label: 'Requerir Same' },
    {val: 'covid',    label: 'Atención telefónica COVID' },
  ],

  same: [
    {val: 'same',   label: 'Gestionar SAME' },
  ],

  epidemologia: [
    {val: 'epidemio',   label: 'Seguimiento epidemiológico' },
  ],

  direccion: [
    {val: 'covid',    label: 'Atención telefónica COVID' },
    {val: 'denuncia', label: 'Denuncia COVID' },
    {val: 'same',   label: 'Requerir Same' },
    {val: 'prevencion',       label: 'Seguimiento de prevención' },
  ],

}


const followUpOptList: Array<any> = [  
        {val: 'no_definido',  label: 'No definido',  slug:'Seleccione opción' },
        {val: 'tsocial',       label: 'TS',           slug:'TS' },
        {val: 'habitat',       label: 'Habitat',      slug:'Habitat' },
 ];


const alimentosTypeOptList: Array<any> = [
        {val: 'no_definido', type:'Sin selección',  label: 'Sin selección' },

];

const comprobantesOptList: Array<any> = [
        {val: 'sasistencia',   type:'S/Asistencia',    label: 'S/Asistencia' },
];

const frecuenciaOptList: Array<any> = [
        {val: 'diaria',    q: 31, type:'Diaria',           label: 'Diaria' },
        {val: 'semanal',   q: 4, type:'Semanal',          label: 'Semanal' },
        {val: 'quincenal', q: 2, type:'Quincenal',        label: 'Quincenal' },
        {val: 'mensual',   q: 1, type:'Mensual',          label: 'Mensual' },
        {val: 'unica',     q: 1, type:'Vez única',        label: 'Vez única' },
        {val: 'unicavez',  q: 1, type:'Vez única',        label: '---------------' },
        {val: 'arequerim', q: 1, type:'A requerimiento',  label: 'A requerimiento' },
];

const tableActions = [
      {val: 'no_definido',  label: 'Seleccione opción',   slug:'Seleccione opción' },
      {val: 'asignar',   label: 'Asignar usuario seguimiento',   slug:'Asignar usuario seguimiento' },
]

const urgenciaOptList = [
      {val: 0,  label: '',      slug:'' },
      {val: 1,  label: 'Baja',  slug:'Urgencia baja' },
      {val: 2,  label: 'Media', slug:'Urgencia media' },
      {val: 3,  label: 'Alta',  slug:'Urgencia alta' },
      {val: 4,  label: 'Crítica',  slug:'Urgencia crítica' },
]


const periodoOptList = [
      {val: "UNICO", q:0,  label: 'Única vez', slug:'Entrega única' },
      {val: "3M",    q:3,  label: ' 3 meses',  slug:'Período de validez: 3 meses' },
      {val: "6M",    q:6,  label: ' 6 meses',  slug:'Período de validez: 6 meses' },
      {val: "9M",    q:9,  label: ' 9 meses',  slug:'Período de validez: 9 meses' },
      {val: "12M",   q:12, label: '12 meses',  slug:'Período de validez: 12 meses' },
]

const estadosOptList = [
      {val: 'no_definido',    label: 'Sin selección',  slug:'Seleccione opción' },
      {val: 'activo',      label: 'Activa',      slug:'Activa' },
      {val: 'cumplido',    label: 'Cumplida',    slug:'Cumplida' },
      {val: 'cerrado',     label: 'Cerrado',    slug:'Cerrado' },
      {val: 'suspendido',  label: 'Suspendida',  slug:'Suspendida' },
      {val: 'baja',        label: 'Baja',        slug:'Baja' },
]

const prioridadOptList = [
      {val: 3,      label: 'Alta',      slug:'Alta'  },
      {val: 2,      label: 'Media',     slug:'Media' },
      {val: 1,      label: 'Baja',      slug:'Baja'  },
]

const avanceOptList = [
      {val: 'no_definido',          tipo:0, order:  1, label: 'Sin selección',        slug:'Sin selección' },
      {val: 'emitido',              tipo:0, order:  2, label: 'Emitida',              slug:'Emitida' },

      {val: 'esperamedico',         tipo:1, order: 11, label: 'Espera médico/a',      slug:'Esepra médico/a' },
      {val: 'enobservacion',        tipo:1, order: 12, label: 'En observación',       slug:'En observación' },
      {val: 'enaislamiento',        tipo:1, order: 13, label: 'En aislamiento',       slug:'En aislamiento' },
      {val: 'esperasame',           tipo:1, order: 14, label: 'Espera SAME',          slug:'Espera SAME' },
      {val: 'hospitalizado',        tipo:1, order: 15, label: 'Hospitalizado',        slug:'Hospitalizado' },
      {val: 'derivado',             tipo:1, order: 16, label: 'Derivado',             slug:'Derivado' },
      {val: 'epidemio',             tipo:1, order: 16, label: 'Epidemiología',        slug:'Epidemiología' },
      {val: 'dadodealta',           tipo:1, order: 17, label: 'Alta médica',          slug:'Alta médica' },
      {val: 'fallecido',            tipo:1, order: 18, label: 'Fallecido/a',            slug:'Fallecido/a' },

      {val: 'denuncia',             tipo:2, order: 21, label: 'Denuncia',             slug:'Denuncia' },
			{val: 'denuncia_avisitar',    tipo:2, order: 22, label: 'Denuncia a visitar',   slug:'Denuncia a visitar' },
			{val: 'denuncia_verificada',  tipo:2, order: 23, label: 'Denuncia Verificada',  slug:'Denuncia Verificada' },
			{val: 'denuncia_notificada',  tipo:2, order: 24, label: 'Denuncia Notificada',  slug:'Denuncia Notificada' },
			{val: 'denuncia_descartada',  tipo:2, order: 25, label: 'Denuncia Descartada',  slug:'Denuncia Descartada' },

      {val: 'nocontesta',           tipo:9, order: 91, label: 'No contesta',          slug:'No contesta' },
      {val: 'descartado',           tipo:9, order: 92, label: 'Descartado',           slug:'Descartado' },
      {val: 'anulado',              tipo:9, order: 93, label: 'Anulado',              slug:'Anulado' },
]

const ejecucionOptList = [
      {val: 'no_definido',          estado: 'activo',  tipo:0, order:  1, label: 'Sin selección',        slug:'Sin selección',   },
      {val: 'emitido',              estado: 'activo',  tipo:0, order:  2, label: 'Emitida',              slug:'Emitida',         },
      {val: 'derivado',             estado: 'activo',  tipo:1, order: 11, label: 'Derivado',             slug:'Derivado',        },
      {val: 'enejecucion',          estado: 'activo',  tipo:1, order: 12, label: 'En ejecucion',         slug:'En ejecucion',    },
      {val: 'cumplido',             estado: 'cerrado', tipo:1, order: 13, label: 'Cumplida',             slug:'Cumplida',        },
      {val: 'nocumplido',           estado: 'cerrado', tipo:1, order: 14, label: 'No Cumplida',          slug:'No Cumplida',     },
      {val: 'demorado',             estado: 'activo',  tipo:1, order: 15, label: 'Demorada',             slug:'Demorada',        },
      {val: 'urgente',              estado: 'activo',  tipo:1, order: 16, label: 'Reclamo urgente',      slug:'Reclamo urgente', },
      {val: 'noencontrado',         estado: 'cerrado', tipo:1, order: 18, label: 'No encontrado/a',      slug:'No encontrado/a', },
      {val: 'nocontesta',           estado: 'cerrado', tipo:9, order: 91, label: 'No contesta',          slug:'No contesta',     },
      {val: 'descartado',           estado: 'cerrado', tipo:9, order: 92, label: 'Descartado',           slug:'Descartado',      },
      {val: 'anulado',              estado: 'baja',    tipo:9, order: 93, label: 'Anulado',              slug:'Anulado',         },
]


const workflow = {
  no_definido: [
    {val: 'no_definido',   label: 'Sin selección' },
  ],

  emitido: [
      {val: 'descartado',     label: 'Descartado',      slug:'Descartado' },
      {val: 'esperamedico',   label: 'Espera médico',   slug:'Espera médico' },
  ],

  descartado: [
      {val: 'descartado',     label: 'Descartado',      slug:'Descartado' },
    	{val: 'enobservacion',  label: 'En observación',  slug:'En observación' },
      {val: 'esperamedico',   label: 'Espera médico',   slug:'Espera médico' },
  ],

  denuncia: [
      {val: 'denuncia',             label: 'Denuncia recibida',    slug:'Denuncia recibida' },
			{val: 'denuncia_avisitar',    label: 'Denuncia a visitar',   slug:'Denuncia a visitar' },
			{val: 'denuncia_descartada',  label: 'Denuncia Descartada',  slug:'Denuncia Descartada' },
	],

  denuncia_avisitar: [
			{val: 'denuncia_avisitar',    label: 'Denuncia a visitar',   slug:'Denuncia a visitar' },
			{val: 'denuncia_verificada',  label: 'Denuncia Verificada',  slug:'Denuncia Verificada' },
			{val: 'denuncia_notificada',  label: 'Denuncia Notificada',  slug:'Denuncia Notificada' },
			{val: 'denuncia_descartada',  label: 'Denuncia Descartada',  slug:'Denuncia Descartada' },
	],
 	
 	denuncia_verificada: [
			{val: 'denuncia_verificada',  label: 'Denuncia Verificada',  slug:'Denuncia Verificada' },
			{val: 'denuncia_avisitar',    label: 'Denuncia a visitar',   slug:'Denuncia a visitar' },
			{val: 'denuncia_descartada',  label: 'Denuncia Descartada',  slug:'Denuncia Descartada' },
  ],

 	denuncia_notificada: [
			{val: 'denuncia_notificada',  label: 'Denuncia Notificada',  slug:'Denuncia Notificada' },
			{val: 'denuncia_avisitar',    label: 'Denuncia a visitar',   slug:'Denuncia a visitar' },
			{val: 'denuncia_descartada',  label: 'Denuncia Descartada',  slug:'Denuncia Descartada' },
  ],

 	denuncia_descartada: [
			{val: 'denuncia_descartada',  label: 'Denuncia Descartada',  slug:'Denuncia Descartada' },
      {val: 'denuncia',             label: 'Denuncia recibida',    slug:'Denuncia recibida' },
			{val: 'denuncia_avisitar',    label: 'Denuncia a visitar',   slug:'Denuncia a visitar' },
  ],
	
	enobservacion: [
    	{val: 'enobservacion',  label: 'En observación', slug:'En observación' },
      {val: 'descartado',     label: 'Descartado',     slug:'Descartado' },
      {val: 'enaislamiento',  label: 'En aislamiento', slug:'En aislamiento' },
      {val: 'esperamedico',   label: 'Espera médico/a', slug:'Espera médico/a' },
	],

  enaislamiento: [
      {val: 'enaislamiento',  label: 'En aislamiento', slug:'En aislamiento' },
      {val: 'descartado',     label: 'Descartado',     slug:'Descartado' },
      {val: 'esperamedico',   label: 'Espera médico/a', slug:'Espera médico/a' },
  ],

  esperamedico: [
      {val: 'esperamedico',   label: 'Espera médico/a', slug:'Espera médico/a' },
      {val: 'descartado',     label: 'Descartado',     slug:'Descartado' },
      {val: 'nocontesta',     label: 'No contesta',    slug:'No contesta' },
      {val: 'enobservacion',  label: 'En observación', slug:'En observación' },
      {val: 'enaislamiento',  label: 'En aislamiento', slug:'En aislamiento' },
      {val: 'esperasame',     label: 'Espera SAME',    slug:'Espera SAME' },
  ],

  nocontesta: [
      {val: 'nocontesta',     label: 'No contesta',    slug:'No contesta' },
    	{val: 'esperamedico',   label: 'Espera médico/a', slug:'Espera médico/a' },
      {val: 'descartado',     label: 'Descartado',     slug:'Descartado' },
      {val: 'enobservacion',  label: 'En observación', slug:'En observación' },
      {val: 'enaislamiento',  label: 'En aislamiento', slug:'En aislamiento' },
      {val: 'esperasame',     label: 'Espera SAME',    slug:'Espera SAME' },
  ],

  esperasame: [
      {val: 'esperasame',     label: 'Espera SAME',    slug:'Espera SAME' },
      {val: 'hospitalizado',  label: 'Hospitalizado',  slug:'Hospitalizado' },
      {val: 'derivado',       label: 'Derivado',       slug:'Derivado' },
      {val: 'anulado',        label: 'Anulado',        slug:'Anulado' },
  ],

  hospitalizado: [
      {val: 'derivado',       label: 'Derivado',       slug:'Derivado' },
      {val: 'dadodealta',     label: 'Alta médica',    slug:'Alta médica' },
      {val: 'fallecido',      label: 'Fallecido',      slug:'Fallecido' },
  ],

  derivado: [
      {val: 'dadodealta',     label: 'Alta médica',    slug:'Alta médica' },
      {val: 'fallecido',      label: 'Fallecido',      slug:'Fallecido' },
  ],

  fallecido: [
      {val: 'fallecido',      label: 'Fallecido',      slug:'Fallecido' },
  ],

}


const avance_estadoRelation = {
  no_definido: [
    {val: 'no_definido',   label: 'Sin selección' },
  ],

  emitido: [
    {val: 'activo',   label: 'Activa' },
  ],

  descartado: [
    {val: 'cerrado',   label: 'Cerrado' },
  ],

  denuncia: [
    {val: 'cerrado',   label: 'Cerrado' },
  ],

  denuncia_notificada: [
    {val: 'cerrado',   label: 'Cerrado' },
  ],

  denuncia_verificada: [
    {val: 'cerrado',   label: 'Cerrado' },
  ],

  denuncia_avisitar: [
		{val: 'activo',   label: 'Activa' },
  ],

  denuncia_descartada: [
    {val: 'cerrado',   label: 'Cerrado' },
  ],

  enobservacion: [
    {val: 'activo',   label: 'Activa' },
  ],

  enaislamiento: [
    {val: 'activo',   label: 'Activa' },
  ],

  esperamedico: [
    {val: 'activo',   label: 'Activa' },
  ],

  esperasame: [
    {val: 'activo',   label: 'Activa' },
  ],

  hospitalizado: [
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  derivado: [
    {val: 'cerrado',   label: 'Cerrado' },
  ],

  cumplido: [
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  dadodealta: [
    {val: 'cumplido',   label: 'Cumplido' },
  ],

  fallecido: [
    {val: 'cerrado',   label: 'Cerrado' },
  ],

  anulado: [
    {val: 'baja',   label: 'Baja' },
  ]


}


const avanceEncuestaOptList = [
      {val: 'no_definido',  label: 'Sin selección',  slug:'Sin selección' },
      {val: 'emitido',      label: 'Emitida',          slug:'Emitida' },
      {val: 'programado',   label: 'Programado',       slug:'Programado' },
      {val: 'visitado',     label: 'Visita cumplida',  slug:'Visita cumplida' },
      {val: 'noencontrado', label: 'Referente no encontrado',  slug:'Referente no encontrado' },
      {val: 'informado',    label: 'Informe cargado',  slug:'Informe cargado' },
      {val: 'aprobado',     label: 'Informe aprobado', slug:'Informe aprobado' },
      {val: 'suspendido',   label: 'Suspendido',       slug:'Suspendido' },
]

const ciudadesBrown: Array<any> = [
    {val: 'no_definido',         label: 'Seleccione opción',slug:'Seleccione opción' },
    {val: 'adrogue',             label: 'Adrogué ',   slug:'Adrogué' },
    {val: 'burzaco',             label: 'Burzaco ',   slug:'Burzaco' },
    {val: 'calzada',             label: 'Calzada ',   slug:'Calzada' },
    {val: 'claypole',            label: 'Claypole',   slug:'Claypole' },
    {val: 'donorione',           label: 'Don Orione', slug:'Don Orione' },
    {val: 'glew',                label: 'Glew',       slug:'Glew' },
    {val: 'longchamps',          label: 'Longchamps', slug:'Longchamps' },
    {val: 'malvinasargentinas',  label: 'Malvinas Argentinas',slug:'Malvinas Argentinas' },
    {val: 'marmol',              label: 'J.Mármol',   slug:'J.Mármol' },
    {val: 'ministrorivadavia',   label: 'Ministro Rivadavia',slug:'Ministro Rivadavia' },
    {val: 'sanjose',             label: 'San José',   slug:'San José' },
    {val: 'extradistrito',       label: 'Extra distrito',   slug:'Fuera del Municipio de Brown' },
];

const vinculosOptList: Array<any> = [
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
const estadoVinculosOptList: Array<any> = [
        {val: 'no_definido',  label: 'Seleccione opción',slug:'Seleccione opción' },
        {val: 'activo',       label: 'Activo',         slug:'Activo' },
        {val: 'fallecido',    label: 'Fallecido/a',    slug:'Fallecido/a' },
        {val: 'separado',     label: 'Separado/a',     slug:'Separado/a' },
        {val: 'abandonado',   label: 'Abandonado/a',   slug:'Abandonado/a' },
        {val: 'otro',         label: 'Otro',           slug:'Otro' },
];

const sexoOptList: Array<any> = [
    {val: 'F',        label: 'Femenino',      slug:'Femenino' },
    {val: 'M',        label: 'Masculino',     slug:'Masculino' },
    {val: 'GAP',      label: 'Auto percibido',slug:'Auto percibido' },
];

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

const labsequenceOptList: Array<any> = [
    {val: '1ER LAB',      label: '1ER LAB' },
    {val: '2DO LAB',      label: '2DO LAB' },
    {val: '3ER LAB',      label: '3ER LAB' },
    {val: '4TO LAB',      label: '4TO LAB' },
    {val: '5TO LAB',      label: '5TO LAB' },
];

const reportesVigilanciaOptList: Array<any> = [
    {val: 'LABORATORIO',      label: 'Auditoría de Laboratorios Pendientes' },
    {val: 'COVID',            label: 'Reporte COVID (Activos + Altas + Fallecidos)' },
    {val: 'CONTACTOSESTRECHOS', label: 'Reporte CONTACTOS' },
    {val: 'LLAMADOSIVR',      label: 'Reporte Seguimiento IVR' },
    {val: 'DOMICILIOS',       label: 'Reporte Domicilios de contactos' },
    {val: 'LABNEGATIVO',      label: 'Reporte Sospechosos con LAB NEGATIVO' },
    {val: 'REDCONTACTOS',     label: 'Grafo de contactos' },
    {val: 'CONTACTOS',        label: 'Vigilancia de contactos' },
    {val: 'ASIGNACIONCASOS',  label: 'Asignación de casos por usuario' },
    {val: 'SINSEGUIMIENTO',   label: 'Afectados COVID sin resp seguimiento' },
    {val: 'GEOLOCALIZACION',  label: 'Geolocalización de contactos' },
   // {val: 'SEGUIMIENTO',      label: 'Reporte de seguimiento entre fechas' },
];

const intervencionOptList = [
		{ val: 'no_definido',        label: 'Sin selección'},
		{ val: 'urgencia',           label: 'Atención Urgencia'},
		{ val: 'hisopar',            label: 'Hisopar'},
		{ val: 'enviar107',          label: 'Enviar 107'},
		{ val: 'internar',           label: 'Requerir Internación'},
		{ val: 'investigepid',       label: 'Hacer Invesig Epidemiológica'},	
		{ val: 'derivarEpidemio',    label: 'Derivar Epidemiología'},
		{ val: 'derivarAsis',        label: 'Derivar Asis Social'},
		{ val: 'derivarIvr',         label: 'Derivar al IVR'},
		{ val: 'derivarVolun',       label: 'Derivar Voluntarios'},
		{ val: 'derivarSMental',     label: 'Derivar Sal Mental'},
		{ val: 'derivarPlasma',      label: 'Derivar Ges Plasma'},
		{ val: 'derivarOtra',        label: 'Derivar otros'},
		{ val: 'buscarTelefono',     label: 'Buscar Teléfono'},
		{ val: 'testearPlasma',      label: 'Labor p/Plasma'},
		{ val: 'extraerAlta',        label: 'Extraer Plasma '},
		{ val: 'emitirCertifAlta',   label: 'Emitir Certif Alta'},
		{ val: 'notifEstadoAlta',    label: 'Notificar Estado de Alta'},
		{ val: 'notifsistema',       label: 'Mensajes/Notif aplicativo'},

]

const intervencionManager = {
		urgencia: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'urgente',
			sector: 'coordinacion',
			urgencia: 3,
			tnovedad: 'urgencia', 
			novedad: 'Atención Urgencia'
		},
		hisopar: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'emitido',
			sector: 'coordinacion',
			urgencia: 2,
			tnovedad: 'intervencion', 
			novedad: 'Hisopar'
		},
		enviar107: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'emitido',
			sector: 'same',
			urgencia: 2,
			tnovedad: 'intervencion', 
			novedad: 'Enviar 107'
		},
		internar: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'emitido',
			sector: 'coordinacion',
			urgencia: 2,
			tnovedad: 'intervencion', 
			novedad: 'Requerir Internación'
		},
		investigepid: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'emitido',
			sector: 'epidemiologia',
			urgencia: 1,
			tnovedad: 'investigacion', 
			novedad: 'Hacer Invesig Epidemiológica'
		},
		derivarEpidemio: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'derivado',
			sector: 'epidemiologia',
			urgencia: 1,
			tnovedad: 'seguimiento', 
			novedad: 'Derivar Epidemiología'
		},
		derivarAsis: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'derivado',
			sector: 'voluntarios',
			urgencia: 1,
			tnovedad: 'deportes', 
			novedad: 'Derivar Asis Social'
		},
		derivarIvr: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'derivado',
			sector: 'ivr',
			urgencia: 1,
			tnovedad: 'seguimiento', 
			novedad: 'Derivar al IVR'
		},
		derivarVolun: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'derivado',
			sector: 'voluntarios',
			urgencia: 1,
			tnovedad: 'seguimiento', 
			novedad: 'Derivar Voluntarios'
		},
		derivarSMental: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'derivado',
			sector: 'smental',
			urgencia: 1,
			tnovedad: 'seguimiento', 
			novedad: 'Derivar Sal Mental'
		},
		derivarPlasma: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'derivado',
			sector: 'plasma',
			urgencia: 1,
			tnovedad: 'plasma', 
			novedad: 'Derivar Ges Plasma'
		},
		derivarOtra: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'derivado',
			sector: 'coordinacion',
			urgencia: 1,
			tnovedad: 'seguimiento', 
			novedad: 'Derivar otros'
		},
		buscarTelefono: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'emitido',
			sector: 'brown0800',
			urgencia: 1,
			tnovedad: 'datos', 
			novedad: 'Buscar Teléfono'
		},
		testearPlasma: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'emitido',
			sector: 'plasma',
			urgencia: 1,
			tnovedad: 'plasma', 
			novedad: 'Labor p/Plasma'
		},
		extraerAlta: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'emitido',
			sector: 'plasma',
			urgencia: 3,
			tnovedad: 'plasma', 
			novedad: 'Extraer Plasma '
		},
		emitirCertifAlta: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'emitido',
			sector: 'coordinacion',
			urgencia: 1,
			tnovedad: '', 
			novedad: 'Emitir Certif Alta'
		},
		notifEstadoAlta: {
			isActive: true,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'emitido',
			sector: 'coordinacion',
			urgencia: 1,
			tnovedad: 'notificacion', 
			novedad: 'Notificar Estado de Alta'
		},
		notifsistema: {
			isActive: false,
			hasNecesidad: false,
			hasCumplimiento: false,
			ejecucion: 'cumplido',
			sector: 'sistema',
			urgencia: 1,
			tnovedad: 'notifsistema', 
			novedad: 'Notificion Sistema'
		},
		no_definido: {
			isActive: false,
			hasNecesidad: true,
			hasCumplimiento: true,
			ejecucion: 'anulado',
			sector: 'coordinacion',
			urgencia: 1,
			tnovedad: '', 
			novedad: ''}
			,	
}



const MODALIDAD_ALIMENTO =     'alimentos';
const MODALIDAD_HABITACIONAL = 'habitacional';
const MODALIDAD_SANITARIA =    'sanitaria';
const MODALIDAD_ENCUESTA =     'encuesta';


function validateCoreAsistencia(as: Asistencia, valid: boolean): boolean {
	if(as.estado !== "activo"){
		valid = false;
	}

	return valid;
}

function validateAlimentosAsistencia(as: Asistencia, valid: boolean): boolean {
	if(!valid) return valid;

	let alimento = as.modalidad;
	if(alimento && alimento.fe_txd && alimento.fe_txh){

		if(!devutils.isWithinPeriod(alimento.fe_txd, alimento.fe_txh)) valid = false;

	}

	return valid;
}

function filterNecesidadDeLaboratorio(token: Asistencia): HisopadoYa{
	let response = new HisopadoYa();
	let today = new Date()
	let today_ts = today.getTime();
	let feReferencia_ts = null;
	let isCovid = false;

	// caso 1
	if(!(token.followUp)) return response;
	feReferencia_ts = token.followUp.fets_inicio;
	response.hasFollowUp = true;
	let diasSeguimiento = (today_ts - feReferencia_ts) / (1000 * 60 * 60 * 24) ;
	response.dias = Math.floor(diasSeguimiento);

	if(token.infeccion){
	  if(token.infeccion.actualState === 1){
	    isCovid = true;
	    response.isCovid = true;
	    feReferencia_ts = token.infeccion.fets_confirma
			diasSeguimiento = (today_ts - feReferencia_ts) / (1000 * 60 * 60 * 24) ;
			response.dias = Math.floor(diasSeguimiento);

	  }

	  // caso 2
	  if(token.infeccion.actualState === 3 || token.infeccion.actualState === 4 || token.infeccion.actualState === 5   ) return response;
	}

	if(diasSeguimiento< 14) return response;


	if(token.muestraslab && token.muestraslab.length){
	  let muestras = token.muestraslab;
	  let fechaLab = null

	  muestras.forEach(mu => {
	    if(mu.resultado === 'descartada') {
	      fechaLab = mu.fets_resestudio
	    }
	  })

	  if(fechaLab){
	      if((today_ts - fechaLab) / (1000 * 60 * 60 * 24) < 2) return response;
	      else {
	      	response.needsHisopado = true;
	      	return response;
	      }

	  }else{
	  	response.needsHisopado = true;
	    return response;
	  }
	  
	}else{
		response.needsHisopado = true;
	  return response;
	}

}

const COSTO = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11];


function validatePedidosAsistencia(as: Asistencia, valid: boolean): boolean {
	if(!valid) return valid;

	let pedido = as.pedido;
	let modalidad = pedido ? pedido.modalidad : null;
	if(pedido && modalidad && modalidad.fe_txd && modalidad.fe_txh){

		if(!devutils.isWithinPeriod(modalidad.fe_txd, modalidad.fe_txh)) valid = false;

	}

	return valid;
}
/****
export class Modalidad {
		periodo:     string = 'UNICO';
		fe_tsd:      number = 0;
		fe_tsh:      number = 0;
		fe_txd:      string;
		fe_txh:      string;
		freq:        string = 'unica';
}

export class ItemPedido {
	slug: string;

	kitItem: number = 0; // 0: es un item cargado a mano 1: item que deviene de KIT
	productId: string;
	code: string;
	name: string;
	ume: string;
	qty: number = 1;
	punitario: number = 0;

}

export interface VoucherType {
  type: string;
  label: string;
  key: string;
  isRemitible: boolean;
  payload: Alimento|Pedido;

}


export class Pedido {
		id:             string;
		modalidad: Modalidad;
		type: string;

		deposito:       string;
    urgencia:       number = 1;
    kitId:          string;
    kitQty:         number = 1;
    observacion:    string;
    causa:          string;

		estado:         string = 'activo';
		avance:         string = 'emitido';
    items: Array<ItemPedido>  = [];
};

**/




const optionsLists = {
	 default: default_option_list,
   actions: asisActionOptList,
   comprobantes: comprobantesOptList,
   alimentos: alimentosTypeOptList,
   followup: followUpOptList,
   frecuencia: frecuenciaOptList,
   tableactions: tableActions,
   ciudades: ciudadesBrown,
   encuesta: avanceEncuestaOptList,
   pedidos: pedidosTypeOptList,
   periodo: periodoOptList,
   deposito: entregaDesdeOptList,
   novedades: novedadesTypeOptList,
   causa: causasOptList,
   indicaciones: indicacionOptList,
   osocial: obrasSociales,
   nucleoHabitacional: nucleoHabitacionalOptList,
   prioridad: prioridadOptList,

   // novedades[]
   novedadesEvolucion: evolucionTypeOptList,
   urgencia: urgenciaOptList,
   intervenciones: intervencionOptList,
   estado: estadosOptList,
   avance: avanceOptList,
   ejecucion: ejecucionOptList,
   sectores: sectores,


   //SISA
   avanceSisa: avanceSisaOptList,
 
   // Seguimiento
   tipoFollowUp: tipoSeguimientoAfectadoOptList,
   faseFollowUp: faseAfectadoOptList,
   vectorSeguim: vectorSeguimientoOptList,
   resultadoSeguim: resultadoSeguimientoOptList,

   //InfectionFollowUp
   avanceInfection: avanceInfectionOptList,
   sintomaInfection: sintomaOptList,
   estadoActualInfection: estadoActualAfectadoOptList,
   metodoDiagnostico: mdiagnosticoOptList,
	 institucionalizado: institucionalizadoOptList,
	 lugartrabajo: lugartrabajoOptList,
	 tinternacion: tinternacionOptList,
	 derivacion: derivacionOptList,
   tipoMuestraLab: tipoMuestraLaboratorioOptList,
   estadoMuestraLab: estadoMuestraLaboratorioOptList,
   locMuestraOptList: locMuestraOptList,
   resultadoMuestraLab: resultadoMuestraLaboratorioOptList,
   sequenceMuestraLab: labsequenceOptList,

   // tipo de vinculo familiar
   vinculosFam: vinculosOptList,
   estadoVinculosFam: estadoVinculosOptList,
   sexo: sexoOptList,
   tdoc: tiposCompPersonaFisica,

   // reportes
   reportesVigilancia: reportesVigilanciaOptList,
}


function getLabel(list, val){
		let t = list.find(item => item.val === val)
		return t ? t.label : val;
}

function getOptListToken(list, val){
		let t = list.find(item => item.val === val)
		return t ? t : null;
}

function getPrefixedLabel(list, prefix, val){
		let label = getLabel(list, val);
		if(label) {
			label = prefix ? prefix + ': ' + label : ' ' + label
		}
		return label;
}

function expectedQty(type, val){
		if(!val) return 'no-definido';
		if(!type) return 0;
		let list = optionsLists[type]
		let t = list.find(item => item.val === val)
		return t ? t.q : 0;
}

function denunciaToPrint(denuncia: ContextoDenuncia): string{
	let tx = '';
	tx += denuncia.islug;

	return tx;
}

function covidToPrint(covid: ContextoCovid): string{
	let tx = '';
	if(covid.hasFiebre) tx += ':Fie';
	if(covid.hasDifRespiratoria) tx += ':DefResp '
	if(covid.hasDolorGarganta) tx += ':DolGar '
	if(covid.hasTos) tx += ':Tos'
	tx += ' :: '		
	if(covid.hasViaje) tx += ':VIAJE'
	if(covid.hasContacto) tx += ':CONTACTO'
	if(covid.hasEntorno) tx += ':ENTORNO'

	return tx;
}

function locacionToPrint(loc: Locacion): string{	
	let tx = '';
	tx += (loc.city ? loc.city + ': '  : '')
	tx += (loc.street1 ? loc.street1 : '')
	
	return tx;
}

function getPesoCovid(asis: Asistencia): number{
    let peso = 0;
    let covid = asis.sintomacovid;

    let hasFiebre = 0;
    let hasSintomas = 0;
    let hasPerdidaOlfatoGusto = 0;
    let hasContexto = 0;
    let hasEntorno = 0;

    if( !covid || asis.tipo === 2) return peso;

    hasFiebre = (covid.hasFiebre ? (covid.fiebre > 37 ? 2: 0) : 0);
    hasSintomas += ( (covid.hasDifRespiratoria || covid.hasDolorGarganta || covid.hasTos ) ? 4 : 0 );
    hasPerdidaOlfatoGusto += ( (covid.hasFaltaGusto || covid.hasFaltaOlfato ) ? 6 : 0);
    hasEntorno += ( (covid.hasViaje || covid.hasContacto || covid.hasEntorno) ? 2 : 0);
    peso = hasFiebre + hasSintomas + hasPerdidaOlfatoGusto + hasEntorno;
    //c onsole.log('Computo: Total:[%s] F:[%s] Sin:[%s] Olf:[%s] Entorno:[%s] ', peso, hasFiebre, hasSintomas, hasPerdidaOlfatoGusto, hasEntorno)

    if(peso>8) peso = 8

    return peso;
}

function initNovedadToken(intervencion: string, sector?: string,  urgencia?: number, fe_necesidad?: string): Novedad{
		let novedad  = new Novedad();
		let spec =intervencionManager[intervencion];
		if(spec){
			novedad = Object.assign(novedad, spec);
		} 
		novedad.sector = sector || novedad.sector;
		novedad.intervencion = intervencion;
		novedad.urgencia = urgencia || novedad.urgencia;
		novedad.fecomp_txa = devutils.txFromDate(new Date());
		novedad.fecomp_tsa = devutils.dateNumFromTx(novedad.fecomp_txa);

		if(fe_necesidad){
			novedad.fe_necesidad =   fe_necesidad;
			novedad.fets_necesidad = devutils.dateNumFromTx(fe_necesidad);
		}else{
			novedad.fe_necesidad =   novedad.fecomp_txa;
			novedad.fets_necesidad = novedad.fecomp_tsa;

		}

		return novedad;
}




export class AsistenciaHelper {

	static getOptionlist(type){
		return optionsLists[type] || optionsLists['default'];
	}

	static getSectorActionRelation(){
		return sector_actionRelation;
	}

	static getAvanceEstadoRelation(){
		return avance_estadoRelation;
	}

	static getWorkflow(){
		return workflow;
	}

	static getOptionLabelFromList(list, val){
		if(!val) return 'no-definido';
		return getLabel(list, val);
	}

	static getOptionToken(type, val){
		return getOptListToken(this.getOptionlist(type), val);
	}

	static getOptionLabel(type, val){
		if(!val) return '';
		if(!type) return val;
		return getLabel(this.getOptionlist(type), val);
	}

	static getPrefixedOptionLabel(type, prefix, val){
		if(!val) return 'no-definido';
		if(!type) return prefix + '::' + val;
		return getPrefixedLabel(this.getOptionlist(type), prefix, val);
	}

	static getActualStateOptionLabel(type, prefix, val){
		if(!type) return prefix + '::' + val;
		return getPrefixedLabel(this.getOptionlist(type), prefix, val);
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

	static getSemanaEpidemiologica(asis: Asistencia){
		let fecha = asis.fecomp_txa;
		let fe: Date;
		let epiw = 0;
		fecha = asis.fenotif_txa ? asis.fenotif_txa : fecha;
		fecha = (asis.sisaevent && asis.sisaevent.fe_reportado )? asis.sisaevent.fe_reportado : fecha;
		if(fecha){
			fe = devutils.dateFromTx(fecha);
			epiw = fe ? devutils.epidemioWeekCount(fe) : 0
		}
		return epiw;
	}

	static isCovidActivo(asistencia){
		if(asistencia && asistencia.infeccion && asistencia.infeccion.actualState === 1 ) return true;
		return false;
	}

	static hasCovidVirus(asistencia){
	  if(asistencia && asistencia.infeccion && 
	    (asistencia.infeccion.actualState === 1 || asistencia.infeccion.actualState === 4 || asistencia.infeccion.actualState === 5)) return true;
	  return false;
	}

	static isActualStateCovid(actual){
		if( actual === 1 ) return true;
		return false;
	}

	static isActualStateCovidExposed(actual){
		if( actual === 1 || actual === 4 || actual === 5  ) return true;
		return false;
	}

	static buildCovidRequirente(person: Person): Requirente {
		let req: Requirente;
		if(person && person._id){
			req = {
				id:   person._id ,
				slug: person.displayName ,
				nombre: person.nombre,
				apellido: person.apellido,
				tdoc: person.tdoc ,
				ndoc: person.ndoc 
			}

		}else{
			req = {
				id:   null,
				slug: person.displayName ,
				tdoc: person.tdoc ,
				ndoc: person.ndoc,
				nombre: person.nombre,
				apellido: person.apellido,
			}

		}

		return req;
	}

	/***
     devuelve NUEVA lista de asistencias filtradas
     fitros:
     	estado === activo
     	alimentos:
     		que esté en el período
     	pedidos:
     		que esté en el período
	*/

	static filterActiveAsistencias(list: Asistencia[]): Asistencia[]{
		if(!list || !list.length) return [];

		let filteredList = list.filter(t => {
			let valid = true;
			valid = validateCoreAsistencia(t, valid);
			valid = validateAlimentosAsistencia(t, valid);
			valid = validatePedidosAsistencia(t, valid);

			return valid;
		})

		return filteredList;
	}

	static filterActiveNovedades(list: Novedad[]): Novedad[]{
		if(!list || !list.length) return [];

		let filteredList = list.filter(t => {
			return t.isActive === true && t.estado === 'activo' 
			//return t.hasCumplimiento && t.estado === 'activo' && ['cumplido', 'baja', 'anulado'].indexOf(t.avance) === -1

		})

		return filteredList;
	}

	static initNewNovedad(intervencion, sector?): Novedad{
		return initNovedadToken(intervencion, sector)
	}


  static asistenciasSortProperly(records: Asistencia[]): Asistencia[]{
    records.sort((fel, sel)=> {
      if(!fel.fecomp_tsa) fel.fecomp_tsa = 0;
      if(!sel.fecomp_tsa) sel.fecomp_tsa = 0;

      if(fel.fecomp_tsa < sel.fecomp_tsa) return 1;
      else if(fel.fecomp_tsa > sel.fecomp_tsa) return -1;
      else return 0;
    });
    return records;
  }


  static isAsistenciaImperfecta(asistencia:Asistencia): boolean{
  	let isImperfecta = false;
  	if(asistencia.estado !== 'activo') return isImperfecta;

    if(asistencia.action === MODALIDAD_ALIMENTO) {
    	if(!asistencia.modalidad) isImperfecta = true;

    } else if(asistencia.action === MODALIDAD_HABITACIONAL){
    	if(!asistencia.pedido) isImperfecta = true;


    } else if(asistencia.action === MODALIDAD_SANITARIA){
    	if(!asistencia.pedido) isImperfecta = true;


    } else if(asistencia.action === MODALIDAD_ENCUESTA){
    	if(!asistencia.encuesta) isImperfecta = true;

    }
    
    return isImperfecta;
  }


	static initNewAsistenciaDeprecated(type ): Asistencia{
		let token = new Asistencia();
		if(type === 'alimentos'){
			token.modalidad = new Alimento();


		} else if(type === 'subsidio'){

		}

		return token;
	}

	static cleanQueryToken(query:VigilanciaBrowse, cleanAsistenciaId:boolean = true):VigilanciaBrowse{
		if(!query) return null;

    Object.keys(query).forEach(key =>{
      if(query[key] == null || query[key] == 'no_definido' ) delete query[key];

      if(key === 'asistenciaId' && cleanAsistenciaId) delete query[key];

      if(key === 'fecomp_h' || key === 'fecomp_d')  delete query[key]; // estas keys solo se usan en el form

      if(key === 'isVigilado'       && !query[key]) delete query[key];
      if(key === 'hasPrexistentes'  && !query[key]) delete query[key];
      if(key === 'hasParent'        && !query[key]) delete query[key];
      if(key === 'hasCovid'         && !query[key]) delete query[key];
      if(key === 'casoCovid'        && !query[key]) delete query[key];
      if(key === 'vigiladoCovid'    && !query[key]) delete query[key];
      if(key === 'necesitaLab'      && !query[key]) delete query[key];
      if(key === 'locacionId'       && !query[key]) delete query[key];
      if(key === 'isSeguimiento'    && !query[key]) delete query[key];
      if(key === 'isActiveSisa'     && !query[key]) delete query[key];
      if(key === 'pendLaboratorio'  && !query[key]) delete query[key];
      if(key === 'qIntents'         && !query[key]) delete query[key];
      if(key === 'qNotSeguimiento'  && !query[key]) delete query[key];
      if(key === 'qDaysSisa'        && !query[key]) delete query[key];
      if(key === 'qNotConsultaSisa' && !query[key]) delete query[key];
      if(key === 'casosIndice'      && !query[key]) delete query[key];
      if(key === 'avance'           && !query[key]) delete query[key];

      if(key === 'asignadoId'      && !query[key]) delete query[key];
      if(key === 'rebuildLatLon'   && !query[key]) delete query[key];
      if(key === 'avanceSisa'      && !query[key]) delete query[key];
      if(key === 'userId'          && !query[key]) delete query[key];
      if(key === 'avanceCovid'     && !query[key]) delete query[key];
      if(key === 'sintomaCovid'    && !query[key]) delete query[key];
      if(key === 'feDesde'         && !query[key]) delete query[key];
      if(key === 'feDesde_ts'      && !query[key]) delete query[key];
      if(key === 'feHasta'         && !query[key]) delete query[key];
      if(key === 'feHasta_ts'      && !query[key]) delete query[key];
      if(key === 'fecomp_ts_d'     && !query[key]) delete query[key];
      if(key === 'fecomp_ts_h'     && !query[key]) delete query[key];
 
      if(key === 'fenovd'         && !query[key]) delete query[key];
      if(key === 'fenovh'         && !query[key]) delete query[key];
      if(key === 'fenovh_ts'      && !query[key]) delete query[key];
      if(key === 'fenovd_ts'      && !query[key]) delete query[key];

      if(key === 'barrio'         && !query[key]) delete query[key];
      if(key === 'city'           && !query[key]) delete query[key];

      if(key === 'action'         && !query[key]) delete query[key];
      if(key === 'sector'         && !query[key]) delete query[key];
      if(key === 'sectorNovedad'  && !query[key]) delete query[key];
      if(key === 'avanceNovedad'  && !query[key]) delete query[key];
      if(key === 'intervencion'   && !query[key]) delete query[key];
      if(key === 'ejecucion'      && !query[key]) delete query[key];
      if(key === 'resultado'      && !query[key]) delete query[key];
      if(key === 'urgencia'       && !query[key]) delete query[key];
      if(key === 'trabajadirId'   && !query[key]) delete query[key];


    })

    return query;
	}

	static addNoContesta(token:Asistencia): Asistencia{
		let novedades = token.novedades || [];
		let novedad = new Novedad();
		novedad.tnovedad = "nocontesta";
		novedad.novedad  = 'Llamado telefónico: No atendido';

		novedades.push(novedad);
		token.novedades = novedades;
		return token;
	}

	static getPesoPonderadoCovid(asistencia: Asistencia): number{
		return getPesoCovid(asistencia);
	} 

	static getCostoEsperaCovid(asistencia: Asistencia, ts: number): number{
    let peso = getPesoCovid(asistencia);

    return (ts - asistencia.fecomp_tsa) * COSTO[peso];
	} 

	static workflowStep(token: Asistencia, step: any){

		let avance = step.val;


		if(token.sector === 'ivr'){
			if(avance === 'esperamedico'){

				avance = getPesoCovid(token) > 5 ? 'esperamedico' : 'descartado';

			}
		}

		let estados = avance_estadoRelation[avance] || [];
		let nuevoEstado = estados.length ? estados[0].val : token.estado;	

		token.estado = nuevoEstado;
		token.avance = avance;
		return token;
	}

	static initNewAsistencia(action, sector, person?: Person, serial?: Serial, slug?){
		let ts = Date.now();
		let requirente: Requirente;
		let token = new Asistencia();
		let novedad = new Novedad();

		if(person){
			let edad = this.getEdadFromPerson(person)
			token.edad = edad + '';

			requirente = AsistenciaHelper.buildRequirente(person);
			token.idPerson = person._id;
		}else{
			requirente = new Requirente();
			token.idPerson = '';
		}

		token.fecomp_txa = devutils.txFromDateTime(ts);
		token.fecomp_tsa = ts;

		token.action = action;
		token.slug = slug || 'Atención telefónica en el COM';
		token.sector = sector;
		token.requeridox = requirente;
		token.description = '';

		if(serial){
			token.compPrefix = serial.compPrefix ;
			token.compName = serial.compName;
			token.compNum = serial.pnumero + "";
		}else{
			token.compPrefix = 'SOL' ;
			token.compName = 'S/Asistencia';
			token.compNum = '';
		}

		token.ts_alta = ts;
		token.ts_fin = 0
		token.ts_prog = ts;
		token.estado = 'activo';
		token.avance = 'emitido';
		token.tipo = 1;
		token.novedades = [ novedad ];

		return token;
	}

	static getEdadFromPerson(person){
		let edad = null
		if(person && person.fenactx){
			try {
				edad = devutils.edadActual(devutils.dateFromTx(person.fenactx));
				return edad;
			}
			catch {
				return null;
			}

		}else{
			return edad;
		}
	}

	static initNewAsistenciaEpidemio(action, sector, person?: Person, serial?: Serial, slug?){
		let ts = Date.now();
		let requirente: Requirente;
		let token = new Asistencia();
		let novedad = initNovedadToken("notifsistema", (sector||'coordinacion'));
		novedad.novedad  = 'Alta nuevo caso de seguimiento por epidemiología';


		if(person){

			let edad = this.getEdadFromPerson(person)
  		requirente = AsistenciaHelper.buildCovidRequirente(person);
			token.idPerson = person._id;
			token.ndoc = person.ndoc;
			token.tdoc = person.tdoc;
			token.sexo = person.sexo;
			token.edad = edad + '';

			let telefono = person.contactdata && person.contactdata.length && person.contactdata[0];
			token.telefono = telefono.data



			let address = person.locaciones && person.locaciones.length && person.locaciones[0];
			if(address) {
				let locacion = new Locacion();
				locacion.street1 = address.street1;
				locacion.streetIn = address.streetIn;
				locacion.streetOut = address.streetOut;
				locacion.city = address.city;
				locacion.barrio = address.barrio;
				token.locacion = locacion;
			}

		}else{
			requirente = new Requirente();
			token.idPerson = '';
		}

		token.fecomp_txa = devutils.txFromDateTime(ts);
		token.fecomp_tsa = ts;

		token.fenotif_txa = devutils.txFromDateTime(ts);
		token.fenotif_tsa = ts;

		token.hasParent = false;

		token.action = action;
		token.slug = slug || '';
		token.sector = sector;
		token.requeridox = requirente;
		token.description = '';

		if(serial){
			token.compPrefix = serial.compPrefix ;
			token.compName = serial.compName;
			token.compNum = serial.pnumero + "";
		}else{
			token.compPrefix = 'SOL' ;
			token.compName = 'S/Asistencia';
			token.compNum = '';
		}

		token.ts_alta = ts;
		token.ts_fin = 0
		token.ts_prog = ts;
		token.estado = 'activo';
		token.avance = 'emitido';
		token.novedades = [ novedad ];
		token.isVigilado = true;

		return token;
	}


	static initNewAsistenciaCovid(action, sector, person?: Person, serial?: Serial, slug?){
		let ts = Date.now();
		let requirente: Requirente;
		let token = new Asistencia();
		let novedad = new Novedad();

		if(sector === 'ivr'){
			novedad.tnovedad = "operadorivr";
			novedad.novedad  = 'Llamado emitido x servicio IVR';
			token.tipo = 3;

		}else {
			novedad.tnovedad = "operadorcom";
			novedad.novedad  = 'Llamado recibido en el COM';
			token.tipo = 1;
		}

		if(person){
			let edad = this.getEdadFromPerson(person)
			requirente = AsistenciaHelper.buildCovidRequirente(person);
			token.idPerson = person._id;
			token.edad = edad + ''

			let telefono = person.contactdata && person.contactdata.length && person.contactdata[0];
			token.telefono = telefono.data


			let address = person.locaciones && person.locaciones.length && person.locaciones[0];
			if(address) {
				let locacion = new Locacion();
				locacion.street1 = address.street1;
				locacion.streetIn = address.streetIn;
				locacion.streetOut = address.streetOut;
				locacion.city = address.city;
				locacion.barrio = address.barrio;
				token.locacion = locacion;
			}

		}else{
			requirente = new Requirente();
			token.idPerson = '';
		}

		token.fecomp_txa = devutils.txFromDateTime(ts);
		token.fecomp_tsa = ts;

		token.action = action;
		token.slug = slug || '';
		token.sector = sector;
		token.requeridox = requirente;
		token.description = '';

		if(serial){
			token.compPrefix = serial.compPrefix ;
			token.compName = serial.compName;
			token.compNum = serial.pnumero + "";
		}else{
			token.compPrefix = 'SOL' ;
			token.compName = 'S/Asistencia';
			token.compNum = '';
		}

		token.ts_alta = ts;
		token.ts_fin = 0
		token.ts_prog = ts;
		token.estado = 'activo';
		token.avance = 'emitido';
		token.novedades = [ novedad ];

		return token;
	}

	static isAsistenciaRemitible(asistencia: Asistencia): boolean {
		let isRemitible = true;



		return isRemitible;
	}

	static atencionHisopado(asistencia: Asistencia): HisopadoYa {
		return filterNecesidadDeLaboratorio(asistencia);
	}

	static getVoucherType(asistencia: Asistencia): VoucherType{
		let token = getOptListToken(this.getOptionlist('actions'), asistencia.action);
		if(!token) return null;

		let remitible = token.isRemitible;
		let payload = asistencia[token.key];

		if(!payload) remitible = false;

		let label = token.key === 'alimentos' ? 'Voucher alimentos' : 'Voucher productos';

		let voucherType = {
			type: asistencia.action,
			isRemitible: remitible,
			key: token.key,
			label: label,
			payload: payload,


		} as VoucherType;

		return voucherType;
	}



/*
		id:          string;
		type:        string = 'standard';
		periodo:     string = 'UNICO';
		fe_tsd:      number;
		fe_tsh:      number;
		fe_txd:      string;
		fe_txh:      string;
		freq:        string = 'mensual';
		qty:         number = 1;
		observacion: string;

*/

	static initNewAlimento(fe: string, fe_ts: number):Alimento{
		let alimento = new Alimento();
		alimento.fe_txd = fe;
		alimento.fe_txh = fe;
		alimento.fe_tsd = fe_ts;
		alimento.fe_tsh = fe_ts;
		return alimento;
	}

	static defaultQueryForTablero(): DashboardBrowse{
		let q = new DashboardBrowse();
		q.estado = "no_definido";
		q.avance = "no_definido";
		q.sintoma = "no_definido";
		q.sector = "no_definido";
		q.locacionhosp = 'GENERAL'

		return q;
	}

	static defaultQueryForTableroVigilancia(): DashboardBrowse{
		let q = new DashboardBrowse();
		q.estado = "no_definido";
		q.avance = "no_definido";
		q.sintoma = "no_definido";
		q.sector = "no_definido";
		delete q.locacionhosp;

		return q;
	}


	static buildDataTable(list: Asistencia[]):AsistenciaTable[]{
		return buildTableData(list);
	}

	static buildDomiciliosDataTable(list: Array<any>):AsistenciaTable[]{
		return buildDomiciliosData(list);
	}

}



/***************************************************
PERSON


S/ASISTENCIA
	tipo:        number = 1; // 1: COVID 2:Denuncia
	prioridad:   number = 2; // 1:baja 2:media 3: alta

	sintomacovid: ContextoCovid;

	fecomp_tsa:  number;
	fecomp_txa:  string;

	action:      string = 'covid';
	sector:      string;

	estado:      string = 'activo';
	avance:      string = 'emitido';

	novedades:   Array<Novedad>;;
	requeridox:  Requirente;
	atendidox:   Atendido;

	isVigilado: boolean TRUE: PERTENECE AL UNIVERSO EPIDEMIIO
	hasSeguimiento: boolean
	isCovid:    boolean TRUE: está infectado en este momento
	isInternado

	INTERNACION
		isActive
		tipo: aislamiento:intermedia:intensiva
		donde: home:exta_distrito:privado:cap:hosp:extra_hosp
		locacionId
		locacionSlug
		locacionTxt
		hasSolInternacion: boolean

	SISA ACTIVE
		isActive:
		fe_reportado
		fe_baja
		estado
		avance

		SISA_CONSULTAS
			fe_consulta
			avance: reportado|no_reportado|espera_resultado|resultado_obtendido
			slug





	HISOPADO ACTIVE
		isActive: boolean // tiene un hisopado en curso
		fe_toma
		fe_ingestudio
		fe_resestudio
		fe_notificacion
		alerta: number 1/2/3
		organismo: SELECT OÑATIVIA|CRUCE|
		organismo_txt:
		estado: verificado|no_verificado|invalido
		resultado: pcr_positivo, pcr_negativo, sisa_descartó, sisa_invalidó
		slug



	CONTEXTO
		qconvivientes: number
		qcoworkers: number
		context_list
			personId
			slug
			hasActiveCovid
			hasActiveFollowing


	COVID
		fe_inicio
		fe_confirma
		fe_alta
		isActive: boolean
		hasActiveCovid: boolean
		estado: POSIBLE|PROBABLE|ACTIVA|EN_RECUPERACION|DE_ALTA
		qconvivientes: number
		qcoworkers: number



	SEGUIMIENTO DE AFECTADO
		isActive
		fe_inicio
		fe_ucontacto
		fe_ullamado
		qllamados
		qefectivos
		tipo: ventana_14: infectado: en_recuperacion
		evolucion: estable|mejora|desmejora

	COMORBILIDAD
		comorbilidades: []
			tipo
			hasTipo
			qty
			slug






	VIGILANCIA EPIDEMIOLÓGICA



EVENTOS Y CAMBIOS DE ESTADO

ALTA 

OJO:
al crear la S/asistencia
	sexo, edad, fecha nacim en requeridox

**************************************************/
