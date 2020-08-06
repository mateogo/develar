/**
 *  Procesos auxiliares del Módulo Salud
 */

const whoami =  "models/zimportSalud: ";

const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')
const fs = require('fs');
const path = require('path');
const utils = require('../services/commons.utils');

const csv = require('csvtojson')

const person = require('./personModel');

const asisprevencion = require('./asisprevencionModel.js');
const serialModule = require('./serialModel.js');

const Schema = mongoose.Schema;

const self = this;

const PersonRecord = person.getRecord();
const AsisprevencionRecord = asisprevencion.getRecord();
const SerialRecord = serialModule.getRecord();




/**
	Importa archivo CSV originado por SISA SNVS
	Crea/actualiza PERSON y crea/actualiza asisprevencion
	Caso de Uso: (a) Importar COVID confirmados
  arch = path.join(config.rootPath, 'www/salud/migracion/sisa/personasImportCsv.csv');
  arch = path.join(config.rootPath,  public/migracion/sisa/personasImportCsv.csv');
  header Excel: fealta;fesintoma;apellido;nombre;ndoc;calle;localidad;telefono
	API:
	  local:  http://localhost:8080/api/auditodatos/importsisa
	  server: http://salud.brown.gob.ar/api/auditodatos/importsisa

**/
exports.importSisaArchive = processSisaArchive;



/*************************************************/
/* 	Importa archivo CSV originado por SISA SNVS */
/***********************************************/
function processSisaArchive(req, errcb, cb){
    //deploy
    const arch = path.join(config.rootPath, 'www/salud/migracion/sisa/personasImportCsv.csv');

    // local
    //const arch = path.join(config.rootPath,        'public/migracion/sisa/personasImportCsv.csv');

    function toLowerCase(name){
        return name.toLowerCase();
    }

    function toUpperCase(name){
        return name.toUpperCase();
    }

    csv({delimiter: ';'})
    .fromFile(arch)
    .then((persons) => {

    		let compNumCounter = 0;
    		if(!persons) persons = [];


				testSerialRecord().then(oldSerial => {
					if(oldSerial){
				    oldSerial.fe_ult = Date.now();
				    compNumCounter  = oldSerial.pnumero  + oldSerial.offset;

				    oldSerial.pnumero += persons.length;
				    let id = oldSerial._id;

				    SerialRecord.findByIdAndUpdate(id, oldSerial, {new: true }).then(serial =>{
				  		//c onsole.log('UPDATED ASIS Serial Fetched [%s] [%s] [%s]', serial.compPrefix, serial.compName, serial.pnumero)
						})

				    persons.forEach((token, index) => {

				        processOneSaludPerson(token, compNumCounter);
				    		compNumCounter +=1;

				    });

		                    
		        cb({result: "ok: " + persons.length})


					}

				});

    });
}


async function processOneSaludPerson(token, compNum){
		let tperson;

		//c onsole.log('processOnePerson: [%s] [%s] [%s]', token.ndoc, token.apellido, token.nombre);


		let query = personBuildQuery({
		    tdoc: 'DNI',
		    ndoc: token.ndoc
		});

		tperson = await PersonRecord.findOne(query).exec();

		processOnePerson(tperson, token, compNum);


}

function processOnePerson(person, token, compNum){
    //c onsole.log('processOnePerson [%s]', person && person.displayName);
    let isNew = false;

    if(!person){

    	person = new PersonRecord();
    	isNew = true;


    	//c onsole.log('New Person  [%s] [%s] [%s]', token.apellido, token.ndoc, person._id)
    }


    buildSaludCoreData(person, token);
    buildSaludLocaciones(person, token);


    saveSaludRecord(person, isNew, token, compNum);
}

