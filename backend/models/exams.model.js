const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;


const Exam = mongoose.model('exams', {
  title: String,
  date: Date,
  description: String,
  subject: String,
  school_name: String,
  questions: Array,
});

exports.saveExam = exam => Exam.create(exam);

exports.getAllExams = () => Exam.find({});

exports.getExam = id => Exam.findById(new ObjectId(id));

exports.updateExam = (id, exam) => Exam.findByIdAndUpdate(new ObjectId(id), exam, { new: true });

exports.deleteExam = id => Exam.remove({ _id: new ObjectId(id) });
