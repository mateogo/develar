/**
 * Asistencia: Prevención de Salud. Secretaría de Salud
 */

const whoami =  "models/asisprevencionModel: ";

const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const utils = require('../services/commons.utils');
const person = require('./personModel');
const product = require('./productModel');
const Excel =    require('exceljs')
const mapUtils = require('../services/maputils.js');

const Schema = mongoose.Schema;

const self = this;

const requirenteSch = new Schema({
  id:       { type: String, required: false },
  slug:     { type: String, required: false },
  nombre:   { type: String, required: false },
  apellido: { type: String, required: false },
  tdoc:     { type: String, required: false },
  ndoc:     { type: String, required: false },
});
 
const atendidoSch = new Schema({
  id:      { type: String, required: false },
  slug:    { type: String, required: false },
  sector:  { type: String, required: false },
});

const alimentoSch = new Schema({
    type:        { type: String, required: false },
    periodo:     { type: String, required: false },
    fe_tsd:      { type: Number, required: false },
    fe_tsh:      { type: Number, required: false },
    fe_txd:      { type: String, required: false },
    fe_txh:      { type: String, required: false },
    freq:        { type: String, required: false },
    qty:         { type: String, required: false },
    observacion: { type: String, required: false },
})

const modalidadSch = new Schema({
    periodo:     { type: String, required: false },
    fe_tsd:      { type: Number, required: false },
    fe_tsh:      { type: Number, required: false },
    fe_txd:      { type: String, required: false },
    fe_txh:      { type: String, required: false },
    freq:        { type: String, required: false },
})

const itempedidoSch = new Schema({
  slug:      { type: String, required: false },
  kitItem:   { type: Number, required: false },
  productId: { type: String, required: false },
  code:      { type: String, required: false },
  name:      { type: String, required: false },
  ume:       { type: String, required: false },
  qty:       { type: Number, required: false },
  punitario: { type: Number, required: false },

})
const avanceNovedadSch = new Schema({
    fe_nov:       { type: String,  required: false },
    fets_nov:     { type: Number,  required: false },
    ejecucion:    { type: String,  required: false },
    sector:       { type: String,  required: false },
    intervencion: { type: String,  required: false },
    slug:         { type: String,  required: false },
    isCumplido:   { type: Boolean, required: false },
    userId:       { type: String,  required: false },
    userSlug:     { type: String,  required: false },
})

const novedadSch = new Schema({
    isActive:     { type: Boolean, required: false },
    tnovedad:     { type: String,  required: false },
    novedad:      { type: String,  required: false },
    sector:       { type: String,  required: false },
    intervencion: { type: String,  required: false },
    urgencia:     { type: Number,  required: false },

    fecomp_txa:   { type: String,  required: false },
    fecomp_tsa:   { type: Number,  required: false },

    hasNecesidad: { type: Boolean,  required: false },
    fe_necesidad: { type: String,   required: false },
    fets_necesidad: { type: Number, required: false },

    hasCumplimiento: { type: Boolean, required: false },
    estado:          { type: String,  required: false },
    avance:          { type: String,  required: false },
    ejecucion:       { type: String,  required: false },
    actividades:     [ avanceNovedadSch ],
    atendidox:       { type: atendidoSch, required: false },
})

const locacionSch = new Schema({
    street1:       { type: String,  required: false},
    street2:       { type: String,  required: false},
    streetIn:      { type: String,  required: false},
    streetOut:     { type: String,  required: false},
    city:          { type: String,  required: false},
    barrio:        { type: String,  required: false},
    hasBanio:      { type: Boolean, required: false, defalut: false},
    hasHabitacion: { type: Boolean, required: false, defalut: false},
    zip:           { type: String,  required: false},
    lat:           { type: Number,  required: false},
    lng:           { type: Number,  required: false},
});


const pedidoSch = new Schema({
    id:        { type: String, required: false },
    modalidad: { type: modalidadSch, required: false },
    deposito:  { type: String, required: false },
    type:  { type: String, required: false },
    urgencia:  { type: Number, required: false },
    kitId:     { type: String, required: false },
    kitQty:    { type: Number, required: false },
    estado:    { type: String, required: false },
    avance:    { type: String, required: false },
    causa:     { type: String, required: false },
    observacion: { type: String, required: false },
    items:     [ itempedidoSch ]
});


const encuestaSch = new Schema({
    id:           { type:String, required: false },
    fe_visita:    { type:String, required: false },
    fe_visita_ts: { type:String, required: false },
    urgencia:     { type:Number, required: false },
    locacionId:   { type:String, required: false },
    ruta:         { type:String, required: false },
    barrio:       { type:String, required: false },
    city:         { type:String, required: false },
    trabajador:   { type:String, required: false },
    trabajadorId: { type:String, required: false },
    preparacion:  { type:String, required: false },
    estado:       { type:String, required: false },
    avance:       { type:String, required: false },
    evaluacion:   { type:String, required: false },
})

const contextoDenunciaSch = new Schema({
    denunciante: { type: String, required: false },
    dendoc:      { type: String, required: false },
    dentel:      { type: String, required: false },
    inombre:     { type: String, required: false },
    iapellido:   { type: String, required: false },
    islug:       { type: String, required: false },
})

const vacunaTokenSch = new Schema({
  hasVacuna:     { type: Boolean, required: false, default: false  }, // boolean = false;
  vacuna:        { type: String,  required: false  }, // string = ""
  feVacuna:      { type: String,  required: false  }, // string = ""
  fetsVacuna:    { type: Number,  required: false  }, // number = 0;
  dosisVacuna:   { type: String,  required: false  }, // string = "";
})

const contextoCovidSch = new Schema({
    hasFiebre:    { type: Boolean, required: false },
    fiebreTxt:    { type: String,  required: false },
    fiebre:       { type: Number,  required: false },
    fiebreRB:     { type: Number,  required: false },

    hasViaje:     { type: Boolean, required: false },
    hasContacto:  { type: Boolean, required: false },
    hasEntorno:   { type: Boolean, required: false },

    hasTrabajoAdulMayores: { type: Boolean, required: false },
    hasTrabajoHogares:     { type: Boolean, required: false },
    hasTrabajoPolicial:    { type: Boolean, required: false },
    hasTrabajoHospitales:  { type: Boolean, required: false },
    hasTrabajoSalud:       { type: Boolean, required: false },

    hasSintomas:           { type: Boolean, required: false },

    hasDifRespiratoria: { type: Boolean, required: false },
    hasDolorGarganta:   { type: Boolean, required: false },
    hasTos:             { type: Boolean, required: false },
    hasNeumonia:        { type: Boolean, required: false },
    hasDolorCabeza:     { type: Boolean, required: false },
    hasFaltaGusto:      { type: Boolean, required: false },
    hasFaltaOlfato:     { type: Boolean, required: false },
    sintomas:           { type: String,  required: false },

    hasDiarrea:            { type: Boolean, required: false },
    hasDiabetes:           { type: Boolean, required: false },
    hasHta:                { type: Boolean, required: false },
    hasCardio:             { type: Boolean, required: false },
    hasPulmonar:           { type: Boolean, required: false },
    hasEmbarazo:           { type: Boolean, required: false },
    hasCronica:            { type: Boolean, required: false },
    hasFumador:            { type: Boolean, required: false },
    hasObesidad:           { type: Boolean, required: false },
    comorbilidad:          { type: String, required: false },


    fe_inicio:           { type: String,  required: false },
    sintoma:             { type: String,  required: false },
    fe_prevAlta:         { type: String,  required: false },
    isInternado:         { type: Boolean, required: false },
    tinternacion:        { type: String,  required: false },
    internacionSlug:     { type: String,  required: false },
    derivacion:          { type: String,  required: false },
    derivaSaludMental:   { type: Boolean,  required: false },
    derivaDesarrollo:    { type: Boolean,  required: false },
    derivaHisopado:      { type: Boolean,  required: false },
    derivaOtro:          { type: Boolean,  required: false },
    derivacionSlug:      { type: String,  required: false },

    trabajo:             { type: String, required: false },
    trabajoSlug:         { type: String, required: false },

    contexto:     { type: String,  required: false },

    esperaMedico: { type: Boolean, required: false },
    vistoMedico:  { type: Boolean, required: false },
    indicacion:   { type: String,  required: false },
    problema:     { type: String,  required: false },

    necesitaSame:    { type: Boolean, required: false },
    EsperaTraslado:  { type: Boolean, required: false },
    estaInternado:   { type: Boolean, required: false },
    estaEnDomicilio: { type: Boolean, required: false },

    hasCOVID:      { type: Boolean, required: false },
    isCOVID:       { type: Boolean, required: false },
    actualState:   { type: Number,  required: false },
    avanceCovid:   { type: String,  required: false },

    fe_investig:   { type: String, required: false },
    fets_investig: { type: Number, required: false },
    userInvestig:  { type: String, required: false },
    userAsignado:  { type: String, required: false },
    userId:        { type: String, required: false },
    hasInvestigacion: { type: Boolean, required: false, default: false },

    hasVacuna:     { type: Boolean, required: false  }, // boolean = false;
    vacuna:        { type: String,  required: false  }, // string = ""
    feVacuna:      { type: String,  required: false  }, // string = ""
    fetsVacuna:    { type: Number,  required: false  }, // number = 0;
    dosisVacuna:   { type: String,  required: false  }, // string = "";
  
    vacunaHistory: [ vacunaTokenSch ],
});

 

const internacionAsisSch = new Schema({
    isActive:          { type: Boolean, required: false  },
    tipoCuidado:       { type: String,  required: false  },
    tipoLocacion:      { type: String,  required: false  },
    locacionId:        { type: String,  required: false  },
    locacionSlug:      { type: String,  required: false  },
    locacionTxt:       { type: String,  required: false  },
    fe_internacion:    { type: String,  required: false  },
    fe_alta:           { type: String,  required: false  },
    hasSolinternacion: { type: Boolean, required: false  },
})

const sisaEventSch = new Schema({
    isActive:     { type: Boolean, required: false },
    sisaId:       { type: String,  required: false },
    reportadoPor: { type: String,  required: false },
    fe_reportado: { type: String,  required: false },
    fe_baja:      { type: String,  required: false },
    fe_consulta:  { type: String,  required: false },
    avance:       { type: String,  required: false },
    slug:         { type: String,  required: false },

    fets_reportado: { type: Number,  required: false },
    fets_baja:      { type: Number,  required: false },
    fets_consulta:  { type: Number,  required: false },

});

const sisaEvolucionSch = new Schema({
  isActive:      { type: Boolean, required: false },
  fe_consulta:   { type: String,  required: false },
  avance:        { type: String,  required: false },
  slug:          { type: String,  required: false },
  fets_consulta: { type: Number,  required: false },
})

const muestraLaboratorioSch = new Schema({
  isActive:         { type: Boolean, required: false },

  secuencia:        { type: String,  required: false },
  muestraId:        { type: String,  required: false },
  fe_toma:          { type: String,  required: false },
  tipoMuestra:      { type: String,  required: false },

  locacionId:       { type: String,  required: false },
  locacionSlug:     { type: String,  required: false },

  laboratorio:      { type: String,  required: false },
  laboratorioTel:   { type: String,  required: false },

  metodo:           { type: String,  required: false },

  fe_resestudio:    { type: String,  required: false },
  fe_notificacion:  { type: String,  required: false },

  alerta:           { type: String,  required: false },

  estado:           { type: String,  required: false },
  resultado:        { type: String,  required: false },
  slug:             { type: String,  required: false },

  fets_toma:         { type: Number,  required: false },
  fets_resestudio:   { type: Number,  required: false },
  fets_notificacion: { type: Number,  required: false },
});

const contextoAfectadosSch = new Schema({
    personId:           { type: String,  required: false },
    slug:               { type: String,  required: false },
    hasActiveCovid:     { type: Boolean, required: false },
    hasActiveFollowing: { type: Boolean, required: false },
})

const infeccionFollowUpSch = new Schema({
    isActive:     { type: Boolean, required: false },
    isInternado:  { type: Boolean, required: false },
    isExtradistrito: { type: Boolean, required: false, default: false },
    hasCovid:     { type: Boolean, required: false },
    actualState:  { type: Number,  required: false },
    mdiagnostico: { type: String,  required: false, default: 'noconfirmado' },

    fe_inicio:    { type: String,  required: false },
    fe_confirma:  { type: String,  required: false },
    fe_alta:      { type: String,  required: false },

    avance:         { type: String,  required: false },
    sintoma:        { type: String,  required: false },
    locacionSlug:   { type: String,  required: false },
    tinternacion:   { type: String,  required: false },

    institucion:    { type: String,  required: false, default: 'noinstitucionalizado' },
    institucionTxt: { type: String,  required: false },
    trabajo:        { type: String,  required: false, default: 'sindato'  },
    trabajoTxt:     { type: String,  required: false },

    qcoworkers:   { type: Number,  required: false },
    qcovivientes: { type: Number,  required: false },
    qotros:       { type: Number,  required: false },
    slug:         { type: String,  required: false },

    fets_inicio:   { type: Number,  required: false },
    fets_confirma: { type: Number,  required: false },
    fets_alta:     { type: Number,  required: false },
})

const auditSch = new Schema({
  userId:       { type: String, required: false },
  username:     { type: String, required: false },
  ts_alta:      { type: Number, required: false },
});

const afectadoUpdateSch = new Schema({
    isActive:   { type: Boolean, required: false },
    isAsistido: { type: Boolean, required: false },

    altaVigilancia:  { type: Boolean, required: false },
    altaAsistencia:  { type: Boolean, required: false },
    nuevollamadoOffset: {type: Number, required: false, default: 1},

    fe_llamado: { type: String, required: false },
    resultado:  { type: String, required: false },
    tipo:       { type: String, required: false },

    vector:     { type: String, required: false },
    sintoma:    { type: String, required: false },
    slug:       { type: String, required: false },
    indicacion: { type: String, required: false },
    fets_llamado: { type: Number, required: false },
    audit: { type: auditSch, required: false }
});


