import { LocacionHospitalaria, DashboardBrowse, LocacionHospTable, OcupacionHospitalaria, OcupacionHospitalariaTable, Servicio, Recurso, LocacionEvent} from './locacion.model';
import { serviciosInternacion, especialidadesInternacion }  from '../../salud/internacion/internacion.helper';



export class  LocacionHelper {

  static getOptionlist(type){
    return optionsLists[type] || optionsLists['default'];
  }

  static getOptionLabelFromList(list, val){
    if(!val) return 'no-definido';
    return getLabel(list, val);
  }

  static getOptionLabel(type, val){
    if(!val) return 'no-definido';
    if(!type) return val;
    return getLabel(this.getOptionlist(type), val);
  }

  static getPrefixedOptionLabel(type, prefix, val){
    if(!val) return 'no-definido';
    if(!type) return prefix + '::' + val;
    return getPrefixedLabel(this.getOptionlist(type), prefix, val);
  }

  static initServiciosInternacion(): Servicio[]{
    let servicios: Servicio[];
    let baseList = this.getOptionlist('servicios');
    servicios = baseList.map(base => {
      let srv = new Servicio();
      srv.srvcode = base.label;
      srv.srvorder = base.ord;
      srv.srvtype = base.val;
      srv.srvQDisp = 0;
      srv.srvQAdic = 0;
      return srv;
    })

    return servicios;
  }

  static initRecursosInternacion(loc: LocacionHospitalaria): Recurso[]{
    let recursos: Recurso[] = [];
    let servicios = loc.servicios;
    if(servicios && servicios.length){
      servicios.forEach(servicio => {
        if(servicio.srvIsActive){
          for(let i=0; i<servicio.srvQDisp; i +=1){
            let rec = new Recurso();
            rec.rtype = 'CAMA';
            rec.rservicio = servicio.srvtype;
            rec.piso = 'PISO';
            rec.sector = 'SECTOR';
            rec.hab = 'HAB';
            rec.code = (i + 1) + '';
            rec.slug = rec.rtype + ':' + rec.code + ' (' + rec.piso + '-' + rec.sector + '-' + rec.hab  + ')';
            rec.description = '';
            recursos.push(rec);
          }
        }

      });
    }


    return recursos;
  }

  static updateRecursosInternacion(loc: LocacionHospitalaria): Recurso[]{
    let recursos: Recurso[] = loc.recursos || [];
    let servicios = loc.servicios;
    if(servicios && servicios.length){
      servicios.forEach(servicio => {

        if(servicio.srvIsActive){
          let actualData = countActualRecursosForServicioType(servicio.srvtype, recursos)
 
          if(actualData < servicio.srvQDisp){
            addNewRecursosToActualList(actualData, servicio, recursos);
          }else if(actualData < servicio.srvQDisp) {
            // delete 
          }

        }

      });
    }
    sortRecursosList(recursos)
    return recursos;
  }


  static rebuildRecursosInternacionLabels(loc: LocacionHospitalaria): Recurso[]{
    let recursos: Recurso[] = loc.recursos;

    if(!(recursos && recursos.length)) return [];

    recursos.forEach(rec => {
      let slug = ''
      if(rec.sector !== 'SECTOR'){

        slug += rec.sector;
      }

      if(rec.piso !== 'PISO'){

        slug +=  slug ? ' ' + rec.piso : rec.piso; 
      }

      if(rec.hab !== 'HAB'){

        slug += slug ? ' H' + rec.hab: 'H' + rec.hab;
      }
      
      if(rec.code){

        slug += slug ? '-' + rec.code : 'CAMA: ' + rec.code;
      }
      rec.slug = slug;

    });

    return recursos;
  }

  static buildDataTable(list: LocacionHospitalaria[]){

    return list.map(token => {
      let td = new LocacionHospTable();
      td._id =  token._id;
      td.code = token.code;
      td.type = token.type;
      td.slug = token.slug;
      td.fecha_tx = token.fecha_tx;
      td.description = token.description;
      td.estado = token.estado;
      td.code = token.code;
      td.code = token.code;

      return td;
    })

  }

