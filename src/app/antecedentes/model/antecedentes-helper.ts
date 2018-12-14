import { Antecedente, AntecedenteTable } from './antecedente';

const tiposAntecedente: Array<any> = [
		{val: 'no_definido', 	   label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'infraccion',      label: 'infraccion',  slug:'infraccion' },
		{val: 'curso',           label: 'curso',        slug:'curso' },
		{val: 'inhabilitacion',  label: 'inhabilitacion',         slug:'inhabilitacion' },
	
];

const tiposInfraccion: Array<any> = [
		{val: 'no_definido', 	    label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'estacionamiento',  label: 'estacionamiento',  slug:'estacionamiento' },
		{val: 'velocidad',        label: 'velocidad',        slug:'velocidad' },
		{val: 'semaforo',         label: 'semaforo',         slug:'semaforo' },
		{val: 'ebriedad',         label: 'ebriedad',         slug:'ebriedad' },
		{val: 'picada',           label: 'picada',           slug:'picada' },
		{val: 'vtv',              label: 'vtv',              slug:'vtv' },
		{val: 'titularidad',      label: 'titularidad',      slug:'titularidad' },
		{val: 'licencia',         label: 'licencia',         slug:'licencia' },
	
];

const tiposCompAntecedente: Array<any> = [
		{val: 'no_definido', 	    label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'acta',             label: 'acta',           slug:'acta' },
		{val: 'causa',            label: 'causa',          slug:'causa' },
		{val: 'legajo',           label: 'legajo',         slug:'legajo' },
	
];

const tiposCompInfraccion: Array<any> = [
		{val: 'no_definido', 	    label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'acta',             label: 'acta',               slug:'acta' },
		{val: 'fotomulta',        label: 'fotomulta',          slug:'fotomulta' },
		{val: 'parte',            label: 'parte',              slug:'parte' },	
];

const tiposCompCarpeta: Array<any> = [
		{val: 'no_definido', 	   label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'expediente',      label: 'expediente',               slug:'expediente' },
		{val: 'legajo',          label: 'legajo',          slug:'legajo' },
		{val: 'causa',           label: 'causa',              slug:'causa' },	
];

const tiposCompPersonaFisica: Array<any> = [
		{val: 'DNI', 	     label: 'DNI',  slug:'DNI' },
		{val: 'LE',        label: 'Libreta Enrolam',    slug:'Libreta Enrolam' },
		{val: 'LC',        label: 'Libreta Cívica',    slug:'Libreta Cívica' },
		{val: 'PAS',       label: 'Pasaporte',          slug:'Pasaporte' },
		{val: 'CI',        label: 'Cédula de Identidad',          slug:'Cédula de Identidad' },
		{val: 'EXT',       label: 'Extranjeros',          slug:'Extranjeros' },
];

const tiposCompTitularDominio: Array<any> = [
		{val: 'DNI', 	     label: 'DNI',  slug:'DNI' },
		{val: 'LE',        label: 'Libreta Enrolam',    slug:'Libreta Enrolam' },
		{val: 'CUIT',      label: 'CUIT',               slug:'CUIT' },
];

const tiposImputacion: Array<any> = [
		{val: 'no_definido', 	        scoring: 0,  label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'estacionamIzquierda',  scoring: 0,  label: 'estacionamiento',  slug:'estacionamiento' },
		{val: 'estacionamProhibido',  scoring: 0,  label: 'estacionamProhibido',        slug:'estacionamProhibido' },
		{val: 'semaforoRojo',         scoring: 4,  label: 'semaforoRojo',         slug:'semaforoRojo' },
		{val: 'ebriedad',             scoring: 8,  label: 'ebriedad',         slug:'ebriedad' },
		{val: 'picada',               scoring: 10, label: 'picada',           slug:'picada' },
		{val: 'cedulaFaltante',       scoring: 0,  label: 'cedulaFaltante',      slug:'cedulaFaltante' },
		{val: 'vtvVencida',           scoring: 4,  label: 'vtvVencida',      slug:'vtvVencida' },
		{val: 'licenciaVencida',      scoring: 0,  label: 'licenciaVencida',         slug:'licenciaVencida' },
		{val: 'licenciaFaltante',     scoring: 0,  label: 'licenciaFaltante',         slug:'licenciaFaltante' },
		{val: 'licenciaTipoNoApta',   scoring: 0,  label: 'licenciaTipoNoApta',         slug:'licenciaTipoNoApta' },
		{val: 'velMaxima20',          scoring: 4,  label: 'velMaxima20',         slug:'velMaxima20' },
		{val: 'velMaxima40',          scoring: 8,  label: 'velMaxima40',         slug:'velMaxima40' },
	
];

