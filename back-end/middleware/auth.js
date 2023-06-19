const db = require("../database");
const jwt = require("jsonwebtoken");
const { User } = db.sequelize.models;

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récupération du token depuis le header Authorization
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error("User ID non valide !");
    } else {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error("Utilisateur non trouvé !");
      }
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: "Requête non authentifiée !",
    });
  }
};
