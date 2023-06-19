const { login } = require("../controllers/user");

describe("Login Controller", () => {
  it("devrait renvoyer un jeton d'authentification valide et un statut 201 si les informations d'identification sont valides", async () => {
    // Prépare une requête avec des données de connexion valides
    const req = {
      body: {
        email: "john.doe@example.com",
        password: "Password123!",
      },
    };

    // Prépare une réponse simulée pour vérifier les résultats
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Appelle le contrôleur login avec les données de requête simulées
    await login(req, res, jest.fn());

    // Vérifie si la réponse a le statut attendu (201) et contient un jeton
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: expect.any(String) })
    );
  });

  it("devrait renvoyer une erreur si un champ requis est manquant", async () => {
    // Prépare une requête avec des données de connexion invalides
    const req = {
      body: {
        email: "john.doe@example.com",
        password: "InvalidPassword123!",
      },
    };

    // Prépare une réponse simulée pour vérifier les résultats
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Appelle le contrôleur login avec les données de requête simulées
    await login(req, res, jest.fn());

    // Vérifie si la réponse a le statut attendu (401) et contient un message d'erreur approprié
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });
});
