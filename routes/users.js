var express = require('express');
var router = express.Router();
const controller = require('../controllers/main.controller')

// VIEWS user
router.get('/:id', (req,res, next) => {
  controller.getUser(req, res)
})

// DISPLATS ALL ANSWERS
router.get('/:id/answers', (req,res, next) => {
  controller.getAnswersByUser(req, res)
})

// DISPLAYS ALL QUESTIONS
router.get('/:id/questions', (req,res, next) => {
  controller.getQuestionsByUser(req,res)
})

module.exports = router;
