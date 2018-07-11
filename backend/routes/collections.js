const express = require('express');
const router = express.Router();

const tokensMw = require('../middleware/auth.tokens');
const collectionsController = require('../controllers/collections.controller');

router.get('/', tokensMw.protected, collectionsController.getAllCollections);
router.post('/', tokensMw.protected, collectionsController.saveCollection);
router.delete('/:id', tokensMw.protected, collectionsController.deleteCollection);
router.put('/:id', tokensMw.protected, collectionsController.updateCollection);

module.exports = router;
