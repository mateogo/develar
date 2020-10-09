/**
 *  Transferencia de registros a CETEC
 */
const whoami =  "models/zcetecwsModel: ";

// necesarios para el proceso de importación
const config = require('../config/config')
const fs =     require('fs');
const path =   require('path');
const utils =  require('../services/commons.utils');
const Excel =  require('exceljs')

const axios =    require('axios');
const FormData = require('form-data');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const person = require('./personModel');
const asisprevencion = require('./asisprevencionModel.js');

const self = this;

const PersonRecord = person.getRecord();
const AsisprevencionRecord = asisprevencion.getRecord();

const modo = 'produccion'; // 'produccion'

const ESTADO_OK = 'migrado';
const ESTADO_ERROR = 'error';
const ESTADO_INVALIDO = 'invalido';
const ESTADO_BAJA = 'baja';
const ESTADO_NOCUMPLE = 'nocumple';

const COVID_OFFSET_ALTA = 10;


const spec = {
	homologacion: {
		url: 'https://iop.hml.gba.gob.ar',
		usermal: 'd3NfaG1sX2FiX2FzaXN0ZW5jaWFjb3ZpZDE5OmNVNk51LDY1aXBJODJwNw==',
		usergold: 'd3NfaG1sX2NvdmlkMTk6bkRxeUpJVnF4aksxak1a',
		userreal: 'd3NfaG1sX2FiX2FzaXN0ZW5jaWFjb3ZpZDE5OiVrTWxlU0VHMiF6Tis1Ow==',
		user64:   'd3NfaG1sX2NvdmlkMTk6bkRxeUpJVnF4aksxak1a'
	},
	produccion: {
		url: 'https://iop.gba.gob.ar',
		user64: 'd3NfcHJvZF9hYl9hc2lzdGVuY2lhY292aWQxOTpjVTZOdSw2NWlwSTgycDc=',

	}
}

const USER_B64 =    spec[modo].user64; 
const TOKEN_URL =   spec[modo].url + '/servicios/JWT/1/REST/jwt';
const SERVICE_URL = spec[modo].url + '/servicios/asistenciacovid/1/altaSeguimiento';

const datamap = {
	estados: spec[modo].url + '/servicios/asistenciacovid/1/estados'
}


//Credenciales PRODUCCIÓN: "ws_prod_ab_asistenciacovid19:cU6Nu,65ipI82p7"
// php -a; echo  base64_encode('ws_prod_ab_asistenciacovid19:cU6Nu,65ipI82p7');
// result: d3NfcHJvZF9hYl9hc2lzdGVuY2lhY292aWQxOTpjVTZOdSw2NWlwSTgycDc=
//const AUTH_TOKEN = 'Bearer eyJ4NWMiOlsiTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFsV2wyMEtjcDVUVnFYQjFzVUdNUnVLYzRBdTBSVXRwNUMwUkJGM0ZuZURIXC9WOWdLaXpma1J0ZDh6alQ3V3ltbncrQVpvTkI2bkMwK1wvS0gxYVNxUGgrNXo3OTYzb2ZvY2pZSTVPMlNtY05lZmloTFhvcUh0U05Da3cwYkdjVjk5bCtzR08zWjljNXJpTFAzd1Q2Z3V6UjNPTWJhRTFPVXdja2E2anJRU3ZXZTNBRFFkdWlcL2tEVHZoeVhlQ1U0dVJ0dlY0TUpwVVV6OGg0RkZPeVdkNXBFTFBBaEdzdU44RVk1R1hoa2lGNlM3VXpJb1JURjlxdnBDQmtoQnlLK1o3SDY0S2NheUtuYWFUaXgwbUs4MVcyOUVsYnNDdWpmemRrdTNFbXBcLzVKb1RsTEhuQitxNjh2T0tZZmlmMW9udmdxd2lvNnY3RFRUcWVWbjQrRTliNjR3SURBUUFCIl0sImN0eSI6Impzb24iLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJEUFNJVCBEaWdpdGFsIFNpZ25hdHVyZSBQbGF0Zm9ybSIsInN1YiI6IndzX2htbF9jb3ZpZDE5IiwibmJmIjoxNjAxNzYxNTY1LCJleHAiOjE2MDE3NjE2NzUsImlhdCI6MTYwMTc2MTU1NX0.JHuClJmb2DzKS0_HbyzCkvykVLGgxDD3P5hFkcs5aTK-1yb-iTeGUPVzp60nPTLLiLljW90noiKJdsx005K_1HXgMSnguMqijYNblI-6sV428xKW0MLopCDy3Myc0enO8SIkSAXwbmiFF8CJ8NjwES8GHOqrbiPNHnUP3uFS6netrsz7rBRJigrHqxWQBmWz0-WJmnvKfBa4D7hYGkj92DiGYr4Yv_sTlc3spDi4vj-gIbZP_s1FBlbqLAPxy4cAit3XvaI80J2CezZ0Y5f_Qb9_YeXraP8NebLhqud17-wPHj8wE52t_wfSzJbDC9mGSwVLNScB36xp5mdlnPf6WQ';


 // ws_hml_ab_asistenciacovid19:%kMleSEG2!zN+5; // d3NfaG1sX2FiX2FzaXN0ZW5jaWFjb3ZpZDE5OiVrTWxlU0VHMiF6Tis1Ow==
// Credenciales HOMOLOGACIÓN: "ws_hml_ab_asistenciacovid19:%kMleSEG2!zN+5;"
// php -a; echo  base64_encode('ws_hml_ab_asistenciacovid19:%kMleSEG2!zN+5;');
// result: d3NfaG1sX2FiX2FzaXN0ZW5jaWFjb3ZpZDE5OiVrTWxlU0VHMiF6Tis1Ow==
//  const AUTH_TOKEN = 'Bearer eyJ4NWMiOlsiTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFsV2wyMEtjcDVUVnFYQjFzVUdNUnVLYzRBdTBSVXRwNUMwUkJGM0ZuZURIXC9WOWdLaXpma1J0ZDh6alQ3V3ltbncrQVpvTkI2bkMwK1wvS0gxYVNxUGgrNXo3OTYzb2ZvY2pZSTVPMlNtY05lZmloTFhvcUh0U05Da3cwYkdjVjk5bCtzR08zWjljNXJpTFAzd1Q2Z3V6UjNPTWJhRTFPVXdja2E2anJRU3ZXZTNBRFFkdWlcL2tEVHZoeVhlQ1U0dVJ0dlY0TUpwVVV6OGg0RkZPeVdkNXBFTFBBaEdzdU44RVk1R1hoa2lGNlM3VXpJb1JURjlxdnBDQmtoQnlLK1o3SDY0S2NheUtuYWFUaXgwbUs4MVcyOUVsYnNDdWpmemRrdTNFbXBcLzVKb1RsTEhuQitxNjh2T0tZZmlmMW9udmdxd2lvNnY3RFRUcWVWbjQrRTliNjR3SURBUUFCIl0sImN0eSI6Impzb24iLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJEUFNJVCBEaWdpdGFsIFNpZ25hdHVyZSBQbGF0Zm9ybSIsInN1YiI6IndzX2htbF9jb3ZpZDE5IiwibmJmIjoxNjAxNzYxNTY1LCJleHAiOjE2MDE3NjE2NzUsImlhdCI6MTYwMTc2MTU1NX0.JHuClJmb2DzKS0_HbyzCkvykVLGgxDD3P5hFkcs5aTK-1yb-iTeGUPVzp60nPTLLiLljW90noiKJdsx005K_1HXgMSnguMqijYNblI-6sV428xKW0MLopCDy3Myc0enO8SIkSAXwbmiFF8CJ8NjwES8GHOqrbiPNHnUP3uFS6netrsz7rBRJigrHqxWQBmWz0-WJmnvKfBa4D7hYGkj92DiGYr4Yv_sTlc3spDi4vj-gIbZP_s1FBlbqLAPxy4cAit3XvaI80J2CezZ0Y5f_Qb9_YeXraP8NebLhqud17-wPHj8wE52t_wfSzJbDC9mGSwVLNScB36xp5mdlnPf6WQ';



const CUIT_MBA = "33999001489";
const GRUPO_EVENTO_ID = '113';

const TOPE_COVID = 14;
const TOPE_SOSPECHA = 3;


const covidOptList = [ 'SOSPECHA', 'COVID', 'DESCARTADO', 's/d', 'FALLECIDO', 'DE ALTA', 'EN MONITOREO'];
const N_HAB_00 = 'NUC-HAB-00'

var indexCount = 100000;

