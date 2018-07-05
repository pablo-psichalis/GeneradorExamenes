const express = require('express');

const router = express.Router();

const examsController = require('../controllers/exams.controller');

router.get('/', examsController.getAllExams);
router.get('/:id', examsController.getExam);
router.post('/', examsController.saveExam);
router.post('/generate', examsController.generateExam);
router.delete('/:id', examsController.deleteExam);
router.put('/:id', examsController.updateExam);

module.exports = router;
