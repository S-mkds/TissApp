const db = require('../database');
const jwt = require('jsonwebtoken');
const { User } = db.sequelize.models;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //récupération du token depuis le header Authorization
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable !';
    } else {
      User.findOne({ where: { id: userId } }).then((user) => {
        req.user = user;
        next();
      });
    }
  } catch (error) {
    res.status(401).json({
      error: new Error('Requête non authentifiée !'),
    });
  }
};
