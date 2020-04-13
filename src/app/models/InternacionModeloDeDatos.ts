import { devutils } from '../develar-commons/utils';

/*************************************************/
/*********  SOLICITUD DE INTERNACIÓN       ******/
/*********  Model: SolicitudInternacion   ******/
/**********************************************/
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

/*****  TRIAGE: se corresponde con el dato más moderno del estado del afectado/a   ******/
/*****  La historia de la evolución se verá reflejada en las novedades  ******/
export class MotivoInternacion { // triage
	afeccion:     string = 'COVID'; //
	target:       string = 'intermedios';
	servicio:     string = 'INTERNACION';
	especialidad: string = 'clinica'
	slug:         string = 'Intervención COVID';
	constructor(spec){
		if(spec && spec.servicio){
			if(spec.servicio === 'UTI' || spec.servicio === 'UTE' || spec.servicio === 'UCO'){
				this.servicio = spec.servicio;
				this.target = 'intensivos'
			}
			if(spec.servicio === 'CONSULEXT' || spec.servicio === 'GUARDIA' ){
				this.servicio = spec.servicio;
				this.target = 'guardia'
			}
			if(spec.servicio === 'PEDIATRICA' ){
				this.servicio = spec.servicio;
				this.target = 'pediatrica'
			}
			if(spec.servicio === 'AISLAMIENTO' ){
				this.servicio = spec.servicio;
				this.target = 'aislamiento'
			}
		}
	}
}

/*****  INTERNACION: ESTADO de internación, una vez que tiene asignado una Locación Hospitalaria  ******/
export class Internacion {
	locId:         string; // Id de la locación hospitalaria
	locSlug:       string; // leyenda opcional 

	transitoId:    string;

	estado:     string = 'programado' // programado|transito|admision|alocado|traslado|externacion|salida|baja
	servicio:   string;
	sector:     string; // Lugar físico del HOSP: sector / area / sala
	piso:       string; // Lugar físico del HOSP: piso o nivel
	hab:        string; // Lugar físico del HOSP: sala o hab
	camaCode:   string; // Identificador de la CAMA
	camaSlug:   string; // Código completo de la CAMA, según el modo de exposición del HOSP
	recursoId:  string; // id de la colección de RECURSOS del HOSP referenciado por locId
}

export class Requirente { // esta es la identificación del AFECTADO/A
		id:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string;
		nombre?: string;
		apellido?: string; 
};
 
export class Atendido { // esta es la identificación del USUARIO
		id:      string;
		slug:    string;
		sector:  string;
};

