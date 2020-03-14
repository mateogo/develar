import { devutils } from '../../develar-commons/utils';
import { Serial } from '../salud.model';
import { Person }        from '../../entities/person/person';

export class Requirente {
		id:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string; 
};
 
export class Atendido {
		id:      string;
		slug:    string;
		sector:  string;
};

export class Payload {
		id:         string; 
		modulo:     string; 
		componente: string; 
		ruta:       string; 
};

export class Turno {
		_id: string;
		compPrefix:  string;
		compName:    string;
		compNum:     string;
		type:        string;
		name:        string;
		sector:      string;
		letra:       string;
		peso:        number;
		estado:      string;
		resultado:   string;
		ts_alta:     number;
		ts_fin:      number;
		ts_prog:     number;
		requeridox:  Requirente;
		atendidox:   Atendido;
		payload:     Payload;
		observacion: string;
};

export interface TurnoAction {
	id_turno: string;
	turno: Turno;
	action: string;
	estado: string;
	resultado?: string;
	atendidox?: Atendido;
	payload?: Payload;
	observación?: string;
}
//const LETRAS = ['X', 'Q', 'J', 'A', 'D'];
export const prioridadOptLst = [
			{val: 0,   label: 'Normal (X)'       },
			{val: 1,   label: 'Prioridad (Q)'       }, 
			{val: 2,   label: 'Prioridad x Discapacidad (J)'  },
			{val: 3,   label: 'Prioridad x Embarazada ó con Bebé (A)' },
			{val: 4,   label: 'Atención Especial (D)'    },
	];


export class PriorityToken {
	prioridad: number = 0;
	action: string;

}


// TurnoAction:action = [atender|baja|cumplido|derivar]

/**************
 * Tranciciones de ESTADO
 *    (estado, resultado)
 *    [(pendiente, pendiente) ->
 *					(llamado, presentado), (llamado, ausente) ->
 *					|(atendido, cumplido),(atendido, incumplido),(atendido, redirigido),
 *						|(baja, ausente)]
 *********/

const COSTO = [1, 2, 3, 4, 10];

function costo (turno: Turno, ts:number){
	if(!turno.peso || turno.peso > 4 || turno.peso < 0) turno.peso = 0;

	return (ts - turno.ts_alta) * COSTO[turno.peso];
}


function _sortProperly(records: Turno[]):Turno[]{
	let ts_now = Date.now();

	records.sort((fel: Turno, sel: Turno)=> {
		let cfel = costo(fel, ts_now);
		let csel = costo(sel, ts_now);


		if(cfel < csel ) return 1;

		else if(cfel > csel) return -1;

		else return 0;
	});

	return records;
}

const optionsLists = {
	 default: prioridadOptLst,
	 prioridad: prioridadOptLst,

}


function getLabel(list, val){
		let t = list.find(item => item.val === val)
		return t ? t.label : val;
}



export class TurnosModel {
	static initNewTurno(type, name, sector, serial: Serial, peso: number,  person: Person){
		let ts = Date.now();
		let requirente = new Requirente();
		requirente.id = person._id;
		requirente.slug = person.displayName;
		requirente.tdoc = person.tdoc;
		requirente.ndoc = person.ndoc;

		let turno = new Turno();
		turno.compPrefix = serial.compPrefix ;
		turno.compName = serial.compName;
		turno.compNum = serial.pnumero + "";
		turno.type = type;
		turno.name = name;
		turno.sector = sector;
		turno.letra = serial.letra;
		turno.peso = peso || 1;
		turno.estado = 'pendiente';
		turno.resultado = 'pendiente';
		turno.ts_alta = ts;
		turno.ts_fin = 0
		turno.ts_prog = ts;
		turno.observacion = "";
		turno.requeridox = requirente;

		return turno;
	}

	static turnosPorSectorQuery(type, name, sector){

		let query = {
			type: type,
			name: name,
			sector: sector,
			estado: 'pendiente',
		};

		return query;
	}

	static turnosPendientesQuery(type, name){

		let query = {
			type: type,
			name: name,
			estado: 'pendiente',
		};

		return query;
	}

	static turnosPorDiaSectorQuery(type, name, sector){
		let today = new Date();
		let time = new Date(today.getFullYear(),today.getMonth(), today.getDate(),0,0,0)

		let query = {
			type: type,
			name: name,
			sector: sector,
			ts_prog: time.getTime()
		};

		return query;
	}

	static sortProperly(turnos: Turno[]): Turno[]{

		return _sortProperly(turnos);
	}

	static getOptionlist(type){
		return optionsLists[type] || optionsLists['default'];
	}

	static getOptionLabel(type, val){
		if(!val) return 'no-definido';
		if(!type) return val;
		return getLabel(this.getOptionlist(type), val);
	}

}
