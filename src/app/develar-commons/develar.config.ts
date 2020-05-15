/************
 *
 *  GLOBALS
 *
 *
*************/
const user = 'salud';

const globals = {

	dsocial: {
		logoAvatar: 'avatar-develar.jpg',
		logoUser: 'avatar-u-develar.jpg',
		logoCompany: 'logo-publico.png',
		logoCompany2: 'logo-publico.png',
		company: 'MAB',
		mainmenu: 'dsocial',
		mainmenutpl: 'default-navbar',
		admintarget: '/dsocial/gestion/recepcion',
		dashboard: '/dsocial/gestion/recepcion',
		socialmedia: 'DEFAULT_SOCIAL_MEDIA',
		emailsubject: '[MAB] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2020 - DGTS@modernización - Secretaría de Desarrollo Social - Municipalidad de Almte. Brown (v1.2-20.05.04-22:218) ',
		version: '1.0 beta',
		url: 'dsocial.brown.gob.ar'
	},

	salud: {
		logoAvatar: 'avatar-develar.jpg',
		logoUser: 'avatar-u-develar.jpg',
		logoCompany: 'logo-publico.png',
		logoCompany2: 'logo-publico.png',
		company: 'MAB',
		mainmenu: 'salud',
		mainmenutpl: 'default-navbar',
		admintarget: '/salud/gestion/covid',
		dashboard: '/salud/gestion/covid',
		socialmedia: 'DEFAULT_SOCIAL_MEDIA',
		emailsubject: '[MAB] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '©2020 DGTS@modernización - Secretaría General - Secretaría de Salud - Almirante Brown  - SEMANA EPIDEMIOLÓGICA #20 20.05.15-17:46',
		version: '1.0 beta',
		url: 'salud.brown.gob.ar'
	},

	cck: {
		logoAvatar: 'avatar-develar.jpg',
		logoUser: 'avatar-u-develar.jpg',
		logoCompany: 'logo-publico.png',
		logoCompany2: 'logo-publico.png',
		company: 'CCK',
		mainmenu: 'cck',
		mainmenutpl: 'default-navbar',
		admintarget: '/cck/gestion/proyectos/navegar',
		dashboard: '/cck/gestion/proyectos/navegar',
		socialmedia: 'DEFAULT_SOCIAL_MEDIA',
		emailsubject: '[CCK] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2020 - CCK  (v1.1-20.01.25) ',
		version: '1.0 beta',
		url: 'www.develar.co'
	},

	develar: {
		logoAvatar: 'avatar-develar.jpg',
		logoUser: 'avatar-u-develar.jpg',
		logoCompany: 'logo-publico.png',
		logoCompany2: 'logo-publico.png',
		company: 'develar',
		admintarget: '/develar/fichas/lista',
		dashboard: '/develar/fichas/lista',
		mainmenu: 'DEFAULT',
		mainmenutpl: 'default-navbar',
		database: 'develar',
		socialmedia: 'DEFAULT_SOCIAL_MEDIA',
		emailsubject: '[develar] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2019 dvlr ',
		version: '1.0',
		url: 'www.develar.co'
	},

	comercios: {
		logoAvatar: 'avatar-develar.jpg',
		logoUser: 'avatar-u-develar.jpg',
		logoCompany: 'logo-publico.png',
		logoCompany2: 'logo-publico.png',
		company: 'MAB',
		mainmenu: 'comercios',
		mainmenutpl: 'default-navbar',
		admintarget: '/rol/nocturnidad/panel',
		dashboard: '/mab/comercios/registro',
		socialmedia: 'DEFAULT_SOCIAL_MEDIA',
		emailsubject: '[MAB] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2019 - DGTS@modernización - Municipalidad de Almte. Brown ',
		version: '1.0 beta',
		url: 'dsocial.brown.gob.ar'
	},

	empresas: {
		logoAvatar: 'avatar-develar.jpg',
		logoUser: 'avatar-u-develar.jpg',
		logoCompany: 'logo-publico.png',
		logoCompany2: 'logo-publico.png',
		company: 'MAB',
		mainmenu: 'empresas',
		mainmenutpl: 'default-navbar',
		admintarget: '/develar/fichas/lista',
		dashboard: '/mab/empresas/registro',
		socialmedia: 'DEFAULT_SOCIAL_MEDIA',
		emailsubject: '[MAB] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2020 - DGTS@modernización - Municipalidad de Almte. Brown ',
		version: '1.0 beta',
		url: 'dsocial.brown.gob.ar'
	},

	fundetec: {
		logoAvatar: 'avatar-fundetec.jpg',
		logoUser: 'avatar-u-fundetec.jpg',
		logoCompany: 'logo-publico.png',
		logoCompany2: 'logo-publico.png',
		company: 'fundetec',
		admintarget: '/develar/fichas/lista',
		dashboard: '/develar/fichas/lista',
		mainmenu: 'DEFAULT',
		mainmenutpl: 'default-navbar',
		socialmedia: 'DEFAULT_SOCIAL_MEDIA',
		emailsubject: '[fundetec] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2019 dvlr ',
		version: '1.0',
		url: 'www.fundetec.digital'
	},

	lasargentinas: {
		logoAvatar: 'avatar-lasargentinas.jpg',
		logoUser: 'avatar-u-lasargentinas.jpg',
		logoCompany: 'logo-lasargentinas-1.png',
		logoCompany2: 'logo-lasargentinas-7.png',
		company: 'lasargentinas',
		admintarget: '/develar/fichas/lista',
		dashboard: '/develar/fichas/lista',
		mainmenu: 'LASARGEN',
		mainmenutpl: 'lasargentinas',
		socialmedia: 'LASARGEN_SOCIAL_MEDIA',
		emailsubject: '[Las Argentinas] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2019 dvlr ',
		version: '1.0',
		url: 'www.lasargentinas.digital'
	},

	picris: {
		logoAvatar: 'avatar-picris.jpg',
		logoUser: 'avatar-u-diamante.jpg',
		logoCompany: 'logo-publico.png',
		logoCompany2: 'logo-publico.png',
		company: 'picris',
		admintarget: '/develar/fichas/lista',
		dashboard: '/develar/fichas/lista',
		mainmenu: 'DEFAULT',
		mainmenutpl: 'default-navbar',
		socialmedia: 'DEFAULT_SOCIAL_MEDIA',
		emailsubject: '[Picris] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2019 Picris Ltd ',
		version: '1.0',
		url: 'www.picris.co'
	},

	simplecomm: {
		logoAvatar: 'avatar-simplecomm.jpg',
		logoUser: 'avatar-u-simplecomm.jpg',
		logoCompany: 'logo-publico.png',
		logoCompany2: 'logo-publico.png',
		company: 'simplecomm',
		admintarget: '/develar/fichas/lista',
		dashboard: '/develar/fichas/lista',
		mainmenu: 'DEFAULT',
		mainmenutpl: 'default-navbar',
		socialmedia: 'DEFAULT_SOCIAL_MEDIA',
		database: 'develar',
		emailsubject: '[Simplecomm] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2019 dvlr ',
		version: '1.0',
		url: 'www.simplecomm.com.ar'
	},

	masuno: {
		logoAvatar: 'avatar-masuno.png',
		logoUser: 'avatar-u-masuno.png',
		logoCompany: 'logo-publico.png',
		logoCompany2: 'logo-publico.png',
		company: 'masuno',
		admintarget: '/develar/fichas/lista',
		dashboard: '/develar/fichas/lista',
		mainmenu: 'DEFAULT',
		mainmenutpl: 'default-navbar',
		socialmedia: 'DEFAULT_SOCIAL_MEDIA',
		emailsubject: '[+UNO] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2019 +UNO ',
		version: '1.0',
		url: 'www.masuno.digital'
	},

	utopias: {
		logoAvatar: 'avatar-utopias.png',
		logoUser: 'avatar-u-utopias.png',
		logoCompany: 'logo-utopias.png',
		logoCompany2: 'logo-utopias.png',
		company: 'utopias',
		admintarget: '/develar/fichas/lista',
		dashboard: '/develar/fichas/lista',
		mainmenu: 'DEFAULT',
		mainmenutpl: 'utopias',
		socialmedia: 'UTOPIA_SOCIAL_MEDIA',
		emailsubject: '[UTOPIAS] Contacto',
		emailbody: 'Formulario de contacto completado',
		copyright: '© Copyright 2019 dvlr ',
		version: '1.0',
		url: 'www.utopias.digital'
	}

}


export const gldef = globals[user];




  // "casoIndice" : {
  //               "_id" : ObjectId("5eb304f4208ad20eb62cb810"),
  //               "parentId" : "5eb17cf0c4719067c9e43c2e",
  //               "slug" : "ROSALES, RUBERN",
  //               "actualState" : 1
  //       },
  // 5eb304f4208ad20eb62cb80c

  // 5eb99279a443df0e04966031
  //5eb99a35a443df0e049660f2
		// "barrio" : "adrogue",
		// 	"state" : "buenosaires",
		// 	"statetext" : "Brown",
		// 	"zip" : "1846",
		// 	"lat" : -34.6403,
		// 	"lng" : -58.4563,



  