const afectadosFollowUpSch = new Schema({
  isActive:      { type: Boolean, required: false },
  isAsistido:    { type: Boolean, required: false },

  altaVigilancia:  { type: Boolean, required: false },
  altaAsistencia:  { type: Boolean, required: false },

  fe_inicio:     { type: String, required: false },
  fe_ucontacto:  { type: String, required: false },
  fe_ullamado:   { type: String, required: false },

  parentId:      { type: String, required: false },
  parentSlug:    { type: String, required: false },
  
  qllamados:     { type: Number, required: false },
  qcontactos:    { type: Number, required: false },

  lastCall:      { type: String, required: false },
  qIntents:      { type: Number, required: false },

  tipo:          { type: String, required: false },
  sintoma:       { type: String, required: false },
  vector:        { type: String, required: false },
  fase:          { type: String, required: false },

  slug:          { type: String, required: false },

  isAsignado:     { type: Boolean, required: false, default: false },
  asignadoId:     { type: String, required: false },
  asignadoSlug:   { type: String, required: false },
 
  isContacto:     { type: Boolean, required: false, default: false },
  derivadoId:     { type: String, required: false },
  derivadoSlug:   { type: String, required: false },
 
 

  fets_inicio:   { type: Number, required: false },
  fets_ucontacto:{ type: Number, required: false },
  fets_ullamado: { type: Number, required: false },
  nuevollamadoOffset: {type: Number, required: false, default: 1},
  fets_nextLlamado: {type: Number, required: false},

})


const morbilidadSch = new Schema({
  active:  { type: String,  required: false },
  tipo:    { type: String,  required: false },
  hasTipo: { type: Boolean, required: false },
  qty:     { type: Number,  required: false },
  slug:    { type: String,  required: false },


})


const casoIndiceSch = new Schema({
  parentId:    { type: String, required: false },
  slug:        { type: String, required: false },
  actualState: { type: Number, required: false },
  nucleo:      { type: String, required: false },

});

/**
 * Creación de un Schema
 * @params
 */
const asisprevencionSch = new Schema({
    compPrefix:  { type: String, required: true },
    compName:    { type: String, required: true },
    compNum:     { type: String, required: true },
    tipo:        { type: Number, required: false },
    prioridad:   { type: Number, required: false },

    mcetec:      { type: Number, required: false, default: 0 },
    fets_cetec:  { type: Number, required: false, default: 0 },

    idPerson:    { type: String, required: false },
    ndoc:        { type: String, required: false },
    tdoc:        { type: String, required: false },
    sexo:        { type: String, required: false },
    edad:        { type: String, required: false },
    fenactx:     { type: String, required: false },
    telefono:    { type: String, required: false },
    tdato:       { type: String, required: false },
    tobservacion:{ type: String, required: false },
    osocial:     { type: String, required: false },
    osocialTxt:  { type: String, required: false },
    contactosEstrechos: { type: Number, required: false },

    idbrown:     { type: String, required: false },
    fecomp_tsa:  { type: Number, required: true },
    fecomp_txa:  { type: String, required: true },
    fenotif_tsa: { type: Number, required: false },
    fenotif_txa: { type: String, required: false },
    action:      { type: String, required: true },
    slug:        { type: String, required: false },
    description: { type: String, required: false },

    sector:      { type: String, required: false },
    estado:      { type: String, required: false },
    avance:      { type: String, required: false },
    ts_alta:     { type: Number, required: false },
    ts_fin:      { type: Number, required: false },
    ts_prog:     { type: Number, required: false },

    sintomacovid: { type: contextoCovidSch, required: false }, 
    denuncia:     { type: contextoDenunciaSch, required: false }, 
 
    locacion:    { type: locacionSch, required: false }, 
    requeridox:  { type: requirenteSch, required: false },
    atendidox:   { type: atendidoSch,   required: false },
    casoIndice:  { type: casoIndiceSch, required: false },


    isVigilado:      { type: Boolean, required: false, default: false },
    hasSeguimiento:  { type: Boolean, required: false, default: false },
    isCovid:         { type: Boolean, required: false, default: false },
    isInternado:     { type: Boolean, required: false, default: false },
    hasParent:       { type: Boolean, required: false, default: false },


    infeccion:         { type: infeccionFollowUpSch, required: false },
    internacion:       { type: internacionAsisSch, required: false },
    sisaevent:         { type: sisaEventSch, required: false },
    followUp:          { type: afectadosFollowUpSch, required: false },

    novedades:         [ novedadSch ],
    muestraslab:       [ muestraLaboratorioSch ],
    sisaEvolucion:     [ sisaEvolucionSch ],
    seguimEvolucion:   [ afectadoUpdateSch ],
    contextoAfectados: [ contextoAfectadosSch ],
    morbilidades:      [ morbilidadSch ],
});

const covidOptList = [ 'SOSPECHA', 'COVID', 'DESCARTADO', 's/d', 'FALLECIDO', 'DE ALTA', 'EN MONITOREO'];
const N_HAB_00 = 'NUC-HAB-00'

asisprevencionSch.pre('save', function (next) {
    return next();
});


function buildQuery(query, today){

  let q = {};
  let nestedOrs = [];
  let comp_range = [];

  if(query['requirenteId']){
      //
      q["idPerson"] =  query['requirenteId'];

      //if(q["isVigilado"]) return q; // es caso único, no filtra por nada más
      return q; // es caso único, no filtra por nada más

  }

  // busco un registro en particular
  if(query['isVigilado']){
    q["isVigilado"] = true;
  }


  if(query['asistenciaId']){
      q["asistenciaId"] = query['asistenciaId'];
      return q;
  }

  if(query['reporte'] && query['reporte']==="SEGUIMIENTO"){
      q = {
            isVigilado: true,
            avance: {$ne: 'anulado'},
          }

      if(query['feDesde_ts'] && query['feHasta_ts']){
        let fedesde = parseInt(query['feDesde_ts'], 10);
        let fehasta = parseInt(query['feHasta_ts'], 10);
        q['seguimEvolucion.fets_llamado'] = { $gte: fedesde, $lt: fehasta };
      }
  }

  if(query['reporte'] && query['reporte']==="WEEKPLANNING"){
    q = {
      isVigilado: true,
      avance: {$ne: 'anulado'},
    }

    if(query['fenovd_ts'] && query['fenovh_ts']){
      let fedesde = parseInt(query['fenovd_ts'], 10);
      let fehasta = parseInt(query['fenovh_ts'], 10);
      q['fecomp_tsa'] = { $gte: fedesde, $lt: fehasta };
    }

    if(query['asignadoId']){
        q["followUp.asignadoId"] = query['asignadoId'];
    }

    if(query['hasCovid']){
      q["infeccion.hasCovid"] = true;
    }

    if(query['casoCovid']){
      q['infeccion.actualState'] = {$in: [1, 4, 5]}; 
    }

    return q;
  }

  if(query['reporte'] && query['reporte']==="WORKLOAD"){
    q = {
          isVigilado: true,
          avance: {$ne: 'anulado'},
        }

    if(query['fenovd_ts'] && query['fenovh_ts']){
      let fedesde = parseInt(query['fenovd_ts'], 10);
      let fehasta = parseInt(query['fenovh_ts'], 10);
      q['fecomp_tsa'] = { $gte: fedesde, $lt: fehasta };
    }
  
    if(query['asignadoId']){
        q["followUp.asignadoId"] = query['asignadoId'];
    }

    if(query['hasCovid']){
      q["infeccion.hasCovid"] = true;
    }

    if(query['casoCovid']){
      q['infeccion.actualState'] = {$in: [1, 4, 5]}; 
    }

    if(query['vigiladoCovid']){
      q["infeccion.isActive"] = true;
    }

    if(query['actualState']){
      q["infeccion.actualState"] = parseInt(query['actualState'], 10);
    }

    if(query['isSeguimiento']){
      q["followUp.isActive"] = true;
      q['followUp.altaVigilancia'] =  {$ne: true};
    }

    if(query['tipoSeguimiento']){
      q["followUp.tipo"] = query['tipoSeguimiento'];
    }

    if(query['avanceCovid']){
      q["infeccion.avance"] = query['avanceCovid'];
    }

    if(query['sintomaCovid']){
      q["infeccion.sintoma"] = query['sintomaCovid'];
    }

    if(query['asistidoId']){
        q["requeridox.id"] = query['asistidoId'];
        return q;
    }


    return q;
  }

  if(query['reporte'] && query['reporte']==="LLAMADOSEPIDEMIO"){
      q = {
            isVigilado: true,
            avance: {$ne: 'anulado'},
          }

      if(query['fenovd_ts'] && query['fenovh_ts']){
        let fedesde = parseInt(query['fenovd_ts'], 10);
        let fehasta = parseInt(query['fenovh_ts'], 10);
        q['seguimEvolucion.fets_llamado'] = { $gte: fedesde, $lt: fehasta };
      }

      if(query['asignadoId']){
          q["followUp.asignadoId"] = query['asignadoId'];
      }

      if(query['hasCovid']){
        q["infeccion.hasCovid"] = true;
      }

      if(query['casoCovid']){
        q['infeccion.actualState'] = {$in: [1, 4, 5]}; 
      }

      if(query['vigiladoCovid']){
        q["infeccion.isActive"] = true;
      }

      if(query['actualState']){
        q["infeccion.actualState"] = parseInt(query['actualState'], 10);
      }

      if(query['isSeguimiento']){
        q["followUp.isActive"] = true;
        q['followUp.altaVigilancia'] =  {$ne: true};
      }

      if(query['tipoSeguimiento']){
        q["followUp.tipo"] = query['tipoSeguimiento'];
      }

      if(query['avanceCovid']){
        q["infeccion.avance"] = query['avanceCovid'];
      }

      if(query['sintomaCovid']){
        q["infeccion.sintoma"] = query['sintomaCovid'];
      }

      if(query['asistidoId']){
          q["requeridox.id"] = query['asistidoId'];
          return q;
      }


      return q;
  }
  if(query['reporte'] && query['reporte']==="INVESTIGACIONESREALIZADAS"){
    q = {
          isVigilado: true,
          avance: {$ne: 'anulado'},
        }

    // OjO: este reporte se obtiene con llamados-browse y las fechas desde/hasta vienen en fenovd_ts/ fenovh_ts
    if(query["fenovd_ts"] && query["fenovh_ts"] ){
      q['fecomp_tsa'] = {$gte: parseInt(query["fenovd_ts"],10), $lt: parseInt(query["fenovh_ts"], 10)} ;
  
    }
      
    if(query['asignadoId']){
        q["sintomacovid.userId"] = query['asignadoId'];
    }

    if(query['hasCovid']){
      q["infeccion.hasCovid"] = true;
    }

    if(query['casoCovid']){
      q['infeccion.actualState'] = {$in: [1, 4, 5]}; 
    }

    if(query['vigiladoCovid']){
      q["infeccion.isActive"] = true;
    }

    if(query['actualState']){
      q["infeccion.actualState"] = parseInt(query['actualState'], 10);
    }

    if(query['sintomaCovid']){
      q["infeccion.sintoma"] = query['sintomaCovid'];
    }

    if(query['asistidoId']){
        q["requeridox.id"] = query['asistidoId'];
        return q;
    }


    return q;
}


  if(query['reporte'] && query['reporte']==="LLAMADOSIVR"){
      let feha = Date.now();
      let fede = feha - (1000 * 60 * 60 * 24 * 15);
      q = {
            avance: {'$ne': 'anulado'},
            telefono: {'$nin': [null, ""]},
            isVigilado: true,
            estado: 'activo',
            hasParent: true,
            fecomp_tsa: { '$gte': fede, '$lt': feha },
            'infeccion.actualState': { '$not': {'$in': [1, 2,  4, 5] } } 
          }
      return q;
  }


  if(query['reporte'] && query['reporte']==="CONTACTOS"){
      q = {
            avance: {$ne: 'anulado'},
            isVigilado: true,
          }
  }

  if(query['reporte'] && query['reporte']==="SINSEGUIMIENTO"){
      q = {
            avance: {$ne: 'anulado'},
            'followUp.altaVigilancia': {$ne: true},
            isVigilado: true,
          }
  }

  if(query['reporte'] && query['reporte']==="LABORATORIO"){
      q = {
            '$or': [{'infeccion.actualState': 0}, {'infeccion.actualState': 1}],
            isVigilado: true,
            'muestraslab': {$exists: true, $ne:[]},
            $expr: {$or: [
                 {$ne: [{"$arrayElemAt": ["$muestraslab.estado", -1]}, "presentada"] },
                 {$eq: [{"$arrayElemAt": ["$muestraslab.resultado", -1]}, "noanalizada"] },
             ]}
      }
      return q;
  }

  if(query['reporte'] && query['reporte']==="COVID"){
      q = {
            'infeccion.actualState': {$in: [1, 4, 5]},
            isVigilado: true,
          }
      return q;
  }

  if(query['reporte'] && query['reporte']==="CONTACTOSESTRECHOS"){
      q = {
            avance: {$ne: 'anulado'},
            isVigilado: true,
          }
  }

  if(query['reporte'] && query['reporte']==="GEOLOCALIZACION"){
    
      q = {
            'infeccion.actualState': {$in: [1, 4, 5]},
            isVigilado: true,
            avance: {$ne: 'anulado'},
          }

  }

  if(query['reporte'] && query['reporte']==="REDCONTACTOS"){
      q = {
            avance: {$ne: 'anulado'},
            isVigilado: true,
          }
      return q;
  }

  if(query['reporte'] && query['reporte']==="DOMICILIOS"){
      q = {
            avance: {$ne: 'anulado'},
            isVigilado: true,
          }
      return q;
  }

  if(query['reporte'] && query['reporte']==="ASIGNACIONCASOS"){
      q = {
            avance: {$ne: 'anulado'},
            isVigilado: true,
          }
      return q;
  }


  if(query['reporte'] && query['reporte']==="LABNEGATIVO"){

      let refDate = today.getTime() - (1000 * 60 * 60 * 24 * 7);

      q = {
            'infeccion.actualState': {$in: [0, 2]},
            isVigilado: true,
            'muestraslab': {$exists: true, $ne:[]},
            $expr: {$and: [

                 {$gte: [{"$arrayElemAt": ["$muestraslab.fets_resestudio", -1]}, refDate] },
                 {$eq: [{"$arrayElemAt": ["$muestraslab.resultado", -1]}, "descartada"] },
             ]}
          }
      return q;
  }

  // busco segun query
  if(query["fecomp_ts_d"] && query["fecomp_ts_h"] ){
    q['fecomp_tsa'] = {$gte: parseInt(query["fecomp_ts_d"],10), $lt: parseInt(query["fecomp_ts_h"], 10)} ;

  }

  if(query["compNum_d"]){
    comp_range.push( {"compNum": { $gte: query["compNum_d"]} });
  }
    
  if(query["compNum_h"]){
    comp_range.push( {"compNum": { $lte: query["compNum_h"]} });
  }

  if(query['hasPrexistentes']){
    q['sintomacovid'] = {$ne: null}


    q["$or"] = [
        {
            'sintomacovid.hasDiabetes': true
        },
        { 
            'sintomacovid.hasHta': true
        },
        { 
            'sintomacovid.hasCardio': true
        },
        { 
            'sintomacovid.hasPulmonar': true
        },
        { 
            'sintomacovid.hasEmbarazo': true
        },
        { 
            'sintomacovid.hasCronica': true
        },
        { 
            'sintomacovid.hasFumador': true
        }, 
        {
            'sintomacovid.hasObesidad': true
        }
    ]

  }

  if(comp_range.length){
    q["$and"] = comp_range;
  }

  if(query['estado']){
      q["estado"] = query['estado'];
  }

  if(query['tdoc']){
      q["tdoc"] = query['tdoc'];
  }

  if(query['ndoc']){
      q["ndoc"] = query['ndoc'];
  }


  if(query['avance']){
      q["avance"] = query['avance'];
  }

  if(!query['avance']){
      q["avance"] = {$ne: 'anulado'};
  }

  if(query['compPrefix']){
      q["compPrefix"] = query['compPrefix'];
  }

  if(query['compName']){
      q["compName"] = query['compName'];
  }

  if(query['idPerson']){
      q["idPerson"] = query['idPerson'];
  }

  if(query['compNum']){
      q["compNum"] = query['compNum'];
  }

  if(query['action']){
      q["action"] = query['action'];
  }

  // if(query['trabajadorId']) {
  //   q['encuesta.trabajadorId'] = query['trabajadorId'];
  // }

  //Novedad novedad novedades Novedades
  let novedadesMatch = {};

  // q['novedades']  = { $elemMatch: {
  //                                   'intervencion': query['intervencion']
  //                                  }
  //                   }

  if(query['urgencia']) {
    novedadesMatch['urgencia'] =  parseInt(query['urgencia'], 10);
    //q['novedades.urgencia'] = parseInt(query['urgencia'], 10);
  }

  if(query['ejecucion']) {
    novedadesMatch['ejecucion'] =  query['ejecucion'];
    //novedades.push({'novedades.ejecucion': query['ejecucion'] });
    //q['novedades.ejecucion'] = query['ejecucion'];
  }

  if(query['intervencion']) {
    novedadesMatch['intervencion'] =  query['intervencion'];
     //novedades.push({'novedades.intervencion': query['intervencion'] });
    //q['novedades.intervencion'] = query['intervencion'];
  }

  if(query['avanceNovedad']) {
    novedadesMatch['avance'] =  query['avance'];
    //novedades.push({'novedades.avance': query['avance'] });
    //q['novedades.avance'] = query['avanceNovedad'];
  }

  if(query['sectorNovedad']) {
    novedadesMatch['sector'] =  query['sectorNovedad'];
    //novedades.push({'novedades.sector': query['sector'] });
    //q['novedades.sector'] = query['sectorNovedad'];
  }

  if(query["fenovd_ts"] && query["fenovh_ts"]){
    novedadesMatch['fecomp_tsa'] = {$gte: parseInt(query["fenovd_ts"],10), $lt: parseInt(query["fenovh_ts"], 10)} ;
    //novedades.push({'novedades.fecomp_tsa':  {$gte: parseInt(query["fenovd_ts"],10), $lt: parseInt(query["fenovh_ts"], 10)} });
   //q['novedades.fecomp_tsa'] = {$gte: parseInt(query["fenovd_ts"],10), $lt: parseInt(query["fenovh_ts"], 10) }
  }

  if(Object.keys(novedadesMatch).length){
      q['novedades']  = { $elemMatch: novedadesMatch }

  }



  // if(novedades.length){
  //   q['$and'] = novedades;
  // }


  //locacion
  if(query['city']) {
    q['locacion.city'] = query['city'];
  }

  if(query['barrio']) {
    q['locacion.barrio'] = query['barrio'];
  }

  if(query['hasParent']){
    q['hasParent'] = true;
  }



  if(query['casosIndice']){
    nestedOrs.push([{'contactosEstrechos': {$gt: 0}}, {'hasParent': false} ])
  }

  if(query['tipo']) {
    q['tipo'] = parseInt(query['tipo'], 10);
  }


  if(query['hasCovid']){
    q["infeccion.hasCovid"] = true;

  }

  if(query['mdiagnostico']){
      q["infeccion.mdiagnostico"] = query['mdiagnostico'];
  }

  if(query['vigiladoCovid']){
    q["infeccion.isActive"] = true;
  }

  if(query['casoCovid']){
    q['infeccion.actualState'] = {$in: [1, 4, 5]}; //  [{'infeccion.actualState': 1}, {'infeccion.actualState': 4}, {'infeccion.actualState': 5}]
  }
  
  if(query['actualState']){
    let qData =  parseInt(query['actualState'], 10);
    q["infeccion.actualState"] = qData;

  }

  if(query['pendLaboratorio']){
    q["muestraslab.estado"] = {$in: ['presentada', 'enestudio']};
  }

  if(query['locacionId']){
    q["muestraslab.locacionId"] = query['locacionId'];
  }

  if(query['isSeguimiento']){
    q["followUp.isActive"] = true;
    q['followUp.altaVigilancia'] =  {$ne: true};

    if(query['nextCallDate']){
      q['followUp.fets_nextLlamado'] =  {$lte: utils.dateNumFromTx(query['nextCallDate']) };
    }
  }

  if(query['tipoSeguimiento']){
    q["followUp.tipo"] = query['tipoSeguimiento'];
  }

  if(query['resultado']){
    q["followUp.lastCall"] = query['resultado'];
  }

  if(query['userAsignado']){
    q["sintomacovid.userAsignado"] = query['userAsignado'];
  }


  if(query['qIntents']){
    q["followUp.qIntents"] = { $gte: parseInt(query['qIntents'], 10) } ;
  }

  if(query['qNotSeguimiento']){
    let offset = parseInt(query['qNotSeguimiento'], 10);
    let refDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset).getTime();
    nestedOrs.push([ {'$and': [ { 'followUp.fets_ucontacto': {$lte: refDate} }, {'followUp.lastCall': 'logrado'}]}, {'followUp.lastCall': {'$ne':'logrado'}}] )
  }

  if(query['avanceCovid']){
    q["infeccion.avance"] = query['avanceCovid'];

  }

  if(query['sintomaCovid']){
    q["infeccion.sintoma"] = query['sintomaCovid'];

  }
