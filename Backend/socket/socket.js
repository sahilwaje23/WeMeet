const supabase = require("../config/supabase");

const roomTimers = {};

const rooms = {};

const whiteboards = {};

const roomCodes = {};

const defaultCode = `#include <bits/stdc++.h>

using namespace std;

int main() {

    cout << "Hello WeMeet";

    return 0;
}`;

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Actaully connected:", socket.id);

    // join room

    socket.on("join-room", async ({ roomId, name }) => {
      socket.data.name = name;
      //meeting timer

      // initializings timers for the rooms
      if (!roomTimers[roomId]) {
        roomTimers[roomId] = Date.now();
      }
      socket.join(roomId);

      console.log(`${socket.id} joined room ${roomId}`);

      // initializing rooms
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      rooms[roomId].push({
        id: socket.id,
        name,
        muted: false,
        cameraOff: false,
      });

      // notify others

      socket.to(roomId).emit("user-joined", {
        socketId: socket.id,
      });

      // const room = io.sockets.adapter.rooms.get(roomId);

      // // const participants = room ? Array.from(room) : [];
      // const participants = room
      //   ? Array.from(room).map((id) => {
      //       const client = io.sockets.sockets.get(id);

      //       return {
      //         id,
      //         name: client?.data?.name || "Anonymous",
      //       };
      //     })
      //   : [];

      // io.to(roomId).emit("participants", participants);

      io.to(roomId).emit("participants", rooms[roomId]);

      socket.emit("room-start-time", roomTimers[roomId]);

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      // send chat history to new user or when he refreshes the page
      socket.emit("chat-history", data);

      // send whiteboard updates to the new user or when he refreshes the page
      socket.emit("whiteboard-history", whiteboards[roomId] || []);
    });

    // offer

    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", {
        offer,

        sender: socket.id,
      });
    });

    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", {
        answer,

        sender: socket.id,
      });
    });

    // ice candidate

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", {
        candidate,

        sender: socket.id,
      });
    });

    // socket.on("mic-status", ({ roomId, muted }) => {
    //   socket.to(roomId).emit("mic-status", {
    //     muted,
    //   });
    // });

    // socket.on("mic-status", ({ roomId, muted }) => {
    //   const room = rooms[roomId];

    //   const user = room.find((u) => u.id === socket.id);

    //   if (user) {
    //     user.muted = muted;
    //   }

    //   io.to(roomId).emit("participants", rooms[roomId]);

    //   socket.to(roomId).emit("mic-status", {
    //     userId: socket.id,
    //     muted,
    //   });
    // });

    socket.on("mic-status", ({ roomId, muted }) => {
      const room = rooms[roomId];

      if (!room) return;

      const user = room.find((u) => u.id === socket.id);

      if (!user) return;

      user.muted = muted;

      io.to(roomId).emit("participants", room);
    });

    // disconnect

    // socket.on("disconnect",()=>{

    //   console.log("User disconnected:", socket.id);

    //   socket.broadcast.emit("user-left");

    // });

    // socket.on("disconnect", () => {
    //   console.log("User disconnected:", socket.id);

    //   socket.broadcast.emit("user-left", {
    //     socketId: socket.id,
    //   });
    // });

    // socket.on("disconnect", () => {
    //   console.log("User disconnected:", socket.id);

    //   for (const roomId in rooms) {
    //     rooms[roomId] = rooms[roomId].filter((u) => u.id !== socket.id);

    //     io.to(roomId).emit("participants", rooms[roomId]);

    //     socket.to(roomId).emit("user-left", {
    //       socketId: socket.id,
    //     });
    //   }
    // });

    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter((u) => u.id !== socket.id);

        io.to(roomId).emit("participants", rooms[roomId]);

        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }
      }
    });

    // socket.on("send-message", ({ roomId, message, sender }) => {
    //   io.to(roomId).emit("receive-message", {
    //     sender,
    //     message,
    //     time: new Date().toLocaleTimeString(),
    //   });
    // });

    socket.on("send-message", async ({ roomId, sender, message }) => {
      await supabase.from("messages").insert([
        {
          room_id: roomId,
          sender,
          message,
        },
      ]);

      io.to(roomId).emit("receive-message", {
        sender,
        message,
        time: new Date().toLocaleTimeString(),
      });
    });

    socket.on("send-file", ({ roomId, sender, fileName, fileUrl }) => {
      io.to(roomId).emit("receive-file", {
        sender,
        fileName,
        fileUrl,
        time: new Date().toLocaleTimeString(),
      });
    });

    //WHITEBOARD EVENTS
    socket.on("draw", async (data) => {
      // initializing the whiteboards for individual rooms

      if (!whiteboards[data.roomId]) {
        whiteboards[data.roomId] = [];
      }

      // store whiteboard in backend
      whiteboards[data.roomId].push(data);

      //store whiteboard in supabase database
      await supabase.from("whiteboard_strokes").insert({
        room_id: data.roomId,

        x0: data.x0,
        y0: data.y0,

        x1: data.x1,
        y1: data.y1,

        color: data.color,

        brush_size: data.brushSize,

        is_erasing: data.isErasing,
      });

      // socket.to(data.roomId).emit("draw", data);

      socket.to(data.roomId).emit("draw", data);
    });

    socket.on("draw-start", (data) => {
      socket.to(data.roomId).emit("draw-start", data);
    });
    socket.on("draw-end", (data) => {
      socket.to(data.roomId).emit("draw-end", data);
    });

    // WHITEBOARD SYNC EVENT

    socket.on("get-whiteboard-history", async (roomId) => {
      // Check cache first
      if (whiteboards[roomId]) {
        console.log("Serving whiteboard from cache");

        socket.emit("whiteboard-history", whiteboards[roomId]);

        return;
      }

      console.log("Serving whiteboard from database");

      const { data, error } = await supabase
        .from("whiteboard_strokes")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at");

      if (error) {
        console.error(error);
        return;
      }

      const strokes = data.map((stroke) => ({
        roomId: stroke.room_id,

        x0: stroke.x0,
        y0: stroke.y0,

        x1: stroke.x1,
        y1: stroke.y1,

        color: stroke.color,

        brushSize: stroke.brush_size,

        isErasing: stroke.is_erasing,
      }));

      // Save in memory cache
      whiteboards[roomId] = strokes;

      socket.emit("whiteboard-history", strokes);
    });

    socket.on("clear-board", async (roomId) => {
      whiteboards[roomId] = [];

      const { error } = await supabase
        .from("whiteboard_strokes")
        .delete()
        .eq("room_id", roomId);

      if (error) {
        console.error(error);
      }

      io.to(roomId).emit("clear-board");
    });

    //CODE EDITOR EVENTS

