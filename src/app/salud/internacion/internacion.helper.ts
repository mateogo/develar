 import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../salud.model';
import { User }     from '../../entities/user/user';

import { Person, Address }     from '../../entities/person/person';
import { LocacionHospitalaria} from '../../entities/locaciones/locacion.model';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
					Internacion, SolInternacionBrowse, SolInternacionTable, 
          MotivoInternacion, InternacionSpec } from './internacion.model';

import { sectores } from '../salud.model';


export class  InternacionHelper {

  static getOptionlist(type){
    return optionsLists[type] || optionsLists['default'];
  }


  static getOptionLabelFromList(list, val){
    if(!val) return 'no-definido';
    return getLabel(list, val);
  }

  static getOptionLabel(type, val){
    if(!val) return 'no-definido';
    if(!type) return val;
    return getLabel(this.getOptionlist(type), val);
  }

  static getPrefixedOptionLabel(type, prefix, val){
    if(!val) return 'no-definido';
    if(!type) return prefix + '::' + val;
    return getPrefixedLabel(this.getOptionlist(type), prefix, val);
  }

  static buildDataTable(list: SolicitudInternacion[]): SolInternacionTable[]{

    return list.map(token => {
      let td = new SolInternacionTable();

      return td;
    })



  }

  /******************************************/
  /**** CREACIÓN DE S/INTERVENCIÓN *********/
	/****************************************/

  static buildNewInternacion(user: User, person: Person, spec: InternacionSpec){

  	let solinternacion = new SolicitudInternacion()
  	solinternacion = initCoreData(solinternacion, spec);
  	solinternacion.requeridox = buildRequirente(person);
  	solinternacion.atendidox = atendidoPor(user, spec);
    solinternacion.triage = new MotivoInternacion();
  	return solinternacion;
  }

	static asistenciaSerial(){
		let sector = 'internacion';
		let type = 'internacion';
		let name = 'solicitud';
		return buildSerialAsistencia(type, name, sector);
	}



}


function buildSerialAsistencia(type, name, sector){
	let serial = new Serial();
	serial.type = type; // internacion
	serial.name = name; // solinternacion
	serial.tserial = 'solinternacion';
	serial.sector = sector; //  alimentos; nutricion; etc;
	serial.tdoc = 'solicitud';
	serial.letra = 'X';
	serial.anio = 0;
	serial.mes = 0;
	serial.dia = 0;
	serial.estado = 'activo';
	serial.punto = 0;
	serial.pnumero = 1;
	serial.offset = 400000;
	serial.slug = 'Solicitudes de Internacion';
	serial.compPrefix = 'SOL';
	serial.compName = 'S/Internacion';
	serial.showAnio = false;
	serial.resetDay = false;
	serial.fe_ult = 0;

	return serial;


}
function atendidoPor(user: User, spec: InternacionSpec): Atendido{
  if(! user) return null;
  return {
      id: user.id,
      slug: user.username,
      sector: spec.sector
  }
}


function buildRequirente(person: Person): Requirente {
	let req:Requirente = {
		id:   person._id ,
		slug: person.displayName ,
		tdoc: person.tdoc ,
		ndoc: person.ndoc 
	}

	return req;
}


function initCoreData(internacion: SolicitudInternacion, spec){
	Object.assign(internacion, spec);
	return internacion;
}

function getLabel(list, val){
    let t = list.find(item => item.val === val)
    return t ? t.label : val;
}

function getOptListToken(list, val){
    let t = list.find(item => item.val === val)
    return t ? t : null;
}

function getPrefixedLabel(list, prefix, val){
    let label = getLabel(list, val);
    if(label) {
      label = prefix ? prefix + ': ' + label : ' ' + label
    }
    return label;
}





const daoConfig = {
  type: 'locacionhosp',
  backendURL: 'api/locacionhospitalaria',
  searchURL: 'api/locacionhospitalaria/search'
}




/****************
  OptionLists  /
**************/

const afeccionOptList: Array<any> = [
    {val: 'COVID',        ord: '1.1', label: 'COVID'      },
    {val: 'CIRUJIA',      ord: '1.2', label: 'CIRUJÍA'    },
    {val: 'EMERGENCIA',   ord: '1.3', label: 'EMERGENCIA' },
    {val: 'OTRO',         ord: '1.4', label: 'OTRO'       },
];

const targetInternacionOptList: Array<any> = [
    {val: 'UTI',           ord: '1.1', label: 'COVID'      },
    {val: 'INTERNACION',   ord: '1.2', label: 'INTERNACION'    },
    {val: 'GUARDIA',       ord: '1.3', label: 'GUARDIA' },
];

const areasOptList: Array<any> = [
    {val: 'UTI',           ord: '1.1', label: 'UTI'          },
    {val: 'UTE',           ord: '1.2', label: 'UTE'          },
    {val: 'UCO',           ord: '1.3', label: 'UCO'          },
    {val: 'INTERNACION',   ord: '1.4', label: 'INT-GENERAL'  },
    {val: 'AISLAMIENTO',   ord: '2.1', label: 'AISLAMIENTO'  },
    {val: 'CONSULEXT',     ord: '3.1', label: 'CONS-EXT'     },
    {val: 'GUARDIA',       ord: '3.2', label: 'GUARDIA'      },

    {val: 'TRANSITO',      ord: '4.1', label: 'TRANSITO'     },
    {val: 'TRASLADO',      ord: '4.2', label: 'TRASLADO'     },
    {val: 'ADMISION',      ord: '5.1', label: 'ADMISIÓN'     },
    {val: 'EXTERNACION',   ord: '5.2', label: 'EXTERNACIÓN'  },

];

const serviciosOptList: Array<any> = [
    {val: 'UTI',           target: 'intensivos',           ord: '1.1', label: 'UTI'          },
    {val: 'UTE',           target: 'intensivos',           ord: '1.2', label: 'UTE'          },
    {val: 'UCO',           target: 'intensivos',           ord: '1.3', label: 'UCO'          },
    {val: 'INTERNACION',   target: 'intermedios',          ord: '1.4', label: 'INT-GENERAL'  },
    {val: 'AISLAMIENTO',   target: 'aislamiento',          ord: '2.1', label: 'AISLAMIENTO'  },
    {val: 'CONSULEXT',     target: 'guardia',              ord: '3.1', label: 'CONS-EXT'     },
    {val: 'GUARDIA',       target: 'guardia',              ord: '3.2', label: 'GUARDIA'      },
];


const especialidadesOptList: Array<any> = [
    {val: 'clinica',           ord: '1.1', label: 'CLÍNICA'     },
    {val: 'cirujia',           ord: '1.2', label: 'CIRUJÍA'     },
    {val: 'ginecoobs',         ord: '1.3', label: 'GINECO-OBST' },
    {val: 'guardia',           ord: '1.4', label: 'GUARDIA'     },
    {val: 'pediatria',         ord: '2.1', label: 'PEDIATRÍA'   },
];

const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];


const optionsLists = {
   default: default_option_list,
   afeccion: afeccionOptList,
   target: targetInternacionOptList,
   areas: areasOptList,
   servicios: serviciosOptList,
   epecialidades: especialidadesOptList,
}

