const db = require("../database");
const fs = require("fs");
const { InstantPost } = db.sequelize.models;
const { deleteFile } = require("../services/file-removal");
const { Op } = require("sequelize");
const io = require("../app");

exports.createInstantPost = async (req, res, next) => {
  let postObject = req.body;
  const recipientId = req.query.recipientId; // Utilisez req.query.id pour récupérer l'ID du destinataire depuis les paramètres de la requête
  // console.log(req.query);
  // console.log("params", req.params, "req", req);
  if (req.file) {
    postObject = JSON.parse(req.body.post);
    postObject.imageUrl = `${req.protocol}://${req.get("host")}/public/${
      req.file.filename
    }`;
  }
  try {
    console.log("recipientId", recipientId); // Utilisez le même nom de paramètre ici
    console.log("userId", req.user.id);

    let post = await InstantPost.create({
      ...postObject,
      userId: req.user.id,
      recipientId: recipientId, // Utilisez le même nom de paramètre ici
    });
    console.log("recipientId", recipientId);
    console.log("userId", req.user.id);

    post = await InstantPost.findOne({
      where: { id: post.id },
      include: db.User,
    });
    const msgMpSocket = {
      id: post.id,
      userId: post.userId,
      recipientId: post.recipientId,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      imageUrl: post.imageUrl,
      userImageUrl: post.User.imageUrl,
      userFirstName: post.User.firstName,
      userLastName: post.User.lastName,
    };
    io.emit("socketInstantPost", msgMpSocket);
    // console.log('io emit log here :', msgSocket);
    if (req) {
      // console.log("req", req + "ok" + "post", post);
    }
    res.status(201).json({ post });
    if (res) {
      // console.log("res", res + "ok" + "post", post);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.getInstantPosts = (req, res, next) => {
  const limit = 500;
  const { userId, recipientId } = req.params;
  console.log("recipientId", recipientId);
  console.log("userId", req.user.id);
  // console.log(req.params);

  // Vérification des paramètres obligatoires
  if (!userId || !recipientId) {
    console.log("Paramètres manquants : userId ou recipientId");
    return res.status(400).json({
      error: "Les paramètres userId et recipientId sont obligatoires.",
    });
  }
  InstantPost.findAll({
    // Récupération des messages de l'utilisateur et du destinataire (dans les deux sens) avec les données utilisateur associées (pour afficher les noms et images de profil) et limités à 500 messages
    where: {
      // Op or permet de récupérer les messages de l'utilisateur et du destinataire (dans les deux sens) avec les données utilisateur associées (pour afficher les noms et images de profil)
      [Op.or]: [
        {
          userId: userId,
          recipientId: recipientId,
        },
        {
          userId: recipientId,
          recipientId: userId,
        },
      ],
    },
    include: [db.User],
    limit,
    // Tri par date de création décroissante (du plus récent au plus ancien)
    order: [["createdAt", "DESC"]],
  })
    .then((posts) => {
      // console.log("Messages récupérés :", posts);
      res.status(200).json({ posts });
    })
    .catch((error) => {
      console.log(
        "Erreur lors de la récupération des messages du destinataire :",
        error
      );
      res.status(400).json({ error });
    });
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
  const where = {
    id: req.params.id,
  };

  if (!req.user.admin) {
    where.userId = req.user.id;
  }

  InstantPost.findOne({ where })
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
