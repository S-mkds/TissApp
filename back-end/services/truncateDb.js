const db = require("../database/index.js");

async function truncateDatabase() {
  try {
    await db.sequelize.sync({ force: true });
    console.log("Base de données tronquée avec succès.");
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la troncature de la base de données.",
      error
    );
  } finally {
    db.sequelize.close();
  }
}

truncateDatabase();

// pour lancer ce script, il faut utiliser la commande suivante:
// node back-end\services\truncateDb.js
