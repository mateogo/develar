import { ArrayDataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { BehaviorSubject,  Observable, merge }       from 'rxjs';
import { map } from 'rxjs/operators';

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
	codigo: string = 'censo:empresarial:2021:01';
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
        this.total.slugVentas = 'Total compras y ventas'
		this.local = new Mercado();
		this.local.target = 'LOCAL';
		this.local.slugVentas = 'Total compras y ventas mercado local';
		this.externo = new Mercado();
		this.externo.target = 'EXTERIOR';
		this.externo.slugVentas = 'Total compras y ventas mercado externo';
	}

}

export const mercadosOptList_old = [
	{val: 'brown',        isLocal: true,  label: 'Partido Almte Brown',  slug: 'Partido Almte Brown' },
	{val: 'pba',          isLocal: true,  label: 'Pcia de BsAs (excluye AB)', slug: 'Pcia de Buenos Aires' },
	{val: 'nacional',     isLocal: true,  label: 'Nacional (excluye PBA)',         slug: 'Nacional' },
	{val: 'brasil',       isLocal: false, label: 'Brasil',           slug: 'Brasil' },
	{val: 'mercosur',     isLocal: false, label: 'Mercosur (excluye Brasil)',         slug: 'Mercosur' },
	{val: 'peru',         isLocal: false, label: 'Perú',   slug: 'Perú' },
	{val: 'colombia',     isLocal: false, label: 'Colombia',   slug: 'Colombia' },
	{val: 'mexico',       isLocal: false, label: 'México',   slug: 'México' },
	{val: 'usa',          isLocal: false, label: 'USA',   slug: 'USA' },
	{val: 'america',      isLocal: false, label: 'Resto América',   slug: 'América' },
	{val: 'europa',       isLocal: false, label: 'EU',               slug: 'EU' },
	{val: 'asia',         isLocal: false, label: 'Asia',               slug: 'Asia' },
	{val: 'resto',        isLocal: false, label: 'Otras regiones',   slug: 'Otras regiones' },
]

export const mercadosOptList = [
	{val: 'brown',      isLocal: true,  label: 'Distrito Almte Brown',           slug: 'Partido Almte Brown' },
	{val: 'nacional',   isLocal: true,  label: 'Nacional (excluye Almte Brown)', slug: 'Nacional' },
	{val: 'brasil',     isLocal: false, label: 'Brasil',                         slug: 'Brasil' },
	{val: 'mercosur',   isLocal: false, label: 'Mercosur (excluye Brasil)',      slug: 'Mercosur' },
	{val: 'america',    isLocal: false, label: 'Resto América',                  slug: 'América' },
	{val: 'europa',     isLocal: false, label: 'Unión Europea',                  slug: 'Unión Europea' },
	{val: 'china',      isLocal: false, label: 'China',                          slug: 'China' },
	{val: 'asia',       isLocal: false, label: 'Resto de Asia',                  slug: 'Resto de Asia' },
	{val: 'resto',      isLocal: false, label: 'Otras regiones',                 slug: 'Otras regiones' },
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
			m.label =  t.label;
			m.isLocal = t.isLocal;
			return m;
		})
	}	
}

export class Mercado {
	target: string; // brown, pba, pais, brasil, mercosur, etc.
	label: string; // Partido Almte
	isLocal: boolean = true;
	propVentas: number = 0; //proporción relativa de ventas
	propCompras: number = 0; //proporción relativa de ventas
	montoVentas: number = 0; //proporción relativa de ventas
	montoCompras: number = 0; //proporción relativa de ventas
	slugCompras: string = ''; //proporción relativa de ventas
	slugVentas: string = ''; //proporción relativa de ventas
}


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

