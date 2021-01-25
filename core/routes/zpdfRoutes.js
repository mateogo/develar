/**
 * generación de PDF
 */



const express = require('express');
const router = express.Router();
const hisopadoService = require('../services/pdfhisopado.js');
const altaService = require('../services/pdfaltaepidemio.js');

const whoami =  "Router:routes/zgenpdfRoutes.js: ";


/**
 * Construye el PDF con la solicitud de hisopado del afectado
 */
router.get('/solhisopadoform', function (req, res) {
    hisopadoService.genHispadoForm(req, res);
});

router.get('/solhisopadoform/:id', function (req, res) {
    hisopadoService.genHispadoForm(req, res);
});


/**
 * Construye el PDF comprobante de ALTA del afectado COVID
 * :id   identificador de la asisprevencion
 */
router.get('/solaltaepidemioform', function (req, res) {
    altaService.genAltaEpidemioForm(req, res);
});

router.get('/solaltaepidemioform/:id/constancia.pdf', function (req, res) {
    altaService.genAltaEpidemioForm(req, res);
});


router.get('/discover', function (req, res) {

    let apis = [
        {
            route: '/discover',
            description: 'service: pdfhisopado - generación de salidas en PDF'
        },
        {
            route: '/solhisopadoform/:asisprevencion',
            description: 'Emisión de la solicitud de laboratorio para hisopados covid',
            relacionadas: '/discover/:asis'
        },

    ]
    res.status(200).json(apis);
});



module.exports = router;