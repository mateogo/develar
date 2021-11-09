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

export class ObservacionBrowse {
	type:      string = "general";
	fed:       string;
	feh:       string;
	entityType: string = 'person';
	searchAction: string;
	action: string;

	slug: string;

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

export class ObservacionTable {
  _id: string;
  type: string;
  fe_tx: string;
  fe_ts: number;
  entitySlug: string;
  observacion: string;
}
