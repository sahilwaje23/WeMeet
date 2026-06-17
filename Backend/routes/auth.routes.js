const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const { signupUser ,loginUser} = require("../controllers/auth.controller");

router.post("/signup", signupUser);

router.post("/login",loginUser);

router.get("/me",protect,(req,res)=>{

  res.status(200).json({
    message:"Protected route accessed",
    user:req.user,
  });
});

module.exports = router;