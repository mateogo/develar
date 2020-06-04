/**
	TASKS HELPER
*/
import { Task } from './tasks.model';
import { devutils }    from '../utils';


const tasksAsisprevencionOptList: Array<any> = [
        {val: 'alimentos',    label: 'Asis Alimentaria (SDDSS)' },
        {val: 'tramites',     label: 'Tramitación, compra' },
        {val: 'medicamento',  label: 'Requiere medicamentos (SS)' },
        {val: 'vigilancia',   label: 'Reportar a Vigilancia Epidemio' },
];

const tasksCensoOptList: Array<any> = [
		{val: 'consulta',     type: 'consulta',     label: 'Consulta Empresa' },
		{val: 'observación',  type: 'observacion',  label: 'Observación Empresa' },
    {val: 'notificacion', type: 'notificacion', label: 'Notificación MAB' },
		{val: 'general',      type: 'general',      label: 'General' },
    {val: 'no_definido',  type: 'no_definido',  label: 'Sin selección' },

];

const optionsLists = {
		default: tasksAsisprevencionOptList,
		asisprevencion: tasksAsisprevencionOptList,
		salud: tasksAsisprevencionOptList
};

function getLabel(list, val){
		let t = list.find(item => item.val === val)
		return t ? t.label : val;
}

export interface UpdateTaskEvent {
	action: string;
	token: Task;
};

export class TasksHelper {
	static getOptionlist(type){
		return optionsLists[type] || optionsLists['default'];
	}

	static getOptionLabel(type, val){
		if(!val) return 'no-definido';
		if(!type) return val;
		return getLabel(this.getOptionlist(type), val);
	}

	static initNewTask(spec): Task{
		let fe = new Date();
		let task = new Task();
		task.type = spec.type || 'general';

		task.fe_alta = devutils.txFromDate(fe);
		task.fe_alta_ts = fe.getTime();
		task.ts_umod = task.fe_alta_ts;
		task.parent = spec.parent;
		task.audit = spec.audit;
		return task;

	}


}