/**
	API:
	  local:  http://localhost:8080/api/cetec/sendinfo
	  server: http://salud.brown.gob.ar/api/cetec/sendinfo
**/
exports.useCetecWebService = cetecPrestacionesCovidWS;
exports.generarCetec = generateCetecData;
exports.downloadCetec = exportToExcel;
exports.getCetecCovidData = cetecGetDataCovidWS;
exports.migrarCetecWebService = migrarRegistrosCetec;

const sexoOptList = [
    {val: 'F',        sexo: '2', label: 'Femenino',      slug:'Femenino' },
    {val: 'M',        sexo: '1', label: 'Masculino',     slug:'Masculino' },
];

const estadoOptList = [
    {val: 'pendiente',   label: 'Pendiente',      slug:'Pendiente de ser transferido via WS' },
    {val: 'nocumple',     label: 'No cumple',        slug:'No cumple condiciones para migrar, validación ex-ante' },
    {val: 'migrado',     label: 'Migrado',        slug:'Migrado OK via WS' },
    {val: 'error',       label: 'Error',          slug:'Migrado con ERRORES' },
    {val: 'invalido',    label: 'Fuera rango fechas', slug:'No valida para migrar, validación ex-post' },
    {val: 'baja',        label: 'Baja',           slug:'Registro de baja' },
];

const tiposCompPersonaFisica = [
		{val: 'DNI', 	  sigla_tipo_doc: "D.N.I", label: 'DNI',     slug:'DNI' },
		{val: 'LE',     sigla_tipo_doc: "L.E.",  label: 'LE',      slug:'Libreta Enrolam' },
		{val: 'LC',     sigla_tipo_doc: "L.C.",  label: 'LC',      slug:'Libreta Cívica' },
		{val: 'PAS',    sigla_tipo_doc: "PAS",   label: 'PASP',    slug:'Pasaporte' },
		{val: 'CI',     sigla_tipo_doc: "C.I",   label: 'CI',      slug:'Cédula de Identidad' },
];

const tipoSeguimiento = [
		{val: 'auto',         tipo_seg_id: "1",  label: 'Autoseguimiento'  },
		{val: 'presencial', 	tipo_seg_id: "2",  label: 'Presencial'       },
		{val: 'telefonico',   tipo_seg_id: "3",  label: 'Telefonico',      },
		{val: 'no_definico',  tipo_seg_id: "4",  label: 'No_asignado',     },
];

const avanceInfectionOptList = [
	{ val: 'essalud',     origen_id: '1', label: 'Es personal de salud'},
	{ val: 'otro',        origen_id: '2', label: 'Otro'},
	{ val: 'sindato',     origen_id: '2', label: 'Sin dato'},
	{ val: 'comunitario', origen_id: '3', label: 'Comunitario'},
	{ val: 'contacto',    origen_id: '5', label: 'Contacto estrecho'},
	{ val: 'viaje',       origen_id: '4', label: 'Por viaje'},
	{ val: 'nexo',        origen_id: '5', label: 'Contacto conviviente'},

	{ val: 'esesencial',  origen_id: '2', label: 'Es personal esencial'},
	{ val: 'internacion', origen_id: '2', label: 'Internación previa'},
	{ val: 'sinnexo',     origen_id: '2', label: 'Sin nexo epidemiológico'},

];

const clasificacionAfectadoOptList = [
	{ val: 1, clasificacion_id: '1', label: 'COVID+'},
	{ val: 2, clasificacion_id: '2', label: 'DESCARTADO'},
	{ val: 0, clasificacion_id: '3', label: 'SOSPECHA'},
	{ val: 7, clasificacion_id: '4', label: 'CONTACTO ESTRECHO'},

	{ val: 4, clasificacion_id: '1', label: 'FALLECIDO'},
	{ val: 5, clasificacion_id: '1', label: 'DE ALTA'},
	{ val: 6, clasificacion_id: '3', label: 'EN MONITOREO'},
];

const estadoActualAfectadoOptList = [
	{ val: 1, estado_id: '5', label: 'COVID+'},
	{ val: 2, estado_id: '6', label: 'DESCARTADO'},
	{ val: 0, estado_id: '6', label: 'SOSPECHA'},
	{ val: 7, estado_id: '6', label: 'CONTACTO ESTRECHO'},

	{ val: 4, estado_id: '2', label: 'FALLECIDO'},
	{ val: 5, estado_id: '1', label: 'DE ALTA'},
	{ val: 6, estado_id: '', label: 'EN MONITOREO'},
];

const tinternacionOptList = [
	{ val: 'nointernado',  estado_id: '',  label: 'No internado'},
	{ val: 'domiciliaria', estado_id: '5',  label: 'Domiciliaria'},
	{ val: 'aislamiento',  estado_id: '4',  label: 'Aislamiento'},
	{ val: 'internacion',  estado_id: '3',  label: 'HOSP-Sala común'},
	{ val: 'uti',          estado_id: '3',  label: 'HOSP-UTI'},
	{ val: 'obito',        estado_id: '2',  label: 'Óbito'},
	{ val: 'alta',         estado_id: '1',  label: 'ALTA'},
];


const cetecRequiredKeys = [
					'cuit_municipio',
					'sigla_tipo_doc',
					'nro_doc',
					'apellido',
					'nombre',
					'sexo',
					'localidad_id',
];

const cetecKeys = [
					'cuit_municipio',
					'sigla_tipo_doc',
					'nro_doc',
					'apellido',
					'nombre',
					'sexo',
					'fecha_nacimiento',
					'nacionalidad',
					'localidad_id',
					'domicilio',
					'barrio',
					'email',
					'telefono',
					'fecha_diagnostico',
					'fecha_alta_definitiva',
					'origen_id',
					'clasificacion_id',
					'estado_id',
];

const intervencionRequiredKeys = [
					'establecimiento_cod',
					'evolucion_id',
					'fecha_papel',
					'grupo_evento_id',
					'clasificacion_manual_id',
					'evento_id',
					'fecha_seguimiento',
];

const intervencionKeys = [
					'tipo_seg_id',
					'establecimiento_cod',
					'evolucion_id',
					'fecha_papel',
					'grupo_evento_id',
					'clasificacion_manual_id',
					'evento_id',
					'fecha_seguimiento',
];

const locMuestraOptList = [
	{ val: 'emergen107', establecimiento_cod: '02800628', label: 'Emergencia/107' },
	{ val: 'detectar',   establecimiento_cod: '02800628', label: 'Operativo DeTecTar' },
	{ val: 'CAPS01',     establecimiento_cod: '02800229', label: 'CAPS-01 Min Rivadavia' },
	{ val: 'CAPS06',     establecimiento_cod: '02800245', label: 'CAPS-06 Los álamos' },
	{ val: 'CAPS12',     establecimiento_cod: '02800385', label: 'CAPS-12 Don Orione' },
	{ val: 'CAPS15',     establecimiento_cod: '02800369', label: 'CAPS-15 Glew 2' },
	{ val: 'CAPS16',     establecimiento_cod: '02800377', label: 'CAPS-16 Rafael Calzada' },
	{ val: 'CAPS26',     establecimiento_cod: '02801080', label: 'CAPS-26 USAmb Burzaco' },
	{ val: 'otro',       establecimiento_cod: '02800628', label: 'Div medicina preventiva'  },
];

const resultadoSeguimientoOptList = [
	{ val: 'logrado',     evolucion_id: '', label: 'Logrado'},
	{ val: 'nocontesta',  evolucion_id: '4', label: 'No contesta'},
	{ val: 'notelefono',  evolucion_id: '4', label: 'Teléfono incorrecto/ inexistente'},
];
const vectorSeguimientoOptList = [
	{ val: 'inicia',     evolucion_id: '1',   color:'#efefef', background: '#423bff', label: 'Inicia seguimiento'},
	{ val: 'estable',    evolucion_id: '1',   color:'#efefef', background: '#807d00', label: 'Evolución estable'},
	{ val: 'mejora',     evolucion_id: '',   color:'#efefef', background: '#008f00', label: 'Mejoría/ Favorable'},
	{ val: 'desmejora',  evolucion_id: '3',   color:'#efefef', background: '#b51835', label: 'Desmejora/ Desfavorable'},
	{ val: 'sindato',    evolucion_id: '',   color:'#efefef', background: '#5d5d5d', label: 'Sin dato'},
];

