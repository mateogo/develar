/*
 *  core config.js
 *  package: /core/config
 *  Use:
 *     Exporta un objeto con las configuraciones basicas para devel, test, production
 */
const debug = require('debug')('develar-local.co:server');


const path = require('path');
const rootPath = path.normalize(__dirname + '/../..');


const environment = global.environment || process.env.NODE_ENV || 'development';

const PORT = normalizePort(process.env.PORT || '8080');
const DBASE = process.env.DBASE || 'develar';
const SERVER = process.env.SERVER || 'http://develar-local.co';
const FAVICON = process.env.FAVICON || 'favicon.ico';
const PUBLIC = process.env.PUBLIC || '/public';

const STORAGE = 'storage';

const publicPath = path.join(rootPath, PUBLIC);
const storagePath = path.join(publicPath, STORAGE);
const app_file =  path.join(rootPath, '/core/app');

const DEV_SERVER = 'http://develar-local.co:4200';
const QA_SERVER =  'http://develar-local.co:4200';

const MONGOSRV = 'mongodb://localhost/';
const GOOGLE_LOGIN_RETURN = '/api/users/login/google/return'

const mongo_db = MONGOSRV + DBASE


console.log('***config ENV:[%s] PORT:[%s]  DB:[%s]  SRV:[%s]  public:[%s] ****', environment, PORT, mongo_db, SERVER, PUBLIC);;

debug('config.js:settings:mode:[%s]', environment);
/*************************/

const settings = {
  rootPath: rootPath,
  faviconPath: '/core/img/' + FAVICON, ///?????
  publicPath: publicPath,
  storagePath: storagePath,
  port: PORT,
  debug: 'develar:server',
  serverUrl: DEV_SERVER,
  dbconnect: path.join(rootPath, 'core/config/dbconnect'),
  failureLoginUrl: '/ingresar/login',
  signUpUrl: '/ingresar/registrarse',
  googleCbUrl: DEV_SERVER + GOOGLE_LOGIN_RETURN,
  loginUrl: path.join('/ingresando')
};

if(environment === 'development'){
  settings.dbase = mongo_db + '_dev';
  settings.app = app_file;
  settings.serverUrl = DEV_SERVER;
  settings.googleCbUrl = settings.serverUrl + GOOGLE_LOGIN_RETURN;


}else if(environment === 'test'){
  settings.dbase = mongo_db;
  settings.app = app_file;
  settings.serverUrl = QA_SERVER;
  settings.googleCbUrl = settings.serverUrl + GOOGLE_LOGIN_RETURN;

}else if(environment === 'production'){
  settings.dbase = mongo_db;
  settings.app = app_file;
  settings.serverUrl = SERVER;
  settings.googleCbUrl = settings.serverUrl + GOOGLE_LOGIN_RETURN;
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
