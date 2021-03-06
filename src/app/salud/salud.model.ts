import { devutils } from '../develar-commons/utils';
import { Person, CoberturaData }  from '../entities/person/person';

export interface Ciudadano {
	tdoc: string;
	ndoc: string;
	nombre: string;
	apellido: string;
	denominacion: string;
	tpersona: string;
}

export interface SectorAtencion {
	val: string;
	serial: string;
	label: string;
	style: object;
}

const asistenciaBlackList = [
	{val: 'asisnacional:pnsa',  type:'asisnacional', tingreso:'pnsa', action: 'alimentos',  slug:'No entrega alimentos' },
]

function isInAsistenciaBlackList(token, action){
	return asistenciaBlackList.find(t => t.val === token && t.action === action );
}


export const sectores: SectorAtencion[] = [
			{val:'direccion',    serial:'salud',  label: 'Dirección Médica' ,     style: {'background-color': "#f2dded"}},
			{val:'coordinacion', serial:'salud',  label: 'Coord Operativa',       style: {'background-color': "#f2cded"}},
			{val:'internacion',  serial:'salud',  label: 'Coord Internación',     style: {'background-color': "#f2cded"}},
			{val:'epidemiologia',serial:'salud',  label: 'Epidemiología',         style: {'background-color': "#f2cded"}},
			{val:'smental',      serial:'salud',  label: 'Salud Mental',          style: {'background-color': "#f2cded"}},
			{val:'vigilancia',   serial:'salud',  label: 'Vigilancia',            style: {'background-color': "#f2cded"}},

			{val:'com',          serial:'salud',  label: 'COM-107',               style: {'background-color': "#f2cded"}},
			{val:'same',         serial:'salud',  label: 'SAME',                  style: {'background-color': "#f2aded"}},
			{val:'ivr',          serial:'salud',  label: 'IVR',                   style: {'background-color': "#f2cded"}},
			{val:'brown0800',    serial:'salud',  label: 'Brown atiende 0800',    style: {'background-color': "#f2dded"}},
			{val:'deportes',     serial:'salud',  label: 'Vol Deportes',          style: {'background-color': "#f2cded"}},
			{val:'voluntarios',  serial:'salud',  label: 'Vol Concejo Del',       style: {'background-color': "#f2cded"}},

			{val:'caps',         serial:'salud',  label: 'CAPS',                  style: {'background-color': "#f2cded"}},
			{val:'enfermeros',   serial:'salud',  label: 'Enfermeros',            style: {'background-color': "#f2cded"}},


			{val:'plasma',       serial:'salud',  label: 'Coord don plasma',      style: {'background-color': "#f2cded"}},
			{val:'dsocial',      serial:'salud',  label: 'Desarrollo Social',     style: {'background-color': "#f2cded"}},
			{val:'estadisticas', serial:'salud',  label: 'Dir de Estadísticas' ,  style: {'background-color': "#f2dded"}},
			{val:'sistema',      serial:'salud',  label: 'Sistema Brown Salud' ,  style: {'background-color': "#f2dded"}},
	];


export class Serial {
		type:string;
		name:string;
		tserial:string;
		sector:string;
		tdoc:string;
		letra:string;
		anio:number;
		mes:number;
		dia:number;
		estado:string;
		punto:number;
		pnumero:number;
		offset:number;
		slug:string;
		compPrefix:string;
		compName:string;
		showAnio:boolean;
		resetDay:boolean;
		fe_ult:number;
}

const LETRAS = ['X', 'Q', 'J', 'A', 'D'];
// X:normal; Q:especiales; J:tercera edad; A:bebes; D:direccion

function letraSerial(peso): string{
	if(!peso || peso > 4 || peso < 0) peso = 0;

	return LETRAS[peso];
}


export class SaludModel {
	static documSerial(){
		let serial = new Serial();
		serial.type = 'person';
		serial.name = 'docum';
		serial.tserial = 'provisorio';
		serial.sector = 'personas';
		serial.tdoc = 'identidad';
		serial.letra = 'X';
		serial.anio = 0;
		serial.mes = 0;
		serial.dia = 0;
		serial.estado = 'activo';
		serial.punto = 0;
		serial.pnumero = 1;
		serial.offset = 100000;
		serial.slug = 'PROV';
		serial.compPrefix = 'PROV';
		serial.compName = 'Identif Provisoria';
		serial.showAnio = false;
		serial.resetDay = false;
		serial.fe_ult = 0;

		return serial;
	}

	static turnoSerial(type, name, sector, peso){
		let serial = new Serial();
		serial.type = type; // turnos
		serial.name = name; // ayudadirecta
		serial.tserial = 'turnodiario';
		serial.sector = sector; // alimentos; nutricion; etc;
		serial.tdoc = 'turno';
		serial.letra = letraSerial(peso);

		serial.anio = 0;
		serial.mes = 0;
		serial.dia = 0;
		serial.estado = 'activo';
		serial.punto = 0;
		serial.pnumero = 1;
		serial.offset = 0;
		serial.slug = 'Turnos en atención Secretaría de Salud';
		serial.compPrefix = 'TUR';
		serial.compName = 'T/Mostrador';
		serial.showAnio = false;
		serial.resetDay = true;
		serial.fe_ult = 0;

		return serial;
	}

	static asistenciaSerial(type, name, sector){
		let serial = new Serial();
		serial.type = type; // asistencia
		serial.name = name; // solicitud
		serial.tserial = 'sasistencia';
		serial.sector = sector; //  alimentos; nutricion; etc;
		serial.tdoc = 'solicitud';
		serial.letra = 'X';
		serial.anio = 0;
		serial.mes = 0;
		serial.dia = 0;
		serial.estado = 'activo';
		serial.punto = 0;
		serial.pnumero = 1;
		serial.offset = 100000;
		serial.slug = 'Solicitudes de asistencia prevención Salud';
		serial.compPrefix = 'SOL';
		serial.compName = 'S/Asistencia';
		serial.showAnio = false;
		serial.resetDay = false;
		serial.fe_ult = 0;

		return serial;
	}

	static remitoalmacenSerial(type, name, sector){
		let serial = new Serial();
		serial.type = type; // remitoalmacen
		serial.name = name; // ayudadirecta
		serial.tserial = 'remitoalmacen';
		serial.sector = sector; //  alimentos; nutricion; etc;
		serial.tdoc = 'remito';
		serial.letra = 'X';
		serial.anio = 0;
		serial.mes = 0;
		serial.dia = 0;
		serial.estado = 'activo';
		serial.punto = 0;
		serial.pnumero = 10000;
		serial.offset = 0;
		serial.slug = 'Vales de entrega Almacén';
		serial.compPrefix = 'REM';
		serial.compName = 'R/Entrega';
		serial.showAnio = false;
		serial.resetDay = false;
		serial.fe_ult = 0;

		return serial;
	}

	static asistenciaPermitida(action: string, person: Person ):boolean{
		let cumple = true;
		let coberturas = person.cobertura;

		if(coberturas && coberturas.length){
			coberturas.forEach(co => {
				if(isInAsistenciaBlackList(co.type + ':' + co.tingreso, action)) cumple = false;
			})
		}
		return cumple;
	}

}
