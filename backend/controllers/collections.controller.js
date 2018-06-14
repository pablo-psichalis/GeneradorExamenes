const CollectionsDB = require('../models/collections.model');

exports.saveCollection = (req, res, next) => {
  CollectionsDB.saveCollection(req.body)
    .then((response) => {
      res.status(200).json({ success: true, data: response });
    });
};

exports.getAllCollections = (req, res, next) => {
  CollectionsDB.getAllCollections()
    .then((collections) => {
      console.log(collections);
      res.status(200).json(collections);
    }).catch(err => next(err));
};

exports.getCollection = (req, res, next) => {
  CollectionsDB.getCollection(req.params.id)
    .then((collection) => {
      res.status(200).json(collection);
    })
    .catch(err => next(err));
};

exports.updateCollection = (req, res, next) => {
  CollectionsDB.updateCollection(req.params.id, req.body)
    .then((response) => {
      res.status(200).json({ success: true, data: response });
    })
    .catch(err => next(err));
};

exports.deleteCollection = (req, res, next) => {
  CollectionsDB.deleteCollection(req.params.id)
    .then((response) => {
      res.status(200).json({ removedDocuments: response.n });
    })
    .catch(err => next(err));
};