//1617821677565
//1617850800000

  if(query['isActiveSisa']){    
    q["sisaevent.isActive"] = true;

    if(query['avanceSisa']){
      q["sisaevent.avance"] = query['avanceSisa'];
    }

    if(query['qDaysSisa']){
      let offset = parseInt(query['qDaysSisa'], 10);
      let refDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset).getTime();
      q["sisaevent.fets_consulta"] = { $gte: refDate } ;
    }

    if(query['qNotConsultaSisa']){
      let offset = parseInt(query['qNotConsultaSisa'], 10);
      let refDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset).getTime();
      q["sisaevent.fets_consulta"] = { $lte: refDate } ;
    }

  }

  if(query['userId']){

    if(query['casosIndice']){
      q['followUp.asignadoId'] = query['userId']

    }else {
      //nestedOrs.push([{'followUp.asignadoId': query['userId']}, {'followUp.derivadoId': query['userId']} ])
      q['followUp.asignadoId'] = query['userId']
    }
  }

  if(query['asignadoId']){

    if(query['casosIndice']){
      q["followUp.asignadoId"] = query['asignadoId'];
    }else {
      nestedOrs.push([{'followUp.asignadoId': query['asignadoId']}, {'followUp.derivadoId': query['asignadoId']} ])
    }

  }

  if(nestedOrs.length === 1){
    q['$or'] = nestedOrs[0]
  }

  if(nestedOrs.length > 1){
    let condition = nestedOrs.map(t => {
      return {'$or': t}
    })

    q['$and'] = condition;
  }

  return q; 
}
//estado avance city barrio novedad sector action ejecucion fets_necesidad intervencion

/**
 * El Modelo es el objeto constructor de instancias concretas
 * se obtiene a partir del Schema
 * @param String: nombre del Modelo
 * @param Schema: Schema a partir del cual crear el modelo
 * @param String: nombre a asignar a las colecciones de modelos (en plural)
 */
const Record = mongoose.model('Asisprevencion', asisprevencionSch, 'asisprevenciones');


/////////   CAPA DE SERVICIOS /////////////

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 */



/* EJEMPLOS
db.asisprevenciones.find({$expr: {$eq: [{"$arrayElemAt": ["$muestraslab.resultado", -1]}, "noanalizada"] } }).count()

db.asisprevenciones.find(

   {$expr: {$or: [
         {$ne: [{"$arrayElemAt": ["$muestraslab.estado", -1]}, "presentada"] },
         {$eq: [{"$arrayElemAt": ["$muestraslab.resultado", -1]}, "noanalizada"] },
     ]}  
}).count()

db.asisprevenciones.find(    
   {
    '$or': [{'infeccion.actualState': 0}, {'infeccion.actualState': 1}],
    isVigilado: true,
    'muestraslab': {$exists: true, $ne:[]},
    $expr: {$or: [
         {$ne: [{"$arrayElemAt": ["$muestraslab.estado", -1]}, "presentada"] },
         {$eq: [{"$arrayElemAt": ["$muestraslab.resultado", -1]}, "noanalizada"] },
     ]}  
},{muestraslab:1, requeridox:1, infeccion:1}).pretty()

db.asisprevenciones.find(    
{
    '$or': [{'infeccion.actualState': 0}, {'infeccion.actualState': 1}],
    isVigilado: true
},{muestraslab:1, requeridox:1, infeccion: 1}).pretty()



*/


exports.getRecord = function(){
  return Record;
}



exports.findAsistenciaFromPerson = function(person){
    let query = {
      requirenteId: person.id,
      isVigilado: true,

    }
    let regexQuery = buildQuery(query, new Date());
    return Record.findOne(regexQuery);
}

exports.updateAsistenciaFromPerson = function(asistencia){
    Record.findByIdAndUpdate(asistencia.id, asistencia, { new: true }).then(token =>{
      //c onsole.log('UPDATED!!! [%s]', token && token.ndoc);
    })
}

 /*************************************************************************************
 * weekplanning: usado en mayo-2021 para evaluar la carga de trabajo del usuario
 * usage: DEVELOPMENT: 
 * localhost:8080/api/asisprevencion/workload
 * 
 * PANIC SCRIPT
 * usage: DEVELOPMENT: 
 * DEBUG=develar:server PORT=8080 NODE_ENV=development DBASE=saludmab SERVER=http://develar-local.co PUBLIC=/public node core/services/panicScript
 * 
 * usage: PRODUCTION: SALUD
 * DEBUG=develar:server PORT=8081 NODE_ENV=production DBASE=salud SERVER=https://salud.brown.gob.ar Pública =/www/salud node core/services/panicScript
 */
  
 exports.userWeekPlanning = userWeekCallPlanning;

 function userWeekCallPlanning(query, errcb, cb){
  console.log('userWeekCallPlanning EPIDEMIO MODEL BEGIN')

  query = query || {}; 
  let regexQuery = buildQuery(query, new Date());
  console.dir(query);
  console.dir(regexQuery);

  _loadCallPlanning(regexQuery).then(asistencias => {
    console.log('userWeekCallPlanning: asistencias: [%s]', asistencias && asistencias.length);
    if(asistencias && asistencias.length){

      let workPlanMap =  _processWorkPlanning(asistencias, cb);
      cb(Array.from(workPlanMap.values()))

    }else {
      console.log('todo: no hay asistencias para el períoodo');
      cb([])
    }
  });
}

