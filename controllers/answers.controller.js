const usersRepository = require('../repositories/users.repository')
const questionsRepository = require('../repositories/questions.repository')
const answersRepository = require('../repositories/answers.repository')
const commentsRepository = require('../repositories/comments.repository')

const send = require('./send')

const answerController = {
    // ANSWERS a question/Adds an answer (POST /questions/:id/answers)
    addAnswer: (req, res) => {
        // get the data from query and params
        const userId = Number(req.query.userId)
        const questionId = Number(req.params.id)
        const answer = req.body.data
        
        questionsRepository.isQuestionExist(questionId)                         // check if question exists
        .then(() => answersRepository.getAnswersByQuestionId(questionId))       // get answers whose questionId = questionId  
        .then((answers) => {                                                    // CHECK IF USER ALREADY ANSWERED THE QUESTION   
            return new Promise((fulfill, reject) => {
                const isUserAnswered = answers.map((answer) => answer.userId).includes(userId)
                if(isUserAnswered){
                    reject(new Error('User already answered this question.'))
                }
                else{
                    fulfill()
                }
            })
        })
        .then(() => {
            // initialize the answer object
            answer.questionId = questionId
            answer.userId = userId

            // initialize date
            const dateObj = new Date()
            const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
            answer.date = date

            // initialize defaults
            answer.totalRating = 0
            answer.averageRating = 0
            answer.ratingCtr = 0
            answer.isBrainliest = false

            // get the username of the user to add to the answer entity
            return usersRepository.getUsername(userId)
        })
        .then((username) => {
            answer.username = username                                      // Save the username to the answer
            return answersRepository.addAnswer(answer)                      // add the answer to the database
        })

        // send response
        .then(returnAnswer => send.sendData(res,200,returnAnswer))
        .catch(e => send.sendError(res,404,e.message))
    },

    // EDITS an answer (PUT /questions/:id/answers/:answerId?userId=x)
    editAnswer: (req,res) => {
        // get the data from query and params
        const userId = Number(req.query.userId)
        const answerId = Number(req.params.answerId)
        const questionId = Number(req.params.id)
        const newAnswer = req.body.data.newAnswer

        answersRepository.isAnswerIdAndQuestionIdMatch(answerId, questionId)        // CHECK if question has the specific answer or question exists
        .then(() => answersRepository.isAnswerIdAndUserIdMatch(answerId, userId))   // CHECK if user has the authority to edit an answer
        .then(() => answersRepository.editAnswer(answerId, newAnswer))              // EDIT answer given the answerId and the new answer

        // send response
        .then(updatedAnswer => send.sendData(res,200,updatedAnswer))
        .catch(e => send.sendError(res,404,e.message))
    },

    // DELETES an answer (DELETE /questions/:id/answers/:answerId?userId=x)
    deleteAnswer : (req,res) => {
        const userId = Number(req.query.userId)
        const answerId = Number(req.params.answerId)
        const questionId = Number(req.params.id)

        // CHECK if question has the specific answer or question exists
        answersRepository.isAnswerIdAndQuestionIdMatch(answerId,questionId)
        // CHECK if user has the authority to edit an answer
        .then(() => answersRepository.isAnswerIdAndUserIdMatch(answerId, userId))
        // DELETE answer given an answerId
        .then(() => answersRepository.deleteAnswer(answerId))

        // send response
        .then((deletedAnswer) => send.sendData(res,200,deletedAnswer))
        .catch((e) => send.sendError(res,404,e.message))
    },
}

module.exports = answerController