const buildSaludCoreData = function(person, token){

    person.grupo_familiar = 0;
    person.apellido = token.apellido
    person.nombre = token.nombre

    person.displayName = person.apellido + ', ' + person.nombre;

    personType = 'fisica';

    person.isImported = true;

    person.idbrown = 'sisa:' + token.fealta;
    person.alerta = 'COVID - fecha inicio síntomas: ' + token.fesintoma;
    person.locacion = token.calle + ' ' + token.localidad;

    person.tdoc = 'DNI';
    person.ndoc = token.ndoc;
    //person.cuil = token.ncuil;


    person.ts_alta = Date.now();
    person.ts_umodif = person.ts_alta;

    let contactdata = {
        tdato: 'CEL',
        data: token.telefono || 'sin dato',
        type:  'PER',
        slug: 'dato importado de excel',
        isPrincipal: true,

    }
    person.contactdata = [ contactdata]

    // person.locaciones = token. ;
    // person.familiares = token. ;
    // person.user = token. ;
    // person.communitylist = token. ;
    // person.contactdata = token. ;
    // person.oficios = token. ;
}

const buildSaludLocaciones = function(person, token){
    let locaciones = [];
    let city = '';
    let zip = '';
    let barrio =  '';

    let localidad = _getOptToken('city', token.localidad);
    if(localidad){
    	city = localidad.val;
    	zip = localidad.cp;
    }

    let locacion = {
        "slug": "domicilio informado",
        "description": "Importado de excel",
        "isDefault": true,
        "addType": "principal",
        "street1": token.calle || 'sin dato',
        "street2": "",
        "streetIn": "",       
        "streetOut": "",
        "city": city || 'extradistrito',
        "state": "buenosaires",
        "statetext": "Brown",
        "zip": zip,
        "country": "AR",
        "estado": "activo",
        "barrio": "",

    }

    locaciones.push(locacion);
    person.locaciones = locaciones;
}



function saveSaludRecord(person, isNew, token, compNum){
    if(isNew){


    	//c onsole.log('Ready To PersonSave')
      person.save().then(person =>{
          if(person && person._id){
              //c onsole.log('CREATED: Person [%s] [%s]', person._id, person.displayName);
              processAsistenciaPrevencion(token, person, compNum);
          }

      })

    }else{

    	//c onsole.log('Ready To PersonFindAndUpdate')
      PersonRecord.findByIdAndUpdate(person._id, person, { new: true }).then( person =>  {
          if(person && person._id){
              //c onsole.log('UPDATAED: Person [%s] [%s]', person._id, person.displayName);
              processAsistenciaPrevencion(token, person, compNum);
          }
      })

    }

}

/*************************************************/
/* 	Create / Update Asistencia Prevencion       */
/***********************************************/

async function processAsistenciaPrevencion(token, person, compNum){

	let regexQuery = asisprevencionBuildQuery({
		ndoc: person.ndoc,
		tdoc: person.tdoc
	});

	let asis;

	asis = await AsisprevencionRecord.findOne(regexQuery).exec()
	//c onsole.log('PROCESS ASIS: [%s] [%s]', person.ndoc, asis && asis.compNum)

	if(asis) {
		await updateAsistenciaRecord(token, person, asis);
	}else {
		await createAsistenciaRecord(token, person, compNum);
	}

}

async function updateAsistenciaRecord(token, person, asis){
		asis.prioridad = 2;
		asis.idbrown = 'sisa:' + token.fealta;

		asis.isVigilado = true;
		asis.tipo = 1;
		asis.isCovid = true;

		asis.action = 'epidemio';
		asis.estado = 'activo';
		asis.avance = 'emitido';

		updateFollowUp(asis, token);
		buildCovid(asis,token);

		console.log('UPDATE ASIS: [%s] [%s]', asis.ndoc, asis.compNum)
		await AsisprevencionRecord.findByIdAndUpdate(asis.id, asis, { new: true }).exec();
}