function _processWorkPlanning(asistencias, cb){
  let workPlanMap = new Map([
            ['casos',       {fe: 'casos',       fets: 0, qllamados: 0}],
            ['sincontacto', {fe: 'sincontacto', fets: 0, qllamados: 0}],
            ['noplan',      {fe: 'noplan',      fets: 0, qllamados: 0}],
            ['anteriores',  {fe: 'anteriores',  fets: 0, qllamados: 0}]
          ]);

  let dateRefTime = Date.now();
  
  workPlanMap = asistencias.reduce((wp, asis) => {
    if(asis.infeccion && asis.infeccion.actualState === 1 && asis.telefono){
      wp.get('casos').qllamados += 1;

      let followUp = asis.followUp
      if(followUp){

        if(followUp.fets_nextLlamado && followUp.qcontactos){
          if(followUp.fets_nextLlamado < dateRefTime){
            wp.get('anteriores').qllamados += 1;

          }else {
            let fe = utils.txFromDateTime(followUp.fets_nextLlamado);
       
            if(wp.has(fe)){
              wp.get(fe).qllamados += 1;
  
            }else {
              wp.set(fe,  {fe: fe, fets: followUp.fets_nextLlamado, qllamados: 1})
            }
  
          }
       
        }else {
          if(followUp.qcontactos){
            wp.get('noplan').qllamados += 1;

          }else {
            wp.get('sincontacto').qllamados += 1;

          }
        }

      }else{
        wp.get('sincontacto').qllamados += 1;
      }
    }
    return wp;
  }, workPlanMap)

  return workPlanMap;
}

async function _loadCallPlanning(query){
  return await Record.find(query)
                  .select({ndoc: 1, telefono: 1, edad: 1,  infeccion: 1, followUp: 1})
                  .lean()
                  .exec();
}

/**
 * ortegamiriam2204@gmail.com 
 * 5efcc30e2e36303f04fe52da
 * FIN: computeUserWorkLoad
 ******************************/


 /*************************************************************************************
 * computeUserWorkLoad: usado en mayo-2021 para evaluar la carga de trabajo del usuario
 * usage: DEVELOPMENT: 
 * localhost:8080/api/asisprevencion/workload
 * 
 * PANIC SCRIPT
 * usage: DEVELOPMENT: 
 * DEBUG=develar:server PORT=8080 NODE_ENV=development DBASE=saludmab SERVER=http://develar-local.co PUBLIC=/public node core/services/panicScript
 * 
 * usage: PRODUCTION: SALUD
 * DEBUG=develar:server PORT=8081 NODE_ENV=production DBASE=salud SERVER=https://salud.brown.gob.ar PUBLIC=/www/salud node core/services/panicScript
 */

  exports.userWorkload = computeUserWorkLoad;

 function computeUserWorkLoad(query, errcb, cb){

  query = query || {}; 
  let regexQuery = buildQuery(query, new Date());

  console.dir(regexQuery);

  let dateFrame = _buildDateFrame(query);

  _loadAsistencias(regexQuery).then(asistencias => {
    if(asistencias && asistencias.length){

      processWorkLoad(dateFrame, asistencias, cb);

    }else {
      console.log('todo: no hay asistencias para el períoodo');
      cb({})
    }
  });
}

function processWorkLoad(datef, asistencias, cb){

  let asisMapping = asistencias.map(asis => asisMapFunction(asis))

  let userMapping = buildUserMapping(asisMapping);
  //c onsole.dir(userMapping);
  let returnData = buildReturnData(datef, asisMapping, userMapping);
  cb(returnData);


  //_showSample(asisMapping);

}

function buildReturnData(datef, asisMapping, userMapping){
  let returnData = {
    casos: asisMapping,
    usuarios:  Array.from(userMapping),
    dataframe: datef
  }
  return returnData;

}

function asisMapFunction(asis){
  return new MappedAsis(asis)
}

function _showSample(asis){
  let sample = asis.find(t => t.ndoc === '36286721')
  //c onsole.dir(sample);
}

function buildUserMapping(asisMapping){
  let umap = new Map();

  asisMapping.forEach(asis => {
    let asignado = (asis.isAsignado && asis.asignadoId) || 'no_asignado';
    if(umap.has(asignado)){
      let token = umap.get(asignado);
      token.qInvestigacion += asis.hasInvestigacion ? 1 : 0;
      token.qllamados += asis.qllamados;
      token.qcontactos += asis.qcontactos;
      token.qcasos += 1;
      token.qcasosSinTel += asis.hasTelefono ? 0 : 1;
      token.qcasosConTel += asis.hasTelefono ? 1 : 0;
      token.qActualState[asis.actualState] += 1;

      
    }else {
      let token = new MappedUser(asis);

      umap.set(asignado, token);

    }
  

  })

  return umap;
}

class MappedUser {
  asignadoId;
  asignadoSlug;
  qInvestigacion = 0;
  qllamados = 0;
  qcontactos = 0;

  qcasos = 1;
  qcasosSinTel = 0;
  qcasosConTel = 0;
  qActualState = [0, 0, 0, 0, 0, 0, 0, 0];

  constructor(asis){
    this.asignadoId = asis.asignadoId;
    this.asignadoSlug = asis.asignadoSlug;
    this.qInvestigacion = asis.hasInvestigacion ? 1 : 0;
    this.qllamados = asis.qllamados;
    this.qcontactos = asis.qcontactos;
    this.qcasosSinTel = asis.hasTelefono ? 0 : 1;
    this.qcasosConTel = asis.hasTelefono ? 1 : 0;    
    this.qActualState[asis.actualState] = 1;

  }



}

class MappedContactos {
  qllamados = 0;
  qcontactos = 0;


}

class MappedAsis {
  asistenciaId;
  idPerson;
  tdoc;
  sexo = '';
  edad = 0;
  telefono = '';
  ndoc;
  fecomp_txa;
  fecomp_tsa;
  requeridox;
  slug;
  hasTelefono = false;
  isAsignado = false;
  asignadoId = '';
  asignadoSlug = 'SIN ASIGNAR';
  qllamados = 0;
  qcontactos = 0;
  fUpSlug = '';  
  actualState = 7;
  hasInvestigacion = false;
  city = 'almirante brown';

  constructor(asis){
    this.asistenciaId = asis._id.toString();
    this.ndoc = asis.ndoc;
    this.idPerson = asis.idPerson;
    this.fecomp_txa = asis.fecomp_txa;
    this.fecomp_tsa = this.fecomp_txa? utils.dateNumFromTx(this.fecomp_txa) : asis.fecomp_tsa;
    this.requeridox = asis.requeridox.slug;
    this.tdoc = asis.tdoc;
    this.sexo = asis.sexo;
    this.edad = asis.edad;
    this.telefono = asis.telefono;
    this.ndoc = asis.ndoc;
    this.slug = asis.slug;
    this.hasTelefono = asis.telefono && asis.telefono !== 'sin dato';
    
    let fUp = asis.followUp;
    if(fUp){
      this.isAsignado = fUp.isAsignado;
      this.asignadoId = fUp.asignadoId ;
      this.asignadoSlug = fUp.asignadoSlug ;
      this.qllamados = fUp.qllamados ;
      this.qcontactos = fUp.qcontactos ;
      this.fUpSlug = fUp.slug ;
    }

    let infeccion = asis.infeccion;
    if(infeccion){
      this.actualState = infeccion.actualState ;
    }

    let sintomacovid = asis.sintomacovid;
    if(sintomacovid){
      this.hasInvestigacion = sintomacovid.hasInvestigacion ;
    }

    let locacion = asis.locacion;
    if(locacion){
      this.city = locacion.city ;
    }
  }
}

async function _loadAsistencias(query){
  return await Record.find(query).lean().exec();
}

function _buildDateFrame(query){
  //let date = utils.parseDateStr(feTxt);
  //let desdeNum = utils.getProjectedDate(date, -10, 0).getTime();
  //let hastaNum = utils.dateToNumPlusOne(feTxt);
    //txHasta: utils.txFromDateTime(hastaNum),
    //txDesde: utils.txFromDateTime(desdeNum),

  let dateFrame = {
    tsDesde: parseInt(query['fenovd_ts'], 10),
    txDesde: query.fenovd,

    tsHasta:  parseInt(query['fenovh_ts'], 10),
    txHasta:  query.fenovh,
    dateList: utils.dateTxList(parseInt(query['fenovd_ts'], 10), 10)
  }

  //c onsole.log('Date Dif : [%s]', (dateFrame.tsHasta - dateFrame.tsDesde)/(1000 * 60 * 60 * 24))
  //c onsole.dir(dateFrame);
  return dateFrame;
}
/**
 * FIN: computeUserWorkLoad
 ******************************/





/*************************/
/*** RED DE CONTACTOS ***/
/***********************/
const contactosManager = {
  fets_actualizacion: 0,
  master: null,
  masterlist: []
}


const elapsed = 1000 * 60 * 15 // 15 minutos

exports.fetchRedContactos = function (query, errcb, cb){
 
  const entities = getRedContactos(query);

  if( !entities || (query && query['refreshContactos']) ) {
    buildContactosPromise(query);
 
  }else {
    cb(entities)
  }

}


function getRedContactos(query){
  let ts = Date.now()
  if(!contactowManager.master) return null;

  if((ts - contactosManager.fets_actualizacion) > elapsed){
    buildContactosPromise()
    .then(master => {
      //c onsole.log('**** Contactos manager REBUILDED!!');
    })
    .catch(error => console.log(error));

  }

  return contactosManager.masterlist;
}


function buildContactosPromise(query){
  let regexQuery = buildQuery(query, new Date())

  let promise = new Promise((resolve, reject) => {

      Record.find(regexQuery)
            .lean()
            .exec(function(err, entities) {
              if (err) {
                  reject(error);

              }else{
                  if(entities && entities.length){
                    processMasterContactos(entities, query, resolve, reject);

                  }else {
                    resolve([]);
                  }
              }
      });





  })
  return promise;
}

function processMasterContactos(movimientos, query, resolve, reject){
    contactosManager.master = {};
    contactosManager.masterlist = [];
    contactosManager.fets_actualizacion = Date.now();

    movimientos.forEach(asis => {
      if(asis.casoIndice){
        insertContactNode(contactosManager.master, asis, parent)
      }else {
        insertParentNode(parent, asis)

      }

    })

}

function insertContactNode(master, asis, parent){
  let parentId = asis.casoIndice.parentId;
  let key = parentId;

  if(master[key]){
    updateContactNode(master[key], asis);

  }else {
    master[key] = initContactNode(asis, parent);

  }

}

/**** 

class ContactosVigilados {
  personSlug: string;

  
} 

class ContactManager {
  asis_qty: number = 0; // cantidad de contactos con asistencia vigente
  asistenciaId: string; // id de la asitencia índice
  telefonos: string; // telefonos recolectados;
  city: string; // ciudad del caso índice

  nucleos: Array<string> = []; // nucleos existentes;
  [key: string]: Array<ContactosVigilados>

}

****/


function updateContactNode(token, asistencia){
  token.asis_qty +=1;
  let nucleo = asistencia.casoIndice.nucleo || N_HAB_00;
  let city = asistencia.locacion 

  if(token.nucleos.indexOf(nucleo) === -1) {    
    token.nucleos.push(nucleo);
  }

  if(!token.contacts[nucleo]){
    token.contactos[nucleo] = [];
  }

  let contactData = {
    slug: asistencia.requeridox.slug,
    personId: asistencia.idPerson,
    asistenciaId: asistencia._id,
    nucleo: nucleo,
    telefono: asistencia.telefono,
    city: asistencia
  }

  token.contactos.push(contactData);


  if(token.telefono && asistencia.telefono && !token.telefono.includes(asistencia.telefono)){
    token.telefono = token.telefono === 'sin dato' ? asistencia.telefono : token.telefono + ' / ' + asistencia.telefono; 
  }

  if((token.city === 'sin dato' || token.address === 'sin dato') && asistencia.locacion){
    let city = 'sin dato';
    let barrio = 'sin dato';
    let address = 'sin dato';
    let entrecalles = '';

    let locacion = asistencia.locacion;

    if(locacion){
      city = locacion.city || 'sin dato';
      barrio = locacion.barrio || 'sin dato';

      if(locacion.streetIn || locacion.streetOut ){
        entrecalles = (locacion.streetIn && locacion.streetOut) 
            ? ' - Entre ' + locacion.streetIn + ' y ' +  locacion.streetOut
            : ' - Esquina ' + locacion.streetIn ;
      }

      address = (locacion.street1 + entrecalles ) || 'sin dato';
      
      token.city = city
      token.barrio = barrio
      token.address = address
    }
  }



}

function initContactNode(asis, parent){

}


exports.upsertNext = function (query, errcb, cb) {
    let regexQuery = buildQuery(query, new Date());

    Record.find(regexQuery, function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);

        }else{
            cb(entities);

        }
    });
};


/**
 * Retrieve all records
 * @param cb
 * @param errcb
 */
exports.findAll = function (errcb, cb) {
    Record.find(function(err, entities) {
        if (err) {
            errcb(err);
        }else{
            cb(entities);
        }
    });
};



const findByQueryProcessFunction = {

  //'DOMICILIOS' : buildDomiciliosTableReport,
  'REDCONTACTOS'    : buildRedContactos, // grafo loco
  'ASIGNACIONCASOS' : buildCasosPorUsuario, // Cuántos afectados tiene asignado cada usuario
  'CONTACTOS'       : buildContactosMaster, // Selecciona los casos índices + huérfanos
  'SINSEGUIMIENTO'  : afectadosSinResponsableSeguimiento, // Selecciona los casos índices + huérfanos
  'GEOLOCALIZACION' : geolocalizacionContactos, // Reporte adaptado para renderizar mapa
  'LLAMADOSEPIDEMIO' : buildLlamadosEpidemio, // Estadística de llamados realizados por EPIDEMIO a los afectados/a e/fechas
  'INVESTIGACIONESREALIZADAS': buildAuditoriaInvestig, // Auditoría de efectividad de llamados a nuevos pacientes.
};

/**
 * Retrieve records from query /search/?name=something
 * @param cb
 * @param errcb
 * reporte SEGUIMIENTO
 */

exports.buildReporteSeguimiento = buildReporteSeguimiento;

exports.exportarseguimientos = exportarSeguimientos;

function exportarSeguimientos(query, req, res){

  buildReporteSeguimiento(query, null, null, req, res); 

}

