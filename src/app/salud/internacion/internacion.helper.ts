import { devutils } from '../../develar-commons/utils';
import { Serial }   from '../salud.model';
import { User }     from '../../entities/user/user';

import { Person, Address }     from '../../entities/person/person';
import { LocacionHospitalaria} from '../../entities/locaciones/locacion.model';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec } from './internacion.model';

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
  	let requirente = buildRequirente(person);

  	let solinternacion = new SolicitudInternacion()
  	solinternacion = initCoreData(solinternacion, spec);
  	solinternacion.requeridox = buildRequirente(person);
  	solinternacion.atendidox = atendidoPor(user, spec);
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

const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];


const optionsLists = {
   default: default_option_list,
}

