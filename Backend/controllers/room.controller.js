const { nanoid } = require("nanoid");

const Room = require("../models/room.model");

const createRoom = async (req, res) => {

   try {

      const roomId = nanoid(10);

      const room = await Room.create({

         roomId,

         createdBy: req.user.userId,

         participants: [req.user.userId],

      });

      return res.status(201).json({

         message: "Room created successfully",

         room,

      });

   } catch (error) {

      console.log(error);

      return res.status(500).json({

         message: "Internal server error",

      });
   }
};


const joinRoom= async(req,res)=>{

  try{

    const {roomId}= req.params;

    const room = await Room.findOne({roomId});

    
    if(!room){
      return res.status(404).json({
        message:"Room not found",
      });
    }


    // check if already joined


    const alreadyJoined= room.participants.includes(req.user.userId);

    if(!alreadyJoined){
      room.participants.push(req.user.userId);

      await room.save();
    }

    return res.status(200).json({
      message:"Joined room successfully",
      room,
    });
  }

  catch(error){

    console.log(error);

    return res.status(500).json({
      message:"Internal server error",
    });
  }
};

module.exports = {
   createRoom,
   joinRoom,
};