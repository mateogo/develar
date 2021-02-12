import { devutils } from '../develar-commons/utils';
import { Person, CoberturaData }  from '../entities/person/person';
import { CardGraph } from '../develar-commons/asset-helper';
import { MaterialSolicitado } from '../entities/consultas/consulta.model';



export class Empresa {
		empresaId:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string; 
};

export class Responsable {
		responsableId:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string; 
};

export interface EstadoCenso {
	estado: string;
	navance: string;
	isCerrado: boolean;
	ts_alta: number;
	ts_umodif: number;
	fecierre_txa: string;
	fecierre_tsa: number;
	cerradoPor: Responsable;
}

export class CensoData {
	codigo: string = 'censo:industrias:2020:00';
	type: string =  'censo:anual'
	anio: number = 2020;
	q: string = 'q1';
	sector: string = 'produccion';
	slug: string = 'Censo Industrias - MAB 2020'
}

export class CensoActividad {
	_id?: string;
	type: string;
	level: number; //porcentaje de la facturación o la inversión
	codigo: string ;
	seccion: string;
	rubro: string;
	slug: string;
	rol: string;
	anio: number;
}

export class MercadoSumario {
	total: Mercado;
	local: Mercado;
	externo: Mercado;
	ventasLoc: number = 0;
	ventasExt: number = 0;
	comprasLoc: number = 0;
	comprasExt: number = 0;

	balanzaComMonto: number =0;
	balanzaComProp: number =0;

	balanzaVtaProp: number =0;
	balanzaImpProp: number =0;
	constructor(){
		this.total = new Mercado();
        this.total.target = 'TOTAL:';
        this.total.slug = 'Total compras y ventas'
		this.local = new Mercado();
		this.local.target = 'LOCAL';
		this.local.slug = 'Total compras y ventas mercado local';
		this.externo = new Mercado();
		this.externo.target = 'EXTERIOR';
		this.externo.slug = 'Total compras y ventas mercado externo';
	}

}


export class Mercado {
	target: string; // browr, pba, pais, brasil, mercosur, etc.
	isLocal: boolean = true;
	propVentas: number = 0; //proporción relativa de ventas
	propCompras: number = 0; //proporción relativa de ventas
	montoVentas: number = 0; //proporción relativa de ventas
	montoCompras: number = 0; //proporción relativa de ventas
	slug: string = ''; //proporción relativa de ventas
}
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

export class CensoComercializacion{
	_id?: string;
	type: string = 'comercializacion';
	slug: string = 'Modos de comercialización y marketing';

	mercados: Array<Mercado> = [];
	//exportaciones - importaciones || exportaciones/importaciones %
	balanzaComMonto: number = 0;
	balanzaComProp: number = 0;

	//comprasLoc - comprasImport || comprasLoc/comprasImp %
	balanzaImpProp: number = 0;
	balanzaImpMonto: number = 0;

	hasPlanAumentoExpo: boolean = false;
	planAumentoExpo: string = '';

	hasPlanPartFeriaInt: boolean = false;
	hasPlanPartFeriaLoc: boolean = false;
	hasPlanInvestigMerc: boolean = false;
	hasPlanRepresExt: boolean = false;
	hasOtrosPlanes: boolean = false;

	hasPlanSustImpo: boolean = false;
	planSustImpo: string = '';

	// proporción canales comercialización
	propComerPropia: number = 0;
	propComerMayor: number = 0;
	propComerMinor: number = 0;
	propComerDigital: number = 0;
	constructor(){
		this.mercados = mercadosOptList.map(t => {
			let m = new Mercado();
			m.target = t.val;
			m.isLocal = t.isLocal;
			return m;
		})
	}

	
}

const fuenteRecursosInversionOptList = [
	{val: 'propio',       label: 'Recursos propios'  },
	{val: 'insfinan',     label: 'Colocación financiera'  },
	{val: 'banco',        label: 'Crédito bancario'  },
	{val: 'acciones',     label: 'Emisión acciones/Inversor'  },
	{val: 'organismos',   label: 'Organismos internacionales'  },
	{val: 'subsidionac',  label: 'Subsidio público'  },
	{val: 'programas',    label: 'Programas incentivos públicos'  },
	{val: 'crowd',        label: 'Crowd funding'  },
	{val: 'fundraising',  label: 'Fund raising'  },
	{val: 'venta',        label: 'Venta activos'  },
]

