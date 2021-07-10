var express = require('express');
var router = express.Router();
const controller = require('../controllers/main.controller')

// DISPLAY ALL QUESTIONS
router.get('/', function(req, res, next) {
  controller.displayAllQuestions(req,res)
});

// add a single question
router.post('/', function(req, res, next) {
  console.log("ADD");
  controller.addQuestion(req,res)
});

//GETS a single question
router.get('/:id', (req,res,next) => {
  console.log("GET");
  
  controller.getQuestion(req, res)
})

//EDITS a single question
router.put('/:id', (req,res,next) => {
  console.log("EDIT");
  controller.editQuestion(req, res)
})

// DELETES a single question
router.delete('/:id', (req,res,next) => {
  console.log("DELETE");
  controller.deleteQuestion(req, res)
})

// ANSWERS a question
router.post('/:id/answers', (req, res, next) => {
  controller.addAnswer(req, res)
})

// EDITS an answer
router.put('/:id/answers/:answerId', (req, res, next) => {
  console.log("EDIT answer");
  controller.editAnswer(req, res)
})

// DELETES an answer
router.delete('/:id/answers/:answerId', (req, res, next) => {
  console.log("DELETE answer");
  controller.deleteAnswer(req, res)
})

// ADDS a comment to a QUESTION
router.post('/:id/comments', (req, res, next) => {
  console.log("ADD comment on a question");
  controller.addComment(req, res, 'question')
})

// ADDS a comment to an ANSWER
router.post('/:id/answers/:answerId/comments', (req, res, next) => {
  console.log("ADD comment on an answer");
  controller.addComment(req, res, 'answer')
})

module.exports = router;
