const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;


const Collection = mongoose.model('collections', {
  title: String,
  description: String, // opcional
  questions: Array,
  count: {
    test: Number,
    short: Number,
    long: Number,
  },
  user_id: String,
});

exports.saveCollection = collection => Collection.create(collection);

exports.getAllCollections = userId => Collection.find({ user_id: userId });

exports.getCollection = (id, user_id) => Collection.findById(new ObjectId(id));

exports.updateCollection = (id, collection, user_id) =>
  Collection.findByIdAndUpdate(new ObjectId(id), collection, { new: true });

exports.deleteCollection = (id, user_id) => Collection.remove({ _id: new ObjectId(id) });

exports.getQuestionsByType = (id, type, user_id) => Collection.aggregate([
  { $match: { _id: new ObjectId(id) } },
  { $project: { questions: true } },
  { $unwind: '$questions' },
  { $match: { 'questions.type': type } },
]);

exports.getNumberOfQuestionsByType = (id, type, num, user_id) => Collection.aggregate([
  { $match: { _id: new ObjectId(id) } },
  { $project: { questions: true } },
  { $unwind: '$questions' },
  { $match: { 'questions.type': type } },
  { $sample: { size: num } },
]);

exports.getCollectionQuestionCount = (id, user_id) => Collection.findOne({ _id: new ObjectId(id) }, 'count');
