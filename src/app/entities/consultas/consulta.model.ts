import { devutils } from '../../develar-commons/utils';

export class Pase {
  _id : string;
  fe_nov: string;
  ho_nov : string;
  fets_nov: number = 0;
  emisor: string;
  ejecucion: string = ''; //ejecucionOptList;
  novedadTx : string = '';


  sector: string = '';
  estado : string = '';
  paseTx : string = '';

  isCumplida: boolean = false;
  atendidox: Atendido;
}

export class Atendido {
  userAdmId: string;
  userWebId: string;
  slug: string;
}

export class Requirente {
  userId: string;
  personId: string;
  slug: string;
}

export class AsesoramientoTecnico {
  institucion: string;
  solicitud: string;
  contacto: string;
}

export class MaterialSolicitado {
  tmaterial: string;
  identificador: string;
  destino: string;
}

export class Consulta {
  _id?: string;
  isActive: boolean = false;
  type: string = 'consulta'; //consultaTypeOptList

  //intervencion: string = '';
  urgencia: number = 0; // 1,2,3
  fecomp_txa: string;
  fecomp_tsa: number;

  description: string = '';

  sector: string = ''; // salud.model.sectores

  hasNecesidad: boolean = false;
  fe_necesidad: string = '';
  fets_necesidad: number = 0;

  hasCumplimiento: boolean = false;
  estado: string = 'activa'; // estadosOptList
  ejecucion: string = 'emitido'; // ejecucionOptList

  pases: Pase[] = [];
  //atendidox: Atendido;
  requirente: Requirente;
  asesoramiento: AsesoramientoTecnico;
  material: MaterialSolicitado;

  constructor() {
    const hoy = new Date();

    this.fecomp_tsa = hoy.getTime();
    this.fecomp_txa = devutils.txFromDate(hoy);
  }
}

export class ConsultaTable {
  _id: string;
  estado: string;
  ejecucion: string;
  ndoc: string;
  displayName: string;
  txFecha: string;
  tsFecha : number;
  descripcion: string;
  requirente: Requirente;
  sector : string;
  tipo : string;
  pasesCount : number;
  isActive : boolean;
  consulta : Consulta;
}

export class ConsultaQuery {
  fechaDesde: number;
  fechaHasta: number;
  estado: string;
  sector : string;
  ejecucion : string;
  userId: string;
}

export class PasesList {

  _id : string;
  fecha : string;
  tsFecha : number;
  estado : string;
  ejecucion : string;
  novedad : string;
  pase : Pase;
  sector : string;
  sectorTX : string;
  responsable : string;
}


