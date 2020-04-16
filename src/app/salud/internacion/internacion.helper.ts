import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../salud.model';
import { User }     from '../../entities/user/user';

import { Person, Address }     from '../../entities/person/person';
import { LocacionHospitalaria, Servicio, Recurso} from '../../entities/locaciones/locacion.model';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
					Internacion, SolInternacionBrowse, SolInternacionTable, MasterAllocation,
          MotivoInternacion, InternacionSpec } from './internacion.model';

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

  static getCapacidadFromServicio(servicio: string): string{
    return fetchCapacidadFromSevice(servicio)
  }

  static capacidadDisponibleToPrint(servicios: Servicio[]): string{
    let memo = '';
    if(servicios && servicios.length){
      memo = servicios.reduce((memo, token)=> {

        return memo + ' | ' + token.srvcode + ': ' + token.srvQDisp + ' ';

      }, memo);
    }

    return memo;
  }

  static filterMasterAllocationList(query, list: MasterAllocation[]): MasterAllocation[]{
    return filterMasterAllocation(query, list);
  }

  static buildSerialDocumProvisorio(){
    return buildSerialForDocumProvorio()
  }

  static atendidoPor(user: User, spec: any): Atendido{
    return atendidoPor(user, spec);
  }

  static buildTransitionsToDisplay(transitions: Transito[]): TransitoDisplay[]{

    return buildTransitosToPrint(transitions);

  }
  static buildFilteredRecursosList(servicio: string, recursos: Recurso[]):Recurso[]{
    let filterList = []
    if(recursos && recursos.length){
      filterList = recursos.filter(rec => rec.rservicio === servicio)
    }
    return filterList;
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

  static buildNewInternacion(user: User, person: Person, spec: InternacionSpec, triage?: MotivoInternacion){

  	let solinternacion = new SolicitudInternacion()
  	solinternacion = initCoreData(solinternacion, spec);
  	solinternacion.requeridox = buildRequirente(person);
  	solinternacion.atendidox = atendidoPor(user, spec);

    triage = triage ? triage : new MotivoInternacion(spec);

    console.log('triage [%s] [%s]', spec.servicio, triage.servicio)
    
    solinternacion.triage = triage;


  	return solinternacion;
  }

  static getTargetFromServicio(servicio: string): string{
    let target = 'intermedios'; // valor default

    if(servicio === 'UTI' || servicio === 'UTE' || servicio === 'UCO'){
      target = 'intensivos'

    } else if(servicio === 'CONSULEXT' || servicio === 'GUARDIA' ){
      target = 'guardia'

    } else if(servicio === 'PEDIATRICA' ){
      target = 'pediatrica'

    } else if(servicio === 'AISLAMIENTO' ){
      target = 'aislamiento'
    }

    return target;
  }

	static asistenciaSerial(){
		let sector = 'internacion';
		let type = 'internacion';
		let name = 'solicitud';
		return buildSerialAsistencia(type, name, sector);
	}



}



function filterMasterAllocation(query, inputList): MasterAllocation[]{
  let target_capacity = query && query.capacidad;
  if(!target_capacity) return inputList;

  if(!(inputList && inputList.length)) return [];


  let target = inputList.filter(token =>{
    let disponible = token.disponible;
    let buscado = disponible[target_capacity];
    if(buscado){
      if(buscado.capacidad && (buscado.ocupado < buscado.capacidad) ) return true;
    }
    return false;
  });

  return target;
}


function fetchCapacidadFromSevice(servicio: string): string{
  if(!servicio) return null
  let record = serviciosOptList.find(t => t.val === servicio);
  if(record) return record.target;
  return null;
}

