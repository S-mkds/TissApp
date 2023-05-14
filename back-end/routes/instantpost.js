const express = require("express");
const router = express.Router();
const instantpostCtrl = require("../controllers/instantpost");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, instantpostCtrl.createInstantPost);
router.get(
  "/instantposts/:userId/:recipientId",
  auth,
  instantpostCtrl.getInstantPosts
); // Utilisation de "/instantposts/:id" pour la requête GET
router.put("/instantpost/:id", auth, multer, instantpostCtrl.modifyInstantPost);
router.delete("/instantpost/:id", auth, instantpostCtrl.deleteInstantPost);

module.exports = router;
