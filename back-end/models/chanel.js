"use strict";
const { Model } = require("sequelize");

const moment = require("moment");

const { deleteFile } = require("../services/file-removal");

module.exports = (sequelize, DataTypes) => {
  class Chanel extends Model {
    static associate(models) {
      Chanel.belongsTo(models.User, { foreignKey: "userId" });
      Chanel.hasMany(models.PostsChanel, { foreignKey: "chanelId" });
    }

    readableCreatedAt() {
      return moment(this.createdAt).locale("fr").format("LL");
    }
  }
  Chanel.init(
    {
      title: {
        type: DataTypes.TEXT,
        unique: false,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      validate: {
        eitherTitle() {
          if (!this.title) {
            throw new Error("Vous ne pouvez pas créer de publication vide !");
          }
        },
        titleDoesntExistYet() {
          if (this.title) {
            Chanel.findOne({ where: { title: this.title } }).then((chanel) => {
              if (chanel) {
                throw new Error("Ce nom de chanel existe déjà !");
              }
            });
          }
        },
      },
      modelName: "Chanel",
    }
  );

  Chanel.afterDestroy(async (chanel) => {
    if (chanel.imageUrl) {
      await deleteFile(chanel.imageUrl);
    }
  });

  Chanel.afterUpdate(async (chanel) => {
    if (chanel.dataValues.imageUrl !== chanel._previousDataValues.imageUrl) {
      await deleteFile(chanel._previousDataValues.imageUrl);
    }
  });

  return Chanel;
};
