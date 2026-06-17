import {
  Hexagon,
  MessageCircle,
  Mic,
  MicOff,
  PhoneOff,
  VideoOff,
  Users,
  Video,
  Monitor,
  Link2,
  SmilePlus,
} from "lucide-react";

export default function Control({
  isMuted,
  toggleMute,
  cameraOff,
  toggleCamera,
  isSharingScreen,
  shareScreen,
  leaveCall,
  setSidebarOpen,
  setActiveTab,
  messages,
}) {
  return (
    <>
      <div className="flex-shrink-0 bg-[#111111] border-[#2A2A2A] border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-8 justify-around items-center h-20">
        {/* <div className="flex flex-col items-center gap-1">
            <button className="size-12 shadow-[0_0_12px_rgba(0,212,255,0.4)] rounded-full bg-[#1A1A2E] border-[#00D4FF] border-1 border-solid flex justify-center items-center">
              {/* <Mic onClick={toggleMute} className="size-5 text-[#00D4FF]" /> /}

              <button onClick={toggleMute}>
                {isMuted ? (
                  <MicOff className="size-5 text-red-500" />
                ) : (
                  <Mic className="size-5 text-[#00D4FF]" />
                )}
              </button>
            </button>
            <span className="text-white/60 text-[10px]">Mute</span>
          </div> */}

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={toggleMute}
            className={`size-12 rounded-full flex justify-center items-center ${
              !isMuted
                ? "shadow-[0_0_12px_rgba(0,212,255,0.4)] bg-[#1A1A2E] border border-[#00D4FF]"
                : "bg-[#1A1A2E]"
            }`}
          >
            {isMuted ? (
              <MicOff className="size-5 text-red-500" />
            ) : (
              <Mic className="size-5 text-[#00D4FF]" />
            )}
          </button>

          <span className="text-white/60 text-[10px]">
            {isMuted ? "Unmute" : "Mute"}
          </span>
        </div>
        {/* <div className="flex flex-col items-center gap-1">
            <button className="size-12 rounded-full bg-[#1A1A2E] flex justify-center items-center">
              {/* <Video onClick={toggleCamera} className="size-5 text-white/70" /> /}
              <button onClick={toggleCamera}>
                {cameraOff ? (
                  <VideoOff className="size-5 text-red-500" />
                ) : (
                  <Video className="size-5 text-white/70" />
                )}
              </button>
            </button>
            <span className="text-white/60 text-[10px]">Camera</span>
          </div> */}

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={toggleCamera}
            className={`size-12 rounded-full flex justify-center items-center ${
              !cameraOff
                ? "shadow-[0_0_12px_rgba(0,212,255,0.4)] bg-[#1A1A2E] border border-[#00D4FF]"
                : "bg-[#1A1A2E]"
            }`}
          >
            {cameraOff ? (
              <VideoOff className="size-5 text-red-500" />
            ) : (
              <Video className="size-5 text-[#00D4FF]" />
            )}
          </button>

          <span className="text-white/60 text-[10px]">
            {cameraOff ? "Camera Off" : "Camera"}
          </span>
        </div>

        {/* <div className="flex flex-col items-center gap-1">
            <button
              onClick={shareScreen}
              className="size-12 rounded-full bg-[#1A1A2E] flex justify-center items-center"
            >
              <Monitor className="size-5 text-white/70" />
            </button>

            <span className="text-white/60 text-[10px]">Share</span>
          </div> */}

        

        <div
          className="relative flex flex-col items-center gap-1"
          onClick={leaveCall}
        >
          <button className="size-14 shadow-[0_0_20px_rgba(239,68,68,0.5)] rounded-full bg-red-500 flex justify-center items-center">
            <PhoneOff className="size-6 text-white" />
          </button>
          <span className="text-white/60 text-[10px]">End Call</span>
        </div>

        {/* <div className="relative flex flex-col items-center gap-1">
          {/* <button className="size-12 rounded-full bg-[#1A1A2E] flex justify-center items-center">
              <MessageCircle className="size-5 text-white/70" />
            </button> /}

          <button
            // onClick={() => setShowChat(!showChat)}
            onClick={() => {
              setSidebarOpen(true);
              setActiveTab("chat");
            }}
            // className={`size-12 rounded-full flex justify-center items-center ${
            //   showChat
            //     ? "bg-[#00D4FF]/20 border border-[#00D4FF]"
            //     : "bg-[#1A1A2E]"
            // }`}
          >
            <MessageCircle className="size-5 text-white/70" />
          </button>

          <div className="size-4 rounded-full bg-red-500 flex absolute -right-0.5 -top-0.5 justify-center items-center">
            <span className="font-bold text-white text-[9px]">
              {/* 1 /}

              {messages.length}
            </span>
          </div>
          <span className="text-white/60 text-[10px]">Chat</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          {/* <button className="size-12 rounded-full bg-[#1A1A2E] flex justify-center items-center">
              <Users className="size-5 text-white/70" />
            </button> /}

          <button
            // onClick={() => setShowPeople(!showPeople)}
            onClick={() => {
              setSidebarOpen(true);
              setActiveTab("people");
            }}
            //   className={`size-12 rounded-full flex flex-col justify-center items-center transition-all
            //      ${
            //     showPeople
            //       ? "bg-[#00D4FF]/20 border border-[#00D4FF]"
            //       : "bg-[#1A1A2E]"
            //   }`
            // }
          >
            {/* <button
              onClick={() => setShowChat(!showChat)}
              className={`size-12 rounded-full flex justify-center items-center ${
                showChat
                  ? "bg-[#00D4FF]/20 border border-[#00D4FF]"
                  : "bg-[#1A1A2E]"
              }`}
            > /}
            <Users
            // className={`size-5 ${
            //   showPeople ? "text-[#00D4FF]" : "text-gray-300"
            // }`}
            />

            <span className="text-[10px] mt-1 text-gray-300">People</span>
          </button>
          <span className="text-white/60 text-[10px]">People</span>
        </div> */}

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={shareScreen}
            className={`size-12 rounded-full flex justify-center items-center ${
              isSharingScreen
                ? "shadow-[0_0_12px_rgba(0,212,255,0.4)] bg-[#1A1A2E] border border-[#00D4FF]"
                : "bg-[#1A1A2E]"
            }`}
          >
            <Monitor
              className={`size-5 ${
                isSharingScreen ? "text-[#00D4FF]" : "text-white/70"
              }`}
            />
          </button>

          <span className="text-white/60 text-[10px]">
            {isSharingScreen ? "Sharing" : "Share"}
          </span>
        </div>

        <button className="flex flex-col items-center gap-1">
          <div className="size-10 rounded-full bg-[#1A1A2E] flex items-center justify-center">
            <SmilePlus className="size-5 text-yellow-400" />
          </div>

          <span className="text-[10px] text-white">React</span>
        </button>
      </div>
    </>
  );
}
