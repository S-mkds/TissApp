const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const auth = require('./middleware/auth');
const userCtrl = require('./controllers/user');
const notificationsCtrl = require('./controllers/notifications');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté.');

  socket.on('join', (username) => {
    socket.username = username;
    console.log(`⚡: ${username} a rejoint le chat.`);
    socket.broadcast.emit('userJoined', `${username} a rejoint le chat.`);
  });

  socket.on('sendMessage', (message) => {
    console.log(`${socket.username}: ${message}`);
    socket.broadcast.emit('receiveMessage', { username: socket.username, message });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      console.log(`🔥: ${socket.username} s'est déconnecté.`);
      socket.broadcast.emit('userLeft', `${socket.username} a quitté le chat.`);
      delete socket.username;
    }
  });
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/posts', postsRoutes);
app.use('/api/auth', userRoutes);

app.get('/api/users/:id', auth, userCtrl.getOneUser);
app.get('/api/users', auth, userCtrl.getAllUsers);
app.delete('/api/users/:id?', auth, userCtrl.deleteUserAccount);

app.get(
  '/api/notifications',
  auth,
  notificationsCtrl.getNotificationsOfOneUser
);
app.delete(
  '/api/notifications/:id',
  auth,
  notificationsCtrl.deleteNotification
);

module.exports = server;
