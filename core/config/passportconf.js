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
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  user.fetchById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = function(app){
  app.use(passport.initialize());
  app.use(passport.session());
};
