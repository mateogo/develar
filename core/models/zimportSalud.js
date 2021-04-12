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
const userModel = require('./userModel');

const asisprevencion = require('./asisprevencionModel.js');
const serialModule = require('./serialModel.js');

const Schema = mongoose.Schema;

const self = this;
const USER_EPIDEMI_OPERATOR = [ 'vigilancia:operator' ];

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

	userModel.findByEpidemioRole(USER_EPIDEMI_OPERATOR).then(userList => {
		userList = userList || [];
		console.log('process SISA ARCHIVE to BEGIN 	W/[%s]', userList.length);
		_processSisaArchive(req, errcb, cb, userList)
	});
}


function _processSisaArchive(req, errcb, cb, userList){
    //deploy
    const arch = path.join(config.rootPath, 'www/salud/migracion/sisa/personasImportCsv.csv');

	//c onsole.log('ATENCIÓN: ESTÁ EN LOCAL MODE')
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

					for(let index = 0; index < persons.length; index++){
						processOneSaludPerson(persons[index], compNumCounter, userList);
						compNumCounter +=1;

					}

					// persons.forEach((token, index) => {

					// 	processOneSaludPerson(token, compNumCounter);
					// 		compNumCounter +=1;

					// });

							
					cb({result: "ok: " + persons.length})


				}

			});

    });
}


async function processOneSaludPerson(token, compNum, userList){
		let tperson;

		if(token.feresultado && !utils.dateNumFromTx(token.feresultado)){
			token.feresultado = token.fealta;
		}


		let query = personBuildQuery({
		    tdoc: 'DNI',
		    ndoc: token.ndoc
		});

		tperson = await PersonRecord.findOne(query).exec();

		processOnePerson(tperson, token, compNum, userList);


}

function processOnePerson(person, token, compNum, userList){
    //c onsole.log('processOnePerson [%s]', person && person.apellido);
    let isNew = false;

    if(!person){

    	person = new PersonRecord();
    	isNew = true;


    	//c onsole.log('New Person  [%s] [%s] [%s]', token.apellido, token.ndoc, person._id)
    }


    buildPersonSaludCoreData(person, token, isNew);
    buildPersonSaludLocaciones(person, token, isNew);

    savePersonSaludRecord(person, isNew, token, compNum, userList);
}

const buildPersonSaludCoreData = function(person, token, isNew){

    person.grupo_familiar = 0;
    person.apellido = token.apellido
    person.nombre = token.nombre

    person.displayName = person.apellido + ', ' + person.nombre;

    personType = 'fisica';

    person.isImported = true;

    person.idbrown = 'sisa:' + token.fealta;
    person.alerta = 'COVID - fecha inicio síntomas: ' + (token.femuestra || token.fesintoma);
    person.locacion = token.direccion + (token.callenro || '') + ' ' + token.localidad;

    person.tdoc = 'DNI';
	person.ndoc = token.ndoc;
	
	//person.cuil = token.ncuil;
	if(token.sexo === "M") person.sexo = 'F';
	else if(token.sexo ==="V") person.sexo = 'M';
	else person.sexo = "";
	
	// edad
	if(token.edad){


		try {
			let year = new Date().getFullYear() - token.edad;
			let fenac_date = new Date(year,0,1)
			person.fenactx = utils.dateToStr(fenac_date);
			person.fenac = utils.dateNumFromTx(person.fenactx);
	
		}
		catch {
			person.fenactx = '';
			person.fenac = 0;
		}



	}


    person.ts_alta = Date.now();
    person.ts_umodif = person.ts_alta;

    let contactdata = person.contactdata && person.contactdata.length && person.contactdata[0];

    if(!contactdata){

    	contactdata = {
        tdato: 'CEL',
        data: token.telefono || 'sin dato',
        type:  'PER',
        slug: 'dato importado de excel',
        isPrincipal: true,
    	}
    	person.contactdata = [ contactdata]

    }else {

    	if(token.telefono && token.telefono !== contactdata.data){
    		contactdata.data = contactdata.data + ' / ' + token.telefono;
    	}

    }





    // person.locaciones = token. ;
    // person.familiares = token. ;
    // person.user = token. ;
    // person.communitylist = token. ;
    // person.contactdata = token. ;
    // person.oficios = token. ;
}

