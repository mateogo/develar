export class Observacion {

		_id:         string; 
		type:        string;
		fe_tx:       string; 
		fe_ts:       number; 
		ts_umod:     number;
		is_pinned:   boolean = false;

		observacion: string;

		parent:       ParentEntity;
		audit:        Audit;
		comentarios:  Comentario[];

}

export class Audit {
	userId:      string;
	username:    string;
	ts_alta: number;
};

export class ParentEntity {
	entityType: string; // person|
	entityId: string;
	entitySlug: string;
}

export class Comentario {
	slug: string;
	audit:   Audit;
}