export class Novedad { // PENDIENTE: ajustar la novedad para que pueda operar de parte médico.
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

/*********  ARRAY SOLICITUDINTERNACION  EXAMPLE  ******/
[{
	"_id" :"5e8fcce7a8155c16c4428159",
	"ts_baja" : 0,
	"compPrefix" : "SOL",
	"compName" : "S/Internacion",
	"compNum" : "100019",
	"tipo" : "internacion",
	"prioridad" : 2,
	"estado" : "activo",
	"avance" : "emitido",
	"queue" : "pool",
	"fecomp_txa" : "09/04/2020",
	"fecomp_tsa" : 1586482407646,
	"sector" : "comando",
	"action" : "internacion",
	"slug" : "Triage comando general",
	"description" : "Alta rápida",
	"requeridox" : {
		"_id" :"5e8fcce7a8155c16c442815a",
		"id" : "5e8aa5ac94f871175b0eb20d",
		"slug" : "Pelloni, Marta",
		"tdoc" : "DNI",
		"ndoc" : "22111353"
	},
	"atendidox" : {
		"_id" :"5e8fcce7a8155c16c442815b",
		"slug" : "MateoGO",
		"sector" : "comando"
	},
	"triage" : {
		"_id" :"5e8fcce7a8155c16c442815c",
		"afeccion" : "COVID",
		"target" : "intensivos",
		"servicio" : "UTI",
		"especialidad" : "clinica",
		"slug" : "Intervención COVID"
	},
	"ts_alta" : 1586482407675,
	"ts_umodif" : 1586482407675,
	"novedades" : [ ],
	"transitos" : [ ],
	"__v" : 0
},
{
	"_id" :"5e8fcd31a8155c16c4428160",
	"ts_baja" : 0,
	"compPrefix" : "SOL",
	"compName" : "S/Internacion",
	"compNum" : "100020",
	"tipo" : "internacion",
	"prioridad" : 2,
	"estado" : "activo",
	"avance" : "emitido",
	"queue" : "alocado",
	"fecomp_txa" : "09/04/2020",
	"fecomp_tsa" : 1586482481930,
	"sector" : "comando",
	"action" : "internacion",
	"slug" : "Triage comando general",
	"description" : "Alta rápida",
	"requeridox" : {
		"_id" :"5e8fcd31a8155c16c4428161",
		"id" : "5e8f20c9eb912a126fc1e03d",
		"slug" : "Garcia, Charlie",
		"tdoc" : "DNI",
		"ndoc" : "22111354"
	},
	"atendidox" : {
		"_id" :"5e8fcd31a8155c16c4428162",
		"slug" : "MateoGO",
		"sector" : "comando"
	},
	"triage" : {
		"_id" :"5e8fcd31a8155c16c4428163",
		"afeccion" : "COVID",
		"target" : "intensivos",
		"servicio" : "UTI",
		"especialidad" : "clinica",
		"slug" : "Intervención COVID"
	},
	"ts_alta" : 1586482481942,
	"ts_umodif" : 1586484751191,
	"novedades" : [ ],
	"transitos" : [
		{
			"_id" :"5e8fcd58a8155c16c442816d",
			"transitType" : "pool:transito",
			"estado" : "programado",
			"target" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "programado",
				"servicio" : "UTI",
				"sector" : "SeCtOr",
				"piso" : "PiSo",
				"hab" : "HAB",
				"camaCode" : "101",
				"camaSlug" : "101",
				"recursoId" : null
			},
			"from" : null,
			"locacion" : null,
			"atendidox" : null,
			"fe_prog" : "09/04/2020",
			"slug" : "Locación de internacion asignada",
			"fe_ts" : 1586482520882
		},
		{
			"_id" :"5e8fcda1a8155c16c4428178",
			"transitType" : "transito:servicio",
			"estado" : "alocado",
			"target" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "alocado",
				"servicio" : "UTI",
				"sector" : "Sector COVID",
				"piso" : "PiSo",
				"hab" : "Hab 101",
				"camaCode" : "01",
				"camaSlug" : "101-01",
				"recursoId" : null
			},
			"from" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "alocado",
				"servicio" : "UTI",
				"sector" : "Sector COVID",
				"piso" : "PiSo",
				"hab" : "Hab 101",
				"camaCode" : "01",
				"camaSlug" : "101-01",
				"recursoId" : null
			},
			"locacion" : null,
			"atendidox" : null,
			"fe_prog" : "09/04/2020",
			"slug" : "Locación de internacion asignada",
			"fe_ts" : 1586482593185
		},
		{
			"_id" :"5e8fcf26a8155c16c442818a",
			"transitType" : "transito:servicio",
			"estado" : "alocado",
			"target" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "alocado",
				"servicio" : "UTI",
				"sector" : "Sector COVID",
				"piso" : "PiSo",
				"hab" : "Hab 901",
				"camaCode" : "03",
				"camaSlug" : "901-03",
				"recursoId" : null
			},
			"from" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "alocado",
				"servicio" : "UTI",
				"sector" : "Sector COVID",
				"piso" : "PiSo",
				"hab" : "Hab 901",
				"camaCode" : "03",
				"camaSlug" : "901-03",
				"recursoId" : null
			},
			"locacion" : null,
			"atendidox" : null,
			"fe_prog" : "09/04/2020",
			"slug" : "Locación de internacion asignada",
			"fe_ts" : 1586482982944
		},
		{
			"_id" :"5e8fd022a8155c16c442819e",
			"transitType" : "transito:servicio",
			"estado" : "alocado",
			"target" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "alocado",
				"servicio" : "INTERNACION",
				"sector" : "Sector COVID",
				"piso" : "P-8",
				"hab" : "Hab 801",
				"camaCode" : "04",
				"camaSlug" : "801-04",
				"recursoId" : null
			},
			"from" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "alocado",
				"servicio" : "INTERNACION",
				"sector" : "Sector COVID",
				"piso" : "P-8",
				"hab" : "Hab 801",
				"camaCode" : "04",
				"camaSlug" : "801-04",
				"recursoId" : null
			},
			"locacion" : null,
			"atendidox" : null,
			"fe_prog" : "09/04/2020",
			"slug" : "Locación de internacion asignada",
			"fe_ts" : 1586483234560
		},
		{
			"_id" :"5e8fd2572f06c516d7622b60",
			"transitType" : "transito:servicio",
			"estado" : "alocado",
			"target" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "alocado",
				"servicio" : "GUARDIA",
				"sector" : "Sector COVID",
				"piso" : "P-8",
				"hab" : "Hab 801",
				"camaCode" : "04",
				"camaSlug" : "801-04",
				"recursoId" : null
			},
			"from" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "alocado",
				"servicio" : "GUARDIA",
				"sector" : "Sector COVID",
				"piso" : "P-8",
				"hab" : "Hab 801",
				"camaCode" : "04",
				"camaSlug" : "801-04",
				"recursoId" : null
			},
			"locacion" : null,
			"atendidox" : null,
			"fe_prog" : "09/04/2020",
			"slug" : "Locación de internacion asignada",
			"fe_ts" : 1586483799194
		},
		{
			"_id" :"5e8fd60fa5983916f183e5e9",
			"transitType" : "transito:servicio",
			"estado" : "alocado",
			"target" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "alocado",
				"servicio" : "INTERNACION",
				"sector" : "Sector COVID",
				"piso" : "P-8",
				"hab" : "Hab 801",
				"camaCode" : "04",
				"camaSlug" : "801-04",
				"recursoId" : null
			},
			"from" : {
				"_id" :"5e8fcd58a8155c16c442816c",
				"locId" : "5e8ea796b0cac410ce34e6cd",
				"estado" : "alocado",
				"servicio" : "GUARDIA",
				"sector" : "Sector COVID",
				"piso" : "P-8",
				"hab" : "Hab 801",
				"camaCode" : "04",
				"camaSlug" : "801-04",
				"recursoId" : null
			},
			"locacion" : null,
			"atendidox" : null,
			"fe_prog" : "09/04/2020",
			"slug" : "Locación de internacion asignada",
			"fe_ts" : 1586484751200
		}
	],
	"__v" : 6,
	"internacion" : {
		"_id" :"5e8fcd58a8155c16c442816c",
		"locId" : "5e8ea796b0cac410ce34e6cd",
		"estado" : "alocado",
		"servicio" : "INTERNACION",
		"sector" : "Sector COVID",
		"piso" : "P-8",
		"hab" : "Hab 801",
		"camaCode" : "04",
		"camaSlug" : "801-04",
		"recursoId" : null
	}
}]


