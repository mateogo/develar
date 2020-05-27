import { LocacionHospitalaria, LocacionHospTable, Servicio, Recurso, LocacionEvent} from './locacion.model';
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







const hospitalTypeOptList: Array<any> = [
    {val: 'no_definido',   label: 'Seleccione opción' },
    {val: 'HOSPPROV',      label: 'HOSP PROV'  },
    {val: 'HOSPNAC',       label: 'HOSP NAC'   },
    {val: 'EXHOSP',        label: 'EXTRA HOSP' },
    {val: 'PRIVADO',       label: 'PRIVADO'    },
    {val: 'CAPS',          label: 'CAPS'       },
];

const recursosTypeOptList: Array<any> = [
    {val: 'no_definido',   label: 'Seleccione opción' },
    {val: 'CAMA',         label: 'CAMA'  },
    {val: 'RESPIRADOR',   label: 'RESPIRADOR'   },
];

const tableActionsOptList = [
      {val: 'no_definido',  label: 'Seleccione opción',   slug:'Seleccione opción' },
      {val: 'autorizar',    label: 'Autorizar', slug:'Autorizar' },
]


const optionsLists = {
   default: default_option_list,
   servicios: serviciosInternacion,
   especialidades: especialidadesInternacion,
   hospital: hospitalTypeOptList,
   tableactions: tableActionsOptList,
   recursos: recursosTypeOptList,
}

