const usersRepository = require('../repositories/users.repository')
const questionsRepository = require('../repositories/questions.repository')
const answersRepository = require('../repositories/answers.repository')
const commentsRepository = require('../repositories/comments.repository')

const send = require('./send')

const questionController = {
    // DISPLAY all questions (GET /questions)
    displayAllQuestions: (req, res) => {
        // get all questions from the database
        questionsRepository.getAllQuestions()
        
        // send the response
        .then((questions) => send.sendData(res,200,questions))
        .catch((e) => send.sendError(res,400,e.message))
    },

    // ADD a single question (POST /questions)
    addQuestion: (req, res) => {
        const userId = Number(req.query.userId)
        // initialize date
        const dateObj = new Date()
        const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`

        // initialize the question
        let question = {
            ...req.body.data,
            askerId: userId,
            date: date,
            lastEdited: ""
        }

        // GET THE USER
        usersRepository.getUserByUserId(userId)
        .then((user) => {
            // CHECK IF THE USER STILL HAS POINTS
            if(user.currentPoints >= question.rewardPoints){
                // DEDUCT rewardPoints from the user's currentPoints
                return usersRepository.updateCurrentPoints(user.userId, question.rewardPoints)
            }
            else{
                return Promise.reject(new Error('User doesn\'t have enough points.'))
            }
        })
        .then(() =>  usersRepository.getUsername(req.query.userId))         // get the username using the provided userId
        .then((username) => {
            question.username = username
            return questionsRepository.addQuestion(question)                // query INSERT to the database
        })
        // send the response
        .then((question) => send.sendData(res,201,question))
        .catch((e) => send.sendError(res,404,e.message))
    },

    // GETS a single question (GET /questions/:id)
    getQuestion : async (req, res) => {
        const questionId = Number(req.params.id)

        try{
            // get the question entity
            let question = await questionsRepository.getQuestion(questionId)
            // get all comments of this question
            let comments = await commentsRepository.getAllComments(questionId, null)
            question.comments = comments

            // get all answers for this question
            let answers = await answersRepository.getAllAnswers(questionId)

            let answersCommentsList = []
            let answersCommentsCtr = 0
            answersCommentsList.length = answers.length

            // Promise to get all comments of each answer
            let commentsPromise =  new Promise((fulfill, reject) => {
                try{
                    if(answers.length > 0){
                        for(let i = 0; i < answers.length; i++){
                            let answerId = answers[i].answerId
                            // get comments of an answer
                            commentsRepository.getAllComments(null, answerId)
                            .then((comments) => {
                                answersCommentsList[i] = comments
                                answersCommentsCtr++
                                // FULFILL ONCE all answers' comments are retrieved
                                if(answersCommentsCtr === answers.length){
                                    fulfill(answersCommentsList)
                                }
                            })
                        }   
                    }
                    // if no answer, just fulfill an empty object
                    else{
                        fulfill([])
                    }
                }
                catch{
                    reject(new Error("Error loading the comments for each answer."))
                }
            })

            // await the promise defined above for getting the comments for each answer
            let allCommentsList = await commentsPromise

            // update the comments to the answers
            for(let i = 0; i < answers.length; i++){
                answers[i].comments = allCommentsList[i]
            }
            question.answers = answers
            send.sendData(res,200,question)

        }
        catch(e){
            send.sendError(res,404,e.message)
        }
    },

    //EDITS a single question (PUT /questions/:id?userId=x)
    editQuestion : (req, res) => {
        // get the data from params and query
        const questionId = Number(req.params.id)
        const userId = Number(req.query.userId)
        const newQuestion = req.body.data.newQuestion

        
        questionsRepository.isQuestionIdAndAskerIdMatch(questionId, userId)     // check if the user is the same with the asker
        .then(() => questionsRepository.editQuestion(questionId, newQuestion))  // edit the question given the questionId and the new question
        // send the response
        .then((updatedQuestion) => send.sendData(res,200,updatedQuestion))
        .catch((e) => send.sendData(res,404,e.message))
    },

    // DELETES a question (DELETE /questions/:id?userId=x)
    deleteQuestion : (req,res) => {
        const questionId = Number(req.params.id)
        const askerId = Number(req.query.userId)

        
        questionsRepository.isQuestionIdAndAskerIdMatch(questionId, askerId)    // check if the user is the same with asker
        .then(() => questionsRepository.deleteQuestion(questionId))             // delete the question given the questionId
        // send back the deleted question
        .then((deletedQuestion) => send.sendData(res,200,deletedQuestion))
        .catch((e) => send.sendData(res,404,e.message))
    },

    //GETS all questions by subject (GET /subjects/:subject/questions)
    getQuestionsBySubject : (req,res) => {
        const subject = req.params.subject

        // get the questions with the same subject
        questionsRepository.getQuestionsBySubject(subject)
        // send back the questions to the client
        .then((questions) => send.sendData(res,200,questions))
        .catch((e) => send.sendData(res,404, e.message))
    },
}

module.exports = questionController