/*******************************************/
/*********  ARRAY MASTER ALLOCATION   ******/
/*****************************************/
export class MasterAllocation {
  id: string;    // hospital _id ó 'pool'
  code: string;  // code del hospital
  slug: string;  // denom del hospital
  direccion: string; // direccion postal
  servicios: Array<EstadoServicios>;
  disponible: DisponiblePorArea;
}


export class EstadoServicios {
  type: string // tipo de Servicio UTI, UTE, etc.UTE
  code: string // printAs... del servicios
  nominal: number;
  adicional: number;
  ocupado: number;
  // disponible máximo  =  (nominal + adicional) - ocupado
}

export class EstadoAreasInternacion {
  capacidad: number;
  ocupado: number;
}

export class DisponiblePorArea {
  intensivos: EstadoAreasInternacion;
  intermedios: EstadoAreasInternacion;
  aislamiento: EstadoAreasInternacion;
  ambulatorio: EstadoAreasInternacion;
}

/*********  ARRAY MASTER ALLOCATION  EXAMPLE  ******/
[

    {
        "id": "5e8ea796b0cac410ce34e6cd",
        "code": "HLM",
        "slug": "HOSPITAL LUCIO MELÉNDEZ",
        "direccion": "",
        "servicios": [
            {
                "type": "UTI",
                "code": "UTI",
                "nominal": 5,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "UTE",
                "code": "UTE",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "UCO",
                "code": "UCO",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "INTERNACION",
                "code": "INT-GENERAL",
                "nominal": 12,
                "adicional": 0,
                "ocupado": 1
            },
            {
                "type": "AISLAMIENTO",
                "code": "AISLAMIENTO",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "CONSULEXT",
                "code": "CONS-EXT",
                "nominal": 5,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "GUARDIA",
                "code": "GUARDIA",
                "nominal": 6,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "TRANSITO",
                "code": "TRANSITO",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "TRASLADO",
                "code": "TRASLADO",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "ADMISION",
                "code": "ADMISIÓN",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "EXTERNACION",
                "code": "EXTERNACIÓN",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            }
        ],
        "disponible": {
            "intensivos": {
                "capacidad": 5,
                "ocupado": 0
            },
            "intermedios": {
                "capacidad": 12,
                "ocupado": 1
            },
            "aislamiento": {
                "capacidad": 0,
                "ocupado": 0
            },
            "ambulatorios": {
                "capacidad": 11,
                "ocupado": 0
            }
        }
    },
    {
        "id": "5e907640fbf5d70a3c705890",
        "code": "HOTVIA",
        "slug": "HOSPITAL OÑATIVIA",
        "direccion": "",
        "servicios": [
            {
                "type": "UTI",
                "code": "UTI",
                "nominal": 4,
                "ocupado": 0
            },
            {
                "type": "UTE",
                "code": "UTE",
                "nominal": 0,
                "ocupado": 0
            },
            {
                "type": "UCO",
                "code": "UCO",
                "nominal": 0,
                "ocupado": 0
            },
            {
                "type": "INTERNACION",
                "code": "INT-GENERAL",
                "nominal": 12,
                "ocupado": 0
            },
            {
                "type": "AISLAMIENTO",
                "code": "AISLAMIENTO",
                "nominal": 0,
                "ocupado": 0
            },
            {
                "type": "CONSULEXT",
                "code": "CONS-EXT",
                "nominal": 12,
                "ocupado": 0
            },
            {
                "type": "GUARDIA",
                "code": "GUARDIA",
                "nominal": 9,
                "ocupado": 0
            },
            {
                "type": "TRANSITO",
                "code": "TRANSITO",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "TRASLADO",
                "code": "TRASLADO",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "ADMISION",
                "code": "ADMISIÓN",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            },
            {
                "type": "EXTERNACION",
                "code": "EXTERNACIÓN",
                "nominal": 0,
                "adicional": 0,
                "ocupado": 0
            }
        ],
        "disponible": {
            "intensivos": {
                "capacidad": 4,
                "ocupado": 0
            },
            "intermedios": {
                "capacidad": 12,
                "ocupado": 0
            },
            "aislamiento": {
                "capacidad": 0,
                "ocupado": 0
            },
            "ambulatorios": {
                "capacidad": 21,
                "ocupado": 0
            }
        }
    },
    // PSEUDO-HOSPITAL: POOL. SE GENERA AL VUELO, SOLO SI HAY S/INTERNACIÓN EN POOL
    {
        "id": "pool",
        "code": "pool",
        "direccion": "",
        "servicios": [ ],
        "disponible": {
            "intensivos": {
                "capacidad": 0,
                "ocupado": 1
            },
            "intermedios": {
                "capacidad": 0,
                "ocupado": 0
            },
            "aislamiento": {
                "capacidad": 0,
                "ocupado": 0
            },
            "ambulatorios": {
                "capacidad": 0,
                "ocupado": 0
            }
        }
    }

]