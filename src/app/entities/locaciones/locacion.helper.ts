import { LocacionHospitalaria, LocacionHospTable, Servicio, Recurso, LocacionEvent} from './locacion.model';


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
      srv.srvQMax = 0;
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

const areasOptList: Array<any> = [
    {val: 'UTI',           ord: '1.1', label: 'UTI'          },
    {val: 'UTE',           ord: '1.2', label: 'UTE'          },
    {val: 'UCO',           ord: '1.3', label: 'UCO'          },
    {val: 'INTERNACION',   ord: '1.4', label: 'INT-GENERAL'  },
    {val: 'AISLAMIENTO',   ord: '2.1', label: 'AISLAMIENTO'  },
    {val: 'CONSULEXT',     ord: '3.1', label: 'CONSULTORIO EXT'},
    {val: 'GUARDIA',       ord: '3.2', label: 'GUARDIA'      },

    {val: 'TRANSITO',      ord: '4.1', label: 'TRANSITO'     },
    {val: 'TRASLADO',      ord: '4.2', label: 'TRASLADO'     },
    {val: 'ADMISION',      ord: '5.1', label: 'ADMISIÓN'     },
    {val: 'EXTERNACION',   ord: '5.2', label: 'EXTERNACIÓN'  },

];

const serviciosOptList: Array<any> = [
    {val: 'UTI',           target: 'UTI',           ord: '1.1', label: 'UTI'          },
    {val: 'UTE',           target: 'UTI',           ord: '1.2', label: 'UTE'          },
    {val: 'UCO',           target: 'UTI',           ord: '1.3', label: 'UCO'          },
    {val: 'INTERNACION',   target: 'INTERNACION',   ord: '1.4', label: 'INT-GENERAL'  },
    {val: 'AISLAMIENTO',   target: 'INTERNACION',   ord: '2.1', label: 'AISLAMIENTO'  },
    {val: 'CONSULEXT',     target: 'GUARDIA',       ord: '3.1', label: 'CONS-EXT'     },
    {val: 'GUARDIA',       target: 'GUARDIA',       ord: '3.2', label: 'GUARDIA'      },
];



const especialidadesOptList: Array<any> = [
    {val: 'PEDIATRIA',         ord: '1.2', label: 'PEDIATRIA'    },

];

const queueOptList: Array<any> = [
    {val: 'POOL',          ord: '1.1', label: 'POOL'      },
    {val: 'TRANSITO',      ord: '1.2', label: 'TRANSITO'  },
    {val: 'ALOCADO',       ord: '1.3', label: 'ALOCADO'   },
    {val: 'BAJA',          ord: '1.4', label: 'BAJA'      },
];


const hospitalTypeOptList: Array<any> = [
    {val: 'no_definido',   label: 'Seleccione opción' },
    {val: 'HOSPPROV',      label: 'HOSP PROV'  },
    {val: 'HOSPNAC',       label: 'HOSP NAC'   },
    {val: 'EXHOSP',        label: 'EXTRA HOSP' },
    {val: 'CAPS',          label: 'CAPS' },
];

const recursosTypeOptList: Array<any> = [
    {val: 'no_definido',   label: 'Seleccione opción' },
    {val: 'CAMA',         label: 'CAMA'  },
    {val: 'RESPIRADOR',   label: 'RESPIRADOR'   },
];

const tableActionsOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',   slug:'Seleccione opción' },
      {val: 'editarencuestas',       label: 'Edición entrevistas SA',        slug:'Edición entrevistas SA' },
      {val: 'autorizar',    label: 'Autorizar solicitud', slug:'Autorizar solicitud' },
]

const optionsLists = {
   default: default_option_list,
   servicios: serviciosOptList,
   especialidades: especialidadesOptList,
   hospital: hospitalTypeOptList,
   tableactions: tableActionsOptList,
   recursos: recursosTypeOptList,
}

