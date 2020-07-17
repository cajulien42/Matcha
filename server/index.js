const express = require('express');
const debug = require('debug')('socket');
const http = require('http');
const _ = require('lodash');

const SERVER = {
  HOST: 'localhost',
  PORT: 5000,
}

const NOTIFICATION_TYPES = [
  'unlike',
  'unmatch',
  'like',
  'match',
  'visit',
  'message',
  'isOnline',
]

class Server {
  constructor() {
    // Server variables
    this.app = express()
    this.http = http.Server(this.app)

    // Sockets handler
    this.io = require('socket.io')(this.http, { pingTimeout: 60000 * 60 });
    this.socketTable = {}
    this.io.sockets.on('connection', (socket) => {
      socket.on('loginUser', (username) => {
        if (!_.isEmpty(username)) {
          if (_.isEmpty(this.socketTable[username])) {
            Object.assign(this.socketTable, { [username]: [socket.id] })
            debug(' New user connected', this.socketTable);
          } else {
            this.socketTable[username].push(socket.id);
            debug(` New socket for ${username}`, this.socketTable);
          }
        }
        
      })

      socket.on('logoutUser', (username) => {
        this.socketTable[username] = [];
        debug('on logout user disconnected', this.socketTable);
        const result = Object.keys(this.socketTable).map((key) => {
          debug(key);
          if(this.socketTable[key].length) return {username: key, isOnline:true };
          else return {username: key, isOnline:false};
        })
        debug('on logout isOnline', result);
        socket.broadcast.emit('notification', {type: 'isOnline', result });
      })

      socket.on('notification', (notification) => {
        if (notification.type && NOTIFICATION_TYPES.indexOf(notification.type) > -1
        && notification.emitter && notification.receiver) {
          const receiver = notification.receiver;
          if (this.socketTable[receiver] !== undefined
          && this.socketTable[receiver].length && notification.type !== 'isOnline') {
            this.socketTable[receiver].forEach((socketId) => {
              this.io.to(`${socketId}`).emit('notification', {
                data: {
                  type: notification.type,
                  emitter: notification.emitter,
                },
              })
              debug('emitted', {
                type: notification.type,
                emitter: notification.emitter,
                receiver: notification.receiver,
              });
            })
          }
          // const emitter = notification.emitter
          // if (notification.type === 'match' || notification.type === 'unmatch') {
          //   if (this.socketTable[emitter] !== undefined
          //   && this.socketTable[emitter].length) {
          //     this.socketTable[emitter].forEach((socketId) => {
          //       this.io.to(`${socketId}`).emit('notification', {
          //         data: {
          //           type: notification.type,
          //           emitter: notification.receiver,
          //         },
          //       })
          //       debug('emitted', {
          //         type: notification.type,
          //         emitter: notification.receiver,
          //         receiver: notification.emitter,
          //       });
          //     })
          //   }
          // }
        } else if (notification.type === 'isOnline') {
              const result = Object.keys(this.socketTable).map((key) => {
                debug(key);
                if(this.socketTable[key].length) return {username: key, isOnline:true };
                else return {username: key, isOnline:false};
              })
              debug('on isonline , isOnline',result);
            socket.broadcast.emit('notification', {type: 'isOnline', result });
          }
        
      })

      // Handle chat messages
      socket.on('message', (message) => {
        if (message.emitter && message.receiver && message.content) {
          const receiver = message.receiver;
          if (this.socketTable[receiver]
          && this.socketTable[receiver].length) {
            this.socketTable[receiver].forEach((socketId) => {
              this.io.to(`${socketId}`).emit('message', {
                data: {
                  content: message.content,
                  emitter: message.emitter,
                  receiver: message.receiver,
                },
              })
              debug('emitted', {
                type: notification.type,
                emitter: notification.emitter,
                receiver: notification.receiver,
              });
            })
          }
        }
      })

      socket.on('disconnect', () => {
        const key = _.findKey(this.socketTable, socketIds => (
          socketIds.indexOf(socket.id) > -1
        ))
        _.remove(this.socketTable[key], el => el === socket.id)
        debug('on disconnect, user disconnected', this.socketTable);
      })
    })
  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`)
    })
  }
}

new Server().listen()

// const io = require('socket.io');
// const mySocket = io('http://localhost:5000')
// mySocket.emit('loginUser', username)
