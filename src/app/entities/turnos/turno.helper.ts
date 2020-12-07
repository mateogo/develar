import { formatDate } from '@angular/common';
import { Turno, TurnoTable, TurnoQuery } from './turno.model';
import { devutils } from '../../develar-commons/utils';

const sedesList = [
  { val: 'no_definido', label: 'Sin selección', slug: 'no_definido' },
  // { val: 'alem', label: 'Sede Alem', slug: 'alem' },
  { val: 'pindustrial', label: 'Sede Parque Industrial', slug: 'Parque Industrial' },
  // { val: 'pichincha', label: 'Sede Pichincha', slug: 'pichincha' },
  { val: 'secretaria', label: 'Secretaría de Producción', slug: 'Secretaría de Producción' },
];

const tipoConsultaList = [
  { val: 'no_definido', label: 'Sin selección', slug: 'no_definido' },
  { val: 'documental', label: 'Documentación', slug: 'Documentación', sede: 'secretaria' },
  { val: 'censo', label: 'Asistencia Censo 2020', slug: 'Censo', sede: 'secretaria' },
  { val: 'capacitacion', label: 'Programa capacitaciones', slug: 'Capacitaciones', sede: 'pindustrial' },
];

const turnoEstadosList = [
  { val: 'no_definido', label: 'Sin selección', slug: 'no_definido' },
  { val: 'activo', label: 'Activo', slug: 'activo' },
  { val: 'cancelado', label: 'Cancelado', slug: 'cancelado' },
];

const turnoAvanceList = [
  { val: 'no_definido', label: 'Sin selección', slug: 'no_definido' },
  { val: 'pendiente', label: 'Pendiente', slug: 'pendiente' },
  { val: 'noconfirmado', label: 'No confirmado', slug: 'reprogramado' },
  { val: 'ausente', label: 'Ausente', slug: 'ausente' },
  { val: 'reprogramado', label: 'Reprogramado', slug: 'reprogramado' },
  { val: 'cancelado', label: 'Cancelado', slug: 'cancelado' },
  
  
]

const default_option_list: Array<any> = [
  { val: 'no_definido', type: 'no_definido', label: 'no_definido' },
];

const optionsLists = {
  default: default_option_list,
  sede: sedesList,
  tipoConsulta: tipoConsultaList,
  estado: turnoEstadosList,
  avance: turnoAvanceList
};

function getLabel(list, val) {
  const t = list.find((item) => item.val === val);
  return t ? t.label : val;
}

function getOptListToken(list, val) {
  const t = list.find((item) => item.val === val);
  return t ? t : null;
}

export class TurnoHelper {
  static cleanQueryToken(query: TurnoQuery): TurnoQuery {
    if (!query) { return null; }

    Object.keys(query).forEach((key) => {
      if (query[key] == null || query[key] === 'no_definido') { delete query[key]; }
    });

    return query;
  }

  static getOptionList(type) {
    return optionsLists[type] || optionsLists['default'];
  }

  static getOptionLabelFromList(list, val) {
    if (!val) { return 'no_definido'; }
    return getLabel(list, val);
  }

  static getOptionLabel(type, val) {
    if (!val) { return 'no_definido'; }
    if (!type) { return val; }
    return getLabel(this.getOptionList(type), val);
  }

  static getSedesList() {
    return sedesList;
  }

  static getSedeByKey(key: string) {
    return sedesList.find((item) => item.val === key).label;
  }

  static getTipoConsultaList() {
    return tipoConsultaList;
  }

  static getTipoConsultaByKey(key: string) {
    return tipoConsultaList.find((item) => item.val === key).label;
  }

  static getTurnoEstadosList() {
    return turnoEstadosList;
  }

  static getTurnoEstadoAvanceList() {
    return turnoAvanceList;
  }

  static buildTurneraBrowseDataTable(itemList: Turno[]): TurnoTable[] {
    return itemList.map((token) => {
      const tableCell = new TurnoTable();

      tableCell._id = token._id;
      tableCell.detalle = token.detalle;

      tableCell.displayName = token.requirente.displayName;
      tableCell.ndoc = token.requirente.ndoc;
      tableCell.txFechaHora = token.txFecha + ' ' + devutils.txFromHora(new Date(0,0,0,parseInt(token.txHora, 10)));

      tableCell.estado = TurnoHelper.getOptionLabel('estado', token.estado);
      tableCell.sede = TurnoHelper.getOptionLabel('sede', token.sede);

      tableCell.tipoConsulta = TurnoHelper.getOptionLabel(
        'tipoConsulta',
        token.tipoConsulta
      );
      tableCell.avance = TurnoHelper.getOptionLabel('avance', token.avance);

      return tableCell;
    });
  }
}
