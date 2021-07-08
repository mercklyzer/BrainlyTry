let questionCtr = 7
let questions = {
    1: {
        question: "When did Rizal die?",
        image: "",
        subject: "history",
        date: "7-5-2021",
        lastEdited: "",
        rewardPoints: 5,
        askerId: 1,
    },
    2: {
        question: "What is a computer?",
        image: "",
        subject: "computer_science",
        date: "7-5-2021",
        lastEdited: "",
        rewardPoints: 15,
        askerId: 1,
    },
    3: {
        question: "What is internet?",
        image: "",
        subject: "computer_science",
        date: "7-6-2021",
        lastEdited: "",
        rewardPoints: 23,
        askerId: 1,
    },
    4: {
        question: "What is a network?",
        image: "",
        subject: "computer_science",
        date: "7-6-2021",
        lastEdited: "",
        rewardPoints: 23,
        askerId: 1,
    },
    5: {
        question: "How to sort an array?",
        image: "",
        subject: "computer_science",
        date: "7-6-2021",
        lastEdited: "",
        rewardPoints: 12,
        askerId: 1,
    },
    6: {
        question: "How to sort an array?",
        image: "",
        subject: "computer_science",
        date: "7-6-2021",
        lastEdited: "",
        rewardPoints: 4,
        askerId: 1,
    },
    7: {
        question: "How to remove an element in a list?",
        image: "",
        subject: "computer_science",
        date: "7-6-2021",
        lastEdited: "",
        rewardPoints: 12,
        askerId: 1,
    },
}

let repository = {
    // GETS ALL QUESTIONS
    getAllQuestions: () => {
        return Promise.resolve(questions)
    },

    // GET ALL QUESTIONS THAT MATCH THE SUBJECT
    viewQuestionsBySubject: (subject) => {
        return new Promise((fulfill, reject) => {
            try{
                let questionsBySubject = {}
    
                const keys = Object.keys(questions)
                for(let i = 0; i < keys.length; i++){
                    let questionId = keys[i]
                    if(questions[questionId].subject === subject){
                        questionsBySubject[questionId] = questions[questionId]
                    }
                }
    
                fulfill(questionsBySubject)
            }
            catch{
                reject()
            }
        })        
    },

    // ADDS A SINGLE QUESTION
    addQuestion: (question) => {
        return new Promise((fulfill, reject) => {
            try{
                questionCtr++
                questions[questionCtr] = question
                console.log(questions);
                fulfill()
            }
            catch{
                reject()
            }
        })
    },

    // GETS A SINGLE QUESTION BASED ON ID
    getQuestion : (questionId) => {
        return new Promise((fulfill, reject) => {
            if(questions[questionId]){
                fulfill(questions[questionId])
            }
            else{
                reject()
            }
        })
    },

    // EDITS A SINGLE QUESTION BASED ON ID
    editQuestion: (questionId, newQuestion) => {
        return new Promise((fulfill, reject) => {
            if(questions[questionId]){
                //get date today
                const dateObj = new Date()
                const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
                questions[questionId].question = newQuestion
                questions[questionId].lastEdited = date
                fulfill({[questionId] : questions[questionId]})
            }
            else{
                reject()
            }
        })
    },

    // CHECK IF QUESTION ID and ASKER ID match
    isQuestionIdAndAskerIdMatch : (questionId, askerId) => {
        return new Promise((fulfill, reject) => {
            const storedAskerId = questions[questionId].askerId
            if(storedAskerId === askerId){
                fulfill()
            }
            else{
                reject()
            }
        })       
    },

    // DELETES a question
    deleteQuestion : (questionId) => {
        return new Promise((fulfill, reject) => {
            const question = {[questionId]:questions[questionId]}
            try{
                delete questions[questionId]
                console.log(questions);
                fulfill(question)
            }
            catch{
                reject()
            }
        })
        
    }
}

module.exports = repository