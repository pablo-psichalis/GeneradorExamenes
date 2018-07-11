const ExamsDB = require('../models/exams.model');
const generateExamsService = require('../services/generateExams.service');

exports.saveExam = (req, res, next) => {
  const exam = req.body;
  exam.user_id = req.token.id;
  ExamsDB.saveExam(exam)
    .then((response) => {
      res.status(200).json({ success: true, data: response });
    }).catch(err => next(err));
};

exports.getAllExams = (req, res, next) => {
  ExamsDB.getAllExams(req.token.id)
    .then((exams) => {
      console.log(exams);
      res.status(200).json(exams);
    }).catch(err => next(err));
};

exports.getExam = (req, res, next) => {
  ExamsDB.getExam(req.params.id, req.token.id)
    .then((exam) => {
      res.status(200).json(exam);
    })
    .catch(err => next(err));
};

exports.updateExam = (req, res, next) => {
  ExamsDB.updateExam(req.params.id, req.body, req.token.id)
    .then((response) => {
      res.status(200).json({ success: true, data: response });
    })
    .catch(err => next(err));
};

exports.deleteExam = (req, res, next) => {
  ExamsDB.deleteExam(req.params.id, req.token.id)
    .then((response) => {
      res.status(200).json({ removedDocuments: response.n });
    })
    .catch(err => next(err));
};

exports.generateExam = (req, res, next) => {
  generateExamsService.generateExam(req.body)
    .then((examData) => {
      res.status(200).json(examData);
    })
    .catch(err => next(err));
};
