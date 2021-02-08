import {    CensoIndustrias,
            CensoIndustriasTable,
            CensoActividad,
            CensoBienes, 
            CensoMaquinarias,
            CensoRecursosHumanos,
            CensoPatentes,
            CensoExpectativas,
            CensoComercializacion,
            Mercado,
            MercadoSumario,
            Empresa } from './censo.model';
import { Serial }          from '../develar-commons/develar-entities';
import { Person, DocumentData }      from '../entities/person/person';
import { nomencladorList } from './nomenclador-data';
import { CardGraph } from '../develar-commons/asset-helper';
import { AcumuladoresPorArea } from '../salud/internacion/internacion.model';

export interface UpdateListEvent {
  action: string;
  type:   string;
  items:  Array<CensoActividad|CensoBienes|CensoComercializacion|CensoMaquinarias|CensoRecursosHumanos|CensoPatentes|CensoExpectativas|DocumentData|CardGraph>;
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
  payload: CensoActividad|CensoBienes|CensoComercializacion|CensoMaquinarias|CensoRecursosHumanos|CensoPatentes|CensoExpectativas|DocumentData|CardGraph;
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

		let token = nomencladorList.find(t => t.val === seccion);
		if(token){
			list = nomencladorList.filter(t => t.seccion === token.seccion  && t.isTitulo === 1  && t.isSeccion === 0);
			list = list || [];

		}

		return list;

	}

	static getCodigoOptList(rubro){
		let list = [];

		list = nomencladorList.filter(t => t.titulo === rubro  && t.isTitulo === 0  && t.isSeccion === 0);
		list = list || [];


		return list;

	}

	static getActionOptList(val, type){
		let list = [];
		let token = fetchAction(val, type);

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
				label =  token['label'];

			} else if(type === 'rubro'){
				label = token['label'];

			} else if(type === 'codigo'){
				label = token['label'];

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
    
    static planesActivosAmentoExportaciones(token: CensoComercializacion ){
        let planes = planesActivosExportacion.reduce((txt, t)=> {
            return txt + (token[t.val] ? t.label + ' :: ' : '');
        }, '');

        return planes;
    }


	static sumMercadeo(mercados: Array<Mercado>): MercadoSumario{
        let sumario = new MercadoSumario();

        sumario = mercados.reduce((acum, t) => {
                acum.total.propVentas  += t.propVentas;
                acum.total.propCompras += t.propCompras;

                acum.total.montoVentas  += t.montoVentas;
                acum.total.montoCompras += t.montoCompras;

                if(t.isLocal){
                    acum.local.montoVentas  += t.montoVentas;
                    acum.local.montoCompras += t.montoCompras;
    
                } else {
                    acum.externo.montoVentas  += t.montoVentas;
                    acum.externo.montoCompras += t.montoCompras;
                }
                
                acum.comprasLoc += t.isLocal  ? t.montoCompras : 0;
                acum.ventasExt  += !t.isLocal ? t.montoVentas  : 0;
                acum.comprasExt += !t.isLocal ? t.montoCompras : 0;
                acum.ventasLoc  += t.isLocal  ? t.montoVentas  : 0;

                return acum;
            }, sumario);

        

        if(sumario.externo.montoCompras){
            sumario.balanzaComMonto = (sumario.externo.montoVentas - sumario.externo.montoCompras)
            sumario.balanzaComProp = Math.round(((sumario.externo.montoVentas - sumario.externo.montoCompras)/sumario.externo.montoCompras) * 10000)/100;
            sumario.externo.propCompras = Math.round((sumario.externo.montoCompras / sumario.total.montoCompras) * 100) / 100;
        }

        if(sumario.externo.montoVentas){
            sumario.externo.propVentas = Math.round((sumario.externo.montoVentas / sumario.total.montoVentas) * 100) / 100;
        }

        if(sumario.local.montoCompras){
            sumario.balanzaImpProp = Math.round((sumario.externo.montoCompras / sumario.local.montoCompras) * 10000) / 100;
            sumario.local.propCompras = Math.round((sumario.local.montoCompras / sumario.total.montoCompras) * 100) / 100;
        }

        if(sumario.local.montoVentas){
            sumario.balanzaVtaProp = Math.round((sumario.externo.montoVentas  / sumario.local.montoVentas) * 10000) / 100;
            sumario.local.propVentas = Math.round((sumario.local.montoVentas / sumario.total.montoVentas) * 100) / 100;
        }
        return sumario;
	}

}

