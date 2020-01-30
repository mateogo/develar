import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../../develar-commons/develar-entities';
import { Person }   from '../../entities/person/person';


export class TargetEvent {
  pculturalId: string;
  slug: string;

  
}

export class BudgetItems {
  productoId: string;
  productSlug: string;

  slug: string;
  moneda:      string;
  ume:         string;
  freq:        number;
  qty:         number;
  importe:     number;

  
}

/*************************/
/** Presupuesto Budget  */
/***********************/
export class Budget {
		_id:         string; 
		compPrefix:  string = 'PRE';
		compName:    string = 'S/Presupuesto';
		compNum:     string = '00000';

    type:        string;
    stype:       string;
    sector:      string;
    programa:    string;
    sede:        string = 'cck';
    locacion:    string;

    monto:        number;
    monto_items:  number;

    items:       Array<BudgetItems>;

    moneda:      string = 'ARS';
    fume:        string = 'unidad';
    freq:        number =  1;
    ume:         string = 'unidad';
    qty:         number =  1;
    importe:     number =  0;


		slug:        string;
		description: string;

    target:      TargetEvent;


		estado:      string = 'activo';
		avance:      string = 'emitido';
		aprobado:    string = 'pendiente';

    fecomp:      string; 
    fecomp_ts:   number; 

		fe_req:      string; 
		fe_req_ts:   number; 
		
		observacion: string;

};

export class BudgetTable {
    _id:          string; 
    compPrefix:  string;
    compName:    string;
    compNum:     string;

    programa:    string;
    type:        string;
    stype:       string;

    monto:        number;

    moneda:      string;
    ume:         string;
    freq:        number;
    qty:         number;
    importe:     number;

    sector:      string;

    slug:        string;
    description: string;


    sede:        string;
    locacion:    string;

    estado:      string;
    avance:      string;
    aprobado:    string;


    fe_req:      string; 
    fe_req_ts:   number; 
    

}

export class BudgetBrowse {
    searchAction: string;
    compPrefix:  string = 'PRE';
    compName:    string = 'S/Presupuesto';

    compNum_d:    string;
    compNum_h:    string;



    fe_req_d:     string;
    fe_req_h:     string;
    fe_req_ts_d:  number;
    fe_req_ts_h:  number;

    programa:    string;
    type:        string;
    stype:       string;
    sector:      string;

    sede:        string;
    locacion:    string;

    estado:      string;
    avance:      string;
    aprobado:    string;

}




export class BudgetHelper {



}