async function createAsistenciaRecord(token, person, compNum){
				const asis = new AsisprevencionRecord();
				buildCoreAsis(asis, person, compNum, token);
				buildCovid(asis, token);
				buildFollowUp(asis, token);
				buildSisaEvent(asis, token);

				console.log('CREATE ASIS: [%s] [%s]', asis.ndoc, asis.compNum)
				asis.save();

}


function updateFollowUp(asis, token){
	let followUp = asis.followUp;

	if(followUp){
		followUp.isActive = true;
		followUp.fe_inicio = followUp.fe_inicio ? followUp.fe_inicio : token.fealta
		followUp.fets_inicio = followUp.fets_inicio ? followUp.fets_inicio : utils.dateNumFromTx(token.fealta);
		if(!followUp.isAsignado){
			if(followUp.isContacto){
				followUp.isAsignado = followUp.isContacto;
				followUp.asignadoId = followUp.derivadoId;
				followUp.asignadoSlug = followUp.derivadoSlug;

				followUp.isContacto = false;
				followUp.derivadoId = "";
				followUp.derivadoSlug = "";
			}
		}

	}else {
		let followUp = new AfectadoFollowUp();
		followUp.fe_inicio = token.fealta;
		followUp.fets_inicio = utils.dateNumFromTx(token.fealta);
		asis.followUp = followUp;
	}

}

function buildCovid(asis, token){
	let infeccion = asis.infeccion;

	if(!infeccion){
		infeccion = new InfectionFollowUp();
	}

	infeccion.isActive = true;
	infeccion.hasCovid = true;
	infeccion.actualState = 1;

	if(token.fesintoma){
		infeccion.fe_inicio = token.fesintoma;
		infeccion.fets_inicio = utils.dateNumFromTx(token.fesintoma);
	}

	if(token.fealta){
		infeccion.fe_confirma = token.fealta;
		infeccion.fets_confirma = utils.dateNumFromTx(token.fealta);
	}

	asis.infeccion = infeccion

}

function buildSisaEvent(asis, token){
	let sisaEvent = new SisaEvent();
	sisaEvent.fe_reportado = token.fealta;
	sisaEvent.fe_consulta = token.fealta;

	sisaEvent.fets_reportado = utils.dateNumFromTx(token.fealta);
	sisaEvent.fets_consulta = utils.dateNumFromTx(token.fealta);

	asis.sisaevent = sisaEvent;

}

function buildFollowUp(asis, token){
	let followUp = new AfectadoFollowUp();
	followUp.fe_inicio = token.fealta;
	followUp.fets_inicio = utils.dateNumFromTx(token.fealta);
	asis.followUp = followUp;
}



/**

		_id: string;
		compPrefix:  string = 'SOL';
		compName:    string = 'S/Asistencia';
		compNum:     string = '00000';
		tipo:        number = 1; // 1: COVID 2:Denuncia  3:IVR 4:Detectar
		prioridad:   number = 2; // 1:baja 2:media 3: alta

		idPerson:    string;
		ndoc:        string;
		tdoc:        string;
		sexo:        string;
		fenactx:     string;
		edad:        string;
		telefono:    string;
		osocial:     string;
		osocialTxt:  string;

		contactosEstrechos?:number = 0; // helper de listado

		idbrown:     string;
		fecomp_tsa:  number;
		fecomp_txa:  string;
		fenotif_tsa:  number;
		fenotif_txa:  string;

		action:      string = 'covid';
		slug:        string;
		description: string;

		sector:      string;
		estado:      string = 'activo';
		avance:      string = 'emitido';
		ts_alta:     number;
		ts_fin:      number;
		ts_prog:     number;

		sintomacovid: ContextoCovid;
		denuncia: ContextoDenuncia;

		locacion:    Locacion;
		requeridox:  Requirente;
		atendidox:   Atendido;

		modalidad:   Alimento;
		encuesta:    Encuesta;
		pedido:      Pedido;

		isVigilado:     boolean;
		hasSeguimiento: boolean;
		isCovid:        boolean;
		isInternado:    boolean;
		hasParent:      boolean;
		casoIndice:   CasoIndice;

		infeccion:    InfectionFollowUp;
		internacion:  InternacionAsis;
		sisaevent:    SisaEvent;
		followUp:     AfectadoFollowUp;

		novedades:         Array<Novedad>;
		muestraslab:       Array<MuestraLaboratorio>;
		sisaEvolucion:     Array<SisaEvolucion>;
		seguimEvolucion:   Array<AfectadoUpdate>;
		contextoAfectados: Array<ContextoAfectados>;
		morbilidades:      Array<Morbilidad>;



**/

