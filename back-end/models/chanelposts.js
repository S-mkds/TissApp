"use strict";
const { Model } = require("sequelize");

const moment = require("moment");

const { deleteFile } = require("../services/file-removal");

module.exports = (sequelize, DataTypes) => {
  class PostsChanel extends Model {
    static associate(models) {
      PostsChanel.belongsTo(models.User, { foreignKey: "userId" });
      PostsChanel.belongsTo(models.Chanel, { foreignKey: "chanelId" });
    }

    readableCreatedAt() {
      return moment(this.createdAt).locale("fr").format("LLL");
    }
  }
  PostsChanel.init(
    {
      userId: DataTypes.INTEGER,
      chanelId: DataTypes.INTEGER,
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
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
      modelName: "PostsChanel",
    }
  );

  PostsChanel.afterDestroy(async (post) => {
    if (post.imageUrl) {
      await deleteFile(post.imageUrl);
    }
  });

  PostsChanel.afterUpdate(async (post) => {
    if (post.dataValues.imageUrl !== post._previousDataValues.imageUrl) {
      await deleteFile(post._previousDataValues.imageUrl);
    }
  });

  return PostsChanel;
};
