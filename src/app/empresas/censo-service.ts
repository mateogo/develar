import { CensoIndustrias, CensoIndustriasTable, CensoActividad, CensoBienes, Empresa } from './censo.model';
import { Serial }          from '../develar-commons/develar-entities';
import { Person, DocumentData }      from '../entities/person/person';
import { nomencladorList } from './nomenclador-data';
import { CardGraph } from '../develar-commons/asset-helper';

export interface UpdateListEvent {
  action: string;
  type:   string;
  items:  Array<CensoActividad|CensoBienes|DocumentData|CardGraph>;
};


export interface TipoEmpresa {
  x:number;
  y:number;
  categoria:string;
  categoria_lbl: string;


  rubro:string;
  rubro_lbl: string;

  tope: number;


}

export interface UpdateEvent {
  action:  string;
  token:   string;  
  payload: CensoActividad|CensoBienes|DocumentData|CardGraph;
};

function fetchAction(val, type){
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

	static buildCensoTableData(list: CensoIndustrias[]):CensoIndustriasTable[]{
		return list.map(token => {
			let tableCell = new CensoIndustriasTable();
			tableCell._id = token._id;
			tableCell.compNum = token.compNum;
			tableCell.fecomp = token.fecomp_txa;
			tableCell.slug = token.censo.slug;
			tableCell.navance = this.getOptionLabel("avance", token.estado.navance)

			return tableCell;
		})
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

	static findRubroCategoria(rubro, categoria): TipoEmpresa{
		let list = categoriaEmpresasOptList;
		let catList: TipoEmpresa[] = list.find(t => t[0].categoria === categoria);
		let tipoEmpresa: TipoEmpresa;
		if(catList && catList.length){
			tipoEmpresa = catList.find(t => t.rubro === rubro);
		}
		return tipoEmpresa;
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
      {val: 'no_definido', label: 'Sin selección',  slug:'Seleccione opción' },
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
      {val: 'no_definido',  label: 'Seleccione opción',  slug: 'Seleccione opción' },
      {val: 'pventa',     label: 'Producto de Venta',    slug: 'Producto de Venta' },
      {val: 'matprima',   label: 'Mat prima/Semielab',   slug: 'Mat prima/Semielab' },
      {val: 'insumo',     label: 'Insumo ppal',          slug: 'Insumo ppal' },
      {val: 'maquinaria', label: 'Maquinaria o BUso',    slug: 'Maquinaria o BUso' },
      {val: 'licencia',   label: 'Licencia/Derecho',     slug: 'Licencia/Derecho' },
      {val: 'tecnologia', label: 'Tecnología',           slug: 'Tecnología' },
]

const origenOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'brown',        label: 'Partido Almte Brown',  slug: 'Partido Almte Brown' },
      {val: 'pba',          label: 'Pcia de Buenos Aires', slug: 'Pcia de Buenos Aires' },
      {val: 'nacional',     label: 'Nacional',         slug: 'Nacional' },
      {val: 'mercosur',     label: 'Mercosur',         slug: 'Mercosur' },
      {val: 'america',      label: 'Región América',   slug: 'Región América' },
      {val: 'usa',          label: 'USA',              slug: 'USA' },
      {val: 'europa',       label: 'EU',               slug: 'EU' },
      {val: 'china',        label: 'China',            slug: 'China' },
      {val: 'japon',        label: 'Japón',            slug: 'Japón' },
      {val: 'corea',        label: 'Corea del Sur',    slug: 'Corea del Sur' },
      {val: 'vietnam',      label: 'Vietnam',          slug: 'Vietnam' },
      {val: 'oriente',      label: 'Región Oriente',   slug: 'Región Oriente' },
]

const posCadenaProductivaOptList = [
      {val: 'no_definido',   label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'primario',      label: 'Extracción; cultivo, criadero',  slug:'Extracción; cultivo, criadero' },
      {val: 'intermedio',    label: 'Ind Bienes intermedios',         slug:'Ind Bienes intermedios' },
      {val: 'insumos',       label: 'Ind Insumos indus/comerciales',  slug:'Ind Insumos indus/comerciales' },
      {val: 'mayorista',     label: 'Distribuidor mayorista',         slug:'Distribuidor mayorista' },
      {val: 'consmasivo',    label: 'Ind Bienes consumo masivo',      slug:'Ind Bienes consumo masivo' },
      {val: 'retail',        label: 'Comercio - Retail',              slug:'Comercio - Retail' },
      {val: 'transporte',    label: 'Transporte-logística',           slug:'Transporte-logística' },
      {val: 'servicios',     label: 'Servicios',     slug:'Servicios' },
      {val: 'investigacion', label: 'Investigación', slug:'Investigación' },
      {val: 'educacion',     label: 'Educación',     slug:'Educación' },
]