function buildReporteSeguimiento(query, errcb, cb, req, res){

    let regexQuery = buildQuery(query, new Date())

    Record.find(regexQuery)
          .lean()
          .exec(function(err, entities) {
              if (err) {
                  console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
                  if(errcb) errcb(err);
              }else{
                  if(entities && entities.length){
                    _buildReporteSeguimiento(entities, query, errcb, cb, req, res)

                  }else {
                    _buildReporteSeguimiento([], query, errcb, cb, req, res)
                  }
              }
    });


}

function _dispatchReporteSeguimientoWorkbook (movimientos, query, req, res){
    let today = Date.now();
    let filename = 'reporte_seguimiento_afectados'+today+'.xlsx'
    let content = 

    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="' + filename + '"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    const worksheet = workbook.addWorksheet('seguimiento')

    worksheet.addRow(['Seguimiento de afectados COVID']).commit()
    worksheet.addRow(['Fecha emisión', new Date().toString()]).commit()

    worksheet.addRow().commit()
    worksheet.addRow(['Vigilancia','DNI','Telefono','Paciente', '#contactos', 'Fecha','Resultado', 'Tipo','COVID','Evolución', 'Indicación','Seguido por', 'FechaNum']).commit();

    movimientos.forEach(token => {
      const { compNum, 
              ndoc, 
              telefono, 
              personSlug, 
              contactosEstrechos,
              fe_llamado,
              fets_llamado,
              resultado,
              tipo,
              covid,
              vector,
              indicacion,
              username } = token;

      worksheet.addRow([
              compNum, 
              ndoc, 
              telefono, 
              personSlug, 
              contactosEstrechos,
              fe_llamado,
              resultado,
              tipo,
              covid,
              vector,
              indicacion,
              username,
              fets_llamado ]).commit()
    })

    worksheet.commit()
    workbook.commit()
}


function _buildReporteSeguimiento(movimientos, query, errcb, cb, req, res){
  let exportExcel = query.searchAction === 'export';

  let fechaDesde = parseInt(query['feDesde_ts'], 10);
  let fechaHasta = parseInt(query['feHasta_ts'], 10);


  let seguimientoArray = [];

  movimientos.forEach(asis => {
    const { 
      compNum, 
      idPerson, 
      ndoc, 
      telefono, 
      requeridox: {slug: personSlug}
      } = asis;

      const covid = isCovidTotal(asis);
      let contactosEstrechos = asis.contactosEstrechos || 0;

      let llamados = asis.seguimEvolucion||[];
      llamados.forEach(token => {
        //c onsole.log('desde: [%s]>[%s]<[%s]',fechaDesde, token.fets_llamado , fechaHasta)
        if(token.fets_llamado >= fechaDesde && token.fets_llamado < fechaHasta){
          const {
            fe_llamado,
            fets_llamado,
            resultado,
            tipo,
            vector,
            indicacion
          } = token;

          let username =  (token.audit && token.audit.username) || 's/d';
          let userId =    (token.audit && token.audit.userId)   || '';
 
          seguimientoArray.push({ compNum, 
                                  idPerson, 
                                  ndoc, 
                                  telefono, 
                                  personSlug, 
                                  contactosEstrechos,
                                  fe_llamado,
                                  fets_llamado,
                                  resultado,
                                  tipo,
                                  covid,
                                  vector,
                                  indicacion,
                                  username,
                                  userId
                                })
        }// endif

      })// end llamados.forEach

  });// end movimientos.forEach

  if(exportExcel){
    _dispatchReporteSeguimientoWorkbook(seguimientoArray, query, req, res);

  }else {
    cb(seguimientoArray);
  }
}


/*******************************/
/*   findByQuery QUERY FIND  */
/****************************/
exports.findByQuery = function (query, errcb, cb) {
    let reporte = query['reporte'];

    let regexQuery = buildQuery(query, new Date())

    let necesitaLab = false;
    if(query && query.necesitaLab ){
      necesitaLab = true;
    }
    console.dir(regexQuery);

    if(reporte && reporte === 'ASIGNACIONCASOS'){
      buildAsignacionDeCasos(regexQuery, query, errcb, cb);
      return;
    }

    if(reporte && reporte === 'SINSEGUIMIENTO'){
      buildSinSeguimientoReport(regexQuery, query, errcb, cb);
      return;
    }

    
    if(regexQuery && regexQuery.asistenciaId){
      Record.findById(regexQuery.asistenciaId, function(err, entity) {
          if (err){
              console.log('[%s] findByID ERROR() argument [%s]', whoami, arguments.length);
              err.itsme = whoami;
              errcb(err);
          
          }else{
              cb([ entity ]);
          }
      });


    }else{
      if(reporte && reporte === 'COVID'){
        Record.find(regexQuery)
              .lean()
              .limit(5000)
              .sort( '-fecomp_tsa' )
              .exec(function(err, entities) {
                  if (err) {
                      console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
                      errcb(err);
                  }else{
                      if(entities && entities.length){
                        dispatchQuerySearch(reporte, entities, query, regexQuery, errcb, cb)
                      }else {
                        cb([]);
                      }
                  }
        });

      }else {
        Record.find(regexQuery)
              .lean()
              .limit(5000)
              .exec(function(err, entities) {
                  if (err) {
                      console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
                      errcb(err);
                  }else{
                      if(entities && entities.length){

                        if(necesitaLab){
                          entities = filterNecesidadDeLaboratorio(entities);
                        }

                        dispatchQuerySearch(reporte, entities, query, regexQuery, errcb, cb)

                      }else {
                        cb([]);
                      }
                  }
        });

      }

    }

};

function dispatchQuerySearch(reporte, movimientos, query,regexQuery, errcb, cb){

  if(!reporte || !findByQueryProcessFunction[reporte]){
      if(!movimientos || (movimientos && movimientos.length && movimientos.length > 4500)){
        console.log('>>>>>>>>>>>>>>>>> ATENCIÓN SOLICITUD MUY ABARCATIVA >>>>>>>>>>>>>>>>>')
        console.log('Registros [%s]', movimientos.length);
        console.dir(regexQuery);
        console.log('<<<<<<<<<<<<<=== ATENCIÓN SOLICITUD MUY ABARCATIVA <<<<<<<<<<<<<===')
      }

      cb(movimientos);

  }else {

    findByQueryProcessFunction[reporte](movimientos, query, errcb, cb);
  }

}


function geolocalizacionContactos(movimientos, query, errcb, cb){
  let lon =  -58.3581617661068;
  let lat =  -34.8112108487836;

  let geoList = movimientos.filter(asis => {
    if(!asis.locacion) return false;
    if(!asis.locacion.street1 || !asis.locacion.city) return false;
    return true;
  })

  //c onsole.log('GEOLOCALIZACION: Movim[%s] geoList[%s]', movimientos && movimientos.length, geoList && geoList.length)

  geoList = geoList.map(asis => {
    let locacion = asis.locacion;

    let token = {
      etiqueta:     'Persona',
      tipo:         (asis.infeccion && covidOptList[asis.infeccion.actualState || 0]) || covidOptList[0],
      asistenciaId: asis._id,
      link:         asis._id,
      compNum:      asis.compNum,
      fecomp_txa:   asis.fecomp_txa,

      personId:     asis.idPerson,
      personSlug:   asis.requeridox.slug,
      ndoc:         asis.ndoc,
      edad:         asis.edad,
      telefono:     asis.telefono,
      statetext:    'Provincia de Buenos Aires'
    }

    if(locacion){
      token.locacion = locacion;
      token.lat =     locacion.lat || lat; 
      token.lon =     locacion.lng || lon; 
      token.city =    locacion.city;
      token.barrio =  locacion.barrio;
      token.street1 = locacion.street1;
      token.nucleo =  (asis.casoIndice && asis.casoIndice.nucleo) || N_HAB_00;

    }else {
      token.locacion = null;
      token.lat =     lat; 
      token.lon =     lon; 
      token.city =    'S/D';
      token.street1 = 'S/D';
      token.barrio =  'S/D';
      token.nucleo =  'S/D';

    }
    //c onsole.log('geoList: [%s] ([%s])[%s]:[%s]', token.personSlug, token.tipo, token.lat, token.lon);
    return token;
  })

  if(query.rebuildLatLon){
    fetchLatLon(geoList);
  }

  cb(geoList);
}

// function checkForLatLon(list){
//   list.forEach(token => {
//     if((token.lat === -34.8112108487836 || token.lon ===  -58.3581617661068) && (token.citY !== 'S/D' && token.street1 !== 'S/D')){
//       if(once >= _start && once < (_start + _step)) fetchLatLon(token);
//       once += 1;
//     }
//   })
//   _start += _step;
//   once = _start;
// }

var _start = 0;
var _step = 100;
var once = 0;

async function fetchLatLon(list){
  let maxvalue = list.length <= (_start + _step) ? list.length : (_start + _step);
  for (let index = _start; index < maxvalue; index++) {
    const token = list[index];
    if(validToken(token)){
      let response = await mapUtils.fetchLatLonByAddress(token);
      if(response.status === 'OK'){
        await updateLatLon(response, token);
    
      }else {
    
      }    

    }

  }
  _start += _step;
}

function validToken(token){
  if((token.lat === -34.8112108487836 || token.lon ===  -58.3581617661068) && (token.citY !== 'S/D' && token.street1 !== 'S/D')){
    return true
  }
  return false;
}

async function updateLatLon(response, token){
  //c onsole.log('Response: [%s] [%s] [%s] [%s]',response.location.lat, response.location.lng, response.formatted_address, token.street1 )
  let locacion = token.locacion;
  locacion.lat = response.location.lat;
  locacion.lng = response.location.lng;
  locacion.street2 = response.formatted_address;


  await Record.findByIdAndUpdate(token.asistenciaId, {locacion: locacion}, { new: true }).then(token =>{
    return token;
  })

  person.updateLocacion(token.personId, locacion);
}

function buildContactosMaster(movimientos, query, errcb, cb){
    getMapDeContactosEstrechos().then((map)=>{
      filterContactosMaster(movimientos, map, errcb, cb)

      //dispatchExcelStream(reporte, entities, query, req, res)

    })

}

function filterContactosMaster(movimientos, contactMap, errcb, cb){
  let filteredList = movimientos.filter(asis=> {
    let index = JSON.stringify(asis._id);
    if(contactMap.has(index)){
      asis['contactosEstrechos'] = contactMap.get(index).contactos;
      return true;
    }

    if(asis.followUp && asis.followUp.isAsignado  && !asis.followUp.altaVigilancia && asis.followUp.asignadoId){
      asis['contactosEstrechos'] = 1;
      return true;

    }

    if(!(asis.casoIndice && asis.casoIndice.parentId)){
      asis['contactosEstrechos'] = 0;
      return true;
    }

  })
  cb(filteredList);

}
//ACAESTOY
/******************************************************************************************/
/**   CASOS SIN SEGUIMIENTO SINSEGUIMIENTO  */
/****************************************************************************************/

function buildSinSeguimientoReport(regexQuery, query, errcb, cb){

    Record.find(regexQuery)
      .select({ndoc: 1, telefono: 1, edad: 1, fenactx: 1, fenac: 1, casoIndice: 1, infeccion: 1, followUp: 1, ndoc: 1, requeridox: 1})
      .lean()
      .exec(function(err, entities) {
          if (err) {
              console.log('[%s] _agruparCasosIndices ERROR: [%s]', whoami, err)
          }else{
            if(entities && entities.length){
              afectadosSinResponsableSeguimiento(entities, regexQuery, errcb, cb);
            }
          }
    });



}

function afectadosSinResponsableSeguimiento(movimientos, query, errcb, cb){

  getMapDeContactosEstrechos().then((contactosMap)=>{
    let filteredList = filtrarCasosSinSeguimiento(movimientos, contactosMap);
    //dispatchExcelStream(reporte, entities, query, req, res)
    cb(filteredList);

  })



  // let contactosMap = agruparCasosIndices(movimientos);

  // let filteredList = filtrarCasosSinSeguimiento(movimientos, contactosMap);
  // c onsole.log('afectados TO BEGIN');

  // cb(filteredList);

}

/******************************************************************************************/
/**   AUDITORÍA DE SEGUIMIENTO DE NUEVOS PACIENTES, ESPECIALMENTE LA INVESTIG EPIDEMIO   */
/****************************************************************************************/
function buildAuditoriaInvestig(movimientos, query, errcb, cb){

  let auditArray = _mapearInformeAuditoriaInvestig(movimientos, query); // Map(fecha: casos)

  cb( auditArray);


}

function _mapearInformeAuditoriaInvestig(movimientos, query){
  let auditArray = [];

 
  if(movimientos && movimientos.length){

    auditArray = movimientos.map(asis => _buildAuditToken(asis, query));

  }
  return auditArray;  

}