const evolucionIdOptList = [
	{ val: '1',     evolucion_id: '1', label: 'Continua Aislam Domiciliario'},
	{ val: '2',     evolucion_id: '2', label: 'Alta Médica'},
	{ val: '3',     evolucion_id: '3', label: 'Derivación a emergencias'},
	{ val: '4',     evolucion_id: '4', label: 'Contacto Fallido'},
	{ val: '5',     evolucion_id: '5', label: 'Alta de seruimiento'},
	{ val: '6',     evolucion_id: '6', label: 'Sospechoso'},
];

//clasificacion_manual_id
const clasificacionManualIdOptList = [
	{val: 169, label: 	"Caso descartado por diagnóstico diferencial" },
	{val: 176, label: 	"Caso descartado" },
	{val: 596, label: 	"Caso invalidado por epidemiología" },
	{val: 752, label: 	"Caso sospechoso de COVID-19" },
	{val: 754, label: 	"Caso confirmado de COVID-19" },
	{val: 756, label: 	"Caso sospechoso validado por autoridad sanitaria" },
	{val: 775, label: 	"Caso confirmado con criterio laboratorial para fin de seguimiento" },
	{val: 781, label: 	"Caso confirmado con criterio epidemiológico de fin de seguimiento" },

	{val: 786, label: 	"Descartado COVID - Confirmado OVR" },
	{val: 787, label: 	"Confirmado COVID - Coinfección con OVR" },
	{val: 788, label: 	"Descartado COVID - No estudiado OVR" },
	{val: 169, label: 	"Caso descartado por diagnóstico diferencial" },

	{val: 596, label: 	"Caso invalidado por epidemiología" },
	{val: 757, label: 	"Día 01 - Asintomático - Continúa en seguimiento" },
	{val: 758, label: 	"Día 02 - Asintomático - Continúa en seguimiento" },
	{val: 759, label: 	"Día 03 - Asintomático - Continúa en seguimiento" },
	{val: 760, label: 	"Día 04 - Asintomático - Continúa en seguimiento" },
	{val: 761, label: 	"Día 05 - Asintomático - Continúa en seguimiento" },
	{val: 762, label: 	"Día 06 - Asintomático - Continúa en seguimiento" },
	{val: 763, label: 	"Día 07 - Asintomático - Continúa en seguimiento" },
	{val: 764, label: 	"Día 08 - Asintomático - Continúa en seguimiento" },
	{val: 765, label: 	"Día 09 - Asintomático - Continúa en seguimiento" },
	{val: 766, label: 	"Día 10 - Asintomático - Continúa en seguimiento" },
	{val: 767, label: 	"Día 11 - Asintomático - Continúa en seguimiento" },
	{val: 768, label: 	"Día 12 - Asintomático - Continúa en seguimiento" },
	{val: 769, label: 	"Día 13 - Asintomático - Continúa en seguimiento" },
	{val: 770, label: 	"Día 14 - Asintomático - Fin del seguimiento" },

	{val: 771, label: 	"Sintomático - Caso sospechoso COVID-19" },
	{val: 772, label: 	"Sintomático - continúa seguimiento" },
	{val: 774, label: 	"Contacto no ubicable" },
	{val: 776, label: 	"Estudiado por laboratorio y negativo" },
];

const eventoIdOptList = [
	{val: 307, cod_evento: 'ev0178', label: 	"Caso sospechoso de COVID" },
	{val: 309, cod_evento: 'ev0173', label: 	"Contacto de caso COVID+" },
];

// Ojo Don Orione
const ciudadesBrown = [
    {val: 'no_definido',         localidad_id:"60",  cp:'1800', label: 'Seleccione opción',slug:'Seleccione opción' },
    {val: 'adrogue',             localidad_id:"60",  cp:'1846', label: 'Adrogué ',   slug:'Adrogué' },
    {val: 'burzaco',             localidad_id:"61",  cp:'1852', label: 'Burzaco ',   slug:'Burzaco' },
    {val: 'calzada',             localidad_id:"68",  cp:'1847', label: 'Rafael Calzada ',   slug:'Rafael Calzada' },
    {val: 'claypole',            localidad_id:"62",  cp:'1849', label: 'Claypole',   slug:'Claypole' },
    {val: 'donorione',           localidad_id:"62",  cp:'1850', label: 'Don Orione', slug:'Don Orione' },
    {val: 'glew',                localidad_id:"63",  cp:'1856', label: 'Glew',       slug:'Glew' },
    {val: 'longchamps',          localidad_id:"65",  cp:'1854', label: 'Longchamps', slug:'Longchamps' },
    {val: 'malvinasargentinas',  localidad_id:"78",  cp:'1846', label: 'Malvinas Argentinas',slug:'Malvinas Argentinas' },
    {val: 'marmol',              localidad_id:"64",  cp:'1845', label: 'J.Mármol',   slug:'J.Mármol' },
    {val: 'ministrorivadavia',   localidad_id:"67",  cp:'1852', label: 'Ministro Rivadavia',slug:'Ministro Rivadavia' },
    {val: 'solano',              localidad_id:"70",  cp:'1846', label: 'San Fco Solano',   slug:'San Fco Solano' },
    {val: 'sanjose',             localidad_id:"69",  cp:'1846', label: 'San José',   slug:'San José' },
    {val: 'extradistrito',       localidad_id:"60",  cp:'0000', label: 'Extra distrito',   slug:'Fuera del Municipio de Brown' },
];

const cetecIntervencionSch = new Schema({
	seguimiento_id:           { type: String, required: false },

	tipo_seg_id:              { type: String, required: false },
	establecimiento_cod:      { type: String, required: false },
	evolucion_id:             { type: String, required: false },
	fecha_papel:              { type: String, required: false },
	grupo_evento_id:          { type: String, required: false },
	clasificacion_manual:     { type: String, required: false },
	clasificacion_manual_id:  { type: String, required: false },
	evento_id:                { type: String, required: false },
	fecha_seguimiento:        { type: String, required: false },
})

const cetecSch = new Schema({
		// header
		//
		fe_alta:        { type: String, required: false },
		mesFacturacion: { type: String, required: false },
		registronro:    { type: Number, required: false, default: 0 },

		estado:         { type: String, required: false }, //estadoOptList
		fe_transfe:     { type: String, required: false },
		errmessage:     { type: String, required: false },
		paciente_id:    { type: String, required: false },

		asistenciaId:   { type: String, required: false },
		cuit_municipio: { type: String, required: false },

		hasLocacion:    { type: Boolean, required: false },
		hasInfection:   { type: Boolean, required: false },
		hasFollowUp:    { type: Boolean, required: false },
		hasNovedades:   { type: Boolean, required: false },
		hasLaboratorio: { type: Boolean, required: false },
		hasEncuesta:    { type: Boolean, required: false },
		isCasoCovid:    { type: Boolean, required: false },
		isSospechoso:   { type: Boolean, required: false },
		isContactoEstrecho:   { type: Boolean, required: false },
		actualState:    { type: Number,  required: false },

		// afectado
		idPerson:       { type: String, required: false },

		sigla_tipo_doc: { type: String, required: false },
		tdoc:           { type: String, required: false },
		nro_doc:        { type: String, required: false },
		apellido:       { type: String, required: false },
		nombre:         { type: String, required: false },
		sexo:           { type: String, required: false },
		fecha_nacimiento:  { type: String, required: false },
		nacionalidad:      { type: String, required: false },

		domicilio:      { type: String, required: false },
		barrio:         { type: String, required: false },
		localidad_id:   { type: String, required: false },

		email:          { type: String, required: false },
		telefono:       { type: String, required: false },
		obra_social:    { type: String, required: false },

		//
		fecha_diagnostico:      { type: String, required: false },
		fecha_alta_definitiva:  { type: String, required: false },

    // segun SISA
		evento_caso_id:    { type: String, required: false },
		origen_id:         { type: String, required: false },
		clasificacion_id:  { type: String, required: false },
		estado_id:         { type: String, required: false },

		qFollowUp:   { type: Number, required: false, default: 0 },
		qHisopados:  { type: Number, required: false, default: 0 },
		qInvestig:   { type: Number, required: false, default: 0 },
		qCovid:      { type: Number, required: false, default: 0 },

    // INTERVENCIONES
		intervenciones: [cetecIntervencionSch]




    // compPrefix:  { type: String, required: true },
    // compName:    { type: String, required: true },
    // compNum:     { type: String, required: true },
    // tipo:        { type: Number, required: false },
    // prioridad:   { type: Number, required: false },

    // idPerson:    { type: String, required: false },
    // ndoc:        { type: String, required: false },
    // tdoc:        { type: String, required: false },
    // sexo:        { type: String, required: false },
    // edad:        { type: String, required: false },
    // fenactx:     { type: String, required: false },
    // telefono:    { type: String, required: false },
    // osocial:     { type: String, required: false },
    // osocialTxt:  { type: String, required: false },
    // contactosEstrechos: { type: Number, required: false },

    // idbrown:     { type: String, required: false },
    // fecomp_tsa:  { type: Number, required: true },
    // fecomp_txa:  { type: String, required: true },
    // fenotif_tsa: { type: Number, required: false },
    // fenotif_txa: { type: String, required: false },
    // action:      { type: String, required: true },
    // slug:        { type: String, required: false },
    // description: { type: String, required: false },

    // sector:      { type: String, required: false },
    // estado:      { type: String, required: false },
    // avance:      { type: String, required: false },
    // ts_alta:     { type: Number, required: false },
    // ts_fin:      { type: Number, required: false },
    // ts_prog:     { type: Number, required: false },

    // sintomacovid: { type: contextoCovidSch, required: false }, 
    // denuncia:     { type: contextoDenunciaSch, required: false }, 
 
    // locacion:    { type: locacionSch, required: false }, 
    // requeridox:  { type: requirenteSch, required: false },
    // atendidox:   { type: atendidoSch,   required: false },
    // casoIndice:  { type: casoIndiceSch, required: false },


    // isVigilado:      { type: Boolean, required: false, default: false },
    // hasSeguimiento:  { type: Boolean, required: false, default: false },
    // isCovid:         { type: Boolean, required: false, default: false },
    // isInternado:     { type: Boolean, required: false, default: false },
    // hasParent:       { type: Boolean, required: false, default: false },


    // infeccion:         { type: infeccionFollowUpSch, required: false },
    // internacion:       { type: internacionAsisSch, required: false },
    // sisaevent:         { type: sisaEventSch, required: false },
    // followUp:          { type: afectadosFollowUpSch, required: false },

    // novedades:         [ novedadSch ],
    // muestraslab:       [ muestraLaboratorioSch ],
    // sisaEvolucion:     [ sisaEvolucionSch ],
    // seguimEvolucion:   [ afectadoUpdateSch ],
    // contextoAfectados: [ contextoAfectadosSch ],
    // morbilidades:      [ morbilidadSch ],
});


