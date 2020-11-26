/*
 *  core passportconf.js
 *  package: /core/config
 *  Use:
 *     configura passport
 */

/**
 * Load module dependencies
 */

const config = require('./config');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const whoami = 'core/config/passportconf: '
const user = require('../models/userModel.js');
const userWeb = require('../models/usuarioswebModel.js');

const CALLBACK_URL = config.googleCbUrl

passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},
  function(usermail, password, done){
    //console.log('passport verify: usermail[%s] pass[%s] ',usermail,password);
    // VERIFY CALLBACK
    //  return done(null, user); // ok
    //  return done(null, false, { message: 'Incorrect usermail.' }); // ToDo: implementar FLASH
    //  return done(err); // server error
    //  return (new Error('User ' + id + ' does not exist'));
    //  process.nextTick(function () {

    user.findOne(usermail, function (err, userdao) {
      if (err) {
        console.log('passport error');
        return done(err);
      }
      if (!userdao) {
        //return done(null, false, { message: 'Incorrect usermail.' });
        return done(null, false);
      }

      user.verifyPassword(userdao.password, password, function(err, isMatch) {
        if (isMatch) {
          return done(null, userdao);

        } else {

          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });

  })
);

/**
 * Estrategica local de inicio de sesión para la vista pública de UsuarioWeb
 *
 */
passport.use('usuarioweb-local', new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
    function(username, password, done) {
        userWeb.findByUsername(username, function(error, user) {
            if (error) {
                return done(error);
            }

            if (!user) {
                return done(null, false);
            }

            userWeb.verifyPassword(password, user.password, function(error, isMatch) {
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { error: 'Contraseña incorrecta' });
                }
            });
        })
    }));

passport.use(new GoogleStrategy({
    clientID: '197765753575-do7v040q2smrad7ekof1ilncjbm4lef3.apps.googleusercontent.com',
    clientSecret: 'GM6hXdmZ8dbldbgnaHx1BEr7',
    callbackURL: CALLBACK_URL
  },

  function(accessToken, refreshToken, profile, done){
    // console.log('[%s] callback CALLED ******************** PASS', whoami);

    // console.log('ACCESS TOKEN: ');
    // console.dir(accessToken);

    // console.log('USER PROFILE: ');
    // console.dir(profile);

    let emails = profile.emails;

    // console.log('MAILS PROFILE: ');
    // console.dir(emails);

    user.findOrCreateGoogle(profile, accessToken, function(err, user){
      return done(err, user);
    });

  }
));

passport.serializeUser(function(user, done) {
  // 17-9-2020 :: No serializar todo el objeto, solo lo necesario
  // done(null, objUser._id);
  const userToSave = {
      _id: user._id,
      source: (user.isUsuarioWeb === true ? 'webuser' : 'adminuser')
  };

  // done(null, { _id: objUser._id, source: objUser.isUsuarioWeb })
  done(null, userToSave);
});

passport.deserializeUser(function(objuser, done) {
  // console.log(objuser);

  if (objuser.source && objuser.source === 'webuser') {
      userAgn.findById(objuser._id, function(error, user) {
          done(error, user);
      });
  } else {
      user.fetchById(objuser._id, function(err, user) {
          done(err, user);
      });
  }
});

module.exports = function(app){
  app.use(passport.initialize());
  app.use(passport.session());
};