export const factoresAfectanInversionOptList = [
	{ val: 'competencia',     label: 'Importación de bienes iguales o similares a menor costo'  },
	{ val: 'infraestructura', label: 'Limitantes por infraestructura de la empresa'  },
	{ val: 'serviciosgrales', label: 'Capacidad de servicios generales (energía/ gas/ agua/ efluentes/ conectividad)'  },
	{ val: 'proveedores',     label: 'Capacidad de proveedores'  },
	{ val: 'caprrhh',         label: 'Capacidad del personal'  },
	{ val: 'capadap',         label: 'Capacidad de adaptación al cambio'  },
	{ val: 'costomp',         label: 'Costos de materias primas e insumos'  },
	{ val: 'accesoimportados',label: 'Costos/ acceso a bienes importados'  },
	{ val: 'costoinsum',      label: 'Costos de insumos'  },
	{ val: 'costoprod',       label: 'Costos de generales de producciòn (incluye Mano de Obra)'  },
	{ val: 'costobuso',       label: 'Costos de bienes de uso'  },
	{ val: 'economico',       label: 'Riesgos económicos'  },
	{ val: 'financiacion',    label: 'Condiciones de financiamiento'  },
	{ val: 'plazorecupero',   label: 'Plazos de recuperación de inversión'  },
	{ val: 'informacion',     label: 'Información de tecnología disponible'  },
	{ val: 'capinsum',        label: 'Calidad de insumos / materias primas'  },
	{ val: 'regulaciones',    label: 'Regulaciones'  },
	{ val: 'oferta',          label: 'Oferta de productos'  },
	{ val: 'situaciongral',   label: 'Situación o contexto actual'  },
	{ val: 'tamaniomercado',  label: 'Tamaño de mercado'  },
	
];



export class FactoresInversion {
	ftype:     string = '';
	flabel:    string = '';
	impacto:   string = '';
	alienta:   boolean = false;
	dificulta: boolean = false;
	slug:      string = '';

	constructor(type: string, label?: string){
		this.ftype = type;
		this.flabel = label ? label : type
	}
}


export class CensoInversion{
	_id?:  string;
	type:  string = 'no_definido';
	stype: string = 'no_definido';
	slug:  string = '';
	
	hasRealizado: boolean = false;
	isPrevisto:   boolean = false;
	fuenteFinan:  string = '';
	factores:     Array<FactoresInversion> = [];

	constructor(){
		this.factores = factoresAfectanInversionOptList.map(f =>{
			let factor = new FactoresInversion(f.val, f.label);
			return factor;
		})
	}
}

const generoOptList = [
	{val: 'H', label: 'Varón', slug: 'Masculino' },
	{val: 'M', label: 'Mujer', slug: 'Femenino' },		
]

export const seccionOptList = [
	{val: 'produccion',     label: 'Producción',     slug: 'Producción' },
	{val: 'comercial',      label: 'Comercial',      slug: 'Comercial' },
	{val: 'administracion', label: 'Administración', slug: 'Administración' },
];


const nivelJerarquicoOptList_old = [
	{val: 'directores',   label: 'Directores',    slug: 'Directores' },
	{val: 'gerentes',     label: 'Gerentes',      slug: 'Gerentes' },
	{val: 'supervisores', label: 'Supervisores',  slug: 'Supervisores' },
	{val: 'lideres',      label: 'Líderes',       slug: 'Líderes' },
	{val: 'tecnicos',     label: 'Técnicos',      slug: 'Técnicos' },
	{val: 'operarios',    label: 'Operarios',     slug: 'Operarios' },
];

const nivelJerarquicoOptList = [
	{val: 'nivjerarquico',   label: 'Nivel jerárquico (Directores y gerentes)',   slug: 'Directores y gerentes' },
	{val: 'mandosmedios',    label: 'Mandos medios (Supervisores y jefes)',      slug: 'Supervisores, jefes, coordinadores' },
	{val: 'operativos',      label: 'Nivel operativo (Operarios, empleados)',    slug: 'Operarios, administrativos' },
];

const nivelEstudioOptList_old = [
	{val: 'universitario',        label: 'Univers/posgrado', slug: 'Universitario/ posgrado' },
	{val: 'univer_inc',    label: 'Univers(incompleto)',   slug: 'Universitario incompl' },
	{val: 'terciario',     label: 'Terciario/ Técnico',      slug: 'Terciario/ Técnico' },
	{val: 'secundario',    label: 'Secundaria',              slug: 'Secundaria' },
	{val: 'primaria',      label: 'Primaria',                slug: 'Primaria' },
	{val: 'primaria_inc',  label: 'Primaria(inc)',            slug: 'Primaria_inc' },
];

const nivelEstudioOptList = [
	{val: 'universitario', label: 'Universitario / posgrado',   slug: 'Universitario / posgrado' },
	{val: 'terciario',     label: 'Terciario / Técnico',         slug: 'Terciario / Técnico' },
	{val: 'secundario',    label: 'Secundaria completa',        slug: 'Secundaria completa' },
];

