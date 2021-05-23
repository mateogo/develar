export class WorkloadHelper {
	static getOptionlist(type){
		return optionsLists[type] || optionsLists['default'];
	}

	static getOptionLabelFromList(list, val){
		if(!val) return 'no-definido';
		return getLabel(list, val);
	}

	static getOptionToken(type, val){
		return getOptListToken(this.getOptionlist(type), val);
	}

	static getOptionLabel(type, val){
		if(!val && val !== 0) return '';
		if(!type) return val;
		return getLabel(this.getOptionlist(type), val);
	}

}

export class AsistenciaFollowUp {
    asistenciaId: string;
    idPerson: string;
    tdoc: string;
    sexo: string;
    edad: string;
    telefono: string;
    ndoc: string;
    fecomp_txa: string;
    fecomp_tsa: number;
    requeridox: string;
    slug: string;
  
    hasTelefono: boolean;
    isAsignado: boolean;
  
    asignadoId: string;
    asignadoSlug: string;
    qllamados: number;
    qcontactos: number;
    fUpSlug: string;
    actualState: number;
    hasInvestigacion: boolean;
    city: string;  
}
  
export class UserWorkload {
    asignadoId: string;
    asignadoSlug: string;
    qInvestigacion: number;
    qllamados: number;
    qcontactos: number;
    qcasos: number;
    qcasosSinTel: number;
    qcasosConTel: number;
    qActualState: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0];
}

export class DataFrame {
      tsHasta: number;
      tsDesde: number;
      txDesde: string;
      txHasta: string;
      dateList: Array<string> = [];
}

export class WorkLoad {
    casos: Array<AsistenciaFollowUp>;
    usuarios: Array<any>;
    dataframe: DataFrame;
}

export class EventEmitted {
    action: string;
    type: string;
    token: UserWorkload;
  
}

function getLabel(list, val){
  let t = list.find(item => item.val == val)
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

const default_option_list: Array<any> = [
  {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];

const estadoActualAfectadoOptList = [
	{ val: 0, label: 'SOSPECHA'},
	{ val: 1, label: 'COVID+'},
	{ val: 2, label: 'DESCARTADO'},
	{ val: 4, label: 'FALLECIDO'},
	{ val: 5, label: 'DE ALTA'},
	{ val: 6, label: 'EN MONITOREO'},
	{ val: 7, label: 'SIN DATO'},
];


const optionsLists = {
  default: default_option_list,
  actualState: estadoActualAfectadoOptList,
}
