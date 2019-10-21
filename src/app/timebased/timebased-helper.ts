import { RolNocturnidad, RolNocturnidadItem, Requirente, RolNocturnidadTableData, Serial }      from './timebased.model';
import { Person }      from '../entities/person/person';
import { AsistenciaHelper } from '../dsocial/asistencia/asistencia.model';


const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];

const actionOptList: Array<any> = [
        {val: 'rolnocturnidad',    type:'Emisión Rol Nocturnidad', label: 'Rol Nocturnidad' },
        {val: 'no_definido', type:'Sin selección',  label: 'Sin selección' },
];

const estadosOptList = [
      {val: 'no_definido',    label: 'Sin selección',  slug:'Seleccione opción' },
      {val: 'activo',      label: 'Activa',      slug:'Activa' },
      {val: 'cumplido',    label: 'Cumplida',    slug:'Cumplida' },
      {val: 'suspendido',  label: 'Suspendida',  slug:'Suspendida' },
      {val: 'baja',        label: 'Baja',        slug:'Baja' },
]

const avanceOptList = [
      {val: 'no_definido',  label: 'Sin selección',  slug:'Sin selección' },
      {val: 'emitido',      label: 'Emitida',       slug:'Emitida' },
      {val: 'cumplido',     label: 'Cumplido',      slug:'Cumplido' },
]

const comprobantesOptList: Array<any> = [
        {val: 'sasistencia',   type:'S/Asistencia',    label: 'S/Asistencia' },
        {val: 'valimentos',    type:'V/Alimentos',     label: 'V/Alimentos' },
        {val: 'vmateriales',   type:'V/Materiales',   label: 'V/Materiales' },
        {val: 'ssubsidios',    type:'S/Subsidio',   label: 'S/Subsidio' },
];

const tableActions = [
      {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'editone',      label: 'Editar registro',    slug:'editone' },
      {val: 'autorizar',      label: 'Autorizar solicitud',    slug:'Autorizar solicitud' },
]


const sectorOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'dginspeccion', label: 'Dirección General de Inspección',    slug:'Inspección' },
]


const vigenciaOptList = [
      {val: '24',  label: 'Una noche',   slug:'Una noche' },
      {val: '48',  label: 'Dos noches',  slug:'Una noche' },
      {val: '72',  label: 'Tres noches', slug:'Una noche' },
]


const optionsLists = {
	 default: default_option_list,
   actions: actionOptList,
   comprobantes: comprobantesOptList,
   tableactions: tableActions,
   estado: estadosOptList,
   avance: avanceOptList,
   sectores: sectorOptList,
   vigencia: vigenciaOptList,
   ciudades: AsistenciaHelper.getOptionlist('ciudades')
}


function getLabel(list, val){
		let t = list.find(item => item.val === val)
		return t ? t.label : val;
}

function getPrefixedLabel(list, prefix, val){
		let label = getLabel(list, val);
		if(label) {
			label = prefix ? prefix + ': ' + label : ' ' + label
		}
		return label;
}


export class TimebasedHelper {
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


	static rolnocturnidadSerial(){
		let serial = new Serial();
		let type =   'rol';
		let name =   'rolnocturnidad';
		let sector = 'dginspeccion';

		serial.type = type; // rol
		serial.name = name; // rolnocturnidad
		serial.tserial = 'rol';
		serial.sector = sector; // dginspeccion
		serial.tdoc = 'despacho';
		serial.letra = 'X';
		serial.anio = 0;
		serial.mes = 0;
		serial.dia = 0;
		serial.estado = 'activo';
		serial.punto = 0;
		serial.pnumero = 10000;
		serial.offset = 0;
		serial.slug = 'Emisión de Rol de Nocturnidad';
		serial.compPrefix = 'ROL';
		serial.compName = 'R/Nocturnidad';
		serial.showAnio = false;
		serial.resetDay = false;
		serial.fe_ult = 0;

		return serial;
	}

	static buildRequirente(person: Person){
		return  {
			id:   person._id ,
			slug: person.displayName ,
			tdoc: person.tdoc ,
			ndoc: person.ndoc 
		}
	}

	static buildRolesDataSource(source_list: Array<RolNocturnidad>): RolNocturnidadTableData[]{
    let list: Array<RolNocturnidadTableData>;

    list = source_list.map(item => new RolNocturnidadTableData(item) );
    return list;
  }

	static initNewRolNocturnidad(action, sector, person?: Person, serial?: Serial, slug?): RolNocturnidad{
		let x = new RolNocturnidad();
		if(person && person.integrantes && person.integrantes.length){
			x.agentes = person.integrantes.map(integrante =>({
													_id: null,
													idPerson: integrante.personId,
													personDni: integrante.ndoc,
													personName: integrante.nombre,
													personApellido: integrante.apellido }) as RolNocturnidadItem) 
		}
		return x;
	}

	static cloneRolNocturnidad(base: RolNocturnidad): RolNocturnidad{
		let x = new RolNocturnidad();
		Object.assign(x, base);
		x.agentes = base.agentes;
		delete x.compNum;
		delete x._id;
		delete x.ferol_txa;

		return x;
	}


  static buildRolNocturnidadItemFromPerson(p: Person): RolNocturnidadItem{
    let ag = new RolNocturnidadItem();
    ag.personName = p.nombre;
    ag.personApellido = p.apellido;
    ag.personDni = p.ndoc;
    ag.idPerson = p._id;
    return ag;
  }



}
