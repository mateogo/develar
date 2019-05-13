import { devutils } from '../../develar-commons/utils';
import { Serial } from '../dsocial.model';
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
// TurnoAction:action = [atender|baja|cumplido|derivar]

/**************
 * Tranciciones de ESTADO
 *    (estado, resultado)
 *    [(pendiente, pendiente) ->
 *					(llamado, presentado), (llamado, ausente) ->
 *					|(atendido, cumplido),(atendido, incumplido),(atendido, redirigido),
 *						|(baja, ausente)]
 *********/

export class TurnoslModel {
	static initNewTurno(type, name, sector, serial: Serial, person: Person){
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


}