const tiposDeInversionOptList = [
	{val: 'tecnologia',       label: 'Tecnología'  },
	{val: 'maquinaria',       label: 'Maquinaria-Instalaciones'  },
	{val: 'rodados',          label: 'Rodados'  },
	{val: 'edilicia',         label: 'Edilicia'  },
	{val: 'appinformatica',   label: 'App Informáticas'  },
	{val: 'infrainformatica', label: 'Infraestructura Informática'  },
	{val: 'gestion',          label: 'Mejora de Gestión'  },
	{val: 'mercados',         label: 'Desarrollo mercados'  },
	{val: 'otros',            label: 'Otras inversiones'  },
];
const subTipoInversionOptList = {
	tecnologia: [
		{ val:'desarrollo',    label: 'Desarrollo'},
		{ val:'licencia',      label: 'Licenciamiento'},
		{ val:'investigacion', label: 'Investigación'},
	],
	maquinaria: [
		{ val:'maquinaria',    label: 'Maquinaria y equipos'},
		{ val:'linea',         label: 'Línea de producción'},
		{ val:'mejora',        label: 'Mejora capacidad existente'},
		{ val:'mantenimiento', label: 'Mantenimiento capacidad existente'},
	],
	rodados: [
		{ val:'automotor',     label: 'Automotor'},
		{ val:'camion',        label: 'Camión'},
		{ val:'utilitario',    label: 'Utilitario'},
		{ val:'motos',         label: 'Motos'},
		{ val:'mantenimiento', label: 'Mantenimiento'},
	],
	edilicia: [
		{ val:'produccion', label: 'Producción'},
		{ val:'deposito',   label: 'Depósito'},
		{ val:'oficinas',   label: 'Oficinas'},
		{ val:'comercial',  label: 'Comercial'},
	],
	appinformatica: [
		{ val:'productividad', label: 'Productividad'},
		{ val:'ecommerce',     label: 'E-commerce'},
		{ val:'gestion',       label: 'Sist de Gestión'},
		{ val:'crm',           label: 'Gestión clientes (CRM)'},
		{ val:'paginaweb',     label: 'Página WEB'},
		{ val:'digital',       label: 'Comunicación Digital'},
		{ val:'bigdata',       label: 'Ciencia de datos'},
	],
	infrainformatica: [
		{ val:'onpremise', label: 'On-premise'},
		{ val:'cloud',     label: 'Cloud'},
		{ val:'redes',     label: 'Redes'},
		{ val:'seguridad', label: 'Seguridad informática'},
		{ val:'storage',   label: 'Almacenamiento'},
		{ val:'servidor',  label: 'Servidores'},
	],
	gestion: [
		{ val:'humana',         label: 'Talento humano'},
		{ val:'calidad',        label: 'Calidad'},
		{ val:'ambiental',      label: 'Ambiental'},
		{ val:'procesos',       label: 'Procesos'},
		{ val:'certificacion',  label: 'Certificaciones'},
		{ val:'logistica',      label: 'Logística'},
		{ val:'mantenimiento',  label: 'Mantenimiento'},
		{ val:'administrativa', label: 'Administrativo'},
		{ val:'marketing',      label: 'Marketing'},
		{ val:'digital',        label: 'Comunicación Digital'},
	],
	mercados: [
		{ val:'investigacion', label: 'Investigación'},
		{ val:'desarrollo',    label: 'Desarrollo'},
		{ val:'promocion',     label: 'Promoción'},
	],
	otros: [
		{ val:'otros',         label: 'Otras inversiones'},
	],

}
const factoresAfectanInversionOptList = [
	{ val: 'riesgo',          label: 'Riesgos económicos'  },
	{ val: 'competencia',     label: 'Importación de bienes iguales o similares a menor costo'  },
	{ val: 'capmprimas',      label: 'Capacidad de proveedores de insumos / materias primas'  },
	{ val: 'capinsum',        label: 'Calidad de insumos / materias primas'  },
	{ val: 'caprrhh',         label: 'Capacidad del personal'  },
	{ val: 'capadap',         label: 'Capacidad de adaptación al cambio'  },
	{ val: 'costomp',         label: 'Costos de materias primas '  },
	{ val: 'costoinsum',      label: 'Costos de insumos'  },
	{ val: 'costoprod',       label: 'Costos de generales de producciòn (incluìda la Mano de Obra)'  },
	{ val: 'costobuso',       label: 'Costos de bienes de uso'  },
	{ val: 'financiacion',    label: 'Condiciones de financiamiento'  },
	{ val: 'economico',       label: 'Riesgos económicos'  },
	{ val: 'plazorecupero',   label: 'Plazos de recuperación de inversión'  },
	{ val: 'informacion',     label: 'Información de tecnología disponible'  },
	{ val: 'infraestructura', label: 'Infraestructura de la empresa'  },
	{ val: 'regulaciones',    label: 'Regulaciones'  },
	{ val: 'empleo',          label: 'Niveles de empleo'  },
	{ val: 'oferta',          label: 'Oferta de productos'  },
	{ val: 'situaciongral',   label: 'Situación actual'  },
	{ val: 'tamaniomercado',  label: 'Tamaño de mercado'  },
	
];

export class FactoresInversion {
	tipo: string = '';
	alienta: boolean = false;
	dificulta: boolean = false;
	slug: string = '';
}


export class InversionData {
	tipoInversion: string = '';
	stipoInversion: string = '';
	hasRealizado: boolean = false;
	isPrevisto: boolean = false;
	fuentePpal: string = '';
	fuenteSec: string = '';
	factores: Array<FactoresInversion>;

}

