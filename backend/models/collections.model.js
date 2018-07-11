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

exports.saveCollection = (collection) => Collection.create(collection);

exports.getAllCollections = (userId) => Collection.find({ user_id: userId });

exports.updateCollection = (id, collection, userId) =>
  Collection.findOneAndUpdate({ _id: new ObjectId(id), user_id: userId }, collection, { new: true });

exports.deleteCollection = (id, userId) => Collection.remove({ _id: new ObjectId(id), user_id: userId });

exports.getQuestionsByType = (id, type) => Collection.aggregate([
  { $match: { _id: new ObjectId(id) } },
  { $project: { questions: true } },
  { $unwind: '$questions' },
  { $match: { 'questions.type': type } },
]);

exports.getNumberOfQuestionsByType = (id, type, num) => Collection.aggregate([
  { $match: { _id: new ObjectId(id) } },
  { $project: { questions: true } },
  { $unwind: '$questions' },
  { $match: { 'questions.type': type } },
  { $sample: { size: num } },
]);

exports.getCollectionQuestionCount = (id) => Collection.findOne({ _id: new ObjectId(id) }, 'count');
