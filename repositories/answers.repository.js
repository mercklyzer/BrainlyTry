let answersCtr = 7

let answers = [
    {
        answerId : 1,
        questionId : 1,
        userId : 1,
        username: "merck123",
        answer: "I have a dream.",
        date: '7-8-2021',
        lastEdited: "",
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    {
        answerId : 2,
        questionId : 7,
        userId : 3,
        username: "lyzer0101",
        answer: "I have a dream.",
        date: '7-8-2021',
        lastEdited: "",
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    {
        answerId : 3,
        questionId : 7,
        userId : 1,
        username: "merck123",
        answer: "I have a dream.",
        date: '7-8-2021',
        lastEdited: "",
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    {
        answerId : 4,
        questionId : 7,
        userId : 1,
        username: "merck123",
        answer: "I have a dream.",
        date: '7-8-2021',
        lastEdited: "",
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    {
        answerId : 5,
        questionId : 7,
        userId : 1,
        username: "merck123",
        answer: "I have a dream.",
        date: '7-8-2021',
        lastEdited: "",
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    {
        answerId : 6,
        questionId : 7,
        userId : 1,
        username: "merck123",
        answer: "I have a dream.",
        date: '7-8-2021',
        lastEdited: "",
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    {
        answerId : 7,
        questionId : 7,
        userId : 1,
        username: "merck123",
        answer: "I have a dream.",
        date: '7-8-2021',
        lastEdited: "",
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
]

const repository = {
    // ADDS an answer
    addAnswer: (answer) => {
        return new Promise((fulfill, reject) => {
            try{
                answersCtr++
                answer.answerId = answersCtr
    
                // save answer
                answers.push(answer)
                fulfill(answer)
            }
            catch{
                reject(new Error("Answer not stored."))
            }
        })
    },

    // GET answers of a specific question
    getAllAnswers: (questionId) => {
        return new Promise((fulfill, reject) => {
            try{
                let retrievedAnswers =[]
                
                // push all questions that match the questionId
                for(let i = 0; i < answers.length; i++){
                    console.log(answers[i].questionId);
                    if(answers[i].questionId === questionId){
                        retrievedAnswers.push(answers[i])
                    }
                }
                fulfill(retrievedAnswers)
                console.log(retrievedAnswers);
            }
            catch{
                reject(new Error("Error loading the answers for this question."))
            }
        })
    },

    // GET all answers of a specific questionId
    getAnswersByQuestionId : (questionId) => {
        return new Promise((fulfill, reject) => {
            try{
                let retrievedAnswers = []

                for(let i = 0; i < answers.length; i++){
                    if(answers[i].questionId === questionId){
                        retrievedAnswers.push(answers[i])
                    }
                }
                fulfill(retrievedAnswers)
            }
            catch{
                reject(new Error("Cannot retrieve answers on this question."))
            }
        })
    },

    // GET all answers of a specific user
    getAnswersByUser : (userId) => {
        return new Promise((fulfill, reject) => {
            try{
                let retrievedAnswers = []

                for(let i = 0; i < answers.length; i++){
                    if(answers[i].userId === userId){
                        retrievedAnswers.push(answers[i])
                    }
                }
                fulfill(retrievedAnswers)
            }
            catch{
                reject(new Error("Cannot retrieve answers by this user."))
            }
        })
    },

    // check if the answerId and questionId match
    isAnswerIdAndQuestionIdMatch: (answerId, questionId) => {
        return new Promise((fulfill, reject) => {
            const index = answers.map((answer) => answer.answerId).indexOf(answerId);
            // if found
            if(index > -1){
                const storedQuestionId = answers[index].questionId
                if(storedQuestionId === questionId){
                    fulfill()
                }
                else{
                    reject(new Error("Answer does not exist in this specific question."))
                }
            }
            else{
                reject(new Error("Answer not found."))
            }
        })
    },

    // check if the answerId and userId match
    isAnswerIdAndUserIdMatch: (answerId, userId) => {
        return new Promise((fulfill, reject) => {
            const index = answers.map((answer) => answer.answerId).indexOf(answerId);
            // if found
            if(index > -1){
                const storedUserId = answers[index].userId
                if(storedUserId === userId){
                    fulfill()
                }
                else{
                    reject(new Error("User does not own the answer."))
                }
            }
            else{
                reject(new Error("Answer not found."))
            }
        })
    },

    // EDITS AN ANSWER BASED ON ANSWERID
    editAnswer: (answerId, newAnswer) => {
        return new Promise((fulfill, reject) => {
            const index = answers.map((answer) => answer.answerId).indexOf(answerId);

            // if found
            if(index > -1){
                //get date today
                const dateObj = new Date()
                const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
                answers[index].answer = newAnswer
                answers[index].lastEdited = date
                fulfill(answers[index])
            }
            // if NOT found
            else{
                reject(new Error("Cannot edit the answer."))
            }
        })
    },

    // DELETES an answer
    deleteAnswer : (answerId) => {
        return new Promise((fulfill, reject) => {
            const index = answers.map((answer) => answer.answerId).indexOf(answerId)

            // if found
            if(index > -1){
                const answer = answers.splice(index,1)
                fulfill(answer)
                
            }
            else{
                reject(new Error("Unable to delete the answer."))
            }
        })
    },
}

module.exports = repository