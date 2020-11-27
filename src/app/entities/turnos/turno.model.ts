export class RequirenteTurno {
  personId: string;
  userId: string;
  ndoc: string;
  displayName: string;
}

/*
Ejemplos de avance para sol. de asistencia:

'emitido', 'descartado', 'esperamedico', 'enobservacion', 'nocontesta', 'enaislamiento', 'esperasame'

*/


export class Turno {
  _id: string;
  turnoId?: string;
  requirente?: RequirenteTurno;
  estado?: 'activo' | 'cancelado' | null;
  avance?: 'pendiente' | 'ausente' | 'reprogramado' | 'noconfirmado' | null;
  sede?: string;
  txFecha?: string;
  txHora?: string;
  tsFechaHora?: Number;
  detalle?: string;
  tipoConsulta?: 'audio' | 'video' | 'documental' | 'fotografia' | null;
  source?: 'admin' | 'user' | null;
}


export class TurnoTable {
  _id: string;
  estado: string;
  sede: string;
  ndoc: string;
  displayName: string;
  txFechaHora: string;
  tsFechaHora: string;
  detalle: string;
  tipoConsulta: string;
  avance: string;
}


export class TurnoQuery {
  sede: string;
  tipoConsulta: string;
  estado: string;
  fechaDesde: string;
  fechaHasta: string;
}


export class TurnoDisponible {
  _id: string;
  estado?: 'activo' | 'cancelado' | null = 'activo';
  duracion?: number;
  thorario?: number;
  dow?: number;
  hora?: number;
  sede?: string;
  capacidad?: number;
  slug?: string;
}

