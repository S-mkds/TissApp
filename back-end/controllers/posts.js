const fs = require("fs");
const db = require("../database");
const { Post } = db.sequelize.models;
const io = require("../app");

exports.createPost = async (req, res, next) => {
  let postObject = req.body;
  if (req.file) {
    postObject = JSON.parse(req.body.post);
    postObject.imageUrl = `${req.protocol}://${req.get("host")}/public/${
      req.file.filename
    }`;
  }
  try {
    let post = await Post.create({
      ...postObject,
      userId: req.user.id,
    });
    post = await Post.findOne({
      where: { id: post.id },
      include: db.User,
    });
    const msgSocket = {
      id: post.id,
      userId: post.userId,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      imageUrl: post.imageUrl,
      userImageUrl: post.User.imageUrl,
      userFirstName: post.User.firstName,
      userLastName: post.User.lastName,
    };
    io.emit("socketPost", msgSocket);
    // console.log('io emit log here :', msgSocket);
    res.status(201).json({ post });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: db.User,
      },
    ],
  })
    .then((post) => res.status(200).json({ post }))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllPosts = (req, res, next) => {
  const limit = 500;
  const page = parseInt(req.query.page) || 1;

  const options = {
    include: [
      {
        model: db.User,
      },
    ],
    limit,
    offset: limit * (page - 1),
    order: [["createdAt", "DESC"]],
  };

  if (req.query.userId) {
    options.where = {
      userId: parseInt(req.query.userId),
    };
  }

  Post.findAll(options)
    .then((posts) => res.status(200).json({ posts }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyPost = (req, res, next) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get("host")}/public/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  if (req.user.isAdmin) {
    Post.findOne({
      where: { id: req.params.id },
      include: db.User,
    }).then((post) => {
      if (!post) {
        res.status(400).json({ error: "Post introuvable" });
      } else {
        post.update(postObject).then((post) => res.status(200).json({ post }));
      }
    });
  } else {
    Post.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: db.User,
    }).then((post) => {
      if (!post) {
        res.status(400).json({ error: "Vous n'avez pas l'autorisation" });
      } else {
        post.update(postObject).then((post) => res.status(200).json({ post }));
      }
    });
  }
};

exports.deletePost = (req, res, next) => {
  const where = {
    id: req.params.id,
  };

  if (!req.user.admin) {
    where.userId = req.user.id;
  }

  Post.findOne({ where })
    .then((post) => {
      if (!post) {
        res.status(400).json({ error: "Vous n'avez pas l'autorisation" });
      }
      post
        .destroy()
        .then(() =>
          res.status(200).json({ message: "Publication supprimée !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
