/**
 * Product routes
 */
/**
 * Load module dependencies
 */
var express = require('express');
var router = express.Router();
var service = require('../models/conversationModel.js');

const whoami =  "Router:routes/conversationRoutes: ";

/**
 * Retrieve all entities
 */
router.get('/', function (req, res) {
    service.findAll(function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * Retrieve all entities
 */
router.get('/nodes', function (req, res) {
    service.conversations(function(err) {
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
 * fetch user-conversation documents
 */
router.get('/conversation', function (req, res) {
    service.findConversationByQuery(req.query, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});

/**
 * fetch user-conversation documents
 */
router.get('/userconversation', function (req, res) {
    service.findUserConversationByQuery(req.query, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


/**
 * fetch user-conversation documents
 */
router.get('/userconversation/:id', function (req, res) {
    service.findUserConversationById(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


/**
 * Retrieve Entity by ID
 */
router.get('/:id', function (req, res) {
    service.findById(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});


/**
 * Retrieve Resource from entity
 */
router.get('/retrieve/:id', function (req, res) {
    service.findById(req.params.id, function(err) {
        res.status(400).json(err);

    }, function(entities) {
        res.status(200).json(entities);

    });
});



/**
 * Create new entity
 */
router.post('/', function (req, res) {
    service.create(req.body, function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(201).json(entity);

    });
});


/**
 * Create new entity
 */
router.post('/emitnotification', function (req, res) {
    service.emitnotification(req.body, function(err) {
        res.status(400).json(err);

    }, function(entity) {
        res.status(201).json(entity);

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

module.exports = router;