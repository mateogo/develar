import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../../develar-commons/develar-entities';
import { Person }   from '../../entities/person/person';


export class TargetEvent {
  pculturalId: string;
  slug: string;

  
}


export class BudgetCost {
  e_currency:   string = 'ARS';
  e_cost:       number =  0;

  e_ARSCost:    number =  0;
  e_changeRate: number =  1.0;
  e_feRate:     string =  '';
  
}

export class BudgetItem {
  _id:         string; 
  productId:  string;
  productSlug: string;

  slug: string;

  currency:    string = "ARS";
  fume:        string = 'instancia';
  qume:        string = "unidad";
  freq:        number = 1;
  qty:         number = 1;
  importe:     number = 0;

  itemCost:    number = 0;
  itemARSCost: number = 0;
  changeRate:  number = 1.0;
  feRate:      string = '';
 
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

    currency:    string = "ARS";

    e_currency:   string = 'ARS';
    e_cost:       number =  0;

    e_ARSCost:    number =  0;
    e_changeRate: number =  1.0;
    e_feRate:     string = '';


    items:       Array<BudgetItem>;

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
    qume:        string;
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
