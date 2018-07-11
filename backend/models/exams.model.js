const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const Exam = mongoose.model('exams', {
  title: String,
  date: Date,
  description: String,
  subject: String,
  school_name: String,
  sections: Array,
  count: {
    test: Number,
    short: Number,
    long: Number,
  },
  user_id: String,
});

exports.saveExam = (exam) => Exam.create(exam);

exports.getAllExams = (userId) => Exam.find({ user_id: userId });

exports.getExam = (id, userId) => Exam.findOne({ _id: new ObjectId(id), user_id: userId });

exports.updateExam = (id, exam, userId) => Exam.findByOneAndUpdate({ _id: new ObjectId(id), user_id: userId }, exam, { new: true });

exports.deleteExam = (id, userId) => Exam.remove({ _id: new ObjectId(id), user_id: userId });
