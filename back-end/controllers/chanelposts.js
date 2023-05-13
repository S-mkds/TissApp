const fs = require("fs");
const db = require("../database");
const { PostsChanel } = db.sequelize.models;
const io = require("../app");

// create a chanel post
exports.createPostChanel = async (req, res, next) => {
  let postObject = req.body;
  if (req.file) {
    postObject = JSON.parse(req.body.post);
    postObject.imageUrl = `${req.protocol}://${req.get("host")}/public/${
      req.file.filename
    }`;
  }
  try {
    let postChanel = await PostsChanel.create({
      ...postObject,
      chanelId: req.query.id, // Utilisez req.query.id pour récupérer l'ID du canal depuis les paramètres de la requête
      userId: req.user.id,
    });

    postChanel = await PostsChanel.findOne({
      where: { id: postChanel.id },
      include: [db.User],
    });

    const msgGroupsSocket = {
      id: postChanel.id,
      userId: postChanel.userId,
      content: postChanel.content,
      createdAt: postChanel.createdAt,
      updatedAt: postChanel.updatedAt,
      imageUrl: postChanel.imageUrl,
      userImageUrl: postChanel.User.imageUrl,
      userFirstName: postChanel.User.firstName,
      userLastName: postChanel.User.lastName,
    };

    io.emit("socketPostChanel", msgGroupsSocket);

    res.status(201).json({ postChanel });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// get all chanels posts by chanel id (route: GET /api/chanels/:chanelId/posts)
exports.getAllPostsChanel = (req, res, next) => {
  const { chanelId } = req.params; // Récupérer l'id du canal depuis les paramètres de la route
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
      chanelId: parseInt(chanelId), // Ajouter la condition chanelId pour filtrer les messages par chanelId
    };
  } else {
    options.where = {
      chanelId: parseInt(chanelId), // Ajouter la condition chanelId pour filtrer les messages par chanelId
    };
  }

  PostsChanel.findAll(options)
    .then((postsChanels) => res.status(200).json({ postsChanels }))
    .catch((error) => res.status(400).json({ error }));
};

// get one chanel post
exports.getOnePostChanel = (req, res, next) => {
  PostsChanel.findOne({ where: { id: req.params.id } })
    .then((postChanel) => res.status(200).json({ postChanel }))
    .catch((error) => res.status(400).json({ error }));
};

// modify a chanel post
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
