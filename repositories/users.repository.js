let userId = 4
let users = {
    1: {
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
    2: {
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
    3: {
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
    4: {
        username: "lyzer0101",
        password: "xdmap123",
        email: "rezyl1116@gmail.com",
        birthday: "31-1-2001",
        profilePicture: "",
        currentPoints: 257,
        level: "College",
        answersCtr: 12,
        thanksCtr: 0,
    },
}



const repository = {
    // checks if email is already used
    isEmailAvailable: (email) => {
        return new Promise((fulfill, reject) => {
            const keys = Object.keys(users)
            keys.forEach((user) => {
                if(users[user].email == email){
                    reject()
                    return
                }
            })
            fulfill()
        })
    },

    isUsernameAvailable: (username) => {
        return new Promise((fulfill, reject) => {
            const keys = Object.keys(users)
            keys.forEach((user) => {
                // console.log(user + " " + username);
                if(users[user].username == username){
                    reject()
                    return
                }
            })
            fulfill()
        })
    },

    // adds a user to the users object
    addUser: (newUser) => {
        userId++
        users[userId] = newUser
        console.log(users);
        return userId
    },

    //checks if login credentials are registered
    login: (usernameOrEmail, password) => {
        return new Promise((fulfill, reject) => {
            const keys = Object.keys(users)
            let isRegistered = false

            // check if user is registered
            for(let i = 0; i < keys.length; i++){
                if(users[keys[i]].username === usernameOrEmail || users[keys[i]].email === usernameOrEmail){
                    if(users[keys[i]].password === password){
                        isRegistered = true
                        break
                    }
                }
            }

            if(isRegistered){
                fulfill()
            }
            else{
                reject()
            }
        })
    }
}

module.exports = repository