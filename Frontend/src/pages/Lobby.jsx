import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Blend,
  Camera,
  ChevronDown,
  Clock,
  Hexagon,
  Mic,
  ShieldCheck,
  Upload,
  Video,
  VideoOff,
} from "lucide-react";

export default function Lobby() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [displayName, setDisplayName] = useState("") || "";

  // const handleJoin = () => {
  //   if (!displayName.trim()) {
  //     alert("Enter your name");
  //     return;
  //   }

  //   // localStorage.setItem(
  //   //   "username",
  //   //   displayName.trim()
  //   // );

  //   // navigate(`/room/${roomId}`);

  //   navigate(`/room/${roomId}`, {
  //     state: {
  //       username: displayName.trim(),
  //     },
  //   });
  // };

  const handleJoin = () => {
  if (!displayName.trim()) {
    alert("Enter your name");
    return;
  }

  sessionStorage.setItem(
    "username",
    displayName.trim()
  );

  navigate(`/room/${roomId}`);
};

  return (
    <div>
      <div className="bg-[#0D0D0D] text-white w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-screen bg-[#0D0D0D] w-full">
          <nav className="bg-[#111111] border-[#2A2A2A] border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex px-8 justify-between items-center w-full h-14">
            <div className="flex items-center gap-2">
              <Hexagon className="size-6 text-[#00D4FF]" strokeWidth={2} />
              <span className="font-bold text-white text-lg leading-7 tracking-tight">
                WeMeet
              </span>
            </div>
            <div className="rounded-full bg-[#1A1A2E] border-[#2A2A2A] border-1 border-solid flex px-3 py-1.5 items-center gap-2">
              <ShieldCheck className="size-3.5 text-green-400" />
              <span className="font-medium text-green-400 text-xs leading-4">
                E2E Encrypted
              </span>
            </div>
          </nav>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-4">
                <div className="relative rounded-xl bg-[#1A1A2E] border-[#2A2A2A] border-1 border-solid h-52 overflow-hidden">
                  <div className="bg-[radial-gradient(ellipse_at_center,#1a2a4a_0%,#0d0d1a_70%,#0a0a14_100%)] absolute inset-0" />
                  <div className="flex absolute inset-0 justify-center items-center">
                    <div className="size-16 bg-[linear-gradient(135deg,#00D4FF,#7B2FBE)] rounded-full flex justify-center items-center">
                      <span className="font-bold text-white text-xl leading-7">
                        RK
                      </span>
                    </div>
                  </div>
                  <div className="rounded-full bg-[#111111]/80 flex absolute left-3 top-3 px-2.5 py-1 items-center gap-1.5">
                    <span className="size-2 animate-pulse rounded-full bg-green-400" />
                    <span className="font-medium text-green-400 text-xs leading-4">
                      Camera On
                    </span>
                  </div>
                  <div className="flex absolute right-3 bottom-3 items-center gap-2">
                    <button className="size-9 rounded-full bg-[#1A1A2E]/80 border-[#2A2A2A] border-1 border-solid flex justify-center items-center">
                      <Mic className="size-4 text-[#00D4FF]" />
                    </button>
                    <button className="size-9 rounded-full bg-[#1A1A2E]/80 border-[#2A2A2A] border-1 border-solid flex justify-center items-center">
                      <Video className="size-4 text-[#00D4FF]" />
                    </button>
                  </div>
                </div>
                <div className="rounded-xl bg-[#1A1A2E] border-[#2A2A2A] border-1 border-solid flex p-4 flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="rounded-lg bg-[#222222] flex px-3 py-2.5 justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Mic className="size-4 text-[#00D4FF]" />
                        <span className="text-white/80 text-sm leading-5">
                          Default Microphone
                        </span>
                      </div>
                      <ChevronDown className="size-4 text-white/40" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-end gap-0.5 h-5">
                        <div className="rounded-sm bg-green-400 w-1 h-2" />
                        <div className="rounded-sm bg-green-400 w-1 h-4" />
                        <div className="rounded-sm bg-green-400 w-1 h-3" />
                        <div className="rounded-sm bg-green-400 w-1 h-5" />
                        <div className="rounded-sm bg-green-400 w-1 h-2" />
                      </div>
                      <span className="font-medium text-green-400 text-xs leading-4">
                        Good signal
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#222222] flex px-3 py-2.5 justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Camera className="size-4 text-[#00D4FF]" />
                      <span className="text-white/80 text-sm leading-5">
                        FaceTime HD Camera
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium rounded-sm bg-[#00D4FF]/10 text-[#00D4FF] text-xs leading-4 border-[#00D4FF]/30 border-1 border-solid px-1.5 py-0.5">
                        720p
                      </span>
                      <ChevronDown className="size-4 text-white/40" />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-[#1A1A2E] border-[#2A2A2A] border-1 border-solid flex p-4 flex-col gap-3">
                  <p className="font-medium uppercase text-white/60 text-xs leading-4 tracking-wider">
                    Background
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="cursor-pointer rounded-lg bg-[#222222] border-[#00D4FF] border-2 border-solid flex justify-center items-center h-14">
                      <span className="text-white/60 text-xs leading-4">
                        None
                      </span>
                    </div>
                    <div className="cursor-pointer rounded-lg bg-[#222222] border-[#2A2A2A] border-1 border-solid flex justify-center items-center h-14">
                      <Blend className="size-5 text-white/40" />
                    </div>
                    <div className="cursor-pointer relative rounded-lg border-[#2A2A2A] border-1 border-solid h-14 overflow-hidden">
                      <div className="bg-[#0a1628] absolute inset-0" />
                      <div className="flex absolute inset-0 p-1 items-end">
                        <span className="font-medium text-white/60 text-[9px]">
                          Dev Room
                        </span>
                      </div>
                    </div>
                    <div className="cursor-pointer rounded-lg bg-[#222222] border-[#2A2A2A] border-1 border-dashed flex flex-col justify-center items-center gap-1 h-14">
                      <Upload className="size-4 text-white/30" />
                      <span className="text-white/30 text-[9px]">Upload</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="rounded-xl bg-[#1A1A2E] border-[#2A2A2A] border-1 border-solid flex p-5 flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold rounded-full bg-[#7B2FBE]/15 text-[#7B2FBE] text-xs leading-4 border-[#7B2FBE]/30 border-1 border-solid px-3 py-1">
                        Sprint Call
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-green-400" />
                        <span className="text-green-400 text-xs leading-4">
                          Lobby open
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="leading-tight font-bold text-white text-xl leading-7">
                      DevSync — Sprint Call #14
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-[linear-gradient(135deg,#00D4FF,#7B2FBE)] flex-shrink-0 rounded-full flex justify-center items-center">
                      <span className="font-bold text-white text-xs leading-4">
                        AK
                      </span>
                    </div>
                    <span className="text-white/70 text-sm leading-5">
                      Alex Kim · Host
                    </span>
                  </div>
                  <div className="rounded-full bg-[#222222] flex px-3 py-1.5 items-center gap-2 w-fit">
                    <Clock className="size-3.5 text-[#00D4FF]" />
                    <span className="text-white/70 text-xs leading-4">
                      3:00 PM — 4:00 PM · Today
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <div className="size-8 bg-[linear-gradient(135deg,#00D4FF,#0ea5e9)] z-20 relative rounded-full border-[#333333] border-2 border-solid flex justify-center items-center">
                        <span className="font-bold text-white text-xs leading-4">
                          SR
                        </span>
                      </div>
                      <div className="size-8 bg-[linear-gradient(135deg,#7B2FBE,#a855f7)] z-10 relative rounded-full border-[#333333] border-2 border-solid flex -ml-2 justify-center items-center">
                        <span className="font-bold text-white text-xs leading-4">
                          JD
                        </span>
                      </div>
                    </div>
                    <span className="text-white/60 text-sm leading-5">
                      2 participants joining
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      className="placeholder-white/30 outline-none rounded-xl bg-[#222222] text-white text-sm leading-5 border-[#333333] border-1 border-solid px-4 py-2.5 w-full"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                    />
                  </div>
                  <button
                    onClick={handleJoin}
                    className="bg-[linear-gradient(135deg,#00D4FF,#7B2FBE)] font-semibold rounded-xl text-white text-sm leading-5 flex py-3 justify-center items-center gap-2 w-full"
                  >
                    <Video className="size-4" />
                    <span>Join Now</span>
                  </button>
                  <button className="text-white/50 text-sm leading-5 flex py-2 justify-center items-center gap-2 w-full">
                    <VideoOff className="size-4" />
                    <span>Join without video</span>
                  </button>
                  <div className="border-[#2A2A2A] border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex pt-1 justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-white/40" />
                      <span className="text-white/40 text-xs leading-4">
                        Encrypted
                      </span>
                    </div>
                    <button className="font-medium text-[#00D4FF] text-xs leading-4">
                      Copy invite link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  
}
