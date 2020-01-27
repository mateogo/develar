import { Pcultural, PculturalTable } from './pcultural/pcultural.model';

import { devutils } from '../develar-commons/utils';

import { Serial }   from '../develar-commons/develar-entities';

export class SisplanService {

	static filterActivePculturales(list: Pcultural[]): Pcultural[]{
		if(!list || !list.length) return [];

		let filteredList = list.filter(t => {
			let valid = true;

			return valid;
		})

		return filteredList;
	}

  static initNewPcultural(sector, type, stype, slug,  serial?: Serial){
    let ts = Date.now();
    let token = new Pcultural();


    token.fecomp = devutils.txFromDateTime(ts);
    token.fecomp_ts = ts;

    token.sector = sector;
    token.type =   type;
    token.stype =  stype;
    token.slug =   slug;

    token.description = '';

    if(serial){
      token.compPrefix = serial.compPrefix ;
      token.compName = serial.compName;
      token.compNum = serial.pnumero + "";
    }

    token.estado = 'activo';
    token.avance = 'emitido';

    return token;
  }

	static pculturalSerial(type, name, sector, peso){
		let serial = new Serial();
		serial.type =    'pcultural';     // type
		serial.name =    'pcultural';      // name
		serial.tserial = 'pcultural';
		serial.sector =  'pcultural';    // sector;
		serial.tdoc =    'evento';
		serial.letra =   'X';  //peso

		serial.anio = 0;
		serial.mes = 0;
		serial.dia = 0;
		serial.estado = 'activo';
		serial.punto = 0;
		serial.pnumero = 1;
		serial.offset = 0;
		serial.slug = 'Solicitud de evento cultural CCK';
		serial.compPrefix = 'EVENTO';
		serial.compName = 'S/Evento';
		serial.showAnio = false;
		serial.resetDay = false;
		serial.fe_ult = 0;

		return serial;
	}

  static buildDataTable(list: Pcultural[]){
    return list.map(token => {
      let td = new PculturalTable();
      td._id        = token._id;
      td.compPrefix = token.compPrefix;
      td.compName   = token.compName;
      td.compNum    = token.compNum;
      td.fecomp_ts  = token.fecomp_ts;
      td.fecomp     = token.fecomp;
      td.slug       = token.slug;
      td.description = token.description;
      td.sector     = token.sector;
      td.estado     = token.estado;
      td.avance     = token.avance;
      return td;
    })

  }

}

export interface UpdateListEvent {
  action: string;
  type:   string;
  items:  Array<Pcultural>;
};


export interface UpdateEvent {
  action:  string;
  token:   string;
  payload: Pcultural;
};
