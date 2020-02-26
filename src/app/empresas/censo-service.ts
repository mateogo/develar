import { CensoIndustrias, Empresa } from './censo.model';
import { Serial }          from '../develar-commons/develar-entities';
import { Person }      from '../entities/person/person';


export class CensoIndustriasService {
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

	static empresaFromPerson(p:Person): Empresa{
		let empresa = new Empresa();
		empresa.empresaId = p._id;
		empresa.slug = p.displayName;
		empresa.tdoc = p.tdoc;
		empresa.ndoc = p.ndoc;
		return empresa;

	}


	static censoIndustriasSerial(){
		let serial = new Serial();
		let type =   'censo';
		let name =   'censoindustrias';
		let sector = 'produccion';

		serial.type = type; 
		serial.name = name; 
		serial.tserial = 'censo';
		serial.sector = sector; // dginspeccion
		serial.tdoc = 'CENSO';
		serial.letra = 'X';
		serial.anio = 0;
		serial.mes = 0;
		serial.dia = 0;
		serial.estado = 'activo';
		serial.punto = 0;
		serial.pnumero = 10000;
		serial.offset = 0;
		serial.slug = 'Censo Industrias MAB - 2020';
		serial.compPrefix = 'CEN';
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

	static initNewCensoIndustrias(action, sector, person?: Person, serial?: Serial, slug?): CensoIndustrias{
		let x = new CensoIndustrias();
		return x;
	}

	static cloneCensoIndustrias(base: CensoIndustrias): CensoIndustrias{
		let x = new CensoIndustrias();
		Object.assign(x, base);
		return x;
	}


}


const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];

const actionOptList: Array<any> = [
        {val: 'censoindustrias',    type:'Emisión Rol Nocturnidad', label: 'Rol Nocturnidad' },
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

const optionsLists = {
	 default: default_option_list,
   actions: actionOptList,
   comprobantes: comprobantesOptList,
   tableactions: tableActions,
   estado: estadosOptList,
   avance: avanceOptList,
   sectores: sectorOptList,
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

