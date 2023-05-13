const express = require("express");
const router = express.Router();
const chanelPostsCtrl = require("../controllers/chanelposts");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/post-chanel", auth, multer, chanelPostsCtrl.createPostChanel);
router.get("/get-one-posts-chanel/:id", auth, chanelPostsCtrl.getOnePostChanel);
router.get("/chanels/:chanelId/posts", auth, chanelPostsCtrl.getAllPostsChanel); // route pour afficher tous les posts d'un chanel ciblé avec son id chanel dans l'url (req.params.chanelId)
router.put(
  "/put-all-posts-chanel/:id",
  auth,
  multer,
  chanelPostsCtrl.modifyPostChanel
);
router.delete(
  "/delete-all-posts-chanel/:id",
  auth,
  chanelPostsCtrl.deletePostChanel
);

module.exports = router;
