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
const dbaseTest =  'mongodb://localhost/develar_dev'; //port = 27017  ojo: {auto_reconnect: true}
const dbaseProd =  'mongodb://localhost/develar';      //port = 27017  ojo: {auto_reconnect: true}

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
  port: normalizePort(process.env.PORT || '3000'),
  debug: 'develar:server',
  serverUrl: 'http://develar-local.com:4200',
  dbconnect: path.join(rootPath, 'core/config/dbconnect'),
  failureLoginUrl: '/ingresar/login',
  signUpUrl: '/ingresar/registrarse'
};

if(environment === 'development'){
  settings.dbase = dbaseDevel;
  settings.app = rootPath + '/core/app';
  settings.serverUrl = 'http://develar-local.com:4200';

}else if(environment === 'test'){
  settings.dbase = dbaseTest;
  settings.app = rootPath + '/core/app';
  settings.serverUrl = 'http://develar-local.com:8080';

}else if(environment === 'production'){
  settings.dbase = dbaseProd;
  settings.app = rootPath + '/core/app';
  settings.serverUrl = 'http://develar.co';

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











/***********

var fs = require('fs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user = require(rootPath + '/calendar/controllers/user');
var BaseModel = require(rootPath + '/calendar/models/basemodel');
var requireModel = require(rootPath + '/calendar/models/requireModel');



//Installed applications
var mailerTplPth = path.normalize(__dirname + '/mailer/templates'); //ojo
var calendarApp    = rootPath + '/calendar';
var bacuaApp    = rootPath + '/bacua';
var coreApp  = rootPath + '/core';
var apps = [calendarApp];


//Mailer options
var notifier = {
  APN: false,
  email: false, // true
  actions: ['comment'],
  tplPath: mailerTplPth,
  postmarkKey: 'POSTMARK_KEY',
  parseAppId: 'PARSE_APP_ID',
  parseApiKey: 'PARSE_MASTER_KEY'
};

var instanceDbListeners = function (db,BSON) {

  //loads modules that needs a reference to the db connection
  for(var ix = 0; ix<apps.length; ix++){
      var controllers_path = path.normalize( apps[ix] + '/controllers/');
      fs.readdirSync(controllers_path).forEach(function (file) {
        require(controllers_path+file).setDb(db).setBSON(BSON).setConfig({publicpath:publicPath});
      });
  }
  BaseModel.setDb(db).setBSON(BSON);
};

var routesBootstrap = function (app, express) {

  passport.use(new LocalStrategy({usernameField: 'username',passwordField: 'password'},
    // verify callback
    function(username, password, done) {
      //console.log('passport verify: username[%s] pass[%s] ',username,password);
      // VERIFY CALLBACK
      //  return done(null, user); // ok
      //  return done(null, false, { message: 'Incorrect username.' }); // ToDo: implementar FLASH
      //  return done(err); // server error
      //  return (new Error('User ' + id + ' does not exist'));
      //  process.nextTick(function () {

      user.findOne({ username: username }, function (err, userdao) {
        if (err) {
          //console.log('passport error');
          return done(err);
        }
        if (!userdao) {
          //console.log('passport USER NOT FOUND');
          //return done(null, false, { message: 'Incorrect username.' });
          return done(null, false);
        }

				user.comparePassword(userdao.password, password, function(err, isMatch) {
          if (isMatch) {

            //console.log('passport: password match!!! [%s]', userdao.displayName);
            return done(null, userdao);

          } else {

            //console.log('noooooooooo match!');
            return done(null, false, { message: 'Incorrect password.' });
          }
        });
      });

    }
  ));

  passport.serializeUser(function(user, done) {
    //console.log('serialize: user:[%s] [%s]',user.displayName, user._id);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    //console.log('deserialize:[%s]',id);
    user.fetchById(id, function(err, user) {
      done(err, user);
    });
  });



  app.set('port', 3000);
  app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' 
  app.use(express.cookieParser());
  // deprecated: app.use(express.bodyParser());
  // see: https://github.com/senchalabs/connect/wiki/Connect-3.0
  //https://groups.google.com/forum/#!msg/express-js/iP2VyhkypHo/5AXQiYN3RPcJ
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(publicPath));

  for(var ix = 0; ix<apps.length; ix++){
      var routes_path = path.normalize( apps[ix] + '/config/routes.js');
      require(routes_path)(this, app);
  }

//  require(rootPath + '/calendar/controllers/artactivities.js').configRoutes(app);
//  require(rootPath + '/calendar/controllers/events.js').configRoutes(app);
//  require(rootPath + '/calendar/controllers/artactivitiesreport.js').configRoutes(app);
//  require(rootPath + '/calendar/controllers/obraarte.js').configRoutes(app);
//  require(rootPath + '/calendar/controllers/obraartesolicitud.js').configRoutes(app);
//  require(rootPath + '/calendar/controllers/obraswf.js').configRoutes(app);
  require(rootPath + '/calendar/controllers/micaagenda.js').configRoutes(app);
  require(rootPath + '/calendar/controllers/micatools.js').configRoutes(app);
};


module.exports = {
  development: {
    dburi: dbaseDevel,
    coreApp: coreApp,
    apps: apps,
    root: rootPath,
    publicpath: publicPath,
    notifier: notifier,
    connectionListeners: instanceDbListeners,
    routesBootstrap: routesBootstrap,
    app: {
      name: 'SGAC - Desarrollo'
    },
    facebook: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  test: {
    dburi: dbaseTest,
    coreApp: coreApp,
    apps: apps,
    root: rootPath,
    publicpath: publicPath,
    notifier: notifier,
    connectionListeners: instanceDbListeners,
    routesBootstrap: routesBootstrap,
    app: {
      name: 'SGIC - Test'
    },
    facebook: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  production: {}
}

****/
