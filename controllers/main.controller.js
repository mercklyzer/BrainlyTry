const shortid = require('shortid')
const usersRepository = require('../repositories/users.repository')
const questionsRepository = require('../repositories/questions.repository')
const answersRepository = require('../repositories/answers.repository')
const commentsRepository = require('../repositories/comments.repository')

const controller = {
    addUser: (req, res) => {
        usersRepository.isEmailAvailable(req.body.data.email)
        .then(() => {
            //check if username is available
            usersRepository.isUsernameAvailable(req.body.data.username)
            .then(() => {
                // add current points, initialize answersCtr, brainliestCtr, thanksCtr
                req.body.data.currentPoints = 90
                req.body.data.answersCtr = 0
                req.body.data.brainliestCtr = 0
                req.body.data.thanksCtr = 0

                //call repository.addUser
                const userId = usersRepository.addUser(req.body.data)
                res.status(200).json({
                    data : {
                        [userId] : req.body.data
                    }
                })
            })
            .catch(() => {
                res.status(404).json({
                    error: {
                        message: "Username already taken."
                    }
                })
            })
        })
        .catch(() => {
            res.status(404).json({
                error: {
                    message: "Email already taken."
                }
            })
        })
    },

    // CHECKS IF LOGIN CREDENTIALS MATCH
    login: (req, res) => {
        const usernameOrEmail = req.body.data.usernameOrEmail
        const password = req.body.data.password

        usersRepository.login(usernameOrEmail, password)
        .then(() => {
            res.status(200).json({
                data: "User verified"
            })
        })
        .catch(() => {
            res.status(404).json({
                error: {
                    message: "User does not exist or incorrect password"
                }
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
        .catch(() => {
            res.status(400).json({
                error: {
                    message: "Error retrieving questions"
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
        questionsRepository.addQuestion(req.body.data)
        .then(() => {
            res.status(200).json({
                data: req.body.data
            })
        })
        .catch(() => {
            res.status(404).json({
                error: {
                    message: "Question not successfully added."
                }
            })
        })
    },

    // GETS a single question
    getQuestion : (req, res) => {
        const questionId = req.params.id
        questionsRepository.getQuestion(Number(questionId))
        .then((question) => {
            // GET ALL COMMENTS FOR THIS QUESTION
            commentsRepository.getAllComments(Number(questionId), null)
            .then((comments) => {
                question.comments = comments

                // get the answers array
                answersRepository.getAllAnswers(Number(questionId))
                .then((answers) => {
                    // for every answer, find all comments
                    let answersKeys = Object.keys(answers)
                    console.log(answersKeys);

                    // list of comments of each answer
                    let answersCommentsList = []
                    let answersCommentsCtr = 0
                    answersCommentsList.length = answersKeys.length

                    // Promise to get all comments of each answer
                    new Promise((commentsFulfill, commentsReject) => {
                        if(answersKeys.length > 0){
                            for(let i = 0; i < answersKeys.length; i++){
                                let answerId = answersKeys[i]
                                commentsRepository.getAllComments(null, Number(answerId))
                                .then((comments) => {
                                    answersCommentsList[i] = comments
                                    console.log(comments);
                                    answersCommentsCtr++
                                    if(answersCommentsCtr === answersKeys.length){
                                        commentsFulfill(answersCommentsList)
                                    }
                                })
                            }   
                        }
                        // if no answer, just fulfill an empty object
                        else{
                            commentsFulfill({})
                        }

                        
                    })
                    .then((allCommentsList) => {
                        for(let i = 0; i < answersKeys.length; i++){
                            let answerId = answersKeys[i]
                            answers[answerId].comments = allCommentsList[i]
                        }
                        question.answers = answers
                        res.status(200).json({
                            data: question
                        })
                    })
                })
                .catch(() => {
                    res.status(404).json({
                        error: {
                            message: "Answers to this question caused the error."
                        }
                    })
                })
            })
            .catch(() => {
                res.status(404).json({
                    error: {
                        message: "Cannot retrieve comments for this question."
                    }
                })
            })


            // console.log(question);



        })
        .catch(() => {
            res.status(404).json({
                error: {
                    message: "Question does not exist."
                }
            })
        })
    },

    //EDITS a single question
    editQuestion : (req, res) => {
        const questionId = req.params.id
        const newQuestion = req.body.data.newQuestion
        questionsRepository.editQuestion(Number(questionId), newQuestion)
        .then((updatedQuestion) => {
            res.status(200).json({
                data: updatedQuestion
            })
        })
          .catch(() => {
            res.status(404).json({
                error: {
                    message: "Cannot edit the question."
                }
            })
        })
    },

    // DELETES a question
    deleteQuestion : (req,res) => {
        const questionId = req.params.id
        const askerId = req.query.userId

        // check if the input asker ID and the stored asker ID match
        questionsRepository.isQuestionIdAndAskerIdMatch(questionId, Number(askerId))
        .then(() => {
            // delete the question
            questionsRepository.deleteQuestion(questionId)
            .then((deletedQuestion) => {
                res.status(200).json({
                    data: deletedQuestion
                })
            })
            .catch(() => {
                res.status(404).json({
                    error: {
                        message: "Unable to delete the question."
                    }
                })
            })
        })
        .catch(() => {
            res.status(404).json({
                error: {
                    message: "User does not own the question."
                }
            })
        })
    },

    //gets all questions by subject
    viewSubject : (req,res) => {
        const subject = req.params.subject
        questionsRepository.viewQuestionsBySubject(subject)
        .then((questions) => {
            res.status(200).json({
                data: questions
            })
        })
        .catch(() => {
            res.status(404).json({
                error: {
                    message: "Error retrieving questions"
                }
            })
        })
    },

    // ANSWERS a question
    answerQuestion: (req, res) => {
        const userId = req.query.userId
        const questionId = req.params.id
        const answer = req.body.data.answer

        answersRepository.addAnswer(userId, questionId, answer)
        .then((answer) => {
            res.status(200).json({
                data: answer
            })
        })
        .catch(() => {
            res.status(404).json({
                error: {
                    message: "Answer not stored."
                }
            })
        })
    }
}

module.exports = controller
