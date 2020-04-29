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
    {val: 'UTI',           ord: '1.1', label: 'UTI'            },
    {val: 'UTIP',          ord: '1.2', label: 'UTI PEDIÁTRICA' },
    {val: 'UTIN',          ord: '1.3', label: 'UTI NEO'        },
    {val: 'UTE',           ord: '1.4', label: 'UTE'            },
    {val: 'UCO',           ord: '1.5', label: 'UCO'            },
    {val: 'INTERNACION',   ord: '2.1', label: 'INT-GENERAL'    },
    {val: 'PEDIATRIA',     ord: '2.2', label: 'INT-PEDIATRÍA'  },
    {val: 'NEONATOLOGÍA',  ord: '2.3', label: 'INT-NEO'        },
    {val: 'MATERNIDAD',    ord: '2.4', label: 'INT-MATERNIDAD' },
    {val: 'TRAUMATOLOGIA', ord: '2.5', label: 'INT-TRAUMATO'   },
    {val: 'CLINICA',       ord: '2.6', label: 'INT-CLÍNICA'    },

    {val: 'AISLAMIENTO',   ord: '4.1', label: 'AISLAMIENTO'    },

    {val: 'CONSULEXT',     ord: '5.1', label: 'CONSULTORIO EXT'},
    {val: 'GUARDIA',       ord: '5.2', label: 'GUARDIA'      },

    {val: 'TRANSITO',      ord: '9.1', label: 'TRANSITO'     },
    {val: 'TRASLADO',      ord: '9.2', label: 'TRASLADO'     },
    {val: 'ADMISION',      ord: '9.3', label: 'ADMISIÓN'     },
    {val: 'EXTERNACION',   ord: '9.4', label: 'EXTERNACIÓN'  },

];

const serviciosOptList: Array<any> = [
    {val: 'UTI',            target: 'intensivos',           ord: '1.1', label: 'UTI'           },
    {val: 'UTIP',           target: 'intensivos',           ord: '1.2', label: 'UTIP'          },
    {val: 'UTIN',           target: 'intensivos',           ord: '1.3', label: 'UTIN'          },
    {val: 'UTE',            target: 'intensivos',           ord: '1.4', label: 'UTE'           },
    {val: 'UCO',            target: 'intensivos',           ord: '1.5', label: 'UCO'           },
    {val: 'INTERNACION',    target: 'intermedios',          ord: '2.1', label: 'INT-GENERAL'   },
    {val: 'PEDIATRIA',      target: 'intermedios',          ord: '2.2', label: 'INT-PEDIATRÍA' },
    {val: 'NEONATOLOGÍA',   target: 'intermedios',          ord: '2.3', label: 'INT-NEO'       },
    {val: 'MATERNIDAD',     target: 'intermedios',          ord: '2.4', label: 'MATERNIDAD'    },
    {val: 'TRAUMATOLOGIA',  target: 'intermedios',          ord: '2.5', label: 'INT-TRAUMATO'  },
    {val: 'CLINICA',        target: 'pediatrica',           ord: '2.6', label: 'INT-CLÍNICA'   },

    {val: 'AISLAMIENTO',    target: 'aislamiento',          ord: '4.1', label: 'AISLAMIENTO'  },

    {val: 'CONSULEXT',      target: 'ambulatorios',         ord: '5.1', label: 'CONS-EXT'     },
    {val: 'GUARDIA',        target: 'ambulatorios',         ord: '5.2', label: 'GUARDIA'      },
];


const especialidadesOptList: Array<any> = [
    {val: 'PEDIATRIA',       ord: '1.2', label: 'PEDIATRÍA'    },
    {val: 'NEONATOLOGIA',    ord: '1.3', label: 'NEONATOLOGÍA'    },
    {val: 'MATERNIDAD',      ord: '1.4', label: 'MATERNIDAD'    },
    {val: 'TRAUMATOLOGIA',   ord: '1.5', label: 'TRAUMATOLOGÍA'    },
    {val: 'CLINICA',         ord: '1.6', label: 'CLÍNICA'    },
    {val: 'GUARDIA',         ord: '1.7', label: 'GUARDIA'    },

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

