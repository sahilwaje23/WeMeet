  // importing modules 
  const express = require("express");
  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const supabase= require("./config/supabase");
  const uploadRoutes= require("./routes/upload.js");


  // importing routes
  // const authRoutes = require("./routes/auth.routes");
  // const roomRoutes=require("./routes/room.routes");
  const codeRoutes=require("./routes/codeRoutes");

  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
  // app.use("/api/rooms", roomRoutes);
  // app.use("/api/auth", authRoutes);
  app.use("/api", uploadRoutes);
  app.use("/api/code",codeRoutes);

  app.get("/test-db", async(req,res)=>{
    const {data,error}= await supabase.from("messages").select("*");

    res.json({data,error});
  })

  module.exports = app;