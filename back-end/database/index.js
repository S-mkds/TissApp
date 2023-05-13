"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const modelsDir = path.join(__dirname, "..", "models");

fs.readdirSync(modelsDir)
  .filter((file) => {
    const filePath = path.resolve(modelsDir, file);
    const relPath = path.relative(modelsDir, filePath);
    return (
      relPath.slice(0, 2) !== ".." &&
      file !== basename &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(modelsDir, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connexion à la base de données établie avec succès. ->" +
        " Host:" +
        config.host +
        " Port:" +
        config.port +
        " Database:" +
        config.database +
        " Username:" +
        config.username +
        " Password:" +
        config.password +
        " -> OK ✅"
    );
  })
  .catch((err) => {
    console.error(
      "❌ Impossible de se connecter à la base de données : vérifier le port disponnible :" +
        config.port +
        " ou le host disponnible :" +
        config.host +
        " ou les identifiants de connexion à la base de données votre fichier config.json",
      err,
      "Erreur lors de la connexion ❌ vérifer le port/host disponnible, ou les identifiants de connexion à la base de données votre fichier config.json"
    );
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