cetecSch.pre('save', function (next) {
    return next();
});

const Record = mongoose.model('Cetecevento', cetecSch, 'ceteceventos');

function buildQuery(query){
  let q = {};

  if(query['estado']){
      q["estado"] = query['estado'];
  }

  if(query['mesFacturacion']){
      q["mesFacturacion"] = query['mesFacturacion'];
  }


  return q;
}

function getOptRecord(list, val){
	if(!list || !list.length) return val || '';

	return list.find(t => t.val == val);


}



/*************************************************/
/* 	Migra registros  CETEC desde cetecdata */
/***********************************************/
/**
	API:
	  local:  http://localhost:8080/api/cetec/migrarinfo
	  server: http://salud.brown.gob.ar/api/cetec/migrarinfo
**/
function migrarRegistrosCetec(req, errcb, cb){
	let query = {
		estado: 'pendiente',
		// regdesde: 0,
		// reghasta: 0,
		mesFacturacion: '2020-06'
	}

  let regexQuery = buildQuery(query)

  console.log('CETEC MIGRACION BEGIN: *********')
  console.dir(regexQuery);

  Record.find(regexQuery).limit(500).lean().exec(function(err, entities) {
      if (err) {
          console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
          errcb(err);

      }else{
          if(entities && entities.length){
          		console.log('migrateCetecData TO BEGIN [%s]', entities.length);

              _insertRegistrosEnCETEC(entities, query, errcb, cb)
							cb({aprocesar: entities.length });

          }
      }
  });

}

async function _insertRegistrosEnCETEC(movimientos, query, errcb, cb){
	let today = new Date();

	for(let i = 0; i < movimientos.length; i++){

		let cetec = movimientos[i];

		//parches zone /////////
		if(cetec.localidad_id === 'xx') cetec.localidad_id = "60";
		if(cetec.tdoc === 'PROV') continue;
		///////////////////////

		let intervenciones = cetec.intervenciones;
		let token;
		let save_response;

		if(!(intervenciones && intervenciones.length)){

			let errmsg = 'Registro sin intervenciones';
			await _updateSourceWithError(ESTADO_INVALIDO, today, errmsg, cetec);

		}else {
			try {
				let response = await _getToken();
				token = 'Bearer ' + response.data;

			}catch(e){
				console.log('error NOT TOKEN')
				break;
			}

			console.log('[%s]========== PROCESS [%s]',i, cetec.nro_doc, intervenciones.length );
			for(let j = 0; j < intervenciones.length; j++){
				let intervencion = intervenciones[j];
				
				try {
					save_response = await _saveCetecRecord(token, cetec, intervencion);

					await _updateSourceRecord(today, save_response, cetec, intervencion);


				}catch(e){
					console.log('error SAVING CETEC RECORD: ')
					console.log('=======================================================================')
					console.dir(e )
					console.log('=======================================================================')
					await _updateSourceWithError(ESTADO_ERROR, today, 'exception trying to save CETEC', cetec )
					break;
				}

			}//for intervenciones...
		}// if_then_else

	}// for mmovimientos...

}

async function _getToken(){
	let token ;
	const config_token = {
	  method: 'post',
	  url: TOKEN_URL,
	  headers: { 
	    'Authorization': 'Basic ' + USER_B64
	  }
	};

	return axios(config_token);
}

async function _saveCetecRecord(token, cetec, intervencion){

	const data = new FormData();
	
	cetecKeys.forEach(k => {
		if(cetec[k]){
			data.append(k, cetec[k]);
		}
	})

	intervencionKeys.forEach(k => {
		if(intervencion[k]){
			data.append(k, intervencion[k]);
		}
	})

	const config = {
	  method: 'post',
	  url: SERVICE_URL,
	  headers: { 
	    'Content-Type': 'application/json', 
	    'Authorization': token, 
	    ...data.getHeaders()
	  },
	  data : data
	};

	return axios(config);
}
// name

async function _updateSourceRecord(fecha, resp, cetec, intervencion){

	let response = resp && resp.data;
	if(! resp || !response) {
		return _updateSourceWithError(ESTADO_ERROR, fecha, 'Inserción de registro no produjo respuesta', cetec )

	}

	if(response.paciente_id){
		cetec.paciente_id = response.paciente_id;
		cetec.estado = ESTADO_OK;
		cetec.fe_transfe = utils.dateToStr(fecha);
		cetec.errmessage = response.mensaje;

		intervencion.seguimiento_id = response.seguimiento_id;

		_updateAsisRecord(fecha, resp, cetec, intervencion)

		return Record.findByIdAndUpdate(cetec._id, cetec, { new: true }).exec();

	}else {
		let status = (resp && resp.status) || "000";
		let errors = (response && response.length && response.join(" :: ")) || 'sin data...'
		return _updateSourceWithError(ESTADO_ERROR, fecha, status + ': ' + errors , cetec )
	}

}

function _updateAsisRecord(fecha, resp, cetec, intervencion){
	let token = {
		mcetec: 1,
		fets_cetec: fecha.getTime()
	}
	AsisprevencionRecord.findByIdAndUpdate(cetec.asistenciaId, token, { new: true }).exec();	
}

async function _updateSourceWithError(estado, fecha, errmsg, cetec ){
		let update_data = {
			estado: estado,
			fe_transfe: utils.dateToStr(fecha),
			errmessage: errmsg
		}
		return Record.findByIdAndUpdate(cetec._id, update_data, { new: true }).exec();
}
////////////////////////////////////////




/*************************************************/
/* 	CONSULTA PARAMETRO DEL SISTEMA  */
/***********************************************/

/**
	API:
	  local:  http://localhost:8080/api/cetec/getdatosmaestros
	  server: http://salud.brown.gob.ar/api/cetec/getdatosmaestros
*/
function cetecGetDataCovidWS(req, errcb, cb){
	console.log('CETE-GETDATOSMAESTROS-BEGIN');
	let token ;

	const config_token = {
	  method: 'post',
	  url: TOKEN_URL,
	  headers: { 
	    'Authorization': 'Basic ' + USER_B64
	  }
	};

	axios(config_token)
	.then(function (response) {
		console.log('token [%s]', (response && response.data) ? 'ok' : 'error')

	  token = 'Bearer ' + response.data;
	  _getCovidData(token, req, errcb, cb)




	})
	.catch(function (error) {
	  console.log(error);
	});




	let result = {
		resultado: 'ok',
		personas: 0,
		prestaciones: 0
	}


}