  static buildOcupacionDataTable(list: OcupacionHospitalaria[]){

    return list.map(token => {
      let td = new OcupacionHospitalariaTable();
      td._id =  token._id;
      td.slug = token.slug;
      td.fecha_tx = token.fecha_tx;
      td.estado = token.estado; 
     
      let summary = {
        qlocaciones: new Set<string>(),
        qDispUTI: 0,
        qDispUTE: 0, 
        qDispAMB: 0,
        qOcupUTI: 0,
        qOcupUTE: 0, 
        qOcupAMB: 0,
      }
  
      summary = token.servicios.reduce((sum, token) => {
        sum.qlocaciones.add(token.locCode);
        sum.qDispUTI += token.srvcode === "UTI"  ? token.srvQDisp : 0;
        sum.qDispUTE += token.srvcode === "UTE"  ? token.srvQDisp : 0;
        sum.qDispAMB += token.srvcode === "GUAR" ? token.srvQDisp : 0;
        sum.qOcupUTI += token.srvcode === "UTI"  ? token.srvQOcup : 0;
        sum.qOcupUTE += token.srvcode === "UTE"  ? token.srvQOcup : 0;
        sum.qOcupAMB += token.srvcode === "GUAR" ? token.srvQOcup : 0;
        return sum;

      }, summary)

      console.dir(summary)

      td.qlocaciones = summary.qlocaciones.size;
      td.pOcupUTI = summary.qDispUTI ? Math.round((summary.qOcupUTI/summary.qDispUTI) * 100) : 0;
      td.pOcupUTE = summary.qDispUTE ? Math.round((summary.qOcupUTE/summary.qDispUTE) * 100) : 0;
      td.pOcupAMB = summary.qDispAMB ? Math.round((summary.qOcupAMB/summary.qDispAMB) * 100) : 0;
      return td;
    })
  }

	static defaultQueryForTablero(): DashboardBrowse{
		let q = new DashboardBrowse();
		q.estado = "no_definido";
		q.avance = "no_definido";
		q.sintoma = "no_definido";
		q.sector = "no_definido";
		q.locacionhosp = 'GENERAL'

		return q;
	}


}





function addNewRecursosToActualList(count, servicio, recursos: Recurso[]){

    for(let i=count; i<servicio.srvQDisp; i +=1){
      let rec = new Recurso();
      rec.rtype = 'CAMA';
      rec.rservicio = servicio.srvtype;
      rec.piso = 'PISO';
      rec.sector = 'SECTOR';
      rec.hab = 'HAB';
      rec.code = (i + 1) + '';
      rec.slug = rec.rtype + ':' + rec.code + ' (' + rec.piso + '-' + rec.sector + '-' + rec.hab  + ')';
      rec.description = '';
      recursos.push(rec);
    }
}

function sortRecursosList(records: Recurso[]){
    records.sort((fel: Recurso, sel: Recurso)=> {
      let ftoken = fel.rservicio + fel.rtype + fel.piso + fel.sector + fel.hab + fel.code;
      let stoken = sel.rservicio + sel.rtype + sel.piso + sel.sector + sel.hab + sel.code;

      if(ftoken < stoken ) return -1;

      else if(ftoken > stoken ) return 1;

      else return 0;
    });

}


function countActualRecursosForServicioType(type:string, list: Recurso[]){
  let count = 0;
  if(list && list.length){
    count = list.reduce((memo, token) => {
      if (token.rservicio === type) {

        return memo +=1;
         
      }else {

        return memo;
      }

    }, 0)

  }
  return count;
}

