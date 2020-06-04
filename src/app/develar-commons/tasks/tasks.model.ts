export class Task {

		_id:           string; 
		type:          string;
		compNum:       string;
		compName:      string;
		modulo:        string = 'salud';

		fe_alta:       string; 
		fe_alta_ts:    number;
		ts_umod:       number;
		is_pinned:     boolean = false;

		fe_vto:        string;
		fe_vto_ts:     number;

		fe_cierre:     string;
		fe_cierre_ts:  number;

		estado:        string;
		avance:        string;
		asignado:      string;

		requerimiento:   string;
		observacion:     string;

		beneficiario:        Beneficiario;
		parent:        ParentEntity;
		audit:         Audit;
		followUp:    FollowUp[];
}

export class Asignado {
	secretaria: string;
	sector: string; 
	action: string;
}

export class Beneficiario {
		personId:   string;
		slug: string; 
		tdoc: string; 
		ndoc: string;
		
		telefono: string;
		locacion: string;
		locacionx: string; // información extra
		barrio: string;
		city: string;

		sexo?: string;
		fenac?: string;
		edad?: number;
		nombre?: string;
		apellido?: string; 
};


export class Audit {
	userId:      string;
	username:    string;
	ts_alta: number;
};

export class ParentEntity {
	entityType: string; // person|
	entityId: string;
	entitySlug: string;
	entityTag: string; // discriminante auxiliar, por ejemplo Nucleo habitacional
}

export class FollowUp {
	status:  string;
	slug:    string;
	audit:   Audit;
}
