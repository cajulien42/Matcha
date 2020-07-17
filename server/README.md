**SOCKETS basics:**
```
Prerequisites : 
    const io = require('socket.io');
    const mySocket = io('http://localhost:5000');

Event List :
    loginUser
    logoutUser
    isOnline
    message
    notification -> types : like, match, unlike, visit, message

Usage examples :
    - mySocket.emit('loginUser', philoutre);

    - mySocket.emit('notification', {
        type: 'like',
        emitter: 'philoutre',
        receiver: 'camille',
        });

    - mySocket.emit('logoutUser', philoutre);

    - mySocket.emit('notification', {
		type: 'message',
		emitter: 'philoutre',
		receiver: 'camille',
	});
    mySocket.on('notification', notification => { console.log(notification)});


```

