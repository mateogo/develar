/*
 *  core gcse.js
 *  package: /core/services/gcse.js
 *  Use:
 *     Exporta un objeto con funciones utilitarias
 *  uri:
 * https://www.googleapis.com/customsearch/v1?cx=012112831136213398642:-_kbp39five&key=AIzaSyAJpFOgoCTiLudPL1lChcn-kIm-zlses0w&q=angular4
	https://www.googleapis.com/customsearch/v1?cx=012112831136213398642:-_kbp39five&key=AIzaSyAJpFOgoCTiLudPL1lChcn-kIm-zlses0w&q=angular4
 */

const url = require('url');
const request = require('request-promise');

const appName = 'develar';
const whoami = '/core/services/gcse:';
const HOST = "https://www.googleapis.com";
const SPATH = "/customsearch/v1";

const searchUri = HOST + SPATH;

// standard query parameters:
//	json: true,
const optionsbase = {
	method: 'GET',
	uri: searchUri,
	headers: {
		"User-Agent": "GoogleSearch"
	}
};

const machines = [
	{
		id: 'community_prg',
		slug: 'Foros programación',
		cx: '012112831136213398642:-_kbp39five',
	},
	{
		id: 'academica',
		slug: 'Académica',
		cx: '012112831136213398642:1sodjc0r-eo'
	},
	{
		id: 'ari',
		slug: 'Autoridades regulatorias',
		cx: '012112831136213398642:q_je69x-hwe',
	},

];

const defaultMachine = machines[0];

const querybase = {
	// standard query parameters:
	alt:     "json",
	key:     'AIzaSyAJpFOgoCTiLudPL1lChcn-kIm-zlses0w',
	cx:      defaultMachine.cx,
	q:       ''
	// API specific paramenters

};

function getQueryBase(machine){
	let engine = machines.find(x => (x.id === machine));
	if(!engine) engine = defaultMachine;
	querybase.cx = engine.cx;
	return querybase;
}

function getQuery(querystring, machine, opts){
	const queryParams = {};
	opts = opts || {};

	Object.assign(queryParams, getQueryBase(machine), opts);
	queryParams.q = querystring || 'angular4';

	return queryParams;
}

function parseResponse(data, opts){
	return JSON.parse(data);

}
/*
 @params q: query string
 @params start: number 
 @fileType: string: pdf|etc
 @gl: geolocalization: ar
 @lr: language spanish_ar
 @num: number: número de resultados a retornar
 @siteSearch: sitio a buscar
 */

exports.gsearch = function(query, opts, errcb, cb){

	optionsbase.qs = getQuery(query.q, query.machine, opts);


	request(optionsbase)
		.then(data => {

	  	cb(parseResponse(data, opts));
		})
		.catch(err => {
			console.log('catch ERROR [%s]', err)
			errcb(err);
		})


}
