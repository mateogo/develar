/**
 * User routes
 */
const whoami =  "Router:routes/userRouter: ";

const express = require('express');
const router = express.Router();
const passport = require('passport');

const service = require('../models/userModel.js');
const config = require('../config/config');

const DOMAIN = config.serverUrl;
const HOME = DOMAIN;
const LOGIN_HOME = config.loginUrl;
const FAILURE_REDIRECT = DOMAIN + config.failureLoginUrl;
const REGISTRARSE =  DOMAIN + config.signUpUrl;


/**
 * Retrieve all usuarios
 */
router.get('/', function (req, res) {
    service.findAll(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * search entities
 */
router.get('/search', function (req, res) {

    service.findByQuery(req.query, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});



/**
 * Retrieve USER by ID
 */
router.get('/altausuario', function (req, res) {
    service.createuser(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * create User(s) from Person(s)
 */
router.post('/userfromperson', function (req, res) {
    
    service.userFromPerson(req.body, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});



/**
 * Retrieve Current User from request
 */
router.get('/currentuser', function (req, res) {
    if(req.user){
        res.status(200).json(req.user);
    }else{
        res.status(200).json({username: 'no current user'});
    }
});


router.get('/login/google/return', 
  passport.authenticate('google', { failureRedirect: FAILURE_REDIRECT }),
  function(req, res) {

    if(req.user && req.user.localProfile){
        console.log('Auth OK redirecting [%s]', LOGIN_HOME);
        res.redirect(LOGIN_HOME);
    }else{
        res.redirect(REGISTRARSE);
    }
});


/***** GOOGLE LOGIN ***/
//passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']} ));
router.get('/login/google',
  passport.authenticate('google', {scope: ['profile', 'email']} ));


/***** LOCAL LOGIN ***/
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }

    if (!user) { 
        return res.status(400).json({
                error: {message: 'fallo la autenticacion',
                status: 400}
                }); 
    }
    
    req.logIn(user, function(err) {
      if (err) { return next(err); }
        // req.session.save(function(){
        //     res.redirect('/someURL');
        // });
      console.log('Login: OK')
      return res.status(200).json(user);
    });
  }) (req, res, next);
});


/**
 * Sign up a new user
 */
router.post('/signup', function (req, res) {

    service.signup(req.body, function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(201).json(entity);

    });
});

router.put('/signup/:id', function (req, res) {

    service.update(req.params.id, req.body, 
        function (err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});


router.put('/credentials/:id', function (req, res) {

    service.changePassword(req.params.id, req.body, 
        function (err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});



/**

/**
 * Testing: alta trucha de un user
 */
router.get('/populate', function (req, res) {
    service.populate(function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(201).json(entity);

    });
});


router.get('/closesession', function (req, res) {
    console.log('close Session');
    req.session = null;
    res.status(200).json({message: 'session closed ok'});

});




/**
 * Retrieve USER by ID
 */
router.get('/:id', function (req, res) {
    service.findById(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});




module.exports = router;



/***
db.usuarios.find({estado: 'pendiente'})
db.usuarios.updateMany({estado: 'pendiente'}, {$set: {
    description: 'alta-mgo-20200701', estado: 'activo', navance: 'approved', moduleroles: ["core:admin", "vigilancia:operator"]
}})

ALTAS PRODUCIDAS:
description: 'alta-mgo-20200701' : #7

**/