const planesActivosExportacion = [
    {val: 'hasPlanPartFeriaInt',      label: 'Ferias internacionales' },
    {val: 'hasPlanPartFeriaLoc',      label: 'Ferias locales' },
    {val: 'hasPlanInvestigMerc',      label: 'Investigación de mercado' },
    {val: 'hasPlanRepresExt',         label: 'Representaciones en el exterior' },
    {val: 'hasOtrosPlanes',           label: 'Otros planes' },
];


const tipoActividadOptList = [
      {val: 'no_definido',    label: 'Sin selección',  slug:'Seleccione opción' },
      {val: 'principal',      label: 'Principal',      slug:'Principal' },
      {val: 'secundaria',     label: 'Secundaria',     slug:'Secundaria' },
      {val: 'investigacion',  label: 'Invertitación',  slug:'Invertitación' },
      {val: 'social',         label: 'Social',         slug:'Social' },
      {val: 'otra',           label: 'Otra',           slug:'Otra' },
];


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

const productosTypeOptList = [
    {val: 'no_definido',  label: 'Seleccione opción',  slug: 'Seleccione opción' },
    {val: 'pventa',     label: 'Producto de Venta',    slug: 'Producto de Venta' },
];

const bienesTypeOptList = [
    {val: 'no_definido',   label: 'Seleccione opción', slug: 'Seleccione opción' },
    {val: 'matprima',      label: 'Materia prima'   ,  slug: 'Materia prima' },
    {val: 'semielaborado', label: 'Semielaborado'   ,  slug: 'Semielaborado' },
    {val: 'insumo',        label: 'Insumo ',           slug: 'Insumo' },
];

const maquinariasTypeOptList = [
    {val: 'no_definido',  label: 'Seleccione opción',          slug: 'Seleccione opción' },
    {val: 'maquinaria',   label: 'Maquinas industriales',      slug: 'Maquinaria ' },
    {val: 'maqnumérica',  label: 'Máquinas robóticas/digitales', slug: 'Maquinaria ' },
    {val: 'instrumental', label: 'Instrumental',               slug: 'Instrumental ' },
    {val: 'software',     label: 'Aplicaciones software',      slug: 'Aplicaciones software' },
    {val: 'recursosit',   label: 'Infraestructura IT',         slug: 'Infraestructura IT' },
    {val: 'tecnologia',   label: 'Otros activos tecnológicos', slug: 'Otros Tecnología' },
];

const patentesTypeOptList = [
    {val: 'no_definido',    label: 'Seleccione opción',        slug: 'Seleccione opción' },
    {val: 'licencia',       label: 'Licencia/Derecho',         slug: 'Licencia/Derecho' },
    {val: 'representacion', label: 'Representación',           slug: 'Representación' },
    {val: 'patente',        label: 'Patente',                  slug: 'Patente' },
    {val: 'marca',          label: 'Marca',                    slug: 'Marca' },
    {val: 'certifcalidad',  label: 'Certificación de calidad', slug: 'Certificación de calidad' },
];

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
];

const mercadosOptList = [
	{val: 'brown',        isLocal: true,  label: 'Partido Almte Brown',  slug: 'Partido Almte Brown' },
	{val: 'pba',          isLocal: true,  label: 'Pcia de BsAs (excluye AB)', slug: 'Pcia de Buenos Aires' },
	{val: 'nacional',     isLocal: true,  label: 'Nacional (excluye PBA)',         slug: 'Nacional' },
	{val: 'brasil',       isLocal: false, label: 'Brasil',           slug: 'Brasil' },
	{val: 'mercosur',     isLocal: false, label: 'Mercosur (excluye Brasil)',         slug: 'Mercosur' },
	{val: 'peru',         isLocal: false, label: 'Perú',   slug: 'Perú' },
	{val: 'colombia',     isLocal: false, label: 'Colombia',   slug: 'Colombia' },
	{val: 'mexico',       isLocal: false, label: 'México',   slug: 'México' },
	{val: 'usa',          isLocal: false, label: 'USA',   slug: 'USA' },
	{val: 'america',      isLocal: false, label: 'América',   slug: 'América' },
	{val: 'europa',       isLocal: false, label: 'EU',               slug: 'EU' },
	{val: 'resto',        isLocal: false, label: 'Otras regiones',   slug: 'Otras regiones' },
]


const posCadenaProductivaOptList = [
      {val: 'no_definido',   label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'primario',      label: 'Extracción; cultivo, criadero',  slug:'Extracción; cultivo, criadero' },
      {val: 'finales',       label: 'Manufactura de bienes finales',  slug:'Manufactura de bienes finales' },
      {val: 'intermedio',    label: 'Manufactura de bienes intermedios', slug:'Manufactura de bienes intermedios' },
      {val: 'consmasivo',    label: 'Manufactura de bienes consumo masivo', slug:'Manufactura de bienes consumo masivo' },
      {val: 'mayorista',     label: 'Distribuidor mayorista',         slug:'Distribuidor mayorista' },
      {val: 'retail',        label: 'Distribuidor minoristas - comercio - retail',              slug:'Comercio - Retail' },
      {val: 'transporte',    label: 'Transporte-logística',           slug:'Transporte-logística' },
      {val: 'servicios',     label: 'Servicios',     slug:'Servicios' },
];

