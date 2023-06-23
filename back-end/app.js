const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");

// Create server
const http = require("http").createServer(app);
const port = 3100;

http
  .listen(port, () => {
    console.log("Serveur Node en route sur le port:", port, "✅");
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Le port ${port} est déjà utilisé. Veuillez sélectionner un port différent ❌.`
      );
    } else {
      console.log("Une erreur s'est produite :", err, "❌");
    }
  });

// Socket.io server
const io = require("socket.io")(http);
io.on("connection", (socket) => {
  console.log("user connected socket io ✅");
  socket.on("disconnect", () => {
    console.log("user disconnected socket ❌");
    // si l'utilisateur se déconnecte alors mettre isOnline à false
    socket.broadcast.emit("user disconnected");
  });
});
module.exports = io;

// Sécurité: Helmet aide à sécuriser les applications Express à l'aide de divers en-têtes HTTP.
app.use(helmet());

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Routes logique
const path = require("path");
const userRoutes = require("./routes/user");
const postsRoutes = require("./routes/posts");
const chanelRoutes = require("./routes/channel");
const chanelPostsRoutes = require("./routes/chanelposts");
const instantPostsRoutes = require("./routes/instantpost");
// Route non utilisé
const likeRoute = require("./routes/like");
const commentRoute = require("./routes/comment");

// utilisation des routes logique dans l'application express (app)
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/auth", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/chanel", chanelRoutes);
app.use("/api/chanelPosts", chanelPostsRoutes);
app.use("/api/instantPosts", instantPostsRoutes);
// Non utilisé
app.use("/api/like", likeRoute);
app.use("/api/comment", commentRoute);

// console.trace();