function _getCovidData(token, req, errcb, cb){
	const ESTADOS = 'estados'

	console.log('READY TO GET DATA');
	console.log('=================');

	const config = {
	  method: 'get',
	  url: datamap[ESTADOS],
	  headers: { 
	    'Content-Type': 'application/json', 
	    'Authorization': token, 
	  }
	};

	axios(config)
	.then(function (response) {
		//JSON.stringify(response)
		if(cb){
			cb(response.data);
		}

	})
	.catch(function (error) {
	  console.log(error);
		if(cb){
			cb(error);
		}
	});

}



////////////////////////////



/*************************************************/
/* 	Migra registros de prestaciones a CETEC */
/***********************************************/

/**
	API:
	  local:  http://localhost:8080/api/cetec/sendinfo
	  server: http://salud.brown.gob.ar/api/cetec/sendinfo
**/
function cetecPrestacionesCovidWS(req, errcb, cb){
	console.log('CETE-PRESTACIONES-BEGIN');
	let token ;

	const data = new FormData();
	data.append('cuit_municipio', '33999001489');
	data.append('sigla_tipo_doc', 'D.N.I');
	data.append('apellido', 'Basualdo');
	data.append('nombre', 'Ivan');
	data.append('nro_doc', '36894561');
	data.append('sexo', '1');
	data.append('localidad_id', '60');

	data.append('fecha_nacimiento', '1992-02-15');
	data.append('tipo_seg_id', '3');
	data.append('domicilio', 'Echenagusia 3310');
	data.append('barrio', 'Adrogué Centro');
	data.append('nacionalidad', 'Argentino');
	data.append('email', 'mgomezortega@gmail.com');
	data.append('telefono', '1144742025');
	data.append('obra_social', 'osde');
	data.append('fecha_diagnostico', '2020-08-14');
	data.append('origen_id', '1');
	data.append('clasificacion_id', '1');
	data.append('estado_id', '5');
	data.append('establecimiento_cod', '02800229');
	data.append('evolucion_id', '4');
	data.append('fecha_papel', '2020-10-02');
	data.append('grupo_evento_id', '113');
	data.append('clasificacion_manual', 'No contesta - llamada manual');
	data.append('clasificacion_manual_id', '752');
	data.append('evento_id', '307');
	data.append('fecha_seguimiento', '2020-10-02');


	const config_token = {
	  method: 'post',
	  url: TOKEN_URL,
	  headers: { 
	    'Authorization': 'Basic ' + USER_B64
	  }
	};

	axios(config_token)
	.then(function (response) {

	  token = 'Bearer ' + response.data;
	  insertOneRecord(token, data, req, errcb, cb)

	})
	.catch(function (error) {
	  console.log(error);
	});




	let result = {
		resultado: 'ok',
		personas: 0,
		prestaciones: 0
	}


}

function insertOneRecord(token, data, req, errcb, cb){
	console.log('READY TO INSERT ONE RECORD')
	console.log('==========================')
	const config = {
	  method: 'post',
	  url: SERVICE_URL,
	  headers: { 
	    'Content-Type': 'application/json', 
	    'Authorization': token, 
	    ...data.getHeaders()
	  },
	  data : data
	};

	axios(config)
	.then(function (response) {

	  console.log('Insert Record CB: OK');
	  console.dir(response.data)
		//JSON.stringify(response)
		if(cb){
			cb(response.data);
		}


	})
	.catch(function (error) {
	  console.log(error);
		if(cb){
			cb(error);
		}

	});

}



/*********************************************************/
/***** GENERAR ARCHIVO DE TRANSFERENCIA CETEC       *****/
/*******************************************************/
const fe_desde = new Date(2020, 4, 1).getTime();

function generateCetecData (req, errcb, cb){
  let regexQuery = {
    isVigilado: true,
    mcetec: {$ne: 1},
    avance: {$ne: 'anulado'}
  }

  AsisprevencionRecord.find(regexQuery)
    .lean()
    .exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);

        }else{
          if(entities && entities.length ){
          	console.log('generateCetecData TO BEGIN [%s]', entities.length);

            processCetecData(entities, errcb, cb);
            cb({actualizados: entities.length});


          }else{
            cb({error: 'no entities'})
          }
        }
  });
}

async function processCetecData(movimientos, errcb, cb){
	let today = new Date();

	for(let i = 0; i < movimientos.length; i++){
	//for(let i = 0; i < 50; i++){
		let asis = movimientos[i];
		let cetecData = buildRecordState(today, asis);

		let isValidRecord = validateRecord(cetecData)
	
		//console.log('ASISTENCIA: [%s] [%s] [%s] [%s]', asis.compNum, asis.fecomp_txa, asis.requeridox.apellido, isValidRecord );
		let record = await saveCetecRecord(cetecData)
		//console.log('SAVED: [%s]', record.apellido );
	
	

	}
	console.log('GEN CETEC ENDING VALIDADOS [%s]', indexCount);
}


function validateRecord(cetec){
	let validate = true;
	let errors = 'Error: ';

	if(!cetec.nombre){
		if(cetec.apellido){
			let split = cetec.apellido.split(" ");
			cetec.nombre =  (split && split.length && split[split.length-1]) || '';
		}
	}


	if(cetec.tdoc === "PROV"){
			validate = false;
			errors = errors + 'docum provisorio '
	}


	cetecRequiredKeys.forEach(t => {
		if(!cetec[t]) {
			validate = false;
			errors = errors + 'cetecRequired '
		}
	})


	if(cetec.intervenciones && cetec.intervenciones.length){
		let mesValid = false;
		cetec.intervenciones.forEach(iv =>{
			intervencionRequiredKeys.forEach(t => {
				if(!iv[t]) {
					validate = false;
					errors = errors + 'intervencionesRequired '
				}
			})

			if(iv.fecha_seguimiento && iv.fecha_seguimiento.substring(0,7) >= "2020-05") mesValid = true;
		})

		if(!mesValid) {
			validate = false;
			errors = errors + 'mes no-valido '
		}


	}else {
		validate = false;
		errors = errors + 'sin intervenciones '

	}

	if(validate){
		indexCount +=1;
		cetec.registronro = indexCount;
		cetec.mesFacturacion = cetec.intervenciones[0].fecha_seguimiento.substring(0,7);
	}else{
		cetec.estado = ESTADO_NOCUMPLE;
		cetec.errmessage = errors;

	}


	return validate;
}

async function saveCetecRecord(cetec){
	let record = new Record(cetec);
	return record.save()
}


/*******************************************/
/*****  BUILD CETEC-RECORD DATA       *****/
/*****************************************/
function buildRecordState(today, asis){
	let cetecData = new CetecBaseData(today, asis);

	cetecData.sexo = getSexo(cetecData, asis);
	cetecData.localidad_id = getLocalidadId(cetecData, asis);
	cetecData.fecha_nacimiento = utils.datexToYYYYMMDDStr(asis.fenactx);
	cetecData.sigla_tipo_doc = getSiglaTipoDoc(cetecData, asis);
	
	cetecData.isCasoCovid = checkIfCovid(cetecData, asis);
	cetecData.isSospechoso = checkIfSospechoso(cetecData, asis);
	cetecData.isContactoEstrecho = checkIfContactoEstrecho(cetecData, asis);


	cetecData.fecha_diagnostico = getFechaDiagnostico(cetecData, asis);
	cetecData.fecha_alta_definitiva = getFechaAltaDefinitiva(cetecData, asis)

	cetecData.clasificacion_id = getClasificacionId(cetecData, asis);
	cetecData.origen_id = getOrigenId(cetecData, asis);
	cetecData.estado_id = getEstadoId(cetecData, asis);

	buildIntervenciones(today, cetecData, asis);

	return cetecData;
}

function buildIntervenciones(today, cetec, asis){
	let tope = 0;
	if(cetec.isCasoCovid) tope = 14;
	if(cetec.isSospechoso) tope = 3;

	buildHisopados(today, cetec, asis);
	buildInvestigacion(today, cetec, asis);
	buildFollowUp(today, cetec, asis);
	//
	buildLlamadosCovid(today, cetec, asis);
	buildLlamadosSospechosos(today, cetec, asis);


}