function buildCoreAsis(asis, person, compNum, data){

		let ts = Date.now();

		let fealta = data.fealta || utils.dateToStr(new Date());
		let fealta_date = utils.parseDateStr(fealta) || new Date();
		let fealta_ts = fealta_date ? fealta_date.getTime() : ts;


		let requirente;

		let novedad = {
			tnovedad: "sisa",
			novedad: 'Alta registro importado de SISA',
			fecomp_txa: fealta,
			fecomp_tsa: fealta_ts,
			atendidox: null

		}



		if(person){

			let edad = getEdadFromPerson(person)
  		requirente = buildCovidRequirente(person);
			asis.idPerson = person._id;
			asis.ndoc = person.ndoc;
			asis.tdoc = person.tdoc;
			asis.sexo = person.sexo;
			asis.edad = edad + '';

			let telefono = person.contactdata && person.contactdata.length && person.contactdata[0];
			asis.telefono = telefono ? telefono.data : '';

			let address = person.locaciones && person.locaciones.length && person.locaciones[0];
			if(address) {
				let locacion = new Locacion();
				locacion.street1 = address.street1;
				locacion.streetIn = address.streetIn;
				locacion.streetOut = address.streetOut;
				locacion.city = address.city;
				locacion.barrio = address.barrio;
				asis.locacion = locacion;
			}

		}else{
			requirente = new Requirente();
			asis.idPerson = null;
		}

		asis.fecomp_txa = fealta;
		asis.fecomp_tsa = fealta_ts;

		asis.fenotif_txa = fealta;
		asis.fenotif_tsa = fealta_ts;

		asis.hasParent = false;
		asis.contactosEstrechos = 0;
		asis.tipo = 1;
		asis.isCovid = true;
		asis.prioridad = 2;
    asis.idbrown = 'sisa:' + data.fealta;

		asis.action = 'epidemio';
		asis.slug = 'Alta importacion SISA: ' + fealta;
		asis.sector = 'epidemiologia';
		asis.requeridox = requirente;
		asis.description = '';

		asis.compPrefix = 'SOL' ;
		asis.compName = 'S/Asistencia';
		asis.compNum = compNum;

		asis.ts_alta = ts;
		asis.ts_fin = 0
		asis.ts_prog = ts;
		asis.estado = 'activo';
		asis.avance = 'emitido';
		asis.novedades = [ novedad ];
		asis.isVigilado = true;

		return asis;




}








