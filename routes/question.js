var express = require('express');
var router = express.Router();
const controller = require('../controllers/main.controller')

// add a single question
router.post('/add', function(req, res, next) {
  console.log("ADD");
  controller.addQuestion(req,res)
});

//GETS a single question
router.get('/:id', (req,res,next) => {
  console.log("GET");
  
  controller.getQuestion(req, res)
})

//EDITS a single question
router.put('/:id/edit', (req,res,next) => {
  console.log("EDIT");
  controller.editQuestion(req, res, questionId, newQuestion)
})

// DELETES a single question
router.delete('/:id/delete', (req,res,next) => {
  console.log("DELETE");
  controller.deleteQuestion(req, res)
})

// ANSWERS a question
router.post('/:id/answer', (req, res, next) => {
  controller.answerQuestion(req, res)
})

module.exports = router;
