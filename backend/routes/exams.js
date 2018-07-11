const express = require('express');
const router = express.Router();

const tokensMw = require('../middleware/auth.tokens');
const examsController = require('../controllers/exams.controller');

router.get('/', tokensMw.protected, examsController.getAllExams);
router.get('/:id', tokensMw.protected, examsController.getExam);
router.post('/', tokensMw.protected, examsController.saveExam);
router.post('/generate', tokensMw.protected, examsController.generateExam);
router.delete('/:id', tokensMw.protected, examsController.deleteExam);
router.put('/:id', tokensMw.protected, examsController.updateExam);

module.exports = router;
