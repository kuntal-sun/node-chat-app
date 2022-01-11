const path = require('path')
const express = require('express')
const http= require('http')
const socketio = require('socket.io')
const{generateMessage, generateLocationMessage}=require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))



io.on('connection',(socket)=>{
    console.log('New socket is connected')

    socket.on('join',(options,callback)=>{
        const {error,user} = addUser({id:socket.id, ...options})
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('show-message', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('show-message',generateMessage('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })
    
    socket.on('send-message',(msg,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('show-message',generateMessage(user.username,msg))
        callback()
    
    })

    socket.on('send-location',(position,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('location-message', generateLocationMessage(user.username,`https://maps.google.com?q=${position.lat},${position.long}`))
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('show-message',generateMessage('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })
})

server.listen(port, ()=>{
    console.log('server is on')
})