/*************************************************/
/*   	HELPERS                                   */
/***********************************************/
const ciudadesBrown = [
    {val: 'no_definido',         cp:'1800', label: 'Seleccione opción',  sisa: 'Seleccione opción' },
    {val: 'adrogue',             cp:'1846', label: 'Adrogué ',           sisa: 'Adrogue' },
    {val: 'adrogue',             cp:'1846', label: 'Adrogué ',           sisa: 'Adrogué' },
    {val: 'burzaco',             cp:'1852', label: 'Burzaco ',           sisa: 'Burzaco' },
    {val: 'calzada',             cp:'1847', label: 'Rafael Calzada ',    sisa: 'Rafael Calzada' },
    {val: 'claypole',            cp:'1849', label: 'Claypole',           sisa: 'Claypole' },
    {val: 'donorione',           cp:'1850', label: 'Don Orione',         sisa: 'Don Orione' },
    {val: 'glew',                cp:'1856', label: 'Glew',               sisa: 'Glew' },
    {val: 'longchamps',          cp:'1854', label: 'Longchamps',         sisa: 'Longchamps' },
    {val: 'malvinasargentinas',  cp:'1846', label: 'Malvinas Argentinas',sisa: 'Malvinas Argentinas' },
    {val: 'marmol',              cp:'1845', label: 'J.Mármol',           sisa: 'José Mármol' },
    {val: 'ministrorivadavia',   cp:'1852', label: 'Ministro Rivadavia', sisa: 'Ministro Rivadavia' },
    {val: 'solano',              cp:'1846', label: 'San Fco Solano',     sisa: 'San Francisco Solano' },
    {val: 'sanjose',             cp:'1846', label: 'San José',           sisa: 'San José' },
    {val: 'sindato',             cp:'0000', label: 'Sin dato',           sisa: 'En Investigacion', },
    {val: 'extradistrito',       cp:'0000', label: 'Extra distrito',     sisa: '', },

];


const optList = {
    city: ciudadesBrown,
}

function _normalize(type, value){
    if(!value) return '';
    let token = optList[type].find(t => value.indexOf(t.sisa) !== -1);

    if(token) return token.val;
    else return value;
}

function _getOptToken(type, value){
    if(!value) return null;
    let token = optList[type].find(t => value.indexOf(t.sisa) !== -1);

    if(token) return token;
    else return null;
}



function personBuildQuery(query){
    let q = {estado: {$not: {$in: [ 'baja', 'bajaxduplice' ]} }  };

    if(query.displayName){
        q["displayName"] = {"$regex": query.displayName, "$options": "i"};
    }

    if(query.email){
        q["email"] = query.email;
    }

    if(query.tdoc){
        q["tdoc"] = query.tdoc;
    }

    if(query.ndoc){
        q["ndoc"] = query.ndoc;
    }

    if(query.facetas){
        q["facetas"] = query.facetas;
    }

    if(query.userId){
        q["user.userid"] = query.userId;
    }

    if(query.familiar){
        q['familiares.personId'] = query.familiar;
    }

    if(query.mismalocacion){
        q['_id'] = {$ne: query.personId};
        q['locaciones.street1'] =  {"$regex": query.street1, "$options": "i"};
        q['locaciones.city'] = query.city;

    }

    if(query.list){

        let ids = query.list.split(',');
        let new_ids = ids.map(t => mongoose.Types.ObjectId(t));
        q["_id"] = { $in: new_ids}
    }

    return q;
}

