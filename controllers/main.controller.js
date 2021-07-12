const usersRepository = require('../repositories/users.repository')
const questionsRepository = require('../repositories/questions.repository')
const answersRepository = require('../repositories/answers.repository')
const commentsRepository = require('../repositories/comments.repository')

const controller = {
    // GETS a user
    getUser: (req, res) => {
        const userId = Number(req.params.id)

        usersRepository.getUserByUserId(userId)
        .then((user) => {
            res.status(200).json({
                data: user
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

    // ADDS A USER (POST /signup)
    addUser: (req, res) => {
        // check if email is available
        usersRepository.isEmailAvailable(req.body.data.email)
        // check if username is available
        .then(() => usersRepository.isUsernameAvailable(req.body.data.username))
        // initialize user entity and add user
        .then(() => {
            // add current points, initialize answersCtr, brainliestCtr, thanksCtr
            req.body.data.currentPoints = 90
            req.body.data.answersCtr = 0
            req.body.data.brainliestCtr = 0
            req.body.data.thanksCtr = 0
            return usersRepository.addUser(req.body.data)
        })
        // send the user entity created back to the client
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

    // CHECKS IF LOGIN CREDENTIALS MATCH (POST /login)
    login: (req, res) => {
        const usernameOrEmail = req.body.data.usernameOrEmail
        const password = req.body.data.password

        // gets the password given a username if username exists
        usersRepository.getPasswordByUsername(usernameOrEmail)
        .then((retrievedPassword) => {
            // compare passwords
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
            // gets the password given an email if email exists
            usersRepository.getPasswordByEmail(usernameOrEmail)
            .then((retrievedPassword) => {
                // compare passwords
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

    // DISPLAY all questions (GET /questions)
    displayAllQuestions: (req, res) => {
        // get all questions from the database
        questionsRepository.getAllQuestions()
        // return the retrieved questions
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
        .then(() => {
            // get the username using the provided userId
            return usersRepository.getUsername(Number(req.query.userId))
        })
        .then((username) => {
            question.username = username

            // query INSERT to the database
            return questionsRepository.addQuestion(question)
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

    // GETS a single question (GET /questions/:id)
    getQuestion : async (req, res) => {
        const questionId = req.params.id

        try{
            // get the question entity
            let question = await questionsRepository.getQuestion(Number(questionId))
            // get all comments of this question
            let comments = await commentsRepository.getAllComments(Number(questionId), null)
            question.comments = comments

            // get all answers for this question
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
                            // get comments of an answer
                            commentsRepository.getAllComments(null, Number(answerId))
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
  
    //EDITS a single question (PUT /questions/:id?userId=x)
    editQuestion : (req, res) => {
        // get the data from params and query
        const questionId = req.params.id
        const userId = req.query.userId
        const newQuestion = req.body.data.newQuestion

        // check if the user is the same with the asker
        questionsRepository.isQuestionIdAndAskerIdMatch(Number(questionId), Number(userId))
        // edit the question given the questionId and the new question
        .then(() => questionsRepository.editQuestion(Number(questionId), newQuestion))
        // send the edited question back to the client
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
  
    // DELETES a question (DELETE /questions/:id?userId=x)
    deleteQuestion : (req,res) => {
        const questionId = req.params.id
        const askerId = req.query.userId

        // check if the user is the same with asker
        questionsRepository.isQuestionIdAndAskerIdMatch(Number(questionId), Number(askerId))
        // delete the question given the questionId
        .then(() => questionsRepository.deleteQuestion(Number(questionId)))
        // send back the deleted question
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

    //GETS all questions by subject (GET /subjects/:subject/questions)
    getQuestionsBySubject : (req,res) => {
        const subject = req.params.subject

        // get the questions with the same subject
        questionsRepository.getQuestionsBySubject(subject)
        // send back the questions to the client
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

    // ANSWERS a question/Adds an answer (POST /questions/:id/answers)
    addAnswer: (req, res) => {
        // get the data from query and params
        const userId = req.query.userId
        const questionId = req.params.id
        const answer = req.body.data

        // check if question exists
        questionsRepository.isQuestionExist(Number(questionId))
        // get answers whose questionId = questionId
        .then(() => answersRepository.getAnswersByQuestionId(Number(questionId)))  
        // CHECK IF USER ALREADY ANSWERED THE QUESTION     
        .then((answers) => {
            return new Promise((fulfill, reject) => {
                const isUserAnswered = answers.map((answer) => answer.userId).includes(Number(userId))
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
            answer.questionId = Number(questionId)
            answer.userId = Number(userId)

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
            return usersRepository.getUsername(Number(userId))
        })
        .then((username) => {
            // Save the username to the answer
            answer.username = username
            // add the answer to the database
            return answersRepository.addAnswer(answer)
        })
        .then((returnAnswer) => {
            // send the answer back to the client
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

    // EDITS an answer (PUT /questions/:id/answers/:answerId?userId=x)
    editAnswer: (req,res) => {
        // get the data from query and params
        const userId = req.query.userId
        const answerId = req.params.answerId
        const questionId = req.params.id
        const newAnswer = req.body.data.newAnswer

        // CHECK if question has the specific answer or question exists
        answersRepository.isAnswerIdAndQuestionIdMatch(Number(answerId), Number(questionId))
        // CHECK if user has the authority to edit an answer
        .then(() => answersRepository.isAnswerIdAndUserIdMatch(Number(answerId), Number(userId)))
        // EDIT answer given the answerId and the new answer
        .then(() => answersRepository.editAnswer(Number(answerId), newAnswer))
        // send the edited answer back to the client
        .then((updatedAnswer) => {
            res.status(200).json({
                data: updatedAnswer
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

    // DELETES an answer (DELETE /questions/:id/answers/:answerId?userId=x)
    deleteAnswer : (req,res) => {
        const userId = req.query.userId
        const answerId = req.params.answerId
        const questionId = req.params.id

        // CHECK if question has the specific answer or question exists
        answersRepository.isAnswerIdAndQuestionIdMatch(Number(answerId),Number(questionId))
        // CHECK if user has the authority to edit an answer
        .then(() => answersRepository.isAnswerIdAndUserIdMatch(Number(answerId), Number(userId)))
        // DELETE answer given an answerId
        .then(() => answersRepository.deleteAnswer(Number(answerId)))
        // send the deleted answer back to the client
        .then((deletedAnswer) => {
            res.status(200).json({
                data: deletedAnswer
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

    // ADDS a comment to either a question or an answer
    // (POST /questions/:id/comments) to add comment to a question
    // (POST /questions/:id/answers/:answerId/comments) to add comment to an answer
    // parent is a string that is either "question" or "answer"
    // it denotes if the comment is for a question/answer
    addComment : (req, res, parent) => {
        // get the data from query and params
        const userId = req.query.userId
        const questionId = req.params.id
        const answerId = req.params.answerId
        const comment = req.body.data
        
        // initialize comment
        comment.userId = Number(userId)
        
        // initialize date
        const dateObj = new Date()
        const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
        comment.date = date
        comment.lastEdited = ""

        // comment to a question
        if(parent === 'question'){
            comment.questionId = Number(questionId)
            comment.answerId = null
        }

        // comment to an answer
        else if(parent === 'answer'){
            comment.answerId = Number(answerId)
            comment.questionId = null
        }

        // check if question exists
        questionsRepository.isQuestionExist(Number(questionId))
        .then(() => {
            // get username of userId
            return usersRepository.getUsername(Number(userId))
        })
        .then((username) => {
            // save the username
            comment.username = username
            // add Comment
            return commentsRepository.addComment(comment)
        })
        // send back the comment back to the client
        .then((returnComment) => {
            res.status(200).json({
                data: returnComment
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

    // EDITS a comment 
    // (PUT /questions/:id/comments/:commentId?userId=x)
    // (PUT /questions/:id/answers/:answerId/comments/:commentId?userId=x)
    editComment: (req,res,parent) => {
        // get the data from query and params
        const userId = req.query.userId
        const questionId = req.params.id
        const answerId = req.params.answerId
        const commentId = req.params.commentId
        const newComment = req.body.data.newComment
        const parentId = parent === 'question' ? questionId : answerId

        new Promise((fulfill, reject) => {
            if(parent === 'answer'){
                // CHECK if question contains the answer
                console.log("printed");
                fulfill(answersRepository.isAnswerIdAndQuestionIdMatch(Number(answerId), Number(questionId))
)            }
            else{
                fulfill()
            }
        })
        // CHECK if parent has the specific comment
        .then(() => {
            console.log("comment parent match");
            return commentsRepository.isCommentIdAndParentIdMatch(Number(commentId), Number(parentId), parent)
        })        
        // CHECK if user has the authority to edit an comment
        .then(() => commentsRepository.isCommentIdAndUserIdMatch(Number(commentId), Number(userId)))
        // EDIT answer given the commentId and the new comment
        .then(() => commentsRepository.editComment(Number(commentId), newComment))
        // send the edited answer back to the client
        .then((updatedComment) => {
            res.status(200).json({
                data: updatedComment
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

    // deletes a comment
    deleteComment : (req,res, parent) => {
        const userId = req.query.userId
        const answerId = req.params.answerId
        const questionId = req.params.id
        const commentId = req.params.commentId
        const parentId = parent === 'question' ? questionId : answerId

        // only applicable 
        new Promise((fulfill, reject) => {
            if(parent === 'answer'){
                // CHECK if question contains the answer
                console.log("printed");
                fulfill(answersRepository.isAnswerIdAndQuestionIdMatch(Number(answerId), Number(questionId))
)            }
            else{
                fulfill()
            }
        })
        // CHECK if parent has the specific comment
        .then(() => commentsRepository.isCommentIdAndParentIdMatch(Number(commentId),Number(parentId), parent))
        // CHECK if user has the authority to edit an answer
        .then(() => commentsRepository.isCommentIdAndUserIdMatch(Number(commentId), Number(userId)))
        // DELETE answer given an answerId
        .then(() => commentsRepository.deleteComment(Number(commentId)))
        // send the deleted answer back to the client
        .then((deletedComment) => {
            res.status(200).json({
                data: deletedComment
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

    // (NOT INCLUDED IN THE DEMO)
    // GETS ALL ANSWERS BY A SPECIFIC USER (GET /users/:userId/answers)
    getAnswersByUser : (req, res) => {
        const userId = req.params.id

        // check if the user exists given a userId
        usersRepository.getUsername(Number(userId))
        // get all answers of the user given a userId
        .then(() => answersRepository.getAnswersByUser(Number(userId)))
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

    // NOT INCLUDED IN THE DEMO
    // GET ALL QUESTIONS BY A SPECIFIC USER (GET /users/:userId/questions)
    getQuestionsByUser : (req, res) => {
        const userId = req.params.id

        // check if the user exists given a userId
        usersRepository.getUsername(Number(userId))
        // get all questions of the user given a userId
        .then(() => questionsRepository.getQuestionsByUser(Number(userId)))     
        // for every question, get the list of users who provided an answer
        .then(async (questions) => {

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
    },
}

module.exports = controller
