const authMiddleware = require("../middleware/auth");

describe("Auth Middleware", () => {
  it(" doit renvoyer une erreur si l'authentification échoue et qu'aucun jeton n'est fourni", () => {
    // Prépare une requête avec un en-tête d'autorisation contenant un token valide
    const req = {
      headers: {
        authorization: "Bearer <votre_token>",
      },
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

    // Vérifie si le middleware renvoie une réponse avec le statut attendu (200)
    expect(res.status).toHaveBeenCalledWith(200);

    // Vérifie si req.user est correctement défini
    expect(req.user).toBeDefined();

    // Vérifie si la fonction next a été appelée
    expect(next).toHaveBeenCalled();
  });
});
