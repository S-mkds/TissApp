const db = require("../database");
const { InstantPost } = db.sequelize.models;
const moment = require("moment");
const { deleteFile } = require("../services/file-removal");

exports.createInstantPost = async (req, res, next) => {
  let postObject = req.body;
  if (req.file) {
    postObject = JSON.parse(req.body.post);
    postObject.imageUrl = `${req.protocol}://${req.get("host")}/public/${
      req.file.filename
    }`;
  }
  const { recipientId } = req.body; // Assurez-vous d'avoir le recipientId dans req.body
  const instantPost = new InstantPost({
    ...postObject,
    userId: req.user.id,
    recipientId: recipientId, // Utilisez l'ID du destinataire fourni
  });
  try {
    await instantPost.save();
    const msgSocket = {
      id: instantPost.id,
      userId: instantPost.userId,
      content: instantPost.content,
      createdAt: instantPost.createdAt,
      updatedAt: instantPost.updatedAt,
      imageUrl: instantPost.imageUrl,
      userImageUrl: instantPost.User.imageUrl,
      userFirstName: instantPost.User.firstName,
      userLastName: instantPost.User.lastName,
    };
    io.emit("socketInstantPost", msgSocket);
    res.status(201).json({ instantPost });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.getInstantPosts = (req, res, next) => {
  const limit = 500;
  const { userId, recipientId } = req.query;

  // Vérification des paramètres obligatoires
  if (!userId || !recipientId) {
    return res.status(400).json({
      error: "Les paramètres userId et recipientId sont obligatoires.",
    });
  }

  InstantPost.findAll({
    where: {
      $or: [
        { userId: parseInt(userId), recipientId: parseInt(recipientId) },
        { userId: parseInt(recipientId), recipientId: parseInt(userId) },
      ],
    },
    include: [db.User],
    limit,
    order: [["createdAt", "DESC"]],
  })
    .then((posts) => res.status(200).json({ posts }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyInstantPost = (req, res, next) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get("host")}/public/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  InstantPost.findOne({
    where: { id: req.params.id },
    include: [db.User],
  })
    .then((post) => {
      if (!post) {
        res.status(400).json({ error: "Post introuvable" });
      } else {
        post
          .update(postObject)
          .then((updatedPost) => res.status(200).json({ post: updatedPost }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteInstantPost = (req, res, next) => {
  InstantPost.findOne({ where: { id: req.params.id } })
    .then(async (post) => {
      if (!post) {
        res.status(400).json({ error: "Post introuvable" });
      } else {
        if (post.imageUrl) {
          await deleteFile(post.imageUrl);
        }
        post
          .destroy()
          .then(() => res.status(200).json({ message: "Post supprimé" }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