const buildPersonSaludLocaciones = function(person, token, isNew){
    let locaciones = person.locaciones || [];
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
        "street1": (token.direccion + ' ' + (token.callenro || '')) || 'sin dato',
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
	let already_exists = locaciones.find(l => l.street1 === locacion.street1);
	if(!already_exists){
		locaciones.push(locacion);
	}

    person.locaciones = locaciones;
}



function savePersonSaludRecord(person, isNew, token, compNum, userList){
    if(isNew){

    	//c onsole.log('Ready To PersonSave')
      person.save().then(person =>{
          if(person && person._id){
              //c onsole.log('CREATED: Person [%s] [%s]', person._id, person.displayName);
              processAsistenciaPrevencion(token, person, compNum, userList);
          }

      })

    }else{

    	//c onsole.log('Ready To PersonFindAndUpdate')
      PersonRecord.findByIdAndUpdate(person._id, person, { new: true }).exec().then( updatedPerson =>  {
		if(updatedPerson){
			if(updatedPerson&& updatedPerson.ndoc === "39114113") console.log('update TARGET')
			processAsistenciaPrevencion(token, updatedPerson, compNum, userList);

				//c onsole.log('UPDATAED: Person [%s] [%s]', person._id, person.displayName);
          }else {
			if(person&& person.ndoc === "39114113") console.log('error updating TARGET')
			console.log('Error updating PERSON #307 [%s]', person.ndoc)
			processAsistenciaPrevencion(token, person, compNum, userList);
		  }
      })

    }

}

/*************************************************/
/* 	Create / Update Asistencia Prevencion       */
/***********************************************/

async function processAsistenciaPrevencion(token, person, compNum, userList){

	let regexQuery = asisprevencionBuildQuery({
		ndoc: person.ndoc,
		tdoc: person.tdoc
	});

	let asis;

	if(person.ndoc === '39114113') console.log('asis.findOne ASIS: ')
	asis = await AsisprevencionRecord.findOne(regexQuery).lean().exec()
	if(asis&& asis.ndoc === "39114113"){
		console.log('asis FOUNDED!')
		console.dir(asis);
	}else if(person.ndoc === '39114113') console.log('asis NOTFOUNDED!')

	if(asis) {
		await updateAsistenciaRecord(token, person, asis, userList);
	}else {
		await createAsistenciaRecord(token, person, compNum, userList);
	}

}

async function updateAsistenciaRecord(token, person, asis, userList){

		if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia BEGIN [%s] [%s]', asis._id, asis.id);

		asis.prioridad = 2;

		asis.isVigilado = true;
		asis.tipo = 1;
		asis.isCovid = true;

		asis.action = 'epidemio';
		asis.estado = 'activo';
		asis.avance = 'emitido';

		updateCoreAsis(asis, person, token);
		if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P1')
		updateFollowUp(asis, token);
		if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P2')
		buildMuestrasLab(asis, token);
		if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P3')
		buildCovid(asis,token);
		if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P4')
		assignUserToFollowUp(asis, token, userList);
		if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P5')

		//c onsole.log('OjO: UPDATE save is commented')
		// c onsole.log('updating ASIS: [%s] [%s]', asis.ndoc, asis && asis.compNum)
		if(asis.ndoc === "39114113"){
			console.dir(asis);
		}
		let result = await AsisprevencionRecord.findByIdAndUpdate(asis._id, asis, { new: true }).exec();
		if(asis&& asis.ndoc === "39114113") console.log('UPDATED ASISTENCIA P1')
		return result;

}


async function createAsistenciaRecord(token, person, compNum, userList){
				const asis = new AsisprevencionRecord();
				buildCoreAsis(asis, person, compNum, token);
				buildCovid(asis, token);
				buildFollowUp(asis, token);
				buildMuestrasLab(asis, token);
				buildSisaEvent(asis, token);

				assignUserToFollowUp(asis, token, userList)
				//c onsole.log('OjO: CREATE save is commented')
				asis.save();

}

function assignUserToFollowUp(asis, token, userList){
	if(!(userList && userList.length)) return;

	// los casos marcados como CAPS serán autoasignados por éstos
	if(token.asignadoa && token.asignadoa === 'CAPS') return;

	// los obitos no se asignan para seguimiento sino para salud mental
	if(token['novedad'] && token['novedad'].toLowerCase() === 'obito' ) return;
	
	let user = userList[utils.between(0, userList.length)]
	//c onsole.log('assignUserToFollowUp [%s] rnd:[%s]', userList.length, (user && user.displayName ));

	_applyAsignadoToAsistencia(asis, user)
}


