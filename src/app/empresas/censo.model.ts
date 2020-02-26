import { devutils } from '../develar-commons/utils';
import { Person, CoberturaData }  from '../entities/person/person';



export class Empresa {
		empresaId:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string; 
};

export class Responsable {
		responsableId:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string; 
};

export interface EstadoCenso {
	estado: string;
	navance: string;
	isCerrado: boolean;
	ts_alta: number;
	ts_umodif: number;
	fecierre_txa: string;
	fecierre_tsa: number;
	cerradoPor: Responsable;


}

export class CensoData {
	codigo: string = 'censo:industrias:2020:00';
	type: string =  'censo:anual'
	anio: number = 2020;
	q: string = 'q1';
	sector: string = 'produccion';
	slug: string = 'Censo Industrias - MAB 2020'
}



/**************************/
/**   CENSO INDUSTRIAS  **/
/************************/
export class CensoIndustrias {
		_id: string;
		compPrefix:  string = 'CENSO';
		compName:    string = 'CEN';
		compNum:     string = '00000';

		action:      string = 'censo';
		sector:      string = 'produccion';

		fecomp_tsa:  number;
		fecomp_txa:  string;

		empresa:  Empresa;

		responsable:  Responsable;

		estado: EstadoCenso;

		censo: CensoData;


};

