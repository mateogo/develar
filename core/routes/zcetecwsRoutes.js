/**
 * Transferencia de info a CETC en nombre de la Sec de Salud MAB
 */


 /**
 * Para procesar y limpiar duplicados:
 **/

const express = require('express');
const router = express.Router();
const service = require('../models/zcetecwsModel.js');


const whoami =  "Router:routes/zcetecwsRoutes: ";

/**
 * Envía registros de un caso puntual
 * 
 * local: localhost:8080/api/cetec/sendinfo
 * server: http://salud.brown.gob.ar/api/cetec/sendinfo
 */
router.get('/sendinfo', function (req, res) {
    service.useCetecWebService(req, 

    function(err) {
        res.status(400).json(err);

    }, 
    function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * Envía registros de la coleccion cetecevents
 * OJO OJO OJO
 * local: localhost:8080/api/cetec/migrarinfo
 * server: http://salud.brown.gob.ar/api/cetec/migrarinfo
 */
router.get('/migrarinfo', function (req, res) {
    service.migrarCetecWebService(req, 

    function(err) {
        res.status(400).json(err);

    }, 
    function(entities) {
        res.status(200).json(entities);

    });
});


/**
 * Recupera parametros maestros del sistema
 * 
 * local: localhost:8080/api/cetec/getdatosmaestros
 * server: http://salud.brown.gob.ar/api/cetec/getdatosmaestros
 */
router.get('/getdatosmaestros', function (req, res) {
    service.getCetecCovidData(req, 

    function(err) {
        res.status(400).json(err);

    }, 
    function(entities) {
        res.status(200).json(entities);

    });
});



/**
 * Prepara datos a transferir a CETEC
 * 
 * local: localhost:8080/api/cetec/generarinfo
 * server: http://salud.brown.gob.ar/api/cetec/generarinfo
 */
router.get('/generarinfo', function (req, res) {
    service.generarCetec(req, 

    function(err) {
        res.status(400).json(err);

    }, 
    function(entities) {
        res.status(200).json(entities);

    });
});


/**
 * Prepara datos a transferir a CETEC
 * 
 * local: localhost:8080/api/cetec/generardescartados
 * server: http://salud.brown.gob.ar/api/cetec/generardescartados
 */
router.get('/generardescartados', function (req, res) {
    service.generarDescartados(req, 

    function(err) {
        res.status(400).json(err);

    }, 
    function(entities) {
        res.status(200).json(entities);

    });
});




/**
 * Prepara datos a transferir a CETEC
 * 
 * local: localhost:8080/api/cetec/download
 * server: http://salud.brown.gob.ar/api/cetec/download
 */
router.get('/download', function (req, res) {
    service.downloadCetec(req, res);
});

module.exports = router;