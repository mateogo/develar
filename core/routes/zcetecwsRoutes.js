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
 * Envía registros de la coleccion cetecevents
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
 * local: localhost:8080/api/cetec/generarinfo
 * server: http://salud.brown.gob.ar/api/cetec/generarinfo
 */
router.get('/download', function (req, res) {
    service.downloadCetec(req, res);
});

module.exports = router;