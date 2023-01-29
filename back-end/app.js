const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
io.on('connection', socket => console.log('user connected socket io')); 
module.exports = io;

const path = require('path');
const auth = require('./middleware/auth');

const userCtrl = require('./controllers/user');
const notificationsCtrl = require('./controllers/notifications');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

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
app.get('/api/users', auth, userCtrl.getAllUsers); // avec authentification et methode search // sans authentification TEST 
app.get('/api/usersAll', userCtrl.FindAllUsers); // sans authentification // mettre authentification plus tard
app.delete('/api/users/:id', auth, userCtrl.deleteUserAccount);

app.get('/api/notifications',auth,notificationsCtrl.getNotificationsOfOneUser);
app.delete('/api/notifications/:id',auth,notificationsCtrl.deleteNotification);

http.listen(3100, () => {
  console.log('Serveur en route sur le port:', 3100);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Port 3000 is already in use, please select a different port.');
  } else {
    console.log(`An error occurred: ${err}`);
  }
});