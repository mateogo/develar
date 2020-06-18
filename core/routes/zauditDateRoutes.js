/**
 * auditoría de datos
 */


 /**
 * Para procesar y limpiar duplicados:
 * (a) /api/auditodatos/auditpersonduplices
 * (b) /api/auditodatos/processduplices
 **/

var express = require('express');
var router = express.Router();
var service = require('../models/zauditDataService.js');

const whoami =  "Router:routes/zauditDataRoutes: ";


/**
 * Regenera el campo asisprevencion.casoIndice.nucleo
 */
router.get('/casoindice', function (req, res) {
    service.nucleoCasoIndice(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});



/**
 * Recorre Asistencias, y les actualiza la 'edad' buscando este dato en Person
 */
router.get('/publishedad', function (req, res) {
    service.publishEdad(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


/**
 * autita personas con TipoNumero de documento Duplicados
 */
router.get('/auditpersonduplices', function (req, res) {
    service.auditPersonDuplices(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


/**
 * Retrieve all entities
 */
router.get('/fetchduplices', function (req, res) {
    service.findDuplices(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

router.get('/processduplices', function (req, res) {
    service.processDuplices(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});



const mockUsers = [

    {
        "id": 1,
        "email": "george.bluth@reqres.in",
        "first_name": "George",
        "last_name": "Bluth",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
    },
    {
        "id": 2,
        "email": "janet.weaver@reqres.in",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
    },
    {
        "id": 3,
        "email": "emma.wong@reqres.in",
        "first_name": "Emma",
        "last_name": "Wong",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"
    },
    {
        "id": 4,
        "email": "eve.holt@reqres.in",
        "first_name": "Eve",
        "last_name": "Holt",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
    },
    {
        "id": 5,
        "email": "charles.morris@reqres.in",
        "first_name": "Charles",
        "last_name": "Morris",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
    },
    {
        "id": 6,
        "email": "tracey.ramos@reqres.in",
        "first_name": "Tracey",
        "last_name": "Ramos",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"
    }

];

const delay  = ms => new Promise(resolve => setTimeout(resolve, ms));

router.get('/getusers', async function (req, res) {


    for (var i = 0; i < 6; i++) {
        let user = JSON.stringify(mockUsers[i])
        res.write(user);
        await delay(1000);
    }
    res.end()

});


module.exports = router;