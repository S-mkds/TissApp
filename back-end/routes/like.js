const express = require('express');
const router = express.Router();
const likesCtrl = require('../controllers/likes');
const auth = require('../middleware/auth');

router.post('/:postId/likes', auth, likesCtrl.likeOnePost);
router.get('/:postId/like', auth, likesCtrl.getLikeOnOnePost);
router.get('/:postId/likes', auth, likesCtrl.getAllLikesOfOnePost);

module.exports = router;
