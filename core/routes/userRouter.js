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

const FAILURE_REDIRECT = DOMAIN + config.failureLoginUrl;
const REGISTRARSE =  DOMAIN + config.signUpUrl;


/**
 * Retrieve all usuarios
 */
router.get('/', function (req, res) {
    console.log('router root hit');
    service.findAll(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        console.log('findAll success [%s]', entities.length);
        res.status(200).json(entities);

    });
});

/**
 * search entities
 */
router.get('/search', function (req, res) {
    //service.findByQuery(req.query, function(err) {
    console.log('[%s] user Search BEGIN',whoami);

    service.findByQuery(req.query, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});



/**
 * Retrieve Current User from request
 */
router.get('/currentuser', function (req, res) {
    console.log('fetch curren User')
    if(req.user){
        res.status(200).json(req.user);
    }else{
        res.status(200).json({username: 'no current user'});
    }
});


router.get('/login/google/return', 
  passport.authenticate('google', { failureRedirect: FAILURE_REDIRECT }),
  function(req, res) {
    console.log('GOOGLE return:[%s] [%s]', req.user.email, req.user.externalProfile);
    console.log(HOME);

    if(req.user && req.user.localProfile){
        res.redirect(HOME);
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
      return res.status(200).json(user);
    });
  }) (req, res, next);
});


/**
 * Sign up a new user
 */
router.post('/signup', function (req, res) {
    console.log('router POST for Create signup HIT');

    service.signup(req.body, function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(201).json(entity);

    });
});

router.put('/signup/:id', function (req, res) {
    console.log('router PUT for Update signup HIT');

    service.update(req.params.id, req.body, 
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
    console.log('router populate hit');
    service.populate(function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(201).json(entity);

    });
});


/**
 * Retrieve USER by ID
 */
router.get('/:id', function (req, res) {
    console.log('getUserBY ID [%s]', req.params.id);
    service.findById(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        console.log('findAll success [%s]', entities.length);
        res.status(200).json(entities);

    });
});




module.exports = router;