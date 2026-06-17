const bcrypt = require("bcrypt");

const jwt= require("jsonwebtoken");

const User = require("../models/user.model");

const signupUser = async (req, res) => {

   try {

      
      const { name, email, password } = req.body;

      // validation

      if ( !name || !email || !password) {
         return res.status(400).json({
            message: "All fields are required",
         });
      }

      // check existing user

      const existingUser = await User.findOne({ email });

      if (existingUser) {
         return res.status(400).json({
            message: "User already exists",
         });
      }

      // hash password

      const hashedPassword = await bcrypt.hash(password, 10);

      // create user

      const user = await User.create({
         name,
         email,
         password: hashedPassword,
      });

      return res.status(201).json({
         message: "User created successfully",
         user,
      });

   } catch (error) {

      console.log(error);

      return res.status(500).json({
         message: "Internal server error",
      });
   }
};

const loginUser = async (req, res) => {

   try {

      const { email, password } = req.body;

      // validation

      if (!email || !password) {
         return res.status(400).json({
            message: "All fields are required",
         });
      }

      // check user

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(400).json({
            message: "Invalid credentials",
         });
      }

      // compare password

      const isMatch = await bcrypt.compare(
         password,
         user.password
      );

      if (!isMatch) {
         return res.status(400).json({
            message: "Invalid credentials",
         });
      }

      // generate JWT token

      const token = jwt.sign(
         {
            userId: user._id,
         },
         process.env.JWT_SECRET,
         {
            expiresIn: "7d",
         }
      );

      return res.status(200).json({
         message: "Login successful",
         token,
         user,
      });

   } catch (error) {

      console.log(error);

      return res.status(500).json({
         message: "Internal server error",
      });
   }
};

module.exports = {
   signupUser,
   loginUser,
};