const ramasTecnicasOptList = [
	{val: 'indus_alimen',    label: 'Indus alimenticias/ buenas prácticas', slug: 'Indus alimenticias/ buenas prácticas' },
	{val: 'indus_grafica',   label: 'Indus gráfica', slug: 'Indus gráfica' },
	{val: 'constr_seco',     label: 'Construcciones en seco / sustentable', slug: 'Construcciones en seco / sustentable' },
	{val: 'electro_indus',   label: 'Electrónica industrial', slug: 'Electrónica industrial' },
	{val: 'electri_renov',   label: 'Electricidad en sist energ renov', slug: 'Electricidad: sist energ renov' },
	{val: 'electri_indus',   label: 'Electricidad Industrial', slug: 'Electricidad Industrial' },
	{val: 'electromecan',    label: 'Electromecánica', slug: 'Electromecánica' },
	{val: 'tec_quimico',     label: 'Técnico químico', slug: 'Técnico químico' },
	{val: 'tec_colorista',   label: 'Técnico colorista', slug: 'Técnico colorista' },
	{val: 'tec_shigiene',    label: 'Técnico en Seg & Higiene', slug: 'Técnico en Seg & Higiene' },
	{val: 'disexcompu',      label: 'Diseño proyectual asis x compu', slug: 'Diseño proyectual asis x compu' },
	{val: 'it_redes',        label: 'IT: redes', slug: 'IT: redes' },
	{val: 'it_programador',  label: 'IT: programador', slug: 'IT: programador' },
	{val: 'op_torno',        label: 'Oper: torno CNC', slug: 'Operario: torno CNC' },
	{val: 'op_sodadura',     label: 'Oper: Sold oxiacetilénica/ arco/ mig/ tig', slug: 'Operario: Sold oxiacetilénica/ arco/ mig/ tig' },
	{val: 'otros',           label: 'Otros oficios', slug: 'Otros oficios' },
];

export class NodoNiveles {
}

export class NodoSeccion {
	tipo: string = 'NE' // NE= Nivel de Estudios | NJ= Nivel Jerárquico

	seccion: string = '' // seccionOptList
	seccion_tx: string = '' // label

	nivel: string = '' // nivelJerarquicoOptList ó nivelEstudiosOptList;
	nivel_tx: string = '' // label

	codigo: string = ''
	qh: number = 0; // cantidad hombres
	qm: number = 0; // cantidad mujeres
	qau: number = 0 // cantidad autopercibidos

	constructor(s, stx, n, ntx, cod){
		this.seccion = s;
		this.seccion_tx = stx;
		this.nivel = n;
		this.nivel_tx = ntx;
		this.codigo = cod;
	}

}

export class CrecimientoEmpleados {
	hasCrecimiento: boolean = false;
	hasBrownEmplea: boolean = false;
	hasDeseoBrownEmplea: boolean = false;
	qnuevos: number = 0;
	qsecundarios: number = 0;
	qterciarios: number = 0;
	quniversitarios: number = 0;

	slug: string = '';
}


export class CensoRecursosHumanos {
	_id?: string;
	type: string = 'talentos humanos';
	slug: string = 'Nivel general empresa';

	qempleados: number = 0;
	qemplab: number = 0;
	qemplnoab: number = 0;
	porNivelEducacion: Array<NodoSeccion> = []
	porNivelJerarquico: Array<NodoSeccion> = []

	crecimiento: CrecimientoEmpleados;
	competencia: string;
	competencias: Array<string> = [];

	constructor(){
		let neducativo = [];
		let njerarquico = [];
		let secciones = seccionOptList;

		secciones.forEach((s, i) => {
			nivelEstudioOptList.forEach((n, j) => {
				let ns = new NodoSeccion(s.val, s.label, n.val, n.label, i + ':' + j);
				neducativo.push(ns);
			})
		})
		this.porNivelEducacion = neducativo;

		secciones.forEach((s, i) => {
			nivelJerarquicoOptList.forEach((n, j) => {
				let ns = new NodoSeccion(s.val, s.label, n.val, n.label, i + ':' + j);
				njerarquico.push(ns);
			})
		})
		this.porNivelJerarquico = njerarquico;

		this.crecimiento = new CrecimientoEmpleados();


	}

}

export const nivelActividadOptList = [
	{val: 'acelerado',     label: 'Crecimiento acelerado',    slug: '' },
	{val: 'normal',        label: 'Crecimiento normal',       slug: '' },
	{val: 'estancado',     label: 'Estancamiento',            slug: '' },
	{val: 'retraccion',    label: 'Retracción de actividad',  slug: '' },
];

