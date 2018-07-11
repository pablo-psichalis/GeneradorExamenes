const CollectionsDB = require('../models/collections.model');

exports.saveCollection = (req, res, next) => {
  const collection = req.body;
  collection.user_id = req.token.id;
  CollectionsDB.saveCollection(collection)
    .then((response) => {
      res.status(200).json({ success: true, data: response });
    });
};

exports.getAllCollections = (req, res, next) => {
  CollectionsDB.getAllCollections(req.token.id)
    .then((collections) => {
      res.status(200).json(collections);
    }).catch(err => next(err));
};

exports.updateCollection = (req, res, next) => {
  CollectionsDB.updateCollection(req.params.id, req.body, req.token.id)
    .then((response) => {
      res.status(200).json({ success: true, data: response });
    })
    .catch(err => next(err));
};

exports.deleteCollection = (req, res, next) => {
  CollectionsDB.deleteCollection(req.params.id, req.token.id)
    .then((response) => {
      res.status(200).json({ removedDocuments: response.n });
    })
    .catch(err => next(err));
};

/* exports.getQuestionsByType = (req, res, next) => {
  CollectionsDB.getQuestionsByType(req.params.id, req.params.type)
    .then((response) => {
      const questions = response.map(elem => elem.questions);
      res.status(200).json(questions);
    })
    .catch(err => next(err));
};
 */
exports.getQuestionsByType = (id, type) =>
  CollectionsDB.getQuestionsByType(id, type)
    .then(response => response.map(elem => elem.questions));


// Randomly get "count" number of questions from the collection that matches the _id "id"
exports.getNumberOfQuestionsByType = (id, type, count) =>
  CollectionsDB.getNumberOfQuestionsByType(id, type, count)
    .then(response => response.map(elem => elem.questions));

exports.getCollectionQuestionCount = id =>
  CollectionsDB.getCollectionQuestionCount(id)
    .then(count => count);

// this.getQuestionsByType('5b3a68abed273c24248af9cd', 'long').then(res => console.log(res));