function _applyAsignadoToAsistencia(asistencia, user ){
	if(!user) return;
    let followUpToken = asistencia.followUp;
    if(followUpToken){
		if(!(followUpToken.isAsignado && followUpToken.asignadoId)){
			followUpToken.isActive = true;
			followUpToken.tipo =         'infectado';
			followUpToken.isAsignado =   true;
			followUpToken.asignadoId =   user.id;
			followUpToken.asignadoSlug = user.displayName;
			//c onsole.log('Iajuuu  Asignado a: [%s]', followUpToken.asignadoSlug)
		}else {
			//c onsole.log('ALREADY HAS USER ASIGNED TO FOLLOW UP');
		}
    }
}


function updateFollowUp(asis, token){
	let followUp = asis.followUp;
	if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P2.1')

	if(followUp){
		if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P2.2')
		followUp.isActive = true;
		followUp.fe_inicio = followUp.fe_inicio ? followUp.fe_inicio : token.fealta
		followUp.fets_inicio = followUp.fets_inicio ? followUp.fets_inicio : utils.dateNumFromTx(token.fealta);
		followUp.fets_nextLlamado = followUp.fets_nextLlamado ? followUp.fets_nextLlamado : utils.dateNumFromTx(token.fealta);
		followUp.nuevollamadoOffset = followUp.nuevollamadoOffset || 1;
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
		if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P2.3.1')
		let followUp = buildFollowUp(asis, token);
		if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P2.3.2')
		asis.followUp = followUp;
		if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P2.3.3')
	}
	if(asis&& asis.ndoc === "39114113") console.log('updateAsistncia P2.4')

}

function buildCovid(asis, token){
	let infeccion = asis.infeccion;

	if(!infeccion){
		infeccion = new InfectionFollowUp();
	}

	infeccion.isActive = true;
	infeccion.hasCovid = true;
	infeccion.actualState = 1;
	infeccion.mdiagnostico = 'laboratorio';

	if(token.fesintoma || token.femuestra){
		infeccion.fe_inicio = (token.femuestra || token.fesintoma);
		infeccion.fets_inicio = utils.dateNumFromTx(infeccion.fe_inicio);
	}

	if(token.fealta || token.feresultado){
		infeccion.fe_confirma = token.feresultado || token.fealta;
		infeccion.fets_confirma = utils.dateNumFromTx(infeccion.fe_confirma);
	}

	if(token['novedad']){
		let novedad = token['novedad'];
		novedad = (novedad && novedad.toLowerCase()) || '';

		if(novedad === 'obito' ){
			infeccion.actualState = 4
			infeccion.hasCovid = false;
			infeccion.fe_alta = token.fealta

		}else if (novedad === 'nexo'){
			infeccion.avance = 'nexo';
			infeccion.mdiagnostico = 'nexo';


		}else if (novedad === 'criterio clinico' || novedad === 'criterio clínico'){
			infeccion.avance = 'comunitario';
			infeccion.mdiagnostico = 'clinica';



		}else if (novedad === 'geriatrico'){
			infeccion.institucion = 'geriatrico';
			infeccion.institucionTxt = 'Geriátrico';
		}
	}

	if(token['tecnica'] && (token['tecnica'] === 'criterio clinico' || token['tecnica'] === 'criterio clínico' ) ){
		infeccion.avance = 'comunitario';
		infeccion.mdiagnostico = 'clinica';

	}

	if(token['resultado']){
		if(token['resultado'] === 'DESCARTADO'){
			infeccion.actualState = 2
			infeccion.hasCovid = false;
			infeccion.fe_alta = token.fealta
		}
	}

	asis.infeccion = infeccion
}

function buildSisaEvent(asis, token){
	let sisaEvent = new SisaEvent();

	sisaEvent.fe_reportado = token.feresultado || token.fealta;
	sisaEvent.fe_consulta = token.fealta;

	sisaEvent.fets_reportado = utils.dateNumFromTx(sisaEvent.fe_reportado);
	sisaEvent.fets_consulta =  utils.dateNumFromTx(sisaEvent.fe_consulta);

	sisaEvent.reportadoPor = token.reportadox;
	sisaEvent.sisaId = token.sisaid || "";

	asis.sisaevent = sisaEvent;

}