/***********************************************/
/*****  ATENCIÓN: ARRAY DE INTERVENCIONES *****/
/*********************************************/
/*****  MANDA HASTA TRES LLAMADOS POR SOSPECHA / CONTACTO ESTRECHO *****/
function buildLlamadosSospechosos(today, cetec, asis){
	if(!(cetec.isSospechoso || cetec.isContactoEstrecho)) return;

	let fetx_confirma = fechaBase(cetec, asis);
	if(!fetx_confirma) return;

	let sofar = cetec.qFollowUp + cetec.qHisopados + cetec.qInvestig;
	let resto = TOPE_SOSPECHA - sofar;

	let fe_alta = today

	let fe_confirma = utils.parseDateStr(fetx_confirma);
	let fedesde = new Date(2020, 4, 1).getTime(); // 01/05/2020

	if(fe_confirma.getTime() >= fedesde){
		let yy = fe_confirma.getFullYear();
		let mm = fe_confirma.getMonth();
		let dd = fe_confirma.getDate()

		for (let i = 0; i < resto; i++){
			addLlamadosSospechosoToPrestaciones(cetec, asis, i, yy, mm, dd, fe_alta, resto );
		}
	}

}

function addLlamadosSospechosoToPrestaciones(cetec, asis, index, yy, mm, dd, fe_alta, resto ){

	let establecimiento = '02800628'; // Secretaría
	let fe_llamado = new Date(yy, mm, dd + index);

	//if(fe_llamado > fe_alta) return;

	let fecha = utils.dateToStr(fe_llamado);
	let resultado = 'logrado';
	let vector = index ? 'estable' : 'inicia';
	let evolucion = "1";
	let eventId;
	
	let mensaje =  'Seguimiento telefónico del afectado/a';

	if(index === resto -1 ){
		evolucion = "5"
	}

	if(cetec.isSospechoso){
		eventId = "307"
	  if(evolucion === "1"){
			clasificacion = "752"

	  }else if(evolucion === "5"){
			clasificacion = "781"

	  }

	}else {
		eventId = "309"

	  if(evolucion === "1"){
			clasificacion = "772"

	  }else if(evolucion === "5"){
			clasificacion = "770"

	  }
	}


	let intervencion = {
		seguimiento_id: '',
		tipo_seg_id: "3",
		establecimiento_cod: establecimiento,
		evolucion_id: evolucion,
		fecha_papel: utils.datexToYYYYMMDDStr(fecha),
		grupo_evento_id: GRUPO_EVENTO_ID,
		clasificacion_manual: mensaje,
		clasificacion_manual_id: clasificacion,
		evento_id: eventId,
		fecha_seguimiento: utils.datexToYYYYMMDDStr(fecha),
	}

	cetec.intervenciones.push(intervencion);
	cetec.qCovid += 1;
}






/*****  LLAMADOS AGREGADOS *****/
function buildLlamadosCovid(today, cetec, asis){
	if(!cetec.isCasoCovid) return;

	let fetx_confirma = fechaConfirmacion(cetec, asis);
	if(!fetx_confirma) return;


	let sofar = cetec.qFollowUp + cetec.qHisopados + cetec.qInvestig;
	let resto = TOPE_COVID - sofar;

	if( resto < 4 ) return;

	let fe_alta = today;

	if(cetec.actualState === 4 || cetec.actualState === 5){
		let fetx_alta = fechaAltaCovid(cetec, asis);
		if(!fetx_alta) return;
		fe_alta = utils.parseDateStr(fetx_alta);
		if(!fe_alta) return;
	}

	let fe_confirma = utils.parseDateStr(fetx_confirma);
	let fedesde = new Date(2020, 4, 1).getTime(); // 01/05/2020

	if(fe_confirma.getTime() >= fedesde){
		let yy = fe_confirma.getFullYear();
		let mm = fe_confirma.getMonth();
		let dd = fe_confirma.getDate()

		for (let i = 0; i < resto; i++){
			addLlamadosCovidToPrestaciones(cetec, asis, i, yy, mm, dd, fe_alta, resto );
		}
	}

}

function addLlamadosCovidToPrestaciones(cetec, asis, index, yy, mm, dd, fe_alta, resto ){

	let establecimiento = '02800628'; // Secretaría
	let fe_llamado = new Date(yy, mm, dd + index);


	//if(fe_llamado > fe_alta) return;

	let fecha = utils.dateToStr(fe_llamado);

	let fe_seguimiento = utils.datexToYYYYMMDDStr(fecha);

	if(_checkIfAlreadyCalled(cetec, fe_seguimiento)) return;

	let resultado = 'logrado';
	let vector = index ? 'estable' : 'inicia';
	let clasificacion = "754";
	let evolucion = "1";
	
	let mensaje =  'Seguimiento telefónico del afectado/a';

	if(resultado === 'nocontesta' || resultado === "notelefono"){
		evolucion = "4"
		mensaje: 'No contesta/ no logrado'		

	} else if( vector === 'inicia'){
		evolucion = "1"

	} else if( vector === 'estable'){
		evolucion = "1"

	} else if( vector === 'mejora'){
		evolucion = "1"

	} else if( vector === 'desmejora'){
		evolucion = "3"

	}

	if(index === resto -1 ){
		evolucion = "5"
	}

  if(evolucion === "4"){

  }else if(evolucion === 5){
		clasificacion = "781"

  }
	
	if(fe_llamado > fe_alta){
		// es llamado post-alta, ver qué
	}

	let intervencion = {
		seguimiento_id: '',
		tipo_seg_id: "3",
		establecimiento_cod: establecimiento,
		evolucion_id: evolucion,
		fecha_papel: utils.datexToYYYYMMDDStr(fecha),
		grupo_evento_id: GRUPO_EVENTO_ID,
		clasificacion_manual: mensaje,
		clasificacion_manual_id: clasificacion,
		evento_id: "307",
		fecha_seguimiento: fe_seguimiento,
	}

	cetec.intervenciones.push(intervencion);
	cetec.qCovid += 1;
}

function _checkIfAlreadyCalled(cetec, fe_seguimiento) {
	let ok = false;
	let intervenciones = cetec.intervenciones || [];
	let token = intervenciones.find(t => t.fecha_seguimiento === fe_seguimiento); 
	return token ? true: false;
}


/*****  FOLLOW UP *****/
function buildFollowUp(today, cetec, asis){
	let covid = cetec.isCasoCovid;
	let fe_confirma = fechaConfirmacion(cetec, asis);

	if(cetec.hasFollowUp){
		let followUp = asis.seguimEvolucion || [];

		followUp.forEach(fup => {
			addFollowUpToPrestaciones(cetec, asis, fup);
		})
	}

}

function addFollowUpToPrestaciones(cetec, asis, fup){

	let establecimiento = '02800628'; // Secretaría
	let fecha = fup.fe_llamado;
	let resultado = fup.resultado;
	let vector = fup.vector;
	let clasificacion = "752";

	if(cetec.isCasoCovid){
		clasificacion = '754';
	}

	let evolucion = "1";
	
	let mensaje = (fup.slug || '')  + (fup.indicacion ? (fup.slug ? (' - ' + fup.indicacion ) : fup.indicacion) : '');
	if(!mensaje) mensaje = 'Seguimiento telefónico del afectado/a';

	if(resultado === 'nocontesta' || resultado === "notelefono"){
		mensaje: 'No contesta/ no logrado'		
		evolucion = "4"		

	} else if( vector === 'inicia'){
		evolucion = "1"

	} else if( vector === 'estable'){
		evolucion = "1"

	} else if( vector === 'mejora'){
		evolucion = "1"

	} else if( vector === 'desmejora'){
		evolucion = "3"

	}

	if(fup.altaVigilancia){
		evolucion = "5"
		clasificacion = "781";
	}


	let intervencion = {
		seguimiento_id: '',
		tipo_seg_id: "3",
		establecimiento_cod: establecimiento,
		evolucion_id: evolucion,
		fecha_papel: utils.datexToYYYYMMDDStr(fecha),
		grupo_evento_id: GRUPO_EVENTO_ID,
		clasificacion_manual: mensaje,
		clasificacion_manual_id: clasificacion,
		evento_id: "307",
		fecha_seguimiento: utils.datexToYYYYMMDDStr(fecha),
	}

	cetec.intervenciones.push(intervencion);
	cetec.qFollowUp += 1;
}



/*****  INVESTIGACION *****/
function buildInvestigacion(today, cetec, asis){
	let sintomacovid = asis.sintomacovid;

	if(!sintomacovid) return;

	if(sintomacovid.fe_investig){
		addInvestigToPrestaciones(cetec, asis, sintomacovid);
	}
}

