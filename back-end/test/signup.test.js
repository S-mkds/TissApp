// Ce fichier contient des tests unitaires pour le contrôleur signup de l'application.

// Importez votre application Express et votre contrôleur signup
const app = require("../app");
const { signup } = require("../controllers/user");

describe("Signup Controller", () => {
  // Teste le renvoi d'une erreur si un champ requis est manquant
  it("devrait renvoyer une erreur si un champ requis est manquant", async () => {
    // Prépare une requête avec des champs manquants
    const req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        // Missing password field
      },
    };

    // Prépare une réponse simulée pour vérifier les résultats
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Appelle le contrôleur signup avec les données de requête simulées
    await signup(req, res);

    // Vérifie si la réponse a le statut attendu (400) et contient un message d'erreur approprié
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Vous devez fournir tous les champs",
    });
  });

  // Teste le renvoi d'une erreur si l'email est déjà utilisé
  it("devrait renvoyer une erreur si l'email est déjà utilisé", async () => {
    // Prépare une requête avec un email déjà utilisé par un autre utilisateur
    const req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com", // Same email as an existing user
        password: "Password123!",
      },
    };

    // Prépare une réponse simulée pour vérifier les résultats
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Appelle le contrôleur signup avec les données de requête simulées
    await signup(req, res);

    // Vérifie si la réponse a le statut attendu (409) et contient un message d'erreur approprié
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "Email déjà utilisé" });
  });
});
