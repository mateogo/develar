const express = require('express');
const router = express.Router();
const service = require('../models/turnosPresencialesModel.js');
const sendmail = require('../services/sendmail');
const whoami = 'Router :: agnTurnoRouter';


/**
 * Ruta: /api/initdata
 * Método: GET
 * Descripción: poblar la base de datos con los slots disponibles
 * para asignar turnos
 *
 */
router.get('/initdata', function(req, res) {
    service.buildTurnoSlots();
    res.status(200).json({ message: 'Turnos generados; verifique la BBDD' });
});

router.get('/primerodisponible', function(req, res) {
    service.fetchFirstAvailableSlot(req.query, function(error) {
        res.status(400).json(error);
    }, function(result) {
        res.status(200).json(result);
    });
});

router.post('/nuevoturno', function(req, res) {
    service.processTurno(req.body,
        function(error) {
            res.status(400).json(error);
        },
        function(entities) {
            res.status(201).json(entities);
        });
});

router.get('/disponibles/:id', function(req, res) {
    service.findDisponibleById(req.params.id, function(error) {
            res.status(400).json(error);
        },
        function(entity) {
            res.status(200).json(entity);
        });
});

router.get('/disponibles', function(req, res) {
    //service.findAllDisponibles(function(error) {
    service.fetchAvailableSlots(req.query, function(error) {
            res.status(400).json(error);
        },
        function(entities) {
            res.status(200).json(entities);
        });
});

router.get('/alldisponibles', function(req, res) {
    service.findAllDisponibles(req.query, function(error) {
            res.status(400).json(error);
        },
        function(entities) {
            res.status(200).json(entities);
        });
});
/**
 * Ruta: /api/turnospresenciales/exportar
 * Método: GET
 * Descripción: exportar turnos a XLS, según query
 *
 */
router.get('/exportar', function(req, res) {
    service.exportarMovimientos(req.query, req, res);

    // service.create(req.body, function(error) {
    //         res.status(400).json(error);
    //     },
    //     function(result) {
    //         res.status(201).json(result);
    //     });
});


/**
 * Ruta: /api/turnospresenciales
 * Método: POST
 * Descripción: crear un nuevo turno
 *
 */
router.post('/', function(req, res) {
    service.create(req.body, function(error) {
            res.status(400).json(error);
        },
        function(result) {
            res.status(201).json(result);

            // FIXME: Mandamos email acá?

        });
});


/**
 * Ruta: /api/turnospresenciales
 * Método: GET
 * Descripción: recuperar todos los turnos
 *
 */
router.get('/', function(req, res) {
    service.findAll(function(error) {
        res.status(400).json(error);
    }, function(results) {
        res.status(200).json(results);
    });
});

router.get('/search', function(req, res) {
    service.findByQuery(req.query, function(error) {
        res.status(400).json(error);
    }, function(results) {
        res.status(200).json(results);
    });
});

/**
 * Ruta: /api/turnospresenciales/persona/:id
 * Método: GET
 * Descripción: recuperar todos los turnos para una persona
 *
 */
router.get('/persona/:id', function(req, res) {
    service.findAllByPerson(req.params.id, function(error) {
        res.status(400).json(error);
    }, function(results) {
        res.status(200).json(results);
    });
});

/**
 * Ruta: /api/turnospresenciales/usuario/:id
 * Método: GET
 * Descripción: recuperar todos los turnos para un usuario
 *
 */
router.get('/usuario/:id', function(req, res) {
    service.findAllByUser(req.params.id, function(error) {
        res.status(400).json(error);
    }, function(results) {
        res.status(200).json(results);
    });
});

/**
 * Ruta: /api/turnospresenciales/:id
 * Método: GET
 * Descripción: recupera un turno presencial por ID (Mongo)
 *
 */
router.get('/:id', function(req, res) {
    service.findById(req.params.id, function(error, result) {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(result);
        };
    });
});

/**
 * Ruta: /api/turnospresenciales/:id
 * Método: PUT
 * Descripción: modificar un turno presencial
 *
 */
router.put('/:id', function(req, res) {
    service.update(req.params.id, req.body, function(error) {
        res.status(400).json(error);
    }, function(results) {
        res.status(200).json(results);
    });
});

/**
 * Ruta: /api/turnospresenciales/:id
 * Método: DELETE
 * Descripción: eliminar un turno presencial
 *
 */
router.delete('/:id', function(req, res) {
    service.update(req.params.id, { estado: 'cancelado' }, function(error) {
        res.status(400).json(error);
    }, function(result) {
        res.status(200).json(result);
    });
});


module.exports = router;