function _buildAuditToken(asis, query){
  let covid = isCovidTotal(asis);
  let llamados = {
    qlogrado: 0,
    qnocontesta: 0,
    qnotelefono: 0
  }


  let fUp = asis.seguimEvolucion || [];
  
  llamados = fUp.reduce((acum, t) => {
                        acum.qlogrado += t.resultado === 'logrado' ? 1 : 0;
                        acum.qnocontesta += t.resultado === 'nocontesta' ? 1 : 0;
                        acum.qnotelefono += t.resultado === 'notelefono' ? 1 : 0;
                        return acum;
                  }, llamados)

  
  let returnData = {
    compNum: asis.compNum,
    idPerson: asis.idPerson,
    ndoc: asis.ndoc,
    tdoc: asis.tdoc,
    personSlug: asis.requeridox ? asis.requeridox.slug : '',
    telefono: asis.telefono,
    fecomp_txa: asis.fecomp_txa,
    fecomp_tsa: asis.fecomp_tsa,
    covid: covid,
    actualState:  asis.infeccion ? asis.infeccion.actualState : 0,

    llamados: llamados,
    fe_investig: '',
    fets_investig: 0,
    userInvestig: '',
    userAsignado: '',
    userId: '',
    hasInvestigacion: false,

    isAsignado: false,
    asignadoId: '',
    asignadoSlug: '',
  }

  let investig = asis.sintomacovid;
  if (investig){
    returnData.fe_investig = investig.fe_investig;
    returnData.fets_investig = investig.fets_investig;
    returnData.userInvestig = investig.userInvestig;
    returnData.userAsignado = investig.userAsignado;
    returnData.userId = investig.userId;
    returnData.hasInvestigacion = investig.hasInvestigacion;
  }

  let followUp = asis.followUp;
  if(followUp){
    returnData.isAsignado = followUp.isAsignado;
    returnData.asignadoId = followUp.asignadoId || followUp.derivadoId;
    returnData.asignadoSlug = followUp.asignadoSlug || followUp.derivadoSlug;
  
  }

  return returnData;

}






/******************************************************/
/**   CASOS LLAMADOS EPIDEMIO   LLAMADOSEPIDEMIO     */
/****************************************************/
function buildLlamadosEpidemio(movimientos, query, errcb, cb){

  let movXfecha = agruparMovimientosPorFechaLlamado(movimientos, query); // Map(fecha: casos)

  cb( Array.from(movXfecha, ( [name, value]) => (value)  ));


}

function agruparMovimientosPorFechaLlamado(movimientos, query){
      let groupByFecha = new Map();
      let fedesde = 0;
      let fehasta = 0;

      if(query['fenovd_ts'] && query['fenovh_ts']){
        fedesde = parseInt(query['fenovd_ts'], 10);
        fehasta = parseInt(query['fenovh_ts'], 10);
      }

      if(movimientos && movimientos.length){
          movimientos.forEach(asis => {
           let covid = isCovidTotal(asis);

           let llamados = asis.seguimEvolucion;

           if(llamados && llamados.length){
             llamados.forEach(fUp => {
               _buildLlamadoToken(groupByFecha, fUp, covid, fedesde, fehasta);

             })
           }
          });
      }
      return groupByFecha;  
}

function _buildLlamadoToken(groupByFecha, fUp, covid,  fedesde, fehasta){
  //fdesde <= fets_llamado  < fehasta
  if(!(fedesde <= fUp.fets_llamado && fUp.fets_llamado < fehasta )) return;

  let audit = fUp.audit;
  let userId = 'user_unknown';
  let username = 'no_establecido'; 
  let fecha_llamado = utils.dateToStr(new Date(fUp.fets_llamado));

  if(audit){
    userId =  audit.userId || userId;
    username =  audit.username || username;
  }

  let indexTx = fecha_llamado + ':' + userId ; // + ':' + (covid ? 'covid':'nocovid')

  if(groupByFecha.has(indexTx)){
    groupByFecha.get(indexTx).qty  += 1;
    groupByFecha.get(indexTx).qcovid += covid ? 1: 0;
    groupByFecha.get(indexTx).qnocovid += covid ? 0: 1;
    groupByFecha.get(indexTx).qlogrado += fUp.resultado === 'logrado' ? 1 : 0;
    groupByFecha.get(indexTx).qnocontesta += fUp.resultado === 'nocontesta' ? 1 : 0;
    groupByFecha.get(indexTx).qnotelefono += fUp.resultado === 'notelefono' ? 1 : 0;

  }else{
    let token = {
                  fets_llamado: fUp.fets_llamado,
                  fecha: utils.dateToStr(new Date(fUp.fets_llamado)),
                  index: indexTx,
                  qty: 1,
                  qcovid: covid ? 1: 0,
                  qnocovid: covid ? 0: 1,
                  qlogrado: fUp.resultado === 'logrado' ? 1 : 0,
                  qnocontesta: fUp.resultado === 'nocontesta' ? 1 : 0,
                  qnotelefono: fUp.resultado === 'notelefono' ? 1 : 0,
                  userId: userId,
                  username: username 
                }

    groupByFecha.set(indexTx, token);
  }

}

function mapReplacer(key, value) {
  const originalObject = this[key];
  if(originalObject instanceof Map) {
    return {
      dataType: 'Map',
      value: [...originalObject]
    };
  } else {
    return value;
  }
}
/**  END:  CASOS LLAMADOS EPIDEMIO   LLAMADOSEPIDEMIO     */


/******************************************************/
/**   CASOS POR USUARIO          ASIGNACIONCASOS     */
/****************************************************/

function buildAsignacionDeCasos(regexQuery, query, errcb, cb){
  let contactosMap;

  _agruparCasosIndices().then(cMap => {
    return _sumarCasosPorUsuario(cMap);
  })
  .then(targetMap => {
    pushBackCasosPorUsuario(targetMap, cb);


  })




}
// ACAESTOY
function _agruparCasosIndices(){
  let contactosMap = new Map();
  let regexQuery = {
    isVigilado: true,
    avance: {$ne: 'anulado'},
    'casoIndice.parentId': {$ne: null},
  }

  return new Promise((resolve)=>{
          Record.find(regexQuery)
            .select({casoIndice: 1})
            .lean()
            .exec(function(err, entities) {
                if (err) {
                    console.log('[%s] _agruparCasosIndices ERROR: [%s]', whoami, err)
                }else{
                  if(entities && entities.length){
                    resolve(groupByCasosIndice(entities));                    
                  }
                }
            });
      }, 
      (reject) => {
        
      })
}

function _sumarCasosPorUsuario(contactosMap){
  let regexQuery = {
    isVigilado: true,
    avance: {$ne: 'anulado'},
    'followUp.altaVigilancia': {$in: [null, false]},    
  }

  return new Promise((resolve)=>{
          Record.find(regexQuery)
            .select({casoIndice: 1, infeccion: 1,followUp: 1, ndoc: 1, requeridox: 1})
            .lean()
            .exec(function(err, entities) {
                if (err) {
                    console.log('[%s] _agruparCasosIndices ERROR: [%s]', whoami, err)
                }else{
                  if(entities && entities.length){
                    resolve(sumarCasosPorUsuario(entities, contactosMap));                    
                  }
                }
            });
      }, 
      (reject) => {
        
      })

}


function buildCasosPorUsuario(movimientos, query, errcb, cb){
  let contactosMap = groupByCasosIndice(movimientos);
  let targetMap = sumarCasosPorUsuario(movimientos, contactosMap);
  pushBackCasosPorUsuario(targetMap, cb);


}

function pushBackCasosPorUsuario(targetMap, cb){
  let returnArray = Array.from(targetMap.values())
  cb(returnArray)
}




function groupByCasosIndice(movimientos){
      let contactosMap = new Map();
      if(movimientos && movimientos.length){

          movimientos.forEach(asis => {

            if(asis.casoIndice && asis.casoIndice.parentId){
              let index = JSON.stringify(asis.casoIndice.parentId)

              if(contactosMap.has(index)){
                contactosMap.get(index).contactos  += 1;

              }else {
                let data = {
                  contactos: 1
                }
                contactosMap.set(index, data)

              }
            }
          });
      }
      return contactosMap;  
}

function isCovidActivo(asistencia){
  if(asistencia && asistencia.infeccion && asistencia.infeccion.actualState === 1 ) return true;
  return false;
}

function isCovidTotal(asistencia){
  if(asistencia && asistencia.infeccion && 
    (asistencia.infeccion.actualState === 1 || asistencia.infeccion.actualState === 4 || asistencia.infeccion.actualState === 5)) return true;
  return false;
}

function filtrarCasosSinSeguimiento(movimientos, contactMap){

    let filteredList = movimientos.filter(asis => {
      let isAsignado = asis.followUp && asis.followUp.isAsignado;
      let isAltaVigilancia =  asis.followUp && asis.followUp.altaVigilancia;
      let hasCasoIndice = asis.casoIndice && asis.casoIndice.parentId;
      let covid = isCovidTotal(asis);
      let followUp = (asis.followUp && asis.followUp.derivadoSlug === 'PacientesDeAlta')
      
      let index = JSON.stringify(asis._id);
      let hasContactosEstrechos = contactMap.has(index);

      if(isAltaVigilancia) return false;

      if(!isAsignado && !hasCasoIndice && (covid || hasContactosEstrechos)){
          return true;
      }

      if((!isAsignado && followUp) && (covid || hasContactosEstrechos)){
          return true;
      }
      
      return false;

      //c onsole.log('forEach [%s]:[%s] [%s] [%s]', index, (index instanceof String), contactMap.get(index), contactMap.has(index))
    })

    return filteredList;
}



function sumarCasosPorUsuario(movimientos, contactMap){

    let targetMap = new Map();

    movimientos.forEach(asis => {
      let isAltaVigilancia =  asis.followUp && asis.followUp.altaVigilancia;
      if(isAltaVigilancia) return;

      let isAsignado = asis.followUp && asis.followUp.isAsignado;
      let hasCasoIndice = asis.casoIndice && asis.casoIndice.parentId;
      let covid = isCovidActivo(asis);
      
      let index = JSON.stringify(asis._id);
      let hasContactosEstrechos = contactMap.has(index);
      let token = {}; 

      token['contactos'] = 0;
      token['isAsignado'] = isAsignado;
      token['asignadoId'] =   (asis.followUp && asis.followUp.asignadoId) || 'errorasignacion';
      token['asignadoSlug'] = (asis.followUp && asis.followUp.asignadoSlug) || 'Usuario sin nombre';
      token['fase'] =         (asis.followUp && asis.followUp.fase) || 'fase-xx'

      token['hasEstrechos'] = hasContactosEstrechos;
      token['isCasoIndice'] = hasCasoIndice;
      token['isCovid'] = covid;

      token['isHuerfano'] = false;

      token['asistenciaId'] = asis._id;
      token['asistenciaSlug'] = asis.requeridox.slug;
      token['asistenciaNdoc'] = asis.ndoc;


      //c onsole.log('forEach [%s]:[%s] [%s] [%s]', index, (index instanceof String), contactMap.get(index), contactMap.has(index))
      if(isAsignado){

        if(hasContactosEstrechos){
          token['contactos'] =contactMap.get(index).contactos;

        }else if(!hasCasoIndice){
            token['isHuerfano'] = true;
        }

        targetMap.set(index, token)

      // no tiene asignado usuario 
      }else {
        if(!hasCasoIndice && (covid || hasContactosEstrechos)){

            token['isAsignado'] = false;
            token['asignadoId'] =   'usuarionoasignado';
            token['asignadoSlug'] = 'Sin asignado';
            token['isHuerfano'] = true;
            //contactMap.set(index, token)
            targetMap.set(index, token)
        }
      }
    })
    return targetMap;

}


function buildRedContactos(movimientos, query, errcb,cb ){
  let output;

  output = movimientos.filter(t => addToGraph(t)).map(asis => {
    let source = _getSource(asis);
    let target = _getTarget(asis);

    let type = _getType(asis);

    return {
      source: source.slug,
      sourceId: source.id,
      target: target.slug,
      targetId: target.id,
      type: type.slug,
    }


  })
  cb(output);

}

function addToGraph(asis){
  let add = false;
  if(asis.casoIndice) add = true;

  if(asis.infeccion){
    if(asis.infeccion.actualState === 1 || asis.infeccion.actualState === 4 || asis.infeccion.actualState === 5 ) add = true;

  }


  return add

}

function _getSource(asis){
  if(asis.casoIndice){
    return {
      slug: asis.casoIndice.slug,
      id: asis.casoIndice.parentId
    }

  }else {
    if(asis.locacion){
      return {
        slug: asis.locacion.city,
        id : asis.locacion.city,
      }

    }else {
      return {
        slug: 'locacion',
        id: 'locacion'
      }
    }
  }
}

function _getTarget(asis){
  return {
    slug: asis.requeridox.slug,
    id: asis.idPerson
  }
}

function _getType(asis){
    if(asis.locacion){
      return {
        slug: asis.locacion.city,
        id : asis.locacion.city,
      }

    }else {
      return {
        slug: 'locacion',
        id: 'locacion'
      }
    }

}


function loadMasterContctos(){
  const promise = new Promise((resolve, reject) => {

  })

  return promise;
}





/******
    parentId:   asistencia.casoIndice.parentId,
    parentSlug: asistencia.casoIndice.slug,
    nucleo:     asistencia.casoIndice.nucleo || N_HAB_00,
    fe_confirma: fecha,
    fets_confirma: fecha_ts + '',
    city: city,
    barrio: barrio,
    address: address,
    street2: street2,
    telefono: telefono,
    qty: qty

****/

function responseDomiciliosReport(master, errcb, cb){
    let today = Date.now();
    let resultData = [];

    //worksheet.addRow([ 'Ciudad','Barrio', 'Núcleo habitacional', '#Contactos', 'Teléfono', 'Calle', 'Observación', 'Fe conf CIndice','Caso índice', 'fechanum' ]).commit();

    Object.keys(master).forEach( key => {
      let masterData = master[key];
       
      resultData.push(masterData)

    })

    cb(resultData);
}



 // ACA
