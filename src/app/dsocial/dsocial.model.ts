import { devutils } from '../develar-commons/utils';

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

export const sectores: SectorAtencion[] = [
			{val:'regionvi',    serial:'regionvi',    label: 'Región VI',         style: {'background-color': "#f2aded"}},
			{val:'discapacidad',serial:'discapacidad',label: 'Discapacidad',      style: {'background-color': "#f2bded"}}, 
			{val:'masvida',     serial:'masvida',     label: 'MasVida',           style: {'background-color': "#f2cded"}},
			{val:'alimentos',   serial:'alimentos',   label: 'Alimentos',         style: {'background-color': "#f2cded"}},
			{val:'tsocial',     serial:'tsocial',     label: 'Trabajador Social', style: {'background-color': "#f2cded"}},
			{val:'nutricion',   serial:'nutricion',   label: 'Nutrición',         style: {'background-color': "#f2dded"}},
			{val:'inhumacion',  serial:'inhumacion',  label: 'Inhumación',        style: {'background-color': "#f2dded"}},
			{val:'terceraedad', serial:'terceraedad', label: 'Tercera Edad',      style: {'background-color': "#f2dded"}},
			{val:'pensiones',   serial:'pensiones',   label: 'Pensiones',         style: {'background-color': "#f2dded"}}
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


export class DsocialModel {
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

	static turnoSerial(type, name, sector){
		let serial = new Serial();
		serial.type = type; // turnos
		serial.name = name; // ayudadirecta
		serial.tserial = 'turnodiario';
		serial.sector = sector; // materiales; alimentos; nutricion; etc;
		serial.tdoc = 'turno';
		serial.letra = 'X';
		serial.anio = 0;
		serial.mes = 0;
		serial.dia = 0;
		serial.estado = 'activo';
		serial.punto = 0;
		serial.pnumero = 1;
		serial.offset = 0;
		serial.slug = 'Turnos en atención al público en Desarrollo Social';
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
		serial.sector = sector; // materiales; alimentos; nutricion; etc;
		serial.tdoc = 'solicitud';
		serial.letra = 'X';
		serial.anio = 0;
		serial.mes = 0;
		serial.dia = 0;
		serial.estado = 'activo';
		serial.punto = 0;
		serial.pnumero = 10000;
		serial.offset = 0;
		serial.slug = 'Solicitudes de asistencia en Desarrollo Social';
		serial.compPrefix = 'SOL';
		serial.compName = 'S/Asistencia';
		serial.showAnio = false;
		serial.resetDay = true;
		serial.fe_ult = 0;

		return serial;
	}

	static remitoalmacenSerial(type, name, sector){
		let serial = new Serial();
		serial.type = type; // remitoalmacen
		serial.name = name; // ayudadirecta
		serial.tserial = 'remitoalmacen';
		serial.sector = sector; // materiales; alimentos; nutricion; etc;
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
		serial.resetDay = true;
		serial.fe_ult = 0;

		return serial;
	}


}
