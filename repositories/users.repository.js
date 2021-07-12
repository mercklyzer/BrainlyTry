let userId = 4
let users = [
    {
        userId: 1, 
        username: "merck123",
        password: "12345",
        email: "merck123@gmail.com",
        birthday: "12-12-1999",
        profilePicture: "",
        currentPoints: 90,
        level: "Senior High",
        answersCtr: 0,
        thanksCtr: 0,
    },
    {
        userId: 2,
        username: "lababa11",
        password: "12345",
        email: "lalabbaa@gmail.com",
        birthday: "12-1-1999",
        profilePicture: "",
        currentPoints: 40,
        level: "College",
        answersCtr: 0,
        thanksCtr: 0,
    },
    {
        userId: 3,
        username: "lyzer0101",
        password: "xdmap123",
        email: "rezyl1116@gmail.com",
        birthday: "1-1-1979",
        profilePicture: "",
        currentPoints: 857,
        level: "College",
        answersCtr: 32,
        thanksCtr: 0,
    },
    {
        userId: 4,
        username: "nani0101",
        password: "xdmap123",
        email: "nani@gmail.com",
        birthday: "31-1-2001",
        profilePicture: "",
        currentPoints: 257,
        level: "College",
        answersCtr: 12,
        thanksCtr: 0,
    },
]

const repository = {
    // checks if email is already used
    isEmailAvailable: (email) => {
        return new Promise((fulfill, reject) => {
            for(let i = 0; i < users.length; i++){
                console.log(users[i].email +" " + email);
                if(users[i].email === email){
                    reject(new Error('Email is already taken.'))
                    return
                }
            }
            fulfill()
        })
    },

    isUsernameAvailable: (username) => {
        return new Promise((fulfill, reject) => {
            for(let i = 0; i < users.length; i++){
                if(users[i].username === username){
                    reject(new Error('Username is already taken.'))
                    return
                }
            }
            fulfill()
        })
    },

    // adds a user to the users object
    addUser: (newUser) => {
        return new Promise((fulfill, reject) => {
            try{
                userId++
                newUser.userId = userId
                users.push(newUser)
                console.log(users);
                fulfill(newUser)
            }
            catch{
                reject(new Error('Unsuccessful adding user.'))
            }
        })
        
    },

    // GETS the user based on userId
    getUserByUserId: (userId) => {
        return new Promise((fulfill, reject) => {
            const index = users.map((user) => user.userId).indexOf(userId)
            if(index > -1) {
                fulfill(users[index])
            }
            else{
                reject(new Error('Unable to find user.'))
            }
        })
    },

    // GETS the username based on userId (to be replaced by getUserByUserId to be general)
    getUsername: (userId) => {
        return new Promise((fulfill, reject) => {
            const index = users.map((user) => user.userId).indexOf(userId)
            console.log("index: ", index);
            if(index > -1){
                fulfill(users[index].username)
            }
            else{
                reject(new Error("Cannot get username."))
            }
        })
    },

    // GETS a password of a username
    getPasswordByUsername: (username) => {
        return new Promise((fulfill, reject) => {
            const index = users.map((user) => user.username).indexOf(username)
            // if not found
            if(index === -1){
                reject(new Error("Username is not registered."))
            }
            else{
                fulfill(users[index].password)
            }
        })
    },
    // GETS the password based of an email
    getPasswordByEmail: (email) => {
        return new Promise((fulfill, reject) => {
            const index = users.map((user) => user.email).indexOf(email)
            // if not found
            if(index === -1){
                reject(new Error("Email is not registered."))
            }
            else{
                fulfill(users[index].password)
            }
        })
    },

    updateCurrentPoints : (userId, points) => {
        return new Promise((fulfill, reject) => {
            const index = users.map((user) => user.userId).indexOf(userId)
            // if found
            if(index > -1){
                users[index].currentPoints -= points
                fulfill(users[index])
            }
            else{
                reject("User not found")
            }
        })
    }
}

module.exports = repository