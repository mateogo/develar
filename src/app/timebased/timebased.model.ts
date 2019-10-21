import { devutils } from '../develar-commons/utils';


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


export class SerialNocturnidad {
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
}

export class Requirente {
		id:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string; 
};

/************************/
/**   ROL NOCTURNIDAD **/
/**********************/
export class RolNocturnidad {
		_id: string;
		compPrefix:  string = 'ROL';
		compName:    string = 'R/Nocturnidad';
		compNum:     string = '00000';

		action:      string = 'rolnocturnidad';
		sector:      string = 'dginspeccion';

		idPerson:    string;
		requeridox?:  Requirente;

		fecomp_tsa:  number;
		fecomp_txa:  string;

		ferol_tsa:  number;
		ferol_txa:  string;
		vigencia:   string = '24'; //[noche| semana]
		
		slug:        string = 'Actividad regular';
		description: string;
		agentes: RolNocturnidadItem[];

		estado:      string = 'activo';
		avance:      string = 'emitido';
		ts_alta:     number;
		ts_umodif:      number;
};

export class RolNocturnidadItem {
		_id: string;
		idPerson:    string;
		personDni:      string;
		personName:      string;
		personApellido:      string;
}

export interface UpdateRolEvent {
  action: string;
  type: string;
  token: RolNocturnidad;
  selected?: boolean;
  items?: Array<RolNocturnidad>;
};

export class RolNocturnidadTableData {
  	_id: string = "";
		compName:    string = 'R/Nocturnidad';
		compNum:     string = '00000';
		idPerson:    string;
		fecomp_txa:  string;

		ferol_txa:  string;
		
		action:      string = 'nocturnidad';
		slug:        string;
		description: string;
		estado:      string = 'activo';
		avance:      string = 'emitido';

  	editflds = [0,0,0,0,0,0,0,0]

  constructor(data: any){
    this._id =         data._id;
    this.compName =    data.compName;
    this.compNum =     data.compNum;
    this.idPerson =    data.idPerson;
    this.fecomp_txa =  data.fecomp_txa;
    this.ferol_txa =   data.ferol_txa;
    this.action =      data.action;
    this.slug =        data.slug;
    this.description = data.description;
    this.estado =      data.estado;
    this.avance =      data.avance;
  }  
}