function addInvestigToPrestaciones(cetec, asis, sintomacovid){

	let establecimiento = '02800628'; // Secretaría
	let fecha = sintomacovid.fe_investig;

	let intervencion = {
		seguimiento_id: '',
		tipo_seg_id: "3",
		establecimiento_cod: establecimiento,
		evolucion_id: "5",
		fecha_papel: utils.datexToYYYYMMDDStr(fecha),
		grupo_evento_id: GRUPO_EVENTO_ID,
		clasificacion_manual: 'Investigación epidemiológica del afectado/a',
		clasificacion_manual_id: "754",
		evento_id: "307",
		fecha_seguimiento: utils.datexToYYYYMMDDStr(fecha),
	}

	cetec.intervenciones.push(intervencion);
	cetec.qInvestig += 1;
}



/*****  HISOPADO *****/
function buildHisopados(today, cetec, asis){
	if(!cetec.hasLaboratorio) return;

	asis.muestraslab.forEach(lab =>{
		if(isHisopadoPropio(cetec, asis, lab)){
			addHisopadoToPrestaciones(cetec, asis, lab);
		}
	})
}

function addHisopadoToPrestaciones(cetec, asis, lab){
	let token = getOptRecord(locMuestraOptList, lab.locacionId);
	let establecimiento = token ? token.establecimiento_cod : '02800628'; // default:107
	let fecha = lab.fe_toma || lab.fe_resestudio || lab.fe_notificacion;
	let intervencion = {
		seguimiento_id: '',
		tipo_seg_id: "2",
		establecimiento_cod: establecimiento,
		evolucion_id: "3",
		fecha_papel: utils.datexToYYYYMMDDStr(fecha),
		grupo_evento_id: GRUPO_EVENTO_ID,
		clasificacion_manual: 'Triage presencial, se instruye hisopado',
		clasificacion_manual_id: "752",
		evento_id: "307",
		fecha_seguimiento: utils.datexToYYYYMMDDStr(fecha),
	}

	cetec.intervenciones.push(intervencion);
	cetec.qHisopados += 1;
}

/*******************************************/
/*****  HELPERS       *****/
/*****************************************/

function exportToExcel(req, res){
	let query = {
		mesFacturacion: '2020-06'
	}

  let regexQuery = buildQuery(query)

  console.log('CETEC EXPORT BEGIN: *********')
  console.dir(regexQuery);

  Record.find(regexQuery).lean().exec(function(err, entities) {
      if (err) {
          console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
          errcb(err);

      }else{
          if(entities && entities.length){

              buildExcelStream(entities, query, req, res)
          }

      }
  });

}

function buildExcelStream(movimientos, query, req, res){

    let today = Date.now();
    let filename = 'migracion_cetec_'+today+'.xlsx';

    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="' + filename + '"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    var worksheet = workbook.addWorksheet('migracion')


    worksheet.addRow(['Registros pendientes de ser migrados a CETEC']).commit()
    worksheet.addRow(['Fecha emisión', new Date().toString()]).commit()

    worksheet.addRow().commit()
    worksheet.addRow(["#",'FeProceso', 'Estado migracion', 'Domicilio?', 'Covid?', 'Llamados?', 'Novedades?', 'Laboratorios?', 'Encuesta?', 'CasoCOVID','CasoSOSPECHOSO','CasoCEstrecho', 'EstadoCOVID', 'DNI', 'Apellido', 'Nombre', 'Sexo', 'FeNacim', 'domicilio', 'localidad', 'telefono', 'obra social', 'Diagnostico', 'Alta definitiva', 'idOrigen', 'idClasifi', 'idEstado', '#llam', '#Hiso', '#Inves', '#xCovid']).commit();

    movimientos.forEach((row, index )=> {

    	const { fe_alta, estado, hasLocacion, hasInfection, hasFollowUp, hasNovedades, hasLaboratorio, hasEncuesta, isCasoCovid, isSospechoso,isContactoEstrecho, actualState, nro_doc, apellido, nombre, sexo, fecha_nacimiento, domicilio, localidad_id, telefono, obra_social, fecha_diagnostico, fecha_alta_definitiva, origen_id, clasificacion_id, estado_id, qFollowUp, qHisopados, qInvestig, qCovid} = row;
    	let basicArr = [ 1, fe_alta, estado, hasLocacion, hasInfection, hasFollowUp, hasNovedades, hasLaboratorio, hasEncuesta, isCasoCovid, isSospechoso, isContactoEstrecho, actualState, nro_doc, apellido, nombre, sexo, fecha_nacimiento, domicilio, localidad_id, telefono, obra_social, fecha_diagnostico, fecha_alta_definitiva, origen_id, clasificacion_id, estado_id, qFollowUp, qHisopados, qInvestig, qCovid];
      
      worksheet.addRow([...basicArr ]).commit()

      let intervenciones = row.intervenciones;
      if(intervenciones && intervenciones.length){
    		worksheet.addRow([ 2,'','','FechaSeguim','idTipoSeguim', 'idEstablecimiento', 'idEvolucion', 'Fecha_papel', 'idGrupoEvento', 'idEvento','idClasifManual', 'Clasificacion (leyenda)']).commit();
      	intervenciones.forEach(evento => {
	  	  		const {fecha_seguimiento, tipo_seg_id, establecimiento_cod, evolucion_id, fecha_papel, grupo_evento_id, evento_id, clasificacion_manual_id, clasificacion_manual } = evento;
  	  			let eventoArr = [ 2,"", "", fecha_seguimiento, tipo_seg_id, establecimiento_cod, evolucion_id, fecha_papel, grupo_evento_id, evento_id, clasificacion_manual_id, clasificacion_manual ];
      			worksheet.addRow([...eventoArr ]).commit()

      	})

      }

    })
    worksheet.commit()
    workbook.commit()

}

/*******************************************/
/*****  HELPERS       *****/
/*****************************************/
function checkIfSospechoso(cetec, asis){
	if(cetec.isCasoCovid) return false;

	if(cetec.actualState === 0 || cetec.actualState === 6) return true;

	if(cetec.hasLaboratorio) return true;

	return false;
}

function checkIfContactoEstrecho(cetec, asis){
	if(cetec.isCasoCovid || cetec.isSospechoso ) return false;

	// agregar contacto estrecho
	if(asis.casoIndice && asis.casoIndice.parentId) return true;

	return false;
}

function isHisopadoPropio(cetec, asis, lab){
	let token = getOptRecord(locMuestraOptList, lab.locacionId);
	if(lab.locacionId){
		//console.log('lab.locacionId [%s]  [%s] [%s] [%s] ', lab.locacionId, lab.secuencia, lab.locacionSlug, token);
	}

	if(token) return true;

	return false;
}

function fechaAltaCovid(cetec, asis){
	let fecha;
	let fecha_confirma;

	if(cetec.isCasoCovid){
		fecha = asis.infeccion.fe_alta;
		if(fecha) return fecha;

		fecha_confirma = fechaConfirmacion(cetec, asis)
		if(!fecha_confirma) return null;

		let fe_alta = utils.projectedDate(utils.parseDateStr(fecha_confirma), 0, COVID_OFFSET_ALTA);
		if(!fe_alta) return null;

		fecha = utils.dateToStr(fe_alta);
		return fecha;

	}
	return null;
}

function fechaConfirmacion(cetec, asis){
	let fecha;
	if(cetec.isCasoCovid){
		fecha = asis.infeccion.fe_confirma;
		if(fecha) return fecha;

		let sisa = asis.sisaevent;
		if(sisa){
			fecha = sisa.fe_reportado;
			if(fecha) return fecha;
		}
	}
	return null;
}

function fechaBase(cetec, asis){
	let fecha;

	let infection = asis.infeccion;
	if(infection){
		fecha = infection.fe_confirma;
		if(fecha) return fecha;

		fecha = infection.fe_inicio;
		if(fecha) return fecha;
	}

	let sisa = asis.sisaevent;
	if(sisa){
		fecha = sisa.fe_reportado;
		if(fecha) return fecha;
	}

	fecha = asis.fecomp_txa;
	if(fecha) return fecha;

	return null;
}



function checkIfCovid(cetec, asis){
	if(cetec.actualState === 1 || cetec.actualState === 4 || cetec.actualState === 5) return true;
	else return false;
}

function getLocalidadId(cetec, asis){
	if(cetec.hasLocacion){
		let token =  getOptRecord(ciudadesBrown, asis.locacion.city);
		return token ? token.localidad_id : "60";
	}else {
		return '60';
	}
}

function getSiglaTipoDoc(cetec, asis){
	let token = getOptRecord(tiposCompPersonaFisica, asis.tdoc)
	return token ? token.sigla_tipo_doc : 'D.N.I';
}

function getSexo(cetec, asis){
	let token = getOptRecord(sexoOptList, asis.sexo)
	return token ? token.sexo : '1';
}

