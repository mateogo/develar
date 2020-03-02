import { CensoIndustrias, CensoActividad, CensoBienes, Empresa } from './censo.model';
import { Serial }          from '../develar-commons/develar-entities';
import { Person }      from '../entities/person/person';
import { nomencladorList } from './nomenclador-data';

export interface UpdateListEvent {
  action: string;
  type:   string;
  items:  Array<CensoActividad|CensoBienes>;
};


export interface UpdateEvent {
  action:  string;
  token:   string;  
  payload: CensoActividad|CensoBienes;
};

function fetchAction(val, type){
	console.log('fetaction: [%s] [%s]', val, type)
	let isSeccion = 0, isTitulo = 0;
	if(type === 'seccion'){
		isSeccion = 1;
		isTitulo = 1;
	} else if(type === 'rubro'){
		isSeccion = 0;
		isTitulo = 1;
	} else if(type === 'codigo'){
		isSeccion = 0;
		isTitulo = 0;

	}
	return nomencladorList.find(t => t.val === val && t.isSeccion === isSeccion && t.isTitulo === isTitulo);

}


export class CensoIndustriasService {
	static getSectionOptList(){
		let list = nomencladorList.filter(t => t.isSeccion === 1);
		return list;

	}

	static getRubroOptList(seccion){
		let list = [];

		console.log('seccion [%s]', seccion)
		let token = nomencladorList.find(t => t.val === seccion);
		if(token){
			list = nomencladorList.filter(t => t.seccion === token.seccion  && t.isTitulo === 1  && t.isSeccion === 0);
			list = list || [];

		}

		return list;

	}

	static getCodigoOptList(rubro){
		console.log('rubro [%s]', rubro)
		let list = [];

		list = nomencladorList.filter(t => t.titulo === rubro  && t.isTitulo === 0  && t.isSeccion === 0);
		list = list || [];


		return list;

	}

	static getActionOptList(val, type){
		let list = [];
		let token = fetchAction(val, type);
		console.log('getActionOptList [%s] [%s] [%s]', val, type, token && token.val);

		if(type === 'seccion'){
			list = this.getSectionOptList();

		} else if(type === 'rubro'){
			list = this.getRubroOptList(val);

		} else if(type === 'codigo'){
			list = this.getCodigoOptList(val);

		}

		list = list || [];
		return list;

	}

	static getActividadOptionLabel(val, type){
		let label = "No encontrado";

		let token = fetchAction(val, type);

		if(token){
			if(type === 'seccion'){
				label = token['seccion'] + ':' + token['label'];

			} else if(type === 'rubro'){
				label = token['base'] + ':' + token['label'];

			} else if(type === 'codigo'){
				label = token['val'] + ':' + token['label'];

			}

		}

		return label;

	}

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
		serial.compName = 'CENSO/MAB';
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

const tipoActividadOptList = [
      {val: 'no_definido',    label: 'Sin selección',  slug:'Seleccione opción' },
      {val: 'principal',      label: 'Principal',      slug:'Principal' },
      {val: 'secundaria',     label: 'Secundaria',     slug:'Secundaria' },
      {val: 'investigacion',  label: 'Invertitación',  slug:'Invertitación' },
      {val: 'social',         label: 'Social',         slug:'Social' },
      {val: 'otra',           label: 'Otra',           slug:'Otra' },
]


const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];

const actionOptList: Array<any> = [
        {val: 'censoindustrias',    type:'Censo Industrias', label: 'Censo Industrias' },
        {val: 'no_definido', type:'Sin selección',  label: 'Sin selección' },
];

const estadosOptList = [
      {val: 'no_definido',    label: 'Sin selección',  slug:'Seleccione opción' },
      {val: 'activo',      label: 'Activo',      slug:'Activo' },
      {val: 'cerrado',     label: 'Cerrado',     slug:'Cerrado' },
      {val: 'suspendido',  label: 'Suspendido',  slug:'Suspendido' },
      {val: 'baja',        label: 'Baja',        slug:'Baja' },
]

