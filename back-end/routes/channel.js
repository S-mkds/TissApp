const express = require("express");
const router = express.Router();
const chanelCtrl = require("../controllers/chanel");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/create-chanel", auth, multer, chanelCtrl.createChanel);
router.get("/chanels", auth, chanelCtrl.getChanels);
router.get("/chanels/:id", auth, chanelCtrl.getOneChanel);
router.put("/edit-chanel/:id", auth, multer, chanelCtrl.modifyChanel);
router.delete("/chanels/:id", auth, chanelCtrl.deleteChanel);

module.exports = router;
