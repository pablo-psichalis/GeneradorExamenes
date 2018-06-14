const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;


const Collection = mongoose.model('collections', {
  name: String,
  questions: Array,
});

exports.saveCollection = collection => Collection.create(collection);

exports.getAllCollections = () => Collection.find({});

exports.getCollection = id => Collection.findById(new ObjectId(id));

exports.updateCollection = (id, collection) => Collection.findByIdAndUpdate(new ObjectId(id), collection, { new: true });

exports.deleteCollection = id => Collection.remove({ _id: new ObjectId(id) });
