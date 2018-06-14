const ExamsDB = require('../models/exams.model');

exports.saveExam = (req, res, next) => {
  ExamsDB.saveExam(req.body)
    .then((response) => {
      res.status(200).json({ success: true, data: response });
    });
};

exports.getAllExams = (req, res, next) => {
  ExamsDB.getAllExams()
    .then((exams) => {
      console.log(exams);
      res.status(200).json(exams);
    }).catch(err => next(err));
};

exports.getExam = (req, res, next) => {
  ExamsDB.getExam(req.params.id)
    .then((exam) => {
      res.status(200).json(exam);
    })
    .catch(err => next(err));
};

exports.updateExam = (req, res, next) => {
  ExamsDB.updateExam(req.params.id, req.body)
    .then((response) => {
      res.status(200).json({ success: true, data: response });
    })
    .catch(err => next(err));
};

exports.deleteExam = (req, res, next) => {
  ExamsDB.deleteExam(req.params.id)
    .then((response) => {
      res.status(200).json({ removedDocuments: response.n });
    })
    .catch(err => next(err));
};
