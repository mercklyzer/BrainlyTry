let answersCtr = 7

let answers = [
    {
        answerId : 1,
        questionId : 1,
        userId : 1,
        username: "merck123",
        answer: "I have a dream.",
        date: '7-8-2021',
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
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
]

const repository = {
    // ADDS an answer
    addAnswer: (userId, questionId, answer) => {
        return new Promise((fulfill, reject) => {
            try{
                answersCtr++

                // get date
                const dateObj = new Date()
                const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
    
                // create answer
                const answerObject = {
                    answerId: answersCtr,
                    questionId : questionId,
                    userId : userId,
                    answer: answer,
                    date: date,
                    totalRating: 0,
                    averageRating: 0,
                    ratingCtr: 0,
                    isBrainliest: false,
                }
    
                // save answer
                answers.push(answerObject)
                console.log(answers);
                fulfill(answerObject)
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
                    if(answers[i].questionId === questionId){
                        retrievedAnswers.push(answers[i])
                    }
                }
                fulfill(retrievedAnswers)
            }
            catch{
                reject(new Error("Error loading the answers for this question."))
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
    }
}

module.exports = repository