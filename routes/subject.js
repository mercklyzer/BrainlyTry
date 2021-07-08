var express = require('express');
var router = express.Router();
const controller = require('../controllers/main.controller')

// verify user if registered
router.get('/', (req, res, next) => {
  res.status(404).json({
      data: "Page does not exist. Specify a subject."
  })
})

router.get('/:subject', (req,res,next) => {
    controller.viewSubject(req,res)
})

module.exports = router;
