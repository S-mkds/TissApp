const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const instantpostCtrl = require("../controllers/instantpost");

router.post("/", auth, multer, instantpostCtrl.createInstantPost);
router.get(
  "/instantposts/:userId/:recipientId",
  auth,
  instantpostCtrl.getInstantPosts
); // Utilisation de "/instantposts/:id" pour la requête GET
router.put("/instantpost/:id", auth, multer, instantpostCtrl.modifyInstantPost);
router.delete("/instantpost/:id", auth, instantpostCtrl.deleteInstantPost);

module.exports = router;
