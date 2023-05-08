const express = require('express');
const router = express.Router();

const commentsCtrl = require('../controllers/comments');
const auth = require('../middleware/auth');

router.post('/:postId/comments', auth, commentsCtrl.createComment);
router.get('/:postId/comments/:id', auth, commentsCtrl.getOneComment);
router.get('/:postId/comments/', auth, commentsCtrl.getAllComments);
router.put('/:postId/comments/:id', auth, commentsCtrl.modifyComment);
router.delete('/:postId/comments/:id', auth, commentsCtrl.deleteComment);

module.exports = router;
