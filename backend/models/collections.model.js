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
});

exports.saveCollection = collection => Collection.create(collection);

exports.getAllCollections = () => Collection.find({});

exports.getCollection = id => Collection.findById(new ObjectId(id));

exports.updateCollection = (id, collection) => Collection.findByIdAndUpdate(new ObjectId(id), collection, { new: true });

exports.deleteCollection = id => Collection.remove({ _id: new ObjectId(id) });
