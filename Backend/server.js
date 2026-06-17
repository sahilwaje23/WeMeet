require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const http = require("http");

const {Server}= require("socket.io");

const socketHandler = require("./socket/socket");



mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);


// io.on("connection",(socket)=>{

//   console.log("User connected:", socket.id);

//   socket.on("disconnect",()=>{

//     console.log("User disconnected:",socket.id);

//   })
// })


// server.listen(PORT, () => {
//    console.log(`Server running on ${PORT}`);
// });

server.listen(8000, "0.0.0.0", () => {
  console.log("Server running");
});