let answersCtr = 2

let answers = {
    1: {
        questionId : 1,
        askerId : 1,
        answer: "I have a dream.",
        date: '7-8-2021',
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    2: {
        questionId : 7,
        askerId : 3,
        answer: "I have a dream.",
        date: '7-8-2021',
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    3: {
        questionId : 7,
        askerId : 1,
        answer: "I have a dream.",
        date: '7-8-2021',
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    4: {
        questionId : 7,
        askerId : 1,
        answer: "I have a dream.",
        date: '7-8-2021',
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    5: {
        questionId : 7,
        askerId : 1,
        answer: "I have a dream.",
        date: '7-8-2021',
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    6: {
        questionId : 7,
        askerId : 1,
        answer: "I have a dream.",
        date: '7-8-2021',
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
    7: {
        questionId : 7,
        askerId : 1,
        answer: "I have a dream.",
        date: '7-8-2021',
        totalRating: 0,
        averageRating: 0,
        ratingCtr: 0,
        isBrainliest: false,
    },
}

const repository = {
    // ADDS an answer
    addAnswer: (askerId, questionId, answer) => {
        return new Promise((fulfill, reject) => {
            try{
                answersCtr++

                // get date
                const dateObj = new Date()
                const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
    
                // create answer
                const answerObject = {
                    questionId : questionId,
                    askerId : askerId,
                    answer: answer,
                    date: date,
                    totalRating: 0,
                    averageRating: 0,
                    ratingCtr: 0,
                    isBrainliest: false,
                }
    
                // save answer
                answers[answersCtr] = answerObject
                console.log(answers);
                fulfill(answers[answersCtr])
            }
            catch{
                reject()
            }
        })
    },

    // GET answers of a specific question
    getAllAnswers: (questionId) => {
        return new Promise((fulfill, reject) => {
            try{
                let retrievedAnswers = {}
                const keys = Object.keys(answers)
                // console.log("logging");
                for(let i = 0; i < keys.length; i++){
                    let key = keys[i]
                    if(answers[key].questionId === questionId){
                        retrievedAnswers[key] = answers[key]
                    }
                }
                fulfill(retrievedAnswers)
            }
            catch{
                reject()
            }
        })
    }
}

module.exports = repository