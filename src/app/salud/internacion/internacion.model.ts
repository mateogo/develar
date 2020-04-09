import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../salud.model';

import { Person, Address }   from '../../entities/person/person';
import { LocacionHospitalaria} from '../../entities/locaciones/locacion.model';
import { sectores } from '../salud.model';


export class Novedad {
		_id?: string;
		tnovedad: string = 'operadorcom';
		novedad: string = '';
		fecomp_tsa:  number;
		fecomp_txa:  string;
		atendidox: Atendido;

		constructor(){
			let hoy = new Date();

			this.fecomp_tsa = hoy.getTime();
			this.fecomp_txa = devutils.txFromDate(hoy);
		}
}

export class Locacion {
    _id?: string;
    slug: string = '';
    street1: string = '';
    streetIn: string = '';
    streetOut: string = '';
    city: string = '';
    barrio?: string = '';
    lat: number = 0;
    lng: number = 0;
}

export class Requirente {
		id:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string;
		nombre?: string;
		apellido?: string; 
};
 
export class Atendido {
		id:      string;
		slug:    string;
		sector:  string;
};

export class Transito {
	_id:           string;
	transitType:   string; // 'pool:internacion', 'internacion:internacion', 'internacion:pool'
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

export class MotivoInternacion {
	afeccion: string = 'COVID'; //
	target: string = 'intermedios';
	servicio: string = 'INTERNACION';
	especialidad: string = 'clinica'
	slug: string =     'Intervención COVID';

}

export class Internacion {
	locId:         string;
	locSlug:       string;
	locEstado:     string = 'programado' // programado|transito|admision|alocado|traslado|externacion|salida|baja
	transitoId:    string;
	locServicio:   string;
	locSector:     string;
	locPiso:       string;
	locHab:        string;
	locCama:       string;
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
// cirujía
// clinica médica
// clinica quirúrgica
// gineco-obstétrica
// pediátrica

// CAMAS INTERMEDIOS // INTENSIVOS
// OBSERVACIÓN



// ESTADÍSTICA HOSPITALARIA


//sector = comando|hospital|


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
		avance:      string = 'emitido';
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
		ts_alta:     number;
		prioridad:   string;
};

export class InternacionSpec {
		tipo:        string = 'internacion'
		prioridad:   number = 2; // 1:baja 2:media 3: alta

		fecomp_txa:  string;
		fecomp_tsa:  number;
	
		sector:      string;
		action:      string;
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

