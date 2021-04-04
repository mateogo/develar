import { devutils } from '../../develar-commons/utils';
import { Recurso } from '../../entities/locaciones/locacion.model';

export class Novedad {
		_id?:        string;
		tnovedad:    string = 'operadorcom';
		novedad:     string = '';
		fecomp_txa:  string;
		fecomp_tsa:  number;
		atendidox:   Atendido;

		constructor(){
			let hoy = new Date();

			this.fecomp_tsa = hoy.getTime();
			this.fecomp_txa = devutils.txFromDate(hoy);
		}
}

export class Locacion {
    _id?:      string;
    slug:      string = '';
    street1:   string = '';
    streetIn:  string = '';
    streetOut: string = '';
    city:      string = '';
    barrio?:   string = '';
    lat: number = 0;
    lng: number = 0;
}

export class Requirente {
		id:        string; 
		slug:      string; 
		tdoc:      string; 
		ndoc:      string;
		nombre?:   string;
		apellido?: string; 
};
 
export class Atendido {
		id:      string;
		slug:    string;
		sector:  string;
};

export class Transito {
	_id:           string;
	transitType:   string = 'pool:transito'; // 'pool:internacion', 'internacion:internacion', 'internacion:pool'
	estado:        string = 'programado'; // programado / enejecucion / cumplido / finalizado/ baja
	target:        Internacion;
	from:          Internacion;
	locacion:      Locacion;
	atendidox:     Atendido;
	fe_prog:       string;
	fe_cumplido:   string;
	fe_ts:         number;
	slug:          string;
}


export class MotivoInternacion { // triage
	transitType:  string = 'pool:pool';
	afeccion:     string = 'COVID'; //
	target:       string = 'intermedios';
	servicio:     string = 'INTERNACION';
	especialidad: string = 'clinica'
	slug:         string = 'Intervención COVID';
	description:  string = '.';

	constructor(spec){
		if(spec && spec.servicio){
				this.servicio = spec.servicio;
		}
	}

}

export class Internacion {
	locId:         string;
	locSlug:       string = 'HLM';
	locCode:       string = 'HLM';

	slug:          string = '';
	description:   string = '';
	profesional:   string = '';

	transitoId:    string;

	estado:     string = 'programado' // programado|transito|admision|alocado|traslado|externacion|salida|baja
	servicio:   string;
	sector:     string;  // sector / area / sala
	piso:       string; // piso o nivel
	hab:        string; // sala o hab
	camaCode:   string; // code de la cama
	camaSlug:   string; // denominación de la cama en el HOSP
	recursoId:  string;
}


export class SolicitudInternacion {
		_id: string;
		compPrefix:  string = 'SOL';
		compName:    string = 'S/Internacion';
		compNum:     string = '00000';
		tipo:        string = 'internacion'

		prioridad:   number = 2; // 1:baja 2:media 3: alta

		fecomp_txa:  string;
		fecomp_tsa:  number;
	
		sector:      string;
		action:      string;
		slug:        string;
		description: string;

		estado:      string = 'activo'; // activo|baja
		avance:      string = 'emitido'; // esperatraslado
		queue:       string = 'pool';  // pool|transito|alocado|baja

		ts_alta:     number;
		ts_umodif:   number;
		ts_baja:     number;
		
		triage:      MotivoInternacion;
		internacion: Internacion;
		requeridox:  Requirente;
		atendidox:   Atendido;

		novedades:   Array<Novedad>;;
		transitos:   Array<Transito>;
};

export class SolInternacionTable {
		_id: string;
		asistenciaId: string;
		compName:    string;
		compNum:     string;
		personId:    string;
		personSlug:  string;
		fecomp_tsa:  number;
		fecomp_txa:  string;
		action:      string;
		slug:        string;
		description: string;
		sector:      string;
		estado:      string;
		avance:      string;
		ts_alta:     number;
		prioridad:   string;
};

export class SolInternacionBrowse {
		_id: string;
		asistenciaId: string;
		compName:    string;
		compNum:     string;
		personId:    string;
		personSlug:  string;
		fecomp_tsa:  number;
		fecomp_txa:  string;
		action:      string;
		slug:        string;
		description: string;
		sector:      string;
		estado:      string;
		avance:      string;
		servicio:    string;

