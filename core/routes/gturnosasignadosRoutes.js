/**
 * Instancias de turnos, asignación de turnos, alocación de turnos
 */

var express = require('express');
var router = express.Router();
var service = require('../models/gturnosModel.js');

const whoami =  "Router:routes/gturnosasignadosRoutes: ";

const record = 'asignado';



/**
 * Retrieve all entities
 */
router.get('/', function (req, res) {
    service.findAll(record, 
        function(err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(200).json(entities);

        });
    });


/**
 * Retrieve all entity
 */
router.post('/nextitem', function (req, res) {
    service.upsertNext(record, req.body, 
        function(err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(200).json(entity);

        });
});

router.get('/test', function (req, res) {
    test(req, res);
});

// para reconfigurar los horarios
// (a) db.turnosdisponibles.remove({})
// (b) https://dsocial.brown.gob.ar/api/turnosasignados/initdata
router.get('/initdata', function (req, res) {
    initData(req, res);
});

/**
 * search entities
 */
router.get('/search', function (req, res) {
    service.findByQuery(record, req.query, 
        function(err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(200).json(entities);

        });
});

/**
 * Retrieve Entity by ID
 */
router.get('/:id', function (req, res) {
    service.findById(record, req.params.id, 
        function(err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(200).json(entities);

        });
});


/**
 * Create new entity
 */
router.post('/', function (req, res) {
    service.create(record, req.body, 
        function(err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});

/**
 * Create new entity
 */
router.post('/nuevoturno', function (req, res) {
    service.processTurno(req.body, 
        function(err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(201).json(entities);

        });
});


/**
 * Update entity
 */
router.put('/:id', function (req, res) {
    service.update(record, req.params.id, req.body, 
        function (err) {
            res.status(400).json(err);

        }, function(entity) {
            res.status(201).json(entity);

        });
});



function test(req, res){

    let query = {
        agenda: 'ALIM:DEL',
        lugar: 'MUNI',
        lugarId: 'longchamps',
        fecha: '27/03/2020',
        qty: 4,
        dry: true,

        requeridox: {
            id: '2021939393',
            slug: 'Lopez, Malena',
            tdoc: 'DNI',
            ndoc: '14391664'
        }
    }

    service.processTurno(query, 
        function (err) {
            res.status(400).json(err);

        }, function(entities) {
            res.status(201).json(entities);

        });

}


function initData(req, res){
    service.createInitialData();
    res.status(201).json({ok:1});

}




module.exports = router;