function getLabel(list, val){
    let t = list.find(item => item.val === val)
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

const daoConfig = {
  type: 'locacionhosp',
  backendURL: 'api/locacionhospitalaria',
  searchURL: 'api/locacionhospitalaria/search'
}




/****************
  OptionLists  /
**************/

const default_option_list: Array<any> = [
        {val: 'nodefinido',   type:'nodefinido',    label: 'nodefinido' },
];



const capacidadesOptList = [
  {val: 'UTI',            etario: 1, target: 'intensivos',           ord: '1.1', label: 'UTI'           },
  {val: 'UTIP',           etario: 2, target: 'intensivos',           ord: '1.2', label: 'UTIP'          },
  {val: 'UTIN',           etario: 3, target: 'intensivos',           ord: '1.3', label: 'UTIN'          },
  {val: 'UTE',            etario: 1, target: 'intensivos',           ord: '1.4', label: 'UTE'           },
  {val: 'UCO',            etario: 1, target: 'intensivos',           ord: '1.5', label: 'UCO'           },
  {val: 'CIRUGIA',        etario: 1, target: 'otros',                ord: '2.7', label: 'INT-CIRUGÍA'   },
  {val: 'INTERNACION',    etario: 1, target: 'intermedios',          ord: '2.1', label: 'INT-GENERAL'   },
  {val: 'PEDIATRIA',      etario: 2, target: 'intermedios',          ord: '2.2', label: 'INT-PEDIATRÍA' },
  {val: 'NEONATOLOGIA',   etario: 3, target: 'intermedios',          ord: '2.3', label: 'INT-NEO'       },
  {val: 'MATERNIDAD',     etario: 1, target: 'otros',                ord: '2.4', label: 'MATERNIDAD'    },
  {val: 'TRAUMATOLOGIA',  etario: 1, target: 'otros',                ord: '2.5', label: 'INT-TRAUMATO'  },
  {val: 'CLINICA',        etario: 1, target: 'minimos',              ord: '2.6', label: 'CLÍNICA MÉDICA'},
  {val: 'AISLAMIENTO',    etario: 1, target: 'aislamiento',          ord: '4.1', label: 'AISLAMIENTO'  },
  {val: 'CONSULEXT',      etario: 1, target: 'ambulatorios',         ord: '5.1', label: 'CONS-EXT'     },
  {val: 'GUARDIA',        etario: 1, target: 'ambulatorios',         ord: '5.2', label: 'GUARDIA'      },
];


// internacionHelper: capacidadesOptList
const capacidadesGroupByOptList = [
  {val: 'intensivos',    label: 'CUIDADOS INTENSIVOS'   , code: 'UTI'  , slug: 'C.INTENSIVOS'  },
  {val: 'intermedios',   label: 'CUIDADOS INTERMEDIOS'  , code: 'UTE'  , slug: 'C.INTERMED' },
  {val: 'otros',         label: 'OTROS SERVICIOS'       , code: 'OTROS' , slug: 'OTROS'},
  {val: 'minimos',       label: 'CUIDADOS MÍNIMOS'      , code: 'CMÍN' , slug: 'C.MÍNIMOS'},
  {val: 'aislamiento',   label: 'AISLAMIENTO PREVENTIVO', code: 'AISL' , slug: 'AISLAMIENTO'   },
  {val: 'ambulatorios',  label: 'SERVICIO AMBULATORIO'  , code: 'GUAR' , slug: 'AMBULATORIO'   },

];


const capacidadesReportOptList: Array<any> = [
  {val: 'intensivos',    label: 'CUIDADOS INTENSIVOS'   , code: 'UTI'  , slug: 'C.INTENSIVOS'  },
  {val: 'intermedios',   label: 'CUIDADOS INTERMEDIOS'  , code: 'INTERMED'  , slug: 'C.INTERMED' },
  {val: 'ambulatorios',  label: 'SERVICIO AMBULATORIO'  , code: 'GUAR' , slug: 'AMBULATORIO'   },
];

const capacidadesForReport = [
  {val: 'intensivos',    label: 'CUIDADOS INTENSIVOS'   , code: 'UTI'  , slug: 'C.INTENSIVOS'  },
  {val: 'intermedios',   label: 'CUIDADOS INTERMEDIOS'  , code: 'UTE'  , slug: 'C.INTERMED' },
  {val: 'ambulatorios',  label: 'SERVICIO AMBULATORIO'  , code: 'GUAR' , slug: 'AMBULATORIO'   },

];






const hospitalTypeOptList: Array<any> = [
    {val: 'no_definido', label: 'Seleccione opción' },
    {val: 'HOSPAPROV',   label: 'HOSP PROVINCIAL'  },
    {val: 'HOSPBPNAC',   label: 'HOSP NAC'   },
    {val: 'HOSPCPRIV',   label: 'HOSP / CLINICA PRIVADA'    },
    {val: 'HOSPDEXTRA',  label: 'UNIDAD EXTRA HOSPITALARIA' },
    {val: 'CAPS',        label: 'CAPS'       },
];

const locacionesHospitalarias: Array<string> =['HOSPAPROV', 'HOSPBPNAC', 'HOSPCPRIV' ]


const recursosTypeOptList: Array<any> = [
    {val: 'no_definido',   label: 'Seleccione opción' },
    {val: 'CAMA',         label: 'CAMA'  },
    {val: 'RESPIRADOR',   label: 'RESPIRADOR'   },
];

const tableActionsOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',   slug:'Seleccione opción' },
      {val: 'autorizar',    label: 'Autorizar', slug:'Autorizar' },
]

const ocupacionTableActionsOptList = [
  {val: 'no_definido',  label: 'Seleccione opción',   slug:'Seleccione opción' },
  {val: 'editar',    label: 'Editar', slug:'Editar' },
]



const optionsLists = {
   default: default_option_list,
   servicios: serviciosInternacion,
   especialidades: especialidadesInternacion,
   hospital: hospitalTypeOptList,
   tableactions: tableActionsOptList,
   ocupaciontableactions: ocupacionTableActionsOptList,
   recursos: recursosTypeOptList,
   capacidades: capacidadesOptList,
   capacidadesagrupadas: capacidadesGroupByOptList,
   capacidadesreporte: capacidadesForReport,
   hospitalaria: locacionesHospitalarias
}

