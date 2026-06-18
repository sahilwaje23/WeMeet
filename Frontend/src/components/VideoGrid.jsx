import { Mic, MicOff, VideoOff } from "lucide-react";

export default function VideoGrid({
  videoRef,
  remoteVideoRef,
  remoteMuted,
  isMuted,
  cameraOff,
  remoteParticipant,
  username,
}) 

{

  // useEffect(()=>{

    

  // },[])
  return (
    // <div className="grid grid-cols-2 min-h-0 flex-1 gap-6">
    // <div className="grid grid-cols-1 md:grid-cols-2 min-h-0 flex-1 gap-4 md:gap-6 p-2 md:p-0">
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-0 flex-1 gap-4 md:gap-6">
      {/* Remote Video */}
      {/* <div className="relative min-h-0 rounded-xl bg-[#1A1A2E] flex justify-center items-center overflow-hidden">
       */}

      {/* <div className="relative aspect-video rounded-xl bg-[#1A1A2E] flex justify-center items-center overflow-hidden"> */}

      <div
        className="
  relative
  min-h-0
  md:h-full
  aspect-video md:aspect-auto
  rounded-xl
  bg-[#1A1A2E]
  flex justify-center items-center
  overflow-hidden
"
      >

        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="size-9 rounded-full bg-[#1A1A2E]/80 flex absolute right-3 top-3 justify-center items-center">
          {remoteMuted ? (
            <MicOff className="size-4 text-red-500" />
          ) : (
            <Mic className="size-4 text-green-400" />
          )}
        </div>

        <div className="rounded-full bg-[#111111]/70 flex absolute left-3 bottom-3 px-3 py-1.5 items-center gap-1.5">
          <div className="size-2 rounded-full bg-green-400" />
          <span className="font-medium text-white text-sm leading-5">
            {remoteParticipant?.name || "Waiting..."}
          </span>
        </div>
      </div>

      {/* Local Video */}
      {/* <div className="relative min-h-0 rounded-xl bg-[#1A1A2E] flex justify-center items-center overflow-hidden"> */}
      {/* <div className="relative aspect-video rounded-xl bg-[#1A1A2E] flex justify-center items-center overflow-hidden"> */}

      <div
        className="
  relative
  min-h-0
  md:h-full
  aspect-video md:aspect-auto
  rounded-xl
  bg-[#1A1A2E]
  flex justify-center items-center
  overflow-hidden
"
      >
        <div className="bg-[radial-gradient(ellipse_at_center,#1e1a3a_0%,#0d0d1a_100%)] absolute inset-0" />

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {cameraOff && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
            <VideoOff className="size-16 text-white/40" />
          </div>
        )}

        <div className="size-9 rounded-full bg-[#1A1A2E]/80 flex absolute right-3 top-3 justify-center items-center">
          {isMuted ? (
            <MicOff className="size-4 text-red-500" />
          ) : (
            <Mic className="size-4 text-[#00D4FF]" />
          )}
        </div>

        <div className="rounded-full bg-[#111111]/70 flex absolute left-3 bottom-3 px-3 py-1.5 items-center gap-1.5">
          <div className="size-2 rounded-full bg-[#00D4FF]" />
          <span className="font-medium text-white text-sm leading-5">
            {username || "You"}
          </span>
        </div>
      </div>
    </div>
  );
}
