const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
   createRoom,
   joinRoom
} = require("../controllers/room.controller");

router.post("/create", protect, createRoom);

router.post("/join/:roomId",protect,joinRoom);


module.exports = router;