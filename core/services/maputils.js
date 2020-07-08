/**
 * Map Utilities
 */


//http://nominatim.org/release-docs/latest/api/Search/
const http = require("http");
const https = require("https");
const request = require("request");
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'locationiq',

  // Optional depending on the providers
  httpAdapter: https, // Default
  apiKey: 'pk.9d2276613a314c961a5e81406684f36e', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
const utils = require('./commons.utils');

const whoami = 'mapUtils: '
const gaddressUrl = '/maps/api/geocode/json?address=';
const gmapHost = 'maps.googleapis.com';

const nominatimUrl = '/?format=json&addressdetails=1&format=json&limit=1&q=';
const nominatimHost = 'https://nominatim.openstreetmap.org'

const locationIQHost = "https://us1.locationiq.com"

//const locationIQUrl = '/v1/search.php?key=pk.9d2276613a314c961a5e81406684f36e&format=json&q=';
const locationIQUrl = '/v1/search.php?key=2153f58f76329d&format=json&q=';

const LOOK_UP_BY_GOOGLE = false;
const LOOK_UP_BY_NOMINATIM = false;
const LOOK_UP_BY_LOCATIONIQ = true;


/**
 * Private functions
 */
const buildGoogleQueryAddress = function(address){

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

function lookUpByGoogle(address, errcb, cb){
	let path = buildGoogleQueryAddress(address);

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



const buildNominatimQueryAddress = function(address){

	let location = address.street1;
	location += address.city ? ',' + address.city : '';
	location += address.statetext ? ',' + address.statetext : '';
	location += ',argentina'; //address.country ? ' ' + address.country : '';



	return utils.safeAddressTokenized(location, ' ');
}

const buildNominatimQueryPath = function(location){
	let serviceUrl = nominatimUrl + location;

	return serviceUrl;

}

const buildLocationIQQueryPath = function(location){
	let serviceUrl = locationIQUrl + location;

	return serviceUrl;

}


const decodeNominatimResponse = function(data){
	const address = {
		status: "error"
	}

	if(!data || !data.length) return address;

	address.status = 'OK';

	const result = data[0];

	address.formatted_address = result.address;
	address.location = {
		lat: result.lat,
		lon: result.lon
	}
	return address;

}

const decodeLocationIQResponse = function(data){

	const address = {
		status: "error"
	}

	if(!data || !data.length) return address;

	address.status = 'OK';

	const result = data[0];

	address.formatted_address = result.display_name;
	address.location = {
		lat: parseFloat(result.lat),
		lng: parseFloat(result.lon)
	}
	return address;

}

function lookUpByLocationIQ(address, errcb, cb){
	let location = buildNominatimQueryAddress(address);
	let path = buildLocationIQQueryPath(location);
	let url = locationIQHost + path;

	request(url, {json: true}, (err,res,body) =>{

		if(err) {
			console.log(err);
		}else {
   		cb(decodeLocationIQResponse(body));


		}

	});


}


function lookUpByNominatimOldTwo(address, errcb, cb){
	let location = buildNominatimQueryAddress(address);
	let path = buildNominatimQueryPath(location);
	let url = nominatimHost + path;

	request(url, {json: true}, (err,res,body) =>{

		if(err) {
			console.log(err);
		}else {

		}

	});

}


function lookUpByNominatimOld(address, errcb, cb){
	let location = buildNominatimQueryAddress(address);
	let path = buildNominatimQueryPath(location);

	const options = {
	    hostname: nominatimHost,
	    path: path,
	    agent: false
	};

	https.get(options, (res) => {
		const { statusCode } = res;
		const contentType = res.headers['content-type'];
		let error;

		res.setEncoding('utf8');
		let rawData = '';

    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {

   		try{
   			const parseData = JSON.parse(rawData);

   			cb(decodeNominatimResponse(parseData));

   		} catch (e){
   			console.error(e.message);
   		}

   	});

    res.on('error',function(e){
    	console.log('http on error');
    	errcb(e);
    });

	}).on('error', (e) => {
		console.dir(e);
		console.error(`GOT error: ${e.message}`);
	});
}

exports.fetchLatLonByAddress = function (address) {
	return new Promise((resolve)=> {

		let location = buildNominatimQueryAddress(address);
		let path = buildLocationIQQueryPath(location);
		let url = locationIQHost + path;
		request(url, {json: true}, (err, res, body) =>{

			if(err) {
				resolve(err)
			}else {
	   		resolve(decodeLocationIQResponse(body));

			}

		});

	})

}


/**
 * Search for lat / lng
 */
exports.addressLookUp = function (address, errcb, cb) {
	if(LOOK_UP_BY_GOOGLE){
		lookUpByGoogle(address, errcb, cb);

	}else if(LOOK_UP_BY_NOMINATIM){
		lookUpByNominatim(address, errcb, cb);

	}else if(LOOK_UP_BY_LOCATIONIQ){
		lookUpByLocationIQ(address, errcb, cb);
	}

}

/***
https://nominatim.openstreetmap.org/?format=json&addressdetails=1&format=json&limit=1&q=billinghurst+1599+ciudad%20autonoma%20buenos%20aires+argentina



[

    {
        "place_id": 41203213,
        "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
        "osm_type": "node",
        "osm_id": 3062527038,
        "boundingbox": [
            "-34.5923753",
            "-34.5922753",
            "-58.4116455",
            "-58.4115455"
        ],
        "lat": "-34.5923253",
        "lon": "-58.4115955",
        "display_name": "1599, Billinghurst, Comuna 2, Recoleta, Autonomous City of Buenos Aires, 1425, Argentina",
        "class": "place",
        "type": "house",
        "importance": 0.511,
        "address": {
            "house_number": "1599",
            "road": "Billinghurst",
            "suburb": "Recoleta",
            "city": "Autonomous City of Buenos Aires",
            "state": "Autonomous City of Buenos Aires",
            "postcode": "1425",
            "country": "Argentina",
            "country_code": "ar"
        }
    }

]



**/