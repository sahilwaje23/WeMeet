const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
{
   roomId: {
      type: String,
      required: true,
      unique: true,
   },

     createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },

   participants: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
   ],

   isActive: {
      type: Boolean,
      default: true,
   },
},
{
   timestamps: true,
}
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;