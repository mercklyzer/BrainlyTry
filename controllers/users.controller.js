const usersRepository = require('../repositories/users.repository')
const questionsRepository = require('../repositories/questions.repository')
const answersRepository = require('../repositories/answers.repository')
const commentsRepository = require('../repositories/comments.repository')

const send = require('./send')

const userController = {
    // gets a user from the database
    getUser: (req, res) => {
        const userId = Number(req.params.id)

        usersRepository.getUserByUserId(userId)
        .then((user) => send.sendData(res,200,user))
        .catch((e) => send.sendError(res,404,e.message))
    },
    
    // used in signup
    addUser: (req, res) => {
        usersRepository.isEmailAvailable(req.body.data.email)                       // check if email is available
        .then(() => usersRepository.isUsernameAvailable(req.body.data.username))    // check if username is available
        .then(() => {                                                               // initialize user entity and add user
            // add current points, initialize answersCtr, brainliestCtr, thanksCtr
            req.body.data.currentPoints = 90
            req.body.data.answersCtr = 0
            req.body.data.brainliestCtr = 0
            req.body.data.thanksCtr = 0
            return usersRepository.addUser(req.body.data)
        })
        // send response
        .then((user) => send.sendData(res,201,user))
        .catch((e) => send.sendError(res,404,e.message))
    },

    // CHECKS IF LOGIN CREDENTIALS MATCH (POST /login)
    login: (req, res) => {
        const usernameOrEmail = req.body.data.usernameOrEmail
        const password = req.body.data.password

        // gets the password given a username if username exists
        usersRepository.getPasswordByUsername(usernameOrEmail)
        .then((retrievedPassword) => {
            // compare passwords
            if(retrievedPassword === password){
                send.sendData(res,200, "User verified.")
            }
            else{
                // http code 401 for incorrect credentials
                send.sendError(res,401,"Incorrect password.")
            }
        })
        .catch(() => {
            // gets the password given an email if email exists
            usersRepository.getPasswordByEmail(usernameOrEmail)
            .then((retrievedPassword) => {
                // compare passwords
                if(retrievedPassword === password){
                    send.sendData(res,200, "User verified.")
                }
                else{
                    // http code 401 for incorrect credentials
                    send.sendError(res,401,"Incorrect password.")
                }
            })
            .catch(() => send.sendError(res,404,"User does not exist."))
        })
    },

    // GETS ALL ANSWERS BY A SPECIFIC USER (GET /users/:userId/answers)
    getAnswersByUser : (req, res) => {
        const userId = Number(req.params.id)

        // check if the user exists given a userId
        usersRepository.getUsername(userId)
        // get all answers of the user given a userId
        .then(() => answersRepository.getAnswersByUser(userId))
        .then( async (answers) => {
            // for every answer, get the question entity
            let answersQuestionList = []
            let answersQuestionCtr = 0
            answersQuestionList.length = answers.length

            // Promise to get all comments of each answer
            let questionPromise =  new Promise((fulfill, reject) => {
                try{
                    if(answers.length > 0){
                        for(let i = 0; i < answers.length; i++){
                            let questionId = answers[i].questionId
                            // get question of an answer
                            questionsRepository.getQuestion(questionId)
                            .then((question) => {
                                answersQuestionList[i] = question
                                answersQuestionCtr++
                                // FULFILL ONCE question for every answer is retrieved
                                if(answersQuestionCtr === answers.length){
                                    fulfill(answersQuestionList)
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
            let questionList = await questionPromise

            // update the comments to the answers
            for(let i = 0; i < answers.length; i++){
                answers[i].question = questionList[i]
            }
            // question.answers = answers
            return answers
        })

        // send response
        .then((answers) => {
            send.sendData(res,200, answers)
        })
        .catch((e) => {
            send.sendError(res,404,e.message)
        })
    },

    // GET ALL QUESTIONS BY A SPECIFIC USER (GET /users/:userId/questions)
    getQuestionsByUser : (req, res) => {
        const userId = Number(req.params.id)

        
        usersRepository.getUsername(userId)                         // check if the user exists given a userId
        .then(() => questionsRepository.getQuestionsByUser(userId)) // get all questions of the user given a userId 
        .then(async (questions) => {                                // for every question, get the list of users who provided an answer

            let answerUsersList = []
            let answerUsersCtr = 0
            answerUsersList.length = questions.length

            // Promise to get all answers of each question
            let answerUsersPromise =  new Promise((fulfill, reject) => {
                try{
                    if(questions.length > 0){
                        for(let i = 0; i < questions.length; i++){
                            let questionId = questions[i].questionId
                            // get answers to every question
                            answersRepository.getAnswersByQuestionId(questionId)
                            .then((answers) => {
                                let usernames = []
                                // for every answer, save the usernames
                                answers.forEach((answer) => {
                                    usernames.push(answer.username)
                                })

                                answerUsersList[i] = usernames
                                answerUsersCtr++
                                // FULFILL ONCE answerers for every question is retrieved
                                if(answerUsersCtr === questions.length){
                                    fulfill(answerUsersList)
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
                    reject(new Error("Error loading the answerers for each question."))
                }
            })

            // await the promise defined above for getting the comments for each answer
            let answerUsernames = await answerUsersPromise

            // update the comments to the answers
            for(let i = 0; i < questions.length; i++){
                questions[i].answerUsernames = answerUsernames[i]
            }
            // question.answers = answers
            return questions

        })
        // send response
        .then((questions) => send.sendData(res,200,questions))
        .catch((e) => send.sendError(res,404,e.message))
    }
}

module.exports = userController
