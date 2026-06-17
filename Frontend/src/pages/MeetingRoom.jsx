import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Code,
  Hexagon,
  MessageCircle,
  Mic,
  MicOff,
  MonitorUp,
  PanelRightClose,
  PenTool,
  PhoneOff,
  Smile,
  Users,
  Video,
  VideoOff,
  X,
} from "lucide-react";
// import { button } from "@/components/ui/button";
import socket from "../socket/socket";

export default function App() {
  const { roomId } = useParams();

  const remoteVideoRef = useRef(null);
  const videoRef = useRef(null);

  const localStream = useRef(null);

  const peerConnection = useRef({});

  const [participants, setParticipants] = useState([]);
  const [remoteMuted, setRemoteMuted] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  useEffect(() => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peerConnection.current.onconnectionstatechange = () => {
      console.log("Connection State:", peerConnection.current.connectionState);
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log("ICE State:", peerConnection.current.iceConnectionState);
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStream.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });

        console.log("Tracks added successfully");
        console.log("Local tracks:", stream.getTracks());

        peerConnection.current.ontrack = (event) => {
          console.log("REMOTE TRACK RECEIVED");
          console.log(event);
          console.log(event.streams);

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              roomId,
              candidate: event.candidate,
            });
          }
        };

        // JOIN ONLY AFTER TRACKS EXIST
        socket.emit("join-room", roomId);
      } catch (error) {
        console.log(error);
      }
    };

    startVideo();

    socket.on("offer", async ({ offer }) => {
      console.log("Offer received");

      await peerConnection.current.setRemoteDescription(offer);

      console.log("Remote description set");

      const answer = await peerConnection.current.createAnswer();

      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer", {
        roomId,
        answer,
      });
    });

    socket.on("user-joined", async () => {
      console.log("Another user joined");

      console.log(peerConnection.current.signalingState);

      if (peerConnection.current.signalingState !== "stable") {
        return;
      }

      console.log("Senders:", peerConnection.current.getSenders());

      console.log("Transceivers:", peerConnection.current.getTransceivers());

      const offer = await peerConnection.current.createOffer();

      await peerConnection.current.setLocalDescription(offer);

      socket.emit("offer", {
        roomId,
        offer,
      });
    });

    socket.on("answer", async ({ answer }) => {
      console.log("Answer received");

      await peerConnection.current.setRemoteDescription(answer);

      console.log("Answer remote description set");
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      console.log("ICE candidate received");

      await peerConnection.current.addIceCandidate(candidate);
    });

    socket.on("user-left", () => {
      // chatgpt gave another
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    socket.on("participants", (users) => {
      console.log("Participants:", users);

      setParticipants(users);
    });

    socket.on("mic-status", ({ muted }) => {
      console.log("Remote mic status:", muted);

      setRemoteMuted(muted);
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("user-joined");
      socket.off("ice-candidate");
      socket.off("participants");
      socket.off("user-left");
    };
  }, [roomId]);

  // const toggleMute = () => {
  //   const audioTrack = localStream.current?.getAudioTracks()[0];

  //   if (!audioTrack) return;

  //   audioTrack.enabled = !audioTrack.enabled;

  //   socket.emit("mic-status", {
  //     roomId,
  //     muted: !audioTrack.enabled,
  //   });

  //   console.log("Mic:", audioTrack.enabled ? "ON" : "OFF");
  // };

  const toggleMute = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setIsMuted(!audioTrack.enabled);

    socket.emit("mic-status", {
      roomId,
      muted: !audioTrack.enabled,
    });

    console.log("Mic:", audioTrack.enabled ? "ON" : "OFF");
  };
  // const toggleCamera = () => {
  //   const videoTrack = localStream.current?.getVideoTracks()[0];

  //   if (!videoTrack) return;

  //   videoTrack.enabled = !videoTrack.enabled;

  //   console.log("Camera:", videoTrack.enabled ? "ON" : "OFF");
  // };

  const toggleCamera = () => {
    const videoTrack = localStream.current?.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;

    setIsCameraOff(!videoTrack.enabled);

    console.log("Camera:", videoTrack.enabled ? "ON" : "OFF");
  };

  // const shareScreen = async () => {
  //   try {
  //     const screenStream = await navigator.mediaDevices.getDisplayMedia({
  //       video: true,
  //     });

  //     const screenTrack = screenStream.getVideoTracks()[0];

  //     const sender = peerConnection.current
  //       .getSenders()
  //       .find((s) => s.track && s.track.kind === "video");

  //     await sender.replaceTrack(screenTrack);

  //     if (videoRef.current) {
  //       videoRef.current.srcObject = screenStream;
  //     }

  //     console.log("Screen sharing started");

  //     screenTrack.onended = async () => {
  //       const cameraTrack = localStream.current.getVideoTracks()[0];

  //       await sender.replaceTrack(cameraTrack);

  //       if (videoRef.current) {
  //         videoRef.current.srcObject = localStream.current;
  //       }

  //       console.log("Screen sharing stopped");
  //     };
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      setIsSharingScreen(true);

      const screenTrack = screenStream.getVideoTracks()[0];

      const sender = peerConnection.current
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");

      await sender.replaceTrack(screenTrack);

      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }

      screenTrack.onended = async () => {
        const cameraTrack = localStream.current.getVideoTracks()[0];

        await sender.replaceTrack(cameraTrack);

        if (videoRef.current) {
          videoRef.current.srcObject = localStream.current;
        }

        setIsSharingScreen(false);

        console.log("Screen sharing stopped");
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="bg-[#0D0D0D] flex flex-col w-full h-239">
          <div className="shrink-0 bg-[#111111] flex px-6 justify-between items-center h-12">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-[#7B2FBE] flex justify-center items-center">
                  <Hexagon className="size-4 text-white" />
                </div>
                <span className="font-semibold text-white text-sm leading-5">
                  DevSync — Sprint Call
                </span>
              </div>
              <div className="rounded-full bg-[#1A1A2E] flex px-3 py-1 items-center gap-1.5">
                <span className="size-1.5 animate-pulse rounded-full bg-[#00D4FF]" />
                <span className="font-mono text-[#00D4FF] text-sm leading-5">
                  00:42:17
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#1A1A2E] flex px-3 py-1.5 items-center gap-1.5">
                <Users className="size-3.5 text-[#a1a1a1]" />
                <span className="text-white text-xs leading-4">
                  6 participants
                </span>
              </div>
              <button className="font-medium rounded-lg bg-[#ff6467] text-white text-xs leading-4 px-3 gap-1.5 h-8">
                <PhoneOff className="size-3.5" />
                End Call
              </button>
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div className="flex p-6 flex-col flex-1">
              <div className="grid grid-cols-2 grid-rows-2 flex-1 gap-4">
                <div className="relative shadow-[0_0_24px_rgba(0,212,255,0.45)] rounded-2xl bg-[#1A1A2E] border-[#00D4FF] border-2 border-solid overflow-hidden">
                  {/* <img
                    src="https://images.unsplash.com/photo-1586985564150-11ee04838034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMHZpZGVvJTIwY2FsbHxlbnwxfDB8fHwxNzgwNjg2NjA5fDA&ixlib=rb-4.1.0&q=80&w=400"
                    alt="participant"
                    className="object-cover w-full h-full"
                    data-photoid="ufK-deiLqY8"
                    data-authorname="visuals"
                    data-authorurl="https://unsplash.com/@visuals"
                    data-blurhash="LVBf%]$%M|X9s.ogfkWB0KNHxajE"
                  /> */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="object-cover w-full h-full"
                  />
                  <div className="bg-[#0d0d0d]/85 absolute inset-0" />
                  <div className="flex absolute right-3 top-3 gap-1.5">
                    <div className="size-7 rounded-full bg-[#0D0D0D]/70 flex justify-center items-center">
                      <Mic className="size-3.5 text-[#00D4FF]" />
                    </div>
                  </div>
                  <div className="font-semibold rounded-md bg-[#00D4FF] text-[#0D0D0D] text-[10px] absolute left-3 top-3 px-2 py-0.5">
                    Speaking
                  </div>
                  <div className="flex absolute left-3 bottom-3 items-center gap-2">
                    <span className="size-2 shadow-[0_0_8px_rgba(52,211,153,0.8)] rounded-full bg-emerald-400" />
                    <span className="font-medium text-white text-sm leading-5">
                      Alex Rivera
                    </span>
                  </div>
                </div>
                <div className="relative rounded-2xl bg-[#1A1A2E] border-white/10 border-1 border-solid overflow-hidden">
                  {/* <img
                    src="https://images.unsplash.com/photo-1543269664-7eef42226a21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRldmVsb3BlciUyMHdvcmtpbmclMjBsYXB0b3B8ZW58MXwwfHx8MTc4MDY4NjYwOXww&ixlib=rb-4.1.0&q=80&w=400"
                    alt="participant"
                    className="object-cover w-full h-full"
                    data-photoid="LCcFI_26diA"
                    data-authorname="Brooke Cagle"
                    data-authorurl="https://unsplash.com/@brookecagle"
                    data-blurhash="L24eQPo#F^Rk?uSixtWCOWoy=xba"
                  /> */}
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="object-cover w-full h-full"
                  />
                  <div className="bg-[#0d0d0d]/85 absolute inset-0" />
                  <div className="flex absolute right-3 top-3 gap-1.5">
                    <div className="size-7 rounded-full bg-[#0D0D0D]/70 flex justify-center items-center">
                      {/* <MicOff className="size-3.5 text-[#ff6467]" /> */}
                      {remoteMuted ? (
                        <MicOff className="size-4 text-red-500" />
                      ) : (
                        <Mic className="size-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex absolute left-3 bottom-3 items-center gap-2">
                    <span className="size-2 rounded-full bg-[#708090]" />
                    <span className="font-medium text-white text-sm leading-5">
                      {participants[0] || "Remote User"}
                    </span>
                  </div>
                </div>
                <div className="relative rounded-2xl bg-[#1A1A2E] border-white/10 border-1 border-solid overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9ncmFtbWVyJTIwaGVhZHNob3R8ZW58MXwwfHx8MTc4MDY4NjYwOXww&ixlib=rb-4.1.0&q=80&w=400"
                    alt="participant"
                    className="object-cover w-full h-full"
                    data-photoid="N8lRH2uxih4"
                    data-authorname="The Connected Narrative"
                    data-authorurl="https://unsplash.com/@theconnectednarrative"
                    data-blurhash="LbMQS0n$t,bH~pofW=ay0KWBs9jZ"
                  />
                  <div className="bg-[#0d0d0d]/85 absolute inset-0" />
                  <div className="flex absolute right-3 top-3 gap-1.5">
                    <div className="size-7 rounded-full bg-[#0D0D0D]/70 flex justify-center items-center">
                      <Mic className="size-3.5 text-white" />
                    </div>
                  </div>
                  <div className="flex absolute left-3 bottom-3 items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    <span className="font-medium text-white text-sm leading-5">
                      Jordan Lee
                    </span>
                  </div>
                </div>
                <div className="relative rounded-2xl bg-[#1A1A2E] border-white/10 border-1 border-solid overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1614588876378-b2ffa4520c22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBob21lJTIwb2ZmaWNlJTIwd2ViY2FtfGVufDF8MHx8fDE3ODA2ODY2MDl8MA&ixlib=rb-4.1.0&q=80&w=400"
                    alt="participant"
                    className="object-cover w-full h-full"
                    data-photoid="VAoSKP_ocN0"
                    data-authorname="Waldemar Brandt"
                    data-authorurl="https://unsplash.com/@waldemarbrandt67w"
                    data-blurhash="LCE{hG4o_2D*4mDj?aWB%N-;D%%M"
                  />
                  <div className="bg-[#0d0d0d]/85 absolute inset-0" />
                  <div className="flex absolute right-3 top-3 gap-1.5">
                    <div className="size-7 rounded-full bg-[#0D0D0D]/70 flex justify-center items-center">
                      <VideoOff className="size-3.5 text-[#ff6467]" />
                    </div>
                  </div>
                  <div className="flex absolute left-3 bottom-3 items-center gap-2">
                    <span className="size-2 rounded-full bg-[#708090]" />
                    <span className="font-medium text-white text-sm leading-5">
                      Sam Okafor
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="shrink-0 bg-[#12121F] border-white/10 border-t-0 border-r-0 border-b-0 border-l-1 border-solid flex flex-col w-70">
              <div className="flex p-4 justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-[#00D4FF]" />
                  <span className="font-semibold text-white text-sm leading-5">
                    Participants
                  </span>
                  <span className="rounded-full bg-[#1A1A2E] text-[#a1a1a1] text-[10px] px-2 py-0.5">
                    6
                  </span>
                </div>
                <button className="size-7 rounded-md text-[#a1a1a1] flex justify-center items-center">
                  <PanelRightClose className="size-4" />
                </button>
              </div>
              <div className="overflow-y-auto flex px-3 pb-4 flex-col flex-1 gap-1">
                <div className="rounded-lg flex p-2 items-center gap-3">
                  <div className="size-9 font-semibold rounded-full bg-[#00D4FF] text-[#0D0D0D] text-xs leading-4 flex justify-center items-center">
                    AR
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-white text-sm leading-5">
                      Alex Rivera
                    </span>
                    <span className="text-[#00D4FF] text-[11px]">Host</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mic className="size-4 text-[#a1a1a1]" />
                    <X className="size-4 text-[#a1a1a1]" />
                  </div>
                </div>
                <div className="rounded-lg flex p-2 items-center gap-3">
                  <div className="size-9 font-semibold rounded-full bg-[#7B2FBE] text-white text-xs leading-4 flex justify-center items-center">
                    MC
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-white text-sm leading-5">
                      Maya Chen
                    </span>
                    <span className="text-[#a1a1a1] text-[11px]">Dev</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MicOff className="size-4 text-[#ff6467]" />
                    <X className="size-4 text-[#a1a1a1]" />
                  </div>
                </div>
                <div className="rounded-lg flex p-2 items-center gap-3">
                  <div className="size-9 font-semibold rounded-full bg-emerald-500 text-white text-xs leading-4 flex justify-center items-center">
                    JL
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-white text-sm leading-5">
                      Jordan Lee
                    </span>
                    <span className="text-[#a1a1a1] text-[11px]">Dev</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mic className="size-4 text-[#a1a1a1]" />
                    <X className="size-4 text-[#a1a1a1]" />
                  </div>
                </div>
                <div className="rounded-lg flex p-2 items-center gap-3">
                  <div className="size-9 font-semibold rounded-full bg-amber-500 text-white text-xs leading-4 flex justify-center items-center">
                    SO
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-white text-sm leading-5">
                      Sam Okafor
                    </span>
                    <span className="text-[#a1a1a1] text-[11px]">QA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mic className="size-4 text-[#a1a1a1]" />
                    <X className="size-4 text-[#a1a1a1]" />
                  </div>
                </div>
                <div className="rounded-lg flex p-2 items-center gap-3">
                  <div className="size-9 font-semibold rounded-full bg-rose-500 text-white text-xs leading-4 flex justify-center items-center">
                    PK
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-white text-sm leading-5">
                      Priya Kapoor
                    </span>
                    <span className="text-[#a1a1a1] text-[11px]">Designer</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mic className="size-4 text-[#a1a1a1]" />
                    <X className="size-4 text-[#a1a1a1]" />
                  </div>
                </div>
                <div className="rounded-lg flex p-2 items-center gap-3">
                  <div className="size-9 font-semibold rounded-full bg-sky-500 text-white text-xs leading-4 flex justify-center items-center">
                    DT
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-white text-sm leading-5">
                      Diego Torres
                    </span>
                    <span className="text-[#a1a1a1] text-[11px]">PM</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MicOff className="size-4 text-[#ff6467]" />
                    <X className="size-4 text-[#a1a1a1]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 bg-gray-900 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-6 justify-around items-center h-18">
            <button
              onClick={toggleMute}
              className="flex flex-col items-center gap-1"
            >
              <div className="size-10 shadow-[0_0_14px_rgba(0,212,255,0.5)] transition rounded-full bg-[#1E1E2E] flex justify-center items-center">
                <Mic className="size-4 text-[#00D4FF]" />
              </div>
              <span className="text-gray-400 text-[10px]">Mute</span>
            </button>
            <button
              onClick={toggleMute}
              className="flex flex-col items-center gap-1"
            >
              <div className="size-10 transition rounded-full bg-[#1E1E2E] flex justify-center items-center">
                <Video className="size-4 text-white" />
              </div>
              <span className="text-gray-400 text-[10px]">Camera</span>
            </button>
            <button
              onClick={toggleMute}
              className="flex flex-col items-center gap-1"
            >
              <div className="size-10 transition rounded-full bg-[#1E1E2E] flex justify-center items-center">
                <MonitorUp className="size-4 text-[#7B2FBE]" />
              </div>
              <span className="text-gray-400 text-[10px]">Share</span>
            </button>
            <button
              onClick={toggleMute}
              className="flex flex-col items-center gap-1"
            >
              <div className="size-10 transition rounded-full bg-[#1E1E2E] flex justify-center items-center">
                <PenTool className="size-4 text-white" />
              </div>
              <span className="text-gray-400 text-[10px]">Whiteboard</span>
            </button>
            <button
              onClick={toggleMute}
              className="flex flex-col items-center gap-1"
            >
              <div className="size-10 transition rounded-full bg-[#1E1E2E] flex justify-center items-center">
                <Code className="size-4 text-white" />
              </div>
              <span className="text-gray-400 text-[10px]">Code</span>
            </button>
            <button className="relative flex flex-col items-center gap-1">
              <div className="size-10 transition rounded-full bg-[#1E1E2E] flex justify-center items-center">
                <MessageCircle className="size-4 text-white" />
                <span className="size-4 font-bold rounded-full bg-[#ff6467] text-white text-[9px] flex absolute -right-0.5 -top-0.5 justify-center items-center">
                  3
                </span>
              </div>
              <span className="text-gray-400 text-[10px]">Chat</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="size-12 shadow-[0_0_18px_rgba(255,60,60,0.55)] transition rounded-full bg-[#ff6467] flex justify-center items-center">
                <PhoneOff className="size-5 text-white" />
              </div>
              <span className="font-medium text-white text-[10px]">End</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="size-10 transition rounded-full bg-[#1E1E2E] flex justify-center items-center">
                <Users className="size-4 text-white" />
              </div>
              <span className="text-gray-400 text-[10px]">People</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="size-10 transition rounded-full bg-[#1E1E2E] flex justify-center items-center">
                <Smile className="size-4 text-white" />
              </div>
              <span className="text-gray-400 text-[10px]">React</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
