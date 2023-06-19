// Ce fichier contient des tests unitaires pour le service de hachage de mot de passe de l'application.
// Cela permet de vérifier que le service fonctionne correctement et renvoie les bonnes réponses en fonction des données fournies.
// Si le service ne fonctionne pas correctement, les tests unitaires doivent échouer.
// Ce test doit nous renvoyer une erreur si le mot de passe n'est pas suffisamment fort.

const bcrypt = require("bcrypt");
const {
  ensurePasswordIsStrongEnough,
  addHashOn,
} = require("../services/hashPassword");

describe("ensurePasswordIsStrongEnough", () => {
  it("doit lancer une erreur si le mot de passe n'est pas suffisamment fort", () => {
    const weakPassword = "password";

    expect(() => {
      ensurePasswordIsStrongEnough(weakPassword);
    }).toThrow(
      "Le mot de passe doit contenir au moins 8 caractères (dont au moins une majuscule, une minuscule, un chiffre, un caractère spécial)."
    );
  });

  it("ne doit pas lancer d'erreur si le mot de passe est suffisamment fort", () => {
    const strongPassword = "StrongPass123!";

    expect(() => {
      ensurePasswordIsStrongEnough(strongPassword);
    }).not.toThrow();
  });
});