const jurisdiccionesList: Array<any> = [
		{val: 'no_definido', 	    label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'laplata',          label: 'laplata',  slug:'laplata' },
		{val: 'almtebrown',       label: 'almtebrown',  slug:'almtebrown' },
		{val: 'CABA',             label: 'CABA',  slug:'CABA' },
		{val: 'dolores',          label: 'dolores',  slug:'dolores' },
		{val: 'florenciovarela',  label: 'florenciovarela',  slug:'florenciovarela' },
	
];

const conductorOptionList: Array<any> = [
		{val: '0', 	    label: 'No determinado',   slug:'Seleccione opción' },
		{val: '1',      label: 'Titular dominio',  slug:'Se asume el titular del dominio' },
		{val: '2',      label: 'Determinado',      slug:'Determinado fehacientemente' },
	
];

const fuenteInfraccionOptionList: Array<any> = [
		{val: 'fotocelula',      label: 'fotocelula',   slug:'fotocelula' },
		{val: 'radar', 	         label: 'radar',   slug:'radar' },
		{val: 'actamanual', 	   label: 'actamanual',   slug:'actamanual' },
		{val: 'actaenpresencia', label: 'actaenpresencia',   slug:'actaenpresencia' },
];

const nivelEjecucionOptionList: Array<any> = [
		{val: 'generada',       label: 'Evento infracción',   slug:'Evento infracción' },
		{val: 'radicada', 	    label: 'Radicada jurisdicción',   slug:'Radicada jurisdicción' },
		{val: 'pagovolun', 	    label: 'Resuelta x Pago voluntario',   slug:'Resuelta x Pago voluntario' },
		{val: 'sentencia',      label: 'Sentenciada',   slug:'Sentenciada' },
		{val: 'sentenciaficta', label: 'Sentencia ficta',   slug:'Sentencia ficta' },
		{val: 'concurso',       label: 'Concurso real',   slug:'Concurso real' },
		{val: 'desestimada',    label: 'Desestimada',   slug:'Desestimada' },
		{val: 'prescripta',     label: 'Baja x Prescripción',   slug:'Baja x Prescripción' },
		{val: 'anulada',        label: 'Baja x Anulación',   slug:'Baja x Anulación' },
];

const estadoInfraccionOptionList: Array<any> = [
		{val: 'enfirme', 	     label: 'En Firme',   slug:'En Firme' },
		{val: 'activa',        label: 'Activa NoFirme',   slug:'Activa NoFirme' },
		{val: 'prescripta',    label: 'Prescripta',   slug:'Prescripta' },
		{val: 'desestimada',   label: 'Desestimada',   slug:'Desestimada' },
		{val: 'baja',          label: 'Baja',   slug:'Baja' },
];

const estadoPagoOptionList: Array<any> = [
		{val: 'pendiente',        label: 'Pendiente de pago',   slug:'Pendiente de pago' },
		{val: 'pagada',    label: 'Pagada',   slug:'Pagada' },
];

const tableActions = [ 
      {val: 'no_definido', label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'edit',        label: 'Editar registro',    slug:'Editar registro' },
      {val: 'view',        label: 'Ver registro',      slug:'Ver registro' },
]


export class ModelHelper {
	constructor(){

	}

	static get infraccionTipoLst():Array<any>{
		return tiposInfraccion;
	}

	static get imputacionTipoLst():Array<any>{
		return tiposImputacion;
	}

	static get antecedentesTipoLst(): Array<any>{
		return tiposAntecedente;
	}

	static get antecedentesCompLst(): Array<any>{
		return tiposCompAntecedente;
	}

	static get infraccionesCompLst(): Array<any>{
		return tiposCompInfraccion;
	}

	static get personaFisicaCompLst(): Array<any> {
		return tiposCompPersonaFisica;
	}

	static get comprobantesCarpetaLst(): Array<any>{
		return tiposCompCarpeta;
	}
	
	static get jurisdicciones(): Array<any>{
		return jurisdiccionesList;
	}

	static get fuenteInfraccion(): Array<any>{
		return fuenteInfraccionOptionList;
	}

	static get conductorOptionList(): Array<any>{
		return conductorOptionList;
	}

	static get nivel_ejecucion(): Array<any>{
		return nivelEjecucionOptionList;
	}

	static get estadoInfracion(): Array<any>{
		return estadoInfraccionOptionList;
	}

	static get estadoPago(): Array<any>{
		return estadoPagoOptionList;
	}

	static evalInfraccion(evento: Antecedente): boolean {
		let isFirme = true;

		if(evento.dato_conductor === 0 ) isFirme = false;
		if(evento.estado_infraccion !== 'enfirme' ) isFirme = false;

		return isFirme;
	}

	static get tableActions(): Array<any>{
		return tableActions;
	}

	static fetchPuntosFromImputacion(imputacion){
		let puntos = 0;
		let token = tiposImputacion.find(t => t.val === imputacion);
		if(token){
			puntos = token.scoring;
		}
		return puntos;
	}

}
