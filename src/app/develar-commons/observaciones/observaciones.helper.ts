/**
	OBSERVACIONES HELPER
*/
import { Observacion } from './observaciones.model';
import { devutils }    from '../utils';

const observacionesTypeOptList: Array<any> = [
		{val: 'general',      type: 'General',         label: 'General' },
		{val: 'tramitacion',  type: 'Tramitación',     label: 'Tramitación' },
    {val: 'resultado',    type: 'Tramitación',     label: 'Resultado Tramitación' },
		{val: 'violencia',    type: 'Violencia',       label: 'Violencia' },
		{val: 'reclamo',      type: 'Reclamo',         label: 'Reclamo' },
		{val: 'articulacion', type: 'Articulación',    label: 'Articulación' },
		{val: 'emergencia',   type: 'Emergencia',      label: 'Emergencia' },
		{val: 'tsocial',      type: 'Intervención TS', label: 'Intervención TS' },
    {val: 'entrega',      type: 'Entrega',         label: 'Entrega' },
    {val: 'asesoria',     type: 'Asesoria',        label: 'Asesoría general' },
    {val: 'expediente',   type: 'expediente',      label: 'Apertura expediente' },
    {val: 'subsidio',     type: 'subsidio',        label: 'Tramitación subsidio' },
    {val: 'notificacion', type: 'notificacion',    label: 'Notificación' },
    {val: 'entrevista',   type: 'entrevista',      label: 'Entrevista TS' },
    {val: 'informe',      type: 'informe',         label: 'Informe SE TS' },
    {val: 'relevamiento', type: 'relevamiento',    label: 'Relevam SA TS' },
    {val: 'otros',        type: 'otros',           label: 'Otros' },
    {val: 'no_definido',  type: 'no_definido',     label: 'Sin selección' },

];

const observacionesCCKOptList: Array<any> = [
		{val: 'general',      type: 'General',         label: 'General' },
		{val: 'tramitacion',  type: 'Tramitación',     label: 'Tramitación' },
		{val: 'reclamo',      type: 'Reclamo',         label: 'Reclamo' },
		{val: 'articulacion', type: 'Articulación',    label: 'Articulación' },
    {val: 'entrega',      type: 'Entrega',         label: 'Entrega' },
    {val: 'expediente',   type: 'expediente',      label: 'Apertura expediente' },
    {val: 'notificacion', type: 'notificacion',    label: 'Notificación' },
    {val: 'entrevista',   type: 'entrevista',      label: 'Entrevista' },
    {val: 'informe',      type: 'informe',         label: 'Informe ' },
    {val: 'relevamiento', type: 'relevamiento',    label: 'Relevam ' },
    {val: 'otros',        type: 'otros',           label: 'Otros' },
    {val: 'no_definido',  type: 'no_definido',     label: 'Sin selección' },

];

const saludAsisprevencionOptList: Array<any> = [
        {val: 'alimentos',    label: 'Asis Alimentaria (SDDSS)' },
        {val: 'tramites',     label: 'Tramitación, compra' },
        {val: 'medicamento',  label: 'Requiere medicamentos (SS)' },
        {val: 'vigilancia',   label: 'Reportar a Vigilancia Epidemio' },
];

const observacionesCensoOptList: Array<any> = [
		{val: 'consulta',     type: 'consulta',     label: 'Consulta Empresa' },
		{val: 'observación',  type: 'observacion',  label: 'Observación Empresa' },
    {val: 'notificacion', type: 'notificacion', label: 'Notificación MAB' },
		{val: 'general',      type: 'general',      label: 'General' },
    {val: 'no_definido',  type: 'no_definido',  label: 'Sin selección' },

];

const optionsLists = {
		default: observacionesTypeOptList,
		type:    observacionesTypeOptList,
		cck:     observacionesCCKOptList,
		censo:   observacionesCensoOptList,
		asisprevencion: saludAsisprevencionOptList,
		salud: saludAsisprevencionOptList
};

function getLabel(list, val){
		let t = list.find(item => item.val === val)
		return t ? t.label : val;
}

export interface UpdateObservacionEvent {
	action: string;
	token: Observacion;
};

export class ObservacionesHelper {
	static getOptionlist(type){
		return optionsLists[type] || optionsLists['default'];
	}

	static getOptionLabel(type, val){
		if(!val) return 'no-definido';
		if(!type) return val;
		return getLabel(this.getOptionlist(type), val);
	}

	static initNewObservacion(spec): Observacion{
		let fe = new Date();
		let obs = new Observacion();
		obs.type = spec.type || 'general';

		obs.fe_tx = devutils.txFromDate(fe);
		obs.fe_ts = fe.getTime();
		obs.ts_umod = obs.fe_ts;
		obs.parent = spec.parent;
		obs.audit = spec.audit;
		return obs;

	}


}