/*
	1	CURADO
	2	FALLECIDO

	3	INTERNADO
	4	AISLAM INSTITUCIONAL
	5	AISLAM DOMICILIARIO
	6	ENVIADO al sistema de Gestión COVID
*/
function getEstadoId(cetec, asis){
	let value = 0;
	if(cetec.hasInfection){
		if(cetec.actualState === 1){
			let token = getOptRecord(tinternacionOptList, asis.infeccion.tinternacion)
			value = token ? token.estado_id : 0
			return value || 5;  // valores válidos 3, 4, o 5
		}

		if(cetec.actualState === 4) return 2;
		if(cetec.actualState === 5) return 1;

	}
	return null;
}

/*
	1	COVID+
	2	DESCARTADO
	3	SOSPECHOSO
	4	CONTACTO ESTRECHO
*/
function getClasificacionId(cetec, asis){
	if(cetec.hasInfection){
		let token = getOptRecord(clasificacionAfectadoOptList, cetec.actualState);
		return token ? token.clasificacion_id : null;
	}
	if(cetec.isContactoEstrecho) return 4
	return null;
}



function getOrigenId(cetec, asis){
	let origen = null;

	if(cetec.hasInfection){
		if(cetec.actualState === 2) return null;

		if(cetec.isCasoCovid){
			origen = 3 // default 3 = comunitairio
		}

		let token = getOptRecord(avanceInfectionOptList, asis.infeccion.avance);
		return token ? (token.origen_id || origen) : origen;
	}

	return origen;
}

function getFechaDiagnostico(cetec, asis){
	let fecha = '';
	if(cetec.hasInfection){
		fecha = utils.datexToYYYYMMDDStr(asis.infeccion.fe_confirma);
		if(fecha) return fecha;

	} else if(cetec.hasEncuesta){
		fecha = utils.datexToYYYYMMDDStr(asis.sintomacovid.fe_investig);
		if(fecha) return fecha
	}

	return null;
}

function getFechaAltaDefinitiva(cetec, asis){
	let fecha = null;
	if(cetec.actualState === 5 || cetec.actualState === 4){
		fecha = fechaAltaCovid(cetec, asis);
		if(fecha) fecha = utils.datexToYYYYMMDDStr(fecha)
	} 

	return fecha;
}

//hasLocacion
class CetecBaseData {
	constructor(fecha, asis){
	
			let locacion = asis.locacion;
			if(!locacion ){
				locacion = {
					street1: 'sin dato',
					city: 'adrogue',
					barrio: 'Adrogué Centro',
				}		
				this.hasLocacion = false;

			}else{
				this.hasLocacion = true;
			}

			let infection = asis.infeccion;
			if(infection ){
				this.hasInfection = true;
				this.actualState = asis.infeccion.actualState;

			}else {
				this.hasInfection = false;
				this.actualState = 7

			}

			let laboratorio = asis.muestraslab;
			if(laboratorio && laboratorio.length ){
				this.hasLaboratorio = true;

			}else {
				this.hasLaboratorio = false;

			}

			let followUp = asis.seguimEvolucion;
			if(followUp && followUp.length ){
				this.hasFollowUp = true;

			}else {
				this.hasFollowUp = false;

			}

			let novedades = asis.novedades;
			if(novedades && novedades.length ){
				this.hasNovedades = true;

			}else {
				this.hasNovedades = false;

			}


			let encuesta = asis.sintomacovid;
			if(encuesta){
				this.hasEncuesta = true;
			} else {
				this.hasEncuesta = false;
			}

			this.qFollowUp = 0;
			this.qHisopados = 0;
			this.qInvestig = 0;
			this.qCovid = 0;

			this.fe_alta = utils.dateToStr(fecha);
			this.mesFacturacion = '';
			this.registronro = 0;
			this.estado = 'pendiente';
			this.fe_transfe = '';
			this.asistenciaId = asis._id;
			this.cuit_municipio = CUIT_MBA;
			this.idPerson = asis.idPerson;
			this.paciente_id = '';
			this.sigla_tipo_doc = '';
			this.tdoc = asis.tdoc;
			this.nro_doc = asis.ndoc;
			this.apellido = asis.requeridox && asis.requeridox.apellido;
			this.nombre = asis.requeridox && asis.requeridox.nombre;
			this.sexo = '';
			this.fecha_nacimiento = '';
			this.nacionalidad = 'argentino';
			this.domicilio = locacion.street1;
			this.barrio = locacion.barrio;
			this.localidad_id = '';
			this.email = '';
			this.telefono = asis.telefono;
			this.obra_social = asis.osocial || '';
			this.fecha_diagnostico = '';
			this.fecha_alta_definitiva = '';
			this.evento_caso_id = null;
			this.origen_id = '';
			this.clasificacion_id = '';
			this.estado_id = '';
			this.intervenciones = [];
	}
}


/*****
	EJEMPLO-1: MGO
	const data = new FormData();
	data.append('cuit_municipio', '33999001489');
	data.append('sigla_tipo_doc', 'D.N.I');
	data.append('apellido', 'Gomez Ortega');
	data.append('nombre', 'Mateo');
	data.append('nro_doc', '14391664');
	data.append('sexo', '1');
	data.append('localidad_id', '60');
	data.append('fecha_nacimiento', '1960-02-15');
	data.append('tipo_seg_id', '3');
	data.append('domicilio', 'Rosales 1312');
	data.append('barrio', 'Adrogué Centro');
	data.append('nacionalidad', 'Argentino');
	data.append('email', 'mgomezortega@gmail.com');
	data.append('telefono', '1144742025');
	data.append('obra_social', 'osde');
	data.append('fecha_diagnostico', '2020-08-14');
	data.append('fecha_alta_definitiva', '');
	data.append('origen_id', '1');
	data.append('clasificacion_id', '1');
	data.append('estado_id', '5');
	data.append('establecimiento_cod', '02801071');
	data.append('evolucion_id', '1');
	data.append('fecha_papel', '2020-08-14');
	data.append('grupo_evento_id', '113');
	data.append('clasificacion_manual', 'mensaje');
	data.append('clasificacion_manual_id', '756');
	data.append('evento_id', '307');
	data.append('fecha_seguimiento', '2020-08-14');



	data.append('cuit_municipio', cetec.cuit_municipio);
	data.append('sigla_tipo_doc', cetec.sigla_tipo_doc);
	data.append('nro_doc',        cetec.nro_doc);
console.log(1);

	data.append('apellido',         cetec.apellido);
	data.append('nombre',           cetec.nombre);
	data.append('sexo',             cetec.sexo);
	data.append('fecha_nacimiento', cetec.fecha_nacimiento);
	data.append('nacionalidad',     cetec.nacionalidad);
console.log(2);

	data.append('localidad_id', cetec.localidad_id);
	data.append('domicilio',    cetec.domicilio);
	data.append('barrio',       cetec.barrio);
	data.append('email',        cetec.email);
	data.append('telefono',     cetec.telefono);
	data.append('obra_social',  cetec.obra_social);
console.log(3);

	data.append('fecha_diagnostico',     cetec.fecha_diagnostico);
	data.append('fecha_alta_definitiva', cetec.fecha_alta_definitiva);
	//evento_caso_id: null
	data.append('origen_id',             cetec.origen_id);
	data.append('clasificacion_id',      cetec.clasificacion_id);
	data.append('estado_id',             cetec.estado_id);
console.log(4);

	data.append('tipo_seg_id',             intervencion.tipo_seg_id);
	data.append('establecimiento_cod',     intervencion.establecimiento_cod);
	data.append('evolucion_id',            intervencion.evolucion_id);
	data.append('fecha_papel',             intervencion.fecha_papel);
	data.append('grupo_evento_id',         intervencion.grupo_evento_id);
	data.append('clasificacion_manual',    intervencion.clasificacion_manual);
	data.append('clasificacion_manual_id', intervencion.clasificacion_manual_id);
	data.append('evento_id',               intervencion.evento_id);
	data.append('fecha_seguimiento',       intervencion.fecha_seguimiento);


	const data = new FormData();
	cuit_municipio
	sigla_tipo_doc
	apellido
	nombre
	nro_doc
	sexo
	localidad_id
	fecha_nacimiento
	tipo_seg_id
	domicilio
	barrio
	nacionalidad
	email
	telefono
	obra_social
	fecha_diagnostico
	origen_id
	clasificacion_id
	estado_id
	establecimiento_cod
	evolucion_id
	fecha_papel
	grupo_evento_id
	clasificacion_manual
	clasificacion_manual_id
	evento_id
	fecha_seguimiento


****/