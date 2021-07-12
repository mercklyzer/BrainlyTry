const usersRepository = require('../repositories/users.repository')
const questionsRepository = require('../repositories/questions.repository')
const answersRepository = require('../repositories/answers.repository')
const commentsRepository = require('../repositories/comments.repository')

const send = require('./send')

const userController = {
    // ADDS a comment to either a question or an answer
    // (POST /questions/:id/comments) to add comment to a question
    // (POST /questions/:id/answers/:answerId/comments) to add comment to an answer
    // parent is a string that is either "question" or "answer"
    // it denotes if the comment is for a question/answer
    addComment : (req, res, parent) => {
        // get the data from query and params
        const userId        = Number(req.query.userId)
        const questionId    = Number(req.params.id)
        const answerId      = Number(req.params.answerId)
        const comment       = req.body.data
        
        // initialize comment
        comment.userId = userId
        
        // initialize date
        const dateObj = new Date()
        const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
        comment.date = date
        comment.lastEdited = ""

        // comment to a question
        if(parent === 'question'){
            comment.questionId = questionId
            comment.answerId = null
        }

        // comment to an answer
        else if(parent === 'answer'){
            comment.answerId = answerId
            comment.questionId = null
        }

        questionsRepository.isQuestionExist(questionId)             // check if question exists
        .then(() => usersRepository.getUsername(userId))            // get username of userId
        .then((username) => {
            comment.username = username                             // save the username
            return commentsRepository.addComment(comment)           // add Comment
        })

        // send response
        .then((returnComment) => send.sendData(res,200,returnComment))
        .catch((e) => send.sendError(res,404,e.message))
    },

    // EDITS a comment 
    // (PUT /questions/:id/comments/:commentId?userId=x)
    // (PUT /questions/:id/answers/:answerId/comments/:commentId?userId=x)
    editComment: (req,res,parent) => {
        // get the data from query and params
        const userId        = Number(req.query.userId)
        const questionId    = Number(req.params.id)
        const answerId      = Number(req.params.answerId)
        const commentId     = Number(req.params.commentId)
        const newComment    = req.body.data.newComment
        const parentId      = parent === 'question' ? questionId : answerId

        new Promise((fulfill, reject) => {
            if(parent === 'answer'){
                // CHECK if question contains the answer
                fulfill(answersRepository.isAnswerIdAndQuestionIdMatch(answerId, questionId)
)            }
            else{
                fulfill()
            }
        })

        // CHECK if parent has the specific comment
        .then(() => commentsRepository.isCommentIdAndParentIdMatch(commentId, parentId, parent))        
        .then(() => commentsRepository.isCommentIdAndUserIdMatch(commentId, userId))    // CHECK if user has the authority to edit a comment
        .then(() => commentsRepository.editComment(commentId, newComment))              // EDIT answer given the commentId and the new comment
        
        // send the edited answer back to the client
        .then((updatedComment) => send.sendData(res,200,updatedComment))
        .catch((e) => send.sendError(res,404,e.message))
    },

    // deletes a comment
    deleteComment : (req,res, parent) => {
        const userId        = Number(req.query.userId)
        const answerId      = Number(req.params.answerId)
        const questionId    = Number(req.params.id)
        const commentId     = Number(req.params.commentId)
        const parentId      = parent === 'question' ? questionId : answerId

        // only applicable if it is a comment to an answer
        new Promise((fulfill, reject) => {
            if(parent === 'answer'){
                fulfill(answersRepository.isAnswerIdAndQuestionIdMatch(answerId, questionId)    // CHECK if question contains the answer
)            }
            else{
                fulfill()
            }
        })
        
        .then(() => commentsRepository.isCommentIdAndParentIdMatch(commentId,parentId, parent)) // CHECK if parent has the specific comment
        .then(() => commentsRepository.isCommentIdAndUserIdMatch(commentId, userId))            // CHECK if user has the authority to edit an answer
        .then(() => commentsRepository.deleteComment(commentId))                        // DELETE answer given an answerId
        // send the response
        .then((deletedComment) => send.sendData(res,200,deletedComment))
        .catch((e) => send.sendError(res,404,e.message))
    },
}

module.exports = userController