function buildTransitosToPrint(transitions: Transito[]): TransitoDisplay[]{
  let transitos: TransitoDisplay[] = [];

  if(!transitions&& transitions.length) return transitos;

  transitions.forEach(transito => {
    let token = new TransitoDisplay();
    token.estado = InternacionHelper.getOptionLabel('estadosTransitos', transito.estado);
    token.fecha = transito.fe_cumplido ? transito.fe_cumplido : transito.fe_prog;
    token.slug =  transito.slug;
    token.transitType = InternacionHelper.getOptionLabel('tiposTransitos', transito.transitType);
    token.target =  transito.target;

    let fecha = new Date(transito.fe_ts);
    token.fecha_audit = fecha ? fecha.toString(): '';

    transitos.push(token);
  });


  return transitos;
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

function buildSerialForDocumProvorio(){
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

class TransitoDisplay {

  fecha: string;
  transitType: string;
  estado: string;
  slug:  string;
  target: Internacion;
  fecha_audit: string;

}



/****************
  OptionLists  /
**************/

const actionsOptList: Array<any> = [
        {val: 'no_definido', isRemitible: false,  key:'',           type:'Sin selección',  label: 'Sin selección' },
        {val: 'internacion', isRemitible: false,  key:'modalidad',  type:'internacion',       label: 'Internación' },
];

const sectoresOptList = [
      {val:'com',          serial:'salud',       label: 'COM',                 style: {'background-color': "#f2cded"}},
      {val:'coordinacion', serial:'salud',       label: 'Coordinación médica', style: {'background-color': "#f2cded"}},
      {val:'same',         serial:'salud',       label: 'SAME',                style: {'background-color': "#f2aded"}},
      {val:'direccion',    serial:'salud',       label: 'Dirección Médica' ,   style: {'background-color': "#f2dded"}},
      {val:'hospital',     serial:'salud',       label: 'Hospital',            style: {'background-color': "#f2dded"}},
  ];

const afeccionOptList: Array<any> = [
    {val: 'COVID',        ord: '1.1', label: 'COVID'      },
    {val: 'CIRUJIA',      ord: '1.2', label: 'CIRUJÍA'    },
    {val: 'CLINICA',      ord: '1.2', label: 'CLÍNICA'    },
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
    {val: 'PEDIATRICA',    ord: '1.5', label: 'INT-PEDIÁTRICA' },
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
    {val: 'INTERNACION',   target: 'intermedios',          ord: '2.1', label: 'INT-GENERAL'  },
    {val: 'PEDIATRICA',    target: 'pediatrica',           ord: '3.1', label: 'INT-PEDIÁTRICA' },
    {val: 'AISLAMIENTO',   target: 'aislamiento',          ord: '4.1', label: 'AISLAMIENTO'  },
    {val: 'CONSULEXT',     target: 'ambulatorios',         ord: '5.1', label: 'CONS-EXT'     },
    {val: 'GUARDIA',       target: 'ambulatorios',         ord: '5.2', label: 'GUARDIA'      },
];

const capacidadesOptList: Array<any> = [
    {val: 'intensivos',    label: 'CUIDADOS INTENSIVOS'     },
    {val: 'intermedios',   label: 'CUIDADOS INTERMEDIOS'    },
    {val: 'pediatrica',    label: 'ATENCIÓN PEDIÁTRICA'     },
    {val: 'aislamiento',   label: 'AISLAMIENTO PREVENTIVO'  },
    {val: 'ambulatorios',  label: 'SERVICIO AMBULATORIO'    },
];

const especialidadesOptList: Array<any> = [
    {val: 'clinica',           ord: '1.1', label: 'CLÍNICA'     },
    {val: 'cirujia',           ord: '1.2', label: 'CIRUJÍA'     },
    {val: 'ginecoobs',         ord: '1.3', label: 'GINECO-OBST' },
    {val: 'guardia',           ord: '1.4', label: 'GUARDIA'     },
    {val: 'pediatria',         ord: '2.1', label: 'PEDIATRÍA'   },
];

// transitos
// programado / enejecucion / cumplido / finalizado/ baja
const estadosTransitosOptList: Array<any> = [
    {val: 'programado',      ord: '1.1', label: 'Programado'     },
    {val: 'enejecucion',     ord: '1.2', label: 'En ejecución'     },
    {val: 'cumplido',        ord: '1.3', label: 'Cumplido'     },
    {val: 'finalizado',      ord: '1.4', label: 'Finalizado'     },
    {val: 'baja',            ord: '1.5', label: 'baja'     },
];

// las variantes que puede adoptar solinternacion.internacion.estado, no siendo 'servicio'
const estadosPeriferiaOptList: Array<any> = [ 
    {val: 'transito',     ord: '1.1', label: 'Tránsito'    },
    {val: 'admision',     ord: '1.2', label: 'Admisión'    },
    {val: 'traslado',     ord: '1.3', label: 'Traslado'    },
    {val: 'externacion',  ord: '1.4', label: 'Externación' },
    {val: 'salida',       ord: '1.5', label: 'Salida'      },
];

const estadosSolicitudOptList: Array<any> = [
    {val: 'activo',      ord: '1.1', label: 'activo'     },
    {val: 'cumplido',    ord: '1.1', label: 'cumplido'     },
    {val: 'baja',        ord: '1.1', label: 'baja'     },
];

const avanceSolicitudOptList: Array<any> = [
    {val: 'esperatraslado',    ord: '1.1', label: 'esperatraslado'     },
    {val: 'esperacama',        ord: '1.1', label: 'esperacama'     },
    {val: 'esperarespirador',  ord: '1.1', label: 'esperarespirador'     },
    {val: 'entratamiento',     ord: '1.1', label: 'entratamiento'     },
    {val: 'encirujia',         ord: '1.1', label: 'encirujia'     },
    {val: 'enrecuperación',    ord: '1.1', label: 'enrecuperación'     },
    {val: 'dealta',            ord: '1.1', label: 'dealta'     },
    {val: 'fallecido',         ord: '1.1', label: 'fallecido'     },
    {val: 'eninternacion',     ord: '1.1', label: 'eninternacion'     },
    {val: 'baja',              ord: '1.1', label: 'baja'     },
];

const queueOptList: Array<any> = [
    {val: 'pool',       ord: '1.1', label: 'pool'     },
    {val: 'transito',   ord: '1.1', label: 'transito' },
    {val: 'alocado',    ord: '1.1', label: 'alocado'  },
    //{val: 'traslado',   ord: '1.1', label: 'traslado' },
    {val: 'baja',       ord: '1.1', label: 'baja'     },
]


//'pool:internacion', 'internacion:internacion', 'internacion:pool'
const tiposTransitosOptList: Array<any> = [
    {val: 'pool:transito',           label: 'Locación de internación asignada',  actionLabel: 'Alocar y disponer traslado'},
    {val: 'pool:admision',           label: 'Locación de internación asignada',  actionLabel: 'Alta: ingresa en Admisión'},
    {val: 'transito:admision',       label: 'Internación efectivizada',          actionLabel: 'Traslado OK. Alta en Admisión'},
    {val: 'transito:servicio',       label: 'Internación efectivizada',          actionLabel: 'Traslado OK. Alta en Servicio'},
    {val: 'servicio:traslado',       label: 'Traslado intra-locación',           actionLabel: 'Traslado intra-locación INICIA'   },
    {val: 'traslado:servicio',       label: 'Traslado intra-locación',           actionLabel: 'Traslado intra-locación CUMPLIDO' },
    {val: 'servicio:externacion',    label: 'Externación para salida/transito',  actionLabel: 'Externación (salida o tránsito)'  },
    {val: 'externacion:transito',    label: 'Externación a transito',            actionLabel: 'Externación pasa a tránsito)'  },
    {val: 'externacion:salida',      label: 'Externación a salida',              actionLabel: 'Externación pasa a salida  )'  },
    {val: 'externacion:pool',        label: 'Externación a pool',                actionLabel: 'Externación: Espera re-asignación de locación' },
    {val: 'transito:pool',           label: 'Espera asignación de locación',     actionLabel: 'Tránsito: Espera re-asignación de locación' },
];


const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];


const optionsLists = {
   default: default_option_list,
   actions: actionsOptList,
   sectores: sectoresOptList,
   afecciones: afeccionOptList,
   target: targetInternacionOptList,
   areas: areasOptList,
   servicios: serviciosOptList,
   epecialidades: especialidadesOptList,
   tiposTransitos: tiposTransitosOptList,
   estadosTransitos: estadosTransitosOptList,
   capacidades: capacidadesOptList,
   estadosPeriferia: estadosPeriferiaOptList,

}

