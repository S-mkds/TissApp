"use strict";
const { Model } = require("sequelize");

// Hash et regex du mot de passe
const {
  ensurePasswordIsStrongEnough,
  addHashOn,
} = require("../services/hashPassword");

const { deleteFile } = require("../services/file-removal");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: "userId" });
    }

    softDestroy() {
      return this.update({
        deleted: true,
        email: `deleted-user${this.id}@tissapp.com`,
        imageUrl: null,
        firstName: "Utilisateur",
        lastName: "Supprimé",
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
          // Afficher un message d'erreur
          async ensureEmailIsUnique(email) {
            if (await User.findOne({ where: { email } }))
              throw new Error(
                "Un compte existe déjà avec cette adresse mail !"
              );
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          ensurePasswordIsStrongEnough,
        },
      },
      imageUrl: DataTypes.STRING,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  addHashOn(User);

  User.afterUpdate(async (user) => {
    if (user.dataValues.imageUrl !== user._previousDataValues.imageUrl) {
      await deleteFile(user._previousDataValues.imageUrl);
    }
  });

  return User;
};
