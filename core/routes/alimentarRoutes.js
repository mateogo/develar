/**
 * Person routes
 */
/**
 * Load module dependencies
 */
const express = require('express');
const router = express.Router();
const service = require('../models/alimentarModel.js');

const whoami =  "Router:routes/alimentarRouter: ";


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
 * Retrieve Entity by ID
 */
router.get('/load', function (req, res) {
    service.load(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * Retrieve Entity by ID
 */
router.get('/importarnacion', function (req, res) {
    service.importarnacion(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * Retrieve Entity by ID
 */
router.get('/importarpadron', function (req, res) {
    console.log('importar padron ROUTE BEGINS')
    service.importarpadron(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * Cruce de alimentos
 */
router.get('/crucealimentos', function (req, res) {
    console.log('Cruce de Alimentos ROUTE BEGINS')
    service.crucealimentos(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

router.get('/excelcruce', function(req, res) {
    service.excelcruce(req, res);

});

/**
 * Retrieve Entity by ID
 */
router.get('/buildcontactdata', function (req, res) {
    service.buildcontactdata(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * Retrieve Entity by ID
 */
router.get('/tablero', function (req, res) {
    service.dashboard(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


router.get('/remanentes', function(req, res) {

    service.remanentes(req, res);


});


router.get('/beneficiario/:id', function (req, res) {
    service.findByDNI(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


/**
 * Update entity
 */
router.put('/:id', function (req, res) {
    service.update(req.params.id, req.body, 
        function (err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});

router.get('/:id', function (req, res) {
    service.findById(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});






module.exports = router;