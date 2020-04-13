import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SolicitudesApi {
    getSolicitudesInternacion$(): Observable<any[]>{
        //TODO: llamar a la API
        return (
            new BehaviorSubject<any[]>(SOLICITUDES_INTERNACION)
        ).asObservable();
    }
}

export const SOLICITUDES_INTERNACION = [{
	"_id" : "5e8fcce7a8155c16c4428159",
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
		"_id" : "5e8fcce7a8155c16c442815a",
		"id" : "5e8aa5ac94f871175b0eb20d",
		"slug" : "Pelloni, Marta",
		"tdoc" : "DNI",
		"ndoc" : "22111353"
	},
	"atendidox" : {
		"_id" : "5e8fcce7a8155c16c442815b",
		"slug" : "MateoGO",
		"sector" : "comando"
	},
	"triage" : {
		"_id" : "5e8fcce7a8155c16c442815c",
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
	"_id" : "5e8fcd31a8155c16c4428160",
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
		"_id" : "5e8fcd31a8155c16c4428161",
		"id" : "5e8f20c9eb912a126fc1e03d",
		"slug" : "Garcia, Charlie",
		"tdoc" : "DNI",
		"ndoc" : "22111354"
	},
	"atendidox" : {
		"_id" : "5e8fcd31a8155c16c4428162",
		"slug" : "MateoGO",
		"sector" : "comando"
	},
	"triage" : {
		"_id" : "5e8fcd31a8155c16c4428163",
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
			"_id" : "5e8fcd58a8155c16c442816d",
			"transitType" : "pool:transito",
			"estado" : "programado",
			"target" : {
				"_id" : "5e8fcd58a8155c16c442816c",
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
			"_id" : "5e8fcda1a8155c16c4428178",
			"transitType" : "transito:servicio",
			"estado" : "alocado",
			"target" : {
				"_id" : "5e8fcd58a8155c16c442816c",
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
				"_id" : "5e8fcd58a8155c16c442816c",
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
			"_id" : "5e8fcf26a8155c16c442818a",
			"transitType" : "transito:servicio",
			"estado" : "alocado",
			"target" : {
				"_id" : "5e8fcd58a8155c16c442816c",
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
				"_id" : "5e8fcd58a8155c16c442816c",
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
			"_id" : "5e8fd022a8155c16c442819e",
			"transitType" : "transito:servicio",
			"estado" : "alocado",
			"target" : {
				"_id" : "5e8fcd58a8155c16c442816c",
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
				"_id" : "5e8fcd58a8155c16c442816c",
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
			"_id" : "5e8fd2572f06c516d7622b60",
			"transitType" : "transito:servicio",
			"estado" : "alocado",
			"target" : {
				"_id" : "5e8fcd58a8155c16c442816c",
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
				"_id" : "5e8fcd58a8155c16c442816c",
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
			"_id" : "5e8fd60fa5983916f183e5e9",
			"transitType" : "transito:servicio",
			"estado" : "alocado",
			"target" : {
				"_id" : "5e8fcd58a8155c16c442816c",
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
				"_id" : "5e8fcd58a8155c16c442816c",
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
		"_id" : "5e8fcd58a8155c16c442816c",
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
}];