function asisprevencionBuildQuery(query, today){

  let q = {};

  // busco un registro en particular
  if(query['isVigilado']){
    q["isVigilado"] = true;
  }

  if(query['requirenteId']){
      q["requeridox.id"] = query['requirenteId'];
      if(q["isVigilado"]) return q; // es caso único, no filtra por nada más

  }


  if(query['asistenciaId']){
      q["asistenciaId"] = query['asistenciaId'];
      return q;
  }

  if(query['tdoc']){
      q["tdoc"] = query['tdoc'];
  }

  if(query['ndoc']){
      q["ndoc"] = query['ndoc'];
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


  return q;
}


function serialBuildQuery(query){
  // name: nombre del serial
  // tserial:     { type: String, required: true },
  // tdoc:        { type: String, required: true },
  // letra:       { type: String, required: false },
  // anio:        { type: String, required: false },
  // estado:      { type: String, required: true },

  let date = new Date();
  let anio = date.getFullYear();

    let q = {};
    if(query['type']){
        q["type"] = query['type'];
    }

    if(query['name']){
        q["name"] = query['name'];
    }

    if(query['sector']){
        q["sector"] = query['sector'];
    }

    if(query['tserial']){
        q["tserial"] = query['tserial'];
    }

    if(query['tdoc']){
        q["tdoc"] = query['tdoc'];
    }

    if(query['letra']){
        q["letra"] = query['letra'];
    } else {
        q["letra"] = 'X';
    }

    if(query['punto']){
        q["punto"] = parseInt(query['punto'], 10);
    } else {
        q["punto"] = 0;
    }

    if(query['anio']){
        q["anio"] = parseInt(query['anio'], 10);
    } else {
        q["anio"] = anio;
    }

    if(query['estado']){
        q["estado"] = query['estado'];
    }else{
        q["estado"] = 'activo';
    }

    return q;
}


// function getNextSerial(serial){

//     serial.fe_ult = Date.now();
//     serial.pnumero +=1;
//     let id = serial._id;
//     c onsole.log('getNext:  [%s]', serial.pnumero);

//     return SerialRecord.findByIdAndUpdate(id, serial, {new: true });


// }

function testSerialRecord() {
	  let query = asistenciaSerial();
	 
	  let fecha = new Date();

	  query.anio = fecha.getFullYear();
	  query.mes = fecha.getMonth();
	  query.dia = fecha.getDate();


    let regexQuery = serialBuildQuery(query);
    return SerialRecord.findOne(regexQuery).exec()
}






function asistenciaSerial(){
	let serial = {};
	serial.type = 'asistencia'; // asistencia
	serial.name = 'solicitud'; // solicitud
	serial.tserial = 'sasistencia';
	serial.sector = 'epidemiologia'; //  alimentos; nutricion; etc;
	serial.tdoc = 'solicitud';
	serial.letra = 'X';
	serial.anio = 0;
	serial.mes = 0;
	serial.dia = 0;
	serial.estado = 'activo';
	serial.punto = 0;
	serial.pnumero = 1;
	serial.offset = 100000;
	serial.slug = 'Solicitudes de asistencia prevención Salud';
	serial.compPrefix = 'SOL';
	serial.compName = 'S/Asistencia';
	serial.showAnio = false;
	serial.resetDay = false;
	serial.fe_ult = 0;

	return serial;
}





function getEdadFromPerson(person){
		let edad = null
		if(person && person.fenactx){
			try {
				edad = utils.edadActual(utils.parseDateStr(person.fenactx));
				return edad;
			}
			catch {
				return null;
			}

		}else{
			return edad;
		}
}

function buildCovidRequirente(person) {
		let req;

		if(person && person._id){
			req = {
				id:   person._id ,
				slug: person.displayName ,
				nombre: person.nombre,
				apellido: person.apellido,
				tdoc: person.tdoc ,
				ndoc: person.ndoc 
			}

		}else{
			req = {
				id:   null,
				slug: person.displayName ,
				tdoc: person.tdoc ,
				ndoc: person.ndoc,
				nombre: person.nombre,
				apellido: person.apellido,
			}

		}

		return req;
}

class Locacion {
    _id;
    street1 = '';
    street2 = '';
    streetIn = '';
    streetOut = '';
    city = '';
    barrio = '';
    lat = 0;
    lng = 0;
    zip = '';
}

class Requirente {
		id = '';
		slug = '';
		tdoc = '';
		ndoc = '';
		sexo = '';
		fenac = '';
		edad = 0;
		nombre = '';
		apellido = '';
};


class InfectionFollowUp {
	isActive = true;
	isInternado = false;
	isExtradistrito = false;
	hasCovid = true;

	actualState = 1 // 0:sano; 1:COVID; 2:Recuperado; 3: Descartado; 4: Fallecido; 5: alta
													//estadoActualAfectadoOptList
	fe_inicio = '';  
	fe_confirma = '';
	fe_alta = '';

	avance = 'comunitario'; //avanceInfectionOptList
	sintoma = 'sindato'; // sintomaOptList
	locacionSlug = '' // lugar de internación

	institucion = 'noinstitucionalizado'; //institucionalizadoOptList
	institucionTxt = 'No institucionalizado';

	trabajo = 'sindato'; //lugartrabajoOptList
	trabajoTxt = ''; 

	qcoworkers = 0;
	qcovivientes = 0 ;
	qotros = 0;
	slug = 'Caso importado via Excel de SISA';

	fets_inicio = 0; 
	fets_confirma = 0;
	fets_alta = 0;
}


class AfectadoFollowUp {
	isActive = true;
	isAsistido = true; // se le hace seguimiento asistencial?

	altaVigilancia = false; // no se le hace más seguimiento epidemiológico, caso de alta
	altaAsistencia = false; // no se le hace más seguimiento asistencial

	fe_inicio = '';
	fe_ucontacto = '';
	fe_ullamado = '';

	parentId;   // caso indice: ID de la SOL/Asistencia
	parentSlug; // caso índice

	qllamados = 0;   // llamados totales
	qcontactos = 0; // llamados con respuesta del afectado

	lastCall = 'logrado';// resultadoSeguimientoOptList 'pendiente|logrado|nocontesta'
	qIntents = 0;

	tipo = 'infectado'; //tipoSeguimientoAfectadoOptList
	sintoma = 'sindato'; //sintomaOptList
	vector = 'inicia'; //vectorSeguimientoOptList
	fase = 'fase0' //faseAfectadoOptList

	// asignados: Array<AsignadosSeguimiento> = [];
	slug = 'Inicia seguimiento de afectado/a';


	//Caso indice asignado a... 
	isAsignado = false;
	asignadoId = '';
	asignadoSlug = '';

	//Es contacto, y por lo tanto es monitoreado por...
	isContacto = false;
	derivadoId = '';
	derivadoSlug = '';


	fets_inicio = 0;
	fets_ucontacto = 0;
	fets_ullamado= 0;

}


class SisaEvent {
	isActive = true; // si hay registro en sisa en este momento.
	sisaId = '';
	reportadoPor = 'MAB';

	fe_reportado = ''; 
	fe_baja = ''; 
	fe_consulta = ''; 
	avance = 'sospecha'; //avanceSisaOptList
	slug   = '';

	fets_reportado = 0;
	fets_baja = 0;
	fets_consulta = 0;
}


// 30/07 local: 1191 Personas; 983 Asistencias; a importar 191: 29/07 y 41: 28/07

/***

db.usuarios.insertOne({
	"_id" : ObjectId("5f061507a4554671e53fd098"),
	"provider" : "local",
	"moduleroles" : [
		"vigilancia:operator"
	],
	"localProfile" : true,
	"externalProfile" : false,
	"language" : "es",
	"username" : "Guillermo Necco",
	"email" : "lw3dyl@gmail.com",
	"termscond" : false,
	"estado" : "pendiente",
	"navance" : "webform",
	"roles" : "operator",
	"accessToken" : "",
	"modulos" : "vigilancia",
	"grupos" : "",
	"fealta" : ISODate("2020-07-08T18:48:39.289Z"),
	"avatarUrl" : "",
	"description" : "",
	"cellphone" : "",
	"currentCommunity" : {
		"id" : null,
		"name" : "develar",
		"slug" : "develar",
		"displayAs" : "develar"
	},
	"verificado" : {
		"mail" : false,
		"feaprobado" : 1594234086779,
		"adminuser" : ""
	},
	"password" : "f4a2cc2b911009",
	"displayName" : "Guillermo Necco",
	"providerId" : "Guillermo Necco",
	"googleProfile" : {
		"emails" : [ ],
		"_id" : ObjectId("5f061507a4554671e53fd099"),
		"photos" : [ ]
	},
	"__v" : 0,
	"personId" : "5f061507a4554671e53fd09a"
})
1595991600000
1596078000000,
1596234544774
1596164400000


*/

