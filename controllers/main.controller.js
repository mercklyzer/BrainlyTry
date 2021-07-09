const shortid = require('shortid')
const usersRepository = require('../repositories/users.repository')
const questionsRepository = require('../repositories/questions.repository')
const answersRepository = require('../repositories/answers.repository')
const commentsRepository = require('../repositories/comments.repository')

const controller = {
    // adds a user (signup)
    addUser: (req, res) => {
        usersRepository.isEmailAvailable(req.body.data.email)
        .then(() => usersRepository.isUsernameAvailable(req.body.data.username))
        .then(() => {
            // add current points, initialize answersCtr, brainliestCtr, thanksCtr
            req.body.data.currentPoints = 90
            req.body.data.answersCtr = 0
            req.body.data.brainliestCtr = 0
            req.body.data.thanksCtr = 0
            return usersRepository.addUser(req.body.data)
        })
        .then((user) => {
            res.status(201).json({
                data : user
            })
        })
        .catch((e) => {
            res.status(404).json({
                error: {
                    message: e.message
                }
            })
        })
    },

    // CHECKS IF LOGIN CREDENTIALS MATCH
    login: (req, res) => {
        const usernameOrEmail = req.body.data.usernameOrEmail
        const password = req.body.data.password

        // check if username and password match
        usersRepository.getPasswordByUsername(usernameOrEmail)
        .then((retrievedPassword) => {
            if(retrievedPassword === password){
                res.status(200).json({
                    data: "User verified."
                })
            }
            else{
                // http code 401 for incorrect credentials
                res.status(401).json({
                    error: {
                        message: "Incorrect password."
                    }
                })
            }
        })
        .catch(() => {
            // check if email and password match
            usersRepository.getPasswordByEmail(usernameOrEmail)
            .then((retrievedPassword) => {
                if(retrievedPassword === password){
                    res.status(200).json({
                        data: "User verified."
                    })
                }
                else{
                    // http code 401 for incorrect credentials
                    res.status(401).json({
                        error: {
                            message: "Incorrect password."
                        }
                    })
                }
            })
            .catch(() => {
                res.status(404).json({
                    error: {
                        message: "User does not exist."
                    }
                })
            })
        })
    },

    // DISPLAY all questions
    displayAllQuestions: (req, res) => {
        questionsRepository.getAllQuestions()
        .then((questions) => {
            res.status(200).json({
                data: questions
            })
        })
        .catch((e) => {
            res.status(400).json({
                error: {
                    message: e.message
                }
            })
        })
    },

    // ADD a single question
    addQuestion: (req, res) => {
        // initialize date
        const dateObj = new Date()
        const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
        req.body.data.date = date
        req.body.data.askerId = Number(req.query.userId) //NOTE THAT THIS IS TO BE CHANGED (use sessions)

        // get the username of using the provided userId
        usersRepository.getUsername(Number(req.query.userId))
        .then((username) => {
            req.body.data.username = username

            // query INSERT to the database
            return questionsRepository.addQuestion(req.body.data)
        })
        .then((question) => {
            // status 201 for creating an entity
            res.status(201).json({
                data: question
            })
        })
        .catch((e) => {
            res.status(404).json({
                error: {
                    message: e.message
                }
            })
        })
    },

//     // GETS a single question
    getQuestion : async (req, res) => {
        const questionId = req.params.id

        try{
            let question = await questionsRepository.getQuestion(Number(questionId))
            let comments = await commentsRepository.getAllComments(Number(questionId), null)
            question.comments = comments
            let answers = await answersRepository.getAllAnswers(Number(questionId))

            let answersCommentsList = []
            let answersCommentsCtr = 0
            answersCommentsList.length = answers.length

            // Promise to get all comments of each answer
            let commentsPromise =  new Promise((fulfill, reject) => {
                try{
                    if(answers.length > 0){
                        for(let i = 0; i < answers.length; i++){
                            let answerId = answers[i].answerId
                            commentsRepository.getAllComments(null, Number(answerId))
                            .then((comments) => {
                                answersCommentsList[i] = comments
                                console.log(comments);
                                answersCommentsCtr++
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

            let allCommentsList = await commentsPromise

            for(let i = 0; i < answers.length; i++){
                answers[i].comments = allCommentsList[i]
            }
            question.answers = answers

            res.status(200).json({
                data: question
            })

        }
        catch(e){
            res.status(404).json({
                error: {
                    message: e.message
                }
            })
        }
    },
  
    //EDITS a single question
    editQuestion : (req, res) => {
        const questionId = req.params.id
        const userId = req.query.userId
        const newQuestion = req.body.data.newQuestion

        // check if the user is the same with the asker
        questionsRepository.isQuestionIdAndAskerIdMatch(Number(questionId), Number(userId))
        .then(() => questionsRepository.editQuestion(Number(questionId), newQuestion))
        .then((updatedQuestion) => {
            res.status(200).json({
                data: updatedQuestion
            })
        })
        .catch((e) => {
            res.status(404).json({
                error: {
                    message: e.message
                }
            })
        })
    },
  
    // DELETES a question
    deleteQuestion : (req,res) => {
        const questionId = req.params.id
        const askerId = req.query.userId

        // check if the input asker ID and the stored asker ID match
        questionsRepository.isQuestionIdAndAskerIdMatch(Number(questionId), Number(askerId))
        .then(() => questionsRepository.deleteQuestion(Number(questionId))) // delete the question
        .then((deletedQuestion) => {
            res.status(200).json({
                data: deletedQuestion
            })
        })
        .catch((e) => {
            res.status(404).json({
                error: {
                    message: e.message
                }
            })
        })
    },

    //gets all questions by subject
    getQuestionsBySubject : (req,res) => {
        const subject = req.params.subject
        questionsRepository.getQuestionsBySubject(subject)
        .then((questions) => {
            res.status(200).json({
                data: questions
            })
        })
        .catch((e) => {
            res.status(404).json({
                error: {
                    message: e.message
                }
            })
        })
    },

    // ANSWERS a question
    addAnswer: (req, res) => {
        const userId = req.query.userId
        const questionId = req.params.id
        const answer = req.body.data.answer

        usersRepository.getUsername(Number(userId))
        .then((username) => {
            // Save the username to the answer
            answer.username = username
            return answersRepository.addAnswer(Number(userId), Number(questionId), answer)
        })
        .then((returnAnswer) => {
            // send the answer back
            res.status(200).json({
                data: returnAnswer
            })
        })
        .catch((e) => {
            res.status(404).json({
                error: {
                    message: e.message
                }
            })
        })
    },

    // GETS ALL ANSWERS BY A SPECIFIC USER
    getAnswersByUser : (req, res) => {
        const userId = req.params.id
        answersRepository.getAnswersByUser(Number(userId))
        .then((answers) => {
            res.status(200).json({
                data: answers
            })
        })
        .catch((e) => {
            res.status(404).json({
                error:{
                    message: e.message
                }
            })
        })
    },

    // GET ALL QUESTIONS BY A SPECIFIC USER
    getQuestionsByUser : (req, res) => {
        const userId = req.params.id
        questionsRepository.getQuestionsByUser(Number(userId))
        .then((questions) => {
            res.status(200).json({
                data: questions
            })
        })
        .catch((e) => {
            res.status(404).json({
                error:{
                    message: e.message
                }
            })
        })
    }
}

module.exports = controller