//     socket.on("code-change", async(data) => {
//       // roomCodes[data.roomId] = data.code;
//     roomCodes[data.roomId] = {
//   language: data.language,
//   code: data.code,
// };

//       await supabase.from("room_codes").upsert({

//         room_id:data.roomId,
//         code:data.code,
//         language:data.language,
//       });

//       socket.to(data.roomId).emit("code-change", {
//         code: data.code,
//       });
//     });

socket.on("code-change", async (data) => {

  roomCodes[data.roomId] = {
    language: data.language,
    code: data.code,
  };

  await supabase
    .from("room_codes")
    .upsert({
      room_id: data.roomId,
      language: data.language,
      code: data.code,
    });

  socket.to(data.roomId).emit("code-change", {
    code: data.code,
  });

});

socket.on("get-code", async (roomId) => {

  if (roomCodes[roomId]) {
    socket.emit(
      "code-history",
      roomCodes[roomId]
    );

    return;
  }

  const { data, error } = await supabase
    .from("room_codes")
    .select("*")
    .eq("room_id", roomId)
    .single();

  if (error || !data) {

    socket.emit(
      "code-history",
      {
        language: "cpp",
        code: "",
      }
    );

    return;
  }

  roomCodes[roomId] = {
    language: data.language,
    code: data.code,
  };

  socket.emit(
    "code-history",
    roomCodes[roomId]
  );

});


    // socket.on("get-code",async (roomId) => {

    //   if(roomCodes[roomId]){
    //     socket.emit("code-history", roomCodes[roomId] || defaultCode);
        
    //   }

    //   const {data,error}= await supabase.from("room_codes").select("*").eq("room_id",roomId).single();


    //   if(error || !data){
    //     socket.emit("code-history",defaultCode);
    //     return;
    //   }


    //   roomCodes[roomId]=data.code;

    //   // socket.emit("code-history", data.code);

    //   socket.emit("code-history",{
    //     language:data.language,
    //     code:data.code
    //   })

    // });

//     socket.on("get-code", async (roomId) => {

//   if (roomCodes[roomId]) {

//     socket.emit(
//       "code-history",
//       roomCodes[roomId]
//     );

//     return;
//   }

//   const { data, error } = await supabase
//     .from("room_codes")
//     .select("*")
//     .eq("room_id", roomId)
//     .single();

//   if (error || !data) {

//     socket.emit(
//       "code-history",
//       {
//         language: "cpp",
//         code: "",
//       }
//     );

//     return;
//   }

//   roomCodes[roomId] = {
//     language: data.language,
//     code: data.code,
//   };

//   socket.emit(
//     "code-history",
//     roomCodes[roomId]
//   );

// });

    // socket.on("language-change", async(data)=>{

    //   roomCodes[data.roomId]={
    //     language:data.language,
    //     code:data.code,
    //   }

    //   await supabase.from("room_codes").upsert({
    //     room_id:data.roomId,
    //     language:data.language,
    //     code:data.code
    //   })

    //   socket.to(data.roomId).emit("language-change",data);


    // })

    socket.on("language-change", async (data) => {

  roomCodes[data.roomId] = {
    language: data.language,
    code: data.code,
  };

  await supabase
    .from("room_codes")
    .upsert({
      room_id: data.roomId,
      language: data.language,
      code: data.code,
    });

  socket.to(data.roomId).emit(
    "language-change",
    data
  );

});


    // socket boundary
  });

  // socket.on("draw-end", () => {
  //   const ctx = canvasRef.current.getContext("2d");

  //   ctx.beginPath();
  // });
};

module.exports = socketHandler;
