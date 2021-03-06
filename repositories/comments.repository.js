let commentsCtr = 8
let comments = [
    {
        commentId: 1,
        userId: 1,
        username: "merck123",
        questionId: 1,
        answerId: null,
        comment: "How are we suppose to answer that?",
        date: '7-10-2021',
        lastEdited: ""
    },
    {
        commentId: 2,
        userId: 2,
        username: "lababa11",
        questionId: 1,
        answerId: null,
        comment: "Same question bro...",
        date: '7-10-2021',
        lastEdited: ""
    },
    {
        commentId: 3,
        userId: 3,
        username: "lyzer0101",
        questionId: 1,
        answerId: null,
        comment: "Ewan ko ba tol",
        date: '7-10-2021',
        lastEdited: ""
    },
    {
        commentId: 4,
        userId: 1,
        username: "merck123",
        questionId: 7,
        answerId: null,
        comment: "Im confuuuseddd.",
        date: '7-10-2021',
        lastEdited: ""
    },
    {
        commentId: 5,
        userId: 4,
        username: "nani0101",
        questionId: 7,
        answerId: null,
        comment: "I can give you a hint.",
        date: '7-10-2021'
    },
    {
        commentId: 6,
        userId: 1,
        username: "merck123",
        questionId: null,
        answerId: 2,
        comment: "Nice answer",
        date: '7-10-2021'
    },
    {
        commentId: 7,
        userId: 1,
        username: "merck123",
        questionId: null,
        answerId: 2,
        comment: "How did you do that?",
        date: '7-10-2021',
        lastEdited: ""
    },
    {
        commentId: 8,
        userId: 1,
        username: "merck123",
        questionId: 2,
        answerId: null,
        comment: "That is so cool bro.",
        date: '7-10-2021',
        lastEdited: ""
    },
    {
        commentId: 9,
        userId: 1,
        username: "merck123",
        questionId: 7,
        answerId: null,
        comment: "New comment added.",
        date: '7-10-2021',
        lastEdited: ""
    },
]

const repository = {
    // GET ALL COMMENTS given a questionId or answerId
    getAllComments : (questionId, answerId) => {
        // console.log(answerId);
        return new Promise((fulfill,reject) => {
            if(questionId && answerId){
                reject('Comment can\'t have both questionId and answerId')
            }
            else{
                try{
                    let retrievedComments = []
                    let findId = questionId? questionId : answerId
    
                    // find comments with same findId and add it to retrievedComments
                    for(let i = 0; i < comments.length; i++){
                        if(questionId && comments[i].questionId === findId){
                            retrievedComments.push(comments[i])
                        }
                        else if(answerId && comments[i].answerId === findId){
                            retrievedComments.push(comments[i])
                        }
                    }
                    fulfill(retrievedComments)
                }
                catch{
                    reject(new Error("Error loading the comments for each answer."))
                }
            }
        })
    },

    addComment : (comment) => {
        return new Promise((fulfill, reject) => {
            try{
                commentsCtr++
                comments.commentId = commentsCtr
       
                // save comment
                comments.push(comment)
                console.log(comments);
                fulfill(comment)
            }
            catch{
                reject(new Error("Comment not stored."))
            }
        })
    },
    
    // check if the commentId and parentId(questionId/answerId) match
    // parent variable contains a string ('question' | 'answer')
    isCommentIdAndParentIdMatch: (commentId, parentId, parent) => {
        return new Promise((fulfill, reject) => {
            
            const index = comments.map((comment) => comment.commentId).indexOf(commentId);

            // if found
            if(index > -1){
                // only one of them has value. the other is null
                const storedAnswerId = comments[index].answerId
                const storedQuestionId = comments[index].questionId

                const storedParentId = parent === 'question' ? storedQuestionId : storedAnswerId
                if(storedParentId === parentId){
                    fulfill()
                }
                else{
                    reject(new Error("Comment does not exist."))
                }
            }
            else{
                reject(new Error("Answer/Question not found."))
            }
        })
    },

    // check if the commentId and userId match
    isCommentIdAndUserIdMatch: (commentId, userId) => {
        return new Promise((fulfill, reject) => {
            const index = comments.map((comment) => comment.commentId).indexOf(commentId);
            // if found
            if(index > -1){
                const storedUserId = comments[index].userId
                if(storedUserId === userId){
                    fulfill()
                }
                else{
                    reject(new Error("User does not own the comment."))
                }
            }
            else{
                reject(new Error("Comment not found."))
            }
        })
    },

    // EDITS A COMMENT BASED ON COMMENTID
    editComment: (commentId, newComment) => {
        return new Promise((fulfill, reject) => {
            const index = comments.map((comment) => comment.commentId).indexOf(commentId);

            // if found
            if(index > -1){
                //get date today
                const dateObj = new Date()
                const date = `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
                comments[index].comment = newComment
                comments[index].lastEdited = date
                fulfill(comments[index])
            }
            // if NOT found
            else{
                reject(new Error("Cannot edit the comment."))
            }
        })
    },

    // DELETES a comment
    deleteComment : (commentId) => {
        return new Promise((fulfill, reject) => {
            const index = comments.map((comment) => comment.commentId).indexOf(commentId)

            // if found
            if(index > -1){
                const comment = comments.splice(index,1)
                console.log(comments);
                fulfill(comment)
                
            }
            else{
                reject(new Error("Unable to delete the comment."))
            }
        })
    },
    
}

module.exports = repository