/******** Categoría Empresa **********/
const categoriaEmpresasOptList = [
	[
		{x:0, y:0 , categoria: "micro",    rubro: "construccion", categoria_lbl: "Micro",       rubro_lbl: "Construcción", tope:  15230000 },
		{x:0, y:1 , categoria: "micro",    rubro: "servicios",    categoria_lbl: "Micro",       rubro_lbl: "Servicios",    tope:   8500000 },
		{x:0, y:2 , categoria: "micro",    rubro: "comercio",     categoria_lbl: "Micro",       rubro_lbl: "Comercio",     tope:  29740000 },
		{x:0, y:3 , categoria: "micro",    rubro: "industria",    categoria_lbl: "Micro",       rubro_lbl: "Industria",    tope:  26450000 },
		{x:0, y:4 , categoria: "micro",    rubro: "mineria",      categoria_lbl: "Micro",       rubro_lbl: "Minería",      tope:  26540000 },
		{x:0, y:5 , categoria: "micro",    rubro: "agropecuario", categoria_lbl: "Micro",       rubro_lbl: "Agropecuario", tope:  12890000 },
	],
	[
		{x:1, y:0 , categoria: "pequenia", rubro: "construccion", categoria_lbl: "Pequeña", rubro_lbl: "Construcción", tope:  90310000 },
		{x:1, y:1 , categoria: "pequenia", rubro: "servicios",    categoria_lbl: "Pequeña", rubro_lbl: "Servicios",    tope:   5095000 },
		{x:1, y:2 , categoria: "pequenia", rubro: "comercio",     categoria_lbl: "Pequeña", rubro_lbl: "Comercio",     tope: 178860000 },
		{x:1, y:3 , categoria: "pequenia", rubro: "industria",    categoria_lbl: "Pequeña", rubro_lbl: "Industria",    tope: 190410000 },
		{x:1, y:4 , categoria: "pequenia", rubro: "mineria",      categoria_lbl: "Pequeña", rubro_lbl: "Minería",      tope: 190410000 },
		{x:1, y:5 , categoria: "pequenia", rubro: "agropecuario", categoria_lbl: "Pequeña", rubro_lbl: "Agropecuario", tope:  48480000 },
	],
	[
		{x:2, y:0 , categoria: "mediana1", rubro: "construccion", categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Construcción", tope:  503880000 },
		{x:2, y:1 , categoria: "mediana1", rubro: "servicios",    categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Servicios",    tope:  425170000 },
		{x:2, y:2 , categoria: "mediana1", rubro: "comercio",     categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Comercio",     tope: 1502750000 },
		{x:2, y:3 , categoria: "mediana1", rubro: "industria",    categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Industria",    tope: 1190330000 },
		{x:2, y:4 , categoria: "mediana1", rubro: "mineria",      categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Minería",      tope: 1190330000 },
		{x:2, y:5 , categoria: "mediana1", rubro: "agropecuario", categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Agropecuario", tope: 345343000 },
	],
	[
		{x:3, y:0 , categoria: "mediana2", rubro: "construccion", categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Construcción", tope:  755740000 },
		{x:3, y:1 , categoria: "mediana2", rubro: "servicios",    categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Servicios",    tope:  607210000 },
		{x:3, y:2 , categoria: "mediana2", rubro: "comercio",     categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Comercio",     tope: 2146810000 },
		{x:3, y:3 , categoria: "mediana2", rubro: "industria",    categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Industria",    tope: 1739590000 },
		{x:3, y:4 , categoria: "mediana2", rubro: "mineria",      categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Minería",      tope: 1739590000 },
		{x:3, y:5 , categoria: "mediana2", rubro: "agropecuario", categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Agropecuario", tope:  547890000 },
	]
];

/******** Datos Empresa **********/
const contactOptList: Array<any> = [
    {val: 'no_definido', label: 'Seleccione opción',   slug:'Seleccione opción' },
    {val: 'APODERADO',  label: 'Apoderado',            slug:'Apoderado' },
    {val: 'RTEC',       label: 'Responsable Técnico',  slug:'Responsable Técnico' },
    {val: 'ADMIN',      label: 'Administración',       slug:'Administración' },
    {val: 'RRHH',       label: 'RRHH',                 slug:'RRHH' },
    {val: 'COMERCIAL',  label: 'COMERCIAL',            slug:'COMERCIAL' },
    {val: 'RJURIDICO',  label: 'Responsable Jurídico', slug:'Responsable Jurídico' },
    {val: 'CENSO',      label: 'Encargado CENSO',      slug:'Encargado CENSO' },
];

const contactTypeOptList: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',slug:'Seleccione opción' },
		{val: 'CEL',   label: 'CEL',    slug:'CEL' },
		{val: 'MAIL',  label: 'MAIL',   slug:'MAIL' },
		{val: 'TEL',   label: 'TEL',    slug:'TEL' },
		{val: 'WEB',   label: 'WEB',    slug:'WEB' },
];

const addressTypeOptList: Array<any> = [
		{val: 'no_definido', 	  label: 'Seleccione opción',slug:'Seleccione opción' },
		{val: 'fabrica',        label: 'Fabrica',          slug:'Sede fábrica' },
		{val: 'deposito',       label: 'Depósito',         slug:'Depósito' },
		{val: 'admin',          label: 'Administración',   slug:'Sede administración' },
		{val: 'fiscal', 	      label: 'Fiscal',           slug:'Domicilio fiscal' },
		{val: 'comercial', 	    label: 'Comercial',        slug:'Domicilio comercial' },
		{val: 'entrega', 	      label: 'Lugar entrega',    slug:'Lugar de entrega' },
		{val: 'sucursal', 	    label: 'Sucursal',         slug:'Sucursal' },
		{val: 'pagos',          label: 'Pagos',            slug:'Sede pagos' },
		{val: 'rrhh',           label: 'Recursos humanos', slug:'Sede recursos humanos' },
		{val: 'biblioteca',     label: 'Biblioteca',       slug:'Sede Biblioteca' },
		{val: 'dependencia',    label: 'Dependencia',      slug:'Otras dependencias' },
		{val: 'principal',      label: 'Principal',        slug:'Locación principal' },
		{val: 'particular',     label: 'Particular',       slug:'Domicilio particular' },
    {val: 'dni',            label: 'DNI',              slug:'Domicilio en el DNI' },
];

const profesionesOptList: Array<any> = [
       {val: 'no_definido',     label: 'Seleccione opción',  slug:'Seleccione opción' },
        {val: 'profesional',     label: 'Profesional',    slug:'Profesional' },
        {val: 'empresarix',      label: 'Empresario/a',   slug:'Empresario/a' },
        {val: 'microemprendim',  label: 'Microemprendedor/a',  slug:'Microemprendedor/a' },
        {val: 'empleadx',        label: 'Empleado/a',     slug:'Empleado/a' },
        {val: 'tecnicx',         label: 'Tecnico/a',      slug:'Tecnico/a' },
        {val: 'investigadxr',    label: 'Investigador/a', slug:'Investigador/a' },
        {val: 'seguridad',       label: 'Seguridad',      slug:'Seguridad' },
        {val: 'operarix',        label: 'Operario/a',     slug:'Operario/a' },
        {val: 'estudiante',      label: 'Estudiante',     slug:'Estudiante' },
        {val: 'amadecasa',       label: 'AmaDeCasa',      slug:'AmaDeCasa' },
        {val: 'jubiladx',        label: 'Jubilado/a',     slug:'Jubilado/a' },
        {val: 'pensionadx',      label: 'Pensionado/a',   slug:'Pensionado/a' },
        {val: 'docente',         label: 'Docente',        slug:'Docente' },
        {val: 'reciclador',      label: 'Reciclador urbano',  slug:'Reciclador urbano' },
        {val: 'desocupax',       label: 'Desocupado/a',   slug:'Desocupado/a' },
        {val: 'otro',            label: 'Otra ocupación', slug:'Otra ocupación' },
];

const tipoDocumentosOptList: Array<any> = [
			{val: 'no_definido',   label: 'Seleccione opción',  slug:'Seleccione opción' },
			{val: 'certificacion', label: 'Certificación',  slug:'Certificación' },
			{val: 'patente',       label: 'Patente',        slug:'Patente' },
			{val: 'licencia',      label: 'Licencia',       slug:'Licencia' },
			{val: 'marca',         label: 'Marca',          slug:'Marca' },
			{val: 'excencion',     label: 'Exención',       slug:'Exención' },
			{val: 'acta',          label: 'Acta',           slug:'Acta' },
			{val: 'estatuto',      label: 'Estatuto',       slug:'Estatuto' },
			{val: 'permiso',       label: 'Permiso',        slug:'Permiso' },
];

const competenciaTypeOptList: Array<any> = [
			{val: 'no_definido',      label: 'Seleccione opción',    slug:'Seleccione opción' },
			{val: 'calidad',          label: 'Calidad de Producto',  slug:'Calidad de Producto' },
			{val: 'tecnologia',       label: 'Mejor tecnología',     slug:'Mejor tecnología' },
			{val: 'precio',           label: 'Precio de venta',      slug:'Precio de venta' },
			{val: 'comercializacion', label: 'Estructura de comercialización',  slug:'Estructura de comercialización' },
			{val: 'escalaproductiva', label: 'Escala productiva',    slug:'Escala productiva' },
			{val: 'mercado',          label: 'Cuota de mercado',     slug:'Cuota de mercado' },
			{val: 'marca',            label: 'Desarrollo de marca',  slug:'Desarrollo de marca' },
			{val: 'vision',           label: 'Visión de producto',   slug:'Visión de producto' },
];


const habilitacionOptList: Array<any> = [
			{val: 'no_definido',   label: 'Seleccione opción',  slug:'Seleccione opción' },
			{val: 'habilitacion',  label: 'Habilitación',   slug:'Habilitación' },
];

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
   tipoEmp: categoriaEmpresasOptList,
   contactos: contactOptList,
   contactType: contactTypeOptList,
   address: addressTypeOptList,
   profesiones: profesionesOptList,
   documentos: tipoDocumentosOptList,
   habilitacion: habilitacionOptList,
   competencia: competenciaTypeOptList,
   

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

