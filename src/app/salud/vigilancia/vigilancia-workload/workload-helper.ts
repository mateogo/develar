export class WorkloadHelper {
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
  
  