function buildFollowUp(asis, token){
	let followUp = new AfectadoFollowUp();
	followUp.fe_inicio = token.fealta;
	followUp.fets_inicio = utils.dateNumFromTx(followUp.fe_inicio);
	followUp.fets_nextLlamado = followUp.fets_nextLlamado ? followUp.fets_nextLlamado : utils.dateNumFromTx(token.fealta);
	followUp.nuevollamadoOffset = followUp.nuevollamadoOffset || 1;
	asis.followUp = followUp;
	return followUp;
}


function updateCoreAsis(asis, person, data){

		let ts = Date.now();
		let novedades = asis.novedades || [];

		let fealta = data.fealta || utils.dateToStr(new Date());
		let fealta_date = utils.parseDateStr(fealta) || new Date();
		let fealta_ts = fealta_date ? fealta_date.getTime() : ts;

    	asis.idbrown = 'sisa: ' + fealta + ' [' + ts + ']';

		let requirente;

		let novedad = {
			isActive: false,
			tnovedad: "notifsistema",
			novedad: 'Actualización por importación de registro del sistema SISA',
			sector: 'sistema',

			intervencion: 'notifsistema',
			urgencia: 1,

			fecomp_txa: fealta,
			fecomp_tsa: fealta_ts,

			hasNecesidad: false,
			fe_necesidad: fealta,
			fets_necesidad: fealta_ts,

			hasCumplimiento: true,
			estado: 'cumplido',
			avance: 'emitido',
			ejecucion: 'cumplido',
	
			atendidox: null
		}

		novedades.push(novedad);

		if(person){

			let edad = getEdadFromPerson(person)
  			requirente = buildCovidRequirente(person);

			asis.idPerson = person._id;
			asis.ndoc = (person.ndoc && person.ndoc !== asis.ndoc) ? person.ndoc: asis.ndoc;
			asis.tdoc = person.tdoc;
			asis.sexo = asis.sexo ? asis.sexo : person.sexo;
			asis.edad = asis.edad ? asis.edad : edad + '';

			let telefono = person.contactdata && person.contactdata.length && person.contactdata[0];
			let telData = telefono ? telefono.data || 'sin dato' : 'sin dato';
			let telExistente = asis.telefono || 'sin dato';

			if(telData !== telExistente && telData !== 'sin dato'){
				telExistente = telExistente ? telExistente + ' ' + telData : telData;
			}
			asis.telefono = telExistente;

			let address = person.locaciones && person.locaciones.length && person.locaciones[0];
			if(address) {
				let locacion = asis.locacion || new Locacion();
				locacion.street1 = locacion.street1 || address.street1;
				locacion.streetIn = locacion.streetIn || address.streetIn;
				locacion.streetOut = locacion.streetOut || address.streetOut;
				locacion.city = locacion.city || address.city;
				locacion.zip = locacion.zip || address.zip;
				locacion.barrio = locacion.barrio || address.barrio;
				asis.locacion = locacion;
			}

		}else{
			requirente = new Requirente();
			asis.idPerson = null;
		}

		if(data.asignadoa){
			let investigacion = asis.sintomacovid || new ContextoCovid();
			investigacion.userAsignado = data.asignadoa;
			investigacion.hasInvestigacion = investigacion.userId ? true: false;
			asis.sintomacovid = investigacion;	
		}


		asis.fenotif_txa = fealta;
		asis.fenotif_tsa = fealta_ts;

		asis.tipo = 1;
		asis.prioridad = 2;

		asis.action = 'epidemio';
		asis.slug = 'Registro importado de SISA el: ' + fealta;

		asis.requeridox = requirente;

		asis.ts_fin = 0
		asis.ts_prog = ts;
		asis.estado = 'activo';
		asis.avance = 'emitido';
		asis.novedades = novedades;
		asis.isVigilado = true;

		return asis;
}

