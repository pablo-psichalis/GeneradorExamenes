const express = require('express');

const router = express.Router();

const collectionsController = require('../controllers/collections.controller');

router.get('/', collectionsController.getAllCollections);
router.get('/:id', collectionsController.getCollection);
router.post('/', collectionsController.saveCollection);
router.delete('/:id', collectionsController.deleteCollection);
router.put('/:id', collectionsController.updateCollection);

module.exports = router;
