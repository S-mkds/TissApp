'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Likes.belongsTo(models.User, { foreignKey: 'userId' });
      Likes.belongsTo(models.Post, { foreignKey: 'postId' });
    }
  }
  Likes.init(
    {
      postId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Likes',
    }
  );

  Likes.afterCreate(async (like) => {
    const post = await like.getPost();
    await post.update({
      likesCount: post.likesCount + 1,
    });
  });
  Likes.afterDestroy(async (like) => {
    const post = await like.getPost();
    post.update({
      likesCount: post.likesCount - 1,
    });
  });

  Likes.afterCreate(async (like) => {
    const post = await like.getPost();
    const user = await like.getUser();

    if (user.id == post.userId) return;

    const notification = await sequelize.models.Notification.create({
      content: `<b>${user.firstName} ${
        user.lastName
      }</b> a aimé votre publication du ${post.readableCreatedAt()}`,
      recipientUserId: post.userId,
      postId: post.id,
      senderUserId: user.id,
    });
  });

  return Likes;
};
