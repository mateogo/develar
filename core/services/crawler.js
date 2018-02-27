/*
 *  core crwaler.js
 *  package: /core/services/crwaler.js
 *  Use:
 *     Exporta un objeto con funciones utilitarias
 *  uri:
 * https://www.googleapis.com/customsearch/v1?cx=012112831136213398642:-_kbp39five&key=AIzaSyAJpFOgoCTiLudPL1lChcn-kIm-zlses0w&q=angular4
	https://www.googleapis.com/customsearch/v1?cx=012112831136213398642:-_kbp39five&key=AIzaSyAJpFOgoCTiLudPL1lChcn-kIm-zlses0w&q=angular4
 */

const url = require('url');
const request = require('request-promise');
const jsdom = require('jsdom');
const Crawler = require('crawler');
const html2txt = require('html-to-text');

const appName = 'develar';
const whoami = '/core/services/crwaler:';


	/*
		@params q: query string
		@params start: number 
		@fileType: string: pdf|etc
		@gl: geolocalization: ar
		@lr: language spanish_ar
		@num: number: número de resultados a retornar
		@siteSearch: sitio a buscar
	*/
	const crawler = new Crawler({
		maxConnections : 10
		// This will be called for each crawled page

	});

	const htmlParser = {
		hideLinkHrefIfSameAsText: true,
		ignoreHref: true,
		ignoreImage: true
	}



exports.crawlURL = function(query, opts, errcb, cb){


	// Queue just one URL, with default callback
	crawler.queue([{
		uri: query,
		callback : function (error, res, done) {
		    if(error){
		        console.log(error);
		    }else{
		        let $ = res.$;
		        let text = html2txt.fromString($("body"),htmlParser);

		        cb({title: $('title').text(), body: $("body").text() });
		    }
		    done();
		}
	}]);

}

