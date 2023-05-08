const fs = require("fs");
const db = require("../database");
const { PostsChanel } = db.sequelize.models;

// post a chanel
exports.createPostChanel = async (req, res, next) => {
  try {
    if (req.body.content === "") {
      return res.status(400).json({ error: "You can't post an empty message" });
    }
    // check chanel if exist or not and if user is member of this chanel
    const chanel = await db.Chanel.findOne({
      where: { id: req.body.chanelId },
    }); // check if chanel exist
    if (!chanel) {
      return res
        .status(400)
        .json({ error: "Chanel not found! Channel: " + req.body.chanelId });
    }
    const user = await db.User.findOne({ where: { id: req.user.id } }); // check if user exist
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const postChanel = new PostsChanel({
      ...req.body,
      creatorUserId: req.user.id,
    });
    if (req.file) {
      postChanel.attachment = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }
    await postChanel.save();
    res.status(201).json({
      message: "Post on chanel created ! Chanel: " + req.body.chanelId,
      message: "Postid on chanel created ! postId: " + req.body.id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// get all chanels
exports.getAllPostsChanel = (req, res, next) => {
  PostsChanel.findAll()
    .then((postsChanels) => res.status(200).json({ postsChanels }))
    .catch((error) => res.status(400).json({ error }));
};

// get one chanel
exports.getOnePostChanel = (req, res, next) => {
  PostsChanel.findOne({ where: { id: req.params.id } })
    .then((postChanel) => res.status(200).json({ postChanel }))
    .catch((error) => res.status(400).json({ error }));
};

// modify a chanel
exports.modifyPostChanel = (req, res, next) => {
  PostsChanel.findOne({ where: { id: req.params.id } })
    .then((postChanel) => {
      if (postChanel.creatorUserId !== req.user.id) {
        res.status(400).json({ error: "You don't have the authorization" });
      }
      postChanel
        .update({ ...req.body })
        .then(() => res.status(200).json({ message: "Post updated !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

// delete a chanel
exports.deletePostChanel = (req, res, next) => {
  PostsChanel.findOne({ where: { id: req.params.id } })
    .then((postChanel) => {
      if (postChanel.creatorUserId !== req.user.id) {
        res.status(400).json({ error: "You don't have the authorization" });
      }
      postChanel
        .destroy()
        .then(() => res.status(200).json({ message: "Post deleted !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