function filterNecesidadDeLaboratorio(entities){
  let today = new Date()
  let today_ts = today.getTime();

  let filteredList = entities.filter(token => {
    let feReferencia_ts = null;
    let isCovid = false;

    // caso 1
    if(!(token.followUp)) return false;
    feReferencia_ts = token.followUp.fets_inicio;

    if(token.infeccion){
      if(token.infeccion.actualState === 1){
        isCovid = true;
        feReferencia_ts = token.infeccion.fets_confirma
      }

      // caso 2
      if(token.infeccion.actualState === 3 || token.infeccion.actualState === 4 || token.infeccion.actualState === 5   ) return false;
    }

    // caso 3: pasaron menos de 14 días de vigilancia o de confirmación de COVID
    if((today_ts - feReferencia_ts) / (1000 * 60 * 60 * 24) < 14) return false;


    if(token.muestraslab && token.muestraslab.length){
      let muestras = token.muestraslab;
      let fechaLab = null

      muestras.forEach(mu => {
        if(mu.resultado === 'descartada') {
          fechaLab = mu.fets_resestudio
        }
      })

      if(fechaLab){
          if((today_ts - fechaLab) / (1000 * 60 * 60 * 24) < 2) return false;
          else return true;

      }else{
        return true;
      }

    }else {
      return true;

    }

  })

  return filteredList;
}


/**
 * find by ID
 * @param id
 * @param cb
 * @param errcb
 */
exports.findById = function (id, errcb, cb) {

    Record.findById(id, function(err, entity) {
        if (err){
            console.log('[%s] findByID ERROR() argument [%s]', whoami, arguments.length);
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};


/**
 * Upddate a new record
 * @param id
 * @param record
 * @param cb
 * @param errcb
 */
exports.update = function (id, record, errcb, cb) {

    Record.findByIdAndUpdate(id, record, { new: true } ,function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument [%s]',whoami)
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};

/**
 * Sign up a new record
 * @param record
 * @param cb
 * @param errcb
 */
exports.create = function (record, errcb, cb) {
    delete record._id;

    Record.create(record, function(err, entity) {
        if (err){
            console.log('[%s] validation error as validate() argument ',whoami);
            err.itsme = whoami;
            errcb(err);
        
        }else{
            cb(entity);
        }
    });

};

/*******************************/
/***** EXPORT EXCEL       *****/
/*****************************/
exports.exportarmovimientos = function(query, req, res ){
    if(!query){
      query = {estado: 'activo'}
    }

    fetchMovimientos(query, req, res)
}


function fetchMovimientos(query, req, res){
    let reporte = query['reporte'];
 
    let regexQuery = buildQuery(query, new Date())

    Record.find(regexQuery).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);

        }else{
            if(entities && entities.length){

              sortCovid(entities);

              getMapDeContactosEstrechos().then((map)=>{
                identificarContactosEstrechos(entities, map);

                dispatchExcelStream(reporte, entities, query, req, res)

              })

            }else{
                dispatchExcelStream(reporte, [], query, req, res)

            }
        }
    });
}

const reportProcessFunction = {

  'DOMICILIOS' : buildDomiciliosReport,

};

//ACAESTOY
function getMapDeContactosEstrechos(){
 
    let regexQuery = {
      isVigilado: true,
      avance: {$ne: 'anulado'},
      'casoIndice.parentId': {$ne: null},
    }

    return Record.find(regexQuery).select({casoIndice: 1}).lean().exec().then(list => {
      let contactosMap = new Map();
      if(list && list.length){

          list.forEach(asis => {

            if(asis.casoIndice && asis.casoIndice.parentId){
              let index = JSON.stringify(asis.casoIndice.parentId)

              if(contactosMap.has(index)){
                contactosMap.get(index).contactos  += 1;

              }else {
                let data = {
                  contactos: 1
                }
                contactosMap.set(index, data)

              }

            }
          });
      }
      return contactosMap;
    })
}

function identificarContactosEstrechos(movimientos, casosIndices){

  movimientos.forEach(asis => {
    let index = JSON.stringify(asis._id);

    //c onsole.log('forEach [%s]:[%s] [%s] [%s]', index, (index instanceof String), casosIndices.get(index), casosIndices.has(index))

    if(casosIndices.has(index)){
      asis['contactosEstrechos'] = casosIndices.get(index).contactos

    }else {
      if(asis.followUp && asis.followUp.isAsignado && asis.followUp.asignadoId){
        asis['contactosEstrechos'] = 1;

      }else {
        asis['contactosEstrechos'] = 0;

      }
    }
  })

}

function dispatchExcelStream(reporte, movimientos, query, req, res){

  if(!reporte || !reportProcessFunction[reporte]){
      buildExcelStream(movimientos, query, req, res);

  }else {
    reportProcessFunction[reporte](movimientos, query, req, res);
  }

}



/**********************************/
/***** EXCEL GENERIC OUTPUT    ***/
/********************************/
function buildExcelStream(movimientos, query, req, res){

    let today = Date.now();
    let filename = 'vigilancia_epidemiologica_'+today+'.xlsx'
    let content = 

    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="' + filename + '"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    var worksheet = workbook.addWorksheet('vigilancia')

    var justCabecera = query.justCabecera === "true"


    worksheet.addRow(['Vigilancia epidemilógica']).commit()
    worksheet.addRow(['Fecha emisión', new Date().toString()]).commit()

    worksheet.addRow().commit()
    worksheet.addRow(['Vigilancia','Secuencia', 'ContEstrech', 'Sexo', 'FeNacimiento', 'Teléfono', 'Edad', 'TDOC', 'NumDocumento', 'Nombre', 'Apellido', 'SeguidoPor', 'Fe Notificación', 'reportadoPor','COVID', 'Fe Inicio Síntoma', 'Fecha Confirmación', 'Fecha Ata/Fallecimiento', 'Tipo de caso', 'Método diagnóstico','Síntoma', 'Internación' , 'Es contacto de', 'Nucleo hab', 'SecuenciaLAB', 'Fe Muestra', 'Laboratorio', 'Fe Resultado', 'Estado LAB', 'Resultado LAB', 'Calle Nro', 'Localidad', 'Lat', 'Long', 'IngresoSistema']).commit();

    movimientos.forEach((row, index )=> {
 
      let laboratorio_token = row.muestraslab && row.muestraslab.length && row.muestraslab[ row.muestraslab.length-1 ];
      if(!laboratorio_token){
        laboratorio_token = {
            secuencia: 's/d',
            fe_toma: 's/d',
            laboratorio: 's/d',
            fe_resestudio: 's/d',
            estado: 's/d',
            resultado: 's/d',
        }
      }
      const { secuencia, fe_toma, laboratorio, fe_resestudio, estado, resultado } = laboratorio_token;
      let laboratorioArr = [ secuencia, fe_toma, laboratorio, fe_resestudio, estado, resultado];


      //
      let locacion_token = row.locacion;
      if(!locacion_token){
          locacion_token = {
            street1: 's/d',
            city: 's/d',
            lat: 's/d',
            lng: 's/d',
          }
      }
     const { street1, city, lat, lng } = locacion_token;
     let locacionArr = [  street1, city, lat, lng  ];

      //
      let sisa_token = row.sisaevent;
      if(!sisa_token){
          sisa_token = {
            fe_reportado: 's/d',
            reportadoPor: 's/d',
          }
      }
     const { fe_reportado, reportadoPor } = sisa_token;
     let sisaArr = [ fe_reportado, reportadoPor  ];

      //caso indice
      let casoindice_token = row.casoIndice;
      if(!casoindice_token){
          casoindice_token = {
            casoindiceSlug: 'Sin antecedente',
            casoindiceNucleo: 's/d',
          }
      }else{
          casoindice_token = {
            casoindiceSlug:   casoindice_token.slug,
            casoindiceNucleo: casoindice_token.nucleo || N_HAB_00,
          }
      }
     const { casoindiceSlug, casoindiceNucleo } = casoindice_token;
     let casoindiceArr = [ casoindiceSlug, casoindiceNucleo  ];


     //
      let followUp = row.followUp;
      if(!followUp){
          followUp = {
            asignadoSlug: 'no asignado',
          }
      }else {
        if(!followUp.isAsignado) followUp.asignadoSlug = 'no asignado';
        if(followUp.altaVigilancia) followUp.asignadoSlug = 'alta de vigilancia';        
      }

     const { asignadoSlug } = followUp;
     let followupArr = [ asignadoSlug ];


 
      //
      let covid_token = row.infeccion;
      if(!covid_token){
          covid_token = {
            covid: 's/d',
            fe_inicio: 's/d',
            fe_confirma: 's/d',
            fe_alta: 's/d',
            avance: 's/d',
            mdiagnostico: 's/d',
            sintoma: 's/d',
            locacionSlug: 's/d',
          }
      }else{
        covid_token.covid = covidOptList[covid_token.actualState || 0];
      }
     const { covid, fe_inicio, fe_confirma, fe_alta, avance, mdiagnostico, sintoma, locacionSlug } = covid_token;
     let covidArr = [  covid, fe_inicio, fe_confirma, fe_alta, avance, mdiagnostico, sintoma, locacionSlug  ];

      const requeridox = row.requeridox || {nombre: 'Sin beneficiario', apellido: 's/d', tdoc: 's/d', ndoc: 's/d'};
      const { tdoc, ndoc, nombre, apellido } = requeridox;
      let requeridoxArr = [ tdoc, (ndoc || row.ndoc), nombre, apellido];

      const {compNum, telefono, sexo, fenactx, edad } = row;
      let basicArr = [ compNum, (index + 1), (row['contactosEstrechos'] || 0), sexo, fenactx, telefono, edad ];
      
      worksheet.addRow([...basicArr, ... requeridoxArr, ...followupArr, ...sisaArr, ...covidArr, ...casoindiceArr, ...laboratorioArr, ...locacionArr, row.fecomp_txa ]).commit()

    })
    worksheet.commit()
    workbook.commit()
}
//casoIndic fe_comp fecomp_txa
//followUp
/*******************************************/
/***** REPORTE VIGILANCIA DE CONTACTO *****/
/*****************************************/
function buildDomiciliosReport(movimientos, query, req, res){
  let master = {}
  let parent = {}
  movimientos.forEach(asis => {
    if(asis.casoIndice){
      populateDomiciliosReport(master, asis, parent)
    }else {
      populateParent(parent, asis)

    }

  })
  exportDomiciliosReport(master, req, res);

}


function populateParent(parent, asistencia){
  let key = asistencia._id;
  let fecha = (asistencia && asistencia.infeccion && asistencia.infeccion.fe_confirma) || 'sin dato';
  let fecha_ts = (asistencia && asistencia.infeccion && asistencia.infeccion.fets_confirma) || 0;

  parent[key] = {fe_confirma: fecha, fets_confirma: fecha_ts};

}

function exportDomiciliosReport(master, req, res){

    let today = Date.now();
    let filename = 'vigilancia_domicilioDeContactos_'+today+'.xlsx'
    let content = 

    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="' + filename + '"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
    var worksheet = workbook.addWorksheet('vigilancia')

    worksheet.addRow(['Domicilios de contactos']).commit()
    worksheet.addRow(['Fecha emisión', new Date().toString()]).commit()

    worksheet.addRow().commit()

    worksheet.addRow([ 'Ciudad','Barrio', 'Núcleo habitacional', '#Contactos', 'Teléfono', 'Calle', 'Observación', 'Fe conf CIndice','Caso índice', 'fechanum' ]).commit();

    Object.keys(master).forEach( key => {
      let masterData = master[key];
 
      const {city, barrio, nucleo, qty, telefono, address, street2, parentSlug, fe_confirma, fets_confirma_tx} = masterData;

      let masterArr = [ city, barrio, nucleo, qty, telefono, address, street2, fe_confirma, parentSlug, fets_confirma_tx ];
      
      worksheet.addRow([...masterArr]).commit()

    })
    worksheet.commit()
    workbook.commit()
}



function populateDomiciliosReport(master, asis, parent){
  let parentId = asis.casoIndice.parentId;
  let nucleo =   asis.casoIndice.nucleo || N_HAB_00;
  let key = parentId + ':' + nucleo;

  if(master[key]){
    refreshDomicilioToken(master[key], asis);

  }else {
    master[key] = buildDomiciliosToken(asis, parent);

  }


}

/*******


****/

function refreshDomicilioToken(token, asistencia){
  token.qty += 1;
  if(token.telefono && asistencia.telefono && !token.telefono.includes(asistencia.telefono)){
    token.telefono = token.telefono === 'sin dato' ? asistencia.telefono : token.telefono + ' / ' + asistencia.telefono; 
  }

  if((token.city === 'sin dato' || token.address === 'sin dato') && asistencia.locacion){
    let city = 'sin dato';
    let barrio = 'sin dato';
    let address = 'sin dato';
    let entrecalles = '';

    let locacion = asistencia.locacion;

    if(locacion){
      city = locacion.city || 'sin dato';
      barrio = locacion.barrio || 'sin dato';

      if(locacion.streetIn || locacion.streetOut ){
        entrecalles = (locacion.streetIn && locacion.streetOut) 
            ? ' - Entre ' + locacion.streetIn + ' y ' +  locacion.streetOut
            : ' - Esquina ' + locacion.streetIn ;
      }

      address = (locacion.street1 + entrecalles ) || 'sin dato';
      
      token.city = city
      token.barrio = barrio
      token.address = address
    }
  }
}

function buildDomiciliosToken(asistencia, parent){
  let city = 'sin dato';
  let barrio = 'sin dato';

  let address = 'sin dato';
  let street2 = 'sin dato';
  let entrecalles = '';
  let telefono = asistencia.telefono || 'sin dato';

  let qty = 1;

  let locacion = asistencia.locacion;
  if(locacion){
    city = locacion.city || 'sin dato';
    barrio = locacion.barrio || 'sin dato';

    if(locacion.streetIn || locacion.streetOut ){
      entrecalles = (locacion.streetIn && locacion.streetOut) 
          ? ' - Entre ' + locacion.streetIn + ' y ' +  locacion.streetOut
          : ' - Esquina ' + locacion.streetIn ;
    }
    street2 = locacion.street2;

    address = (locacion.street1 + entrecalles ) || 'sin dato';
  }

  let fecha =    (parent && parent[asistencia.casoIndice.parentId] && parent[asistencia.casoIndice.parentId].fe_confirma) || 'sin dato';
  let fecha_ts = (parent && parent[asistencia.casoIndice.parentId] && parent[asistencia.casoIndice.parentId].fets_confirma) || 0;

  let token = {
    parentId:   asistencia.casoIndice.parentId,
    parentSlug: asistencia.casoIndice.slug,
    nucleo:     asistencia.casoIndice.nucleo || N_HAB_00,
    fe_confirma: fecha,
    fets_confirma: fecha_ts,
    fets_confirma_tx: fecha_ts + '',
    city: city,
    barrio: barrio,
    address: address,
    street2: street2,
    telefono: telefono,
    qty: qty
  }
  return token;
}

