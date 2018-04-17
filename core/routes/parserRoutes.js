/**
 * Recordcard routes
 */
/**
 * Load module dependencies
 */
var express = require('express');
var router = express.Router();
const utils = require('../services/commons.utils');




const whoami =  "Router:routes/parserRoutes: ";


/**
 * Create new entity
 */
router.post('/highlight', function (req, res) {
    let code = req.body.text;

    if(code){
        let parsedCode = utils.highlightCode(code, 'javascript');
        res.status(201).json({result: parsedCode});
    
    }else{
      res.status(400).json({error: 'not text to parse'});
    }

});



module.exports = router;