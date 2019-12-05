/**
	OBSERVACIONES HELPER
*/
import { Observacion } from './observaciones.model';
import { devutils }    from '../utils';

const observacionesTypeOptList: Array<any> = [
		{val: 'general',      type:'General',          label: 'General' },
		{val: 'tramitacion',  type:'Tramitación',      label: 'Tramitación' },
		{val: 'violencia',    type:'Violencia',        label: 'Violencia' },
		{val: 'reclamo',      type:'Reclamo',          label: 'Reclamo' },
		{val: 'articulacion', type:'Articulación',     label: 'Articulación' },
		{val: 'emergencia',   type:'Emergencia',       label: 'Emergencia' },
		{val: 'tsocial',      type:'Intervención TS',  label: 'Intervención TS' },

];

const optionsLists = {
		default: observacionesTypeOptList,
		type: observacionesTypeOptList,
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
