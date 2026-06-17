// import {useState} from "react";

// import {useNavigate} from "react-router-dom";


// function Home(){

//   const [roomId, setRoomId]= useState("");

//   const navigate= useNavigate();

//   const joinRoom = ()=>{
    
//     if(!roomId) return ;

//     navigate(`/room/${roomId}/lobby`);
//   };


//   return (

//       <div className="h-screen flex items-center justify-center">

//          <div className="flex gap-4">

//             <input
//                type="text"
//                placeholder="Enter Room ID"
//                className="border p-2"
//                value={roomId}
//                onChange={(e) => setRoomId(e.target.value)}
//             />

//             <button
//                onClick={joinRoom}
//                className="bg-black text-white px-4"
//             >
//                Join
//             </button>

//          </div>

//       </div>
//    );

   
// }

// export default Home;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hexagon, Video, Link2, Users, MessageCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

function Home() {
  const [meetingLink, setMeetingLink] = useState("");
  
  const navigate = useNavigate();
  
  // const createInstantMeeting = () => {
    //   const roomId = crypto.randomUUID();
    //   console.log("START MEETING CLICKED");
    
    //   navigate(`/room/${roomId}/lobby`);
    // };
    
    const createInstantMeeting = () => {
      // alert("CLICKED");
      
      // const roomId = crypto.randomUUID();
      const roomId = uuidv4();

  // alert(roomId);

  navigate(`/room/${roomId}/lobby`);
};

  const joinMeeting = () => {
    if (!meetingLink.trim()) return;

    try {
      let roomId = "";

      if (meetingLink.includes("/room/")) {
        roomId = meetingLink.split("/room/")[1].split("/")[0];
      } else {
        roomId = meetingLink.trim();
      }

      if (!roomId) return;

      navigate(`/room/${roomId}/lobby`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}

      <div className="border-b border-[#2A2A2A] h-16 flex items-center px-8 justify-between">
        <div className="flex items-center gap-3">
          <Hexagon className="size-7 text-[#00D4FF]" />
          <div>
            <h1 className="font-bold text-xl">DevSync</h1>
            <p className="text-xs text-white/50">
              Simple meetings for developers
            </p>
          </div>
        </div>
      </div>

      {/* Main */}

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="rounded-3xl border border-[#2A2A2A] bg-[#111111] p-8">
          <div className="mb-8">
            <span className="text-xs bg-[#00D4FF]/20 text-[#00D4FF] px-3 py-1 rounded-full">
              Meeting Access
            </span>

            <h2 className="text-3xl font-bold mt-4">
              Join a meeting or start an instant meeting
            </h2>

            <p className="text-white/60 mt-2">
              Create a meeting in one click or join using a meeting link.
            </p>
          </div>

          {/* Join Existing */}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Join Existing Meeting</h3>

              <span className="text-xs text-white/50">
                Paste meeting link
              </span>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Paste meeting link or room id"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="flex-1 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-3 outline-none focus:border-[#00D4FF]"
              />

              <button
                onClick={joinMeeting}
                className="bg-white text-black font-semibold px-6 rounded-xl hover:opacity-90"
              >
                Join
              </button>
            </div>
          </div>

          {/* Start Instant Meeting */}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Start Instant Meeting</h3>

              <span className="text-xs bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-1 rounded-full">
                New Room
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-5">
              <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-gradient-to-r from-[#00D4FF] to-purple-500 flex items-center justify-center font-bold">
                    DS
                  </div>

                  <div>
                    <p className="font-medium">Ready to start</p>

                    <p className="text-sm text-white/50">
                      Camera and mic can be adjusted later
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-4 flex items-center">
                <p className="text-sm text-white/60">
                  Create a new meeting room and share the link with others.
                </p>
              </div>
            </div>

            <button
              onClick={createInstantMeeting}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00D4FF] to-purple-600 hover:opacity-90"
            >
              Start Instant Meeting
            </button>
          </div>
        </div>

        {/* Features */}

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5">
            <Video className="text-[#00D4FF] mb-3" />
{/* <div className="bg-red-500 text-white p-5">
  TEST
</div> */}
            <h4 className="font-semibold mb-2">Video Calling</h4>

            <p className="text-sm text-white/50">
              Real-time peer-to-peer video meetings.
            </p>
          </div>

          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5">
            <MessageCircle className="text-[#00D4FF] mb-3" />

            <h4 className="font-semibold mb-2">Chat</h4>

            <p className="text-sm text-white/50">
              Exchange messages while attending meetings.
            </p>
          </div>

          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5">
            <Users className="text-[#00D4FF] mb-3" />

            <h4 className="font-semibold mb-2">Collaboration</h4>

            <p className="text-sm text-white/50">
              Share links and invite participants instantly.
            </p>
          </div>
        </div>

        {/* Footer */}

        <div className="mt-8 bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="size-4 text-[#00D4FF]" />

            <span className="font-medium">Meeting Links</span>
          </div>

          <p className="text-sm text-white/50">
            After entering a meeting, use the "Copy Link" button to invite
            others directly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;