const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);

router.put('/edit', auth, multer, userCtrl.editUser);

router.put('/edit-admin/:id', auth, multer, userCtrl.editUserAdmin);


module.exports = router;
