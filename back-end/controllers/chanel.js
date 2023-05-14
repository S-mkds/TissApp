const fs = require("fs");
const db = require("../database");
const { Chanel } = db.sequelize.models;
const sequelize = require("sequelize");

exports.createChanel = async (req, res, next) => {
  try {
    let postObject = req.body;
    if (req.file) {
      postObject = JSON.parse(req.body.post);
      postObject.imageUrl = `${req.protocol}://${req.get("host")}/public/${
        req.file.filename
      }`;
    }
    // Création de l'objet du post avec les données reçues
    const chanel = new Chanel({
      title: postObject.title, // Utilisation d'une chaîne vide si title est vide
      content: postObject.content, // Utilisation d'une chaîne vide si content est vide
      userId: req.user.id,
      imageUrl: postObject.imageUrl, // Utilisation d'une chaîne vide si imageUrl est vide
    });
    if (chanel.title === "") {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    // find on sequelize if title already exists without crashing the server; await is used to wait for the response from the database
    const chanelExist = await Chanel.findOne({
      where: { title: chanel.title },
    });
    if (chanelExist) {
      return res.status(400).json({ error: "Title already exists" });
    }
    // check if title and content are not too long
    if (chanel.title.length > 50) {
      return res.status(400).json({ error: "Title is too long" });
    }
    if (chanel.content.length > 500) {
      return res.status(400).json({ error: "Content is too long" });
    }
    // Sauvegarde de l'objet dans la base de données
    chanel
      .save()
      .then(() => res.status(201).json({ message: "Chanel créé !" }))
      .catch((error) => {
        res.status(400).json({ error });
        console.log(error);
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
};

exports.getChanels = (req, res, next) => {
  Chanel.findAll({
    include: [
      {
        model: db.User,
        attributes: ["firstName", "lastName", "imageUrl"],
      },
    ],
    where: [
      sequelize.where(sequelize.fn("concat", sequelize.col("title")), {
        [sequelize.Op.like]: `%${req.query.search}%`,
      }),
    ],
  })
    .then((chanels) => {
      res.status(200).json({ chanels });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneChanel = (req, res, next) => {
  Chanel.findOne({ where: { id: req.params.id } })
    .then((chanel) => res.status(200).json({ chanel }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyChanel = (req, res, next) => {
  Chanel.findOne({ where: { id: req.params.id } })
    .then((chanel) => {
      try {
        if (chanel.userId.toString() !== req.user.id.toString()) {
          res.status(400).json({ error: "You don't have the authorization" });
        }
        chanel
          .update({ ...req.body })
          .then(() => res.status(200).json({ message: "Chanel updated !" }))
          .catch((error) => res.status(400).json({ error }));
      } catch (error) {
        res.status(400).json({ error });
      }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

exports.deleteChanel = async (req, res, next) => {
  try {
    const chanel = await Chanel.findOne({ where: { id: req.params.id } });
    // if the user is not the creator of the chanel he can't delete it, toString() is used to compare two objects id (req.user.id and chanel.userId) because they are not the same type (one is a string and the other is an integer)
    if (chanel.userId.toString() !== req.user.id.toString()) {
      res.status(400).json({
        error:
          "You don't have authorization to delete this channel" +
          req.user.id.toString() +
          chanel.userId.toString(),
      });
      return;
    }
    await chanel.destroy();
    res.status(200).json({ message: "Channel deleted!" });
  } catch (error) {
    next(error);
  }
};