export class CensoInversion{
	_id?: string;
	type: string = 'comercializacion';
	slug: string = 'Modos de comercialización y marketing';
	
	
}

export class CensoRecursosHumanos {
	_id?: string;
	type: string;
	slug: string;
}

export class CensoExpectativas {
	_id?: string;
	type: string;
	slug: string;
}

export class CensoProductos {
	_id?: string;
	type: string;
	slug: string;
	
	tactividad: string;
	actividadId: string;
	parancelaria: string ;

	isProdpropia: boolean = false;
	cenproductivo: string ;

	isImportada: boolean = false;
	origen: string;

	isExportable: boolean = false;
	exportableTxt: string;
	propExportada: number; // todo


	isSustituible: boolean = false;
	sustituibleTxt: string;

	isInnovacion: boolean = false;
	innovacionTxt: string;

	anio: number;
	destino: string; // destino de la produccion opciones ídem origen
	capainstalada: string; // unidades año
	capautilizada: string; // unidades año

	competencia: string;
	competenciaTxt: string;
	competenciaOrigen: string;


	level: number; //porcentaje de la facturación o la inversión

}

export class CensoBienes {
	_id?: string;
	type: string;
	slug: string;
	
	tactividad: string;
	actividadId: string;
	parancelaria: string ;

	isProdpropia: boolean = false;
	cenproductivo: string ;

	isImportada: boolean = false;
	origen: string;

	isExportable: boolean = false;
	exportableTxt: string;
	propExportada: number; // todo


	isSustituible: boolean = false;
	sustituibleTxt: string;

	isInnovacion: boolean = false;
	innovacionTxt: string;

	anio: number;
	destino: string; // destino de la produccion opciones ídem origen
	capainstalada: string; // unidades año
	capautilizada: string; // unidades año

	competencia: string;
	competenciaTxt: string;
	competenciaOrigen: string;


	level: number; //porcentaje de la facturación o la inversión
}

export class CensoMaquinarias {
	_id?: string;
	type: string;
	slug: string;
	
	tactividad: string;
	actividadId: string;

	isImportada: boolean = false;
	origen: string;
	parancelaria: string ;

	isExportable: boolean = false;
	exportableTxt: string;
	propExportada: number; // todo


	isSustituible: boolean = false;
	sustituibleTxt: string;

	isInnovacion: boolean = false;
	innovacionTxt: string;

	anio: number;
	destino: string; // destino de la produccion opciones ídem origen
	capainstalada: string; // unidades año
	capautilizada: string; // unidades año

	competencia: string;
	competenciaTxt: string;
	competenciaOrigen: string;


	level: number; //porcentaje de la facturación o la inversión

}

export class CensoPatentes {
	_id?: string;
	type: string;
	slug: string;
	
	tactividad: string;
	actividadId: string;

	isImportada: boolean = false;
	origen: string;
	parancelaria: string ;

	isExportable: boolean = false;
	exportableTxt: string;
	propExportada: number; // todo


	isSustituible: boolean = false;
	sustituibleTxt: string;

	isInnovacion: boolean = false;
	innovacionTxt: string;

	anio: number;
	destino: string; // destino de la produccion opciones ídem origen
	capainstalada: string; // unidades año
	capautilizada: string; // unidades año

	competencia: string;
	competenciaTxt: string;
	competenciaOrigen: string;


	level: number; //porcentaje de la facturación o la inversión

}


/**************************/
/**   CENSO INDUSTRIAS  **/
/************************/
export class CensoIndustrias {
		_id: string;
		compPrefix:  string = 'CENSO';
		compName:    string = 'CEN';
		compNum:     string = '00000';

		action:      string = 'censo';
		sector:      string = 'produccion';

		categoriaEmp:   string;
		rubroEmp:       string;

		fecomp_tsa:  number;
		fecomp_txa:  string;

		empresa:  Empresa;

		responsable:  Responsable;

		estado: EstadoCenso;
		actividades: Array<CensoActividad>;
		bienes:     Array<CensoBienes>;
		productos:     Array<CensoProductos>;
		maquinarias: Array<CensoMaquinarias>;
		patentes:  Array<CensoPatentes>;


		comercializacion: Array<CensoComercializacion>;
		inversiones: Array<CensoInversion>;
		rhumanos: Array<CensoRecursosHumanos>;
		expectativas: Array<CensoExpectativas>;

    	assets: Array<CardGraph> = [];

		censo: CensoData;


};

/**************************/
/**   CENSO INDUSTRIAS  **/
/************************/
export class CensoIndustriasTable {
	_id: string;
	compNum:     string = '00000';

	action:      string = 'censo';
	sector:      string = 'produccion';
	slug:        string = '';

	categoriaEmp:   string;
	rubroEmp:       string;

	fecomp_tsa:  number;
	fecomp:  string;
	navance: string;


};

