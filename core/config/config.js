/*
 *  core config.js
 *  package: /core/config
 *  Use:
 *     Exporta un objeto con las configuraciones basicas para devel, test, production
 */
const debug = require('debug')('develar:server');


const path = require('path');
const rootPath = path.normalize(__dirname + '/../..');
const publicPath = path.join(rootPath, 'public');
const storagePath = path.join(publicPath, 'storage');

//Installed Dbases
const dbaseDevel = 'mongodb://localhost/develar_dev'; //port = 27017  ojo: {auto_reconnect: true}
const dbaseTest =  'mongodb://localhost/develar';     //port = 27017  ojo: {auto_reconnect: true}
const dbaseProd =  'mongodb://localhost/develar';     //port = 27017  ojo: {auto_reconnect: true}

/****** ATENCION *********/
const environment = global.environment || process.env.NODE_ENV || 'development';
console.log('********* config:[%s] **********', environment);

debug('config.js:settings:mode:[%s]', environment);
/*************************/

const settings = {
  rootPath: rootPath,
  faviconPath: '/core/img/favicon.ico',
  staticFolder: '/public',
  publicPath: publicPath,
  storagePath: storagePath,
  port: normalizePort(process.env.PORT || '8080'),
  debug: 'develar:server',
  serverUrl: 'http://develar.co:4200',
  dbconnect: path.join(rootPath, 'core/config/dbconnect'),
  failureLoginUrl: '/ingresar/login',
  signUpUrl: '/ingresar/registrarse',
  googleCbUrl: 'http://develar.co:4200/api/users/login/google/return'
};

if(environment === 'development'){
  settings.dbase = dbaseDevel;
  settings.app = rootPath + '/core/app';
  settings.serverUrl = 'http://develar.co:4200';
  settings.googleCbUrl = settings.serverUrl + '/api/users/login/google/return';

}else if(environment === 'test'){
  settings.dbase = dbaseTest;
  settings.app = rootPath + '/core/app';
  settings.serverUrl = 'http://develar.co:4200';
  settings.googleCbUrl = settings.serverUrl + '/api/users/login/google/return';

}else if(environment === 'production'){
  settings.dbase = dbaseProd;
  settings.app = rootPath + '/core/app';
  settings.serverUrl = 'http://develar.co';
  settings.googleCbUrl = settings.serverUrl + '/api/users/login/google/return';

}

//console.dir(settings);
module.exports = settings

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