/***** END REPORTE DOMICILIOS *****/

// HELPER 
function sortCovid(records){
    records.sort( (fel, sel)=> {
      let fprio = (fel.infeccion && fel.infeccion.fets_confirma) || (fel.sisaevent && fel.sisaevent.fets_reportado) || fel.fenotif_tsa || fel.fecomp_tsa;
      let sprio = (sel.infeccion && sel.infeccion.fets_confirma) || (sel.sisaevent && sel.sisaevent.fets_reportado) || sel.fenotif_tsa || sel.fecomp_tsa;

      if(fprio < sprio ) return -1;

      else if(fprio > sprio ) return 1;

      else{
        return 0;
      }
    })
};




function buildAsisInvertedTreeByPerson(master){
  return new Promise(function(resolve, reject){

    AsisRecord.find(null, '_id  idPerson compNum fecomp_txa').lean().then(list => {

      if(list && list.length){
        list.forEach(token => {
          if(token.idPerson){
            if(master[token.idPerson]){
              master[token.idPerson] += 1;

            }else {
              master[token.idPerson] = 1;

            }

          }else {
            console.log('idPerson is null: [%s] [%s]', token._id, token.compNum)
          }
        })
        resolve(master);

      }else {
        reject({error: 'not records found in asistencias'})
      }
    }); // end AsisRecord.find

  }); // end Promise
}



/*******************************/
/***** TABLERO EPIDEMIO   *****/
/*****************************/
exports.tableroepidemio = dashboardEpidemio;

function dashboardEpidemio(datenum, errcb, cb){
 
  let time_frame = utils.buildDateFrameForCurrentWeek(datenum);

  let query = {
      isVigilado: true,
      fecomp_ts_d: time_frame.begin.getTime(),
      fecomp_ts_h: time_frame.semh.getTime()
    }
  
  let regexQuery = buildQuery(query, new Date())

    
  person.buildIdTree().then(pTree =>{

    Record.find(regexQuery)
          .select({fecomp_txa: 1, ndoc: 1, idPerson:1 , sector: 1, telefono: 1, edad: 1, sexo: 1,locacion:1,  sisaevent:1 , infeccion: 1})
          .lean()
          .exec(function(err, entities) {

        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]', whoami, err)
            errcb(err);
        }else{

          procesTableroEpidemio(pTree, entities, time_frame, errcb, cb);
        }
    });
  })

}
/****************************************/
/*         TABLERO EPIDEMIO HELPERS    */
/**************************************/
function getReferenceDate(asistencia){
  if(asistencia && asistencia.infeccion){
    if(asistencia.infeccion.fe_inicio) return utils.parseDateStr(asistencia.infeccion.fe_inicio);
    else if(asistencia.infeccion.fe_confirma) return utils.parseDateStr(asistencia.infeccion.fe_confirma);
  }
  if(asistencia.sisaevent){
    if(asistencia.sisaevent.fe_reportado) return utils.parseDateStr(asistencia.sisaevent.fe_reportado);
  }
  return utils.parseDateStr(asistencia.fecomp_txa);
}

function getLabel(list, val){
    let t = list.find(item => item.val === val)
    return t ? t.label : val;
}


const estadoActualAfectadoOptList = [
  { val: 0, label: 'Sospecha'},
  { val: 1, label: 'COVID'},
  { val: 2, label: 'Descartado'},
  { val: 3, label: 'Recuperado'},
  { val: 4, label: 'Fallecido'},
  { val: 5, label: 'Alta'},
  { val: 6, label: 'Posible'},
];

function getEstado(asistencia){
  if(asistencia && asistencia.infeccion){
    return asistencia.infeccion.actualState
  }
  return 7
}

function getAvance(asistencia){
  if(asistencia && asistencia.infeccion){
    return asistencia.infeccion.avance
  }
  return 'posible';
}

function getSintoma(asistencia){
  if(asistencia && asistencia.infeccion){
    return asistencia.infeccion.sintoma
  }
  return 'asintomatico';
}

function getMdiagnostico(asistencia){
  if(asistencia && asistencia.infeccion){
    return asistencia.infeccion.mdiagnostico || 'casos-no-covid'
  }
  return 'casos-no-covid';
}


/**********************************/
/*         TABLERO EPIDEMIO    */
/********************************/
function procesTableroEpidemio (ptree, entities, timeframe, errcb, cb){
  let master = {};

  entities.forEach(asistencia => {
    let fecomp = getReferenceDate(asistencia)
    //

    if(!fecomp){ 

      fecomp = new Date();
      // c onsole.log('errror **************************')
      // c onsole.log('asistencia: [%s]', asistencia.compNum)
      // c onsole.log('errror **************************')

    }

    let person = ptree[asistencia.idPerson];
    let fenac = 0;
    let sexo = 'X';
    let ciudad = 'ciudad';

    if(person){
      fenac = person.fenac || 0;
      sexo = person.sexo || asistencia.sexo || 'X';

      if(person.locaciones && person.locaciones.length){
        ciudad = person.locaciones[0].city || 'ciudad';
      }else if(asistencia.locacion){
        ciudad = asistencia.locacion.city || 'ciudad';
      }

    }else{
      //c onsole.log('AIUUUUDAAAAAAA No encontrado: [%s]', asistencia.requeridox && asistencia.requeridox.slug)
    }

    let token = {
      dia: fecomp.getDate(),
      mes: fecomp.getMonth(),
      sem: "00",
      fenac: fenac,
      ciudad: ciudad,
      sexo: sexo,
      edadId: ("000" + Math.floor(utils.calcularEdad(fenac)/10)).substr(-2),
      estado: getEstado(asistencia),
      avance: getAvance(asistencia),
      sintoma: getSintoma(asistencia),
      mdiagnostico: getMdiagnostico(asistencia),
      sector: asistencia.sector,
      cardinal: 1
    };

    if(token)

    token.id = buildId(token, fecomp, timeframe);
    processToken(token, master);

  })
  // fin del proceso
  cb(master);

}

function processToken(token, master){
  if(master[token.id]){
    master[token.id].cardinal = master[token.id].cardinal + 1;

  }else{
    master[token.id] = token;
  }
}




function buildId(token, fecomp, timeframe){
  let fechaId = buildDiaMes(token,fecomp, timeframe);
  let edadId = token.edadId;
  let sexoId = token.sexo;
  let estadoId = "[" + ("            " + token.estado).substr(-4) + "]" 
  let avanceId = "[" + ("            " + token.avance).substr(-15) + "]" 
  let sintomaId = "[" + ("           " + token.sintoma).substr(-15) + "]" 
  let mdiagnosticoId = "[" + ("           " + token.mdiagnostico).substr(-15) + "]" 
  let sectorId = "[" + ("            " + token.sector).substr(-15) + "]" 
  return fechaId + ':' + edadId + ':' + sexoId + ':' + estadoId + avanceId + sintomaId + sectorId + mdiagnosticoId;
}

function buildDiaMes(token, fecomp, timeframe){
  let fecharef = timeframe.fecharef;
  let fechasem = timeframe.semd;

  let fechaId = fecharef.getFullYear() + '0000';
  let diaId = '00' + token.dia;
  let mesId = '00' + token.mes;
  
  if(token.mes === fechasem.getMonth()){
    if(token.dia === fecharef.getDate()){
      fechaId = fecharef.getFullYear() + mesId.substr(-2) + diaId.substr(-2);
    } else {
      fechaId = fecharef.getFullYear() + mesId.substr(-2) + '00';
    }
  }
  if(timeframe.semd <= fecomp && fecomp <= timeframe.semh){
    fechaId = fechaId + 'SE'
    token.sem = "SE"

  } else {
    fechaId = fechaId + '00'
    token.sem = "00"

  }

  return fechaId;
}






/**********************************/
/*         DASHBOARD 107         */
/********************************/
exports.dashboard = function (errcb, cb) {
    dashboardProcess(cb);
}

const dashboardProcess = function(cb){


    Record.find({estado: 'activo'}).lean().exec(function(err, entities) {
        if (err) {
            console.log('[%s] findByQuery ERROR: [%s]',whoami, err)
            errcb(err);
        }else{
            processDashboardData(entities, cb)
        }
    });
}

const mesLabel = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OCT',
  'NOV',
  'DIC',

]

function processDashboardData(records, cb){

    /***
      token: {
        label:string
        cardinal:number
        slug:slug
      }



    **/
    let master = {
      hoy: {
        label: 'HOY',
        cardinal: 0,
        slug: 'Eventos/día',
        key: ''
      },
      semana: {
        label: 'ESTA SEMANA',
        cardinal: 0,
        slug: 'Eventos/semana',
        key: ''

      },
      meses: [],

      estados: [],

    };
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(),now.getDate());
    let today_time = today.getTime();
    let semana = utils.buildDateFrameForCurrentWeek(today_time);

    if(records && records.length){


        records.forEach(asistencia => {

            acumBruto(master, asistencia, today, today_time, semana );
            acumAvance(master, asistencia, today, today_time, semana );

        })

        //Trucho OjO
        // master['lunes 20-01'].entregadas  = 1591;
        // master['lunes 20-01'].porciento  = master['lunes 20-01'].entregadas / master['lunes 20-01'].total * 100;

        //master['martes 21-01'].entregadas = 1887;
        //master['martes 21-01'].porciento  = master['martes 21-01'].entregadas / master['martes 21-01'].total * 100;
        cb(master);

    }else{
        cb({error: 'no data'})
    }



}


const acumAvance = function(master, asistencia, today, today_time, semana ){
  let key = asistencia.avance;
  let estados = master.estados;
  let cavance = estados.find(t => t.avance === key);
  if(cavance){
    cavance.token.cardinal +=1;


  }else {
    let  nuevoAvance = {
      avance: key,
      token: {
        label: key,
        cardinal: 1,
        key: key,
        slug: 'Estado actual'
      }
    }
    estados.push(nuevoAvance);
  }

}


const acumBruto = function(master, asistencia, today, today_time, semana ){
  //c onsole.log(semana.semd.getTime(), asistencia.fecomp_txa, asistencia.fecomp_tsa, semana.semh.getTime());

  //c onsole.log('tx[%s] asis[%s] today[%s] [%s][%s]',asistencia.fecomp_txa,asistencia.fecomp_txa, today_time, asistencia.fecomp_tsa === today_time,asistencia.fecomp_tsa == today_time);
  if(asistencia.fecomp_tsa === today_time){
    master.hoy.cardinal +=1;

  }

  if(asistencia.fecomp_tsa >= semana.semd.getTime() && asistencia.fecomp_tsa <= semana.semh.getTime()){
    master.semana.cardinal +=1;

  }
  acumMes(master, asistencia, today, today_time, semana )


}

const acumMes = function(master, asistencia, today, today_time, semana ){
  let key = today.getFullYear()+':'+today.getMonth();
  let meses = master.meses;
  let mes = meses.find(t => t.mes === key);
  if(mes){
    mes.token.cardinal +=1;


  }else {
    let  nuevoMes = {
      mes: key,
      token: {
        label: mesLabel[today.getMonth()],
        cardinal: 1,
        key: asistencia.avance,
        slug: 'Eventos/mes'
      }
    }
    meses.push(nuevoMes);
  }


}


const isThisYear = function(fechaPHP){
  let currentYear = false;

  if(fechaPHP.getFullYear() === 2019) currentYear = true;

  return currentYear;
}

const isDeprecated = function(fechaPHP){
  let isDeprecated = false;

  if(fechaPHP.getFullYear() <= 2018) isDeprecated = true;

  return isDeprecated;
}

const buildObservacion = function(token){
  let obsList = token.observaciones;
  let obsText = "[Id: " + token.entrega.id + '] ';
  if(!obsList && !obsList.length) return obsText;

  obsList.forEach(t =>{
    let tx = ''

    if(t.text !== "NULL"){
      tx = t.ts + ':: ' + t.text + ' / '
    }

    obsText = obsText + tx;
  })

  return obsText;
}




function buildInverteTree(req, errcb, cb){
  person.buildInvertedTree().then(personTree => {

    processArchive(personTree, req, errcb, cb)

  });
}



/***
db.asisprevenciones.find({sector: 'ivr',avance: {$in: ['emitido', 'descartado', 'esperamedico', 'enobservacion', 'nocontesta','enaislamiento', 'esperasame' ]}},{avance:1}).count()


// QUERY REPORTE SEGUIMIENTO IVR
db.asisprevenciones.find({avance: { '$ne': 'anulado' },
  isVigilado: true,
  fecomp_tsa: { '$gte': 1597460400000, '$lt': 1601521200000 },
  estado: 'activo',
  hasParent: true,
  'infeccion.actualState': {'$not': {'$in': [1, 4, 5]}}}
  ).count()

db.asisprevenciones.find({
  avance: { '$ne': 'anulado' },
  'followUp.altaVigilancia': { '$ne': true },
  isVigilado: true,
  estado: 'activo',
  'muestraslab.locacionId': 'CAPS15'
}).count()


curl --request POST --url https://iop.hml.gba.gob.ar/servicios/JWT/1/REST/jwt --header 'authorization: Basic d3NfaG1sX2NvdmlkMTk6bkRxeUpJVnF4aksxak1a

****/



