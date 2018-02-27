/**
 * Map Utilities
 */

const http = require("http");

const utils = require('./commons.utils');

const whoami = 'mapUtils: '
const gaddressUrl = '/maps/api/geocode/json?address=';
const gmapHost = 'maps.googleapis.com';

/**
 * Private functions
 */
const buildProperAddress = function(address){

	let location = address.street1;
	location += address.city ? ', ' + address.city : '';
	location += address.statetext ? ', ' + address.statetext : '';
	location += address.country ? ', ' + address.country : '';

	let serviceUrl = gaddressUrl + utils.safeAddress('"' + location + '"') + '&sensor=false';


	return serviceUrl
}

const buildNormalizedAddress = function(data){
	const address = {
		status: "error"
	}
	if(!data) return address;

	address.status = data.status || 'error';

	if(data.status !== 'OK' || !data.results.length) return address;

	const result = data.results[0];
	address.formatted_address = result.formatted_address;
	address.location = result.geometry.location;
	return address;
}


/**
 * Search for lat / lng
 */
exports.addressLookUp = function (address, errcb, cb) {
	let path = buildProperAddress(address);

	const options = {
	    hostname: gmapHost,
	    //path: '/webservice/response/client.php?Method=GetEventosListFiltered&FechaInicio=2013-10-28&FechaFin=2013-10-30&Latitud=-34.60834737727606&Longitud=-58.39688441711421&OrdenarPor=Distancia&Limit=10'
	    path: path,
	    agent: false
	};

	http.get(options, (res) => {
		const { statusCode } = res;
		const contentType = res.headers['content-type'];
		let error;

		if(statusCode !== 200) {
			error = new Error('Request failed. \n' + `Status code. ${statusCode}`);
		} else if(!/^application\/json/.test(contentType)){
			error = new Error('Invalid content-type. \n' + `Expected json, but received. ${contentType}`);
		}
		if(error){
			console.error(error.message);
			res.resume();
			errcb(error);
		}
		res.setEncoding('utf8');
		let rawData = '';

    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {

   		try{
   			const parseData = JSON.parse(rawData);

   			cb(buildNormalizedAddress(parseData));

   		} catch (e){
   			console.error(e.message);
   		}

   	});

    res.on('error',function(e){
    	console.log('http on error');
    	errcb(e);
    });

	}).on('error', (e) => {
		console.error(`Got error: ${e.message}`);
	});
}
