import { devutils } from '../develar-commons/utils';
import { Person, CoberturaData }  from '../entities/person/person';



const delegaciones = [


{val: 'burzaco',      type: 'delegacion', name: 'Delegación Burzaco',          locacion:	'9 de Julio y Roca', telefono: '4299-2273'},
{val: 'claypole',     type: 'delegacion', name: 'Delegación Claypole',         locacion:	'17 de Octubre 920',         telefono: '4291-1944'},
{val: 'donorione',    type: 'delegacion', name: 'Delegación Don Orione',       locacion:	'Manuel Araujo y Río Diamante', telefono: '4268-5419'},
{val: 'glew',         type: 'delegacion', name: 'Delegación Glew',             locacion:	'Sarmiento y Alem',          telefono: '(02224)420792'},
{val: 'josemarmol',   type: 'delegacion', name: 'Delegación José Marmol',      locacion:	'Bynnon y 20 de Septiembre', telefono: '4291-1066'},
//{val: 'longchamps',   type: 'delegacion', name: 'Delegación Longchamps',       locacion:	'Av. Longchamps y vías del FFCC', telefono: '4293-4299'},
{val: 'longchamps',   type: 'delegacion', name: 'Cámara de Comercio de Longchamps', locacion:	'Emilio Burgward 1030', telefono: '4293-4299'},
{val: 'malvinas',     type: 'delegacion', name: 'Delegación Malvinas Arg',     locacion:	'Policastro 2389',           telefono: '4297-8615'},
{val: 'minrivadavia', type: 'delegacion', name: 'Delegación Min Rivadavia',    locacion:	'25 de Mayo y Quiroga',      telefono: '4279-0052'},
{val: 'rcalzada',     type: 'delegacion', name: 'Delegación Rafael Calzada',   locacion:	'Guemes 1996',               telefono: '4291-1666'},
{val: 'solano',       type: 'delegacion', name: 'Delegación San Fco Solano',   locacion:	'Lirio 423',                 telefono: '4277-5203'},
{val: 'sanjose',      type: 'delegacion', name: 'Delegación San José',         locacion:	'Salta 1915',                telefono: '4211-1007'},
{val: 'cicglew',      type: 'cic',        name: 'Centro Comunitario Glew',     locacion:	'Garibaldi 220, entre Beruti y Lestrade',  telefono: '3740-0875'},
{val: 'cicburzaco',   type: 'cic',        name: 'Centro Comunitario Burzaco',  locacion:	'Alsina y Martin Fierro, Barrio el Gaucho', telefono: '4238-2538'},

];

const agendas = [
 {val: 'ALIM:DEL', label: 'Asis Alimen en Delegaciones'}

]


/*********
turno_disponible = {
	agenda:         [ 'ALIM:DEL'],
	orden:          [0||1||2]
	type:           [],
	name:           'nombre_descriptivo_',
	slug:           'mostrar_como'
	// objeto alocado
	recurso: {
		lugar: 'codigo_lugar_afectado'
	},

	capacidad {
		qty: 0,
		ume: [personas, ]
	}

	estado: 'activo || baja'
	vigencia:{
	   fevd_ts: 0
	   fevh_ts: 0
	} 
	// fechas
	tfecha: {0: fecha_puntual, 1: rango_fecha, 2: comprension}
	fep_ts: 0,

	fed_ts: 0,
	feh_ts: 0,

	day_of_week: 0,
	month_of_year: 0,
	year: 0



	// horario
	thorario: {0: horario_puntual: 1: rango horario, 3: hora+duración }
	hsp_desde: 0
	hsp_hasta: 0
	duracion: 'en minutos'



}


*****/

/****************
turno_instance = {
	turnoId:        fk a turno disponible
	agenda:         [ 'ALIM:DEL'],

	recurso: {
		lugar: 'codigo_lugar_afectado'
	},

	alocado {
		qty: 0,
		ume: [personas, ]
	}

	estado: 'activo || baja'

	// fechas
	fe_tx: '',
	fe_ts: 
	hora: 


}


*****/
