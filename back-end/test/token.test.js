// Ce fichier contient des tests unitaires pour le middleware d'authentification de l'application.
// Cela permet de vérifier que le middleware fonctionne correctement et renvoie les bonnes réponses en fonction des données fournies.
// Si le middleware ne fonctionne pas correctement, les tests unitaires doivent échouer.
// Ce test doit nous renvoyer une erreur si l'authentification échoue et qu'aucun jeton n'est fourni.

const authMiddleware = require("../middleware/auth");

describe("Auth Middleware", () => {
  it("doit renvoyer une erreur si l'authentification échoue et qu'aucun jeton n'est fourni", () => {
    // Prépare une requête sans en-tête d'autorisation
    const req = {
      headers: {},
    };

    // Prépare un objet de réponse simulé
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Prépare une fonction next simulée
    const next = jest.fn();

    // Appelle le middleware d'authentification avec les données de requête simulées
    authMiddleware(req, res, next);

    // Vérifie si le middleware renvoie une réponse avec le statut attendu (401)
    expect(res.status).toHaveBeenCalledWith(401);

    // Vérifie si la fonction next n'a pas été appelée
    expect(next).not.toHaveBeenCalled();
  });
});