const avanceOptList = [
      {val: 'no_definido',  label: 'Sin selección',   slug:'Sin selección' },
      {val: 'enproceso',     label: 'En proceso',     slug:'En proceso' },
      {val: 'completado',    label: 'Completado',     slug:'Completado' },
      {val: 'emitido',       label: 'Emitido',        slug:'Emitido' },
      {val: 'cancelado',     label: 'Cancelado',      slug:'Cancelado' },
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

	// type: string;
	// level: number; //porcentaje de la facturación o la inversión
	// origen: string;
	// disenio: string;
	// parancelaria: string ;
	// isExportable: boolean;
	// isImportada: boolean;
	// isInnovacion: boolean;
	// isSustituible: string;
	// sustitucionTxt: string;
	// innovacionTxt: string;

const bienesTypeOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'pventa',     label: 'Producto de Venta',    slug:'Producto de Venta' },
      {val: 'matprima',   label: 'Mat prima/Semielab',   slug:'Mat prima/Semielab' },
      {val: 'insumo',     label: 'Insumo ppal',          slug:'Insumo ppal' },
      {val: 'maquinaria', label: 'Maquinaria o BUso',    slug:'Maquinaria o BUso' },
      {val: 'licencia',   label: 'Licencia/Derecho',     slug:'Licencia/Derecho' },
      {val: 'tecnologia', label: 'Tecnología',           slug:'Tecnología' },
]

const origenOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'nacional',     label: 'Nacional',         slug:'Nacional' },
      {val: 'mercosur',     label: 'Mercosur',         slug:'Mercosur' },
      {val: 'america',      label: 'Región América',   slug:'Región América' },
      {val: 'usa',          label: 'USA',              slug:'USA' },
      {val: 'europa',       label: 'EU',               slug:'EU' },
      {val: 'china',        label: 'China',            slug:'China' },
      {val: 'japon',        label: 'Japón',            slug:'Japón' },
      {val: 'corea',        label: 'Corea del Sur',    slug:'Corea del Sur' },
      {val: 'vietnam',      label: 'Vietnam',          slug:'Vietnam' },
      {val: 'oriente',      label: 'Región Oriente',   slug:'Región Oriente' },
]

const posCadenaProductivaOptList = [
      {val: 'no_definido',   label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'primario',      label: 'Extracción; cultivo, criadero',         slug:'Extracción; cultivo, criadero' },
      {val: 'intermedio',    label: 'Ind Bienes intermadios',         slug:'Ind Bienes intermadios' },
      {val: 'insumos',       label: 'Ind Insumos indus/comerciales',   slug:'Ind Insumos indus/comerciales' },
      {val: 'mayorista',     label: 'Distribuidor mayorista',              slug:'Distribuidor mayorista' },
      {val: 'consmasivo',    label: 'Ind Bienes consumo masivo',               slug:'Ind Bienes consumo masivo' },
      {val: 'retail',        label: 'Comercio - Retail',            slug:'Comercio - Retail' },
      {val: 'transporte',    label: 'Transporte-logística',            slug:'Transporte-logística' },
      {val: 'servicios',     label: 'Servicios',    slug:'Servicios' },
      {val: 'investigacion', label: 'Investigación',         slug:'Investigación' },
      {val: 'educacion',     label: 'Educación',   slug:'Educación' },
]

const optionsLists = {
	 default: default_option_list,
   actions: actionOptList,
   comprobantes: comprobantesOptList,
   tableactions: tableActions,
   estado: estadosOptList,
   avance: avanceOptList,
   sectores: sectorOptList,
   actividad: tipoActividadOptList,
   tipoBienes: bienesTypeOptList,
   origenBienes: origenOptList,
   cadena: posCadenaProductivaOptList,
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

