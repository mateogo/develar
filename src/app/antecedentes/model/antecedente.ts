import { devutils } from '../../develar-commons/utils';

export interface ImputacionInfracciones {
	tipo: string;
	asunto: string;
}

export interface Ciudadano {
	tdoc: string;
	ndoc: string;
	nombre: string;
	apellido: string;


}

export function ciudadanoDefaultFactory(){
	return {
		tdoc: 'DNI',
		ndoc: '',
		nombre: '',
		apellido: '',
	}

}

export interface Antecedente {
	id: string;
	_id: string;
	fuenteOrigen: string; //manual; sacit; municipio_x
	estado_alta: string;

	// evento-antecedente
	tipo: string;
	fe_comp: number;
	fe_compTxt: string;
	tcomp: string;
	ncomp: string;



	// infracción
	tinfraccion: string;
	finfraccion: string;
	fe_infr: number;
	fe_infrTxt: string;
	lugar: string;
	jurisdiccion: string;

	// vehiculo
	dominio: string;
	tdoc_titular: string;
	ndoc_titular: string;

	// conductor
	dato_conductor: number; // 0:indeterminado  1:titular vehiculo 2:determinado
	tdoc_conductor: string;
	ndoc_conductor: string;



	//Juridico
	nivel_ejecucion: string;
	estado_infraccion: string;
	isFirme: boolean;
	isPaga: boolean;
	fe_resolucion: number;
	fe_resolucionTxt: string;
	imputaciones: Array<ImputacionInfracciones>;


}


export function antecedenteDefaultFactory():Antecedente {
	let date = new Date(),
			dateTS = date.getTime(),
			dateTxt = devutils.txFromDate(date);

	return {
		id: '',
		_id: '',
		fuenteOrigen: 'manual',
		estado_alta: 'activo',

		// evento-antecedente
		tipo: 'infraccion',
		fe_comp: dateTS,
		fe_compTxt: dateTxt,

		// infracción
		tcomp: 'acta',
		finfraccion: 'fotocelula',
		ncomp: '',
		tinfraccion: 'no_definido',
		fe_infr: dateTS,
		fe_infrTxt: dateTxt,
		lugar: 'descripción lugar',
		jurisdiccion: 'laplata',

		// vehiculo
		dominio: 'DOMINIO',
		tdoc_titular: 'DNI',
		ndoc_titular: '',

		// conductor
		dato_conductor: 0, // 0:indeterminado  1:titular vehiculo 2:determinado
		tdoc_conductor: 'DNI',
		ndoc_conductor: '',


		//Juridico
		nivel_ejecucion: 'generada',
		estado_infraccion: 'activa',
		isFirme: false,
		isPaga: false,
		fe_resolucion: 0,
		fe_resolucionTxt: '',

		imputaciones: [],
	};
}

export interface AntecedenteTable {

	fuenteOrigen: string; //manual; sacit; municipio_x

	// evento-antecedente
	tipo: string;
	fe_comp: number;
	fe_compTxt: string;
	tcomp: string;
	ncomp: string;



	// infracción
	tinfraccion: string;
	finfraccion: string;
	fe_infr: number;
	fe_infrTxt: string;
	lugar: string;
	jurisdiccion: string;

	// vehiculo
	dominio: string;
	tdoc_titular: string;
	ndoc_titular: string;

	// conductor
	dato_conductor: number; // 0:indeterminado  1:titular vehiculo 2:determinado
	tdoc_conductor: string;
	ndoc_conductor: string;

	//Juridico
	nivel_ejecucion: string;
	estado_infraccion: string;
	isFirme: boolean;
	isPaga: boolean;
	fe_resolucion: number;
	fe_resolucionTxt: string;

}


