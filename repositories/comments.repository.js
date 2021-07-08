let commentsCtr = 0
let comments = {
    1: {
        userId: 1,
        questionId: 1,
        answerId: null,
        comment: "How are we suppose to answer that?"
    },
    2: {
        userId: 2,
        questionId: 1,
        answerId: null,
        comment: "Same question bro..."
    },
    3: {
        userId: 3,
        questionId: 1,
        answerId: null,
        comment: "Ewan ko ba tol"
    },
    4: {
        userId: 1,
        questionId: 7,
        answerId: null,
        comment: "Im confuuuseddd."
    },
    5: {
        userId: 4,
        questionId: 7,
        answerId: null,
        comment: "I can give you a hint."
    },
    6: {
        userId: 1,
        questionId: null,
        answerId: 2,
        comment: "Nice answer"
    },
    7: {
        userId: 1,
        questionId: null,
        answerId: 2,
        comment: "How did you do that?"
    },
    8: {
        userId: 1,
        questionId: 2,
        answerId: null,
        comment: "That is so cool bro."
    },
}

const repository = {
    // GET ALL COMMENTS given a questionId or answerId
    getAllComments : (questionId, answerId) => {
        console.log(answerId);
        return new Promise((fulfill,reject) => {
            if(questionId && answerId){
                reject('Comment can\'t have both questionId and answerId')
            }
            else{
                try{
                    let retrievedComments = {}
                    let findId = questionId? questionId : answerId
    
                    // find comments with same findId and add it to retrievedComments
                    const keys = Object.keys(comments)
                    for(let i = 0; i < keys.length; i++){
                        let key = keys[i]
                        // console.log(comments[key]);
                        if(questionId && comments[key].questionId === findId){
                            retrievedComments[key] = comments[key]
                        }
                        else if(answerId && comments[key].answerId === findId){
                            retrievedComments[key] = comments[key]
                        }
                        console.log(key)
                        console.log(retrievedComments[key]);
                    }
                    console.log(retrievedComments);
                    fulfill(retrievedComments)
                }
                catch{
                    reject("Error retrieving comments.")
                }
            }
        })
    }
}

module.exports = repository