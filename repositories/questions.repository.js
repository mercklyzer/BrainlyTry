const { getUsername } = require("./users.repository")

let questionCtr = 7
let questions = [
    {
        questionId: 1,
        question: "When did Rizal die?",
        image: "",
        subject: "history",
        date: "7-5-2021",
        lastEdited: "",
        rewardPoints: 5,
        askerId: 1,
        username: "merck123"
    },
    {
        questionId: 2,
        question: "What is a computer?",
        image: "",
        subject: "computer_science",
        date: "7-5-2021",
        lastEdited: "",
        rewardPoints: 15,
        askerId: 1,
        username: "merck123"
    },
    {
        questionId: 3,
        question: "What is internet?",
        image: "",
        subject: "computer_science",
        date: "7-6-2021",
        lastEdited: "",
        rewardPoints: 23,
        askerId: 1,
        username: "merck123"
    },
    {
        questionId: 4,
        question: "What is a network?",
        image: "",
        subject: "computer_science",
        date: "7-6-2021",
        lastEdited: "",
        rewardPoints: 23,
        askerId: 1,
        username: "merck123"
    },
    {
        questionId: 5,
        question: "How to sort an array?",
        image: "",
        subject: "computer_science",
        date: "7-6-2021",
        lastEdited: "",
        rewardPoints: 12,
        askerId: 1,
        username: "merck123"
    },
    {
        questionId: 6,
        question: "How to sort an array?",
        image: "",
        subject: "computer_science",
        date: "7-6-2021",
        lastEdited: "",
        rewardPoints: 4,
        askerId: 1,
        username: "merck123"
    },
    {
        questionId: 7,
        question: "How to remove an element in a list?",
        image: "",
        subject: "computer_science",
        date: "7-6-2021",
        lastEdited: "",
        rewardPoints: 12,
        askerId: 1,
        username: "merck123"
    },
]

let repository = {
    // GETS ALL QUESTIONS
    getAllQuestions: () => {
        return new Promise((fulfill,reject) => {
            try{
                fulfill(questions)
            }
            catch{
                reject(new Error("Error retrieving questions."))
            }
        })

    },

    // GET ALL QUESTIONS THAT MATCH THE SUBJECT
    getQuestionsBySubject: (subject) => {
        return new Promise((fulfill, reject) => {
            try{
                let questionsBySubject = []
                    for(let i = 0; i < questions.length; i++){
                    if(questions[i].subject === subject){
                        questionsBySubject.push(questions[i])
                    }
                }
                fulfill(questionsBySubject)
            }
            catch{
                reject(new Error("Error retrieving questions."))
            }
        })        
    },

    // ADDS A SINGLE QUESTION
    addQuestion: (question) => {
        return new Promise((fulfill, reject) => {
            try{
                questionCtr++
                question.questionId = questionCtr
                questions.push(question)
                fulfill(question)
                console.log(questions);
            }
            catch{
                reject(new Error("Question not successfully added."))
            }
        })
    },

    // GETS A SINGLE QUESTION BASED ON ID
    getQuestion : (questionId) => {
        return new Promise((fulfill, reject) => {
            const index = questions.map((question) => question.questionId).indexOf(questionId);
            // if found
            if(index > -1){
                fulfill(questions[index])
            }
            // if not found
            else{
                reject(new Error("Error loading the question."))
            }
        })
    },

    // EDITS A SINGLE QUESTION BASED ON ID
    editQuestion: (questionId, newQuestion) => {
        return new Promise((fulfill, reject) => {
            const index = questions.map((question) => question.questionId).indexOf(questionId);

            // if found
            if(index > -1){
                //get date today
                const dateObj = new Date()
                const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
                questions[index].question = newQuestion
                questions[index].lastEdited = date
                fulfill(questions[index])
            }
            // if NOT found
            else{
                reject(new Error("Cannot edit the question."))
            }
        })
    },

    // CHECK IF QUESTION ID and ASKER ID match
    isQuestionIdAndAskerIdMatch : (questionId, askerId) => {
        return new Promise((fulfill, reject) => {
            const index = questions.map((question) => question.questionId).indexOf(questionId);
            // if found
            if(index > -1){
                const storedAskerId = questions[index].askerId
                if(storedAskerId === askerId){
                    fulfill()
                }
                else{
                    reject(new Error("User does not own the question."))
                }
            }
            else{
                reject(new Error("Question not found."))
            }
            
        })       
    },

    // DELETES a question
    deleteQuestion : (questionId) => {
        console.log("questions: deleteQuestion");
        return new Promise((fulfill, reject) => {
            console.log(questionId);
            console.log(questions);
            const index = questions.map((question) => question.questionId).indexOf(questionId)
            console.log("index: " + index);
            // if NOT found
            if(index === -1){
                reject(new Error("Unable to delete the question."))
                return
            }
            
            try{
                const question = questions.splice(index,1)
                console.log(questions);
                fulfill(question)
            }
            catch{
                reject()
            }
        })
    },

    // GET all QUESTIONS of a specific user
    getQuestionsByUser : (userId) => {
        return new Promise((fulfill, reject) => {
            try{
                let retrievedQuestions = {}
                const keys = Object.keys(questions)

                for(let i = 0; i < keys.length; i++){
                    let key = keys[i]
                    if(questions[key].askerId === userId){
                        retrievedQuestions[key] = questions[key]
                    }
                }
                fulfill(retrievedQuestions)
            }
            catch{
                reject(new Error("Cannot retrieve questions by this user."))
            }
        })
    }

}

module.exports = repository