		searchAction: string;

		feDesde:    string;
		feHasta:    string;
		feDesde_ts?: number = 0;
		feHasta_ts?: number = 0;


		ts_alta:     number;
		prioridad:   string;
};

export class InternacionSpec {
		tipo:        string = 'internacion'
		prioridad:   number = 2; // 1:baja 2:media 3: alta

		fecomp_txa:  string;
		fecomp_tsa:  number;
		transitType: string = 'pool:transito';
	
		sector:      string;
		action:      string;
		servicio:    string;
		slug:        string;
		description: string;

		estado:      string = 'activo'; // activo|baja
		avance:      string = 'emitido';
		queue:       string = 'pool';  // pool|transito|alocado|baja
		constructor(){
			let today = new Date();
			this.fecomp_txa = devutils.txFromDate(today);
			this.fecomp_tsa = today.getTime();
			this.sector = 'comando';
			this.action = 'internacion';
			this.slug = 'Triage comando general';
			this.description = 'Alta rápida';

		}
}


export class EstadoServicios {
  type: string // tipo de Servicio UTI, UTE, etc.UTE
  code: string // printAs... del servicios
  nominal: number;
  adicional: number;
  ocupado: number;
  // disponible máximo  =  (nominal + adicional) - ocupado
}
export class AcumuladoresPorArea {
	total: number;
	adu: number;
	ped: number;
	neo: number;

}

export class EstadoAreasInternacion {
  capacidad: AcumuladoresPorArea;
  ocupado: AcumuladoresPorArea;
}

export class DisponiblePorArea {
  intensivos: EstadoAreasInternacion;
  intermedios: EstadoAreasInternacion;
  pediatrica: EstadoAreasInternacion;
  neonatologia: EstadoAreasInternacion;
  aislamiento: EstadoAreasInternacion;
  ambulatorio: EstadoAreasInternacion;

}

 export class MasterAllocation {
  id: string;    // hospital _id ó 'pool'
  code: string;  // code del hospital
  slug: string;  // denom del hospital
  type: string; // tipo de hospital (PRIVADO)
  direccion: string; // direccion postal
  servicios: Array<EstadoServicios>;
  disponible: DisponiblePorArea;
}

export interface UpdateInternacionEvent {
	action: string;
	type: string;
	items?: any;
	token: SolicitudInternacion|MotivoInternacion;
};

export interface MasterSelectedEvent {
	action: string;
	type: string;
	token: MasterAllocation;
};

export class AsignarRecursoEvent {
  action: string = 'asignar';
  transition?: string = ''
  sinternacion: SolicitudInternacion;
  recurso: Recurso;
  servicio: string;
}

// helper class que se usa en centro-de-operaciones
// identifica una locación y su disponibilidad puntual para cierto target busscado
export class LocacionAvailable {
  target?: string;
  servicio?: string;
  id: string;
  code: string;
  slug: string;
  capacidad = 0;
  ocupado = 0;


}


// servicios: 
// áreas: internacion 
// cuidados intermedios: internacio
// cuidados intensivos: CUNAS NEONATOLOGÍA/ UCO / PEDIATRICA
// terapia intensiva || unidad coronaria
// internacion pediatrica / adultos / 
// especialidades: traumatología / 

// SERVICIO: CAMAS O CONSULTORIOS O SALAS DE PARTO
//

// PISO|NIVEL / SECTOR|SALA|AREA / SALA|HABITACION  / CAMA
//  

// AREA DE INTERNACIÓN // CUIDADOS PROGRESIVOS
// CLINICA MEDICA / QUIRURGICA / CUIDADOS INTEREDIS.

// AREA
// cirugía
// clinica médica
// clinica quirúrgica
// gineco-obstétrica
// pediátrica

// CAMAS INTERMEDIOS // INTENSIVOS
// OBSERVACIÓN



// ESTADÍSTICA HOSPITALARIA


//sector = comando|hospital|

