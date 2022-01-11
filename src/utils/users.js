const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id,username,room})=>{

    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return{
            error: 'username and name are required'
        }
    }

    //check for exiting user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate the user
    if(existingUser){
        return {
            error:'username is already taken!'
        }
    }

    //store the user
    const user = {id,username,room}
    users.push(user)
    return{user}
}

// Remove user
const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)

    if(index!== -1){
        return users.splice(index,1)[0]
    }
}

// Fetch user
const getUser = (id)=>{
    return users.find((user)=> user.id === id)
}

// Fetch room's users
const getUsersInRoom = (room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=> user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