/******** Categoría Empresa RES 69/2020 AFIP **********/
const categoriaEmpresasOptList = [
	[
		{x:0, y:0 , categoria: "micro",    rubro: "construccion", categoria_lbl: "Micro",       rubro_lbl: "Construcción", tope:  19450000 },
		{x:0, y:1 , categoria: "micro",    rubro: "servicios",    categoria_lbl: "Micro",       rubro_lbl: "Servicios",    tope:   9900000 },
		{x:0, y:2 , categoria: "micro",    rubro: "comercio",     categoria_lbl: "Micro",       rubro_lbl: "Comercio",     tope:  36320000 },
		{x:0, y:3 , categoria: "micro",    rubro: "industria",    categoria_lbl: "Micro",       rubro_lbl: "Industria",    tope:  33920000 },
		{x:0, y:4 , categoria: "micro",    rubro: "mineria",      categoria_lbl: "Micro",       rubro_lbl: "Minería",      tope:  33920000 },
		{x:0, y:5 , categoria: "micro",    rubro: "agropecuario", categoria_lbl: "Micro",       rubro_lbl: "Agropecuario", tope:  17260000 },
	],
	[
		{x:1, y:0 , categoria: "pequenia", rubro: "construccion", categoria_lbl: "Pequeña", rubro_lbl: "Construcción", tope: 115370000 },
		{x:1, y:1 , categoria: "pequenia", rubro: "servicios",    categoria_lbl: "Pequeña", rubro_lbl: "Servicios",    tope:  59710000 },
		{x:1, y:2 , categoria: "pequenia", rubro: "comercio",     categoria_lbl: "Pequeña", rubro_lbl: "Comercio",     tope: 247200000 },
		{x:1, y:3 , categoria: "pequenia", rubro: "industria",    categoria_lbl: "Pequeña", rubro_lbl: "Industria",    tope: 243290000 },
		{x:1, y:4 , categoria: "pequenia", rubro: "mineria",      categoria_lbl: "Pequeña", rubro_lbl: "Minería",      tope: 243290000 },
		{x:1, y:5 , categoria: "pequenia", rubro: "agropecuario", categoria_lbl: "Pequeña", rubro_lbl: "Agropecuario", tope:  71960000 },
	],
	[
		{x:2, y:0 , categoria: "mediana1", rubro: "construccion", categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Construcción", tope:  643710000 },
		{x:2, y:1 , categoria: "mediana1", rubro: "servicios",    categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Servicios",    tope:  494200000 },
		{x:2, y:2 , categoria: "mediana1", rubro: "comercio",     categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Comercio",     tope: 1821760000 },
		{x:2, y:3 , categoria: "mediana1", rubro: "industria",    categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Industria",    tope: 1651750000 },
		{x:2, y:4 , categoria: "mediana1", rubro: "mineria",      categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Minería",      tope: 1651750000 },
		{x:2, y:5 , categoria: "mediana1", rubro: "agropecuario", categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Agropecuario", tope:  426720000 },
	],
	[
		{x:3, y:0 , categoria: "mediana2", rubro: "construccion", categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Construcción", tope:  965460000 },
		{x:3, y:1 , categoria: "mediana2", rubro: "servicios",    categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Servicios",    tope:  705790000 },
		{x:3, y:2 , categoria: "mediana2", rubro: "comercio",     categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Comercio",     tope: 2602540000 },
		{x:3, y:3 , categoria: "mediana2", rubro: "industria",    categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Industria",    tope: 2540380000 },
		{x:3, y:4 , categoria: "mediana2", rubro: "mineria",      categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Minería",      tope: 2540380000 },
		{x:3, y:5 , categoria: "mediana2", rubro: "agropecuario", categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Agropecuario", tope:  676810000 },
	]
];

const ocupacionEmpresasOptList = [
	[
		{x:0, y:0 , categoria: "micro",    rubro: "construccion", categoria_lbl: "Micro",       rubro_lbl: "Construcción", personal: 12 },
		{x:0, y:1 , categoria: "micro",    rubro: "servicios",    categoria_lbl: "Micro",       rubro_lbl: "Servicios",    personal:  7 },
		{x:0, y:2 , categoria: "micro",    rubro: "comercio",     categoria_lbl: "Micro",       rubro_lbl: "Comercio",     personal:  7 },
		{x:0, y:3 , categoria: "micro",    rubro: "industria",    categoria_lbl: "Micro",       rubro_lbl: "Industria",    personal: 15 },
		{x:0, y:4 , categoria: "micro",    rubro: "mineria",      categoria_lbl: "Micro",       rubro_lbl: "Minería",      personal: 15 },
		{x:0, y:5 , categoria: "micro",    rubro: "agropecuario", categoria_lbl: "Micro",       rubro_lbl: "Agropecuario", personal:  5 },
	],
	[
		{x:1, y:0 , categoria: "pequenia", rubro: "construccion", categoria_lbl: "Pequeña", rubro_lbl: "Construcción", personal: 45 },
		{x:1, y:1 , categoria: "pequenia", rubro: "servicios",    categoria_lbl: "Pequeña", rubro_lbl: "Servicios",    personal: 30 },
		{x:1, y:2 , categoria: "pequenia", rubro: "comercio",     categoria_lbl: "Pequeña", rubro_lbl: "Comercio",     personal: 35 },
		{x:1, y:3 , categoria: "pequenia", rubro: "industria",    categoria_lbl: "Pequeña", rubro_lbl: "Industria",    personal: 60 },
		{x:1, y:4 , categoria: "pequenia", rubro: "mineria",      categoria_lbl: "Pequeña", rubro_lbl: "Minería",      personal: 60 },
		{x:1, y:5 , categoria: "pequenia", rubro: "agropecuario", categoria_lbl: "Pequeña", rubro_lbl: "Agropecuario", personal: 10 },
	],
	[
		{x:2, y:0 , categoria: "mediana1", rubro: "construccion", categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Construcción", personal: 200 },
		{x:2, y:1 , categoria: "mediana1", rubro: "servicios",    categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Servicios",    personal: 165 },
		{x:2, y:2 , categoria: "mediana1", rubro: "comercio",     categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Comercio",     personal: 125 },
		{x:2, y:3 , categoria: "mediana1", rubro: "industria",    categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Industria",    personal: 235 },
		{x:2, y:4 , categoria: "mediana1", rubro: "mineria",      categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Minería",      personal: 235 },
		{x:2, y:5 , categoria: "mediana1", rubro: "agropecuario", categoria_lbl: "Mediana-Tramo1", rubro_lbl: "Agropecuario", personal:  50 },
	],
	[
		{x:3, y:0 , categoria: "mediana2", rubro: "construccion", categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Construcción", personal: 590 },
		{x:3, y:1 , categoria: "mediana2", rubro: "servicios",    categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Servicios",    personal: 535 },
		{x:3, y:2 , categoria: "mediana2", rubro: "comercio",     categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Comercio",     personal: 345 },
		{x:3, y:3 , categoria: "mediana2", rubro: "industria",    categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Industria",    personal: 655 },
		{x:3, y:4 , categoria: "mediana2", rubro: "mineria",      categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Minería",      personal: 655 },
		{x:3, y:5 , categoria: "mediana2", rubro: "agropecuario", categoria_lbl: "Mediana-Tramo2", rubro_lbl: "Agropecuario", personal: 215 },
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
		{val: 'no_definido', 	label: 'Seleccione opción',slug:'Seleccione opción' },
		{val: 'fabrica',        label: 'Fábrica',          slug:'Sede fábrica' },
		{val: 'deposito',       label: 'Depósito',         slug:'Depósito' },
		{val: 'admin',          label: 'Administración',   slug:'Sede administración' },
		{val: 'fiscal', 	    label: 'Domicilio Fiscal', slug:'Domicilio fiscal' },
		{val: 'entrega', 	    label: 'Lugar entrega',    slug:'Lugar de entrega' },
		{val: 'sucursal', 	    label: 'Sucursal',         slug:'Sucursal' },
		{val: 'principal',      label: 'Principal',        slug:'Locación principal' },
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

const contact_tag: Array<any> = [
    {val: 'no_definido',     label: 'Seleccione opción',slug:'Seleccione opción' },
    {val: 'PER',    label: 'PER',      slug:'PER' },
    {val: 'LAB',    label: 'LAB',      slug:'LAB' },
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
    tipoProductos: productosTypeOptList,
    tipoMaquinas: maquinariasTypeOptList,
    tipoPatentes: patentesTypeOptList,
	origenBienes: origenOptList,
	mercados: mercadosOptList,
    cadena: posCadenaProductivaOptList,
    tipoEmp: categoriaEmpresasOptList,
    contactos: contactOptList,
    contactType: contactTypeOptList,
    contactTag: contact_tag,
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

