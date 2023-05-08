const db = require('../database');
const { Notification } = db.sequelize.models;

exports.getNotificationsOfOneUser = (req, res, next) => {
  const options = {
    where: { recipientUserId: req.user.id },
    include: [{ model: db.User, as: 'Sender' }],
    order: [['createdAt', 'DESC']],
  };

  Notification.findAll(options)
    .then((notifications) => {
      res.status(200).json({ notifications });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.deleteNotification = (req, res, next) => {
  Notification.findOne({
    where: { id: req.params.id, recipientUserId: req.user.id },
  })
    .then((notification) => {
      if (!notification) {
        res.status(400).json({ error: "Vous n'avez pas l'autorisation" });
      }
      notification
        .destroy()
        .then(() =>
          res.status(200).json({ message: 'Notification supprimée !' })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