function buildCoreAsis(asis, person, compNum, data){
		let ts = Date.now();
		let novedades = [];

		let fealta = data.fealta || utils.dateToStr(new Date());
		let fealta_date = utils.parseDateStr(fealta) || new Date();
		let fealta_ts = fealta_date ? fealta_date.getTime() : ts;

    	asis.idbrown = 'sisa: ' + fealta + ' [' + ts + ']';


		let requirente;

		let novedad = {
			isActive: false,
			tnovedad: "notifsistema",
			novedad: 'Alta registro importado de SISA',
			sector: 'sistema',

			intervencion: 'notifsistema',
			urgencia: 1,

			fecomp_txa: fealta,
			fecomp_tsa: fealta_ts,

			hasNecesidad: false,
			fe_necesidad: fealta,
			fets_necesidad: fealta_ts,

			hasCumplimiento: true,
			estado: 'cumplido',
			avance: 'emitido',
			ejecucion: 'cumplido',
	
			atendidox: null
		}

		novedades.push(novedad);

		if(data.asignadoa){
			let investigacion = new ContextoCovid();
			investigacion.userAsignado = data.asignadoa;
			investigacion.hasInvestigacion = investigacion.userId ? true: false;
			asis.sintomacovid = investigacion;
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

			if(!telefono || (telefono && telefono.data === 'sin dato')){
				let sintelefono = {
					isActive: true,
					tnovedad: "datos",
					novedad: 'Registro importado SISA sin teléfono',
					sector: 'sistema',

					intervencion: 'buscarTelefono',
					urgencia: 1,

					fecomp_txa: fealta,
					fecomp_tsa: fealta_ts,

					hasNecesidad: true,
					fe_necesidad: fealta,
					fets_necesidad: fealta_ts,

					hasCumplimiento: true,
					estado: 'activo',
					avance: 'emitido',
					ejecucion: 'emitido',

					atendidox: null
				}

				novedades.push(sintelefono);				
			}

			let address = person.locaciones && person.locaciones.length && person.locaciones[0];
			if(address) {
				let locacion = new Locacion();
				locacion.street1 = address.street1;
				locacion.streetIn = address.streetIn;
				locacion.streetOut = address.streetOut;
				locacion.city = address.city;
				locacion.zip = address.zip;
				locacion.barrio = address.barrio;
				asis.locacion = locacion;
			}

		}else{
			requirente = new Requirente();
			asis.idPerson = null;
		}

		if(data && data.resultado && data.resultado === 'DESCARTADO' ){
			let descartado_to_notify = {
				isActive: true,
				tnovedad: "datos",
				novedad: 'Notificar afectado/a de laboratorio NEGATIVO/ NO DETECTABLE',
				sector: 'sistema',

				intervencion: 'notifEstadoAlta',
				urgencia: 1,

				fecomp_txa: fealta,
				fecomp_tsa: fealta_ts,

				hasNecesidad: true,
				fe_necesidad: fealta,
				fets_necesidad: fealta_ts,

				hasCumplimiento: true,
				estado: 'activo',
				avance: 'emitido',
				ejecucion: 'emitido',

				atendidox: null
			}

			novedades.push(descartado_to_notify);				
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

		asis.action = 'epidemio';
		asis.slug = 'Registro importado de SISA el: ' + fealta;
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
		asis.novedades = novedades;
		asis.isVigilado = true;

		return asis;
}



function updatedMuestrasLab(laboratory, token){
	laboratory.resultado = (!token.resultado || token.resultado === 'CONFIRMADO') ? 'confirmada' : 'descartada';

	laboratory.fe_toma = token.femuestra || '';
	laboratory.fets_toma = laboratory.fe_toma ? utils.dateNumFromTx(laboratory.fe_toma) : 0 ;

	laboratory.fe_notificacion = token.fealta || '';
	laboratory.fets_notificacion = laboratory.fe_notificacion ? utils.dateNumFromTx(laboratory.fe_notificacion) : 0 ;

	laboratory.fe_resestudio = token.feresultado || token.fealta;
	laboratory.fets_resestudio = laboratory.fe_resestudio ? utils.dateNumFromTx(laboratory.fe_resestudio) : 0 ;

	laboratory.slug = 'Resultado importado de SISA el ' + token.fealta;
	laboratory.laboratorio = token.reportadox || '';
	laboratory.tipoMuestra = token.tecnica ? utils.safeIdentifier(token.tecnica) : laboratory.tipoMuestra || 'hisopadopcr';
	return laboratory;
}


function buildMuestrasLab(asis, token){
	let _laboratory = {
		isActive: true,
		secuencia: 'EN SISA', // labsequenceOptList
		muestraId: '',
		fe_toma: '',
		tipoMuestra: 'hisopadopcr', // tipoMuestraLaboratorioOptList
		locacionId: 'otro', // locMuestraOptList
		locacionSlug: '',
		laboratorio: '',
		laboratorioTel: '',
		metodo: 'pcr',
		fe_resestudio: '', 
		fe_notificacion: '', 
		alerta: '', 
		estado: 'presentada',   // estadoMuestraLaboratorioOptList
		resultado: 'pendiente', //resultadoMuestraLaboratorioOptList
		slug: '',
		fets_toma: 0,
		fets_resestudio: 0,
		fets_notificacion: 0
	}

	let oldlab;
	let muestras = (asis && asis.muestraslab) || [];
	let femuestra = token.femuestra
	let femuestra_ts = 0
	if(femuestra){
		try {
			femuestra_ts = utils.dateNumFromTx(femuestra)
		}
		catch {
			return null;
		}
	}
	

	if (muestras && muestras.length){
		oldlab = muestras.find(lab => {
			if(!lab.isActive || (lab.secuencia !== 'EN SISA' && lab.resultado !== 'pendiente') ){
				return false;
			}

			if(lab.resultado === 'pendiente' && Math.abs(femuestra_ts - lab.fets_toma) < 1000 * 60 * 60 * 24 * 4){
				return true;
			}

			if(lab.secuencia === 'EN SISA' && femuestra_ts === lab.fets_toma){
				return true;
			}

			return false;
		})

		if(oldlab){
			oldlab = updatedMuestrasLab(oldlab, token)

		}else {
			_laboratory = updatedMuestrasLab(_laboratory, token)
			muestras.push(_laboratory);		
			asis.muestraslab = muestras;
		}

	}else {
		_laboratory = updatedMuestrasLab(_laboratory, token)
		muestras.push(_laboratory);	
		asis.muestraslab = muestras;
	}


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
	mdiagnostico = 'laboratorio';

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


class ContextoCovid {
	constructor(){
		this.hasFiebre = false;
		this.fiebreTxt = 'cree';
		this.fiebre = 37;
		this.fiebreRB = 3;

		this.hasViaje = false;
		this.hasContacto = false;
		this.hasEntorno = false;

		this.hasTrabajoAdulMayores = false;
		this.hasTrabajoHogares = false;
		this.hasTrabajoPolicial = false;
		this.hasTrabajoHospitales = false;
		this.hasTrabajoSalud = false;
		// sintomas
		this.hasSintomas = false;
		this.hasDifRespiratoria = false;
		this.hasDolorGarganta = false;
		this.hasTos = false;
		this.hasNeumonia = false;
		this.hasDolorCabeza = false;
		this.hasFaltaGusto = false;
		this.hasFaltaOlfato = false;
		this.sintomas = '';

		this.hasDiarrea = false;
		this.hasDiabetes = false;
		this.hasHta = false;
		this.hasCardio = false;
		this.hasPulmonar = false;
		this.hasEmbarazo = false;
		this.hasCronica = false;
		this.hasFumador = false;
		this.hasObesidad = false;
		this.comorbilidad = "" // observaciones y otras comorbilidades

		this.fe_inicio = '' // InfectionFollowUp.fe_inicio //fecha de inicio de síntomas
		this.sintoma = "sindato" // estado general InfectionFollowUp.sintoma
		this.fe_prevAlta = '' // InfectionFollowUp.fe_alta //fecha prevista de alta para el caso covid confirmado
		this.isInternado = false; // InfectionFollowUp.isInternado;
		this.tinternacion = 'nointernado' // tipo de internacion // tinternacionOptList
		this.internacionSlug = ''; // lugar de internación
		this.derivacion = ''; //si necesita derivación // derivacionOptList
		this.derivaSaludMental = false;
		this.derivaDesarrollo = false;
		this.derivaHisopado = false;
		this.derivaOtro = false;
		this.derivacionSlug = ''; 

		this.trabajo = '';   // InfectionFollowUp.trabajo
		this.trabajoSlug = ''; // InfectionFollowUp.trabajoTxt

		this.contexto = '';

		this.esperaMedico = false;
		this.vistoMedico = false;
		this.indicacion = '';
		this.problema = '';

		this.necesitaSame = false;
		this.esperaTraslado = false;
		this.estaInternado = false;
		this.estaEnDomicilio = false;

		this.hasCOVID = false;
		this.isCOVID = false;
		//
		this.fe_investig = '';
		this.fets_investig = 0;
		this.userInvestig = '';
		this.userAsignado = '';
		this.userId = '';
		this.actualState =  0;
		this.avanceCovid = '';
		this.hasInvestigacion = false;
	}

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
	nuevollamadoOffset = 1;
	fets_nextLlamado = 0;

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

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed 

*/