export const deltaActividadOptList = [
	{val: 'aumenta',       label: 'Aumentará nivel',    slug: '' },
	{val: 'mantiene',      label: 'Mantendrá nivel',   slug: '' },
	{val: 'disminuye',     label: 'Disminuirá',        slug: '' },
];

export class CensoExpectativas {
	_id?: string;
	type: string = 'expectativas';
	slug: string = '';
	nactividad:     string = ''; // nivelActividadOptList para los últimos 3 años
	nactividad_var: number = 0; // variación porcentual de la actividad
	qempleados_mod: string = ''; // variación empleados
	qhorasprod_mod: string = ''; // variación empleados
	capinstalada_mod: string = ''; // variación empleados
	vtaexter_mod:   string = ''; // variación empleados
	vtalocal_mod:   string = ''; // variación empleados

	fplenaocupacion: string =  ''; // factor que limita la plena ocupacion
	tocupacion: number  = 100; // tasa de ocupacion general rango 0-100, respecto capacidad instalada
	factoresList: Array<string> = [];

	fortaleza1: string = '';
	fortaleza2: string = '';
	fortaleza3: string = '';

	debilidad1: string = '';
	debilidad2: string = '';
	debilidad3: string = '';
	
	oportunidad1: string = '';
	oportunidad2: string = '';
	oportunidad3: string = '';
	
	amenaza1: string = '';
	amenaza2: string = '';
	amenaza3: string = '';

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

	isNacional: boolean = false;
	origennacional: string;

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
	umecapacidad: string; // unidad de medida capacidad

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
	otorgante: string ;

	isExportable: boolean = false;
	exportableTxt: string;


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


}


export class CensoFollowUp {
	isActive: boolean = true;
	endingFollowUp: boolean = false; // no se le hace más seguimiento 

	fe_inicio: string = '';
	fets_inicio:    number = 0;

	// asignados: Array<AsignadosSeguimiento> = [];
	slug: string = 'Inicia seguimiento tutelado/a';

	//Caso indice asignado a... 
	isAsignado: boolean = false;
	asignadoId: string = '';
	asignadoSlug: string = ''


	fe_ucontacto: string = '';
	fe_ullamado: string = '';

	qllamados: number = 0;   // llamados totales
	qcontactos: number = 0; // llamados con respuesta del afectado

	lastCall: string = 'logrado';// resultadoSeguimientoOptList 'pendiente|logrado|nocontesta'
	qIntents: number = 0;

	//tipo: string = 'sospecha'; //tipoSeguimientoAfectadoOptList
	avance: string = 'sindato'; //sintomaOptList
	fase: string = 'fase0' //faseAfectadoOptList


	fets_ucontacto: number = 0;
	fets_ullamado:  number = 0;
	nuevollamadoOffset: number = 0;
	fets_nextLlamado: number = 0;


}


export class CensoFollowUpUpdate {
	isActive: boolean = false;
	endingFollowUp: boolean = false; // no se le hace más seguimiento 

	fe_llamado: string = '';
	resultado: string = ''; // resultadoFollowUpOptList
	avance: string = ''; // avanceFollowUpOptList
	//tipo: string = 'sospecha'; //tipoSeguimientoAfectadoOptList esquemas de llamados, si hubiera
	nuevollamadoOffset: number = 0;  // offsetFollowUpOptList
	

	slug: string = ''; // mensaje o comentario del contactado
	indicacion: string = ''; // mensaje indicacion del censista

	fets_llamado: number = 0;
	audit: Audit;

}

export class Audit {
	userId:      string;
	username:    string;
	ts_alta: number;
};


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
		followUp: CensoFollowUp;
		followUpdates: Array<CensoFollowUpUpdate>;


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

	empresa: string;

};

export interface OptListToken {
	val: string;
	label: string;
};

export interface UpdateCensoEvent {
	action: string;
	type: string;
	token: CensoIndustrias;
};

export class CensoListDataSource extends ArrayDataSource<CensoIndustrias> {

	constructor(private sourceData: BehaviorSubject<CensoIndustrias[]>,
				private _paginator: MatPaginator){
	  super(sourceData);
	}
  
	connect(): Observable<CensoIndustrias[]> {
  
	  const displayDataChanges = [
		this.sourceData,
		this._paginator.page
	  ];
  
	  return merge(...displayDataChanges).pipe(
		  map(() => {
			const data = this.sourceData.value.slice()
  
			const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
			return data.splice(startIndex, this._paginator.pageSize);
		  })
	   );
	}
  
	disconnect() {}
  
  }
  
  


