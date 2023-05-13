"use strict";
const { Model } = require("sequelize");

const moment = require("moment");

const { deleteFile } = require("../services/file-removal");

module.exports = (sequelize, DataTypes) => {
  class InstantPost extends Model {
    static associate(models) {
      InstantPost.belongsTo(models.User, { foreignKey: "userId" });
    }

    readableCreatedAt() {
      return moment(this.createdAt).locale("fr").format("LL");
    }
  }
  InstantPost.init(
    {
      userId: DataTypes.INTEGER,
      recipientId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      likesCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      validate: {
        eitherContentOrImageUrl() {
          if (!this.content && !this.imageUrl) {
            throw new Error("Vous ne pouvez pas créer de publication vide !");
          }
        },
      },
      modelName: "InstantPost",
    }
  );

  InstantPost.afterDestroy(async (post) => {
    if (post.imageUrl) {
      await deleteFile(post.imageUrl);
    }
  });

  InstantPost.afterUpdate(async (post) => {
    if (post.dataValues.imageUrl !== post._previousDataValues.imageUrl) {
      await deleteFile(post._previousDataValues.imageUrl);
    }
  });

  return InstantPost;
};
